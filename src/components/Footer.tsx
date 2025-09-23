import { Button } from '@/components/ui/button';
import { gaEvent } from '@/lib/analytics';
import { ArrowUp, Heart, Github, Twitter, Mail } from 'lucide-react';

export function Footer() {
  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    gaEvent('corgi_back_to_top', {
      section: 'footer',
      timestamp: Date.now(),
    });
  };

  const handleNavClick = (label: string, href?: string) => {
    gaEvent('corgi_nav_click', {
      section: 'footer',
      label,
      href,
      timestamp: Date.now(),
    });
  };

  return (
    <footer className="gradient-cream py-12 border-t border-border">
      <div className="container mx-auto px-4">
        {/* Back to top button */}
        <div className="text-center mb-8">
          <Button
            onClick={handleBackToTop}
            variant="outline"
            size="lg"
            className="shadow-soft hover:shadow-corgi hover-bounce transition-all duration-300"
            data-ga="back_to_top"
          >
            <ArrowUp className="w-5 h-5 mr-2" />
            Back to Top
          </Button>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* About section */}
            <div className="text-center md:text-left space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 justify-center md:justify-start">
                <span className="text-2xl">🐕</span>
                Corgi Central
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Your one-stop destination for all things corgi. From care tips 
                to adorable photos, we celebrate these short-legged royals!
              </p>
            </div>
            
            {/* Quick links */}
            <div className="text-center space-y-4">
              <h4 className="font-semibold">Quick Links</h4>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    handleNavClick('why_have_corgi');
                    document.getElementById('why-have-corgi')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="block w-full text-muted-foreground hover:text-primary transition-colors"
                >
                  Why Have a Corgi?
                </button>
                <button
                  onClick={() => {
                    handleNavClick('funny_things');
                    document.getElementById('funny-things')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="block w-full text-muted-foreground hover:text-primary transition-colors"
                >
                  Funny Things
                </button>
                <button
                  onClick={() => {
                    handleNavClick('quiz');
                    document.querySelector('[id*="quiz"]')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="block w-full text-muted-foreground hover:text-primary transition-colors"
                >
                  Corgi Quiz
                </button>
              </div>
            </div>
            
            {/* Connect section */}
            <div className="text-center md:text-right space-y-4">
              <h4 className="font-semibold">Connect</h4>
              <div className="flex justify-center md:justify-end gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleNavClick('github', 'https://github.com')}
                  className="hover-bounce"
                >
                  <Github className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleNavClick('twitter', 'https://twitter.com')}
                  className="hover-bounce"
                >
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleNavClick('email', 'mailto:hello@corgis.dev')}
                  className="hover-bounce"
                >
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Credits and copyright */}
          <div className="border-t border-border pt-8 text-center space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500 fill-current" />
                <span>for corgi lovers everywhere</span>
              </div>
              
              <button
                onClick={() => handleNavClick('credits')}
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Credits & Acknowledgments
              </button>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>
                © 2024 Corgi Central. This is a demo website showcasing corgi awesomeness.
              </p>
              <p className="mt-1">
                Replace <code className="bg-muted px-1 rounded text-xs">G-XXXXXXX</code> in 
                the head with your actual GA4 tracking ID.
              </p>
            </div>
          </div>
          
          {/* Fun easter egg */}
          <div className="text-center mt-8">
            <button
              onClick={() => {
                gaEvent('corgi_easter_egg', {
                  section: 'footer',
                  message: 'You found the hidden corgi!',
                });
                
                // Show a fun message
                alert('🐕 Woof! You found the hidden corgi! Have a great day! 🐕');
              }}
              className="text-xs text-muted-foreground/50 hover:text-primary transition-colors"
            >
              🍑 Click for surprise 🍑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}