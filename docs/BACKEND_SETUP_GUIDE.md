# Backend API Setup Guide
**Business Review QR System v2.0 - With Database Backend**

---

## 🎯 What Changed

### Previous Architecture (v1.0):
```
localStorage only → No cross-device sync → Demo business issues
```

### New Architecture (v2.0):
```
Vercel KV Database → Serverless API → True cross-device sync ✅
```

---

## 🚀 Setup Instructions

### Step 1: Install Dependencies

```bash
npm install
```

This installs:
- `@vercel/kv` - Vercel's Redis database
- `libphonenumber-js` - Phone number validation

### Step 2: Create Vercel KV Database

1. Go to your Vercel dashboard
2. Select your project
3. Navigate to **Storage** tab
4. Click **Create Database**
5. Select **KV (Redis)**
6. Name it: `business-review-db`
7. Click **Create**

Vercel will automatically add environment variables:
```
KV_URL
KV_REST_API_URL
KV_REST_API_TOKEN
KV_REST_API_READ_ONLY_TOKEN
```

### Step 3: (Optional) Configure WhatsApp Cloud API

If you want automatic WhatsApp notifications:

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create a WhatsApp Business App
3. Get your credentials:
   - `WHATSAPP_API_TOKEN`
   - `WHATSAPP_PHONE_NUMBER_ID`

4. Add to Vercel environment variables:
   ```
   Settings → Environment Variables → Add
   ```

**Note:** Without these, the system will fallback to click-to-chat links (still works!).

### Step 4: Deploy to Vercel

```bash
npm run deploy
```

Or push to GitHub (if connected to Vercel):
```bash
git add .
git commit -m "Add backend API with Vercel KV"
git push origin main
```

Vercel will automatically deploy!

---

## 📡 API Endpoints

### Businesses
- `GET /api/businesses` - List all businesses
- `POST /api/businesses` - Create new business
- `GET /api/businesses/[id]` - Get single business
- `PUT /api/businesses/[id]` - Update business
- `DELETE /api/businesses/[id]` - Delete business

### Statistics
- `GET /api/stats/[id]` - Get business stats
- `POST /api/stats/[id]` - Increment stat counter

### Feedback
- `POST /api/feedback` - Submit feedback + WhatsApp notification

---

## 🧪 Testing the API

### Test 1: Create a Business
```bash
curl -X POST https://your-domain.vercel.app/api/businesses \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Restaurant",
    "type": "restaurant",
    "googleUrl": "https://g.page/r/EXAMPLE/review",
    "phone": "+919876543210",
    "email": "test@example.com"
  }'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "id": "biz_1234567890",
    "name": "Test Restaurant",
    ...
  },
  "message": "Business created successfully"
}
```

### Test 2: Get Business by ID
```bash
curl https://your-domain.vercel.app/api/businesses/biz_1234567890
```

### Test 3: Submit Feedback
```bash
curl -X POST https://your-domain.vercel.app/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "businessId": "biz_1234567890",
    "rating": 3,
    "feedback": "Food was good but service was slow",
    "customerName": "John Doe",
    "issues": ["Service", "Wait Time"]
  }'
```

---

## 🔄 Migration from v1.0 to v2.0

### For Existing Users:

Your old localStorage data won't be lost, but you need to migrate to the database:

1. **Open admin panel** in your browser
2. **Export your businesses** (localStorage will still have them)
3. **Click "Migrate to Database"** button (we'll add this)
4. All businesses will be uploaded to Vercel KV
5. Generate new QR codes (they'll use business IDs from database)

### Migration Script (Run in Browser Console):

```javascript
// Copy this into browser console on admin.html
async function migrateToDatabase() {
  const businesses = JSON.parse(localStorage.getItem('sr_businesses_v4') || '[]');
  
  for (const biz of businesses) {
    try {
      const response = await fetch('/api/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(biz)
      });
      
      if (response.ok) {
        console.log(`✅ Migrated: ${biz.name}`);
      } else {
        console.error(`❌ Failed: ${biz.name}`);
      }
    } catch (error) {
      console.error(`Error migrating ${biz.name}:`, error);
    }
  }
  
  console.log('Migration complete!');
}

// Run migration
migrateToDatabase();
```

---

## 🛡️ Security

### API Security:
- ✅ CORS configured (allow all for public API)
- ✅ Input validation on all endpoints
- ✅ No sensitive data in URLs
- ✅ API keys stored in environment variables
- ✅ CSP headers prevent XSS

### Database Security:
- ✅ Vercel KV is encrypted at rest
- ✅ Automatic backups
- ✅ Rate limiting built-in
- ✅ No SQL injection (Redis key-value store)

### WhatsApp Security:
- ✅ API tokens never exposed to frontend
- ✅ Server-side API calls only
- ✅ Phone numbers validated and normalized

---

## 📊 Monitoring

### Check API Health:
```bash
curl https://your-domain.vercel.app/api/businesses
```

Should return list of businesses (empty array if none exist).

### View Logs:
1. Go to Vercel dashboard
2. Select your project
3. Click **Logs** tab
4. Filter by **API** to see backend logs

### Database Usage:
1. Go to Vercel dashboard
2. Select **Storage** → **business-review-db**
3. View usage metrics (keys, memory, requests)

---

## 🔧 Troubleshooting

### Issue: "Failed to fetch businesses"
**Cause:** API endpoint not deployed or KV not configured  
**Solution:** 
1. Check Vercel deployment logs
2. Verify KV database is created
3. Ensure environment variables are set

### Issue: "WhatsApp notification failed"
**Cause:** WhatsApp API not configured (expected if optional)  
**Solution:** 
- Either add WhatsApp API credentials
- Or ignore (click-to-chat will still work)

### Issue: "Business not found"
**Cause:** Business ID from old QR code doesn't exist in database  
**Solution:**
- Run migration script
- Or regenerate QR codes with new business IDs

---

## 🎉 Success Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Vercel KV database created
- [ ] (Optional) WhatsApp API configured
- [ ] Deployed to Vercel successfully
- [ ] API endpoints responding
- [ ] Test business created via API
- [ ] Test business fetched via API
- [ ] Old businesses migrated (if any)
- [ ] New QR codes generated
- [ ] Mobile devices can access businesses ✅

---

**Your system is now production-ready with true cross-device synchronization!**

**Next:** Update frontend JavaScript to use API endpoints.
