import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { gaEvent } from "@/lib/analytics";
import {
  AlertTriangle,
  Clock,
  Scissors,
  Wind,
  Volume2,
  Footprints,
} from "lucide-react";

interface CorgiCon {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  details: string;
}

const corgiCons: CorgiCon[] = [
  {
    id: "shedding",
    title: "The Great Fur Explosion",
    description:
      "They shed. A lot. Like, tumbleweeds of fur rolling around your house.",
    icon: <Scissors className="w-5 h-5" />,
    details:
      "Corgis have a double coat that sheds year-round, with heavy shedding seasons twice a year. You'll find corgi fur in places you didn't even know existed. Invest in a good vacuum and lint rollers... lots of lint rollers.",
  },
  {
    id: "zoomies",
    title: "Midnight Zoomies",
    description:
      "3 AM energy bursts that sound like a small horse galloping through your home.",
    icon: <Clock className="w-5 h-5" />,
    details:
      "Corgis are notorious for getting sudden bursts of energy at the most inconvenient times. They'll suddenly decide to sprint laps around your coffee table at full speed, usually when you're trying to sleep.",
  },
  {
    id: "herding",
    title: "Ankle Herding Squad",
    description:
      "They might try to herd you, your kids, and anything else that moves.",
    icon: <Footprints className="w-5 h-5" />,
    details:
      'Bred to herd cattle, corgis retain strong herding instincts. Don\'t be surprised if they try to "manage" your family by gently nipping at heels or attempting to gather everyone in one room.',
  },
  {
    id: "barking",
    title: "Professional Alarm System",
    description:
      "They will alert you to every leaf that falls, every car that passes.",
    icon: <Volume2 className="w-5 h-5" />,
    details:
      "Corgis take their watchdog duties very seriously. They'll bark at delivery trucks, squirrels, their own reflection, and sometimes just because they feel like it. Training can help, but some chattiness is just part of their charm.",
  },
  {
    id: "stubborn",
    title: "Selective Hearing Syndrome",
    description:
      "Smart dogs who know exactly what you want... and choose to ignore it.",
    icon: <AlertTriangle className="w-5 h-5" />,
    details:
      "Corgis are intelligent and independent, which means they'll often weigh whether following your command is worth their time. They're not disobedient, they're just... very selective about when to listen.",
  },
  {
    id: "exercise",
    title: "Energy Level: Nuclear",
    description:
      "Despite those short legs, they need a surprising amount of exercise.",
    icon: <Wind className="w-5 h-5" />,
    details:
      "Don't let the cute short legs fool you - corgis were bred for herding and have serious stamina. They need daily walks, mental stimulation, and play time, or they'll find their own entertainment (usually involving your furniture).",
  },
];

export function WhyNotHaveCorgi() {
  const handleAccordionChange = (itemId: string, isOpen: boolean) => {
    gaEvent("corgi_accordion_toggle", {
      section: "why_not",
      item: itemId,
      state: isOpen ? "open" : "close",
    });
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why <span className="italic">Not</span> Have a Corgi?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Let's be honest - corgis aren't perfect. Here are the delightfully
            challenging aspects of corgi ownership you should know about.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="multiple" className="space-y-4">
            {corgiCons.map((con, index) => (
              <AccordionItem
                key={con.id}
                value={con.id}
                className="border-2 border-border rounded-lg px-4 shadow-soft hover:shadow-corgi transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <AccordionTrigger
                  className="hover:no-underline py-6"
                  onClick={() => {
                    // We need to determine if it's opening or closing
                    const isCurrentlyOpen = document.querySelector(
                      `[data-state="open"][data-radix-collection-item][value="${con.id}"]`,
                    );
                    handleAccordionChange(con.id, !isCurrentlyOpen);
                  }}
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className="text-primary">{con.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">
                        {con.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {con.description}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="pb-6 pt-2">
                  <div className="ml-10 p-4 bg-muted/50 rounded-lg">
                    <p className="text-foreground leading-relaxed">
                      {con.details}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center mt-12 p-6 bg-muted/30 rounded-lg animate-fade-in-up">
            <p className="text-lg font-medium mb-2">But honestly... 🤷‍♀️</p>
            <p className="text-muted-foreground">
              Even with all these "flaws," most corgi owners wouldn't trade
              their furry potato for anything in the world!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
