import { IncomingForm, type File } from "formidable";
import fs from "fs/promises";

export const config = {
  api: {
    bodyParser: false,
  },
};

const allowedPredictions = new Set([
  "Bacterial red disease",
  "Aeromonas infection",
  "Bacterial gill disease",
  "Winter fungus/Cotton wool disease",
  "Healthy",
  "Parasitesic diseases",
  "Fin rot",
]);

const getSingleFile = (file: File | File[] | undefined) => {
  if (!file) return null;
  return Array.isArray(file) ? file[0] : file;
};

const parseForm = (req: any) => {
  return new Promise<{ files: Record<string, File | File[] | undefined> }>(
    (resolve, reject) => {
      const form = new IncomingForm({
        multiples: false,
        maxFileSize: 10 * 1024 * 1024,
      });

      form.parse(req, (error, _fields, files) => {
        if (error) {
          reject(error);
          return;
        }

        resolve({ files });
      });
    },
  );
};

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const modelUrl = process.env.FISH_DISEASE_MODEL_URL;

    if (!modelUrl) {
      return res.status(500).json({
        error: "Fish disease model URL is not configured.",
      });
    }

    const { files } = await parseForm(req);

    const uploadedFile =
      getSingleFile(files.image) ||
      getSingleFile(files.img) ||
      getSingleFile(files.file);

    if (!uploadedFile) {
      return res.status(400).json({ error: "No image uploaded." });
    }

    const buffer = await fs.readFile(uploadedFile.filepath);

    const formData = new FormData();
    const blob = new Blob([buffer], {
      type: uploadedFile.mimetype || "application/octet-stream",
    });

    // Your model expects the image as "img"
    formData.append("img", blob, uploadedFile.originalFilename || "pet.jpg");

    const modelResponse = await fetch(modelUrl, {
      method: "POST",
      body: formData,
    });

    const responseText = await modelResponse.text();

    if (!modelResponse.ok) {
      console.error("Health screening model failed:", {
        status: modelResponse.status,
        responseText,
      });

      return res.status(502).json({
        error: "Failed to screen the pet health image.",
      });
    }

    let prediction = responseText.trim().replace(/^"|"$/g, "");

    try {
      const parsed = JSON.parse(responseText);

      if (typeof parsed === "string") {
        prediction = parsed;
      } else {
        prediction =
          parsed.result ||
          parsed.prediction ||
          parsed.class ||
          parsed.label ||
          prediction;
      }
    } catch {
      // Model returned plain string, so keep prediction as responseText.
    }

    if (!allowedPredictions.has(prediction)) {
      console.error("Unexpected health model prediction:", prediction);

      return res.status(502).json({
        error: "The health screening model returned an unknown result.",
      });
    }

    return res.status(200).json({
      result: prediction,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error.",
    });
  }
}
