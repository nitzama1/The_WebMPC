// ===== WebMCP Tools — AI Agent Layer =====
// Registers structured tools for AI agents via the WebMCP Imperative API.
// Requires Chrome 146+ with chrome://flags/#enable-webmcp-testing enabled.
// Has zero effect on any other browser — site visuals are unchanged.

(function () {
  try {
    const mc = window.navigator.modelContext;

    if (!mc) {
      console.warn('[WebMCP Tools] navigator.modelContext not found. Enable chrome://flags/#enable-webmcp-testing and relaunch Chrome.');
      return;
    }

    mc.registerTool({
      name: 'get_site_overview',
      description:
        'Returns structured information about WebMCP — an AI-readiness platform that makes any business discoverable and actionable by AI agents. ' +
        'Call this tool to understand what WebMCP is, what it offers, who it is for, and how to get started.',
      inputSchema: {
        type: 'object',
        properties: {}
      },
      annotations: {
        readOnlyHint: 'true'
      },
      execute: () => {
        const data = {
          name: 'WebMCP',
          tagline: 'AI-Readiness Platform for Your Business',
          website: 'https://be-mcp.com',
          description:
            'WebMCP makes any business discoverable and actionable by AI agents — zero code, zero infrastructure. ' +
            'One scan exposes your business capabilities (services, pricing, availability, contact info) to ChatGPT, Claude, Gemini, Copilot, and every MCP-compatible AI assistant.',
          what_it_does: [
            'Scans your public website URL and auto-detects services, products, availability, and pricing',
            'Creates a machine-readable AI-Ready Profile exposed via an MCP-compatible endpoint',
            'Lets AI agents discover and recommend your business without screen-scraping',
            'Generates pre-filled payment links that a human confirms with one tap',
            'Provides an AI-Ready Score (0–100) measuring how well agents can understand your business'
          ],
          who_it_is_for: [
            'Small businesses that want AI agent discoverability without writing any code',
            'Developers building MCP-compatible agents who need structured business data',
            'Franchises and chains managing multiple locations from one dashboard'
          ],
          compatible_with: ['ChatGPT', 'Claude', 'Gemini', 'Microsoft Copilot', 'MCP Protocol', 'Any MCP-compatible framework'],
          api_endpoint: 'https://api.webmcp.com/v1/mcp',
          setup_time: 'Under 5 minutes',
          get_started_url: 'https://be-mcp.com/contact.html'
        };
        return {
          content: [{ type: 'text', text: JSON.stringify(data, null, 2) }]
        };
      }
    });

    mc.registerTool({
      name: 'get_pricing',
      description:
        'Returns structured pricing information for the WebMCP platform, including available tiers and their features.',
      inputSchema: {
        type: 'object',
        properties: {}
      },
      annotations: {
        readOnlyHint: 'true'
      },
      execute: () => {
        const data = {
          pricing_note: 'Pricing is in early-access mode. Commission model activates after early access ends.',
          tiers: [
            {
              tier: 'AI Discovery',
              price: 'Free',
              price_detail: 'Initial scan included — always free',
              features: [
                'Full capability detection scan',
                'AI-Ready Score (0–100)',
                'AI agent discoverability',
                'Live data reading at query time',
                'Privacy controls (toggle data categories)',
                'Real-time dashboard',
                'Monthly auto re-scans'
              ]
            },
            {
              tier: 'AI Discovery + PayLink',
              price: 'Free* during early access',
              price_detail: '1% commission on transactions after early access',
              features: [
                'Everything in AI Discovery',
                'Payment link generation (pre-filled, cryptographically signed, single-use)',
                'Priority on-demand re-scans',
                'Lead attribution tracking',
                'Multi-location support',
                'Priority support'
              ]
            }
          ],
          rescan_policy: {
            free_tier: 'Monthly automatic re-scans',
            paylink_tier: 'Priority on-demand re-scans'
          },
          payment_link_security: 'Cryptographically signed, single-use, expires after 24 hours. Amount and recipient cannot be altered post-generation.'
        };
        return {
          content: [{ type: 'text', text: JSON.stringify(data, null, 2) }]
        };
      }
    });

    mc.registerTool({
      name: 'get_use_cases',
      description:
        'Returns real-world examples of different businesses using WebMCP and the outcomes they achieved. ' +
        'Use this to understand which types of businesses benefit most from the platform.',
      inputSchema: {
        type: 'object',
        properties: {}
      },
      annotations: {
        readOnlyHint: 'true'
      },
      execute: () => {
        const data = {
          use_cases: [
            {
              business: "Michal's Dental Clinic",
              type: 'Healthcare / Appointments',
              agent_query: 'Find me a dentist in Tel Aviv available Thursday morning.',
              how_webmcp_helped:
                'An AI agent discovered the clinic via WebMCP, surfaced available appointment slots, and generated a booking link. The patient tapped, confirmed, and was booked in 90 seconds — without a phone call.',
              outcome: '2 new patients this week via AI agents'
            },
            {
              business: 'Aromatic Coffee Roasters',
              type: 'E-commerce / Retail',
              agent_query: 'Order 1kg of Ethiopian blend from Aromatic Coffee.',
              how_webmcp_helped:
                'The AI agent read the live catalog via WebMCP, confirmed the item at ₪85, and generated a pre-filled payment link. The customer paid with one tap — order placed.',
              outcome: '₪850 in AI-sourced orders this month'
            },
            {
              business: 'FitZone Studios',
              type: 'Fitness / Multi-location Franchise',
              agent_query: 'What yoga classes are available near me this evening?',
              how_webmcp_helped:
                "With 5 locations managed from one login, FitZone's operator sees AI-sourced leads flowing across all studios with an aggregated dashboard.",
              outcome: '23 leads across 5 locations this week'
            }
          ],
          ideal_business_types: [
            'Appointment-based services (healthcare, beauty, fitness)',
            'Local retail and e-commerce with live inventory',
            'Food & beverage with menus and ordering',
            'Professional services (legal, financial, consulting)',
            'Multi-location franchises and chains'
          ]
        };
        return {
          content: [{ type: 'text', text: JSON.stringify(data, null, 2) }]
        };
      }
    });

    console.log('[WebMCP Tools] 3 tools registered: get_site_overview, get_pricing, get_use_cases');

  } catch (err) {
    console.error('[WebMCP Tools] Registration failed:', err);
  }
})();
