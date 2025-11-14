import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, upgrade, connection",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 });
  }

  try {
    const { socket, response } = Deno.upgradeWebSocket(req);
    
    let openAISocket: WebSocket | null = null;
    
    socket.onopen = async () => {
      console.log("Client connected");
      
      // Connect to OpenAI Realtime API
      const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
      if (!OPENAI_API_KEY) {
        console.error("OPENAI_API_KEY not found");
        socket.close(1008, "API key not configured");
        return;
      }

      const model = "gpt-4o-realtime-preview-2024-12-17";
      const url = `wss://api.openai.com/v1/realtime?model=${model}`;
      
      openAISocket = new WebSocket(url, {
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "OpenAI-Beta": "realtime=v1",
        },
      });

      openAISocket.onopen = () => {
        console.log("Connected to OpenAI");
        socket.send(JSON.stringify({ type: "connected" }));
      };

      openAISocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("From OpenAI:", data.type);
        
        // Forward session.created event
        if (data.type === "session.created") {
          socket.send(event.data);
          
          // Send session configuration
          const sessionConfig = {
            type: "session.update",
            session: {
              modalities: ["text", "audio"],
              instructions: "You are a helpful API documentation assistant. Help users understand API specifications by explaining endpoints, parameters, authentication methods, and best practices. Keep responses clear and concise.",
              voice: "alloy",
              input_audio_format: "pcm16",
              output_audio_format: "pcm16",
              input_audio_transcription: {
                model: "whisper-1"
              },
              turn_detection: {
                type: "server_vad",
                threshold: 0.5,
                prefix_padding_ms: 300,
                silence_duration_ms: 1000
              },
              temperature: 0.8,
              max_response_output_tokens: 4096
            }
          };
          openAISocket?.send(JSON.stringify(sessionConfig));
        } else {
          socket.send(event.data);
        }
      };

      openAISocket.onerror = (error) => {
        console.error("OpenAI error:", error);
        socket.send(JSON.stringify({ type: "error", error: "OpenAI connection error" }));
      };

      openAISocket.onclose = () => {
        console.log("OpenAI disconnected");
        socket.close();
      };
    };

    socket.onmessage = (event) => {
      if (openAISocket && openAISocket.readyState === WebSocket.OPEN) {
        console.log("From client:", typeof event.data === "string" ? JSON.parse(event.data).type : "binary");
        openAISocket.send(event.data);
      }
    };

    socket.onclose = () => {
      console.log("Client disconnected");
      if (openAISocket) {
        openAISocket.close();
      }
    };

    socket.onerror = (error) => {
      console.error("Socket error:", error);
      if (openAISocket) {
        openAISocket.close();
      }
    };

    return response;
  } catch (error) {
    console.error("WebSocket upgrade error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
