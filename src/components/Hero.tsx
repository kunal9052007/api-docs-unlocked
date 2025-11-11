import { BookOpen, Sparkles, Mic, Wand2 } from "lucide-react";
import { Button } from "./ui/button";
import { BackgroundDoodles } from "./BackgroundDoodles";

interface HeroProps {
  onVoiceModeClick: () => void;
}

export const Hero = ({ onVoiceModeClick }: HeroProps) => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero py-24 px-6">
      <BackgroundDoodles />
      
      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="flex items-center justify-center mb-8 gap-4">
          <div className="p-4 bg-white/10 backdrop-blur-sm rounded-3xl shadow-glow animate-float">
            <BookOpen className="h-12 w-12 text-primary-foreground" />
          </div>
          <Sparkles className="h-8 w-8 text-primary-foreground animate-pulse-glow" />
          <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl animate-float" style={{ animationDelay: '0.5s' }}>
            <Wand2 className="h-10 w-10 text-primary-foreground" />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-center text-primary-foreground mb-6 leading-tight">
          Transform API Docs
          <br />
          <span className="bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
            Into Magic ✨
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-center text-primary-foreground/95 max-w-3xl mx-auto leading-relaxed mb-10">
          AI-powered documentation that adapts to <span className="font-bold underline decoration-accent decoration-4">anyone</span>—from 
          beginners to security experts. Voice mode included!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg"
            onClick={onVoiceModeClick}
            className="bg-white text-primary hover:bg-white/90 shadow-elevated hover:shadow-glow transition-all duration-300 text-lg px-8 py-6 rounded-2xl font-bold group"
          >
            <Mic className="mr-2 h-6 w-6 group-hover:animate-pulse" />
            Try Voice Mode
          </Button>
          <Button 
            size="lg"
            variant="outline"
            className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary shadow-elevated transition-all duration-300 text-lg px-8 py-6 rounded-2xl font-bold"
            onClick={() => document.getElementById('input-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
};
