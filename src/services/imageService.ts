interface ImageGenerationRequest {
  text: string;
  api_key: string;
}

interface ImageEditRequest extends ImageGenerationRequest {
  link?: string;
}

interface ImageMergeRequest {
  text: string;
  links: string;
  api_key: string;
}

interface ImageResponse {
  date: string;
  url?: string;
  resp?: string;
  dev: string;
}

export class ImageGenerationService {
  private baseUrl = import.meta.env.VITE_DARK_AI_BASE_URL;
  private apiKey = import.meta.env.VITE_CHAT_API_KEY;

  async generateWithGemini(prompt: string, imageUrl?: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/api/gemini-img/edit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: prompt,
        ...(imageUrl && { link: imageUrl }),
        api_key: this.apiKey,
      } as ImageEditRequest),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ImageResponse = await response.json();
    return data.url || data.resp || '';
  }

  async generateWithGPT(prompt: string, imageUrl?: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/api/gpt-img/edit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: prompt,
        ...(imageUrl && { link: imageUrl }),
        api_key: this.apiKey,
      } as ImageEditRequest),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ImageResponse = await response.json();
    return data.url || data.resp || '';
  }

  async generateWithFluxPro(prompt: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/api/flux-pro`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: prompt,
        api_key: this.apiKey,
      } as ImageGenerationRequest),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ImageResponse = await response.json();
    return data.url || data.resp || '';
  }

  async generateWithImgCV(prompt: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/api/img-cv`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: prompt,
        api_key: this.apiKey,
      } as ImageGenerationRequest),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ImageResponse = await response.json();
    return data.url || data.resp || '';
  }

  async mergeImages(prompt: string, imageUrls: string[]): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/api/nano-banana`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: prompt,
        links: imageUrls.join(','),
        api_key: this.apiKey,
      } as ImageMergeRequest),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ImageResponse = await response.json();
    return data.url || data.resp || '';
  }
}

export const imageService = new ImageGenerationService();