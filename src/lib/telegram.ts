'use server'
import { z } from 'zod'

/**
 * Telegram Bot Integration
 * Send notifications when new leads are received
 * 
 * Features:
 * - Input validation with Zod
 * - Timeout handling (10s)
 * - Retry logic for transient failures
 * - Request deduplication
 * - Next.js fetch best practices
 */

// ============================================================================
// Configuration
// ============================================================================

const TELEGRAM_CONFIG = {
  TIMEOUT_MS: 10000, // 10 seconds
  MAX_RETRIES: 2, // Maximum retry attempts
  RETRY_DELAY_MS: 1000, // Initial retry delay
  MAX_MESSAGE_LENGTH: 4096, // Telegram message limit
} as const

// ============================================================================
// Types & Schemas
// ============================================================================

/**
 * Zod schema for Telegram message validation
 */
const TelegramMessageSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email format'),
  phone: z.string().max(20, 'Phone number too long').optional(),
  company: z.string().max(100, 'Company name too long').optional(),
  message: z.string().min(1, 'Message is required').max(1000, 'Message too long'),
  source: z.string().min(1, 'Source is required'),
  timestamp: z.date(),
})

/**
 * Infer TypeScript type from Zod schema
 */
export type TelegramMessage = z.infer<typeof TelegramMessageSchema>

/**
 * Result type for Telegram operations
 */
export interface TelegramResult {
  success: boolean
  error?: string
  errorCode?: 'VALIDATION_ERROR' | 'CONFIG_ERROR' | 'NETWORK_ERROR' | 'TIMEOUT_ERROR' | 'API_ERROR'
}

// ============================================================================
// Request Deduplication
// ============================================================================

const inFlightRequests = new Map<string, Promise<TelegramResult>>()

/**
 * Generate unique key for deduplication
 */
function getRequestKey(data: TelegramMessage): string {
  return `${data.email}-${data.timestamp.getTime()}`
}

// ============================================================================
// Main Functions
// ============================================================================

/**
 * Send notification to Telegram bot with validation, timeout, and retry logic
 * 
 * @param data - Lead data to send
 * @returns Promise with success status and optional error message
 */
export async function sendTelegramNotification(data: TelegramMessage): Promise<TelegramResult> {
  // Step 1: Validate input
  const validation = TelegramMessageSchema.safeParse(data)
  if (!validation.success) {
    const errorMessage = validation.error.issues[0]?.message || 'Invalid input'
    console.error('Telegram validation error:', validation.error.issues)
    return { 
      success: false, 
      error: errorMessage,
      errorCode: 'VALIDATION_ERROR'
    }
  }

  // Step 2: Check environment variables
const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim()
const chatId = process.env.TELEGRAM_CHAT_ID?.trim()

// และเพิ่ม debugging ที่ชัดเจนขึ้น
// console.log('Telegram Environment Check:', {
//   hasBotToken: !!botToken,
//   hasChat: !!chatId,
//   botTokenLength: botToken?.length || 0,
//   chatIdLength: chatId?.length || 0,
//   nodeEnv: process.env.NODE_ENV
// })


  if (!botToken || !chatId) {
    console.warn('Telegram not configured. Skipping notification.')
    return { success: true } // Return success to not break the flow
  }

  // Step 3: Check for in-flight duplicate requests
  const requestKey = getRequestKey(validation.data)
  const existingRequest = inFlightRequests.get(requestKey)
  if (existingRequest) {
    console.log('Deduplicating Telegram request:', requestKey)
    return existingRequest
  }

  // Step 4: Create and track new request
  const requestPromise = sendWithRetry(validation.data, botToken, chatId)
  inFlightRequests.set(requestKey, requestPromise)

  try {
    const result = await requestPromise
    return result
  } finally {
    // Clean up after 5 seconds to allow for near-duplicate detection
    setTimeout(() => {
      inFlightRequests.delete(requestKey)
    }, 5000)
  }
}

/**
 * Send message with retry logic for transient failures
 */
async function sendWithRetry(
  data: TelegramMessage,
  botToken: string,
  chatId: string,
  attempt = 0
): Promise<TelegramResult> {
  try {
    // Format message
    const message = formatLeadMessage(data)

    // Validate message length
    if (message.length > TELEGRAM_CONFIG.MAX_MESSAGE_LENGTH) {
      return {
        success: false,
        error: 'Message too long for Telegram',
        errorCode: 'VALIDATION_ERROR'
      }
    }

    // Create abort controller for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), TELEGRAM_CONFIG.TIMEOUT_MS)
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`

    try {
      // Send to Telegram API with Next.js best practices
      const response = await fetch(telegramApiUrl,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML',
          }),
          signal: controller.signal,
          // Next.js best practice: notifications should never be cached
          cache: 'no-store',
        }
      )

      clearTimeout(timeoutId)

      // Handle response
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Telegram API error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        })

        // Retry on 5xx server errors (transient failures)
        if (response.status >= 500 && attempt < TELEGRAM_CONFIG.MAX_RETRIES) {
          const delay = TELEGRAM_CONFIG.RETRY_DELAY_MS * Math.pow(2, attempt)
          console.log(`Retrying Telegram request (attempt ${attempt + 1}/${TELEGRAM_CONFIG.MAX_RETRIES}) after ${delay}ms`)
          await new Promise(resolve => setTimeout(resolve, delay))
          return sendWithRetry(data, botToken, chatId, attempt + 1)
        }

        return {
          success: false,
          error: `Telegram API error: ${response.status} ${response.statusText}`,
          errorCode: 'API_ERROR'
        }
      }

      return { success: true }
    } catch (fetchError: any) {
      clearTimeout(timeoutId)

      // Handle timeout
      if (fetchError.name === 'AbortError') {
        console.error('Telegram request timeout')
        
        // Retry on timeout
        if (attempt < TELEGRAM_CONFIG.MAX_RETRIES) {
          const delay = TELEGRAM_CONFIG.RETRY_DELAY_MS * Math.pow(2, attempt)
          console.log(`Retrying after timeout (attempt ${attempt + 1}/${TELEGRAM_CONFIG.MAX_RETRIES}) after ${delay}ms`)
          await new Promise(resolve => setTimeout(resolve, delay))
          return sendWithRetry(data, botToken, chatId, attempt + 1)
        }

        return {
          success: false,
          error: 'Request timeout',
          errorCode: 'TIMEOUT_ERROR'
        }
      }

      throw fetchError
    }
  } catch (error: any) {
    console.error('Telegram notification error:', error)
    
    // Retry on network errors
    if (attempt < TELEGRAM_CONFIG.MAX_RETRIES && error.message?.includes('fetch')) {
      const delay = TELEGRAM_CONFIG.RETRY_DELAY_MS * Math.pow(2, attempt)
      console.log(`Retrying after network error (attempt ${attempt + 1}/${TELEGRAM_CONFIG.MAX_RETRIES}) after ${delay}ms`)
      await new Promise(resolve => setTimeout(resolve, delay))
      return sendWithRetry(data, botToken, chatId, attempt + 1)
    }

    return {
      success: false,
      error: error.message || 'Unknown error',
      errorCode: 'NETWORK_ERROR'
    }
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Format lead data into readable Telegram message
 */
function formatLeadMessage(data: TelegramMessage): string {
  const { name, email, phone, company, message, source, timestamp } = data

  const formattedTime = new Intl.DateTimeFormat('th-TH', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Bangkok',
  }).format(timestamp)

  let text = `🎯 <b>New Lead Received!</b>\n\n`
  text += `👤 <b>Name:</b> ${escapeHtml(name)}\n`
  text += `📧 <b>Email:</b> ${escapeHtml(email)}\n`
  
  if (phone) {
    text += `📱 <b>Phone:</b> ${escapeHtml(phone)}\n`
  }
  
  if (company) {
    text += `🏢 <b>Company:</b> ${escapeHtml(company)}\n`
  }
  
  text += `\n💬 <b>Message:</b>\n${escapeHtml(message)}\n\n`
  text += `📍 <b>Source:</b> ${escapeHtml(source)}\n`
  text += `🕐 <b>Time:</b> ${formattedTime}\n\n`
  text += `<i>View in Admin Dashboard</i>`

  return text
}

/**
 * Escape HTML characters for Telegram
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// ============================================================================
// Test & Utilities
// ============================================================================

/**
 * Test Telegram bot connection with timeout
 * 
 * @returns Promise with success status and bot info or error
 */
export async function testTelegramConnection(): Promise<{
  success: boolean
  botInfo?: any
  error?: string
}> {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN

    if (!botToken) {
      return { success: false, error: 'TELEGRAM_BOT_TOKEN not configured' }
    }

    // Create abort controller for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), TELEGRAM_CONFIG.TIMEOUT_MS)

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${botToken}/getMe`,
        {
          signal: controller.signal,
          // Next.js best practice: API checks should not be cached
          cache: 'no-store',
        }
      )

      clearTimeout(timeoutId)

      if (!response.ok) {
        return { success: false, error: 'Invalid bot token' }
      }

      const data = await response.json()

      if (data.ok) {
        return { success: true, botInfo: data.result }
      }

      return { success: false, error: 'Failed to get bot info' }
    } catch (fetchError: any) {
      clearTimeout(timeoutId)

      if (fetchError.name === 'AbortError') {
        return { success: false, error: 'Request timeout' }
      }

      throw fetchError
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
