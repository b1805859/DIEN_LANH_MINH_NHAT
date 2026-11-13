import { integrationSettings } from '@/lib/integrations/settings';

type EventName =
  | 'phone_click' | 'zalo_click' | 'ai_open' | 'web_vital'
  | 'booking_submit' | 'booking_success' | 'booking_error'
  | 'consultation_submit' | 'consultation_success' | 'consultation_error';
type AnalyticsWindow = Window & { gtag?: (command: string, event: string, parameters: Record<string, string | number | boolean>) => void };

/** Only aggregate interaction metadata; never pass form values or URL queries. */
export function trackEvent(name: EventName, parameters: Record<string, string | number | boolean> = {}) {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production' || !integrationSettings.googleAnalyticsId) return;
  if (/^\/admin(?:\/|$)/.test(window.location.pathname)) return;
  try {
    (window as AnalyticsWindow).gtag?.('event', name, {
      ...parameters,
      page_path: window.location.pathname,
    });
  } catch {
    // Measurement must never interrupt a booking or a contact action.
  }
}
