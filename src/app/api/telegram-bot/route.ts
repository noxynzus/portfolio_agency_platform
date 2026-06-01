import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

/**
 * Telegram Bot API Route
 * Receives lead data and sends notification to Telegram
 * 
 * Features:
 * - POST endpoint for sending notifications
 * - Input validation with Zod
 * - Timeout handling (10s)
 * - Retry logic for transient failures
 * - Next.js API Route best practices
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
 * Zod schema for request body validation
 * Accept ISO string for timestamp (from JSON)
 */
const TelegramRequestSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email format'),
  phone: z.string().max(20, 'Phone number too long').optional(),
  company: z.string().max(100, 'Company name too long').optional(),
  message: z.string().min(1, 'Message is required').max(1000, 'Message too long'),
  source: z.string().min(1, 'Source is required'),
  timestamp: z.string().datetime(), // ISO string from JSON
})

type TelegramRequest = z.infer<typeof TelegramRequestSchema>

// ============================================================================
// API Route Handler
// ============================================================================

/**
 * POST /api/telegram-bot
 * 
 * Send notification to Telegram when new lead is received
 * 
 * @param request - NextRequest with JSON body
 * @returns JSON response with success status
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validation = TelegramRequestSchema.safeParse(body)

    if (!validation.success) {
      console.error('Telegram validation error:', validation.error.issues)
      return NextResponse.json(
        {
          success: false,
          error: validation.error.issues[0]?.message || 'Invalid input',
          errorCode: 'VALIDATION_ERROR',
        },
        { status: 400 }
      )
    }

    const data = validation.data

    // Check environment variables
    const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim()
    const chatId = process.env.TELEGRAM_CHAT_ID?.trim()

    console.log('🔍 Telegram Environment Check:', {
      hasBotToken: !!botToken,
      hasChat: !!chatId,
      botTokenLength: botToken?.length || 0,
      chatIdLength: chatId?.length || 0,
      nodeEnv: process.env.NODE_ENV,
    })

    if (!botToken || !chatId) {
      console.warn('⚠️ Telegram not configured. Skipping notification.')
      return NextResponse.json(
        {
          success: true,
          message: 'Telegram not configured',
        },
        { status: 200 }
      )
    }

    // Convert ISO string to Date for formatting
    const timestamp = new Date(data.timestamp)

    // Send to Telegram with retry logic
    const result = await sendWithRetry(
      {
        ...data,
        timestamp,
      },
      botToken,
      chatId
    )

    if (result.success) {
      return NextResponse.json(result, { status: 200 })
    } else {
      return NextResponse.json(result, { status: 500 })
    }
  } catch (error: any) {
    console.error('❌ Telegram API route error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
        errorCode: 'NETWORK_ERROR',
      },
      { status: 500 }
    )
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

interface TelegramData {
  name: string
  email: string
  phone?: string
  company?: string
  message: string
  source: string
  timestamp: Date
}

interface TelegramResult {
  success: boolean
  error?: string
  errorCode?: 'VALIDATION_ERROR' | 'CONFIG_ERROR' | 'NETWORK_ERROR' | 'TIMEOUT_ERROR' | 'API_ERROR'
}

/**
 * Send message with retry logic for transient failures
 */
async function sendWithRetry(
  data: TelegramData,
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
function formatLeadMessage(data: TelegramData): string {
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
// Test Endpoint (Optional - for debugging)
// ============================================================================

/**
 * GET /api/telegram-bot
 * 
 * Test Telegram bot connection
 */
export async function GET() {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim()
    const chatId = process.env.TELEGRAM_CHAT_ID?.trim()

    if (!botToken) {
      return NextResponse.json(
        { success: false, error: 'TELEGRAM_BOT_TOKEN not configured' },
        { status: 500 }
      )
    }

    if (!chatId) {
      return NextResponse.json(
        { success: false, error: 'TELEGRAM_CHAT_ID not configured' },
        { status: 500 }
      )
    }

    // Test bot connection
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), TELEGRAM_CONFIG.TIMEOUT_MS)

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${botToken}/getMe`,
        {
          signal: controller.signal,
          cache: 'no-store',
        }
      )

      clearTimeout(timeoutId)

      if (!response.ok) {
        return NextResponse.json(
          { success: false, error: 'Invalid bot token' },
          { status: 500 }
        )
      }

      const data = await response.json()

      if (data.ok) {
        return NextResponse.json({
          success: true,
          botInfo: data.result,
          chatId,
        })
      }

      return NextResponse.json(
        { success: false, error: 'Failed to get bot info' },
        { status: 500 }
      )
    } catch (fetchError: any) {
      clearTimeout(timeoutId)

      if (fetchError.name === 'AbortError') {
        return NextResponse.json(
          { success: false, error: 'Request timeout' },
          { status: 500 }
        )
      }

      throw fetchError
    }
  } catch (error: any) {
    console.error('GET /api/telegram-bot error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
