import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface InputSectionProps {
  onGenerate: (results: Array<{ format: string; content: string }>) => void;
}

const SAMPLE_API = {
  "name": "Weather API",
  "version": "1.0",
  "baseUrl": "https://api.weather.example.com",
  "endpoints": [
    {
      "method": "GET",
      "path": "/current",
      "description": "Get current weather for a location",
      "parameters": {
        "city": "string (required) - City name",
        "units": "string (optional) - metric or imperial"
      },
      "response": {
        "temperature": "number",
        "conditions": "string",
        "humidity": "number"
      }
    }
  ]
};

export const InputSection = ({ onGenerate }: InputSectionProps) => {
  const [apiJson, setApiJson] = useState(JSON.stringify(SAMPLE_API, null, 2));
  const [audience, setAudience] = useState("beginner");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    try {
      // Validate JSON
      JSON.parse(apiJson);
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "Please enter valid JSON format for the API specification.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('transform-api-docs', {
        body: {
          apiJson: JSON.parse(apiJson),
          audience: audience
        }
      });

      if (error) throw error;

      if (data?.results) {
        onGenerate(data.results);
        toast({
          title: "Documentation Generated!",
          description: "Three tailored formats are ready for review.",
        });
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate documentation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="py-12 px-6">
      <div className="container mx-auto max-w-4xl">
        <Card className="shadow-[var(--shadow-elevated)] border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Transform Your API Docs</CardTitle>
            <CardDescription>
              Paste your API specification and select your target audience to generate three distinct documentation formats.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="api-json" className="text-base font-semibold">
                API Specification (JSON)
              </Label>
              <Textarea
                id="api-json"
                value={apiJson}
                onChange={(e) => setApiJson(e.target.value)}
                placeholder="Paste your OpenAPI or custom JSON specification here..."
                className="min-h-[300px] font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience" className="text-base font-semibold">
                Target Audience
              </Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger id="audience" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">
                    <div className="flex flex-col items-start">
                      <span className="font-semibold">Beginner Developer</span>
                      <span className="text-xs text-muted-foreground">Simple explanations, step-by-step guides</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="security">
                    <div className="flex flex-col items-start">
                      <span className="font-semibold">Security Analyst</span>
                      <span className="text-xs text-muted-foreground">Focus on security, auth, and compliance</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="integration">
                    <div className="flex flex-col items-start">
                      <span className="font-semibold">Integration Engineer</span>
                      <span className="text-xs text-muted-foreground">Implementation patterns, code examples</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating}
              className="w-full h-12 text-base font-semibold"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Documentation...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Documentation
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
