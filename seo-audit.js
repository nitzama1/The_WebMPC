/**
 * WebMCP SEO Audit Tool
 * Analyzes SEO elements and provides actionable recommendations
 */

class SEOAuditor {
  constructor() {
    this.results = {
      score: 0,
      checks: [],
      warnings: [],
      errors: [],
      recommendations: []
    };
  }

  runAudit() {
    this.checkSearchEngineVerification();
    this.checkMetaTags();
    this.checkHeadings();
    this.checkImages();
    this.checkLinks();
    this.checkStructuredData();
    this.checkPerformance();
    this.checkMobileFriendly();
    this.calculateScore();
    this.generateReport();
  }

  checkSearchEngineVerification() {
    const googleMeta = document.querySelector('meta[name="google-site-verification"]');
    const bingMeta = document.querySelector('meta[name="msvalidate.01"]');
    const yandexMeta = document.querySelector('meta[name="yandex-verification"]');

    if (googleMeta) {
      this.addCheck('Google Verification', 'pass', 'Google verification meta tag found');
    } else {
      this.addCheck('Google Verification', 'info', 'Google verification meta tag not found (optional if using file method)');
    }

    if (bingMeta) {
      this.addCheck('Bing Verification', 'pass', 'Bing verification meta tag found');
    } else {
      this.addCheck('Bing Verification', 'warning', 'Bing verification meta tag not found');
      this.addRecommendation('Add Bing Webmaster verification: <meta name="msvalidate.01" content="YOUR_CODE">');
    }

    if (yandexMeta) {
      this.addCheck('Yandex Verification', 'pass', 'Yandex verification meta tag found');
    } else {
      this.addCheck('Yandex Verification', 'info', 'Yandex verification not configured');
    }
  }

  checkMetaTags() {
    const metaDescription = document.querySelector('meta[name="description"]');
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    const metaViewport = document.querySelector('meta[name="viewport"]');
    const canonical = document.querySelector('link[rel="canonical"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    const twitterCard = document.querySelector('meta[name="twitter:card"]');

    if (metaDescription) {
      const length = metaDescription.content.length;
      if (length >= 120 && length <= 160) {
        this.addCheck('Meta Description', 'pass', `Length: ${length} characters (optimal: 120-160)`);
      } else if (length > 0) {
        this.addCheck('Meta Description', 'warning', `Length: ${length} characters (optimal: 120-160)`);
        this.addRecommendation('Optimize meta description length to 120-160 characters for better search result snippets');
      } else {
        this.addCheck('Meta Description', 'error', 'Missing meta description');
        this.addError('Meta description is missing');
      }
    } else {
      this.addCheck('Meta Description', 'error', 'Missing meta description tag');
      this.addError('Meta description tag is missing');
    }

    if (metaViewport) {
      this.addCheck('Meta Viewport', 'pass', 'Viewport meta tag present for mobile responsiveness');
    } else {
      this.addCheck('Meta Viewport', 'error', 'Missing viewport meta tag');
      this.addError('Viewport meta tag is missing - critical for mobile SEO');
    }

    if (canonical) {
      this.addCheck('Canonical URL', 'pass', `Canonical: ${canonical.href}`);
    } else {
      this.addCheck('Canonical URL', 'warning', 'Missing canonical link tag');
      this.addRecommendation('Add canonical link to prevent duplicate content issues');
    }

    if (ogTitle && ogDescription && ogImage) {
      this.addCheck('Open Graph Tags', 'pass', 'All required OG tags present');
    } else {
      const missing = [];
      if (!ogTitle) missing.push('og:title');
      if (!ogDescription) missing.push('og:description');
      if (!ogImage) missing.push('og:image');
      this.addCheck('Open Graph Tags', 'warning', `Missing: ${missing.join(', ')}`);
      this.addRecommendation('Add missing Open Graph tags for better social media sharing');
    }

    if (twitterCard) {
      this.addCheck('Twitter Card', 'pass', 'Twitter Card tag present');
    } else {
      this.addCheck('Twitter Card', 'warning', 'Missing Twitter Card tag');
      this.addRecommendation('Add Twitter Card meta tags for better Twitter sharing');
    }
  }

  checkHeadings() {
    const h1 = document.querySelectorAll('h1');
    const h2s = document.querySelectorAll('h2');
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const headingOrder = [];

    if (h1.length === 0) {
      this.addCheck('H1 Heading', 'error', 'Missing H1 tag');
      this.addError('Page has no H1 heading - critical for SEO');
    } else if (h1.length === 1) {
      this.addCheck('H1 Heading', 'pass', `One H1 found: "${h1[0].textContent.substring(0, 50)}..."`);
    } else {
      this.addCheck('H1 Heading', 'warning', `Multiple H1s found (${h1.length})`);
      this.addRecommendation('Use only one H1 tag per page');
    }

    if (h2s.length > 0) {
      this.addCheck('H2 Headings', 'pass', `${h2s.length} H2 headings found`);
    } else {
      this.addCheck('H2 Headings', 'warning', 'No H2 headings found');
      this.addRecommendation('Add H2 headings to structure content');
    }

    let skip = false;
    headings.forEach(h => {
      const level = parseInt(h.tagName[1]);
      headingOrder.push(level);
    });

    for (let i = 1; i < headingOrder.length; i++) {
      if (headingOrder[i] - headingOrder[i-1] > 1) {
        this.addCheck('Heading Hierarchy', 'warning', 'Heading levels skip (e.g., H1 to H3)');
        this.addRecommendation('Maintain proper heading hierarchy (H1 → H2 → H3, not H1 → H3)');
        break;
      }
    }
  }

  checkImages() {
    const images = document.querySelectorAll('img');
    let imagesWithoutAlt = 0;
    let imagesWithEmptyAlt = 0;

    images.forEach(img => {
      if (!img.hasAttribute('alt')) {
        imagesWithoutAlt++;
      } else if (img.alt.trim() === '') {
        imagesWithEmptyAlt++;
      }
    });

    if (images.length === 0) {
      this.addCheck('Images', 'info', 'No images found on page');
    } else {
      const totalIssues = imagesWithoutAlt + imagesWithEmptyAlt;
      if (totalIssues === 0) {
        this.addCheck('Image Alt Text', 'pass', `All ${images.length} images have alt attributes`);
      } else {
        this.addCheck('Image Alt Text', 'warning', `${totalIssues}/${images.length} images missing or have empty alt text`);
        this.addRecommendation('Add descriptive alt text to all images for accessibility and SEO');
      }

      let largeImages = 0;
      images.forEach(img => {
        if (img.naturalWidth > 2000 || img.naturalHeight > 2000) {
          largeImages++;
        }
      });
      if (largeImages > 0) {
        this.addCheck('Image Size', 'warning', `${largeImages} images may be oversized (>2000px)`);
        this.addRecommendation('Optimize large images to improve page load speed');
      }
    }
  }

  checkLinks() {
    const links = document.querySelectorAll('a');
    const internalLinks = [];
    const externalLinks = [];
    let brokenLinks = 0;

    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        if (href.startsWith('http') && !href.includes(window.location.hostname)) {
          externalLinks.push(link);
        } else if (href.startsWith('/') || href.startsWith('./') || href.startsWith('../') || href.startsWith('#')) {
          if (href !== '#') {
            internalLinks.push(link);
          }
        }
      }
    });

    this.addCheck('Internal Links', 'info', `${internalLinks.length} internal links found`);
    this.addCheck('External Links', 'info', `${externalLinks.length} external links found`);

    const linksWithNoRel = externalLinks.filter(link => !link.rel || !link.rel.includes('nofollow'));
    if (linksWithNoRel.length > 10) {
      this.addCheck('External Link Attributes', 'warning', `${linksWithNoRel.length} external links without rel="nofollow"`);
      this.addRecommendation('Consider adding rel="nofollow" to external links that pass SEO value');
    }
  }

  checkStructuredData() {
    const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
    
    if (jsonLdScripts.length === 0) {
      this.addCheck('Structured Data (JSON-LD)', 'warning', 'No JSON-LD structured data found');
      this.addRecommendation('Add JSON-LD structured data (schema.org) for rich search results');
      return;
    }

    let validSchemas = 0;
    jsonLdScripts.forEach(script => {
      try {
        const data = JSON.parse(script.textContent);
        if (data['@context'] && data['@type']) {
          validSchemas++;
        }
      } catch (e) {
        this.addCheck('Structured Data (JSON-LD)', 'error', 'Invalid JSON-LD syntax');
        this.addError('JSON-LD contains syntax errors');
      }
    });

    if (validSchemas > 0) {
      this.addCheck('Structured Data (JSON-LD)', 'pass', `${validSchemas} valid schema(s) found`);
    }
  }

  checkPerformance() {
    if (window.performance) {
      const timing = window.performance.timing;
      if (timing) {
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        if (loadTime > 0 && loadTime < 3000) {
          this.addCheck('Page Load Time', 'pass', `Load time: ${(loadTime / 1000).toFixed(2)}s (good)`);
        } else if (loadTime >= 3000) {
          this.addCheck('Page Load Time', 'warning', `Load time: ${(loadTime / 1000).toFixed(2)}s (consider optimizing)`);
          this.addRecommendation('Optimize page load time for better user experience and SEO');
        }
      }
    }

    const scripts = document.querySelectorAll('script[src]');
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    this.addCheck('Resources', 'info', `${scripts.length} external scripts, ${stylesheets.length} stylesheets`);
  }

  checkMobileFriendly() {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport && viewport.content.includes('width=device-width')) {
      this.addCheck('Mobile Responsive', 'pass', 'Viewport configured for mobile devices');
    } else {
      this.addCheck('Mobile Responsive', 'error', 'Mobile viewport not properly configured');
      this.addError('Mobile viewport configuration is critical for mobile SEO');
    }

    const fontSize = window.getComputedStyle(document.body).fontSize;
    if (parseFloat(fontSize) >= 16) {
      this.addCheck('Font Size', 'pass', `Base font size: ${fontSize} (mobile-friendly)`);
    } else {
      this.addCheck('Font Size', 'warning', `Base font size: ${fontSize} (consider increasing to 16px for mobile)`);
    }

    const touchTargets = document.querySelectorAll('a, button');
    let smallTouchTargets = 0;
    touchTargets.forEach(target => {
      const rect = target.getBoundingClientRect();
      if (rect.width < 44 || rect.height < 44) {
        smallTouchTargets++;
      }
    });

    if (smallTouchTargets > 0) {
      this.addCheck('Touch Targets', 'warning', `${smallTouchTargets} elements smaller than 44x44px (harder to tap on mobile)`);
      this.addRecommendation('Increase touch target sizes to at least 44x44px for better mobile usability');
    } else {
      this.addCheck('Touch Targets', 'pass', 'All touch targets are appropriately sized');
    }
  }

  calculateScore() {
    const totalChecks = this.results.checks.length;
    const passed = this.results.checks.filter(c => c.status === 'pass').length;
    const warnings = this.results.checks.filter(c => c.status === 'warning').length;
    const errors = this.results.checks.filter(c => c.status === 'error').length;

    let score = Math.round((passed / totalChecks) * 100);
    score -= errors * 10;
    score -= warnings * 5;
    score = Math.max(0, Math.min(100, score));

    this.results.score = score;
  }

  addCheck(category, status, message) {
    this.results.checks.push({ category, status, message });
  }

  addError(message) {
    this.results.errors.push(message);
  }

  addRecommendation(message) {
    this.results.recommendations.push(message);
  }

  generateReport() {
    console.log('='.repeat(60));
    console.log('🔍 SEO AUDIT REPORT');
    console.log('='.repeat(60));
    console.log(`\n📊 Overall SEO Score: ${this.results.score}/100\n`);

    if (this.results.errors.length > 0) {
      console.log('❌ CRITICAL ISSUES:');
      this.results.errors.forEach((err, i) => console.log(`   ${i + 1}. ${err}`));
      console.log('');
    }

    if (this.results.recommendations.length > 0) {
      console.log('💡 RECOMMENDATIONS:');
      this.results.recommendations.forEach((rec, i) => console.log(`   ${i + 1}. ${rec}`));
      console.log('');
    }

    console.log('📋 DETAILED CHECKS:');
    this.results.checks.forEach(check => {
      const icon = check.status === 'pass' ? '✅' : check.status === 'warning' ? '⚠️' : check.status === 'error' ? '❌' : 'ℹ️';
      console.log(`   ${icon} ${check.category}: ${check.message}`);
    });

    console.log('\n' + '='.repeat(60));
  }

  exportJSON() {
    return JSON.stringify(this.results, null, 2);
  }

  exportHTML() {
    let html = `
      <div class="seo-audit-report">
        <h2>🔍 SEO Audit Report</h2>
        <div class="score-box">
          <div class="score ${this.results.score >= 80 ? 'good' : this.results.score >= 50 ? 'fair' : 'poor'}">
            ${this.results.score}
          </div>
          <span>Overall SEO Score</span>
        </div>
    `;

    if (this.results.errors.length > 0) {
      html += `
        <div class="section errors">
          <h3>❌ Critical Issues (${this.results.errors.length})</h3>
          <ul>
            ${this.results.errors.map(err => `<li>${err}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    if (this.results.recommendations.length > 0) {
      html += `
        <div class="section recommendations">
          <h3>💡 Recommendations (${this.results.recommendations.length})</h3>
          <ul>
            ${this.results.recommendations.map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    html += `
      <div class="section checks">
        <h3>📋 Detailed Checks</h3>
        <ul>
          ${this.results.checks.map(check => {
            const icon = check.status === 'pass' ? '✅' : check.status === 'warning' ? '⚠️' : check.status === 'error' ? '❌' : 'ℹ️';
            return `<li><strong>${icon} ${check.category}:</strong> ${check.message}</li>`;
          }).join('')}
        </ul>
      </div>
    </div>
    `;

    return html;
  }
}

// Run audit on page load or when called
if (typeof window !== 'undefined') {
  window.SEOAuditor = SEOAuditor;

  // Auto-run on console call
  window.runSEOAudit = function() {
    const auditor = new SEOAuditor();
    auditor.runAudit();
    return auditor;
  };
}

// Export for Node.js environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SEOAuditor;
}
