import { Card } from "./ui/card";
import { Button } from "./ui/button";
import ReactMarkdown from "react-markdown";
import { Copy, Check, Share2, Download, FileText, FileImage, GraduationCap, BookOpen } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  downloadAsText,
  downloadAsMarkdown,
  downloadAsPDF,
  downloadAsWord,
  downloadAsPNG,
  downloadAsJSON,
} from "@/utils/downloadUtils";

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
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);
  const { toast } = useToast();
  
  if (results.length === 0) return null;

  const handleCopy = async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
      toast({
        title: "Copied!",
        description: "Documentation copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (
    content: string,
    format: string,
    index: number,
    downloadFormat: string
  ) => {
    setDownloadingIndex(index);
    try {
      const filename = `api-docs-${format.toLowerCase().replace(/\s+/g, "-")}`;
      const elementId = `result-${index}`;

      switch (downloadFormat) {
        case "txt":
          downloadAsText(content, filename);
          break;
        case "md":
          downloadAsMarkdown(content, filename);
          break;
        case "pdf":
          await downloadAsPDF(elementId, filename);
          break;
        case "docx":
          await downloadAsWord(content, filename);
          break;
        case "png":
          await downloadAsPNG(elementId, filename);
          break;
        case "json":
          downloadAsJSON(content, format, filename);
          break;
      }

      toast({
        title: "Downloaded!",
        description: `Exported as ${downloadFormat.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    } finally {
      setDownloadingIndex(null);
    }
  };

  const handleShare = async (content: string, format: string) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `API Documentation - ${format}`,
          text: content,
        });
        toast({
          title: "Shared!",
          description: "Documentation shared successfully",
        });
      } else {
        await handleCopy(content, -1);
        toast({
          title: "Copied!",
          description: "Share not supported, content copied to clipboard",
        });
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        toast({
          title: "Error",
          description: "Failed to share",
          variant: "destructive",
        });
      }
    }
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
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${formatColors[result.format as keyof typeof formatColors]}`}>
                        {formatIcons[result.format as keyof typeof formatIcons]}
                      </div>
                      <h3 className="text-2xl font-bold">{result.format}</h3>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleCopy(result.content, index)}
                        size="sm"
                        variant="outline"
                        className="border-primary/20 hover:bg-primary/10"
                      >
                        {copiedIndex === index ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-primary/20 hover:bg-primary/10"
                            disabled={downloadingIndex === index}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleDownload(result.content, result.format, index, "txt")}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Text (.txt)
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDownload(result.content, result.format, index, "md")}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Markdown (.md)
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDownload(result.content, result.format, index, "pdf")}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            PDF (.pdf)
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDownload(result.content, result.format, index, "docx")}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Word (.docx)
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDownload(result.content, result.format, index, "png")}
                          >
                            <FileImage className="mr-2 h-4 w-4" />
                            Image (.png)
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDownload(result.content, result.format, index, "json")}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            JSON (.json)
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      <Button
                        onClick={() => handleShare(result.content, result.format)}
                        size="sm"
                        variant="outline"
                        className="border-primary/20 hover:bg-primary/10"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div id={`result-${index}`} className="prose prose-invert max-w-none bg-background p-6 rounded-lg">
                    <ReactMarkdown>{result.content}</ReactMarkdown>
                  </div>
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};
