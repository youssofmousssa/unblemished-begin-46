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

const DarkAI = () => {
  const [activeTab, setActiveTab] = useState("video-generation");
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
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
    result: null
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
      const endpoint = musicData.type === "with-lyrics" ? "/api/music" : "/api/create-music";
      
      let body: any = {
        api_key: API_KEY
      };

      if (musicData.type === "with-lyrics") {
        body.lyrics = musicData.lyrics;
        if (musicData.tags && musicData.tags.trim()) {
          body.tags = musicData.tags.trim();
        }
      } else {
        body.text = musicData.lyrics;
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
      const musicUrl = result.url || result.music_url || result.music || "Music generated successfully";
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
      const response = await fetch(`${BASE_URL}/api/social-downloader`, {
        method: "POST",
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url: socialData.url.trim(),
          api_key: API_KEY
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Social download result:", result);
      setSocialData(prev => ({ ...prev, result }));
      
      toast({
        title: "Success",
        description: "Content downloaded successfully!"
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

          {/* Mobile Sidebar */}
          <MobileSidebar
            isOpen={isMobileSidebarOpen}
            onClose={() => setIsMobileSidebarOpen(false)}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={tabs}
          />

          {/* Desktop Tab Navigation Container */}
          <div className="hidden md:block w-full mb-8 bg-card border border-border rounded-lg p-2">
            <div className="overflow-x-auto scrollable-tabs">
              <TabsList className="inline-flex w-max bg-transparent p-0 h-auto gap-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="flex items-center gap-2 px-4 py-3 whitespace-nowrap rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:hover:bg-secondary transition-all min-w-fit"
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="font-medium">{tab.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>
          </div>

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
            <Card className="bg-card border border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Music className="w-6 h-6" />
                  Music Generation
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Create music with lyrics or generate instrumental tracks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="music-type" className="text-foreground">Music Type</Label>
                  <Select value={musicData.type} onValueChange={(value) => setMusicData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue placeholder="Select Music Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="with-lyrics" className="text-popover-foreground">Full Song with Lyrics</SelectItem>
                      <SelectItem value="instrumental" className="text-popover-foreground">15s Instrumental</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="music-lyrics" className="text-foreground">
                    {musicData.type === "with-lyrics" ? "Lyrics" : "Music Description"}
                  </Label>
                  <Textarea
                    value={musicData.lyrics}
                    onChange={(e) => setMusicData(prev => ({ ...prev, lyrics: e.target.value }))}
                    placeholder={
                      musicData.type === "with-lyrics" 
                        ? "Enter the lyrics for your song..."
                        : "Describe the instrumental music you want..."
                    }
                    className="min-h-32 bg-input border-border text-foreground resize-none"
                  />
                </div>
                {musicData.type === "with-lyrics" && (
                  <div>
                    <Label htmlFor="music-tags" className="text-foreground">Tags (Optional)</Label>
                    <Input
                      value={musicData.tags}
                      onChange={(e) => setMusicData(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="e.g., pop, rock, upbeat, energetic"
                      className="bg-input border-border text-foreground"
                    />
                  </div>
                )}
                {musicData.musicUrl && (
                  <div>
                    <Label className="text-foreground">Generated Music</Label>
                    <div className="bg-gradient-to-br from-purple-500/5 to-pink-500/10 p-6 rounded-xl border border-border space-y-4">
                      <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 rounded-full border border-green-500/20">
                          <Music className="w-4 h-4" />
                          <span className="text-sm font-medium">Music Generated Successfully!</span>
                        </div>
                      </div>
                      
                      {musicData.musicUrl.startsWith('http') ? (
                        <div className="text-center">
                          <audio controls className="mx-auto mb-4">
                            <source src={musicData.musicUrl} type="audio/mpeg" />
                            <source src={musicData.musicUrl} type="audio/wav" />
                            Your browser does not support the audio element.
                          </audio>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(musicData.musicUrl, '_blank')}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download Music
                          </Button>
                        </div>
                      ) : (
                        <div className="bg-muted/50 p-4 rounded-lg max-h-64 overflow-auto">
                          <pre className="text-sm text-foreground whitespace-pre-wrap text-left">
                            {musicData.musicUrl}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <Button 
                  onClick={handleMusicGeneration}
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
                      <Music className="w-4 h-4 mr-2" />
                      Generate Music
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Downloader Tab */}
          <TabsContent value="social-downloader" className="space-y-6">
            <Card className="bg-card border border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Download className="w-6 h-6" />
                  Social Media Downloader
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Download content from social media platforms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="social-url" className="text-foreground">Social Media URL</Label>
                  <Input
                    value={socialData.url}
                    onChange={(e) => setSocialData(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://www.instagram.com/p/..."
                    className="bg-input border-border text-foreground"
                  />
                </div>
                {socialData.result && (
                  <div>
                    <Label className="text-foreground">Download Result</Label>
                    <div className="bg-gradient-to-br from-blue-500/5 to-cyan-500/10 p-6 rounded-xl border border-border space-y-4">
                      {(() => {
                        const result = socialData.result;
                        
                        if (result && typeof result === 'object' && (result.video_url || result.thumbnail || result.audio_url || result.download_links)) {
                          return (
                            <div className="space-y-4">
                              <div className="text-center">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 rounded-full border border-green-500/20">
                                  <Download className="w-4 h-4" />
                                  <span className="text-sm font-medium">Content Ready for Download!</span>
                                </div>
                              </div>
                              
                              {result.thumbnail && !result.video_url && (
                                <div className="text-center">
                                  <img 
                                    src={result.thumbnail} 
                                    alt="Content thumbnail"
                                    className="max-w-sm mx-auto rounded-lg shadow-lg"
                                  />
                                </div>
                              )}
                              
                              {(result.download_links || result.video_url || result.audio_url) && (
                                <div className="flex flex-wrap gap-2 justify-center">
                                  {result.video_url && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => window.open(result.video_url, '_blank')}
                                    >
                                      <VideoIcon className="w-4 h-4 mr-2" />
                                      Download Video
                                    </Button>
                                  )}
                                  {result.audio_url && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => window.open(result.audio_url, '_blank')}
                                    >
                                      <Volume2 className="w-4 h-4 mr-2" />
                                      Download Audio
                                    </Button>
                                  )}
                                  {Array.isArray(result.download_links) && result.download_links.map((link, index) => (
                                    <Button
                                      key={index}
                                      variant="outline"
                                      size="sm"
                                      onClick={() => window.open(link, '_blank')}
                                    >
                                      <Download className="w-4 h-4 mr-2" />
                                      Download {index + 1}
                                    </Button>
                                  ))}
                                </div>
                              )}
                              
                              {(result.title || result.description) && (
                                <div className="bg-muted/50 p-4 rounded-lg">
                                  {result.title && (
                                    <h4 className="font-semibold text-foreground mb-2">{result.title}</h4>
                                  )}
                                  {result.description && (
                                    <p className="text-sm text-muted-foreground">{result.description}</p>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        } else {
                          return (
                            <div className="text-center py-8">
                              <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 text-yellow-600 rounded-full border border-yellow-500/20 mb-4">
                                <Download className="w-4 h-4" />
                                <span className="text-sm font-medium">Download Response</span>
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
                  onClick={handleSocialDownload}
                  disabled={isLoading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isLoading ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Download Content
                    </>
                  )}
                </Button>
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