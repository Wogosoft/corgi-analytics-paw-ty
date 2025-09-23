import { Button } from "@/components/ui/button";
import { gaEvent } from "@/lib/analytics";
import heroImage from "@/assets/corgi-hero.jpg";

export function HeroSection() {
  const handleCtaClick = (ctaId: string, label: string) => {
    gaEvent("corgi_cta_click", {
      section: "hero",
      cta_id: ctaId,
      label,
    });

    // Scroll to appropriate section
    const targetId = ctaId === "adopt_vibe" ? "why-have-corgi" : "funny-things";
    const element = document.getElementById(targetId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-sky opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center space-y-8 animate-fade-in-up">
          {/* Hero image */}
          <div className="relative mx-auto w-full max-w-2xl">
            <img
              src={heroImage}
              alt="Happy corgi with a big smile sitting in a sunny field"
              className="w-full h-auto rounded-2xl shadow-corgi hover:shadow-treat transition-all duration-300 hover-wiggle"
            />
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground">
            <span className="block">Corgis:</span>
            <span className="block gradient-corgi bg-clip-text text-transparent">
              Short Legs,
            </span>
            <span className="block text-secondary">Big Hearts</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover why these adorable, low-riding companions are stealing
            hearts worldwide with their wiggling butts and endless charm.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              size="lg"
              className="px-8 py-6 text-lg font-semibold shadow-corgi hover:shadow-treat hover-bounce transition-all duration-300"
              onClick={() => handleCtaClick("adopt_vibe", "Adopt the Vibe")}
              data-ga="adopt_vibe_button"
            >
              🐕 Adopt the Vibe
            </Button>

            <Button
              variant="secondary"
              size="lg"
              className="px-8 py-6 text-lg font-semibold shadow-soft hover:shadow-corgi hover-bounce transition-all duration-300"
              onClick={() => handleCtaClick("see_funny", "See Funny Stuff")}
              data-ga="see_funny_button"
            >
              😂 See Funny Stuff
            </Button>
          </div>

          {/* Scroll indicator */}
          <div className="pt-12 animate-pulse">
            <div className="w-6 h-10 border-2 border-muted-foreground rounded-full mx-auto relative">
              <div className="w-1 h-3 bg-muted-foreground rounded-full mx-auto mt-2 animate-bounce" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Scroll for more cuteness
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
