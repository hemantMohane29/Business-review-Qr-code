/* =========================================================
   SMARTREVIEW — CUSTOMER REVIEW FLOW
   review.js  |  v4.0  |  No dependencies except qrcode/confetti
   ========================================================= */
'use strict';

const R = (() => {

  /* ── CONSTANTS ────────────────────────────────────────── */
  const STORE_KEY   = 'sr_businesses_v4';
  const ACTIVE_KEY  = 'sr_active_v4';
  const STAT_PREFIX = 'sr_stat_';

  const STAR_LABELS = ['','Terrible 😞','Poor 😕','Okay 😐','Good 😊','Excellent 🤩'];
  const STAR_COLORS = ['','#EA4335','#FA7B17','#F9AB00','#34A853','#1A73E8'];

  const KEYWORDS = {
    restaurant:['Mouthwatering Food 🍲','Attentive Staff 😊','Beautiful Interior ✨','Fast Service ⚡','Authentic Flavours 🌶️','Generous Portions 🥘','Great Drinks 🍹','Family Friendly 👨‍👩‍👧','Spotless Hygiene 🧼','Outstanding Experience ⭐'],
    cafe:      ['Amazing Coffee ☕','Delicious Pastries 🥐','Cozy Ambiance 🛋️','Friendly Baristas ⚡','Fresh Ingredients 🌱','Great Work Spot 💻','Speedy Service ✨','Good Value 💰','Must-Visit 📍','Always Come Back 🔄'],
    salon:     ['Skilled Stylist ✂️','Relaxing Experience 💆','Spotless & Hygienic ✨','Premium Products 🧴','Polite Staff 😊','No Wait Time ⏱️','Great Hair Result 💎','Thorough Consultation 💬','Worth Every Rupee 💰','My Go-To Place 🏆'],
    clinic:    ['Caring Doctor 👨‍⚕️','Pain-Free Treatment 🩹','Sparkling Clean 🏥','Clear Explanations 💬','Warm Receptionist 😊','Modern Equipment 🔬','On-Time 🕐','Extremely Professional 🏆','Felt Completely at Ease 😌','Highly Recommended 👍'],
    gym:       ['Top Equipment 🏋️','Motivating Trainers 🥇','High-Energy Vibe ⚡','Clean Locker Rooms 🚿','Great Community 👥','Personalised Plans 🎯','Spacious & Ventilated 💨','Visible Results 💪','Fair Pricing 💰','Best Gym Around ⭐'],
    retail:    ['Trendy Collection 👗','Helpful Staff 😊','Great Deals 🏷️','Top Quality 💎','Smooth Checkout ⚡','Beautiful Layout 🏬','Found Exactly What I Needed 🎯','Easy Returns 🔄','Enjoyable Shopping 🛍️','Will Shop Again ⭐'],
    hotel:     ['Immaculate Rooms 🛏️','Outstanding Hospitality 🛎️','Excellent Breakfast 🍳','Breathtaking Views 🌄','Perfect Location 📍','Fast Room Service ⚡','Super Comfy Beds ☁️','Peaceful & Quiet 🌿','5-Star Experience 🌟','Booking Again 🔑'],
    auto:      ['Expert Mechanics 🔧','Honest Pricing 💰','Quick Turnaround ⏱️','Smooth Drive After 🏎️','Transparent Report 📋','Car Washed & Clean 🧼','Genuine Parts ⚙️','Friendly Team 😊','Trustworthy Garage 🛡️','100% Reliable 👍'],
    general:   ['Outstanding Service 🏆','Warm & Friendly 😊','Prompt & Efficient ⚡','High-Quality Work 💎','Reasonable Prices 💰','Exceeded Expectations 🎯','Attention to Detail 🔍','Smooth Experience ✨','Very Professional 👔','Wholeheartedly Recommend 👍'],
  };

  /* ── STATE ────────────────────────────────────────────── */
  let business   = null;   // active business config
  let rating     = 0;
  let keywords   = [];
  let review     = '';
  let stepStack  = [];

  /* ── INIT ─────────────────────────────────────────────── */
  function init() {
    const params = new URLSearchParams(location.search);
    const bizId  = params.get('b') || params.get('biz');
    const biz    = loadBusiness(bizId);

    if (!biz) { 
      // Create demo business if none exists
      business = createDemoBusinessIfNeeded();
      if (!business) {
        showView('view-setup'); 
        return;
      }
    } else {
      business = biz;
    }

    applyBizToUI();
    incStat('scans');
    showView('view-rate');
    bindRating();
    bindForm();
    bindButtons();
  }

  function createDemoBusinessIfNeeded() {
    // Check if we should create a demo business for testing
    const params = new URLSearchParams(location.search);
    const demo = params.get('demo');
    
    // If no businesses exist at all, create a default demo
    try {
      const list = JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
      if (list.length === 0) {
        // Create default demo business
        const demoBiz = {
          id: 'demo-business-001',
          name: 'Demo Business',
          type: 'restaurant',
          avatar: '🏪',
          googleUrl: 'https://g.page/r/EXAMPLE/review',
          phone: '',
          email: '',
          geminiKey: '',
          createdAt: Date.now()
        };
        
        // Save demo business
        localStorage.setItem(STORE_KEY, JSON.stringify([demoBiz]));
        localStorage.setItem(ACTIVE_KEY, demoBiz.id);
        
        return demoBiz;
      }
      
      // Return first business if exists
      return list[0];
    } catch {
      return null;
    }
  }

  function loadBusiness(id) {
    try {
      const list = JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
      if (!list.length) return null;
      if (id) return list.find(b => b.id === id) || list[0];
      const activeId = localStorage.getItem(ACTIVE_KEY);
      return list.find(b => b.id === activeId) || list[0];
    } catch { return null; }
  }

  function applyBizToUI() {
    const b = business;
    const catKws = KEYWORDS[b.type] || KEYWORDS.general;
    const avatar = catKws[0].split(' ').pop(); // last emoji from first keyword

    document.getElementById('r-avatar').textContent    = b.avatar || getAvatar(b.type);
    document.getElementById('r-biz-name').textContent  = b.name;
    document.getElementById('r-category').textContent  = getCatLabel(b.type);
    document.getElementById('post-biz-name').textContent = b.name;
    document.getElementById('page-title').textContent  = `Review ${b.name}`;
  }

  /* ── NAVIGATION ───────────────────────────────────────── */
  function showView(id) {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goTo(id) {
    stepStack.push(getCurrentView());
    showView(id);
  }

  function goBack() {
    const prev = stepStack.pop();
    if (prev) showView(prev);
  }

  function getCurrentView() {
    const active = document.querySelector('.step.active');
    return active ? active.id : 'view-rate';
  }

  /* ── STAR RATING ──────────────────────────────────────── */
  function bindRating() {
    const btns = document.querySelectorAll('.star-btn');
    const label = document.getElementById('rating-label');

    const paint = (n) => {
      btns.forEach(b => {
        b.classList.toggle('lit', parseInt(b.dataset.v) <= n);
      });
    };

    btns.forEach(btn => {
      const v = parseInt(btn.dataset.v);
      btn.addEventListener('mouseenter', () => paint(v));
      btn.addEventListener('mouseleave', () => paint(rating));
      btn.addEventListener('touchstart', () => paint(v), { passive: true });
      btn.addEventListener('click', () => {
        rating = v;
        paint(v);
        label.textContent = STAR_LABELS[v];
        label.style.color = STAR_COLORS[v];

        if (v === 5 && typeof confetti === 'function') {
          confetti({ particleCount: 70, spread: 65, origin: { y: 0.7 } });
        }

        setTimeout(() => {
          if (rating >= 4) {
            loadChips();
            document.getElementById('step2-rating-badge').textContent = '⭐'.repeat(rating);
            goTo('view-build');
          } else if (rating === 3) {
            // 3 stars: Quick feedback - only reason, no name/contact
            incStat('shielded');
            setupQuickFeedback();
            goTo('view-feedback');
          } else {
            // 1-2 stars: Full feedback form
            incStat('shielded');
            setupFullFeedback();
            document.getElementById('shield-star-text') &&
              (document.getElementById('shield-star-text').textContent = `${rating} star${rating > 1 ? 's' : ''}`);
            goTo('view-feedback');
          }
        }, 420);
      });
    });
  }

  /* ── FEEDBACK MODES ───────────────────────────────────── */
  function setupQuickFeedback() {
    // 3 stars: Only reason required, auto-send
    const formRow = document.querySelector('#view-feedback .form-row');
    const waBtn = document.getElementById('btn-wa');
    const emailBtn = document.querySelector('#fb-form button[type="submit"]');
    const msgTextarea = document.getElementById('fb-msg');
    
    if (formRow) formRow.style.display = 'none'; // Hide name/contact fields
    if (waBtn) waBtn.style.display = 'none'; // Hide WhatsApp button
    if (emailBtn) {
      emailBtn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Send Feedback';
      emailBtn.style.background = '#1A73E8';
      emailBtn.classList.add('btn-primary');
      emailBtn.classList.remove('btn-outline');
    }
    if (msgTextarea) {
      msgTextarea.placeholder = 'What could we improve? Your feedback helps us get better...';
    }
    
    // Update heading for 3 stars
    const shieldTitle = document.querySelector('.shield-title');
    const shieldSub = document.querySelector('.shield-sub');
    if (shieldTitle) shieldTitle.textContent = 'Help us improve';
    if (shieldSub) shieldSub.innerHTML = 'Your quick feedback goes <strong>directly to management</strong>, never to Google';
  }

  function setupFullFeedback() {
    // 1-2 stars: Full form with name/contact
    const formRow = document.querySelector('#view-feedback .form-row');
    const waBtn = document.getElementById('btn-wa');
    const emailBtn = document.querySelector('#fb-form button[type="submit"]');
    const msgTextarea = document.getElementById('fb-msg');
    
    if (formRow) formRow.style.display = 'flex'; // Show name/contact fields
    if (waBtn) waBtn.style.display = 'flex'; // Show WhatsApp button
    if (emailBtn) {
      emailBtn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> Send via Email';
      emailBtn.style.background = '';
      emailBtn.classList.remove('btn-primary');
      emailBtn.classList.add('btn-outline');
    }
    if (msgTextarea) {
      msgTextarea.placeholder = 'Please share details so we can fix this immediately…';
    }
    
    // Update heading for 1-2 stars
    const shieldTitle = document.querySelector('.shield-title');
    const shieldSub = document.querySelector('.shield-sub');
    if (shieldTitle) shieldTitle.textContent = 'We want to make this right';
    if (shieldSub) shieldSub.innerHTML = 'Your message goes <strong>directly to management</strong>, never to Google';
  }

  /* ── KEYWORD CHIPS ────────────────────────────────────── */
  function loadChips() {
    const wrap = document.getElementById('chips-wrap');
    wrap.innerHTML = '';
    keywords = [];
    const kws = KEYWORDS[business.type] || KEYWORDS.general;
    kws.forEach(kw => { wrap.appendChild(makeChip(kw)); });
    updateGenerateBtn();
  }

  function makeChip(text) {
    const chip = document.createElement('button');
    chip.className = 'kw-chip';
    chip.textContent = text;
    chip.type = 'button';
    chip.addEventListener('click', () => {
      chip.classList.toggle('active');
      const idx = keywords.indexOf(text);
      if (idx > -1) keywords.splice(idx, 1);
      else keywords.push(text);
      updateGenerateBtn();
    });
    return chip;
  }

  function addCustomChip() {
    const input = document.getElementById('custom-kw');
    const val = input.value.trim();
    if (!val || keywords.includes(val)) return;
    keywords.push(val);
    const wrap = document.getElementById('chips-wrap');
    const chip = makeChip(val);
    chip.classList.add('active', 'custom');
    wrap.appendChild(chip);
    input.value = '';
    updateGenerateBtn();
  }

  function updateGenerateBtn() {
    const btn = document.getElementById('btn-generate');
    if (!btn) return;
    btn.disabled = keywords.length === 0;
  }

  /* ── AI REVIEW GENERATION ──────────────────────────────── */
  async function generateReview() {
    if (keywords.length === 0) return;

    const loader = document.getElementById('ai-loader');
    const card = document.getElementById('review-card');
    const textarea = document.getElementById('review-text');
    const btnGen = document.getElementById('btn-generate');
    const btnPost = document.getElementById('btn-to-post');

    loader.classList.remove('hidden');
    card.classList.add('hidden');
    btnGen.classList.add('hidden');

    try {
      review = await callAI();
      textarea.value = review;
      loader.classList.add('hidden');
      card.classList.remove('hidden');
      btnPost.classList.remove('hidden');
    } catch (err) {
      console.error('AI generation error:', err);
      loader.classList.add('hidden');
      btnGen.classList.remove('hidden');
      alert('Could not generate review. Please try again.');
    }
  }

  async function callAI() {
    const tone = document.getElementById('sel-tone')?.value || 'enthusiastic';
    const lang = document.getElementById('sel-lang')?.value || 'english';
    const key = business.geminiKey;

    if (key) {
      try {
        return await geminiGenerate(key, tone, lang);
      } catch (err) {
        console.warn('Gemini failed, falling back to local:', err);
      }
    }

    return localGenerate(tone, lang);
  }

  async function geminiGenerate(key, tone, lang) {
    const prompt = buildPrompt(tone, lang);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${key}`;
    
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 200,
        }
      })
    });

    if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
    
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('No text in response');
    
    return text.trim();
  }

  function localGenerate(tone, lang) {
    const templates = {
      enthusiastic: [
        `If you haven't visited ${business.name} yet, you're missing out! ${keywords.slice(0, 3).join(', ')} — everything was absolutely perfect. ${keywords.length > 3 ? keywords.slice(3).join(', ') + ' too!' : ''} 5-star experience â€" go yourself and see! 🌟`,
        `From ${keywords[0]} to ${keywords[keywords.length - 1]}, ${business.name} delivered beyond expectations. ${keywords.slice(1, -1).join(', ')} — truly outstanding! Highly recommend! ⭐`
      ],
      natural: [
        `Great experience at ${business.name}! ${keywords.slice(0, 2).join(' and ')} stood out. ${keywords.length > 2 ? keywords.slice(2).join(', ') + ' were also excellent.' : ''} Would definitely return!`,
        `Really enjoyed ${business.name}. ${keywords.join(', ')} — all top-notch. Worth visiting!`
      ],
      crisp: [
        `${business.name}: ${keywords.slice(0, 3).join(', ')}. Excellent! ⭐`,
        `Loved it! ${keywords.slice(0, 2).join(' + ')}. Recommended!`
      ],
      professional: [
        `I recently visited ${business.name} and was thoroughly impressed. The establishment excelled in: ${keywords.join(', ')}. I would highly recommend this business to others seeking quality service.`,
        `${business.name} provides exceptional service. Notable highlights include ${keywords.join(', ')}. A professional and reliable choice.`
      ]
    };

    const options = templates[tone] || templates.natural;
    return options[Math.floor(Math.random() * options.length)];
  }

  function buildPrompt(tone, lang) {
    const bizType = getCatLabel(business.type);
    return `Write a ${tone} Google review for "${business.name}", a ${bizType}. Include these highlights: ${keywords.join(', ')}. Language: ${lang}. Keep it under 150 words, natural, and authentic.`;
  }

  /* ── CLIPBOARD & GOOGLE ───────────────────────────────── */
  async function copy(text) {
    try {
      if (navigator.clipboard && location.protocol === 'https:') {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = Object.assign(document.createElement('textarea'),
          { value: text, style: 'position:fixed;opacity:0' });
        document.body.appendChild(ta);
        ta.select(); document.execCommand('copy');
        document.body.removeChild(ta);
      }
    } catch { /* silent */ }
  }

  function showToast(msg = '✅ Copied!') {
    const t = document.getElementById('copy-toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
  }

  // Alias for copy toast
  function showCopyToast() {
    showToast('✓ Copied to clipboard! Opening Google...');
  }

  /* ── BIND BUTTONS ─────────────────────────────────────── */
  function bindButtons() {
    // Generate
    document.getElementById('btn-generate')?.addEventListener('click', generateReview);
    document.getElementById('btn-regen')?.addEventListener('click', generateReview);

    // Continue to post
    document.getElementById('btn-to-post')?.addEventListener('click', () => {
      const txt = document.getElementById('review-text').value.trim();
      if (!txt) { alert('Review is empty!'); return; }
      review = txt;
      document.getElementById('preview-text').textContent = review;
      goTo('view-post');
    });

    // Google CTA - Enhanced with better UX
    document.getElementById('btn-google')?.addEventListener('click', async () => {
      const btn = document.getElementById('btn-google');
      const originalHTML = btn.innerHTML;
      
      // Show copying state
      btn.innerHTML = `
        <div class="btn-mega-content">
          <div style="width: 56px; height: 56px; display: flex; align-items: center; justify-content: center;">
            <div style="width: 24px; height: 24px; border: 3px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite;"></div>
          </div>
          <div class="btn-mega-text">
            <div class="btn-mega-title">Copying...</div>
            <div class="btn-mega-sub">Please wait</div>
          </div>
        </div>
      `;
      btn.disabled = true;
      
      // Copy to clipboard
      await copy(review);
      incStat('reviews');
      
      // Show success state
      btn.innerHTML = `
        <div class="btn-mega-content">
          <div style="width: 56px; height: 56px; background: rgba(255,255,255,0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="white" stroke-width="3">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div class="btn-mega-text">
            <div class="btn-mega-title">✓ Copied!</div>
            <div class="btn-mega-sub">Opening Google Reviews...</div>
          </div>
        </div>
      `;
      btn.style.background = 'linear-gradient(135deg, #34A853 0%, #0F9D58 100%)';
      
      // Show toast notification
      showCopyToast();
      
      // Confetti celebration
      if (typeof confetti === 'function') {
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.4 } });
      }
      
      // Redirect to Google after delay
      setTimeout(() => {
        location.href = business.googleUrl;
      }, 1200);
    });

    // Done
    document.getElementById('btn-done')?.addEventListener('click', resetFlow);

    // Issue tags toggle
    document.querySelectorAll('.issue-tag').forEach(t => {
      t.addEventListener('click', () => t.classList.toggle('active'));
    });
  }

  function bindForm() {
    const form = document.getElementById('fb-form');

    // WhatsApp
    document.getElementById('btn-wa')?.addEventListener('click', () => {
      if (!validateFB()) return;
      if (!business.phone) { alert('Manager WhatsApp not configured. Contact admin.'); return; }
      const data = collectFB();
      const text = encodeURIComponent(
        `🚨 *Private Customer Feedback (${rating}★)*\n` +
        `Business: ${business.name}\n` +
        `Customer: ${data.name} | ${data.contact}\n` +
        `Issues: ${data.issues}\n\n*Message:*\n"${data.msg}"\n\n_via SmartReview AI_`
      );
      window.open(`https://wa.me/${business.phone.replace(/\D/g,'')}?text=${text}`, '_blank');
      showDone(false);
    });

    // Email
    form?.addEventListener('submit', e => {
      e.preventDefault();
      if (!validateFB()) return;
      if (!business.email) { alert('Manager email not configured. Contact admin.'); return; }
      const data = collectFB();
      const sub  = encodeURIComponent(`Private Feedback: ${rating}★ | ${business.name}`);
      const body = encodeURIComponent(`Business: ${business.name}\nRating: ${rating}★\nCustomer: ${data.name}\nContact: ${data.contact}\nIssues: ${data.issues}\n\nMessage:\n${data.msg}`);
      location.href = `mailto:${business.email}?subject=${sub}&body=${body}`;
      showDone(false);
    });
  }

  function validateFB() {
    const msg = document.getElementById('fb-msg').value.trim();
    const err = document.getElementById('fb-err');
    if (!msg) {
      err.classList.remove('hidden');
      return false;
    }
    err.classList.add('hidden');
    return true;
  }

  function collectFB() {
    const tags = Array.from(document.querySelectorAll('.issue-tag.active')).map(t => t.dataset.issue);
    const nameField = document.getElementById('fb-name');
    const contactField = document.getElementById('fb-contact');
    
    return {
      name: (nameField && nameField.value.trim()) || 'Anonymous',
      contact: (contactField && contactField.value.trim()) || 'Not provided',
      issues: tags.length ? tags.join(', ') : 'General',
      msg: document.getElementById('fb-msg').value.trim()
    };
  }

  function showDone(positive = true) {
    const icon = document.getElementById('done-icon');
    const title = document.getElementById('done-title');
    const msg = document.getElementById('done-msg');
    const voucher = document.getElementById('voucher-card');

    if (positive) {
      icon.textContent = '🎉';
      title.textContent = 'Thank You!';
      msg.textContent = 'Your review supports our team and helps us grow. We truly appreciate it!';
      voucher.style.display = 'none';
    } else {
      icon.textContent = '🙏';
      title.textContent = 'We Appreciate Your Feedback';
      msg.textContent = 'Thank you for helping us improve. Your concerns matter to us.';
      voucher.style.display = 'block';
    }

    goTo('view-done');
  }

  function resetFlow() {
    rating = 0;
    keywords = [];
    review = '';
    stepStack = [];
    showView('view-rate');
  }

  /* ── HELPERS ──────────────────────────────────────────── */
  function getCatLabel(type) {
    const labels = {
      restaurant: 'Restaurant & Dining',
      cafe: 'Cafe & Coffee Shop',
      salon: 'Hair Salon & Beauty',
      clinic: 'Healthcare & Medical',
      gym: 'Fitness & Gym',
      retail: 'Retail Store',
      hotel: 'Hotel & Hospitality',
      auto: 'Automotive Service',
      general: 'Local Business'
    };
    return labels[type] || labels.general;
  }

  function getAvatar(type) {
    const avatars = {
      restaurant: '🍽️',
      cafe: '☕',
      salon: '💇',
      clinic: '🏥',
      gym: '💪',
      retail: '🛍️',
      hotel: '🏨',
      auto: '🔧',
      general: '🏪'
    };
    return avatars[type] || avatars.general;
  }

  function incStat(key) {
    if (!business) return;
    try {
      const k = `${STAT_PREFIX}${business.id}_${key}`;
      const v = parseInt(localStorage.getItem(k) || '0') + 1;
      localStorage.setItem(k, v.toString());
    } catch {}
  }

  /* ── PUBLIC API ───────────────────────────────────────── */
  return {
    init,
    goTo,
    goBack,
    addCustomChip
  };
})();

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', R.init);
} else {
  R.init();
}
