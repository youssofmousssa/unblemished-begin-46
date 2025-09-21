import { useState, useCallback } from 'react';

interface ProcessedMedia {
  type: 'video' | 'image' | 'audio';
  url: string;
  downloadLinks?: { url: string; label: string; quality?: string }[];
  metadata?: {
    title?: string;
    duration?: number;
    size?: string;
    style?: string;
  };
}

interface UseMediaProcessorReturn {
  processedMedia: ProcessedMedia | null;
  isProcessing: boolean;
  processApiResponse: (response: any) => void;
  clearMedia: () => void;
}

export const useMediaProcessor = (): UseMediaProcessorReturn => {
  const [processedMedia, setProcessedMedia] = useState<ProcessedMedia | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const detectMediaType = (url: string): 'video' | 'image' | 'audio' => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov', '.mkv'];
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac'];

    const urlLower = url.toLowerCase();
    
    if (videoExtensions.some(ext => urlLower.includes(ext))) {
      return 'video';
    }
    if (imageExtensions.some(ext => urlLower.includes(ext))) {
      return 'image';
    }
    if (audioExtensions.some(ext => urlLower.includes(ext))) {
      return 'audio';
    }

    // Fallback: try to detect by content-type or URL patterns
    if (urlLower.includes('video') || urlLower.includes('youtube') || urlLower.includes('vimeo')) {
      return 'video';
    }
    if (urlLower.includes('audio') || urlLower.includes('sound') || urlLower.includes('music')) {
      return 'audio';
    }
    
    // Default to image if can't determine
    return 'image';
  };

  const processApiResponse = useCallback((response: any) => {
    setIsProcessing(true);
    
    try {
      let media: ProcessedMedia | null = null;

      // Handle different API response formats
      if (response.url) {
        // Single media URL
        media = {
          type: detectMediaType(response.url),
          url: response.url,
          metadata: {
            title: response.title || response.name,
            size: response.size,
            duration: response.duration
          }
        };
      } else if (response.video_url) {
        // Video specific response
        media = {
          type: 'video',
          url: response.video_url,
          metadata: {
            title: response.title,
            duration: response.duration
          }
        };
      } else if (response.audio_url) {
        // Audio specific response
        media = {
          type: 'audio',
          url: response.audio_url,
          metadata: {
            title: response.title,
            duration: response.duration
          }
        };
      } else if (response.voice) {
        // TTS API response with 'voice' field
        media = {
          type: 'audio',
          url: response.voice,
          metadata: {
            title: response.voice_used || response.title,
            style: response.style_used
          }
        };
      } else if (response.image_url) {
        // Image specific response
        media = {
          type: 'image',
          url: response.image_url,
          metadata: {
            title: response.title
          }
        };
      } else if (response.download_links && Array.isArray(response.download_links)) {
        // Multiple download links (social media)
        const mainLink = response.download_links[0];
        if (mainLink) {
          media = {
            type: detectMediaType(mainLink.url),
            url: mainLink.url,
            downloadLinks: response.download_links.map((link: any) => ({
              url: link.url,
              label: link.quality || link.label || `Download ${link.format || ''}`,
              quality: link.quality
            })),
            metadata: {
              title: response.title,
              duration: response.duration
            }
          };
        }
      } else if (response.links && Array.isArray(response.links)) {
        // Alternative format for multiple links
        const mainLink = response.links[0];
        if (mainLink) {
          media = {
            type: detectMediaType(mainLink.url || mainLink),
            url: mainLink.url || mainLink,
            downloadLinks: response.links.map((link: any, index: number) => ({
              url: link.url || link,
              label: link.label || `Download Option ${index + 1}`,
              quality: link.quality
            })),
            metadata: {
              title: response.title
            }
          };
        }
      } else if (typeof response === 'string' && (response.startsWith('http') || response.startsWith('data:'))) {
        // Direct URL string
        media = {
          type: detectMediaType(response),
          url: response
        };
      } else if (response.data && response.data.url) {
        // Nested data format
        media = {
          type: detectMediaType(response.data.url),
          url: response.data.url,
          metadata: response.data.metadata || response.metadata
        };
      }

      setProcessedMedia(media);
    } catch (error) {
      console.error('Error processing media response:', error);
      setProcessedMedia(null);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const clearMedia = useCallback(() => {
    setProcessedMedia(null);
    setIsProcessing(false);
  }, []);

  return {
    processedMedia,
    isProcessing,
    processApiResponse,
    clearMedia
  };
};