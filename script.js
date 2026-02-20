// ===== Dark / Light Mode Toggle =====
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Check saved preference or system preference
const savedTheme = localStorage.getItem('webmcp-theme');
const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme) {
  html.setAttribute('data-theme', savedTheme);
  themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
} else if (systemDark) {
  html.setAttribute('data-theme', 'dark');
  themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('webmcp-theme', next);
  themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
});

// ===== Mobile Menu =====
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.getElementById('navLinks');

mobileMenu.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = mobileMenu.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
  }
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = mobileMenu.querySelectorAll('span');
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
  });
});

// ===== Scroll Animations (Intersection Observer) =====
const animateElements = document.querySelectorAll('.animate-on-scroll');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px'
});

animateElements.forEach(el => observer.observe(el));

// ===== FAQ Accordion =====
function toggleFaq(button) {
  const item = button.closest('.faq-item');
  const isOpen = item.classList.contains('open');

  // Close all FAQs
  document.querySelectorAll('.faq-item').forEach(faq => {
    faq.classList.remove('open');
  });

  // Toggle the clicked one
  if (!isOpen) {
    item.classList.add('open');
  }
}

// ===== Copy Endpoint =====
function copyEndpoint() {
  const url = 'https://api.webmcp.com/v1/mcp';
  const btn = document.getElementById('copyEndpoint');

  navigator.clipboard.writeText(url).then(() => {
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = 'Copy';
      btn.classList.remove('copied');
    }, 2000);
  }).catch(() => {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = url;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = 'Copy';
      btn.classList.remove('copied');
    }, 2000);
  });
}

// ===== Nav Scroll Effect =====
let lastScrollY = 0;
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (scrollY > 100) {
    nav.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
  } else {
    nav.style.boxShadow = 'none';
  }
  lastScrollY = scrollY;
}, { passive: true });

// ===== Animated Counters =====
function animateCounter(element, target, duration) {
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (target - start) * eased);
    element.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// Observe stat numbers
const statNumbers = document.querySelectorAll('.hero-stats .stat-number');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.textContent, 10);
      if (!isNaN(target)) {
        animateCounter(el, target, 1500);
      }
      statsObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => statsObserver.observe(el));

// ===== Smooth anchor scroll offset (compensate for fixed nav) =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      e.preventDefault();
      const navHeight = document.querySelector('.nav').offsetHeight;
      const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ===== Contact Form Handler =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    // Hide form, show success
    contactForm.style.display = 'none';
    document.getElementById('formSuccess').style.display = 'block';
    // In production, integrate with Formspree, SendGrid, or your backend:
    // fetch('https://formspree.io/f/YOUR_FORM_ID', { method: 'POST', body: new FormData(contactForm) });
  });
}


// ===== i18n — Internationalization System =====
const translations = {
  he: {
    // Navigation
    'nav.howItWorks': 'איך זה עובד',
    'nav.features': 'תכונות',
    'nav.useCases': 'מקרי שימוש',
    'nav.pricing': 'תמחור',
    'nav.developers': 'מפתחים',
    'nav.faq': 'שאלות נפוצות',
    'nav.contact': 'צרו קשר',
    'nav.getStarted': 'התחילו עכשיו',

    // Hero
    'hero.badge': 'פלטפורמת מוכנות AI',
    'hero.title': 'הפכו את העסק שלכם<br><span class="highlight">למוכן AI</span>',
    'hero.desc': 'הפכו את העסק שלכם לגלוי ע״י ChatGPT, Claude וכל עוזר AI — תוך פחות מ-5 דקות. בלי קוד. בלי תשתיות. סריקה אחת ואתם באוויר.',
    'hero.cta1': 'סרקו את האתר שלכם — חינם',
    'hero.cta2': '← צפו בתיעוד API',
    'hero.card.name': 'המרפאה של מיכל',
    'hero.card.desc': 'טיפולי שיניים משפחתיים בתל אביב — תורים, ניקוי, הלבנה',
    'hero.card.status': 'אתם באוויר ✓',
    'hero.card.scoreLabel': 'ציון מוכנות AI',
    'hero.chip1': '🗓️ זמינות תורים',
    'hero.chip2': '📍 מיקום ושעות',
    'hero.chip3': '💰 מחירי שירותים',
    'hero.chip4': '📞 פרטי יצירת קשר',
    'hero.stat1': 'שאילתות AI השבוע',
    'hero.stat2': 'קישורים שנוצרו',
    'hero.stat3': 'לידים שהתקבלו',

    // Trust Bar
    'trust.label': 'תואם למסגרות סוכני AI מובילות',

    // How It Works
    'hiw.label': 'איך זה עובד',
    'hiw.title': 'מוכנים ל-AI ב-3 צעדים פשוטים',
    'hiw.desc': 'בלי קוד, בלי תוספים, בלי מפתחים. הכניסו את כתובת האתר ותנו לסוכני AI לגלות את העסק שלכם.',
    'hiw.step1.title': 'הכניסו את כתובת האתר',
    'hiw.step1.desc': 'ספרו לנו את כתובת האתר שלכם ותארו מה העסק מציע בשפה פשוטה. זהו.',
    'hiw.step1.time': '30 שניות',
    'hiw.step2.title': 'אנחנו סורקים ומזהים',
    'hiw.step2.desc': 'המערכת שלנו קוראת את האתר הציבורי שלכם ומזהה אוטומטית שירותים, מוצרים, זמינות ותמחור.',
    'hiw.step2.time': '~2 דקות',
    'hiw.step3.title': 'אתם מוכנים ל-AI ✓',
    'hiw.step3.desc': 'היכולות של העסק שלכם חשופות לסוכני AI באופן מיידי. ChatGPT, Claude וכל עוזר AI יכולים למצוא ולהמליץ על העסק שלכם.',
    'hiw.step3.time': 'מיידי',

    // Features
    'feat.label': 'תכונות',
    'feat.title': 'כל מה שהעסק שלכם צריך כדי להיות מוכן ל-AI',
    'feat.desc': 'פלטפורמה מנוהלת לחלוטין — אנחנו מטפלים בכל המורכבות הטכנית כדי שלא תצטרכו.',
    'feat.f1.title': 'חזית עסקית מוכנת ל-AI',
    'feat.f1.desc': 'העסק שלכם חשוף לסוכני AI באופן אוטומטי. סריקה אחת, גילוי יכולות מיידי. בלי קוד, בלי שרתים לנהל.',
    'feat.f2.title': 'מידע חי, תמיד עדכני',
    'feat.f2.desc': 'אנחנו קוראים את האתר הציבורי שלכם בזמן אמת — בלי מטמון, בלי מידע ישן. כשאתם מעדכנים את האתר, סוכני AI רואים את זה מיד.',
    'feat.f3.title': 'יצירת קישורי תשלום',
    'feat.f3.desc': 'סוכני AI יכולים ליצור קישורי תשלום מוכנים מראש למוצרים שלכם. הלקוחות לוחצים, מאשרים, משלמים — בלי חיכוך.',
    'feat.f4.title': 'ציון מוכנות AI',
    'feat.f4.desc': 'קבלו ציון 0–100 שמודד כמה טוב סוכני AI יכולים להבין ולייצג את העסק שלכם. עקבו אחרי שיפורים לאורך זמן.',
    'feat.f5.title': 'תמיכה ברב-סניפים',
    'feat.f5.desc': 'רשת או זיכיון? נהלו את כל הסניפים מלוגין אחד. כל אתר מקבל פרופיל AI עצמאי.',
    'feat.f6.title': 'בקרת פרטיות',
    'feat.f6.desc': 'אתם קובעים מה סוכני AI רואים. הפעילו או כבו קטגוריות מידע — פרטי קשר, כתובת, תמחור — בשליטה מלאה.',

    // AI Agent Section
    'agent.label': 'לסוכני AI',
    'agent.title': 'סריקה אחת. גילוי AI אינסופי.',
    'agent.desc': 'סוכני AI שולחים שאילתה לנקודת קצה אחת תואמת MCP כדי לגלות יכולות עסקיות, לקרוא מידע חי וליצור קישורי פעולה — ללא צורך באימות.',
    'agent.f1': '<strong>תואם פרוטוקול MCP</strong> — עובד עם ChatGPT, Claude וכל מסגרת תואמת MCP',
    'agent.f2': '<strong>ללא צורך באימות</strong> — פלטפורמה פתוחה, גישה מיידית, מוגבלת קצב להגנה',
    'agent.f3': '<strong>מידע חי בזמן שאילתה</strong> — ללא תוצאות מטמון, תמיד מעודכן',
    'agent.f4': '<strong>מפות יכולות מובנות</strong> — שירותים, זמינות, תמחור בפורמט קריא למכונה',
    'agent.f5': '<strong>פרימיטיבים של קישורי תשלום</strong> — יצירת קישורי תשלום מוכנים להשלמה אנושית',

    // Use Cases
    'use.label': 'מקרי שימוש',
    'use.title': 'תרחישים אמיתיים, תוצאות אמיתיות',
    'use.desc': 'ראו איך עסקים ולקוחות שונים נהנים מ-WebMCP כל יום.',
    'use.c1.name': 'המרפאה של מיכל',
    'use.c1.query': '"תמצא לי רופא שיניים בתל אביב שפנוי ביום חמישי בבוקר."',
    'use.c1.story': 'סוכן AI מגלה את המרפאה של מיכל דרך WebMCP, מציג תורים פנויים ויוצר קישור הזמנה. המטופל לוחץ, מאשר ומוזמן תוך 90 שניות — בלי שיחת טלפון.',
    'use.c1.result': '✓ 2 מטופלים חדשים השבוע דרך סוכני AI',
    'use.c2.name': 'קולי קפה ארומטי',
    'use.c2.query': '"הזמינו 1 ק״ג תערובת אתיופית מקולי קפה ארומטי."',
    'use.c2.story': 'סוכן AI קורא את הקטלוג החי דרך WebMCP, מאשר את הפריט ב-₪85, יוצר קישור תשלום מוכן. הלקוח משלם בלחיצה אחת — ההזמנה בוצעה.',
    'use.c2.result': '✓ ₪850 בהזמנות ממקורות AI החודש',
    'use.c3.name': 'FitZone סטודיו',
    'use.c3.query': '"אילו שיעורי יוגה זמינים בקרבתי הערב?"',
    'use.c3.story': 'עם 5 סניפים מנוהלים מלוגין אחד, מפעיל הזיכיון של FitZone רואה לידים מסוכני AI זורמים לכל הסטודיואים עם תצוגת דשבורד מאוחדת.',
    'use.c3.result': '✓ 23 לידים ב-5 סניפים השבוע',

    // Pricing
    'price.label': 'תמחור',
    'price.title': 'תמחור פשוט ושקוף',
    'price.desc': 'התחילו בחינם עם סריקת מוכנות AI מלאה. שדרגו כשתהיו מוכנים לקישורי תשלום וסריקות מחדש בעדיפות.',
    'price.t1.name': 'גילוי AI',
    'price.t1.price': 'חינם',
    'price.t1.sub': 'סריקה ראשונית כלולה · תמיד בחינם',
    'price.t1.desc': 'היו ניתנים לגילוי ע״י סוכני AI. יכולות העסק, השירותים והזמינות שלכם — חשופים ל-ChatGPT, Claude וכל עוזר AI.',
    'price.t1.f1': 'סריקת זיהוי יכולות מלאה',
    'price.t1.f2': 'ציון מוכנות AI (0–100)',
    'price.t1.f3': 'גילוי ע״י סוכני AI',
    'price.t1.f4': 'קריאת מידע חי',
    'price.t1.f5': 'בקרת פרטיות',
    'price.t1.f6': 'דשבורד בזמן אמת',
    'price.t1.cta': 'התחילו עכשיו',
    'price.t2.badge': 'הכי פופולרי',
    'price.t2.name': 'גילוי AI + PayLink',
    'price.t2.price': 'חינם*',
    'price.t2.sub': 'בתקופת הגישה המוקדמת · 1% עמלה על עסקאות בהמשך',
    'price.t2.desc': 'הכל בגילוי AI, בתוספת יצירת קישורי תשלום וסריקות מחדש בעדיפות כדי לשמור על היכולות שלכם מעודכנות.',
    'price.t2.f1': 'הכל בגילוי AI',
    'price.t2.f2': 'יצירת קישורי תשלום',
    'price.t2.f3': 'סריקות מחדש בעדיפות',
    'price.t2.f4': 'מעקב שיוך לידים',
    'price.t2.f5': 'תמיכה ברב-סניפים',
    'price.t2.f6': 'תמיכה בעדיפות',
    'price.t2.cta': 'התחילו עכשיו',
    'price.rescan.title': '🔄 תמחור סריקה מחדש',
    'price.rescan.desc': 'צריכים לעדכן את פרופיל ה-AI לאחר שינויים באתר? סריקות מחדש על פי דרישה שומרות את היכולות שלכם מעודכנות. המסלול החינמי כולל סריקות אוטומטיות חודשיות. מסלול PayLink כולל סריקות מחדש בעדיפות על פי דרישה.',

    // Developers
    'dev.label': 'למפתחים',
    'dev.title': 'API זיהוי יכולות',
    'dev.desc': 'גלו ושלבו יכולות עסקיות תוך דקות. כוונו את לקוח ה-MCP שלכם לנקודת הקצה שלנו והתחילו לשלוח שאילתות לעסקים מיד.',
    'dev.step1': '<strong>שלחו כתובת אתר</strong> — אנחנו סורקים ומזהים יכולות אוטומטית',
    'dev.step2': '<strong>בדקו את ציון מוכנות ה-AI</strong> — ראו את מפת היכולות ורמת החשיפה',
    'dev.step3': '<strong>שלבו דרך MCP</strong> — קבלו נתונים עסקיים מובנים בסוכן שלכם',
    'dev.rate': 'מגבלות קצב',
    'dev.auth': 'אימות',
    'dev.authVal': 'לא נדרש לשאילתות ציבוריות',
    'dev.errors': 'קודי שגיאה',

    // FAQ
    'faq.label': 'שאלות נפוצות',
    'faq.title': 'שאלות נפוצות',
    'faq.q1': 'איך WebMCP עובד בלי להתקין שום דבר?',
    'faq.a1': 'אנחנו סורקים את האתר הציבורי שלכם ויוצרים פרופיל יכולות קריא ל-AI לחלוטין על הפלטפורמה שלנו. אין מה להתקין באתר שלכם — אנחנו קוראים את המידע הציבורי שלכם בזמן אמת, בדיוק כמו שמנועי חיפוש קוראים את האתר שלכם לאינדוקס.',
    'faq.q2': 'האם סוכני AI יכולים לבצע רכישות או להזמין תורים באופן אוטונומי?',
    'faq.a2': 'לא — בכוונה. סוכני AI יכולים לגלות את העסק שלכם וליצור קישורים מוכנים, אבל כל עסקה דורשת אדם אמיתי שילחץ על הקישור ויאשר. זה מבטל הזמנות ספאם וסיכוני הונאה. ה-AI מכין, האדם משלים.',
    'faq.q3': 'אילו נתונים סוכני AI רואים על העסק שלי?',
    'faq.a3': 'רק את נתוני האתר הציבורי שלכם — אותו מידע שכל מבקר יכול לראות. אתם שולטים בדיוק אילו קטגוריות נראות (פרטי קשר, כתובת, תמחור וכו\') דרך מתגי פרטיות. קטגוריות שנכבו לא יוצגו לעולם לסוכני AI.',
    'faq.q4': 'מהו ציון מוכנות ה-AI?',
    'faq.a4': 'ציון מוכנות ה-AI שלכם (0–100) מודד כמה טוב סוכני AI יכולים להבין ולייצג את העסק שלכם. הוא מתחשב בגורמים כמו נתונים מובנים, תיאורי שירותים, בהירות תמחור ונגישות ליצירת קשר. ציון גבוה יותר אומר גילוי AI טוב יותר ויותר לידים.',
    'faq.q5': 'כמה זמן לוקח להתחיל?',
    'faq.a5': 'פחות מ-5 דקות. הכניסו את הכתובת, תארו את העסק, בדקו את היכולות שזיהינו, ואשרו בלחיצה אחת. פרופיל ה-AI שלכם פעיל ברגע שתסיימו — בלי תקופת המתנה, בלי שלבי אימות.',
    'faq.q6': 'אילו עוזרי AI יכולים למצוא את העסק שלי?',
    'faq.a6': 'כל סוכן AI תואם MCP — כולל ChatGPT, Claude, Gemini, Copilot ומסגרות סוכנים מותאמות אישית. אנחנו משתמשים בתקן MCP הפתוח (Model Context Protocol), שמבטיח תאימות רחבה ככל שמערכת סוכני ה-AI גדלה.',
    'faq.q7': 'איך סריקות מחדש עובדות?',
    'faq.a7': 'אנחנו קוראים את האתר שלכם בזמן אמת בכל שאילתת AI, כך שמידע בסיסי נשאר מעודכן. כשאתם עושים שינויים משמעותיים (שירותים חדשים, תמחור חדש), אתם יכולים להפעיל סריקה מחדש כדי לעדכן את פרופיל היכולות המלא ואת ציון מוכנות ה-AI. המסלול החינמי כולל סריקות אוטומטיות חודשיות; מסלול PayLink כולל סריקות מחדש בעדיפות על פי דרישה.',
    'faq.q8': 'כמה מאובטחים קישורי התשלום?',
    'faq.a8': 'כל קישור תשלום חתום קריפטוגרפית, חד-פעמי, ופג תוקפו אחרי 24 שעות. הסכום, הפריט והנמען לא ניתנים לשינוי לאחר היצירה. אין אחסון של אישורי עסק או נתוני תשלום בפלטפורמה שלנו.',

    // CTA
    'cta.title': 'מוכנים להפוך את העסק שלכם למוכן AI?',
    'cta.desc': 'הצטרפו למאות עסקים שכבר ניתנים לגילוי ע״י ChatGPT, Claude ועוזרי AI ברחבי העולם.',
    'cta.btn': 'קבלו את ציון מוכנות ה-AI שלכם — חינם',

    // Footer
    'footer.brand': 'הופכים כל עסק לגלוי ע״י סוכני AI. בלי קוד, בלי תשתיות, בלי טרחה.',
    'footer.product': 'מוצר',
    'footer.apiDocs': 'תיעוד API',
    'footer.mcpEndpoint': 'נקודת קצה MCP',
    'footer.integrationGuide': 'מדריך שילוב',
    'footer.company': 'חברה',
    'footer.about': 'אודות',
    'footer.blog': 'בלוג',
    'footer.privacy': 'מדיניות פרטיות',
    'footer.terms': 'תנאי שימוש',

    // Contact Page
    'contact.label': 'צרו קשר',
    'contact.title': 'בואו נהפוך את העסק שלכם למוכן AI',
    'contact.desc': 'בין אם אתם רוצים להתחיל, יש לכם שאלות, או צריכים תמיכה — אנחנו כאן בשבילכם.',
    'contact.onboard.title': 'התחילו הטמעה',
    'contact.onboard.desc': 'מוכנים להפוך את העסק שלכם לגלוי ע״י סוכני AI? שלחו את האתר שלכם ונתחיל.',
    'contact.sales.title': 'פנייה מסחרית',
    'contact.sales.desc': 'רוצים ללמוד עוד על הפלטפורמה, התמחור או אפשרויות ארגוניות? הצוות שלנו מוכן לעזור.',
    'contact.support.title': 'תמיכה טכנית',
    'contact.support.desc': 'צריכים עזרה עם פרופיל ה-AI, זיהוי יכולות או שילוב API? אנחנו כאן בשבילכם.',
    'contact.form.title': 'שלחו לנו הודעה',
    'contact.form.desc': 'מלאו את הטופס ונחזור אליכם תוך 24 שעות.',
    'contact.form.name': 'שם מלא',
    'contact.form.namePh': 'ישראל ישראלי',
    'contact.form.email': 'כתובת אימייל',
    'contact.form.type': 'סוג פנייה',
    'contact.form.typePh': 'בחרו אפשרות',
    'contact.form.typeOnboard': 'בקשת הטמעה',
    'contact.form.typeSales': 'פנייה מסחרית',
    'contact.form.typeSupport': 'תמיכה טכנית',
    'contact.form.typeOther': 'אחר',
    'contact.form.website': 'כתובת אתר <span class="optional">(אופציונלי)</span>',
    'contact.form.message': 'הודעה',
    'contact.form.messagePh': 'ספרו לנו על העסק שלכם ואיך נוכל לעזור...',
    'contact.form.submit': 'שלחו הודעה',
    'contact.form.successTitle': 'ההודעה נשלחה!',
    'contact.form.successDesc': 'תודה שפניתם אלינו. הצוות שלנו יחזור אליכם תוך 24 שעות.',
    'contact.form.successBtn': 'חזרה לדף הבית',
    'contact.sidebar.emailTitle': 'שלחו לנו אימייל',
    'contact.sidebar.bookTitle': 'הזמינו הדגמה',
    'contact.sidebar.bookDesc': 'ראו את WebMCP בפעולה עם הדרכה מותאמת אישית של הפלטפורמה שלנו.',
    'contact.sidebar.bookBtn': 'קבעו שיחה',
    'contact.sidebar.faqTitle': 'תשובות מהירות',
    'contact.sidebar.faqDesc': 'בדקו את השאלות הנפוצות שלנו לתשובות על שאלות נפוצות.',
    'contact.sidebar.faqLink': '← צפו בשאלות נפוצות',
  }
};

// Store original English content from DOM
const originalTexts = {};

function cacheOriginalTexts() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (!originalTexts[key]) {
      originalTexts[key] = el.innerHTML;
    }
  });
  // Cache placeholder texts
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (!originalTexts['ph:' + key]) {
      originalTexts['ph:' + key] = el.getAttribute('placeholder');
    }
  });
}

function setLanguage(lang) {
  const langToggle = document.getElementById('langToggle');

  if (lang === 'he') {
    html.setAttribute('lang', 'he');
    html.setAttribute('dir', 'rtl');
    langToggle.textContent = 'EN';

    // Apply Hebrew translations
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations.he[key]) {
        el.innerHTML = translations.he[key];
      }
    });

    // Apply Hebrew placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (translations.he[key]) {
        el.setAttribute('placeholder', translations.he[key]);
      }
    });

  } else {
    html.setAttribute('lang', 'en');
    html.setAttribute('dir', 'ltr');
    langToggle.textContent = 'עב';

    // Restore original English content
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (originalTexts[key]) {
        el.innerHTML = originalTexts[key];
      }
    });

    // Restore original placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (originalTexts['ph:' + key]) {
        el.setAttribute('placeholder', originalTexts['ph:' + key]);
      }
    });
  }

  localStorage.setItem('webmcp-lang', lang);
}

// Initialize i18n
document.addEventListener('DOMContentLoaded', () => {
  cacheOriginalTexts();

  const savedLang = localStorage.getItem('webmcp-lang');
  if (savedLang && savedLang !== 'en') {
    setLanguage(savedLang);
  }
});

// Language toggle button
const langToggle = document.getElementById('langToggle');
if (langToggle) {
  langToggle.addEventListener('click', () => {
    const currentLang = html.getAttribute('lang') || 'en';
    const nextLang = currentLang === 'en' ? 'he' : 'en';
    setLanguage(nextLang);
  });
}
