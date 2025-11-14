import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Mic, MicOff, Volume2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AudioRecorder, encodeAudioForAPI, playAudioData, clearAudioQueue } from "@/utils/audioUtils";

interface VoiceModeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const VoiceMode = ({ open, onOpenChange }: VoiceModeProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const { toast } = useToast();
  
  const wsRef = useRef<WebSocket | null>(null);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const connectWebSocket = async () => {
    try {
      setIsConnecting(true);
      
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Initialize audio context
      audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      
      // Connect to WebSocket
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID || "frwrpiecwdqrktvjhynn";
      const wsUrl = `wss://${projectId}.supabase.co/functions/v1/realtime-voice`;
      
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onopen = () => {
        console.log("WebSocket connected");
        setIsConnecting(false);
        setIsConnected(true);
        toast({
          title: "Voice Mode Active",
          description: "Speak naturally about your API documentation needs",
        });
      };
      
      wsRef.current.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        console.log("Received:", data.type);
        
        if (data.type === "session.created") {
          console.log("Session created");
        } else if (data.type === "session.updated") {
          console.log("Session configured");
          // Start recording after session is configured
          startRecording();
        } else if (data.type === "response.audio.delta") {
          setIsSpeaking(true);
          const binaryString = atob(data.delta);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          if (audioContextRef.current) {
            await playAudioData(audioContextRef.current, bytes);
          }
        } else if (data.type === "response.audio.done") {
          setIsSpeaking(false);
        } else if (data.type === "conversation.item.input_audio_transcription.completed") {
          setTranscript(prev => prev + "\n\nYou: " + data.transcript);
        } else if (data.type === "response.audio_transcript.delta") {
          setTranscript(prev => {
            const lines = prev.split("\n");
            if (lines[lines.length - 1]?.startsWith("Assistant: ")) {
              lines[lines.length - 1] += data.delta;
            } else {
              lines.push("Assistant: " + data.delta);
            }
            return lines.join("\n");
          });
        } else if (data.type === "input_audio_buffer.speech_started") {
          setIsListening(true);
        } else if (data.type === "input_audio_buffer.speech_stopped") {
          setIsListening(false);
        } else if (data.type === "error") {
          console.error("Error:", data.error);
          toast({
            title: "Error",
            description: data.error.message || "An error occurred",
            variant: "destructive",
          });
        }
      };
      
      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnecting(false);
        toast({
          title: "Connection Error",
          description: "Failed to connect to voice service",
          variant: "destructive",
        });
      };
      
      wsRef.current.onclose = () => {
        console.log("WebSocket closed");
        cleanup();
      };
      
    } catch (error) {
      console.error("Connection error:", error);
      setIsConnecting(false);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to connect",
        variant: "destructive",
      });
    }
  };

  const startRecording = async () => {
    try {
      recorderRef.current = new AudioRecorder((audioData) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          const encoded = encodeAudioForAPI(audioData);
          wsRef.current.send(JSON.stringify({
            type: "input_audio_buffer.append",
            audio: encoded
          }));
        }
      });
      
      await recorderRef.current.start();
      console.log("Recording started");
    } catch (error) {
      console.error("Recording error:", error);
      toast({
        title: "Microphone Error",
        description: "Could not access microphone",
        variant: "destructive",
      });
    }
  };

  const cleanup = () => {
    if (recorderRef.current) {
      recorderRef.current.stop();
      recorderRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    clearAudioQueue();
    setIsConnected(false);
    setIsListening(false);
    setIsSpeaking(false);
    setTranscript("");
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      cleanup();
    }
    onOpenChange(isOpen);
  };

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl border-2 border-primary/20 max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Mic className="h-6 w-6 text-primary" />
            Voice Mode
          </DialogTitle>
          <DialogDescription>
            Real-time voice conversation with AI about your API documentation
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-6 space-y-6 flex-1 overflow-hidden">
          {/* Voice visualization */}
          <div className="relative">
            <div className={`w-24 h-24 rounded-full bg-gradient-accent flex items-center justify-center transition-all duration-300 ${
              isListening || isSpeaking ? 'shadow-glow scale-110' : 'shadow-elevated'
            }`}>
              {isConnecting && (
                <Loader2 className="h-12 w-12 text-white animate-spin" />
              )}
              {isListening && (
                <Mic className="h-12 w-12 text-white animate-pulse" />
              )}
              {isSpeaking && (
                <Volume2 className="h-12 w-12 text-white animate-pulse" />
              )}
              {isConnected && !isListening && !isSpeaking && !isConnecting && (
                <Mic className="h-12 w-12 text-white" />
              )}
              {!isConnected && !isConnecting && (
                <Mic className="h-12 w-12 text-white" />
              )}
            </div>
            
            {(isListening || isSpeaking) && (
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
            )}
          </div>

          {/* Status text */}
          <div className="text-center">
            {isConnecting && (
              <p className="text-lg font-semibold text-primary">
                Connecting...
              </p>
            )}
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
            {isConnected && !isListening && !isSpeaking && !isConnecting && (
              <p className="text-muted-foreground">
                Ready - Start speaking naturally
              </p>
            )}
            {!isConnected && !isConnecting && (
              <p className="text-muted-foreground">
                Click connect to start voice conversation
              </p>
            )}
          </div>

          {/* Transcript */}
          {transcript && (
            <div className="w-full max-h-48 overflow-y-auto bg-muted/50 rounded-lg p-4 text-sm space-y-2">
              {transcript.split("\n").map((line, i) => (
                <p key={i} className={line.startsWith("You:") ? "text-primary font-semibold" : "text-foreground"}>
                  {line}
                </p>
              ))}
            </div>
          )}

          {/* Control button */}
          {!isConnected ? (
            <Button
              onClick={connectWebSocket}
              disabled={isConnecting}
              className="bg-gradient-accent hover:shadow-glow transition-all duration-300 px-8 py-4 text-lg font-bold rounded-2xl"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-5 w-5" />
                  Connect Voice Mode
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={() => handleClose(false)}
              variant="destructive"
              className="px-8 py-4 text-lg font-bold rounded-2xl"
            >
              <MicOff className="mr-2 h-5 w-5" />
              End Conversation
            </Button>
          )}

          {/* Feature badge */}
          <div className="text-center text-sm text-muted-foreground">
            <p>🎙️ Powered by OpenAI Realtime API</p>
            <p className="text-xs mt-1">Real-time voice-to-voice AI assistance</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
