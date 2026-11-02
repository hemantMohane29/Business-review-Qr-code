/**
 * API Endpoint: /api/stats/[id]
 * Method: GET - Get business statistics
 * Method: POST - Increment stat counter
 */

import { getBusinessStats, incrementStat } from '../../lib/db.js';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({
      success: false,
      error: 'Business ID is required'
    });
  }
  
  try {
    // GET /api/stats/:id - Get statistics
    if (req.method === 'GET') {
      const stats = await getBusinessStats(id);
      
      return res.status(200).json({
        success: true,
        data: stats
      });
    }
    
    // POST /api/stats/:id - Increment counter
    if (req.method === 'POST') {
      const { stat } = req.body;
      
      if (!stat || !['scans', 'reviews', 'shielded'].includes(stat)) {
        return res.status(400).json({
          success: false,
          error: 'Valid stat name required (scans, reviews, shielded)'
        });
      }
      
      const newValue = await incrementStat(id, stat);
      
      return res.status(200).json({
        success: true,
        data: {
          stat,
          value: newValue
        }
      });
    }
    
    // Method not allowed
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
    
  } catch (error) {
    console.error('Stats API Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}
