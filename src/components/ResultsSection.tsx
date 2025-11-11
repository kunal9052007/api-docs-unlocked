import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { BookOpen, FileText, GraduationCap, Download, Share2, Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useToast } from "@/hooks/use-toast";

interface ResultsSectionProps {
  results: Array<{ format: string; content: string }>;
}

const formatIcons = {
  "Quick Start Guide": <GraduationCap className="h-5 w-5" />,
  "Detailed Reference": <FileText className="h-5 w-5" />,
  "Interactive Tutorial": <BookOpen className="h-5 w-5" />,
};

const formatColors = {
  "Quick Start Guide": "bg-primary text-primary-foreground",
  "Detailed Reference": "bg-secondary text-secondary-foreground",
  "Interactive Tutorial": "bg-accent text-accent-foreground",
};

export const ResultsSection = ({ results }: ResultsSectionProps) => {
  const { toast } = useToast();
  
  if (results.length === 0) return null;

  const copyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied!",
      description: "Documentation copied to clipboard",
    });
  };

  const downloadContent = (content: string, format: string) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${format.replace(/\s+/g, '-').toLowerCase()}.md`;
    a.click();
    toast({
      title: "Downloaded!",
      description: `${format} has been downloaded`,
    });
  };

  return (
    <section className="py-16 px-6 bg-gradient-to-b from-background to-muted/30 relative">
      <div className="absolute inset-0 bg-gradient-glow opacity-30" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-12">
          <Badge className="mb-4 text-sm px-6 py-2 bg-gradient-accent text-white border-0 shadow-glow animate-pulse-glow">
            ✨ Generated Successfully
          </Badge>
          <h2 className="text-4xl font-bold mb-4">Your Tailored Documentation</h2>
          <p className="text-muted-foreground text-lg">
            Three unique formats optimized for different use cases
          </p>
        </div>

        <Tabs defaultValue="0" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto p-2 bg-card border-2 border-primary/20 shadow-elevated">
            {results.map((result, index) => (
              <TabsTrigger 
                key={index} 
                value={index.toString()}
                className={`flex items-center gap-2 py-4 text-base font-semibold transition-all duration-300 data-[state=active]:shadow-soft ${
                  formatColors[result.format as keyof typeof formatColors]
                }`}
              >
                {formatIcons[result.format as keyof typeof formatIcons]}
                <span className="hidden sm:inline">{result.format}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {results.map((result, index) => (
            <TabsContent key={index} value={index.toString()}>
              <Card className="shadow-elevated border-2 border-primary/20 hover:shadow-glow transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-3 text-2xl mb-2">
                        <div className={`p-2 rounded-xl ${formatColors[result.format as keyof typeof formatColors]}`}>
                          {formatIcons[result.format as keyof typeof formatIcons]}
                        </div>
                        {result.format}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {result.format === "Quick Start Guide" && "Perfect for getting started quickly with essential information"}
                        {result.format === "Detailed Reference" && "Comprehensive technical documentation with all the details"}
                        {result.format === "Interactive Tutorial" && "Learn by doing with hands-on examples and exercises"}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyContent(result.content)}
                        className="hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadContent(result.content, result.format)}
                        className="hover:bg-secondary hover:text-secondary-foreground transition-colors"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-pre:bg-muted prose-pre:border-2 prose-pre:border-primary/20 prose-code:text-primary prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-primary prose-li:marker:text-primary">
                    <ReactMarkdown>{result.content}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-8 text-center">
          <Button
            variant="outline"
            size="lg"
            className="bg-gradient-accent text-white border-0 hover:shadow-glow transition-all duration-300 px-8 py-6 text-lg font-bold rounded-2xl"
          >
            <Share2 className="mr-2 h-5 w-5" />
            Share Documentation
          </Button>
        </div>
      </div>
    </section>
  );
};
