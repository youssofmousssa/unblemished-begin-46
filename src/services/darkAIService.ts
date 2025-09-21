const BASE_URL = "https://darkv1.onrender.com";
const API_KEY = "E4dm0BgIcSMdu35Vn2nZ92V0eiVqm_121uzezjH8k8Q";

export interface MusicCreationResponse {
  data: string;
  response: string;
  dev: string;
}

export interface SocialDownloadLink {
  url: string;
  quality: string;
  type: 'video' | 'audio';
  ext: string;
}

export interface SocialDownloadResponse {
  date: string;
  title: string;
  links: SocialDownloadLink[];
  dev: string;
}

export class DarkAIService {
  // Create 15s instrumental music
  static async create15sMusic(text: string): Promise<MusicCreationResponse> {
    const response = await fetch(`${BASE_URL}/api/create-music`, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text,
        api_key: API_KEY
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  // Create 3:15 music with lyrics
  static async createFullMusic(lyrics: string, tags: string = "pop"): Promise<MusicCreationResponse> {
    const response = await fetch(`${BASE_URL}/api/music`, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        lyrics,
        tags,
        api_key: API_KEY
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  // Download social media content
  static async downloadSocialMedia(url: string): Promise<SocialDownloadResponse> {
    const response = await fetch(`${BASE_URL}/api/social-downloader`, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url,
        api_key: API_KEY
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  // Format quality label for better UX
  static formatQualityLabel(link: SocialDownloadLink): string {
    const { quality, type, ext } = link;
    
    if (type === 'audio') {
      return `🎵 Audio (${quality})`;
    }
    
    if (type === 'video') {
      switch (quality) {
        case 'hd_no_watermark':
          return `🎬 HD Video (No Watermark)`;
        case 'no_watermark':
          return `📹 Video (No Watermark)`;
        case 'watermark':
          return `📱 Video (With Watermark)`;
        default:
          return `📹 Video (${quality})`;
      }
    }
    
    return `📄 ${quality}`;
  }

  // Get download filename
  static getDownloadFilename(title: string, link: SocialDownloadLink): string {
    const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50);
    const extension = link.type === 'audio' ? 'mp3' : 'mp4';
    return `${cleanTitle}_${link.quality}.${extension}`;
  }
}