// Google Analytics 4 helper for corgi website
// Tracks user interactions with custom corgi-themed events
// GA4 Measurement ID: G-TJ4QFGLZJ6

declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
  }
}

export interface GAEvent {
  name: string;
  params?: Record<string, string | number | boolean | null>;
}

/**
 * Send a Google Analytics 4 event with corgi-themed naming
 * @param name Event name (should be snake_case, prefixed with corgi_)
 * @param params Event parameters (should be camelCase)
 */
export function gaEvent(
  name: string,
  params: Record<string, string | number | boolean | null> = {},
): void {
  // Send to GTM dataLayer
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({
      event: name,
      ...params,
    });
    console.log('[GTM EVENT]', name, params);
  }
}

/**
 * Track scroll depth milestones
 */
const scrollDepthTracked = new Set<number>();
export function trackScrollDepth(): void {
  const scrollPercent = Math.round(
    (window.scrollY /
      (document.documentElement.scrollHeight - window.innerHeight)) *
      100,
  );

  const milestones = [25, 50, 75, 100];
  for (const milestone of milestones) {
    if (scrollPercent >= milestone && !scrollDepthTracked.has(milestone)) {
      scrollDepthTracked.add(milestone);
      gaEvent("scroll_depth", {
        section: "page",
        percent: milestone,
        timestamp: Date.now(),
      });
    }
  }
}

/**
 * Track video progress
 */
export function trackVideoProgress(
  video: HTMLVideoElement,
  component: string,
): void {
  const progressThresholds = [25, 50, 75];
  const trackedThresholds = new Set<number>();

  const handleProgress = () => {
    const percent = Math.round((video.currentTime / video.duration) * 100);

    for (const threshold of progressThresholds) {
      if (percent >= threshold && !trackedThresholds.has(threshold)) {
        trackedThresholds.add(threshold);
        gaEvent("video_progress", {
          component,
          percent: threshold,
          duration: video.duration,
        });
      }
    }
  };

  video.addEventListener("play", () => {
    gaEvent("video_start", { component });
  });

  video.addEventListener("timeupdate", handleProgress);

  video.addEventListener("ended", () => {
    gaEvent("video_complete", { component });
  });
}

/**
 * Extract domain from email for privacy-safe tracking
 */
export function getEmailDomain(email: string): string {
  const match = email.match(/@(.+)$/);
  return match ? match[1].toLowerCase() : "unknown";
}

/**
 * Debounce utility for event tracking
 */
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Initialize scroll tracking
 */
export function initScrollTracking(): () => void {
  const debouncedTrackScroll = debounce(trackScrollDepth, 100);

  window.addEventListener("scroll", debouncedTrackScroll, { passive: true });

  return () => {
    window.removeEventListener("scroll", debouncedTrackScroll);
  };
}

/**
 * Check if debug mode is enabled
 */
export function isDebugMode(): boolean {
  return new URLSearchParams(window.location.search).get("debug") === "1";
}

/**
 * Track user engagement time
 */
export function trackEngagementTime(): void {
  const startTime = Date.now();
  let lastActiveTime = startTime;
  
  const trackEngagement = () => {
    const now = Date.now();
    const totalTime = Math.round((now - startTime) / 1000);
    const activeTime = Math.round((lastActiveTime - startTime) / 1000);
    
    gaEvent('engagement_time', {
      total_time_seconds: totalTime,
      active_time_seconds: activeTime,
    });
  };

  const resetActiveTime = () => {
    lastActiveTime = Date.now();
  };

  // Track user activity
  ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
    document.addEventListener(event, resetActiveTime, { passive: true });
  });

  // Track engagement every 30 seconds
  setInterval(trackEngagement, 30000);
  
  // Track final engagement on page unload
  window.addEventListener('beforeunload', trackEngagement);
}

/**
 * Track performance metrics
 */
export function trackPerformance(): void {
  if (typeof window !== 'undefined' && 'performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (perfData) {
          gaEvent('page_performance', {
            load_time: Math.round(perfData.loadEventEnd - perfData.fetchStart),
            dom_content_loaded: Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart),
            first_paint: Math.round(perfData.responseEnd - perfData.fetchStart),
          });
        }
      }, 1000);
    });
  }
}

/**
 * Enhanced page view tracking with additional context
 */
export function trackPageView(path: string, title?: string): void {
  gaEvent('page_view', {
    page_path: path,
    page_title: title || document.title,
    user_agent: navigator.userAgent,
    screen_resolution: `${screen.width}x${screen.height}`,
    viewport_size: `${window.innerWidth}x${window.innerHeight}`,
    timestamp: Date.now(),
  });
}

/**
 * Consent Mode Helper Functions
 */

export interface ConsentSettings {
  ad_storage: 'granted' | 'denied';
  ad_user_data: 'granted' | 'denied';
  ad_personalization: 'granted' | 'denied';
  analytics_storage: 'granted' | 'denied';
  personalization_storage: 'granted' | 'denied';
}

/**
 * Get current consent status from localStorage
 */
export function getConsentStatus(): ConsentSettings | null {
  const consentChoice = localStorage.getItem('corgi_consent_choice');
  if (consentChoice) {
    try {
      return JSON.parse(consentChoice) as ConsentSettings;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Check if user has made a consent choice
 */
export function hasConsented(): boolean {
  return localStorage.getItem('corgi_consent_choice') !== null;
}

/**
 * Update consent settings
 */
export function updateConsentSettings(settings: ConsentSettings): void {
  if (typeof window !== 'undefined' && (window as Window & { updateConsent?: (settings: ConsentSettings) => void }).updateConsent) {
    (window as Window & { updateConsent: (settings: ConsentSettings) => void }).updateConsent(settings);
  }
}

/**
 * Show consent banner (by clearing stored consent)
 */
export function resetConsent(): void {
  localStorage.removeItem('corgi_consent_choice');
  localStorage.removeItem('corgi_consent_timestamp');
  // Reload to show banner
  window.location.reload();
}

/**
 * Get consent choice timestamp
 */
export function getConsentTimestamp(): number | null {
  const timestamp = localStorage.getItem('corgi_consent_timestamp');
  return timestamp ? parseInt(timestamp) : null;
}

/**
 * Check if consent has expired (default: 365 days)
 */
export function isConsentExpired(expiryDays = 365): boolean {
  const timestamp = getConsentTimestamp();
  if (!timestamp) return true;
  
  const expiryMs = expiryDays * 24 * 60 * 60 * 1000;
  return Date.now() - timestamp > expiryMs;
}


