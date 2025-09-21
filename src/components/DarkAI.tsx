import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MessageCircle, 
  Volume2, 
  VideoIcon, 
  Music, 
  Download, 
  Scissors,
  Sparkles,
  Send,
  Upload,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Mail
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MediaViewer from "@/components/MediaViewer";
import { useMediaProcessor } from "@/hooks/useMediaProcessor";
import ImageUpload from "@/components/ImageUpload";
import ChatInterface from "@/components/ChatInterface";
import { useAuth } from "@/context/AuthContext";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "@/config/firebase";
import MobileSidebar, { AnimatedHamburger } from "@/components/MobileSidebar";
import DesktopSidebar, { AnimatedDesktopHamburger } from "@/components/DesktopSidebar";
import { DarkAIService, SocialDownloadResponse } from "@/services/darkAIService";

const DarkAI = () => {
  const [activeTab, setActiveTab] = useState("video-generation");
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(false);
  const { toast } = useToast();
  const { processedMedia, isProcessing, processApiResponse, clearMedia } = useMediaProcessor();
  const { currentUser, isEmailVerified } = useAuth();

  // Email verification check function
  const checkEmailVerification = () => {
    if (!isEmailVerified) {
      toast({
        title: "Email not verified",
        description: "Please verify your email before using this service.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const sendVerificationEmail = async () => {
    if (currentUser && !isEmailVerified) {
      try {
        await sendEmailVerification(currentUser);
        toast({
          title: "Verification email sent",
          description: "Please check your email for verification link.",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  // Environment variables for API
  const API_KEY = import.meta.env.VITE_DARK_AI_API_KEY;
  const BASE_URL = import.meta.env.VITE_DARK_AI_BASE_URL;

  // State for different tabs
  const [textData, setTextData] = useState({
    model: "",
    prompt: "",
    response: ""
  });

  const [ttsData, setTtsData] = useState({
    text: "",
    voice: "",
    style: "",
    audioUrl: ""
  });

  const [videoData, setVideoData] = useState({
    type: "",
    prompt: "",
    imageUrl: "",
    videoUrl: "",
    uploadedImageUrl: ""
  });

  const [musicData, setMusicData] = useState({
    type: "",
    lyrics: "",
    tags: "",
    musicUrl: ""
  });

  const [socialData, setSocialData] = useState({
    url: "",
    result: null as SocialDownloadResponse | null
  });

  const [bgRemovalData, setBgRemovalData] = useState({
    imageUrl: "",
    result: null,
    uploadedImageUrl: ""
  });

  const tabs = [
    { id: "video-generation", label: "Video Generation", icon: VideoIcon },
    { id: "text-chat", label: "Text Chat", icon: MessageCircle },
    { id: "tts", label: "TTS", icon: Volume2 },
    { id: "music-generation", label: "Music Generation", icon: Music },
    { id: "social-downloader", label: "Social Media Downloader", icon: Download },
    { id: "background-removal", label: "Background Removal", icon: Scissors },
  ];

  const aiModels = [
    { id: "online", name: "Online AI" },
    { id: "standard", name: "Standard AI" },
    { id: "super-genius", name: "Super Genius AI" },
    { id: "online-genius", name: "Online Genius AI" },
    { id: "gemini-pro", name: "Gemini 2.5 Pro" },
    { id: "gemini-deep", name: "Gemini 2.5 Deep Search" },
    { id: "gemini-flash", name: "Gemini 2.5 Flash" },
    { id: "gemma-4b", name: "Gemma 4B" },
    { id: "gemma-12b", name: "Gemma 12B" },
    { id: "gemma-27b", name: "Gemma 27B" },
    { id: "wormgpt", name: "WormGPT" },
  ];

  const voices = [
    { id: "nova", name: "Nova" },
    { id: "alloy", name: "Alloy" },
    { id: "verse", name: "Verse" },
    { id: "flow", name: "Flow" },
    { id: "aria", name: "Aria" },
    { id: "lumen", name: "Lumen" },
  ];

  // API Functions
  const handleTextGeneration = async () => {
    if (!checkEmailVerification()) return;
    
    if (!textData.model || !textData.prompt) {
      toast({
        title: "Error",
        description: "Please select a model and enter a prompt",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const endpoints = {
        "online": "/api/ai/online",
        "standard": "/api/ai/standard",
        "super-genius": "/api/ai/super-genius",
        "online-genius": "/api/ai/online-genius",
        "gemini-pro": "/api/gemini/pro",
        "gemini-deep": "/api/gemini/deep",
        "gemini-flash": "/api/gemini/flash",
        "gemma-4b": "/api/gemma/4b",
        "gemma-12b": "/api/gemma/12b",
        "gemma-27b": "/api/gemma/27b",
        "wormgpt": "/api/wormgpt"
      };

      const response = await fetch(`${BASE_URL}${endpoints[textData.model]}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: textData.prompt,
          api_key: API_KEY
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const responseText = result.response || JSON.stringify(result, null, 2);
      setTextData(prev => ({ ...prev, response: responseText }));
      
      toast({
        title: "Success",
        description: "Text generated successfully!"
      });
    } catch (error) {
      console.error("Text generation error:", error);
      toast({
        title: "Error",
        description: `Failed to generate text: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTTSGeneration = async () => {
    if (!checkEmailVerification()) return;
    
    if (!ttsData.text) {
      toast({
        title: "Error",
        description: "Please enter text to convert",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const isCustom = ttsData.voice || ttsData.style;
      const endpoint = isCustom ? "/api/voice/custom" : "/api/voice";
      
      let body: any = {
        text: ttsData.text,
        api_key: API_KEY
      };

      if (isCustom) {
        if (ttsData.voice) body.voice = ttsData.voice;
        if (ttsData.style) body.style = ttsData.style;
      }

      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const audioUrl = result.voice || result.url || result.audio_url || "Audio generated successfully";
      setTtsData(prev => ({ ...prev, audioUrl }));
      processApiResponse(result);
      
      toast({
        title: "Success",
        description: "Speech generated successfully!"
      });
    } catch (error) {
      console.error("TTS generation error:", error);
      toast({
        title: "Error",
        description: `Failed to generate speech: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoGeneration = async () => {
    if (!checkEmailVerification()) return;
    
    if (!videoData.type || !videoData.prompt) {
      toast({
        title: "Error",
        description: "Please select type and enter a prompt",
        variant: "destructive"
      });
      return;
    }

    const imageUrl = videoData.uploadedImageUrl || videoData.imageUrl;
    if (videoData.type === "image-to-video" && (!imageUrl || !imageUrl.trim())) {
      toast({
        title: "Error",
        description: "Image is required for image-to-video conversion",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = videoData.type === "text-to-video" 
        ? "/api/veo3/text-to-video"
        : "/api/veo3/image-to-video";
      
      let body: any = {
        text: videoData.prompt,
        api_key: API_KEY
      };

      if (videoData.type === "image-to-video") {
        const imageUrl = videoData.uploadedImageUrl || videoData.imageUrl;
        body.link = imageUrl.trim();
      }

      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const videoUrl = result.url || result.video_url || result.video || "Video generated successfully";
      setVideoData(prev => ({ ...prev, videoUrl }));
      processApiResponse(result);
      
      toast({
        title: "Success",
        description: "Video generated successfully!"
      });
    } catch (error) {
      console.error("Video generation error:", error);
      toast({
        title: "Error",
        description: `Failed to generate video: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMusicGeneration = async () => {
    if (!checkEmailVerification()) return;
    
    if (!musicData.type || !musicData.lyrics) {
      toast({
        title: "Error",
        description: "Please select type and enter lyrics/description",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      let result;
      
      if (musicData.type === "15s-instrumental") {
        result = await DarkAIService.create15sMusic(musicData.lyrics);
      } else if (musicData.type === "full-song") {
        const tags = musicData.tags || "pop";
        result = await DarkAIService.createFullMusic(musicData.lyrics, tags);
      }

      const musicUrl = result?.response || "Music generated successfully";
      setMusicData(prev => ({ ...prev, musicUrl }));
      processApiResponse(result);
      
      toast({
        title: "Success",
        description: "Music generated successfully!"
      });
    } catch (error) {
      console.error("Music generation error:", error);
      toast({
        title: "Error",
        description: `Failed to generate music: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialDownload = async () => {
    if (!checkEmailVerification()) return;
    
    if (!socialData.url || !socialData.url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
      return;
    }

    if (!socialData.url.startsWith("http://") && !socialData.url.startsWith("https://")) {
      toast({
        title: "Error",
        description: "URL must start with http:// or https://",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await DarkAIService.downloadSocialMedia(socialData.url.trim());
      setSocialData(prev => ({ ...prev, result }));
      
      toast({
        title: "Success",
        description: `Found ${result.links?.length || 0} download options!`
      });
    } catch (error) {
      console.error("Social download error:", error);
      toast({
        title: "Error",
        description: `Failed to download content: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadLink = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      toast({
        title: "Download Started",
        description: `Downloading ${filename}...`
      });
    } catch (error) {
      console.error("Download error:", error);
      // Fallback: open in new tab
      window.open(url, '_blank');
      toast({
        title: "Download Link Opened",
        description: "The download link has been opened in a new tab."
      });
    }
  };

  const handleBackgroundRemoval = async () => {
    if (!checkEmailVerification()) return;
    
    const imageUrl = bgRemovalData.uploadedImageUrl || bgRemovalData.imageUrl;
    if (!imageUrl) {
      toast({
        title: "Error",
        description: "Please upload an image or enter an image URL",
        variant: "destructive"
      });
      return;
    }

    if (bgRemovalData.imageUrl && !bgRemovalData.imageUrl.startsWith("http://") && !bgRemovalData.imageUrl.startsWith("https://")) {
      toast({
        title: "Error",
        description: "Image URL must start with http:// or https://",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_DARK_AI_BASE_URL}/api/remove-bg`, {
        method: "POST",
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url: imageUrl,
          api_key: import.meta.env.VITE_DARK_AI_API_KEY
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("BG removal result:", result);
      
      const processedImageUrl = result.response;
      setBgRemovalData(prev => ({ ...prev, result: processedImageUrl }));
      
      toast({
        title: "Success",
        description: "Background removed successfully!"
      });
    } catch (error) {
      console.error("Background removal error:", error);
      toast({
        title: "Error",
        description: `Failed to remove background: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-primary">
            DarkAI Platform
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your ideas into stunning content with advanced AI technology
          </p>
        </div>
      </div>

      {/* Main Content */}
        <div className="container mx-auto px-6 pb-12">
          {/* Email verification warning */}
          {currentUser && !isEmailVerified && (
            <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 animate-fade-in">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium">Email not verified</p>
                  <p className="text-sm opacity-90">Please verify your email to access all AI services.</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={sendVerificationEmail}
                  className="underline hover:bg-destructive/20 transition-smooth"
                >
                  Resend Email
                </Button>
              </div>
            </div>
          )}
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Desktop Header with Hamburger Menu */}
            <div className="hidden md:flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <AnimatedDesktopHamburger 
                  isOpen={isDesktopSidebarOpen} 
                  onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)} 
                />
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl shadow-glow">
                    <span className="text-2xl">🔥</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {tabs.find(tab => tab.id === activeTab)?.label || 'DarkAI Platform'}
                    </h2>
                    <p className="text-sm text-muted-foreground">Advanced AI Services</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Header with Hamburger Menu */}
            <div className="flex items-center justify-between mb-6 md:hidden">
              <AnimatedHamburger 
                isOpen={isMobileSidebarOpen} 
                onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} 
              />
              <h2 className="text-lg font-semibold text-foreground">
                {tabs.find(tab => tab.id === activeTab)?.label || 'DarkAI'}
              </h2>
              <div className="w-10" /> {/* Spacer for balance */}
            </div>

            {/* Desktop Sidebar */}
            <DesktopSidebar
              isOpen={isDesktopSidebarOpen}
              onClose={() => setIsDesktopSidebarOpen(false)}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              tabs={tabs}
            />

            {/* Mobile Sidebar */}
            <MobileSidebar
              isOpen={isMobileSidebarOpen}
              onClose={() => setIsMobileSidebarOpen(false)}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              tabs={tabs}
            />

          {/* Text Chat Tab */}
          <TabsContent value="text-chat" className="space-y-6">
            <Card className="bg-card/50 border border-border/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-primary text-xl">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  AI Chat Interface
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Experience ChatGPT-style conversations with our advanced AI models
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Chat is now available as a dedicated page for better experience</p>
                  <Button 
                    onClick={() => window.location.href = '/chat'} 
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Go to Chat Page
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TTS Tab */}
          <TabsContent value="tts" className="space-y-6">
            <Card className="bg-card border border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Volume2 className="w-6 h-6" />
                  Text to Speech
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Convert text to natural-sounding speech with AI voices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="voice-select" className="text-foreground">Voice (Optional)</Label>
                    <Select value={ttsData.voice} onValueChange={(value) => setTtsData(prev => ({ ...prev, voice: value }))}>
                      <SelectTrigger className="bg-input border-border text-foreground">
                        <SelectValue placeholder="Default Voice" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {voices.map((voice) => (
                          <SelectItem key={voice.id} value={voice.id} className="text-popover-foreground">
                            {voice.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="style" className="text-foreground">Style (Optional)</Label>
                    <Input
                      value={ttsData.style}
                      onChange={(e) => setTtsData(prev => ({ ...prev, style: e.target.value }))}
                      placeholder="e.g., cheerful tone, soft whisper"
                      className="bg-input border-border text-foreground"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="tts-text" className="text-foreground">Text to Convert</Label>
                  <Textarea
                    value={ttsData.text}
                    onChange={(e) => setTtsData(prev => ({ ...prev, text: e.target.value }))}
                    placeholder="Enter the text you want to convert to speech..."
                    className="min-h-24 bg-input border-border text-foreground resize-none"
                  />
                </div>
                {ttsData.audioUrl && (
                  <div>
                    <Label className="text-foreground">Generated Audio</Label>
                    <div className="bg-gradient-to-br from-purple-500/5 to-pink-500/10 p-6 rounded-xl border border-border space-y-4">
                      <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 rounded-full border border-green-500/20">
                          <Volume2 className="w-4 h-4" />
                          <span className="text-sm font-medium">Audio Generated Successfully!</span>
                        </div>
                      </div>
                      
                      {ttsData.audioUrl.startsWith('http') ? (
                        <div className="text-center">
                          <audio controls className="mx-auto mb-4">
                            <source src={ttsData.audioUrl} type="audio/mpeg" />
                            <source src={ttsData.audioUrl} type="audio/wav" />
                            Your browser does not support the audio element.
                          </audio>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(ttsData.audioUrl, '_blank')}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download Audio
                          </Button>
                        </div>
                      ) : (
                        <div className="bg-muted/50 p-4 rounded-lg max-h-64 overflow-auto">
                          <pre className="text-sm text-foreground whitespace-pre-wrap text-left">
                            {ttsData.audioUrl}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <Button 
                  onClick={handleTTSGeneration}
                  disabled={isLoading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isLoading ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 mr-2" />
                      Generate Speech
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Video Generation Tab */}
          <TabsContent value="video-generation" className="space-y-6">
            <Card className="bg-card border border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <VideoIcon className="w-6 h-6" />
                  Video Generation
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Create videos from text prompts or transform images into videos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="video-type" className="text-foreground">Video Type</Label>
                  <Select value={videoData.type} onValueChange={(value) => setVideoData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue placeholder="Select Video Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="text-to-video" className="text-popover-foreground">Text to Video</SelectItem>
                      <SelectItem value="image-to-video" className="text-popover-foreground">Image to Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="video-prompt" className="text-foreground">Video Description</Label>
                  <Textarea
                    value={videoData.prompt}
                    onChange={(e) => setVideoData(prev => ({ ...prev, prompt: e.target.value }))}
                    placeholder="Describe the video you want to create..."
                    className="min-h-24 bg-input border-border text-foreground resize-none"
                  />
                </div>
                {videoData.type === "image-to-video" && (
                  <ImageUpload
                    label="Upload Image for Video Generation"
                    placeholder="Select an image to convert to video"
                    onUploadComplete={(url) => setVideoData(prev => ({ ...prev, uploadedImageUrl: url }))}
                    currentUrl={videoData.imageUrl}
                    onUrlChange={(url) => setVideoData(prev => ({ ...prev, imageUrl: url }))}
                    showUrlInput={true}
                  />
                )}
                {videoData.videoUrl && (
                  <div>
                    <Label className="text-foreground">Generated Video</Label>
                    <div className="bg-gradient-to-br from-red-500/5 to-pink-500/10 p-6 rounded-xl border border-border space-y-4">
                      <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 rounded-full border border-green-500/20">
                          <VideoIcon className="w-4 h-4" />
                          <span className="text-sm font-medium">Video Generated Successfully!</span>
                        </div>
                      </div>
                      
                      {videoData.videoUrl.startsWith('http') ? (
                        <div className="text-center">
                          <video 
                            controls 
                            className="max-w-full h-64 mx-auto rounded-lg shadow-lg mb-4"
                            preload="metadata"
                          >
                            <source src={videoData.videoUrl} type="video/mp4" />
                            <source src={videoData.videoUrl} type="video/webm" />
                            Your browser does not support the video element.
                          </video>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(videoData.videoUrl, '_blank')}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download Video
                          </Button>
                        </div>
                      ) : (
                        <div className="bg-muted/50 p-4 rounded-lg max-h-64 overflow-auto">
                          <pre className="text-sm text-foreground whitespace-pre-wrap text-left">
                            {videoData.videoUrl}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <Button 
                  onClick={handleVideoGeneration}
                  disabled={isLoading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isLoading ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <VideoIcon className="w-4 h-4 mr-2" />
                      Generate Video
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Music Generation Tab */}
          <TabsContent value="music-generation" className="space-y-6">
            <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-indigo-50/50 dark:from-purple-950/20 dark:via-pink-950/10 dark:to-indigo-950/20 border border-border">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-indigo-500/5" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-3 text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                    <Music className="w-6 h-6 text-white" />
                  </div>
                  AI Music Generation
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Create professional AI-generated music with just a prompt - from 15-second clips to full 3:15 songs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 relative">
                <div className="space-y-3">
                  <Label htmlFor="music-type" className="text-sm font-semibold text-foreground">Music Type</Label>
                  <Select value={musicData.type} onValueChange={(value) => setMusicData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger className="h-12 bg-background/60 backdrop-blur-sm border-2 hover:border-purple-300 focus:border-purple-500 transition-colors">
                      <SelectValue placeholder="Choose your music style" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="15s-instrumental" className="py-3 text-popover-foreground">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                          <div>
                            <div className="font-medium">🎼 15s Instrumental</div>
                            <div className="text-xs text-muted-foreground">Quick instrumental track</div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="full-song" className="py-3 text-popover-foreground">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                          <div>
                            <div className="font-medium">🎵 Full Song (3:15)</div>
                            <div className="text-xs text-muted-foreground">Complete song with lyrics</div>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="music-lyrics" className="text-sm font-semibold text-foreground">
                    {musicData.type === "full-song" ? "Song Lyrics" : "Music Description"}
                  </Label>
                  <Textarea
                    value={musicData.lyrics}
                    onChange={(e) => setMusicData(prev => ({ ...prev, lyrics: e.target.value }))}
                    placeholder={
                      musicData.type === "full-song" 
                        ? "Write your song lyrics here... (verse, chorus, bridge, etc.)"
                        : "Describe your instrumental... (e.g., 'upbeat electronic dance music with heavy bass')"
                    }
                    className="min-h-[120px] bg-background/60 backdrop-blur-sm border-2 hover:border-purple-300 focus:border-purple-500 transition-colors resize-none"
                  />
                </div>
                
                {musicData.type === "full-song" && (
                  <div className="space-y-3">
                    <Label htmlFor="music-tags" className="text-sm font-semibold text-foreground">Music Genre (Optional)</Label>
                    <Input
                      value={musicData.tags}
                      onChange={(e) => setMusicData(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="e.g., pop, rock, jazz, electronic, hip-hop..."
                      className="h-11 bg-background/60 backdrop-blur-sm border-2 hover:border-purple-300 focus:border-purple-500 transition-colors"
                    />
                  </div>
                )}
                
                <Button 
                  onClick={handleMusicGeneration}
                  disabled={isLoading || !musicData.type || !musicData.lyrics}
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <>
                      <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                      Creating Your Music...
                    </>
                  ) : (
                    <>
                      <Music className="w-5 h-5 mr-2" />
                      Generate {musicData.type === "15s-instrumental" ? "15s Track" : "Full Song"}
                    </>
                  )}
                </Button>
                
                {musicData.musicUrl && (
                  <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800 rounded-xl space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <Label className="text-lg font-semibold text-green-800 dark:text-green-200">🎵 Music Generated Successfully!</Label>
                    </div>
                    
                    {musicData.musicUrl.startsWith('http') ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border border-green-200 dark:border-green-800 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                              <Music className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800 dark:text-gray-200">
                                {musicData.type === "15s-instrumental" ? "15s Instrumental Track" : "Full Song (3:15)"}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">MP3 • Ready to download</div>
                            </div>
                          </div>
                          <Button 
                            variant="default"
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all duration-300"
                            onClick={() => handleDownloadLink(
                              musicData.musicUrl, 
                              `generated_music_${musicData.type}_${Date.now()}.mp3`
                            )}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download MP3
                          </Button>
                        </div>
                        
                        {/* Audio Preview */}
                        <div className="bg-white dark:bg-gray-900 p-4 border border-green-200 dark:border-green-800 rounded-lg">
                          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Audio Preview:</Label>
                          <audio 
                            controls 
                            className="w-full h-12 rounded-lg"
                            style={{ filter: 'hue-rotate(270deg)' }}
                          >
                            <source src={musicData.musicUrl} type="audio/mpeg" />
                            <source src={musicData.musicUrl} type="audio/wav" />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white dark:bg-gray-900 p-4 border border-green-200 dark:border-green-800 rounded-lg max-h-64 overflow-auto">
                        <pre className="text-sm text-foreground whitespace-pre-wrap">
                          {musicData.musicUrl}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Downloader Tab */}
          <TabsContent value="social-downloader" className="space-y-6">
            <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50/50 via-cyan-50/30 to-teal-50/50 dark:from-blue-950/20 dark:via-cyan-950/10 dark:to-teal-950/20 border border-border">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-teal-500/5" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                    <Download className="w-6 h-6 text-white" />
                  </div>
                  Social Media Downloader
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Download videos, audio, and images from any social platform with professional quality options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 relative">
                <div className="space-y-3">
                  <Label htmlFor="social-url" className="text-sm font-semibold text-foreground">Social Media URL</Label>
                  <div className="relative">
                    <Input
                      value={socialData.url}
                      onChange={(e) => setSocialData(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="🔗 Paste your TikTok, Instagram, YouTube, Twitter, or Facebook URL here..."
                      className="h-12 pl-4 pr-12 bg-background/60 backdrop-blur-sm border-2 hover:border-blue-300 focus:border-blue-500 transition-colors text-base"
                    />
                    {socialData.url && (
                      <button
                        onClick={() => setSocialData(prev => ({ ...prev, url: "" }))}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">TikTok</span>
                    <span className="text-xs bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 px-2 py-1 rounded-full">Instagram</span>
                    <span className="text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-2 py-1 rounded-full">YouTube</span>
                    <span className="text-xs bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 px-2 py-1 rounded-full">Twitter</span>
                    <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">Facebook</span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleSocialDownload}
                  disabled={isLoading || !socialData.url.trim()}
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <>
                      <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing Content...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 mr-2" />
                      Extract Download Links
                    </>
                  )}
                </Button>
                
                {socialData.result && (
                  <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800 rounded-xl space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <Label className="text-lg font-semibold text-green-800 dark:text-green-200">🎬 Content Found!</Label>
                      </div>
                      <div className="p-4 bg-white dark:bg-gray-900 border border-green-200 dark:border-green-800 rounded-lg">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 break-words">
                          📝 {socialData.result.title}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          📅 {socialData.result.date} • {socialData.result.links?.length || 0} download options available
                        </p>
                      </div>
                    </div>
                    
                    {socialData.result.links && socialData.result.links.length > 0 && (
                      <div className="space-y-3">
                        <Label className="text-base font-semibold text-gray-800 dark:text-gray-200">Available Downloads:</Label>
                        <div className="grid gap-3">
                          {socialData.result.links.map((link, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 group">
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                  link.type === 'video' 
                                    ? 'bg-gradient-to-r from-red-500 to-pink-500' 
                                    : 'bg-gradient-to-r from-green-500 to-emerald-500'
                                }`}>
                                  {link.type === 'video' ? (
                                    <VideoIcon className="w-6 h-6 text-white" />
                                  ) : (
                                    <Volume2 className="w-6 h-6 text-white" />
                                  )}
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {DarkAIService.formatQualityLabel(link)}
                                  </div>
                                  <div className="text-xs text-gray-600 dark:text-gray-400">
                                    {link.type === 'video' ? 'Video File' : 'Audio File'} • Click to download
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="default"
                                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-md hover:shadow-lg transition-all duration-300"
                                onClick={() => handleDownloadLink(
                                  link.url,
                                  DarkAIService.getDownloadFilename(socialData.result?.title || 'download', link)
                                )}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        💡 <strong>Tip:</strong> Files will download directly to your device. If direct download fails, the link will open in a new tab.
                      </p>
                    </div>
                    
                    {socialData.result.dev && (
                      <div className="text-center text-xs text-muted-foreground">
                        {socialData.result.dev}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Background Removal Tab */}
          <TabsContent value="background-removal" className="space-y-6">
            <Card className="bg-card border border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Scissors className="w-6 h-6" />
                  Background Removal
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Remove backgrounds from images automatically
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ImageUpload
                  label="Upload Image for Background Removal"
                  placeholder="Select an image to remove background"
                  onUploadComplete={(url) => setBgRemovalData(prev => ({ ...prev, uploadedImageUrl: url }))}
                  currentUrl={bgRemovalData.imageUrl}
                  onUrlChange={(url) => setBgRemovalData(prev => ({ ...prev, imageUrl: url }))}
                  showUrlInput={false}
                />
                {bgRemovalData.result && (
                  <div>
                    <Label className="text-foreground">Background Removal Result</Label>
                    <div className="bg-gradient-to-br from-pink-500/5 to-purple-500/10 p-6 rounded-xl border border-border space-y-4">
                      {(() => {
                        const result = bgRemovalData.result;
                        const isDirectUrl = typeof result === 'string' && result.startsWith('http');
                        
                        if (isDirectUrl) {
                          return (
                            <div className="space-y-4">
                              <div className="text-center">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 rounded-full border border-green-500/20">
                                  <Scissors className="w-4 h-4" />
                                  <span className="text-sm font-medium">Background Removed Successfully!</span>
                                </div>
                              </div>
                              
                              <div className="relative group max-w-md mx-auto">
                                <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-100 to-white rounded-xl opacity-50" />
                                <img 
                                  src={result} 
                                  alt="Background removed image"
                                  className="relative w-full h-auto object-contain rounded-xl shadow-2xl border-2 border-green-500/20 animate-fade-in"
                                />
                                
                                <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    className="h-8 w-8 p-0 bg-black/80 hover:bg-black/90 text-white shadow-lg backdrop-blur-sm"
                                    onClick={() => window.open(result, '_blank')}
                                    title="View full size"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    className="h-8 w-8 p-0 bg-black/80 hover:bg-black/90 text-white shadow-lg backdrop-blur-sm"
                                    onClick={() => {
                                      const link = document.createElement('a');
                                      link.href = result;
                                      link.download = 'background-removed.png';
                                      link.target = '_blank';
                                      link.click();
                                    }}
                                    title="Download image"
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="text-center">
                                <p className="text-xs text-muted-foreground mb-3">Don't forget to support the channel @DarkAIx</p>
                                <div className="flex gap-2 justify-center">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(result, '_blank')}
                                    className="flex-1 max-w-32"
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const link = document.createElement('a');
                                      link.href = result;
                                      link.download = 'background-removed.png';
                                      link.target = '_blank';
                                      link.click();
                                    }}
                                    className="flex-1 max-w-32"
                                  >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        } else {
                          return (
                            <div className="text-center py-8">
                              <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 text-yellow-600 rounded-full border border-yellow-500/20 mb-4">
                                <Scissors className="w-4 h-4" />
                                <span className="text-sm font-medium">Processing Result</span>
                              </div>
                              <div className="bg-muted/50 p-4 rounded-lg max-h-64 overflow-auto">
                                <pre className="text-sm text-foreground whitespace-pre-wrap text-left">
                                  {JSON.stringify(result, null, 2)}
                                </pre>
                              </div>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>
                )}
                <Button 
                  onClick={handleBackgroundRemoval}
                  disabled={isLoading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isLoading ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Scissors className="w-4 h-4 mr-2" />
                      Remove Background
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Conditional Media Viewer - Only for video, social downloader, and tts */}
        {(processedMedia || isProcessing) && 
         (activeTab === "video-generation" || 
          activeTab === "social-downloader" || 
          activeTab === "tts") && (
          <div className="mt-8">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Play className="w-6 h-6" />
                  Media Viewer
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                   {activeTab === "video-generation" || activeTab === "social-downloader" ? "Video player with advanced controls" :
                    activeTab === "tts" ? "Audio player with controls" :
                    "Real-time media display with advanced controls"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MediaViewer 
                  mediaData={processedMedia} 
                  isLoading={isProcessing} 
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default DarkAI;