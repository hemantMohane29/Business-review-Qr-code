# 🚀 Deployment Guide - Business Review QR System v2.0

**Complete step-by-step guide to deploy your system to production**

---

## ✅ Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] GitHub repository with all code pushed
- [ ] Vercel account (free tier works)
- [ ] Admin panel tested locally
- [ ] At least one test business created
- [ ] QR code generated and scanned successfully

---

## 📋 Step 1: Install Dependencies (2 minutes)

```powershell
# Navigate to project directory
cd "C:\Users\Asus\Desktop\Business Review QR"

# Install all dependencies
npm install
```

**Expected dependencies:**
- `@vercel/kv` - Database client
- `libphonenumber-js` - Phone validation

**Verify installation:**
```powershell
npm list @vercel/kv libphonenumber-js
```

---

## 🗄️ Step 2: Create Vercel KV Database (5 minutes)

### Option A: Via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Select your project (or create new)
3. Click **Storage** tab in left sidebar
4. Click **Create Database**
5. Select **KV (Redis)**
6. Name: `business-review-db`
7. Region: Choose closest to your users
8. Click **Create**

### Option B: Via Vercel CLI

```powershell
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Link project
vercel link

# Create KV store
vercel kv create business-review-db
```

### ✅ Verify Environment Variables

After creating the database, these environment variables are automatically added:

- `KV_URL`
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`  
- `KV_REST_API_READ_ONLY_TOKEN`

Check them at: **Project Settings → Environment Variables**

---

## 📱 Step 3: (Optional) Setup WhatsApp Cloud API (15 minutes)

### Why WhatsApp Cloud API?

✅ **With API:** Instant notifications to business WhatsApp  
⚠️ **Without API:** Click-to-chat link (manual messaging)

### Setup Instructions

1. Go to https://developers.facebook.com/
2. Create or select Meta Business App
3. Add **WhatsApp** product
4. Navigate to **WhatsApp → API Setup**
5. Copy credentials:
   - **Phone Number ID**: `whatsapp_phone_number_id`
   - **Access Token**: Click "Generate token"

### Add to Vercel Environment Variables

Go to **Project Settings → Environment Variables** and add:

```
WHATSAPP_API_TOKEN=EAAB...your_token
WHATSAPP_PHONE_NUMBER_ID=123456789
```

### Test WhatsApp Integration

```powershell
# Test API endpoint locally
vercel dev

# In another terminal, test feedback submission
curl -X POST http://localhost:3000/api/feedback `
  -H "Content-Type: application/json" `
  -d "{\"businessId\":\"biz_123\",\"rating\":2,\"feedback\":\"Test message\",\"customerName\":\"Test User\",\"customerContact\":\"+919876543210\"}"
```

---

## 🌐 Step 4: Deploy to Production (3 minutes)

### First-Time Deployment

```powershell
# Commit all changes
git add .
git commit -m "Deploy Business Review QR System v2.0"

# Push to GitHub
git push origin main

# Deploy to Vercel
vercel --prod
```

### Subsequent Deployments

```powershell
git add .
git commit -m "Update: your changes here"
git push origin main
# Vercel auto-deploys on push!
```

### ✅ Verify Deployment

1. Check deployment status at https://vercel.com/dashboard
2. Note your production URL (e.g., `https://your-app.vercel.app`)
3. Test homepage loads
4. Test admin panel loads

---

## 📊 Step 5: Migrate Existing Data (5 minutes)

### If You Have Existing localStorage Data

1. Open admin panel: `https://your-app.vercel.app/admin.html`
2. Login with your PIN
3. Go to **Settings** tab
4. Click **📤 Migrate to Database** button
5. Wait for success message

### Migration Results

- **Created**: New businesses added to database
- **Skipped**: Already exists in database
- **Failed**: Check console for errors

### Verify Migration

```powershell
# Test API endpoint
curl https://your-app.vercel.app/api/businesses
```

Should return JSON array of your businesses.

---

## 🧪 Step 6: Complete Testing Workflow (10 minutes)

### Test 1: Create Business

1. Open admin panel
2. Click **Businesses** → **Add Business**
3. Fill in:
   - Name: "Test Restaurant"
   - Type: Restaurant
   - Google URL: Your actual Google Review URL
   - Phone: +919876543210 (with country code)
4. Click **Save**
5. Verify business appears in list

### Test 2: Generate QR Code

1. Click **QR Code** tab
2. Verify QR code displays
3. Click **Download QR**
4. Check PNG file downloaded
5. Click **Copy Link**
6. Paste in browser - should be short URL like:
   ```
   https://your-app.vercel.app/customer-review.html?businessId=biz_1234567890
   ```

### Test 3: Mobile Device Scan

**Critical Test - This verifies cross-device sync!**

1. Print QR code or display on computer screen
2. Scan with mobile phone camera
3. Verify:
   - ✅ Correct business name displays (not "Demo Business")
   - ✅ Business type/category correct
   - ✅ Logo/avatar correct
4. Submit 5-star review:
   - Select keywords
   - Generate review
   - Verify review text appears
5. Submit 2-star review:
   - Write feedback
   - Click WhatsApp button
   - Verify WhatsApp opens with pre-filled message

### Test 4: WhatsApp Notifications

1. Submit feedback with 2-star rating
2. Check business WhatsApp for notification
3. **With API**: Message arrives instantly
4. **Without API**: Click-to-chat link opens WhatsApp

### Test 5: Statistics Tracking

1. Return to admin panel
2. Go to **Overview** tab
3. Verify stats updated:
   - **Scans**: Incremented
   - **Reviews**: Incremented (if 5-star submitted)
   - **Shielded**: Incremented (if feedback submitted)

---

## 🐛 Step 7: Troubleshooting

### Issue: "Demo Business" still showing on mobile

**Cause**: Mobile device is using cached data or localStorage  
**Solution**:

1. Clear browser cache on mobile
2. Re-scan QR code
3. Verify URL has `?businessId=` parameter
4. Check API endpoint manually:
   ```
   https://your-app.vercel.app/api/businesses/biz_YOUR_ID
   ```

### Issue: WhatsApp not working

**Cause**: Phone number format incorrect or API not configured  
**Solution**:

1. Verify phone format: `+919876543210` (country code required)
2. Check WhatsApp environment variables in Vercel
3. Test with click-to-chat fallback (works without API)

### Issue: Database not saving businesses

**Cause**: Vercel KV not linked or env vars missing  
**Solution**:

1. Go to Vercel Dashboard → Storage
2. Verify KV database exists and is linked
3. Check Environment Variables are set
4. Redeploy: `vercel --prod --force`

### Issue: API returning 500 errors

**Cause**: Missing dependencies or runtime error  
**Solution**:

1. Check Vercel logs: Dashboard → Deployments → View Function Logs
2. Verify `package.json` has all dependencies
3. Test API locally:
   ```powershell
   vercel dev
   # Test: http://localhost:3000/api/businesses
   ```

### Issue: Migration failed

**Cause**: Network error or API endpoint unreachable  
**Solution**:

1. Check browser console for error details
2. Verify deployment succeeded
3. Test API endpoint manually in browser
4. Retry migration after fixing API issues

---

## 📈 Step 8: Monitor & Maintain

### Daily Monitoring

- Check Vercel Analytics: Dashboard → Analytics
- Monitor function execution times
- Check error rate in logs

### Weekly Maintenance

- Review feedback submissions
- Check WhatsApp notifications working
- Verify QR codes still functional
- Test on different devices

### Monthly Tasks

- Update dependencies: `npm update`
- Review Vercel KV usage
- Backup database (export businesses)
- Test disaster recovery

---

## 🔒 Security Best Practices

### Admin Panel Security

- Change default PIN immediately
- Use strong PIN (8+ characters)
- Never share PIN publicly
- Lock panel when not in use

### Database Security

- Vercel KV uses TLS encryption
- API tokens auto-rotate
- No SQL injection risk (NoSQL database)
- Rate limiting enabled by default

### WhatsApp Security

- Store API token in environment variables only
- Never commit tokens to git
- Rotate tokens monthly
- Use read-only tokens where possible

---

## 📞 Support & Resources

### Documentation

- **Setup Guide**: `docs/BACKEND_SETUP_GUIDE.md`
- **Implementation**: `docs/IMPLEMENTATION_SUMMARY.md`
- **Status**: `docs/FINAL_IMPLEMENTATION_STATUS.md`
- **Audit**: `COMPREHENSIVE_AUDIT_AND_FIX.md`

### External Resources

- [Vercel KV Docs](https://vercel.com/docs/storage/vercel-kv)
- [WhatsApp Cloud API Docs](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [libphonenumber-js Docs](https://github.com/catamphetamine/libphonenumber-js)

### Common Commands

```powershell
# Local development
vercel dev

# Deploy to production
vercel --prod

# View logs
vercel logs

# Check environment variables
vercel env ls

# Link different project
vercel link
```

---

## ✅ Post-Deployment Checklist

After successful deployment, verify:

- [ ] Admin panel accessible at `/admin.html`
- [ ] Customer review page at `/customer-review.html`
- [ ] API endpoints responding (test `/api/businesses`)
- [ ] Business creation works
- [ ] QR code generation works
- [ ] Mobile scan shows correct business name
- [ ] WhatsApp notifications working
- [ ] Statistics tracking correctly
- [ ] All tests passing
- [ ] No console errors
- [ ] SSL certificate active (HTTPS)

---

## 🎯 Success Criteria

Your deployment is successful when:

1. ✅ Mobile devices fetch business from API
2. ✅ Correct business names display (no "Demo Business")
3. ✅ Cross-device synchronization working
4. ✅ WhatsApp notifications deliver
5. ✅ Phone numbers validated correctly
6. ✅ Statistics track across devices
7. ✅ No errors in production logs
8. ✅ All devices see same data
9. ✅ QR codes scannable and functional
10. ✅ Google review flow complete

---

**Deployment Guide Version:** 2.0.0  
**Last Updated:** 2026-10-30  
**Estimated Total Time:** 40 minutes  
**Status:** Production Ready ✅

**Need Help?** Check logs at Vercel Dashboard → Deployments → Function Logs
