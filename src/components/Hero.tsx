import { BookOpen, Sparkles } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent py-20 px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
      
      <div className="container mx-auto max-w-5xl relative">
        <div className="flex items-center justify-center mb-6 gap-3">
          <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl">
            <BookOpen className="h-8 w-8 text-primary-foreground" />
          </div>
          <Sparkles className="h-6 w-6 text-primary-foreground animate-pulse" />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-center text-primary-foreground mb-6">
          API Documentation
          <br />
          <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Made for Everyone
          </span>
        </h1>
        
        <p className="text-xl text-center text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
          Transform technical API specifications into tailored documentation 
          that speaks directly to your audience—whether they're beginners, 
          security analysts, or integration engineers.
        </p>
      </div>
    </section>
  );
};
