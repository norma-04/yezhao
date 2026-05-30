// ─── 野造 · Web Vitals 上报 ───
// Reports Core Web Vitals to analytics

type MetricName = 'LCP' | 'FID' | 'INP' | 'CLS' | 'TTFB' | 'FCP'

interface Metric {
  name: MetricName
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  id: string
}

/**
 * Send Web Vitals to Google Analytics 4
 */
function sendToGA4({ name, value, rating, delta, id }: Metric) {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'web_vitals', {
    event_category: 'Web Vitals',
    event_label: id,
    metric_name: name,
    metric_value: Math.round(name === 'CLS' ? delta * 1000 : delta),
    metric_rating: rating,
    value: Math.round(delta),
    non_interaction: true,
  })
}

/**
 * Send Web Vitals to PostHog
 */
function sendToPostHog({ name, value, rating }: Metric) {
  if (typeof window === 'undefined' || !window.posthog) return

  window.posthog.capture('$web_vitals', {
    metric_name: name,
    metric_value: value,
    metric_rating: rating,
  })
}

/**
 * Determine rating based on thresholds
 */
function getRating(name: MetricName, value: number): Metric['rating'] {
  switch (name) {
    case 'LCP':
      return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor'
    case 'FID':
    case 'INP':
      return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor'
    case 'CLS':
      return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor'
    case 'TTFB':
      return value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor'
    case 'FCP':
      return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor'
    default:
      return 'good'
  }
}

/**
 * Report Web Vitals metric
 */
export function reportWebVitals(metric: Metric) {
  // Only report in production; log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}: ${metric.value} (${metric.rating})`)
    return
  }

  // Send to analytics
  sendToGA4(metric)
  sendToPostHog(metric)
}

/**
 * Performance observer helper
 */
export function observeWebVitals() {
  if (typeof window === 'undefined') return

  // LCP
  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      if (entries.length > 0) {
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & { startTime: number }
        reportWebVitals({
          name: 'LCP',
          value: lastEntry.startTime,
          rating: getRating('LCP', lastEntry.startTime),
          delta: lastEntry.startTime,
          id: 'lcp-' + Date.now(),
        })
      }
    })
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
  } catch { /* Not supported */ }

  // CLS
  try {
    let clsValue = 0
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const layoutShift = entry as PerformanceEntry & { hadRecentInput: boolean; value: number }
        if (!layoutShift.hadRecentInput) {
          clsValue += layoutShift.value
        }
      }
      reportWebVitals({
        name: 'CLS',
        value: clsValue,
        rating: getRating('CLS', clsValue),
        delta: clsValue,
        id: 'cls-' + Date.now(),
      })
    })
    clsObserver.observe({ type: 'layout-shift', buffered: true })
  } catch { /* Not supported */ }

  // INP (Interaction to Next Paint)
  try {
    const inpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const interaction = entry as PerformanceEntry & { duration: number }
        reportWebVitals({
          name: 'INP',
          value: interaction.duration,
          rating: getRating('INP', interaction.duration),
          delta: interaction.duration,
          id: 'inp-' + Date.now(),
        })
      }
    })
    inpObserver.observe({ type: 'first-input', buffered: true })
  } catch { /* Not supported */ }
}
