/**
 * Telegram Bot Integration
 * Send notifications when new leads are received
 */

interface TelegramMessage {
  name: string
  email: string
  phone?: string
  company?: string
  message: string
  source: string
  timestamp: Date
}

/**
 * Send notification to Telegram bot
 */
export async function sendTelegramNotification(data: TelegramMessage): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    // If Telegram is not configured, skip silently (don't break the form)
    if (!botToken || !chatId) {
      console.warn('Telegram not configured. Skipping notification.')
      return { success: true } // Return success to not break the flow
    }

    // Format message
    const message = formatLeadMessage(data)

    // Send to Telegram API
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error('Telegram API error:', error)
      return { success: false, error: 'Failed to send Telegram notification' }
    }

    return { success: true }
  } catch (error: any) {
    console.error('Telegram notification error:', error)
    return { success: false, error: error.message }
  }
}

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

/**
 * Test Telegram bot connection
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

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/getMe`
    )

    if (!response.ok) {
      return { success: false, error: 'Invalid bot token' }
    }

    const data = await response.json()

    if (data.ok) {
      return { success: true, botInfo: data.result }
    }

    return { success: false, error: 'Failed to get bot info' }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
