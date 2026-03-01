import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface MarketStat {
  label: string;
  value: string;
  change: number;
  unit: string;
}

export async function fetchLiveMarketStats(): Promise<MarketStat[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Search for the latest WTI Crude Oil price (per barrel), the current North Dakota active rig count, the current Henry Hub natural gas price (per MMBtu), and the latest daily oil production for the Bakken Shale (in barrels per day). Return ONLY a JSON array of objects with the following keys: label (string), value (string, e.g. '$78.42'), change (number, percentage change from previous day/week), unit (string, e.g. 'bbl', 'active', 'bpd', 'mcf').",
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (text) {
      const stats = JSON.parse(text);
      return stats;
    }
  } catch (error) {
    console.error("Error fetching live market stats:", error);
  }
  
  // Fallback to semi-realistic data if search fails or is unavailable
  return [
    { label: 'WTI Crude', value: '$78.42', change: 1.2, unit: 'bbl' },
    { label: 'Rig Count (ND)', value: '42', change: -2, unit: 'active' },
    { label: 'Daily Production', value: '1.24M', change: 0.5, unit: 'bpd' },
    { label: 'Gas Price', value: '$2.15', change: -0.8, unit: 'mcf' },
  ];
}
