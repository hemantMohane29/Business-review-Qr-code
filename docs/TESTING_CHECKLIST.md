# 🧪 Testing Checklist - Business Review QR System v2.0

**Complete testing guide to ensure system works flawlessly**

---

## 📋 Overview

This checklist covers all testing scenarios to verify your system is production-ready. Complete each section before going live with real customers.

**Estimated Time:** 30-45 minutes  
**Required:** Desktop computer + Mobile device

---

## ✅ Section 1: API Endpoint Testing (10 minutes)

### Test 1.1: List All Businesses

```powershell
# PowerShell
Invoke-RestMethod -Uri "https://your-domain.vercel.app/api/businesses" -Method GET
```

**Expected Result:**
```json
{
  "success": true,
  "data": [...businesses array...],
  "count": 2
}
```

**Pass Criteria:**
- [ ] Status code: 200
- [ ] Returns JSON array
- [ ] Count matches actual businesses
- [ ] Each business has: id, name, type, googleUrl

### Test 1.2: Get Single Business

```powershell
Invoke-RestMethod -Uri "https://your-domain.vercel.app/api/businesses/biz_123" -Method GET
```

**Expected Result:**
```json
{
  "success": true,
  "data": {
    "id": "biz_123",
    "name": "Test Restaurant",
    "type": "restaurant",
    "googleUrl": "https://...",
    "phone": "+919876543210"
  }
}
```

**Pass Criteria:**
- [ ] Status code: 200
- [ ] Returns single business object
- [ ] All fields present and correct
- [ ] Phone number in E.164 format

### Test 1.3: Create New Business

```powershell
$body = @{
  name = "API Test Restaurant"
  type = "restaurant"
  googleUrl = "https://g.page/r/EXAMPLE/review"
  phone = "+919876543210"
  email = "test@example.com"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://your-domain.vercel.app/api/businesses" -Method POST -Body $body -ContentType "application/json"
```

**Expected Result:**
```json
{
  "success": true,
  "data": {
    "id": "biz_1730...",
    "name": "API Test Restaurant",
    ...
  }
}
```

**Pass Criteria:**
- [ ] Status code: 201
- [ ] Returns created business with auto-generated ID
- [ ] ID starts with "biz_"
- [ ] Timestamp in ID is recent

### Test 1.4: Update Business

```powershell
$body = @{
  name = "Updated Restaurant Name"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://your-domain.vercel.app/api/businesses/biz_123" -Method PUT -Body $body -ContentType "application/json"
```

**Pass Criteria:**
- [ ] Status code: 200
- [ ] Returns updated business
- [ ] Changes applied correctly
- [ ] Other fields unchanged

### Test 1.5: Delete Business

```powershell
Invoke-RestMethod -Uri "https://your-domain.vercel.app/api/businesses/biz_123" -Method DELETE
```

**Pass Criteria:**
- [ ] Status code: 200
- [ ] Returns success message
- [ ] Business no longer in list
- [ ] GET request returns 404

### Test 1.6: Submit Feedback

```powershell
$body = @{
  businessId = "biz_123"
  rating = 2
  feedback = "Test feedback message"
  customerName = "Test User"
  customerContact = "+919876543210"
  issues = @("service", "cleanliness")
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://your-domain.vercel.app/api/feedback" -Method POST -Body $body -ContentType "application/json"
```

**Pass Criteria:**
- [ ] Status code: 200
- [ ] Returns success message
- [ ] WhatsApp notification sent (if configured)
- [ ] Feedback stored in system

### Test 1.7: Increment Statistics

```powershell
$body = @{
  stat = "scans"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://your-domain.vercel.app/api/stats/biz_123" -Method POST -Body $body -ContentType "application/json"
```

**Pass Criteria:**
- [ ] Status code: 200
- [ ] Counter incremented
- [ ] GET /api/stats/biz_123 shows new count

---

## 🖥️ Section 2: Admin Panel Testing (10 minutes)

### Test 2.1: Login

1. Open `https://your-domain.vercel.app/admin.html`
2. Enter PIN
3. Click Unlock

**Pass Criteria:**
- [ ] Lock screen displays
- [ ] Correct PIN unlocks
- [ ] Incorrect PIN shows error
- [ ] Dashboard loads after unlock

### Test 2.2: Create Business

1. Click **Businesses** tab
2. Click **Add Business** button
3. Fill form:
   - Name: "Test Café"
   - Type: Café
   - Google URL: Valid review link
   - Phone: +919876543210
   - Email: test@cafe.com
4. Click **Save**

**Pass Criteria:**
- [ ] Form validation works
- [ ] Business saved successfully
- [ ] Toast notification shows
- [ ] Business appears in list
- [ ] Business marked as active

### Test 2.3: Edit Business

1. Click existing business in list
2. Edit name
3. Click **Save**

**Pass Criteria:**
- [ ] Form populates with current data
- [ ] Changes save successfully
- [ ] List updates immediately
- [ ] QR code updates with new name

### Test 2.4: Delete Business

1. Click business to edit
2. Click **Delete** button
3. Confirm deletion

**Pass Criteria:**
- [ ] Confirmation dialog shows
- [ ] Business removed from list
- [ ] Stats cleared
- [ ] If only business, can still add new one

### Test 2.5: Generate QR Code

1. Click **QR Code** tab
2. Select business
3. Wait for QR to generate

**Pass Criteria:**
- [ ] QR code displays correctly
- [ ] Business name shown above QR
- [ ] URL shown below QR
- [ ] URL format: `?businessId=biz_123`

### Test 2.6: Download QR Code

1. Click **Download QR** button

**Pass Criteria:**
- [ ] PNG file downloads
- [ ] Filename format: `BusinessName_QR_2026-10-30.png`
- [ ] Image is clear and scannable
- [ ] File size reasonable (< 100KB)

### Test 2.7: Copy Review Link

1. Click **Copy Link** button

**Pass Criteria:**
- [ ] Toast shows "Copied!"
- [ ] Clipboard contains full URL
- [ ] URL format correct
- [ ] URL opens correctly in browser

### Test 2.8: Test Review Link

1. Click **Test Link** button

**Pass Criteria:**
- [ ] Opens in new tab
- [ ] Customer review page loads
- [ ] Correct business displays
- [ ] No errors in console

### Test 2.9: Statistics Display

1. Go to **Overview** tab
2. Check stats

**Pass Criteria:**
- [ ] Scans counter displays
- [ ] Reviews counter displays
- [ ] Shielded counter displays
- [ ] Numbers are accurate

### Test 2.10: Settings & Migration

1. Go to **Settings** tab
2. Click **Migrate to Database** button

**Pass Criteria:**
- [ ] Migration status shows
- [ ] Success message displays
- [ ] Businesses count correct
- [ ] No duplicate businesses created

---

## 📱 Section 3: Mobile Device Testing (15 minutes)

**CRITICAL:** This section verifies the main bug fix (Demo Business issue)

### Test 3.1: QR Code Scan - Happy Path

**Setup:**
1. Print QR code or display on computer screen
2. Use real mobile device (iPhone or Android)
3. Open camera app

**Steps:**
1. Scan QR code with mobile camera
2. Tap notification to open link
3. Wait for page to load

**Pass Criteria:**
- [ ] Link opens in mobile browser
- [ ] Loading spinner shows briefly
- [ ] **CORRECT business name displays** (not "Demo Business")
- [ ] Business type/category correct
- [ ] Logo/avatar correct
- [ ] No console errors (check mobile dev tools)

### Test 3.2: 5-Star Review Flow (Mobile)

1. Tap 5 stars
2. Wait for keyword selection
3. Select 3-5 keywords
4. Tap **Generate Review**
5. Wait for AI generation
6. Edit review if needed
7. Tap **Continue**
8. Tap **Copy & Post to Google**

**Pass Criteria:**
- [ ] Star selection animates smoothly
- [ ] Confetti shows on 5-star tap
- [ ] Keywords load correctly
- [ ] Review generates successfully
- [ ] Review text is readable and relevant
- [ ] Copy button works on mobile
- [ ] Google Reviews opens correctly
- [ ] Stats increment (check admin panel)

### Test 3.3: 2-Star Review Flow (Mobile)

1. Tap 2 stars
2. Write feedback: "Service was slow"
3. Enter name: "Test Customer"
4. Enter contact: Your real mobile number
5. Tap **Send Feedback**

**Pass Criteria:**
- [ ] Feedback form displays
- [ ] All fields editable on mobile keyboard
- [ ] WhatsApp button appears (if configured)
- [ ] WhatsApp opens with pre-filled message
- [ ] Business phone number correct in WhatsApp
- [ ] Message format professional
- [ ] Stats increment (check admin panel)

### Test 3.4: 3-Star Review Flow (Mobile)

1. Tap 3 stars
2. Check displayed options
3. Test both Google and private feedback paths

**Pass Criteria:**
- [ ] Both options presented (Google OR private)
- [ ] No review gating
- [ ] Customer can freely choose
- [ ] Google path works
- [ ] Private feedback path works

### Test 3.5: WhatsApp Integration (Mobile)

**With WhatsApp Cloud API configured:**

1. Submit 2-star feedback
2. Check business WhatsApp

**Pass Criteria:**
- [ ] Message arrives instantly (< 5 seconds)
- [ ] Message format correct
- [ ] All details included (rating, name, feedback)
- [ ] Business name correct in message

**Without WhatsApp Cloud API:**

**Pass Criteria:**
- [ ] Click-to-chat link opens WhatsApp
- [ ] Pre-filled message correct
- [ ] User can send manually

### Test 3.6: Cross-Device Sync Test

**Critical test - verifies main bug fix**

**Setup:**
- Device A: Desktop (admin panel)
- Device B: Mobile phone
- Device C: Different mobile phone (optional)

**Steps:**
1. On Device A: Create "Restaurant ABC" in admin panel
2. On Device A: Generate QR code
3. On Device B: Scan QR code
4. Verify: "Restaurant ABC" displays (not "Demo Business")
5. On Device A: Edit name to "Restaurant XYZ"
6. On Device B: Refresh page
7. Verify: "Restaurant XYZ" displays

**Pass Criteria:**
- [ ] Device B sees correct initial name
- [ ] Device B sees updated name after refresh
- [ ] No localStorage conflicts
- [ ] Data syncs across devices
- [ ] No "Demo Business" ever appears

---

## 🌐 Section 4: Browser Compatibility (5 minutes)

### Test on Each Browser

**Browsers to test:**
- [ ] Chrome (Desktop & Mobile)
- [ ] Safari (Desktop & Mobile)
- [ ] Firefox (Desktop)
- [ ] Edge (Desktop)

### Test Each Browser:

1. Open admin panel
2. Create business
3. Generate QR
4. Open customer page
5. Submit review

**Pass Criteria:**
- [ ] All features work
- [ ] No console errors
- [ ] UI renders correctly
- [ ] Animations smooth
- [ ] Copy functionality works

---

## 🔐 Section 5: Security Testing (5 minutes)

### Test 5.1: PIN Security

1. Try wrong PIN 3 times
2. Test PIN change
3. Lock and unlock panel

**Pass Criteria:**
- [ ] Wrong PIN shows error
- [ ] Correct PIN unlocks
- [ ] PIN change works
- [ ] Lock/unlock cycle works

### Test 5.2: API Security

Try accessing API without authentication:

```powershell
Invoke-RestMethod -Uri "https://your-domain.vercel.app/api/businesses" -Method GET
```

**Pass Criteria:**
- [ ] API returns data (public endpoint)
- [ ] No sensitive data exposed
- [ ] Rate limiting active (test 100+ requests)

### Test 5.3: Input Validation

Try creating business with invalid data:

```powershell
$body = @{
  name = ""
  type = "invalid_type"
  googleUrl = "not-a-url"
  phone = "12345"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://your-domain.vercel.app/api/businesses" -Method POST -Body $body -ContentType "application/json"
```

**Pass Criteria:**
- [ ] Validation errors returned
- [ ] Invalid data rejected
- [ ] Helpful error messages
- [ ] No database corruption

---

## 📊 Section 6: Performance Testing (5 minutes)

### Test 6.1: Page Load Speed

Use browser DevTools Network tab:

1. Open customer review page
2. Check load time

**Pass Criteria:**
- [ ] Total load time < 3 seconds
- [ ] API response < 500ms
- [ ] No blocking resources
- [ ] Images optimized

### Test 6.2: QR Code Generation Speed

1. Generate 5 QR codes in sequence
2. Time each generation

**Pass Criteria:**
- [ ] Each QR generates in < 2 seconds
- [ ] No memory leaks
- [ ] No performance degradation

### Test 6.3: Database Query Speed

Check Vercel function logs:

**Pass Criteria:**
- [ ] GET requests < 100ms
- [ ] POST requests < 200ms
- [ ] No timeout errors
- [ ] Consistent performance

---

## ✅ Final Verification Checklist

Before going live with real customers, ensure:

### Critical Tests (Must Pass)
- [ ] **Mobile devices show correct business names** (NO "Demo Business")
- [ ] Cross-device synchronization works
- [ ] WhatsApp notifications deliver
- [ ] QR codes scannable on all devices
- [ ] Google review flow completes
- [ ] Statistics track correctly
- [ ] No console errors in production

### Important Tests (Should Pass)
- [ ] All API endpoints respond correctly
- [ ] Admin panel fully functional
- [ ] PIN security works
- [ ] Input validation active
- [ ] All browsers compatible
- [ ] Performance acceptable
- [ ] Migration script works

### Nice-to-Have Tests (Can Fix Later)
- [ ] WhatsApp Cloud API configured
- [ ] Custom domain set up
- [ ] Analytics tracking active
- [ ] SEO meta tags present
- [ ] Favicon configured

---

## 🐛 Common Issues & Solutions

### Issue: API returns 500 error

**Solution:**
1. Check Vercel function logs
2. Verify environment variables set
3. Test database connection
4. Redeploy: `vercel --prod --force`

### Issue: Mobile shows wrong business

**Solution:**
1. Clear browser cache on mobile
2. Verify URL has `?businessId=` parameter
3. Test API endpoint manually
4. Check database has correct data

### Issue: WhatsApp not opening

**Solution:**
1. Verify phone format: `+919876543210`
2. Test on actual device (simulators may fail)
3. Check WhatsApp installed
4. Try click-to-chat fallback

### Issue: QR code not scanning

**Solution:**
1. Increase QR code size
2. Print at higher resolution
3. Ensure good contrast
4. Test with different camera apps
5. Verify URL length < 2000 chars

---

## 📞 Support

If tests fail repeatedly:

1. Check all documentation in `/docs` folder
2. Review Vercel function logs
3. Test locally with `vercel dev`
4. Verify all dependencies installed
5. Check GitHub issues for similar problems

---

**Testing Checklist Version:** 2.0.0  
**Last Updated:** 2026-10-30  
**Total Tests:** 50+  
**Estimated Time:** 45 minutes  

**All tests passing?** You're ready for production! 🚀
