const UPLOAD_API_URL = import.meta.env.VITE_SNAPZION_UPLOAD_URL;
const UPLOAD_TOKEN = import.meta.env.VITE_SNAPZION_UPLOAD_TOKEN;

// Debug logging to check if environment variables are loaded
console.log('Environment variables check:');
console.log('UPLOAD_API_URL:', UPLOAD_API_URL);
console.log('UPLOAD_TOKEN exists:', !!UPLOAD_TOKEN);
console.log('All env vars:', {
  VITE_DARK_AI_API_KEY: !!import.meta.env.VITE_DARK_AI_API_KEY,
  VITE_DARK_AI_BASE_URL: import.meta.env.VITE_DARK_AI_BASE_URL,
  VITE_SNAPZION_UPLOAD_URL: import.meta.env.VITE_SNAPZION_UPLOAD_URL,
  VITE_SNAPZION_UPLOAD_TOKEN: !!import.meta.env.VITE_SNAPZION_UPLOAD_TOKEN,
  VITE_CHAT_API_KEY: !!import.meta.env.VITE_CHAT_API_KEY,
});

export interface UploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

export const uploadImageToSnapzion = async (file: File): Promise<UploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file, file.name);

    const response = await fetch(UPLOAD_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${UPLOAD_TOKEN}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    const result = await response.json();
    
    // Handle different response formats
    const imageUrl = result.url || result.file_url || result.link;
    
    if (!imageUrl) {
      throw new Error('No URL returned from upload service');
    }

    return {
      success: true,
      url: imageUrl
    };
  } catch (error) {
    console.error('Image upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
};