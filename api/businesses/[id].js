/**
 * API Endpoint: /api/businesses/[id]
 * Methods: GET (get one), PUT (update), DELETE (delete)
 */

import { getBusinessById, updateBusiness, deleteBusiness, getBusinessStats } from '../../lib/db.js';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
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
    // GET /api/businesses/:id - Get single business
    if (req.method === 'GET') {
      const business = await getBusinessById(id);
      
      if (!business) {
        return res.status(404).json({
          success: false,
          error: 'Business not found'
        });
      }
      
      // Optionally include stats
      const includeStats = req.query.stats === 'true';
      if (includeStats) {
        const stats = await getBusinessStats(id);
        business.stats = stats;
      }
      
      return res.status(200).json({
        success: true,
        data: business
      });
    }
    
    // PUT /api/businesses/:id - Update business
    if (req.method === 'PUT') {
      const updates = req.body;
      
      // Don't allow changing ID or creation date
      delete updates.id;
      delete updates.createdAt;
      
      const updated = await updateBusiness(id, updates);
      
      return res.status(200).json({
        success: true,
        data: updated,
        message: 'Business updated successfully'
      });
    }
    
    // DELETE /api/businesses/:id - Delete business
    if (req.method === 'DELETE') {
      await deleteBusiness(id);
      
      return res.status(200).json({
        success: true,
        message: 'Business deleted successfully'
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
