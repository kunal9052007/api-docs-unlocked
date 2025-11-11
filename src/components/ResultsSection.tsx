import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { BookOpen, FileText, GraduationCap } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ResultsSectionProps {
  results: Array<{ format: string; content: string }>;
}

const formatIcons = {
  "Quick Start Guide": <GraduationCap className="h-4 w-4" />,
  "Detailed Reference": <FileText className="h-4 w-4" />,
  "Interactive Tutorial": <BookOpen className="h-4 w-4" />,
};

export const ResultsSection = ({ results }: ResultsSectionProps) => {
  if (results.length === 0) return null;

  return (
    <section className="py-12 px-6 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-4 text-sm px-4 py-2">
            ✨ Generated Documentation
          </Badge>
          <h2 className="text-3xl font-bold mb-2">Three Tailored Formats</h2>
          <p className="text-muted-foreground">
            Each format is optimized for different use cases and learning styles
          </p>
        </div>

        <Tabs defaultValue="0" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto p-1">
            {results.map((result, index) => (
              <TabsTrigger 
                key={index} 
                value={index.toString()}
                className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {formatIcons[result.format as keyof typeof formatIcons]}
                <span className="hidden sm:inline">{result.format}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {results.map((result, index) => (
            <TabsContent key={index} value={index.toString()}>
              <Card className="shadow-[var(--shadow-elevated)]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {formatIcons[result.format as keyof typeof formatIcons]}
                    {result.format}
                  </CardTitle>
                  <CardDescription>
                    {result.format === "Quick Start Guide" && "Get started quickly with essential information"}
                    {result.format === "Detailed Reference" && "Comprehensive technical documentation"}
                    {result.format === "Interactive Tutorial" && "Learn by doing with hands-on examples"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-pre:bg-muted prose-pre:border prose-code:text-accent-foreground prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
                    <ReactMarkdown>{result.content}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};
