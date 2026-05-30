// ─── 野造 · Analytics Scripts ───
// GA4 + PostHog + Clarity + Web Vitals — loaded only in production

import { GA4_MEASUREMENT_ID, POSTHOG_KEY, POSTHOG_HOST, CLARITY_ID } from '@/lib/analytics'

export function AnalyticsScripts() {
  // Don't render scripts in development
  if (process.env.NODE_ENV !== 'production') {
    return null
  }

  return (
    <>
      {/* Google Analytics 4 */}
      {GA4_MEASUREMENT_ID && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA4_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                  send_page_view: true,
                  cookie_flags: 'SameSite=None;Secure',
                });
              `,
            }}
          />
        </>
      )}

      {/* PostHog */}
      {POSTHOG_KEY && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags resetGroupsForFlags onFeatureFlags onSurveysLoaded onSurveyDisplayed onSurveyClosed get_decide get_distinct_id get_groups get_session_property get_session_replay_properties set_config".split(" "),function(t){e[u]=e[u]||{},o.forEach(function(n){e[u][n]=function(){var o=Array.prototype.slice.call(arguments);(o.unshift(n),e[u].push(o)),g(e[u],n)}})})}(o=window,document);
              posthog.init('${POSTHOG_KEY}', {
                api_host: '${POSTHOG_HOST}',
                capture_pageview: false,
                capture_pageleave: true,
                loaded: function(posthog) {
                  if (false) posthog.debug(); // Set to true to debug in dev
                }
              });
            `,
          }}
        />
      )}

      {/* Microsoft Clarity */}
      {CLARITY_ID && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${CLARITY_ID}");
            `,
          }}
        />
      )}
    </>
  )
}
