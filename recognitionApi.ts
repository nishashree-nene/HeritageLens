
export type RecognitionResult = {
  monument_id: string;
  monument_name: string;
  confidence: number;
  model_status: "trained";
};

const API_URL =
  import.meta.env.VITE_RECOGNITION_API_URL ?? "http://127.0.0.1:8000";

export async function identifyMonument(
  image: File
): Promise<RecognitionResult> {
  const formData = new FormData();
  formData.append("image", image);

  const response = await fetch(`${API_URL}/recognize`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(
      `Recognition failed (${response.status}). Check that the AI server is running.`
    );
  }

  return response.json() as Promise<RecognitionResult>;
}
