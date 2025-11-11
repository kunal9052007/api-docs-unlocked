import { useState } from "react";
import { Hero } from "@/components/Hero";
import { InputSection } from "@/components/InputSection";
import { ResultsSection } from "@/components/ResultsSection";

const Index = () => {
  const [results, setResults] = useState<Array<{ format: string; content: string }>>([]);

  return (
    <div className="min-h-screen">
      <Hero />
      <InputSection onGenerate={setResults} />
      <ResultsSection results={results} />
    </div>
  );
};

export default Index;
