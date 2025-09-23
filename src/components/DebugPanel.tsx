import { useState, useEffect } from 'react';
import { isDebugMode } from '@/lib/analytics';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Bug, Trash2 } from 'lucide-react';

interface GAEvent {
  timestamp: number;
  name: string;
  params: Record<string, any>;
}

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [events, setEvents] = useState<GAEvent[]>([]);

  useEffect(() => {
    // Auto-open if debug mode is enabled
    if (isDebugMode()) {
      setIsOpen(true);
    }

    // Intercept console.log calls to capture GA events
    const originalLog = console.log;
    console.log = (...args) => {
      if (args[0] === '[GA]' && args[1] && args[2]) {
        const event: GAEvent = {
          timestamp: Date.now(),
          name: args[1],
          params: args[2] || {},
        };
        setEvents(prev => [event, ...prev].slice(0, 50)); // Keep last 50 events
      }
      originalLog(...args);
    };

    return () => {
      console.log = originalLog;
    };
  }, []);

  const clearEvents = () => {
    setEvents([]);
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getEventTypeColor = (name: string) => {
    if (name.startsWith('corgi_')) return 'bg-primary';
    if (name.startsWith('scroll_')) return 'bg-secondary';
    if (name.startsWith('video_')) return 'bg-accent';
    return 'bg-muted';
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <Card className="shadow-soft border-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center gap-2 p-3 rounded-b-none"
          data-ga="debug_panel_toggle"
        >
          <Bug className="w-4 h-4" />
          <span className="text-sm font-medium">
            GA Debug ({events.length})
          </span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </Button>
        
        {isOpen && (
          <div className="border-t p-3">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground">
                Live event stream
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearEvents}
                className="h-6 px-2"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {events.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">
                  No events yet. Interact with the page!
                </p>
              ) : (
                events.map((event, index) => (
                  <div
                    key={`${event.timestamp}-${index}`}
                    className="text-xs space-y-1 p-2 bg-muted/50 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <Badge 
                        className={`text-xs px-1 py-0 ${getEventTypeColor(event.name)} text-white`}
                      >
                        {event.name}
                      </Badge>
                      <span className="text-muted-foreground">
                        {formatTimestamp(event.timestamp)}
                      </span>
                    </div>
                    
                    {Object.keys(event.params).length > 0 && (
                      <div className="pl-2 space-y-1">
                        {Object.entries(event.params).map(([key, value]) => (
                          <div key={key} className="flex gap-1">
                            <span className="text-muted-foreground">{key}:</span>
                            <span className="font-mono">
                              {typeof value === 'object' 
                                ? JSON.stringify(value) 
                                : String(value)
                              }
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}