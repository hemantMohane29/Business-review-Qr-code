# 📱 Business Review QR System - Complete User Guide

## 🎯 What This System Does

This system helps you get more **5-star Google Reviews** by:
1. **Making it easy** - Customers tap their phone or scan QR code
2. **AI writes the review** - No typing needed, AI generates it in 10 seconds
3. **Protects your rating** - Bad reviews (1-3 stars) go privately to you via WhatsApp/Email, NOT to Google

---

## 🚀 Quick Start (5 Minutes Setup)

### Step 1: Access Admin Panel
- Open `index.html` in your browser
- You'll see a button "🔧 Admin Setup" at the bottom
- Click it to open the admin panel (this is ONLY for you, customers will NEVER see this)

### Step 2: Add Your First Business

Click the **"Add New Business"** button and fill in:

#### Required Information:
1. **Business Name**: Your business name (e.g., "Joe's Pizza Restaurant")
2. **Business Type**: Select from dropdown (Restaurant, Cafe, Salon, Clinic, etc.)
3. **Google Review URL**: Your Google review link

#### How to Get Your Google Review URL:
1. Go to https://business.google.com
2. Sign in with your Google account
3. Click your business listing
4. Click "Get more reviews" or "Ask for reviews"
5. Copy the URL (looks like: `https://g.page/r/XXXXX/review`)
6. Paste it in the form

#### Optional but Recommended:
- **Manager WhatsApp**: Your phone with country code (e.g., +919876543210)
  - Used to instantly alert you when someone gives 1-3 stars
- **Manager Email**: Your email for feedback notifications
- **Gemini AI Key**: (Optional - system works without it)
  - Free AI that writes better reviews
  - Get it from: https://aistudio.google.com/app/apikey

### Step 3: Generate Your QR Code
- After saving, go to "Standee & QR" tab
- Your QR code is automatically generated
- Click "Download QR Code" to save it

### Step 4: Print & Use
- Print the QR code (minimum 5cm x 5cm size)
- Put it on your counter/table with text: "Scan to Leave a Review"
- Done! 🎉

---

## 📊 How It Works (Customer Journey)

### What Customers See (QR Scanner View):
1. **Customer scans QR** → Opens review page (clean, no admin buttons)
2. **Taps 1-5 stars** → System routes them:
   - **4-5 stars** → AI Review Generator
   - **1-3 stars** → Private Feedback (sends to YOUR WhatsApp/Email only)

### 4-5 Star Flow:
1. Customer selects highlights (Fast Service, Great Food, etc.)
2. AI generates a custom review in 10 seconds
3. Customer taps "Copy & Open Google"
4. Review copies to clipboard, Google Reviews opens
5. Customer pastes and posts ✅

### 1-3 Star Flow (Protection Shield):
1. Customer sees: "We want to make this right"
2. Types their complaint privately
3. Message goes to YOUR WhatsApp & Email instantly
4. Customer gets a goodwill discount code
5. **Nothing goes to Google!** Your rating is protected 🛡️

---

## 🎨 Admin Panel Features

### Dashboard Tab
- See total scans, 5-star reviews, negative reviews shielded
- Quick overview of how your QR system is performing

### Manage Businesses
- Add new business
- Switch between multiple businesses (if you have more than one)
- Edit business details
- Delete business

### Standee & QR Tab
- Preview QR code
- Download QR code as image
- Download full standee design (if you want physical standee)
- Copy the review URL (for sharing)

### Settings
- Edit business name, type
- Update Google review URL
- Change WhatsApp/Email
- Add/update AI key

---

## 📲 Multiple Businesses Setup

If you manage multiple locations:

1. Click "Add New Business" for each location
2. Each business gets its own:
   - Unique QR code
   - Separate analytics
   - Custom review funnel
3. Switch between them using the dropdown
4. Each QR code only shows reviews for that specific business

---

## 🖨️ Printing Your QR Code

### Minimum Requirements:
- **Size**: 5cm x 5cm (2 inches x 2 inches)
- **Quality**: Print at 300 DPI or higher
- **Paper**: Regular paper works, laminate for durability

### Where to Print:
- Any local print shop
- Office printer
- Online: Vistaprint, Printful, local services

### Display Ideas:
- Table tent on dining tables
- Counter standee at checkout
- Wall poster near exit
- Sticker on window

---

## 🔧 Troubleshooting

### QR Code Not Working?
✓ Make sure you opened the file through a web server or deployed it online
✓ File must be on HTTPS (use Vercel/Netlify for free hosting)
✓ Test by scanning with your own phone first

### Copy Button Not Working?
✓ Must be on HTTPS (not file://)
✓ Deploy to Vercel.com or Netlify.com (free, 2 minutes)

### WhatsApp Alert Not Working?
✓ Phone number must include country code (+91 for India, +1 for USA)
✓ No spaces or dashes in phone number
✓ Format: +919876543210

### AI Not Generating Reviews?
✓ Works without API key (uses built-in smart engine)
✓ If you added Gemini key, check it's correct
✓ Get free key from: https://aistudio.google.com/app/apikey

---

## 🌐 Deploying Online (Recommended)

### Why Deploy?
- QR codes need HTTPS to work properly
- Copy-to-clipboard requires secure connection
- Free hosting available

### Option 1: Vercel (Easiest)
1. Go to https://vercel.com
2. Sign up free with GitHub/Google
3. Click "Add New Project"
4. Upload your folder
5. Done! Get your URL like: https://yourstore.vercel.app

### Option 2: Netlify Drop
1. Go to https://app.netlify.com/drop
2. Drag your folder onto the page
3. Done! Get your URL instantly

### Option 3: GitHub Pages (For Developers)
1. Create GitHub repository
2. Upload files
3. Enable Pages in settings
4. URL: https://username.github.io/repo-name

---

## 📞 Getting Help

### Can't Get Google Review URL?
- Your business must be verified on Google Business
- Go to https://business.google.com
- Click "Verify now" if not verified yet

### Need WhatsApp Number Format?
- Start with + and country code
- India: +919876543210
- USA: +11234567890
- UK: +447123456789

### Want Physical NFC Standee?
- See SETUP_GUIDE.md for NFC chip instructions
- Buy NTAG213 NFC stickers ($0.30 each on Amazon)
- Program with free NFC Tools app

---

## 🎯 Best Practices

### Timing
- Ask customers when they're happiest (after eating, checkout)
- Display QR prominently where customers wait

### Messaging
- Use friendly text: "Loved your visit? Share your experience!"
- Avoid: "Leave a review" (sounds like work)
- Better: "Tell others what you loved in 10 seconds"

### Follow-up (for 1-3 stars)
- Respond to WhatsApp/Email feedback within 1 hour
- Offer resolution (discount, free item, etc.)
- Many customers change their mind and give 5 stars after good service recovery

---

## 📈 Success Metrics

After 1 month, you should see:
- 5-10x more Google reviews
- 80%+ are 5-star ratings
- Zero negative public reviews (shielded to private feedback)

---

## 🔒 Privacy & Data

- All data stored in your browser (localStorage)
- No data sent to external servers (except Gemini AI if you use it)
- Customer feedback only goes to YOUR WhatsApp/Email
- No tracking, no analytics sent anywhere

---

## 💡 Pro Tips

1. **Multiple QR Codes**: Print several, place everywhere customers wait
2. **Staff Training**: Tell staff to point customers to QR code
3. **Incentive**: "Scan for a chance to win a free dessert" (makes it fun)
4. **Test Monthly**: Scan your own QR with a friend's phone to verify it works

---

## 📚 Additional Resources

- **README.md** - Technical overview
- **SETUP_GUIDE.md** - Detailed setup for NFC standee
- **Support**: Check files in your folder for more info

---

## ✅ Checklist: Am I Ready?

Before printing QR:
- [ ] Added business in admin panel
- [ ] Google review URL is correct (tested by clicking it)
- [ ] WhatsApp number includes country code
- [ ] Downloaded QR code image
- [ ] Tested QR by scanning with phone
- [ ] QR opens the review page correctly
- [ ] Tried selecting 5 stars → AI generates review → Copy works

You're ready! Print and display your QR code 🎉

---

**Questions? Issues? Check the files in your project folder for more detailed technical guides.**
