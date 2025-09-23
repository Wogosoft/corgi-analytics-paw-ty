import { useEffect, useState } from "react";
import { gaEvent, initScrollTracking, debounce } from "@/lib/analytics";
import { DebugPanel } from "./DebugPanel";
import { HeroSection } from "./HeroSection";
import { WhyHaveCorgi } from "./WhyHaveCorgi";
import { WhyNotHaveCorgi } from "./WhyNotHaveCorgi";
import { FunnyThingsSection } from "./FunnyThingsSection";
import { CorgiGallery } from "./CorgiGallery";
import { CorgiQuiz } from "./CorgiQuiz";
import { CorgiNameGenerator } from "./CorgiNameGenerator";
import { CorgiTabsSection } from "./CorgiTabsSection";
import { NewsletterSection } from "./NewsletterSection";
import { Footer } from "./Footer";
import { Button } from "./ui/button";
import { Volume2 } from "lucide-react";

export function CorgiPage() {
  const [showIdleNudge, setShowIdleNudge] = useState(false);
  const [idleTimer, setIdleTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initialize scroll tracking
    const cleanup = initScrollTracking();

    // Keyboard shortcuts
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only trigger if not typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      let button: HTMLButtonElement | null = null;
      let eventData: { key: string; action: string; timestamp: number } | null =
        null;

      switch (event.key.toLowerCase()) {
        case "b":
          button = document.querySelector(
            '[data-ga="bark_button"]',
          ) as HTMLButtonElement;
          eventData = { key: "b", action: "bark", timestamp: Date.now() };
          break;
        case "t":
          button = document.querySelector(
            '[data-ga="treat_button"]',
          ) as HTMLButtonElement;
          eventData = { key: "t", action: "treat", timestamp: Date.now() };
          break;
        case "g":
          button = document.querySelector(
            '[data-ga="generate_name"]',
          ) as HTMLButtonElement;
          eventData = {
            key: "g",
            action: "generate_name",
            timestamp: Date.now(),
          };
          break;
      }

      if (button && eventData) {
        button.click();
        gaEvent("corgi_keyboard_shortcut", eventData);
      }
    };

    // Idle nudge functionality
    const resetIdleTimer = () => {
      if (idleTimer) {
        clearTimeout(idleTimer);
      }

      setShowIdleNudge(false);

      const timer = setTimeout(() => {
        setShowIdleNudge(true);
        gaEvent("corgi_nudge_shown", {
          idle_duration: 20000,
          timestamp: Date.now(),
        });
      }, 20000); // 20 seconds

      setIdleTimer(timer);
    };

    // Debounced reset function for performance
    const debouncedResetIdle = debounce(resetIdleTimer, 100);

    // Events that reset idle timer
    const resetEvents = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];
    resetEvents.forEach((event) => {
      document.addEventListener(event, debouncedResetIdle, { passive: true });
    });

    // Add keyboard listener
    document.addEventListener("keydown", handleKeyPress);

    // Initialize idle timer
    resetIdleTimer();

    return () => {
      // Cleanup
      cleanup();
      document.removeEventListener("keydown", handleKeyPress);
      resetEvents.forEach((event) => {
        document.removeEventListener(event, debouncedResetIdle);
      });
      if (idleTimer) {
        clearTimeout(idleTimer);
      }
    };
  }, [idleTimer]);

  const handleNudgeClick = () => {
    setShowIdleNudge(false);
    gaEvent("corgi_nudge_click", {
      timestamp: Date.now(),
    });

    // Scroll to a random section
    const sections = ["why-have-corgi", "funny-things"];
    const randomSection = sections[Math.floor(Math.random() * sections.length)];
    document
      .getElementById(randomSection)
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const copyEmoji = (emoji: string) => {
    navigator.clipboard.writeText(emoji).then(() => {
      gaEvent("corgi_copy_to_clipboard", {
        target: "emoji",
        emoji,
        timestamp: Date.now(),
      });

      // Show feedback
      const notification = document.createElement("div");
      notification.innerHTML = `${emoji} Copied!`;
      notification.className =
        "fixed top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-up";
      document.body.appendChild(notification);
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 2000);
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Debug Panel */}
      <DebugPanel />

      {/* Idle nudge */}
      {showIdleNudge && (
        <div className="fixed bottom-4 right-4 z-40 animate-wiggle">
          <Button
            onClick={handleNudgeClick}
            className="shadow-treat animate-pulse"
          >
            <Volume2 className="w-4 h-4 mr-2" />
            Still there? 👋
          </Button>
        </div>
      )}

      {/* Main content */}
      <main>
        <HeroSection />
        <WhyHaveCorgi />
        <WhyNotHaveCorgi />
        <FunnyThingsSection />
        <CorgiGallery />
        <CorgiQuiz />
        <CorgiNameGenerator />
        <CorgiTabsSection />
        <NewsletterSection />
      </main>

      <Footer />

      {/* Hidden emoji buttons for fun */}
      <div className="fixed bottom-4 left-4 flex gap-2 z-40">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyEmoji("🐶")}
          className="opacity-50 hover:opacity-100 transition-opacity"
          title="Copy corgi emoji"
        >
          🐶
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyEmoji("🍑")}
          className="opacity-50 hover:opacity-100 transition-opacity"
          title="Copy corgi butt emoji"
        >
          🍑
        </Button>
      </div>

      {/* Keyboard shortcuts help */}
      <div className="fixed bottom-16 left-4 opacity-30 hover:opacity-80 transition-opacity text-xs text-muted-foreground z-40">
        <div className="bg-card/90 backdrop-blur-sm p-2 rounded border text-center">
          <div>
            Press <kbd className="bg-muted px-1 rounded">B</kbd> to bark
          </div>
          <div>
            Press <kbd className="bg-muted px-1 rounded">T</kbd> for treat
          </div>
          <div>
            Press <kbd className="bg-muted px-1 rounded">G</kbd> to generate
            name
          </div>
        </div>
      </div>
    </div>
  );
}
