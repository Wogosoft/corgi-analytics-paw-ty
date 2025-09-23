// Google Analytics 4 helper for corgi website
// Tracks user interactions with custom corgi-themed events

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
  console.log("[GA]", name, params);

  // Send to GA4 if gtag is available
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", name, params);
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
