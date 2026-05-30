// ─── 野造 · Analytics 模块 ───
// Centralized analytics: GA4, PostHog, Clarity, Web Vitals

// ─── Google Analytics 4 ───
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
    dataLayer: unknown[]
    posthog: {
      capture: (event: string, properties?: Record<string, unknown>) => void
      identify: (id: string, traits?: Record<string, unknown>) => void
      init: (key: string, config?: Record<string, unknown>) => void
    }
    clarity: (command: string, ...args: unknown[]) => void
  }
}

export const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_ID || ''
export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || ''
export const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com'
export const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || ''

// ─── Page View ───
export function pageview(url: string) {
  if (typeof window === 'undefined' || !GA4_MEASUREMENT_ID) return

  window.gtag?.('config', GA4_MEASUREMENT_ID, {
    page_path: url,
    page_title: document.title,
  })

  window.posthog?.capture('$pageview', { path: url })
}

// ─── Events ───

export type AnalyticsEvent =
  | 'tutorial_view'
  | 'tutorial_step_complete'
  | 'tutorial_complete'
  | 'material_view'
  | 'material_compare'
  | 'search_perform'
  | 'post_create'
  | 'post_view'
  | 'like_add'
  | 'favorite_add'
  | 'comment_add'
  | 'user_register'
  | 'user_login'
  | 'checkin_create'
  | 'challenge_join'
  | 'notification_click'
  | 'cta_click'
  | 'share_click'

export function trackEvent(
  event: AnalyticsEvent,
  properties?: Record<string, unknown>
) {
  if (typeof window === 'undefined') return

  // GA4
  window.gtag?.('event', event, properties)

  // PostHog
  window.posthog?.capture(event, properties)

  // Clarity (tag for interesting events)
  if (['tutorial_complete', 'post_create', 'user_register'].includes(event)) {
    window.clarity?.('set', 'interesting_event', event)
  }
}

// ─── User Identity ───
export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  if (typeof window === 'undefined') return

  window.gtag?.('set', 'user_properties', { user_id: userId, ...traits })
  window.posthog?.identify(userId, traits)

  // GA4 user_id
  window.gtag?.('config', GA4_MEASUREMENT_ID, { user_id: userId })
}

// ─── E-commerce (future) ───
export function trackViewItem(item: { id: string; name: string; category: string; price?: number }) {
  trackEvent('material_view', {
    currency: 'CNY',
    value: item.price || 0,
    items: [{ item_id: item.id, item_name: item.name, item_category: item.category }],
  })
}

// ─── Conversion ───
export function trackConversion(action: string, value?: number) {
  trackEvent('cta_click', {
    conversion_action: action,
    value: value || 0,
    currency: 'CNY',
  })
}

// ─── Search ───
export function trackSearch(searchTerm: string, resultsCount: number) {
  trackEvent('search_perform', {
    search_term: searchTerm,
    results_count: resultsCount,
  })
}
