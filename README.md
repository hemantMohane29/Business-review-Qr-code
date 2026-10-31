# 🌟 Business Review QR System

**AI-Powered Google Review Management System** - Get more 5-star reviews while protecting your reputation!

[![Live Demo](https://img.shields.io/badge/Demo-Live-green)](https://businessreviewqrcode.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🎯 What is This?

A professional, mobile-first system that helps businesses collect more 5-star Google reviews using:
- 📱 **QR Codes** - Customers scan and review in 30 seconds
- 🤖 **AI Review Generation** - Gemini AI writes personalized reviews instantly
- 🛡️ **Negative Review Shield** - Low ratings go privately to management, NOT Google
- 📊 **Admin Dashboard** - Track scans, reviews, and analytics

---

## ✨ Features

### For Customers (Review Page)
- ⭐ Beautiful star rating interface
- 🎨 Category-specific keyword selection
- 🤖 AI-powered review generation (Gemini 2.0)
- 📋 One-tap copy & paste to Google
- 🎉 Celebration animations for 5-star reviews
- 🌐 Multi-language support (English, Hinglish, Spanish, French)

### For Business Owners (Admin)
- 🔐 PIN-protected admin dashboard
- 🏪 Multi-business management
- 📲 QR code generator
- 📊 Analytics & statistics
- ⚙️ Easy configuration
- 💼 Professional standee designer

### Smart Routing
- **4-5 Stars** → AI generates review → Copy to Google
- **1-3 Stars** → Private feedback → WhatsApp/Email to manager → Show goodwill voucher

---

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/hemantMohane29/Business-review-Qr-code.git
cd Business-review-Qr-code
```

### 2. Run Locally
```bash
# Simple HTTP Server (Python)
python -m http.server 3000

# Or use any static server
# npx serve
# npx http-server
```

### 3. Open in Browser
```
http://localhost:3000/customer-review.html
```

### 🌐 Live Demo
**Production URL:** https://businessreviewqrcode.vercel.app/

- **Customer Review Page:** https://businessreviewqrcode.vercel.app/customer-review.html
- **Admin Dashboard:** https://businessreviewqrcode.vercel.app/admin.html

---

## 📁 Project Structure

```
Business-review-Qr-code/
├── customer-review.html      # Clean customer interface (use for QR)
├── review.html               # Alternative customer page
├── admin.html                # Admin dashboard (PIN protected)
├── assets/
│   ├── css/
│   │   ├── review.css        # Customer styles
│   │   └── admin.css         # Admin styles
│   ├── js/
│   │   ├── review.js         # Customer logic
│   │   └── admin.js          # Admin logic
│   └── libs/
│       ├── qrcode.min.js     # QR code generation
│       ├── confetti.min.js   # Celebration effects
│       └── html2canvas.min.js # Screenshot utility
└── docs/
    ├── USER_GUIDE.md
    ├── SETUP_GUIDE.md
    └── DEPLOYMENT_GUIDE.md
```

---

## ⚙️ Configuration

### 1. Access Admin Panel
```
http://localhost:3000/admin.html
```
**Default PIN:** `admin1234`

### 2. Add Your Business
- Business Name
- Business Type (Restaurant, Salon, Clinic, etc.)
- Google Review URL ([Get yours](https://business.google.com))
- Manager WhatsApp (Optional)
- Manager Email (Optional)
- Gemini API Key (Optional - [Get free key](https://aistudio.google.com/app/apikey))

### 3. Generate QR Code
- Copy customer review URL
- Generate QR in admin panel
- Download and print (minimum 5cm x 5cm)
- Display on counter/table

---

## 🌐 Deploy to Production

### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or use the [Vercel Dashboard](https://vercel.com) - just drag & drop!

### Option 2: Netlify
1. Go to [Netlify Drop](https://app.netlify.com/drop)
2. Drag project folder
3. Done! Get your live URL

### Option 3: GitHub Pages
1. Push to GitHub (already done! ✅)
2. Go to Settings > Pages
3. Select branch `main`
4. Get URL: `https://hemantMohane29.github.io/Business-review-Qr-code`

---

## 📱 Usage

### For Customers:
1. **Scan QR code** on business counter
2. **Rate experience** (1-5 stars)
3. If 4-5 stars:
   - Select what you loved
   - AI generates review
   - Copy & paste to Google
4. If 1-3 stars:
   - Share feedback privately
   - Manager gets WhatsApp/Email
   - Receive goodwill voucher

### For Business Owners:
1. **Login to admin dashboard**
2. **View analytics** (scans, reviews, ratings)
3. **Manage multiple businesses**
4. **Generate QR codes**
5. **Respond to private feedback**

---

## 🔧 API Keys (Optional)

### Google Gemini AI (Free)
1. Visit: https://aistudio.google.com/app/apikey
2. Sign in with Google
3. Create API key
4. Add in admin panel

**Free Tier:**
- 15 requests/minute
- 1,500 requests/day
- Perfect for small-medium businesses

**Note:** System works WITHOUT API key using built-in smart review generator!

---

## 🛡️ Security & Privacy

- ✅ PIN-protected admin panel
- ✅ Customer data stored locally (localStorage)
- ✅ No external tracking
- ✅ HTTPS required for production
- ✅ Negative reviews NEVER go to Google
- ✅ Private feedback only to manager

---

## 🎨 Customization

### Change Colors
Edit `assets/css/review.css`:
```css
:root {
  --primary-color: #4285F4;  /* Google Blue */
  --success-color: #34A853;  /* Google Green */
  --warning-color: #FBBC05;  /* Google Yellow */
}
```

### Change Business Categories
Edit keyword lists in `assets/js/review.js`:
```javascript
const KEYWORDS = {
  restaurant: [...],
  cafe: [...],
  salon: [...],
  // Add your own!
}
```

---

## 📊 Analytics

Track in Admin Dashboard:
- 📈 Total QR scans
- ⭐ 5-star reviews sent to Google
- 🛡️ Negative reviews shielded
- 💬 Private feedback received
- 📱 Customer engagement rate

---

## 🌍 Browser Support

- ✅ Chrome (Desktop & Mobile)
- ✅ Safari (iOS & macOS)
- ✅ Firefox
- ✅ Edge
- ✅ Samsung Internet

---

## 📚 Documentation

- 📖 [Complete User Guide](docs/USER_GUIDE.md)
- ⚙️ [Setup Instructions](docs/SETUP_GUIDE.md)
- 🚀 [Deployment Guide](docs/DEPLOYMENT_GUIDE.md)
- 💼 [Sample Configurations](docs/SAMPLE_BUSINESS_CONFIG.md)

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Gemini AI** - For AI review generation
- **QRCode.js** - QR code generation
- **Canvas-Confetti** - Celebration animations
- **html2canvas** - Screenshot/export functionality

---

## 📞 Support

- 🐛 [Report Bug](https://github.com/hemantMohane29/Business-review-Qr-code/issues)
- 💡 [Request Feature](https://github.com/hemantMohane29/Business-review-Qr-code/issues)
- 📧 Email: support@yourdomain.com

---

## 🎯 Roadmap

- [ ] Multi-language admin interface
- [ ] SMS integration for feedback
- [ ] Advanced analytics dashboard
- [ ] Review response templates
- [ ] Mobile app (iOS & Android)
- [ ] Integration with review platforms (Yelp, TripAdvisor)

---

## ⭐ Star This Repository

If you found this helpful, please give it a star! It helps others discover the project.

---

**Made with ❤️ for businesses that care about customer experience**

🌟 **Get more reviews. Protect your reputation. Grow your business.** 🌟
