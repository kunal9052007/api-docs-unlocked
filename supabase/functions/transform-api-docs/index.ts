import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { apiJson, audience } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Transforming API docs for audience:', audience);

    // Define audience-specific instructions
    const audienceInstructions = {
      beginner: `You are creating documentation for developers who are new to APIs. Focus on:
- Clear, simple explanations without assuming prior knowledge
- Step-by-step examples with detailed comments
- Explaining common terms and concepts
- Including troubleshooting tips for common mistakes
- Visual analogies and real-world comparisons`,
      
      security: `You are creating documentation for security analysts. Focus on:
- Authentication and authorization mechanisms
- Security best practices and potential vulnerabilities
- Rate limiting and API key management
- Data encryption and compliance considerations
- Security testing examples and edge cases`,
      
      integration: `You are creating documentation for integration engineers. Focus on:
- Implementation patterns and architecture considerations
- Code examples in multiple languages
- Error handling and retry strategies
- Performance optimization tips
- Integration testing approaches`
    };

    const instruction = audienceInstructions[audience as keyof typeof audienceInstructions] || audienceInstructions.beginner;

    // Generate three different documentation formats
    const formats = [
      {
        name: 'Quick Start Guide',
        prompt: `${instruction}

Create a QUICK START GUIDE for this API specification. Include:
1. A brief overview (2-3 sentences)
2. Prerequisites needed
3. A simple "Hello World" example
4. What to do next

Keep it concise and actionable. Format as markdown.

API Specification:
${JSON.stringify(apiJson, null, 2)}`
      },
      {
        name: 'Detailed Reference',
        prompt: `${instruction}

Create a DETAILED REFERENCE for this API specification. Include:
1. Complete endpoint documentation
2. Request/response examples
3. Parameter descriptions
4. Response codes and their meanings
5. Common use cases

Be thorough and technical. Format as markdown.

API Specification:
${JSON.stringify(apiJson, null, 2)}`
      },
      {
        name: 'Interactive Tutorial',
        prompt: `${instruction}

Create an INTERACTIVE TUTORIAL for this API specification. Include:
1. A real-world scenario
2. Step-by-step implementation walkthrough
3. Code snippets with explanations
4. Expected outputs at each step
5. Challenges/exercises to try

Make it engaging and hands-on. Format as markdown.

API Specification:
${JSON.stringify(apiJson, null, 2)}`
      }
    ];

    // Generate all three formats
    const results = await Promise.all(
      formats.map(async (format) => {
        const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              { role: 'user', content: format.prompt }
            ],
          }),
        });

        if (!response.ok) {
          if (response.status === 429) {
            throw new Error('Rate limit exceeded. Please try again in a moment.');
          }
          if (response.status === 402) {
            throw new Error('AI usage limit reached. Please add credits to your workspace.');
          }
          const errorText = await response.text();
          console.error('AI gateway error:', response.status, errorText);
          throw new Error('Failed to generate documentation');
        }

        const data = await response.json();
        return {
          format: format.name,
          content: data.choices[0].message.content
        };
      })
    );

    return new Response(
      JSON.stringify({ results }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in transform-api-docs function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
