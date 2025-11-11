import { useState } from "react";
import { Hero } from "@/components/Hero";
import { InputSection } from "@/components/InputSection";
import { ResultsSection } from "@/components/ResultsSection";
import { VoiceMode } from "@/components/VoiceMode";

const Index = () => {
  const [results, setResults] = useState<Array<{ format: string; content: string }>>([]);
  const [voiceModeOpen, setVoiceModeOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Hero onVoiceModeClick={() => setVoiceModeOpen(true)} />
      <InputSection onGenerate={setResults} />
      <ResultsSection results={results} />
      <VoiceMode open={voiceModeOpen} onOpenChange={setVoiceModeOpen} />
    </div>
  );
};

export default Index;
