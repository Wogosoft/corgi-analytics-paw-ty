import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { gaEvent } from "@/lib/analytics";
import { Volume2, Cookie, Crown, Zap } from "lucide-react";

interface FunFact {
  id: string;
  title: string;
  content: string;
  icon: React.ReactNode;
}

const funFacts: FunFact[] = [
  {
    id: "corgi_butts",
    title: "Corgi Butts Drive Traffic",
    content:
      "There's actual scientific evidence that corgi butts increase website engagement by 47%*. Their fluffy, wiggling rear ends are so irresistible that they've become an internet phenomenon. Instagram accounts dedicated solely to corgi butts have millions of followers. *Statistics may be slightly exaggerated for comedic effect.",
    icon: <Zap className="w-5 h-5" />,
  },
  {
    id: "royal_roots",
    title: "Royal Roots",
    content:
      "Queen Elizabeth II owned more than 30 corgis during her reign, all descended from her first corgi, Susan, who was an 18th birthday gift. The royal corgis lived in luxury at Buckingham Palace, had their own staff, and even had their own room. They also famously appeared in the 2012 Olympics opening ceremony alongside the Queen!",
    icon: <Crown className="w-5 h-5" />,
  },
  {
    id: "zoomies_101",
    title: "Zoomies 101",
    content:
      'The scientific term for "zoomies" is actually Frenetic Random Activity Periods (FRAPs). Corgis are particularly prone to these bursts of energy, often triggered by baths, walks, or just because it\'s Tuesday. During zoomies, corgis can reach speeds up to 25 mph on those tiny legs, creating what experts call "the sausage rocket effect."',
    icon: <Zap className="w-5 h-5" />,
  },
];

export function FunnyThingsSection() {
  const [treatCount, setTreatCount] = useState(0);
  const [isBarking, setIsBarking] = useState(false);

  const handleBark = () => {
    setIsBarking(true);
    setTimeout(() => setIsBarking(false), 500);

    // Play bark sound if available
    try {
      const audio = new Audio(
        "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAcBTuU2vPTeCgGO6fs9LhYFQhNsunh",
      ); // Placeholder bark sound data
      audio.play();
    } catch (e) {
      // Fallback - just visual feedback
    }

    gaEvent("corgi_bark_click", {
      section: "funny_things",
      timestamp: Date.now(),
    });
  };

  const handleTreat = () => {
    const newCount = treatCount + 1;
    setTreatCount(newCount);

    // Add treat bounce animation
    const button = document.querySelector('[data-ga="treat_button"]');
    if (button) {
      button.classList.add("treat-bounce");
      setTimeout(() => button.classList.remove("treat-bounce"), 400);
    }

    gaEvent("corgi_treat_given", {
      section: "funny_things",
      count: newCount,
      timestamp: Date.now(),
    });

    // Check for milestones
    if ([5, 10, 20, 50].includes(newCount)) {
      // Trigger confetti effect (you could add a confetti library here)
      gaEvent("corgi_treat_milestone", {
        section: "funny_things",
        count: newCount,
        milestone: true,
      });

      // Show celebration message
      const celebration = document.createElement("div");
      celebration.innerHTML = "🎉 Milestone! 🎉";
      celebration.className =
        "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-primary z-50 pointer-events-none animate-bounce";
      document.body.appendChild(celebration);
      setTimeout(() => document.body.removeChild(celebration), 2000);
    }
  };

  const handleAccordionChange = (itemId: string) => {
    // Since we can't easily detect open/close state, we'll just track the toggle
    gaEvent("corgi_accordion_toggle", {
      section: "funny_things",
      item: itemId,
      timestamp: Date.now(),
    });
  };

  return (
    <section id="funny-things" className="py-20 gradient-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Funny Things About Corgis
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From royal connections to internet fame, corgis are full of
            surprises!
          </p>
        </div>

        {/* Interactive buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            onClick={handleBark}
            className={`px-6 py-3 shadow-corgi hover:shadow-treat transition-all duration-300 ${
              isBarking ? "animate-wiggle" : "hover-bounce"
            }`}
            data-ga="bark_button"
          >
            <Volume2 className="w-5 h-5 mr-2" />
            Woof! ({isBarking ? "Barking..." : "Make a Sound"})
          </Button>

          <Button
            variant="secondary"
            onClick={handleTreat}
            className="px-6 py-3 shadow-soft hover:shadow-treat transition-all duration-300"
            data-ga="treat_button"
          >
            <Cookie className="w-5 h-5 mr-2" />
            Give a Treat ({treatCount} given)
          </Button>
        </div>

        {/* Fun facts accordion */}
        <div className="max-w-3xl mx-auto mb-8">
          <Accordion type="multiple" className="space-y-4">
            {funFacts.map((fact, index) => (
              <AccordionItem
                key={fact.id}
                value={fact.id}
                className="border-2 border-border rounded-lg px-4 shadow-soft hover:shadow-corgi transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <AccordionTrigger
                  className="hover:no-underline py-6"
                  onClick={() => handleAccordionChange(fact.id)}
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className="text-primary">{fact.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{fact.title}</h3>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="pb-6 pt-2">
                  <div className="ml-10 p-4 bg-muted/50 rounded-lg">
                    <p className="text-foreground leading-relaxed">
                      {fact.content}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Treat counter celebration */}
        {treatCount > 0 && (
          <Card className="max-w-md mx-auto shadow-treat animate-fade-in-up">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-2">🍪</div>
              <h3 className="text-lg font-semibold mb-2">
                Treats Given: {treatCount}
              </h3>
              <p className="text-muted-foreground">
                {treatCount < 5 && "Keep going! Corgis love treats!"}
                {treatCount >= 5 &&
                  treatCount < 10 &&
                  "You're a generous human! 🐕"}
                {treatCount >= 10 &&
                  treatCount < 20 &&
                  "Corgi heaven! They adore you! 💖"}
                {treatCount >= 20 && "You've achieved Peak Corgi Spoiling! 🏆"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
