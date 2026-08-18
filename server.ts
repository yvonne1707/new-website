import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini instance
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API Health
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "Rissau Auto Agency API",
    hasApiKey: !!process.env.GEMINI_API_KEY,
  });
});

// AI Auto Parts Advisor Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, userCar } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Missing or invalid 'messages' array" });
    }

    const ai = getGeminiClient();
    const systemPrompt = `You are the expert Auto Parts Consultant for "Rissau Auto Agency" (Serving customers in Kenya since 2020).
Your store locations:
1. Kirinyaga Road, Nairobi Downtown (Coordinates: -1.2815, 36.8270) - Specializing in engine parts, suspension, Japanese & European spares, clutch, brakes, filters.
2. Opposite Petrol City, Umoja, Kangundo Road, Nairobi (Coordinates: -1.2789, 36.9015) - Specializing in tires, lubricants, routine service, batteries, quick replacement.

Phones & WhatsApp: 0728090599 or 0725309688 (WhatsApp +254728090599 / +254725309688).
Payment: Lipa Na M-Pesa (Till / Paybill), Cash on Delivery in Nairobi, Courier parcel dispatch across Kenya (EasyCoach, 2NK, Guardian, Speedex).

Our key products in stock include:
- Tires: Michelin LTX Force 265/65R17 (KES 24,500), Bridgestone Dueler A/T 265/70R16 (KES 21,500), Yokohama Geolandar 225/65R17 (KES 18,200), Dunlop Grandtrek 265/65R17 (KES 22,000)
- Gaskets: Toyota Hilux 1KD/2KD Gearbox Gasket Kit (KES 4,200), Cylinder Head Gasket (KES 3,800), Valve Cover Gasket (KES 1,950)
- Oils: Castrol Magnatec 5W-30 4L (KES 4,600), Castrol GTX 20W-50 4L (KES 3,800), Total Quartz 9000 5W-40 4L (KES 4,900), Shell Helix HX7 10W-40 4L (KES 4,100), Toyota Genuine ATF WS 4L (KES 5,800), Dot 4 Brake Fluid (KES 850)
- Brakes & Suspension: Front Ceramic Brake Pads (KES 3,200 - KES 5,500), KYB Japan Shock Absorbers (KES 6,500 ea), 555 Japan Ball Joints (KES 2,400 ea), Stabilizer Links (KES 1,800 pr)
- Batteries & Electrical: Chloride Exide 70AH N70MF (KES 14,800), Bosch Platinum Spark Plugs (KES 3,600 set of 4)
- Service Filters: Genuine Oil Filters (KES 800 - KES 1,500), Air Filters (KES 1,200 - KES 2,500), Diesel Fuel Filter (KES 2,200)

Guidelines for your responses:
- Be welcoming, knowledgeable, professional, and practical for Kenyan motorists and mechanics.
- If the customer asks for a recommendation, consider their car make/model/year (e.g. Toyota Hilux, Prado, Probox, Vitz, Fielder, Subaru Forester, Isuzu D-Max, Nissan X-Trail, Mazda CX-5, Mercedes C-Class).
- Provide accurate specs (e.g., tire sizing, viscosity 5W-30 synthetic vs 20W-50 mineral for high mileage engines in Nairobi weather, ceramic vs semi-metallic pads).
- Always mention approximate KES pricing or ask them to add to cart or contact 0728090599 on WhatsApp for custom bulk orders or fitting bookings at our Kirinyaga Road or Umoja branches.
- Keep answers concise, clear, and easy to read on mobile. Format with bullet points where appropriate.`;

    if (!ai) {
      // Intelligent fallback if API key is not yet set
      const lastUserMsg = messages[messages.length - 1]?.content?.toLowerCase() || "";
      let fallbackText = "Hello! I am your Rissau Auto Agency parts specialist. ";
      
      if (lastUserMsg.includes("tire") || lastUserMsg.includes("tyre") || lastUserMsg.includes("michelin") || lastUserMsg.includes("size")) {
        fallbackText += "For tires, we stock genuine Michelin LTX Force 265/65R17 (KES 24,500), Bridgestone Dueler A/T (KES 21,500), and Yokohama Geolandar. We offer free valve fitting at our Umoja and Kirinyaga Road branches! Call/WhatsApp 0728090599 to confirm your exact rim size.";
      } else if (lastUserMsg.includes("oil") || lastUserMsg.includes("castrol") || lastUserMsg.includes("total") || lastUserMsg.includes("service")) {
        fallbackText += "For routine service in Kenya, we recommend Castrol Magnatec 5W-30 (KES 4,600) for newer petrol engines or Castrol GTX 20W-50 (KES 3,800) / Shell Helix HX7 10W-40 for high mileage engines. We also have Toyota Genuine ATF WS and oil filters for all Japanese & European models.";
      } else if (lastUserMsg.includes("gasket") || lastUserMsg.includes("gearbox") || lastUserMsg.includes("hilux")) {
        fallbackText += "We have original Toyota Hilux Gearbox Gasket Kits (KES 4,200) and Cylinder Head Gaskets in stock at our Kirinyaga Road branch. We deliver same-day within Nairobi via rider or upcountry via courier.";
      } else if (lastUserMsg.includes("location") || lastUserMsg.includes("where") || lastUserMsg.includes("branch") || lastUserMsg.includes("kirinyaga") || lastUserMsg.includes("umoja")) {
        fallbackText += "We have two branches in Nairobi: 1) Kirinyaga Road, CBD (Downtown Nairobi) and 2) Opposite Petrol City, Umoja, Kangundo Road. You can reach us directly at 0728090599 / 0725309688.";
      } else {
        fallbackText += `We supply genuine auto spare parts, tires, oils, gearbox gaskets, suspension parts, and batteries for Toyota, Nissan, Isuzu, Subaru, Mitsubishi, Mazda, and Mercedes. How can we assist your vehicle today? You can also call us directly on 0728090599.`;
      }

      return res.json({ reply: fallbackText });
    }

    // Format conversation history for Gemini
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: contents,
      config: {
        systemInstruction: systemPrompt + (userCar ? `\nUser's selected vehicle: ${userCar}` : ""),
        temperature: 0.7,
      },
    });

    const reply = response.text || "Thank you for contacting Rissau Auto Agency. How can we help you find the right spare part today?";
    return res.json({ reply });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    return res.status(500).json({
      error: "Failed to generate AI consultation",
      details: error?.message || "Unknown error",
    });
  }
});

async function startServer() {
  // Vite middleware in dev, static files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Rissau Auto Agency server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
