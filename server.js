import express from "express";
import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
      return cb(new Error("Please upload a JPG, PNG, or WEBP image."));
    }
    cb(null, true);
  }
});

app.use(express.static(path.join(__dirname, "public")));

app.post("/api/analyze", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Please choose a food photo first." });
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({
        error: "AI analysis is not connected yet. Add your API key to the server setup instructions, then restart the app."
      });
    }

    const base64 = req.file.buffer.toString("base64");
    const imageUrl = `data:${req.file.mimetype};base64,${base64}`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [{
          role: "user",
          content: [
            {
              type: "input_text",
              text: `You are PlateCheck AI, an educational food-group helper. Look only at what is reasonably visible in this meal photo. Return ONLY valid JSON with this exact shape:
{
 "mealSummary": "one short sentence",
 "groups": [
  {"name":"Vegetables and fruit","status":"visible|possibly_missing|unclear","examples":"visible foods or an honest explanation"},
  {"name":"Grains and starchy foods","status":"visible|possibly_missing|unclear","examples":"..."},
  {"name":"Protein foods","status":"visible|possibly_missing|unclear","examples":"..."},
  {"name":"Dairy or alternatives","status":"visible|possibly_missing|unclear","examples":"..."}
 ],
 "ideas": ["two or three gentle, practical variety ideas"],
 "uncertainty": "one sentence explaining that photos cannot show hidden ingredients, exact portions, or the whole day's diet"
}
Do not estimate calories, macros, body weight, or whether the meal is good or bad. Never tell someone they must eat less or skip food. Use possibly_missing rather than missing because foods may be hidden or outside the photo. If unsure, use unclear. Ideas should be optional and culturally flexible.`
            },
            { type: "input_image", image_url: imageUrl }
          ]
        }]
      })
    });

    const payload = await response.json();
    if (!response.ok) {
      console.error("OpenAI API error:", payload);
      return res.status(502).json({ error: "The AI service could not analyse this photo right now. Please try again later." });
    }

    const text = (payload.output || [])
      .flatMap(item => item.content || [])
      .filter(part => part.type === "output_text")
      .map(part => part.text)
      .join("\n");

    let result;
    try {
      const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
      result = JSON.parse(cleaned);
    } catch {
      return res.status(502).json({ error: "The AI returned an unexpected result. Please try another photo." });
    }
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message || "Something went wrong." });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`PlateCheck AI is running at http://localhost:${port}`));
