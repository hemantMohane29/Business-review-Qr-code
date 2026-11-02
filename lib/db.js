/**
 * Database Layer - Upstash Redis Storage
 * Provides CRUD operations for business data
 */

import { Redis } from '@upstash/redis';

// Initialize Redis client with Vercel environment variables
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN,
});

const BUSINESS_PREFIX = 'business:';
const BUSINESSES_LIST = 'businesses:list';

/**
 * Get all businesses
 */
export async function getAllBusinesses() {
  try {
    const businessIds = await redis.smembers(BUSINESSES_LIST) || [];
    if (businessIds.length === 0) return [];
    
    const businesses = await Promise.all(
      businessIds.map(id => redis.get(`${BUSINESS_PREFIX}${id}`))
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
    const business = await redis.get(`${BUSINESS_PREFIX}${id}`);
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
    await redis.set(`${BUSINESS_PREFIX}${id}`, business);
    
    // Add to businesses list
    await redis.sadd(BUSINESSES_LIST, id);
    
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
    
    await redis.set(`${BUSINESS_PREFIX}${id}`, updated);
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
    await redis.del(`${BUSINESS_PREFIX}${id}`);
    await redis.srem(BUSINESSES_LIST, id);
    
    // Clean up related stats
    const statKeys = [
      `stat:${id}:scans`,
      `stat:${id}:reviews`,
      `stat:${id}:shielded`
    ];
    await Promise.all(statKeys.map(key => redis.del(key)));
    
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
    const newValue = await redis.incr(key);
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
      redis.get(`stat:${businessId}:scans`) || 0,
      redis.get(`stat:${businessId}:reviews`) || 0,
      redis.get(`stat:${businessId}:shielded`) || 0
    ]);
    
    return { scans, reviews, shielded };
  } catch (error) {
    console.error('Stats fetch error:', error);
    return { scans: 0, reviews: 0, shielded: 0 };
  }
}

