import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { gaEvent, getEmailDomain } from "@/lib/analytics";
import { Mail, Check, Heart, Send } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [wantsMemes, setWantsMemes] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) return;

    setIsSubmitting(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const emailDomain = getEmailDomain(email);

    gaEvent("corgi_newsletter_submit", {
      section: "newsletter",
      email_domain: emailDomain,
      wants_memes: wantsMemes,
      timestamp: Date.now(),
    });

    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const handleMemesToggle = (checked: boolean) => {
    setWantsMemes(checked);

    gaEvent("corgi_newsletter_toggle", {
      section: "newsletter",
      checked: checked,
      timestamp: Date.now(),
    });
  };

  const reset = () => {
    setEmail("");
    setWantsMemes(false);
    setIsSubmitted(false);
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="shadow-treat animate-fade-in-up">
              <CardContent className="p-8 space-y-6">
                <div className="text-6xl mb-4">🎉</div>

                <h3 className="text-2xl font-bold">Welcome to the Pack!</h3>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  Thanks for joining our corgi-loving community!
                  {wantsMemes &&
                    " Get ready for some seriously adorable memes in your inbox!"}
                </p>

                <div className="flex items-center justify-center gap-2 text-primary">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">Subscription confirmed!</span>
                </div>

                <Button
                  variant="outline"
                  onClick={reset}
                  className="hover-bounce"
                >
                  Subscribe Another Email
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stay in the Loop
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get the latest corgi tips, adorable photos, and maybe some memes
            delivered straight to your inbox!
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <Card className="shadow-corgi animate-fade-in-up">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center mb-6">
                  <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">
                    Join the Corgi Community
                  </h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="text-base py-3"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex items-start space-x-3 p-4 rounded-lg bg-muted/30">
                  <Checkbox
                    id="memes"
                    checked={wantsMemes}
                    onCheckedChange={handleMemesToggle}
                    disabled={isSubmitting}
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor="memes"
                      className="text-base font-medium cursor-pointer flex items-center gap-2"
                    >
                      Send me corgi memes
                      <Heart className="w-4 h-4 text-red-500" />
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Because who doesn't need more corgi content in their life?
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full py-3 text-base shadow-corgi hover:shadow-treat hover-bounce"
                  disabled={isSubmitting || !email.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Subscribing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Subscribe
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  No spam, just pure corgi goodness. Unsubscribe anytime.
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Newsletter preview */}
          <div className="mt-8 text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="font-medium">2,847</span>
              <span className="text-muted-foreground">
                corgi lovers already subscribed!
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
