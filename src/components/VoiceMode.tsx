import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Mic, MicOff, Volume2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VoiceModeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const VoiceMode = ({ open, onOpenChange }: VoiceModeProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();

  const startListening = () => {
    setIsListening(true);
    toast({
      title: "Voice Mode Active",
      description: "Speak naturally to describe your API documentation needs",
    });
    
    // Simulate voice interaction
    setTimeout(() => {
      setIsListening(false);
      setIsSpeaking(true);
      setTimeout(() => {
        setIsSpeaking(false);
        toast({
          title: "Response Ready",
          description: "I can help you transform your API documentation. Would you like to start?",
        });
      }, 2000);
    }, 3000);
  };

  const stopListening = () => {
    setIsListening(false);
    setIsSpeaking(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-2 border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Mic className="h-6 w-6 text-primary" />
            Voice Mode
          </DialogTitle>
          <DialogDescription>
            Describe your API documentation needs naturally using your voice
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-8 space-y-6">
          {/* Voice visualization */}
          <div className="relative">
            <div className={`w-32 h-32 rounded-full bg-gradient-accent flex items-center justify-center transition-all duration-300 ${
              isListening || isSpeaking ? 'shadow-glow scale-110' : 'shadow-elevated'
            }`}>
              {isListening && (
                <Mic className="h-16 w-16 text-white animate-pulse" />
              )}
              {isSpeaking && (
                <Volume2 className="h-16 w-16 text-white animate-pulse" />
              )}
              {!isListening && !isSpeaking && (
                <Mic className="h-16 w-16 text-white" />
              )}
            </div>
            
            {(isListening || isSpeaking) && (
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
            )}
          </div>

          {/* Status text */}
          <div className="text-center">
            {isListening && (
              <p className="text-lg font-semibold text-primary animate-pulse">
                Listening...
              </p>
            )}
            {isSpeaking && (
              <p className="text-lg font-semibold text-secondary animate-pulse">
                Speaking...
              </p>
            )}
            {!isListening && !isSpeaking && (
              <p className="text-muted-foreground">
                Click the button below to start
              </p>
            )}
          </div>

          {/* Control button */}
          {!isListening && !isSpeaking ? (
            <Button
              onClick={startListening}
              className="bg-gradient-accent hover:shadow-glow transition-all duration-300 px-8 py-6 text-lg font-bold rounded-2xl"
            >
              <Mic className="mr-2 h-5 w-5" />
              Start Speaking
            </Button>
          ) : (
            <Button
              onClick={stopListening}
              variant="destructive"
              className="px-8 py-6 text-lg font-bold rounded-2xl"
            >
              <MicOff className="mr-2 h-5 w-5" />
              Stop
            </Button>
          )}

          {/* Feature badge */}
          <div className="text-center text-sm text-muted-foreground">
            <p>🎙️ Voice mode is in demo</p>
            <p className="text-xs mt-1">Full integration coming soon</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
