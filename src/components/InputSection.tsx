import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Loader2, Sparkles, Download, Copy, Shuffle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "./ui/badge";

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

const EXAMPLE_APIS = [
  {
    name: "E-commerce API",
    data: {
      "name": "Shop API",
      "baseUrl": "https://api.shop.example.com",
      "endpoints": [{
        "method": "POST",
        "path": "/orders",
        "description": "Create a new order",
        "parameters": { "items": "array", "customer_id": "string" }
      }]
    }
  },
  {
    name: "Social API",
    data: {
      "name": "Social Network API",
      "baseUrl": "https://api.social.example.com",
      "endpoints": [{
        "method": "GET",
        "path": "/posts",
        "description": "Get user posts",
        "parameters": { "user_id": "string", "limit": "number" }
      }]
    }
  }
];

export const InputSection = ({ onGenerate }: InputSectionProps) => {
  const [apiJson, setApiJson] = useState(JSON.stringify(SAMPLE_API, null, 2));
  const [audience, setAudience] = useState("beginner");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    try {
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
          title: "✨ Documentation Generated!",
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

  const loadExample = (example: typeof EXAMPLE_APIS[0]) => {
    setApiJson(JSON.stringify(example.data, null, 2));
    toast({
      title: "Example Loaded",
      description: `Loaded ${example.name} specification`,
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiJson);
    toast({
      title: "Copied!",
      description: "API specification copied to clipboard",
    });
  };

  return (
    <section className="py-16 px-6 relative" id="input-section">
      <div className="absolute inset-0 bg-gradient-glow opacity-50" />
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center mb-8">
          <Badge className="mb-4 text-sm px-4 py-2 bg-gradient-accent text-white border-0">
            ⚡ AI-Powered Transformation
          </Badge>
          <h2 className="text-3xl font-bold mb-2">Create Your Documentation</h2>
          <p className="text-muted-foreground">Paste your API spec and choose your audience</p>
        </div>

        <Card className="shadow-elevated border-2 border-primary/20 hover:shadow-glow transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Transform Your API Docs
            </CardTitle>
            <CardDescription>
              Generate three unique documentation formats tailored to your audience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="api-json" className="text-base font-semibold">
                  API Specification (JSON)
                </Label>
                <div className="flex gap-2">
                  {EXAMPLE_APIS.map((example) => (
                    <Button
                      key={example.name}
                      variant="ghost"
                      size="sm"
                      onClick={() => loadExample(example)}
                      className="text-xs"
                    >
                      <Shuffle className="h-3 w-3 mr-1" />
                      {example.name}
                    </Button>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyToClipboard}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Textarea
                id="api-json"
                value={apiJson}
                onChange={(e) => setApiJson(e.target.value)}
                placeholder="Paste your OpenAPI or custom JSON specification here..."
                className="min-h-[300px] font-mono text-sm border-2 focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience" className="text-base font-semibold">
                🎯 Target Audience
              </Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger id="audience" className="w-full border-2 focus:border-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">
                    <div className="flex flex-col items-start py-2">
                      <span className="font-semibold text-primary">👶 Beginner Developer</span>
                      <span className="text-xs text-muted-foreground">Simple explanations, step-by-step guides</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="security">
                    <div className="flex flex-col items-start py-2">
                      <span className="font-semibold text-secondary">🔒 Security Analyst</span>
                      <span className="text-xs text-muted-foreground">Focus on security, auth, and compliance</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="integration">
                    <div className="flex flex-col items-start py-2">
                      <span className="font-semibold text-accent">⚙️ Integration Engineer</span>
                      <span className="text-xs text-muted-foreground">Implementation patterns, code examples</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating}
              className="w-full h-14 text-lg font-bold bg-gradient-accent hover:shadow-glow transition-all duration-300 group"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  Generating Magic...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-6 w-6 group-hover:animate-pulse" />
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
