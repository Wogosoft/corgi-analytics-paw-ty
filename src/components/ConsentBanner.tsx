import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Cookie, X, Sparkles, CheckCircle2 } from "lucide-react";
import { gaEvent } from "@/lib/analytics";

interface ConsentSettings {
  ad_storage: "granted" | "denied";
  ad_user_data: "granted" | "denied";
  ad_personalization: "granted" | "denied";
  analytics_storage: "granted" | "denied";
  personalization_storage: "granted" | "denied";
}

declare global {
  interface Window {
    updateConsent: (settings: ConsentSettings) => void;
  }
}

export function ConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Check if user has already made a consent choice
    const consentChoice = localStorage.getItem("corgi_consent_choice");
    const consentTimestamp = localStorage.getItem("corgi_consent_timestamp");
    const CONSENT_EXPIRY = 365 * 24 * 60 * 60 * 1000; // 365 days

    if (consentChoice && consentTimestamp) {
      const isExpired =
        Date.now() - parseInt(consentTimestamp) > CONSENT_EXPIRY;
      if (isExpired) {
        setShowBanner(true);
      }
    } else {
      // Show banner after a brief delay for better UX
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const handleClose = (consentFn: () => void) => {
    setIsClosing(true);
    setTimeout(() => {
      consentFn();
      setShowBanner(false);
      setIsClosing(false);
    }, 300);
  };

  const handleAcceptAll = () => {
    const consent: ConsentSettings = {
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      analytics_storage: "granted",
      personalization_storage: "granted",
    };

    window.updateConsent(consent);

    gaEvent("consent_granted", {
      consent_type: "all",
      timestamp: Date.now(),
    });
  };

  const handleRejectAll = () => {
    const consent: ConsentSettings = {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
      personalization_storage: "denied",
    };

    window.updateConsent(consent);

    gaEvent("consent_denied", {
      consent_type: "all",
      timestamp: Date.now(),
    });
  };

  const handleEssentialOnly = () => {
    const consent: ConsentSettings = {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "granted", // Allow basic analytics
      personalization_storage: "denied",
    };

    window.updateConsent(consent);

    gaEvent("consent_granted", {
      consent_type: "essential_only",
      timestamp: Date.now(),
    });
  };

  if (!showBanner) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-end justify-center p-4 pointer-events-none sm:items-center transition-opacity duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        animation: isClosing ? 'fadeOut 0.3s ease-out' : 'fadeIn 0.3s ease-out'
      }}
    >
      {/* Animated backdrop with gradient */}
      <div
        className="fixed inset-0 pointer-events-auto transition-all duration-300"
        style={{
          background: 'radial-gradient(circle at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.8) 100%)',
          backdropFilter: 'blur(8px)',
        }}
        onClick={() => setShowDetails(false)}
      />
      
      {/* Fancy consent card */}
      <Card 
        className={`relative w-full max-w-2xl p-8 pointer-events-auto bg-gradient-to-br from-background via-background to-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/90 border-2 border-primary/20 shadow-[0_20px_70px_rgba(0,0,0,0.4)] transition-all duration-300 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
        style={{
          animation: isClosing ? 'slideDown 0.3s ease-out' : 'slideUp 0.3s ease-out',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(var(--primary), 0.1)',
        }}
      >
        {/* Decorative gradient border effect */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20 opacity-50 blur-xl" />
        
        {/* Close button with fancy hover effect */}
        <button
          onClick={() => handleClose(handleRejectAll)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all duration-200 hover:rotate-90 hover:scale-110"
          aria-label="Close banner"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative">
          {/* Header with animated icon */}
          <div className="flex items-start gap-4 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl animate-pulse" />
              <div className="relative p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 backdrop-blur-sm border border-primary/30">
                <Cookie className="h-8 w-8 text-primary animate-bounce" style={{ animationDuration: '3s' }} />
              </div>
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                <span className="text-3xl animate-bounce" style={{ animationDuration: '2s' }}>🐕</span>
                We Value Your Privacy
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This corgi-tastic website uses cookies and similar technologies to
                improve your browsing experience, analyze site traffic, and
                personalize content. We respect your privacy and give you control
                over your data.
              </p>
            </div>
          </div>

          {/* Expandable details with smooth animation */}
          {showDetails && (
            <div 
              className="mb-6 p-5 bg-gradient-to-br from-muted/80 to-muted/40 rounded-xl border border-primary/10 text-sm space-y-4 backdrop-blur-sm animate-in slide-in-from-top duration-300"
              style={{
                animation: 'slideIn 0.3s ease-out'
              }}
            >
              <div className="flex items-start gap-3 group hover:translate-x-1 transition-transform">
                <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <strong className="block text-base mb-1 flex items-center gap-2">
                    Essential Cookies
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </strong>
                  <p className="text-muted-foreground">
                    Required for the site to function properly. These cannot
                    be disabled.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 group hover:translate-x-1 transition-transform">
                <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                  <Cookie className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <strong className="block text-base mb-1">Analytics Cookies</strong>
                  <p className="text-muted-foreground">
                    Help us understand how you interact with our site so we
                    can make improvements.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 group hover:translate-x-1 transition-transform">
                <div className="p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                  <Cookie className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <strong className="block text-base mb-1">Advertising Cookies</strong>
                  <p className="text-muted-foreground">
                    Used to deliver relevant ads and track ad campaign
                    performance.
                  </p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm font-medium text-primary hover:text-primary/80 hover:underline mb-6 transition-all inline-flex items-center gap-1"
          >
            {showDetails ? "Hide details ▲" : "Learn more about cookies ▼"}
          </button>

          {/* Fancy buttons with gradients and animations */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <Button
              onClick={() => handleClose(handleAcceptAll)}
              className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 border-0"
              size="lg"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Accept All
            </Button>
            <Button
              onClick={() => handleClose(handleEssentialOnly)}
              variant="outline"
              className="flex-1 border-2 hover:border-primary hover:bg-primary/5 font-semibold hover:scale-105 transition-all duration-200"
              size="lg"
            >
              <Shield className="h-4 w-4 mr-2" />
              Essential Only
            </Button>
            <Button
              onClick={() => handleClose(handleRejectAll)}
              variant="ghost"
              className="flex-1 hover:bg-muted font-semibold hover:scale-105 transition-all duration-200"
              size="lg"
            >
              Reject All
            </Button>
          </div>

          {/* Footer text with icon */}
          <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
            <Shield className="h-3 w-3" />
            Your choice will be saved for 365 days. Change anytime in the footer.
          </p>
        </div>
      </Card>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes slideDown {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(20px);
            opacity: 0;
          }
        }
        @keyframes slideIn {
          from {
            transform: translateY(-10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

