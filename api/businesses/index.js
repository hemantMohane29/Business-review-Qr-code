/**
 * API Endpoint: /api/businesses
 * Methods: GET (list all), POST (create new)
 */

import { getAllBusinesses, createBusiness } from '../../lib/db.js';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    // GET /api/businesses - List all businesses
    if (req.method === 'GET') {
      const businesses = await getAllBusinesses();
      return res.status(200).json({
        success: true,
        data: businesses,
        count: businesses.length
      });
    }
    
    // POST /api/businesses - Create new business
    if (req.method === 'POST') {
      const { name, type, googleUrl, phone, email, apiKey } = req.body;
      
      // Validation
      if (!name || !name.trim()) {
        return res.status(400).json({
          success: false,
          error: 'Business name is required'
        });
      }
      
      if (!googleUrl || !googleUrl.startsWith('http')) {
        return res.status(400).json({
          success: false,
          error: 'Valid Google Review URL is required'
        });
      }
      
      // Validate phone if provided
      if (phone) {
        const phoneRegex = /^[\+]?[0-9]{10,15}$/;
        if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
          return res.status(400).json({
            success: false,
            error: 'Invalid phone number format. Use international format: +919876543210'
          });
        }
      }
      
      const businessData = {
        id: `biz_${Date.now()}`,
        name: name.trim(),
        type: type || 'general',
        googleUrl: googleUrl.trim(),
        phone: phone?.trim() || '',
        email: email?.trim() || '',
        apiKey: apiKey?.trim() || '',
        avatar: getAvatarForType(type || 'general')
      };
      
      const business = await createBusiness(businessData);
      
      return res.status(201).json({
        success: true,
        data: business,
        message: 'Business created successfully'
      });
    }
    
    // Method not allowed
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}

function getAvatarForType(type) {
  const avatars = {
    restaurant: '🍽️',
    cafe: '☕',
    salon: '✂️',
    clinic: '🩺',
    gym: '🏋️',
    retail: '🛍️',
    hotel: '🏨',
    auto: '🚗',
    general: '💼'
  };
  return avatars[type] || avatars.general;
}
