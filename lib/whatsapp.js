/**
 * WhatsApp Integration Layer
 * Handles phone number validation and notification sending
 */

import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

/**
 * Normalize and validate phone number
 * @param {string} phone - Phone number in any format
 * @param {string} defaultCountry - Default country code (e.g., 'IN' for India)
 * @returns {object} { valid: boolean, e164: string, formatted: string }
 */
export function normalizePhoneNumber(phone, defaultCountry = 'IN') {
  try {
    if (!phone || typeof phone !== 'string') {
      return { valid: false, error: 'Phone number is required' };
    }
    
    // Clean input
    const cleaned = phone.trim();
    
    // Validate
    if (!isValidPhoneNumber(cleaned, defaultCountry)) {
      return { valid: false, error: 'Invalid phone number format' };
    }
    
    // Parse
    const phoneNumber = parsePhoneNumber(cleaned, defaultCountry);
    
    return {
      valid: true,
      e164: phoneNumber.number, // International format: +919876543210
      formatted: phoneNumber.formatInternational(), // Display format: +91 98765 43210
      country: phoneNumber.country,
      nationalNumber: phoneNumber.nationalNumber
    };
  } catch (error) {
    return { 
      valid: false, 
      error: error.message || 'Invalid phone number' 
    };
  }
}

/**
 * Generate WhatsApp Click-to-Chat URL
 * @param {string} phone - E.164 format phone number
 * @param {string} message - Pre-filled message
 * @returns {string} WhatsApp URL
 */
export function generateWhatsAppUrl(phone, message = '') {
  // Remove + from E.164 format for wa.me
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}${message ? `?text=${encodedMessage}` : ''}`;
}

/**
 * Format feedback message for WhatsApp
 */
export function formatFeedbackMessage(data) {
  const {
    businessName,
    rating,
    customerName = 'Anonymous',
    feedback,
    issues = [],
    timestamp = new Date().toISOString()
  } = data;
  
  const stars = '⭐'.repeat(rating);
  const date = new Date(timestamp).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
  
  let message = `🔔 *New Customer Feedback*\n\n`;
  message += `📍 *Business:* ${businessName}\n`;
  message += `${stars} *Rating:* ${rating}/5\n`;
  message += `👤 *Customer:* ${customerName}\n`;
  message += `📅 *Date:* ${date}\n\n`;
  
  if (issues.length > 0) {
    message += `⚠️ *Issues:* ${issues.join(', ')}\n\n`;
  }
  
  message += `💬 *Feedback:*\n"${feedback}"\n\n`;
  message += `_via SmartReview QR System_`;
  
  return message;
}

/**
 * Send WhatsApp notification (Cloud API)
 * Note: Requires WhatsApp Business API credentials in environment
 */
export async function sendWhatsAppNotification(phone, message) {
  // Check if WhatsApp Cloud API is configured
  const apiToken = process.env.WHATSAPP_API_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  
  if (!apiToken || !phoneNumberId) {
    console.warn('WhatsApp API not configured. Skipping notification.');
    return {
      success: false,
      method: 'none',
      message: 'WhatsApp API credentials not configured'
    };
  }
  
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: phone.replace('+', ''),
          type: 'text',
          text: { body: message }
        })
      }
    );
    
    if (!response.ok) {
      throw new Error(`WhatsApp API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      success: true,
      method: 'cloud_api',
      messageId: data.messages[0].id,
      message: 'Notification sent via WhatsApp Cloud API'
    };
  } catch (error) {
    console.error('WhatsApp notification failed:', error);
    return {
      success: false,
      method: 'cloud_api',
      error: error.message,
      message: 'Failed to send WhatsApp notification'
    };
  }
}

/**
 * Generate click-to-chat fallback link
 * Used when Cloud API is not available
 */
export function generateClickToChatLink(phone, message) {
  const url = generateWhatsAppUrl(phone, message);
  return {
    success: true,
    method: 'click_to_chat',
    url,
    message: 'WhatsApp click-to-chat link generated'
  };
}
