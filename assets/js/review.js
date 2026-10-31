/* =========================================================
   SMARTREVIEW â€” CUSTOMER REVIEW FLOW
   review.js  |  v4.0  |  No dependencies except qrcode/confetti
   ========================================================= */
'use strict';

const R = (() => {

  /* â”€â”€ CONSTANTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const STORE_KEY   = 'sr_businesses_v4';
  const ACTIVE_KEY  = 'sr_active_v4';
  const STAT_PREFIX = 'sr_stat_';

  const STAR_LABELS = ['','Terrible ðŸ˜ž','Poor ðŸ˜•','Okay ðŸ˜','Good ðŸ˜Š','Excellent ðŸ¤©'];
  const STAR_COLORS = ['','#EA4335','#FA7B17','#F9AB00','#34A853','#1A73E8'];

  const KEYWORDS = {
    restaurant:['Mouthwatering Food ðŸ²','Attentive Staff ðŸ˜Š','Beautiful Interior âœ¨','Fast Service âš¡','Authentic Flavours ðŸŒ¶ï¸','Generous Portions ðŸ¥˜','Great Drinks ðŸ¹','Family Friendly ðŸ‘¨â€ðŸ‘©â€ðŸ‘§','Spotless Hygiene ðŸ§¼','Outstanding Experience â­'],
    cafe:      ['Amazing Coffee â˜•','Delicious Pastries ðŸ¥','Cozy Ambiance ðŸ›‹ï¸','Friendly Baristas âš¡','Fresh Ingredients ðŸŒ±','Great Work Spot ðŸ’»','Speedy Service âœ¨','Good Value ðŸ’°','Must-Visit ðŸ“','Always Come Back ðŸ”„'],
    salon:     ['Skilled Stylist âœ‚ï¸','Relaxing Experience ðŸ’†','Spotless & Hygienic âœ¨','Premium Products ðŸ§´','Polite Staff ðŸ˜Š','No Wait Time â±ï¸','Great Hair Result ðŸ’Ž','Thorough Consultation ðŸ’¬','Worth Every Rupee ðŸ’°','My Go-To Place ðŸ†'],
    clinic:    ['Caring Doctor ðŸ‘¨â€âš•ï¸','Pain-Free Treatment ðŸ©¹','Sparkling Clean ðŸ¥','Clear Explanations ðŸ’¬','Warm Receptionist ðŸ˜Š','Modern Equipment ðŸ”¬','On-Time ðŸ•','Extremely Professional ðŸ†','Felt Completely at Ease ðŸ˜Œ','Highly Recommended ðŸ‘'],
    gym:       ['Top Equipment ðŸ‹ï¸','Motivating Trainers ðŸ¥‡','High-Energy Vibe âš¡','Clean Locker Rooms ðŸš¿','Great Community ðŸ‘¥','Personalised Plans ðŸŽ¯','Spacious & Ventilated ðŸ’¨','Visible Results ðŸ’ª','Fair Pricing ðŸ’°','Best Gym Around â­'],
    retail:    ['Trendy Collection ðŸ‘—','Helpful Staff ðŸ˜Š','Great Deals ðŸ·ï¸','Top Quality ðŸ’Ž','Smooth Checkout âš¡','Beautiful Layout ðŸ¬','Found Exactly What I Needed ðŸŽ¯','Easy Returns ðŸ”„','Enjoyable Shopping ðŸ›ï¸','Will Shop Again â­'],
    hotel:     ['Immaculate Rooms ðŸ›ï¸','Outstanding Hospitality ðŸ›Žï¸','Excellent Breakfast ðŸ³','Breathtaking Views ðŸŒ„','Perfect Location ðŸ“','Fast Room Service âš¡','Super Comfy Beds â˜ï¸','Peaceful & Quiet ðŸŒ¿','5-Star Experience ðŸŒŸ','Booking Again ðŸ”‘'],
    auto:      ['Expert Mechanics ðŸ”§','Honest Pricing ðŸ’°','Quick Turnaround â±ï¸','Smooth Drive After ðŸŽï¸','Transparent Report ðŸ“‹','Car Washed & Clean ðŸ§¼','Genuine Parts âš™ï¸','Friendly Team ðŸ˜Š','Trustworthy Garage ðŸ›¡ï¸','100% Reliable ðŸ‘'],
    general:   ['Outstanding Service ðŸ†','Warm & Friendly ðŸ˜Š','Prompt & Efficient âš¡','High-Quality Work ðŸ’Ž','Reasonable Prices ðŸ’°','Exceeded Expectations ðŸŽ¯','Attention to Detail ðŸ”','Smooth Experience âœ¨','Very Professional ðŸ‘”','Wholeheartedly Recommend ðŸ‘'],
  };

  /* â”€â”€ STATE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  let business   = null;   // active business config
  let rating     = 0;
  let keywords   = [];
  let review     = '';
  let stepStack  = [];

  /* â”€â”€ INIT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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
    // â”€â”€ PRIORITY 1: Decode business data embedded in the URL â”€â”€â”€â”€â”€â”€
    // Real customers scan the QR on their phone â€” their localStorage is empty.
    // So the QR URL now contains all needed business data, base64-encoded in ?d=
    try {
      const params  = new URLSearchParams(location.search);
      const encoded = params.get('d');
      if (encoded) {
        const decoded = JSON.parse(decodeURIComponent(atob(encoded)));
        if (decoded && decoded.n) {
          return {
            id:        decoded.id || id || 'unknown',
            name:      decoded.n,
            type:      decoded.t  || 'general',
            googleUrl: decoded.g  || '',
            phone:     decoded.p  || '',
            email:     decoded.e  || '',
            apiKey:    decoded.k  || '',
          };
        }
      }
    } catch(e) { /* fall through to localStorage */ }

    // â”€â”€ PRIORITY 2: Read from localStorage â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // Works when admin opens the link in the same browser they configured.
    try {
      const list = JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
      if (!list.length) return null;
      if (id) return list.find(b => b.id === id) || list[0];
      const activeId = localStorage.getItem(ACTIVE_KEY);
      return list.find(b => b.id === activeId) || list[0];
    } catch(e) { return null; }
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

  /* â”€â”€ NAVIGATION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

  /* â”€â”€ STAR RATING â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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
            document.getElementById('step2-rating-badge').textContent = 'â­'.repeat(rating);
            goTo('view-build');
          } else {
            incStat('shielded');
            document.getElementById('shield-star-text') &&
              (document.getElementById('shield-star-text').textContent = `${rating} star${rating > 1 ? 's' : ''}`);
            goTo('view-feedback');
          }
        }, 420);
      });
    });
  }

  /* â”€â”€ KEYWORD CHIPS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  function loadChips() {
    const wrap = document.getElementById('chips-wrap');
    wrap.innerHTML = '';
    keywords = [];
    const kws = KEYWORDS[business.type] || KEYWORDS.general;
    kws.forEach(kw => { wrap.appendChild(makeChip(kw)); });
    updateGenerateBtn();
  }

  function makeChip(text) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip';
    btn.textContent = text;
    btn.addEventListener('click', () => {
      btn.classList.toggle('selected');
      keywords = Array.from(document.querySelectorAll('.chip.selected')).map(c => c.textContent);
      updateGenerateBtn();
    });
    return btn;
  }

  function addCustomChip() {
    const input = document.getElementById('custom-kw');
    const val = input.value.trim();
    if (!val) return;
    const chip = makeChip('â­ ' + val);
    chip.classList.add('selected');
    document.getElementById('chips-wrap').prepend(chip);
    keywords.unshift('â­ ' + val);
    input.value = '';
    updateGenerateBtn();
  }

  function updateGenerateBtn() {
    document.getElementById('btn-generate').disabled = keywords.length === 0;
  }

  /* â”€â”€ AI REVIEW GENERATION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  async function generateReview() {
    const tone = document.getElementById('sel-tone').value;
    const lang = document.getElementById('sel-lang').value;
    const loader = document.getElementById('ai-loader');
    const card   = document.getElementById('review-card');
    const btnGen = document.getElementById('btn-generate');
    const btnTo  = document.getElementById('btn-to-post');

    card.classList.add('hidden');
    btnTo.classList.add('hidden');
    loader.classList.remove('hidden');
    btnGen.disabled = true;

    try {
      const text = business.apiKey && business.apiKey.length > 10
        ? await callGemini(tone, lang)
        : await synthesise(tone, lang);

      review = text;
      document.getElementById('review-text').value = text;
      loader.classList.add('hidden');
      card.classList.remove('hidden');
      btnTo.classList.remove('hidden');
    } catch {
      review = await synthesise(tone, lang);
      document.getElementById('review-text').value = review;
      loader.classList.add('hidden');
      card.classList.remove('hidden');
      btnTo.classList.remove('hidden');
    } finally {
      btnGen.disabled = false;
    }
  }

  async function callGemini(tone, lang) {
    const toneMap = {
      enthusiastic: 'enthusiastic, warm, detailed (50-60 words)',
      natural:      'natural, conversational, authentic (35-45 words)',
      crisp:        'short, direct, impactful (20-30 words)',
      professional: 'polished, professional, structured (45-55 words)',
    };
    const langMap = {
      english:  'Write in natural English.',
      hinglish: 'Write in Urban Indian Hinglish (mix of casual Hindi and English).',
      spanish:  'Write in natural conversational Spanish.',
      french:   'Write in natural French.',
    };
    const prompt = `Write a genuine ${rating}-star Google review for "${business.name}" (${business.type}).
Highlights to mention: ${keywords.join(', ')}.
Style: ${toneMap[tone] || toneMap.natural}.
${langMap[lang] || langMap.english}
Rules: mention business name once naturally, sound like a real customer, end with recommendation. No hashtags. Return only the review text.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${business.apiKey}`,
      { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ contents:[{parts:[{text:prompt}]}], generationConfig:{maxOutputTokens:180,temperature:0.88} }),
        signal: AbortSignal.timeout(10000) }
    );
    if (!res.ok) throw new Error('Gemini ' + res.status);
    const json = await res.json();
    const out  = json.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!out) throw new Error('empty');
    return out;
  }

  async function synthesise(tone, lang) {
    await new Promise(r => setTimeout(r, 700));
    const biz = business.name;
    const k1  = keywords[0]?.replace(/[^\w\s]/g,'').trim() || 'the exceptional service';
    const k2  = keywords[1]?.replace(/[^\w\s]/g,'').trim() || 'the warm hospitality';
    const k3  = keywords[2]?.replace(/[^\w\s]/g,'').trim() || '';

    if (lang === 'hinglish') {
      const p = [
        `${biz} mein visit karke bahut acha laga! ${k1} toh ekdum first-class tha, aur ${k2} ne experience ko aur bhi better bana diya. Team bahut polite aur helpful thi. Definitely recommend karunga sabko!`,
        `Recently ${biz} gaya aur experience sach mein zabardast raha. ${k1} aur ${k2} dono ne impress kiya. Service bhi fast thi. Will definitely be back soon!`,
      ];
      return p[Math.random()*p.length|0];
    }
    const pools = {
      crisp:        [`Loved ${biz}! ${k1} and ${k2} were outstanding. Highly recommend!`,`Top experience at ${biz}. ${k1} and ${k2} were both excellent. Will return!`],
      natural:      [`Really impressed with ${biz}! ${k1} was spot on and ${k2} made the visit memorable.${k3?` Even ${k3} was a nice touch.`:''} Definitely coming back!`,`Dropped by ${biz} and had a wonderful time. The ${k1} was great, and ${k2} really stood out. Friendly and welcoming all around. Highly recommend!`],
      professional: [`My visit to ${biz} was exemplary. The ${k1} demonstrated clear commitment to quality, and ${k2} exceeded expectations.${k3?` ${k3} was equally impressive.`:''} I recommend their services without reservation.`],
      enthusiastic: [`Absolutely wonderful experience at ${biz}! The ${k1} was phenomenal, and ${k2} completely blew me away.${k3?` I also loved ${k3} â€” such a thoughtful touch.`:''} The team was warm and made every moment feel special. Will 100% be back and will tell everyone I know!`,`If you haven't visited ${biz} yet, you're missing out! From ${k1} to ${k2}, every detail was flawless.${k3?` And ${k3} was the cherry on top.`:''} 5-star experience â€” do yourself a favour and go!`],
    };
    const pool = pools[tone] || pools.enthusiastic;
    return pool[Math.random()*pool.length|0];
  }

  /* â”€â”€ CLIPBOARD & GOOGLE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  async function copy(text) {
    try {
      // Works on HTTPS and localhost
      if (navigator.clipboard && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
        await navigator.clipboard.writeText(text);
        return;
      }
    } catch(e) { /* fallback */ }
    // Fallback for plain HTTP
    try {
      const ta = Object.assign(document.createElement('textarea'),
        { value: text, style: 'position:fixed;left:-9999px;opacity:0' });
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, ta.value.length);
      document.execCommand('copy');
      document.body.removeChild(ta);
    } catch(e) { /* silent */ }
  }

  function showToast(msg = 'âœ… Copied!') {
    const t = document.getElementById('copy-toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
  }

  // Alias for copy toast
  function showCopyToast() {
    showToast('âœ“ Copied to clipboard! Opening Google...');
  }

  /* â”€â”€ BIND BUTTONS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  function bindButtons() {
    // Generate
    document.getElementById('btn-generate')?.addEventListener('click', generateReview);
    document.getElementById('btn-regen')?.addEventListener('click', generateReview);

    // Continue to post
    document.getElementById('btn-to-post')?.addEventListener('click', () => {
      const txt = document.getElementById('review-text').value.trim();
      review = txt || review;
      document.getElementById('preview-text').textContent = review;
      goTo('view-post');
    });

    // Copy only
    document.getElementById('btn-copy-only')?.addEventListener('click', async () => {
      await copy(review); showToast();
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
            <div class="btn-mega-title">âœ“ Copied!</div>
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
      if (!business.phone) {
        showToast('âš ï¸ No WhatsApp number configured. Ask admin to add one.');
        return;
      }
      const data = collectFB();
      const text = encodeURIComponent(
        `ðŸš¨ *Private Customer Feedback (${rating}â˜…)*\n` +
        `Business: ${business.name}\n` +
        `Customer: ${data.name} | ${data.contact}\n` +
        `Issues: ${data.issues}\n\n*Message:*\n"${data.msg}"\n\n_via Zone Digi Tech_`
      );
      window.open(`https://wa.me/${business.phone.replace(/\D/g,'')}?text=${text}`, '_blank');
      showDone(false);
    });

    // Email
    form?.addEventListener('submit', e => {
      e.preventDefault();
      if (!validateFB()) return;
      if (!business.email) {
        showToast('âš ï¸ No email configured. Ask admin to add one.');
        return;
      }
      const data = collectFB();
      const sub  = encodeURIComponent(`Private Feedback: ${rating}â˜… | ${business.name}`);
      const body = encodeURIComponent(`Business: ${business.name}\nRating: ${rating}â˜…\nCustomer: ${data.name}\nContact: ${data.contact}\nIssues: ${data.issues}\n\nMessage:\n${data.msg}`);
      location.href = `mailto:${business.email}?subject=${sub}&body=${body}`;
      showDone(false);
    });
  }

  function validateFB() {
    const msg = document.getElementById('fb-msg')?.value.trim();
    const err = document.getElementById('fb-err');
    if (!msg) { err?.classList.remove('hidden'); document.getElementById('fb-msg')?.focus(); return false; }
    err?.classList.add('hidden');
    return true;
  }

  function collectFB() {
    const msg     = document.getElementById('fb-msg')?.value.trim() || '';
    const name    = document.getElementById('fb-name')?.value.trim() || 'Guest';
    const contact = document.getElementById('fb-contact')?.value.trim() || 'Not provided';
    const issues  = [...document.querySelectorAll('.issue-tag.active')].map(t => t.dataset.issue).join(', ') || 'General';
    return { msg, name, contact, issues };
  }

  /* â”€â”€ DONE SCREEN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  function showDone(isPositive) {
    const icon    = document.getElementById('done-icon');
    const title   = document.getElementById('done-title');
    const msg     = document.getElementById('done-msg');
    const voucher = document.getElementById('voucher-card');

    if (isPositive) {
      icon.textContent  = 'ðŸŽ‰';
      title.textContent = 'Thank you so much!';
      msg.textContent   = `Your review directly supports the team at ${business.name}. We're grateful!`;
      if (voucher) voucher.style.display = 'none';
    } else {
      icon.textContent  = 'ðŸ™';
      title.textContent = 'Feedback Received';
      msg.textContent   = 'Our management has been notified and will respond within 24 hours.';
      // Show voucher if configured
      try {
        const prefs = JSON.parse(localStorage.getItem('sr_prefs_v4') || '{}');
        const code  = prefs.voucherCode;
        const text  = prefs.voucherText;
        if (code && voucher) {
          const codeEl = document.getElementById('voucher-code');
          const noteEl = voucher.querySelector('.voucher-note');
          if (codeEl) codeEl.textContent = code;
          if (noteEl && text) noteEl.textContent = text + ' Show this screen at checkout.';
          voucher.style.display = '';
        } else if (voucher) {
          voucher.style.display = 'none';
        }
      } catch(e) {
        if (voucher) voucher.style.display = 'none';
      }
    }
    showView('view-done');
  }

  /* â”€â”€ RESET â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  function resetFlow() {
    rating = 0; keywords = []; review = '';
    document.querySelectorAll('.star-btn').forEach(b => b.classList.remove('lit'));
    document.getElementById('rating-label').textContent = '';
    document.getElementById('review-card')?.classList.add('hidden');
    document.getElementById('btn-to-post')?.classList.add('hidden');
    document.getElementById('fb-msg') && (document.getElementById('fb-msg').value = '');
    document.querySelectorAll('.issue-tag.active').forEach(t => t.classList.remove('active'));
    stepStack = [];
    showView('view-rate');
  }

  /* â”€â”€ STATS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  function incStat(key) {
    if (!business) return;
    const k = `${STAT_PREFIX}${business.id}_${key}`;
    localStorage.setItem(k, (parseInt(localStorage.getItem(k) || '0', 10) + 1).toString());
  }

  /* â”€â”€ HELPERS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  function getAvatar(type) {
    return { restaurant:'ðŸ½ï¸', cafe:'â˜•', salon:'âœ‚ï¸', clinic:'ðŸ©º', gym:'ðŸ‹ï¸', retail:'ðŸ›ï¸', hotel:'ðŸ¨', auto:'ðŸš—' }[type] || 'â­';
  }
  function getCatLabel(type) {
    return { restaurant:'ðŸ½ï¸ Restaurant & Dining', cafe:'â˜• CafÃ© & Bakery', salon:'âœ‚ï¸ Salon & Spa', clinic:'ðŸ©º Healthcare Clinic', gym:'ðŸ‹ï¸ Gym & Fitness', retail:'ðŸ›ï¸ Retail Store', hotel:'ðŸ¨ Hotel & Resort', auto:'ðŸš— Auto Service', general:'ðŸ’¼ Local Business' }[type] || 'ðŸ’¼ Local Business';
  }

  /* â”€â”€ PUBLIC API â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  return { init, goTo, goBack, addCustomChip };

})();

document.addEventListener('DOMContentLoaded', R.init);

