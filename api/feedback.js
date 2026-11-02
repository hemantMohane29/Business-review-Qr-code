/**
 * API Endpoint: /api/feedback
 * Method: POST - Submit customer feedback and send WhatsApp notification
 */

import { getBusinessById, incrementStat } from '../lib/db.js';
import { 
  normalizePhoneNumber, 
  formatFeedbackMessage, 
  sendWhatsAppNotification,
  generateClickToChatLink 
} from '../lib/whatsapp.js';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }
  
  try {
    const {
      businessId,
      rating,
      feedback,
      customerName,
      customerContact,
      issues
    } = req.body;
    
    // Validation
    if (!businessId) {
      return res.status(400).json({
        success: false,
        error: 'Business ID is required'
      });
    }
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Valid rating (1-5) is required'
      });
    }
    
    if (!feedback || !feedback.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Feedback message is required'
      });
    }
    
    // Get business details
    const business = await getBusinessById(businessId);
    
    if (!business) {
      return res.status(404).json({
        success: false,
        error: 'Business not found'
      });
    }
    
    // Increment shielded stat (feedback captured before Google)
    await incrementStat(businessId, 'shielded');
    
    // Prepare WhatsApp notification
    let whatsappResult = null;
    
    if (business.phone) {
      // Normalize phone number
      const phoneValidation = normalizePhoneNumber(business.phone);
      
      if (phoneValidation.valid) {
        // Format message
        const message = formatFeedbackMessage({
          businessName: business.name,
          rating,
          customerName: customerName || 'Anonymous',
          feedback: feedback.trim(),
          issues: issues || [],
          timestamp: new Date().toISOString()
        });
        
        // Try to send via WhatsApp Cloud API
        whatsappResult = await sendWhatsAppNotification(
          phoneValidation.e164,
          message
        );
        
        // If Cloud API not configured, generate click-to-chat link
        if (!whatsappResult.success && whatsappResult.method === 'none') {
          whatsappResult = generateClickToChatLink(
            phoneValidation.e164,
            message
          );
        }
      } else {
        whatsappResult = {
          success: false,
          error: phoneValidation.error,
          message: 'Invalid business phone number'
        };
      }
    }
    
    // Return response
    return res.status(200).json({
      success: true,
      message: 'Feedback received successfully',
      whatsapp: whatsappResult,
      data: {
        businessName: business.name,
        rating,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Feedback API Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to process feedback'
    });
  }
}
