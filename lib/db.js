/**
 * Database Layer - Vercel KV (Redis) Storage
 * Provides CRUD operations for business data
 */

import { kv } from '@vercel/kv';

const BUSINESS_PREFIX = 'business:';
const BUSINESSES_LIST = 'businesses:list';

/**
 * Get all businesses
 */
export async function getAllBusinesses() {
  try {
    const businessIds = await kv.smembers(BUSINESSES_LIST) || [];
    if (businessIds.length === 0) return [];
    
    const businesses = await Promise.all(
      businessIds.map(id => kv.get(`${BUSINESS_PREFIX}${id}`))
    );
    
    return businesses.filter(b => b !== null);
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to fetch businesses');
  }
}

/**
 * Get business by ID
 */
export async function getBusinessById(id) {
  try {
    const business = await kv.get(`${BUSINESS_PREFIX}${id}`);
    return business;
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
}

/**
 * Create new business
 */
export async function createBusiness(businessData) {
  try {
    const id = businessData.id || `biz_${Date.now()}`;
    const business = {
      ...businessData,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Store business
    await kv.set(`${BUSINESS_PREFIX}${id}`, business);
    
    // Add to businesses list
    await kv.sadd(BUSINESSES_LIST, id);
    
    return business;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to create business');
  }
}

/**
 * Update existing business
 */
export async function updateBusiness(id, updates) {
  try {
    const existing = await getBusinessById(id);
    if (!existing) {
      throw new Error('Business not found');
    }
    
    const updated = {
      ...existing,
      ...updates,
      id, // Ensure ID doesn't change
      createdAt: existing.createdAt, // Preserve creation date
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`${BUSINESS_PREFIX}${id}`, updated);
    return updated;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to update business');
  }
}

/**
 * Delete business
 */
export async function deleteBusiness(id) {
  try {
    await kv.del(`${BUSINESS_PREFIX}${id}`);
    await kv.srem(BUSINESSES_LIST, id);
    
    // Clean up related stats
    const statKeys = [
      `stat:${id}:scans`,
      `stat:${id}:reviews`,
      `stat:${id}:shielded`
    ];
    await Promise.all(statKeys.map(key => kv.del(key)));
    
    return true;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to delete business');
  }
}

/**
 * Increment stat counter
 */
export async function incrementStat(businessId, statName) {
  try {
    const key = `stat:${businessId}:${statName}`;
    const newValue = await kv.incr(key);
    return newValue;
  } catch (error) {
    console.error('Stat increment error:', error);
    return 0;
  }
}

/**
 * Get business stats
 */
export async function getBusinessStats(businessId) {
  try {
    const [scans, reviews, shielded] = await Promise.all([
      kv.get(`stat:${businessId}:scans`) || 0,
      kv.get(`stat:${businessId}:reviews`) || 0,
      kv.get(`stat:${businessId}:shielded`) || 0
    ]);
    
    return { scans, reviews, shielded };
  } catch (error) {
    console.error('Stats fetch error:', error);
    return { scans: 0, reviews: 0, shielded: 0 };
  }
}
