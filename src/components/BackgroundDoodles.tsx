import { Sparkles, Zap, Star, Code, Cpu, Database } from "lucide-react";

export const BackgroundDoodles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating shapes */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-40 right-20 w-40 h-40 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-accent/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
      
      {/* Animated icons */}
      <div className="absolute top-32 right-1/4 text-primary/20 animate-spin-slow">
        <Code className="w-16 h-16" />
      </div>
      <div className="absolute bottom-32 left-1/3 text-secondary/20 animate-float">
        <Sparkles className="w-12 h-12" />
      </div>
      <div className="absolute top-1/3 right-1/3 text-accent/20 animate-pulse-glow">
        <Zap className="w-20 h-20" />
      </div>
      <div className="absolute bottom-1/4 right-1/4 text-primary/15 animate-wiggle">
        <Star className="w-14 h-14" />
      </div>
      <div className="absolute top-1/4 left-1/4 text-secondary/15 animate-float" style={{ animationDelay: '1.5s' }}>
        <Cpu className="w-16 h-16" />
      </div>
      <div className="absolute bottom-1/3 left-1/2 text-accent/15 animate-spin-slow" style={{ animationDelay: '3s' }}>
        <Database className="w-12 h-12" />
      </div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
    </div>
  );
};
