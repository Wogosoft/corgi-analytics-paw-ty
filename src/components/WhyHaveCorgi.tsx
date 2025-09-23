import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { gaEvent } from '@/lib/analytics';
import { Heart, Zap, Smile, Users, Home, Star } from 'lucide-react';

interface CorgiPro {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  likes: number;
}

const corgiPros: CorgiPro[] = [
  {
    id: 'loyalty',
    title: 'Unmatched Loyalty',
    description: 'Corgis form incredibly strong bonds with their families and will follow you everywhere.',
    icon: <Heart className="w-6 h-6" />,
    likes: 0,
  },
  {
    id: 'energy',
    title: 'Boundless Energy',
    description: 'Despite their short legs, they have the energy of a dog twice their size.',
    icon: <Zap className="w-6 h-6" />,
    likes: 0,
  },
  {
    id: 'smiles',
    title: 'Constant Smiles',
    description: 'Their natural "smile" and expressive face will brighten your worst days.',
    icon: <Smile className="w-6 h-6" />,
    likes: 0,
  },
  {
    id: 'social',
    title: 'Great With Kids',
    description: 'Gentle yet playful, making them perfect family companions.',
    icon: <Users className="w-6 h-6" />,
    likes: 0,
  },
  {
    id: 'size',
    title: 'Perfect Size',
    description: 'Big dog personality in an apartment-friendly package.',
    icon: <Home className="w-6 h-6" />,
    likes: 0,
  },
  {
    id: 'royal',
    title: 'Royal Heritage',
    description: 'You\'ll own a breed loved by the Queen of England herself.',
    icon: <Star className="w-6 h-6" />,
    likes: 0,
  },
];

export function WhyHaveCorgi() {
  const [likedCards, setLikedCards] = useState<Set<string>>(new Set());
  const [cardLikes, setCardLikes] = useState<Record<string, number>>(
    corgiPros.reduce((acc, pro) => ({ ...acc, [pro.id]: pro.likes }), {})
  );

  const handleCardLike = (cardId: string) => {
    const isLiked = likedCards.has(cardId);
    
    if (isLiked) {
      // Unlike
      setLikedCards(prev => {
        const newSet = new Set(prev);
        newSet.delete(cardId);
        return newSet;
      });
      setCardLikes(prev => ({ ...prev, [cardId]: prev[cardId] - 1 }));
      
      gaEvent('corgi_card_unlike', {
        section: 'why_have_corgi',
        card_id: cardId,
        final_likes: cardLikes[cardId] - 1,
      });
    } else {
      // Like
      setLikedCards(prev => new Set([...prev, cardId]));
      setCardLikes(prev => ({ ...prev, [cardId]: prev[cardId] + 1 }));
      
      gaEvent('corgi_card_like', {
        section: 'why_have_corgi',
        card_id: cardId,
        final_likes: cardLikes[cardId] + 1,
      });
    }
  };

  return (
    <section id="why-have-corgi" className="py-20 gradient-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Have a Corgi?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Here are all the reasons why corgis make the perfect companions. 
            Give a ❤️ to your favorites!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {corgiPros.map((pro, index) => (
            <Card
              key={pro.id}
              className="shadow-soft hover:shadow-corgi transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 text-center space-y-4">
                <div className="flex justify-center text-primary">
                  {pro.icon}
                </div>
                
                <h3 className="text-xl font-semibold">{pro.title}</h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {pro.description}
                </p>
                
                <div className="flex items-center justify-center gap-2 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCardLike(pro.id)}
                    className={`hover-bounce transition-all duration-200 ${
                      likedCards.has(pro.id) 
                        ? 'text-red-500 hover:text-red-600' 
                        : 'text-muted-foreground hover:text-red-500'
                    }`}
                    data-ga="corgi_pro_like"
                  >
                    <Heart
                      className={`w-5 h-5 mr-1 ${
                        likedCards.has(pro.id) ? 'fill-current' : ''
                      }`}
                    />
                    <span className="font-medium">{cardLikes[pro.id]}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}