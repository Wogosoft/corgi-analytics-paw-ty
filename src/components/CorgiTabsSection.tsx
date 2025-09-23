import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { gaEvent } from "@/lib/analytics";
import {
  Sparkles,
  Zap,
  Scissors,
  Bath,
  Brush,
  Heart,
  MapPin,
  Clock,
  Trophy,
} from "lucide-react";

interface TabContent {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  tips: {
    icon: React.ReactNode;
    title: string;
    description: string;
  }[];
}

const tabContents: Record<string, TabContent> = {
  floof: {
    id: "floof",
    title: "Floof Mode",
    icon: <Sparkles className="w-5 h-5" />,
    description:
      "Everything you need to know about keeping your corgi's magnificent coat fluffy and fabulous!",
    tips: [
      {
        icon: <Brush className="w-5 h-5" />,
        title: "Daily Brushing is Key",
        description:
          "Brush your corgi daily during shedding season (spring/fall) and 2-3 times per week otherwise. Use an undercoat rake for best results.",
      },
      {
        icon: <Bath className="w-5 h-5" />,
        title: "Bath Time Strategy",
        description:
          "Bathe only when necessary (every 6-8 weeks) unless they've gotten into something messy. Over-bathing can strip natural oils.",
      },
      {
        icon: <Scissors className="w-5 h-5" />,
        title: "Professional Grooming",
        description:
          "Visit a professional groomer every 6-8 weeks for nail trims, ear cleaning, and sanitary trims. Never shave a corgi!",
      },
      {
        icon: <Heart className="w-5 h-5" />,
        title: "Embrace the Fluff",
        description:
          "Accept that corgi hair will become part of your home decor. Invest in quality lint rollers and vacuum regularly!",
      },
    ],
  },
  sport: {
    id: "sport",
    title: "Sport Mode",
    icon: <Zap className="w-5 h-5" />,
    description:
      "Keep your corgi healthy and happy with the right amount of exercise and mental stimulation!",
    tips: [
      {
        icon: <MapPin className="w-5 h-5" />,
        title: "Daily Walks Required",
        description:
          "Aim for 30-60 minutes of walking daily, split into 2-3 sessions. Corgis love exploring new routes and sniffing everything!",
      },
      {
        icon: <Clock className="w-5 h-5" />,
        title: "Mental Exercise",
        description:
          "Puzzle toys, training sessions, and hide-and-seek games are essential. A tired mind equals a well-behaved corgi!",
      },
      {
        icon: <Trophy className="w-5 h-5" />,
        title: "Watch Those Jumps",
        description:
          "Avoid excessive jumping on/off furniture to protect their long backs. Use ramps or steps when possible.",
      },
      {
        icon: <Zap className="w-5 h-5" />,
        title: "Herding Activities",
        description:
          "Channel their herding instincts with activities like agility training, fetch, or even herding balls in the yard!",
      },
    ],
  },
};

export function CorgiTabsSection() {
  const [activeTab, setActiveTab] = useState<string>("floof");

  const handleTabChange = (newTab: string) => {
    const previousTab = activeTab;
    setActiveTab(newTab);

    gaEvent("corgi_tab_change", {
      section: "care_modes",
      from: previousTab,
      to: newTab,
      timestamp: Date.now(),
    });
  };

  return (
    <section className="py-20 gradient-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Corgi Care Modes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Master both the art of floof maintenance and keeping your corgi
            physically and mentally satisfied!
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-8 shadow-soft">
              <TabsTrigger
                value="floof"
                className="flex items-center gap-2 py-3 data-[state=active]:shadow-corgi"
              >
                <Sparkles className="w-4 h-4" />
                Floof Mode
              </TabsTrigger>
              <TabsTrigger
                value="sport"
                className="flex items-center gap-2 py-3 data-[state=active]:shadow-corgi"
              >
                <Zap className="w-4 h-4" />
                Sport Mode
              </TabsTrigger>
            </TabsList>

            {Object.values(tabContents).map((content, tabIndex) => (
              <TabsContent
                key={content.id}
                value={content.id}
                className="animate-fade-in-up"
              >
                <Card className="shadow-corgi mb-8">
                  <CardContent className="p-8 text-center">
                    <div className="flex justify-center text-primary mb-4 text-4xl">
                      {content.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{content.title}</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {content.description}
                    </p>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {content.tips.map((tip, index) => (
                    <Card
                      key={index}
                      className="shadow-soft hover:shadow-corgi transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="text-primary mt-1">{tip.icon}</div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg mb-2">
                              {tip.title}
                            </h4>
                            <p className="text-muted-foreground leading-relaxed">
                              {tip.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Fun fact for each mode */}
                <Card className="mt-8 shadow-treat animate-fade-in-up">
                  <CardContent className="p-6 text-center bg-gradient-to-r from-primary/5 to-secondary/5">
                    <div className="text-2xl mb-2">
                      {content.id === "floof" ? "✨" : "🏃‍♂️"}
                    </div>
                    <p className="font-medium text-sm">
                      {content.id === "floof"
                        ? "Fun Fact: A corgi can shed up to 2 pounds of fur per year!"
                        : "Fun Fact: Corgis were originally bred to herd cattle despite their size!"}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
}
