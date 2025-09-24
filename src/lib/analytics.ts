// Google Analytics 4 helper for corgi website
// Tracks user interactions with custom corgi-themed events
// GA4 Measurement ID: G-TJ4QFGLZJ6

type GtagArgs = [
  type: string,
  eventName: string,
  params?: Record<string, string | number | boolean | null>,
];

declare global {
  interface Window {
    gtag: (...args: GtagArgs) => void;
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
  // Always log for debugging
  console.log("[GA EVENT]", name, params);

  // Send to GA4 if gtag is available
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", name, params);
    console.log("[GA SENT]", name, "✅");
  } else {
    console.warn("[GA ERROR] gtag not available");
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
  let startTime = Date.now();
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
            load_time: Math.round(perfData.loadEventEnd - perfData.navigationStart),
            dom_content_loaded: Math.round(perfData.domContentLoadedEventEnd - perfData.navigationStart),
            first_paint: Math.round(perfData.responseEnd - perfData.navigationStart),
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
 * Test analytics setup - call this manually to verify tracking
 */
export function testAnalytics(): void {
  console.log('🧪 Testing Google Analytics setup...');
  
  // Test 1: Check if gtag is loaded
  if (typeof window !== 'undefined' && window.gtag) {
    console.log('✅ gtag is loaded');
  } else {
    console.error('❌ gtag is not loaded');
    return;
  }
  
  // Test 2: Send test event
  gaEvent('test_analytics', {
    test_parameter: 'test_value',
    timestamp: Date.now(),
  });
  
  // Test 3: Check dataLayer
  if (window.dataLayer && window.dataLayer.length > 0) {
    console.log('✅ dataLayer has data:', window.dataLayer.length, 'items');
    console.log('📊 Latest dataLayer entries:', window.dataLayer.slice(-3));
  } else {
    console.warn('⚠️ dataLayer is empty or not found');
  }
  
  console.log('🧪 Test complete. Check Network tab for requests to google-analytics.com');
}
