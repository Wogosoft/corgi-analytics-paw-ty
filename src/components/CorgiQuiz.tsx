import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { gaEvent } from '@/lib/analytics';
import { Share, Twitter, MessageCircle, Copy, RefreshCw } from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  type: 'radio' | 'checkbox';
  options: { id: string; label: string; points: number }[];
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 'energy',
    question: 'How do you feel about daily walks and active play?',
    type: 'radio',
    options: [
      { id: 'love_it', label: 'I love being active and outdoors!', points: 3 },
      { id: 'moderate', label: 'I enjoy some activity but prefer moderation', points: 2 },
      { id: 'low_energy', label: 'I prefer quiet, low-energy activities', points: 1 },
    ],
  },
  {
    id: 'shedding',
    question: 'How do you handle pet hair around the house?',
    type: 'radio',
    options: [
      { id: 'no_problem', label: 'Hair everywhere? No problem!', points: 3 },
      { id: 'manageable', label: 'I can deal with regular grooming and cleaning', points: 2 },
      { id: 'prefer_minimal', label: 'I prefer minimal shedding pets', points: 0 },
    ],
  },
  {
    id: 'training',
    question: 'What\'s your experience with dog training?',
    type: 'radio',
    options: [
      { id: 'experienced', label: 'I\'m experienced with smart, stubborn dogs', points: 3 },
      { id: 'beginner_willing', label: 'I\'m new but willing to learn!', points: 2 },
      { id: 'want_easy', label: 'I want a dog that\'s naturally obedient', points: 1 },
    ],
  },
  {
    id: 'lifestyle',
    question: 'Which activities sound appealing? (Check all that apply)',
    type: 'checkbox',
    options: [
      { id: 'hiking', label: 'Hiking and outdoor adventures', points: 1 },
      { id: 'training', label: 'Teaching tricks and commands', points: 1 },
      { id: 'socializing', label: 'Dog parks and socializing', points: 1 },
      { id: 'cuddling', label: 'Netflix and cuddle sessions', points: 1 },
      { id: 'photography', label: 'Taking adorable photos for social media', points: 1 },
    ],
  },
  {
    id: 'space',
    question: 'What\'s your living situation?',
    type: 'radio',
    options: [
      { id: 'house_yard', label: 'House with a yard', points: 3 },
      { id: 'apartment_active', label: 'Apartment but I\'m very active', points: 2 },
      { id: 'apartment_quiet', label: 'Apartment with a quieter lifestyle', points: 1 },
    ],
  },
];

interface QuizResult {
  score: number;
  title: string;
  description: string;
  emoji: string;
}

const getQuizResult = (score: number): QuizResult => {
  if (score >= 12) {
    return {
      score,
      title: 'Corgi Champion! 🏆',
      description: 'You\'re absolutely ready for corgi ownership! Your lifestyle, energy, and expectations align perfectly with what these amazing dogs need. A corgi would thrive in your care!',
      emoji: '🏆',
    };
  } else if (score >= 8) {
    return {
      score,
      title: 'Corgi Compatible! 🎉',
      description: 'You\'d make a great corgi parent! You understand the commitment and have the right mindset. With a little preparation, you and a corgi would be perfect together!',
      emoji: '🎉',
    };
  } else if (score >= 5) {
    return {
      score,
      title: 'Corgi Curious! 🤔',
      description: 'You\'re interested in corgis but might want to research more. Consider meeting some corgis, talking to owners, and making sure you\'re ready for their energy and needs.',
      emoji: '🤔',
    };
  } else {
    return {
      score,
      title: 'Maybe Another Breed? 🐕',
      description: 'While corgis are amazing, they might not be the perfect fit for your current lifestyle. Consider lower-energy or less demanding breeds that might suit you better!',
      emoji: '🐕',
    };
  }
};

export function CorgiQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  const handleStart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsComplete(false);
    setResult(null);
    
    gaEvent('corgi_quiz_start', {
      section: 'quiz',
      timestamp: Date.now(),
    });
  };

  const handleAnswer = (questionId: string, answerId: string | string[], points: number | number[]) => {
    const newAnswers = { ...answers, [questionId]: { answerId, points } };
    setAnswers(newAnswers);
    
    gaEvent('corgi_quiz_answer', {
      section: 'quiz',
      q_id: questionId,
      answer: answerId,
      points: Array.isArray(points) ? points.reduce((a, b) => a + b, 0) : points,
    });
    
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate final score
      const totalScore = Object.values(newAnswers).reduce((total, answer: any) => {
        return total + (Array.isArray(answer.points) ? answer.points.reduce((a: number, b: number) => a + b, 0) : answer.points);
      }, 0);
      
      const quizResult = getQuizResult(totalScore);
      setResult(quizResult);
      setIsComplete(true);
      
      gaEvent('corgi_quiz_complete', {
        section: 'quiz',
        score: totalScore,
        result_category: quizResult.title,
        questions_answered: Object.keys(newAnswers).length,
      });
    }
  };

  const handleShare = (platform: 'twitter' | 'whatsapp' | 'copy') => {
    if (!result) return;
    
    const shareText = `I just took the "Are You Corgi-Ready?" quiz and got: ${result.title} ${result.emoji} Find out if you're ready for a corgi!`;
    const shareUrl = window.location.href;
    
    gaEvent('corgi_share_click', {
      section: 'quiz',
      network: platform,
      result_score: result.score,
      result_category: result.title,
    });
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`).then(() => {
        gaEvent('corgi_copy_to_clipboard', {
          section: 'quiz',
          target: 'quiz_result',
          content_type: 'quiz_result_link',
        });
        
        // Show feedback
        const button = document.querySelector('[data-platform="copy"]');
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

  const currentQ = quizQuestions[currentQuestion];

  return (
    <section className="py-20 gradient-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Are You Corgi-Ready?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Take our fun quiz to find out if you're ready for corgi ownership!
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {!isComplete ? (
            <Card className="shadow-corgi animate-fade-in-up">
              <CardHeader>
                <div className="flex justify-between items-center mb-4">
                  <CardTitle className="text-lg">
                    Question {currentQuestion + 1} of {quizQuestions.length}
                  </CardTitle>
                  <div className="bg-muted rounded-full px-3 py-1 text-sm">
                    {Math.round(((currentQuestion + 1) / quizQuestions.length) * 100)}%
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="gradient-corgi h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                  />
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <h3 className="text-xl font-semibold leading-relaxed">
                  {currentQ.question}
                </h3>
                
                {currentQ.type === 'radio' ? (
                  <RadioGroup
                    onValueChange={(value) => {
                      const option = currentQ.options.find(opt => opt.id === value);
                      if (option) {
                        handleAnswer(currentQ.id, value, option.points);
                      }
                    }}
                  >
                    {currentQ.options.map((option) => (
                      <div key={option.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <Label htmlFor={option.id} className="flex-1 cursor-pointer text-base">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="space-y-3">
                    {currentQ.options.map((option) => (
                      <div key={option.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <Checkbox
                          id={option.id}
                          onCheckedChange={(checked) => {
                            const currentAnswers = answers[currentQ.id]?.answerId || [];
                            const currentPoints = answers[currentQ.id]?.points || [];
                            
                            let newAnswers: string[];
                            let newPoints: number[];
                            
                            if (checked) {
                              newAnswers = [...currentAnswers, option.id];
                              newPoints = [...currentPoints, option.points];
                            } else {
                              newAnswers = currentAnswers.filter((id: string) => id !== option.id);
                              newPoints = currentPoints.filter((_: number, index: number) => currentAnswers[index] !== option.id);
                            }
                            
                            setAnswers({ ...answers, [currentQ.id]: { answerId: newAnswers, points: newPoints } });
                          }}
                        />
                        <Label htmlFor={option.id} className="flex-1 cursor-pointer text-base">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                    
                    <Button
                      onClick={() => {
                        const currentAnswers = answers[currentQ.id];
                        if (currentAnswers && currentAnswers.answerId.length > 0) {
                          handleAnswer(currentQ.id, currentAnswers.answerId, currentAnswers.points);
                        }
                      }}
                      disabled={!answers[currentQ.id] || answers[currentQ.id].answerId.length === 0}
                      className="w-full mt-4"
                    >
                      {currentQuestion === quizQuestions.length - 1 ? 'Get My Result!' : 'Next Question'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : result ? (
            <Card className="shadow-corgi animate-fade-in-up text-center">
              <CardContent className="p-8 space-y-6">
                <div className="text-6xl mb-4">{result.emoji}</div>
                <h3 className="text-2xl font-bold">{result.title}</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {result.description}
                </p>
                
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="font-semibold mb-2">Your Score: {result.score}/15</p>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className="gradient-corgi h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(result.score / 15) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                  <Button
                    variant="outline"
                    onClick={() => handleShare('twitter')}
                    className="hover-bounce"
                    data-platform="twitter"
                  >
                    <Twitter className="w-4 h-4 mr-2" />
                    Share on X
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => handleShare('whatsapp')}
                    className="hover-bounce"
                    data-platform="whatsapp"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => handleShare('copy')}
                    className="hover-bounce"
                    data-platform="copy"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </Button>
                </div>
                
                <Button
                  onClick={handleStart}
                  variant="secondary"
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Take Quiz Again
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-corgi animate-fade-in-up text-center">
              <CardContent className="p-12">
                <div className="text-4xl mb-6">🐕</div>
                <h3 className="text-xl font-semibold mb-4">Ready to Find Out?</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Answer 5 quick questions to discover if you're ready for corgi ownership!
                </p>
                <Button onClick={handleStart} size="lg" className="shadow-corgi hover-bounce">
                  Start Quiz
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}