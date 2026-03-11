import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { prompt, image, images, category } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Build category-specific prompt prefix
    const categoryPrompts: Record<string, string> = {
      combine: "Combine these images into one cohesive image. ",
      collage: "Create an artistic collage from these images. ",
      style: "Apply the style of the first image to the second image. ",
      morph: "Create a smooth morph/blend between these images. ",
      compare: "Create a side-by-side comparison of these images with visual analysis. ",
      generate: "",
      edit: "",
    };

    const prefix = categoryPrompts[category] || "";
    const finalPrompt = prefix + (prompt || "Transform this image creatively");

    // Build message content - support multiple images
    let userContent: any;
    const allImages = images || (image ? [image] : []);

    if (allImages.length > 0) {
      userContent = [
        { type: "text", text: finalPrompt },
        ...allImages.map((img: string) => ({
          type: "image_url",
          image_url: { url: img },
        })),
      ];
    } else {
      userContent = finalPrompt;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [
          { role: "user", content: userContent }
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const message = data.choices?.[0]?.message;
    const resultImages = message?.images || [];
    const text = message?.content || "";

    return new Response(JSON.stringify({ text, images: resultImages }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-image error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});