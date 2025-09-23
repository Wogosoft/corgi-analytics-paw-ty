import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { gaEvent } from '@/lib/analytics';
import { Shuffle, Copy, Heart } from 'lucide-react';

const firstNames = [
  'Sir', 'Princess', 'Duke', 'Lady', 'Captain', 'Baron', 'Miss', 'Lord',
  'Admiral', 'Duchess', 'Count', 'Countess', 'Major', 'Commander'
];

const secondNames = [
  'Wiggle', 'Pudding', 'Biscuit', 'Muffin', 'Pickle', 'Peanut', 'Buttercup',
  'Snuggle', 'Fuzzy', 'Pancake', 'Waffle', 'Cookie', 'Cupcake', 'Jellybean',
  'Marshmallow', 'Cinnamon', 'Honey', 'Maple', 'Caramel', 'Toffee'
];

const lastNames = [
  'bottom', 'pants', 'paws', 'whiskers', 'tail', 'ears', 'snoot', 'belly',
  'fluff', 'wobble', 'bounce', 'wiggle', 'stumps', 'chonk', 'sploot'
];

export function CorgiNameGenerator() {
  const [currentName, setCurrentName] = useState<string>('');
  const [likedNames, setLikedNames] = useState<string[]>([]);
  const [generationCount, setGenerationCount] = useState(0);

  const generateName = () => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const secondName = secondNames[Math.floor(Math.random() * secondNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    const newName = `${firstName} ${secondName}${lastName}`;
    setCurrentName(newName);
    setGenerationCount(prev => prev + 1);
    
    gaEvent('corgi_name_generate', {
      section: 'name_generator',
      name: newName,
      generation_count: generationCount + 1,
      timestamp: Date.now(),
    });
  };

  const copyName = () => {
    if (currentName) {
      navigator.clipboard.writeText(currentName).then(() => {
        gaEvent('corgi_copy_to_clipboard', {
          section: 'name_generator',
          target: 'corgi_name',
          name: currentName,
        });
        
        // Visual feedback
        const button = document.querySelector('[data-action="copy-name"]');
        if (button) {
          const originalText = button.textContent;
          (button as HTMLElement).textContent = 'Copied!';
          setTimeout(() => {
            (button as HTMLElement).textContent = originalText;
          }, 2000);
        }
      });
    }
  };

  const likeName = () => {
    if (currentName && !likedNames.includes(currentName)) {
      setLikedNames(prev => [...prev, currentName]);
      
      gaEvent('corgi_name_like', {
        section: 'name_generator',
        name: currentName,
        total_liked: likedNames.length + 1,
      });
    }
  };

  // Auto-generate first name on component mount
  useState(() => {
    if (!currentName) {
      generateName();
    }
  });

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Corgi Name Generator
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Need the perfect name for your future corgi companion? 
            Let our royal name generator help you find something truly regal!
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Main generator card */}
          <Card className="shadow-corgi animate-fade-in-up text-center">
            <CardContent className="p-8 space-y-6">
              <div className="text-4xl mb-4">👑</div>
              
              {currentName ? (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold gradient-corgi bg-clip-text text-transparent">
                    {currentName}
                  </h3>
                  
                  <p className="text-muted-foreground">
                    A distinguished name worthy of corgi royalty!
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={generateName}
                      className="shadow-corgi hover:shadow-treat hover-bounce"
                      data-ga="generate_name"
                    >
                      <Shuffle className="w-4 h-4 mr-2" />
                      Generate Another
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={copyName}
                      className="hover-bounce"
                      data-action="copy-name"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Name
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={likeName}
                      disabled={likedNames.includes(currentName)}
                      className={`hover-bounce ${
                        likedNames.includes(currentName) 
                          ? 'text-red-500 border-red-200' 
                          : 'hover:text-red-500'
                      }`}
                    >
                      <Heart 
                        className={`w-4 h-4 mr-2 ${
                          likedNames.includes(currentName) ? 'fill-current' : ''
                        }`} 
                      />
                      {likedNames.includes(currentName) ? 'Liked!' : 'Like'}
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={generateName}
                  size="lg"
                  className="shadow-corgi hover:shadow-treat hover-bounce"
                >
                  <Shuffle className="w-5 h-5 mr-2" />
                  Generate Your First Name
                </Button>
              )}
              
              {generationCount > 0 && (
                <div className="text-sm text-muted-foreground">
                  Names generated: {generationCount}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Liked names */}
          {likedNames.length > 0 && (
            <Card className="shadow-soft animate-fade-in-up">
              <CardContent className="p-6">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500 fill-current" />
                  Your Favorite Names ({likedNames.length})
                </h4>
                
                <div className="flex flex-wrap gap-2">
                  {likedNames.map((name, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-muted rounded-full text-sm font-medium"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Fun facts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up">
            <Card className="shadow-soft text-center">
              <CardContent className="p-4">
                <div className="text-2xl mb-2">🏰</div>
                <h5 className="font-semibold text-sm">Royal Tradition</h5>
                <p className="text-xs text-muted-foreground mt-1">
                  Many corgi names include noble titles
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-soft text-center">
              <CardContent className="p-4">
                <div className="text-2xl mb-2">🍪</div>
                <h5 className="font-semibold text-sm">Food Names</h5>
                <p className="text-xs text-muted-foreground mt-1">
                  Sweet treats make perfect corgi names
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-soft text-center">
              <CardContent className="p-4">
                <div className="text-2xl mb-2">🍑</div>
                <h5 className="font-semibold text-sm">Butt References</h5>
                <p className="text-xs text-muted-foreground mt-1">
                  Because corgi butts are legendary
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}