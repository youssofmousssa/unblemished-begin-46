import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Download, 
  Maximize, 
  SkipBack, 
  SkipForward,
  Settings,
  ExternalLink,
  Maximize2,
  RotateCcw,
  Heart,
  Share2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MediaData {
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

interface MediaViewerProps {
  mediaData: MediaData | null;
  isLoading?: boolean;
}

const MediaViewer: React.FC<MediaViewerProps> = ({ mediaData, isLoading = false }) => {
  const { toast } = useToast();
  
  // Video/Audio controls state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const mediaElement = videoRef.current || audioRef.current;
    if (!mediaElement) return;

    const updateTime = () => setCurrentTime(mediaElement.currentTime);
    const updateDuration = () => setDuration(mediaElement.duration);
    
    mediaElement.addEventListener('timeupdate', updateTime);
    mediaElement.addEventListener('loadedmetadata', updateDuration);
    mediaElement.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      mediaElement.removeEventListener('timeupdate', updateTime);
      mediaElement.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [mediaData]);

  // Auto-hide controls for video
  useEffect(() => {
    if (mediaData?.type === 'video' && isPlaying && !isHovering) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    } else {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying, isHovering, mediaData?.type]);

  const togglePlayPause = () => {
    const mediaElement = videoRef.current || audioRef.current;
    if (!mediaElement) return;

    if (isPlaying) {
      mediaElement.pause();
    } else {
      mediaElement.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const mediaElement = videoRef.current || audioRef.current;
    if (!mediaElement) return;
    
    const newTime = (value[0] / 100) * duration;
    mediaElement.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    
    const mediaElement = videoRef.current || audioRef.current;
    if (mediaElement) {
      mediaElement.volume = newVolume;
    }
  };

  const toggleMute = () => {
    const mediaElement = videoRef.current || audioRef.current;
    if (!mediaElement) return;

    if (isMuted) {
      mediaElement.volume = volume;
      setIsMuted(false);
    } else {
      mediaElement.volume = 0;
      setIsMuted(true);
    }
  };

  const skip = (seconds: number) => {
    const mediaElement = videoRef.current || audioRef.current;
    if (!mediaElement) return;
    
    mediaElement.currentTime = Math.max(0, Math.min(duration, currentTime + seconds));
  };

  const downloadFile = async (url: string, filename?: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || `media_${Date.now()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      toast({
        title: "Download Started",
        description: "Your download has started successfully."
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Unable to download the file.",
        variant: "destructive"
      });
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (fullscreenRef.current?.requestFullscreen) {
        fullscreenRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <Card className="w-full glass-effect shadow-dramatic animate-scale-in">
        <CardContent className="p-12">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-accent"></div>
              <div className="absolute inset-0 rounded-full border-4 border-accent/20"></div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-accent to-accent-glow bg-clip-text text-transparent">
                Processing Media
              </h3>
              <p className="text-muted-foreground">Creating something amazing...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!mediaData) {
    return (
      <Card className="w-full glass-effect shadow-dramatic">
        <CardContent className="p-12">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-accent/20 to-accent-glow/20 flex items-center justify-center">
              <Play className="w-10 h-10 text-accent" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Ready for Media</h3>
              <p className="text-muted-foreground">Upload or generate content to see it here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-6 animate-fade-in">
      {/* 🎨 MINIMALIST MEDIA DISPLAY */}
      <Card className="w-full overflow-hidden border border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-0">
          <div 
            ref={fullscreenRef} 
            className="relative group"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {mediaData.type === 'video' && (
              <div className="relative overflow-hidden rounded-lg">
                <video
                  ref={videoRef}
                  src={mediaData.url}
                  className="w-full h-auto max-h-[80vh] object-cover bg-background transition-smooth"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onClick={togglePlayPause}
                />
                
                {/* 🎨 MINIMALIST OVERLAY */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-all duration-300 ${
                  showControls && (isHovering || !isPlaying) ? 'opacity-100' : 'opacity-0'
                }`}>
                  
                  {/* 🔥 CENTER PLAY BUTTON - MASSIVE & BEAUTIFUL */}
                  {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={togglePlayPause}
                        className="h-24 w-24 rounded-full bg-primary/90 hover:bg-primary hover:scale-110 transition-all duration-300 border border-primary"
                      >
                        <Play className="h-12 w-12 text-background ml-1" />
                      </Button>
                    </div>
                  )}
                  
                  {/* 🔥 TOP CONTROLS - TITLE & ACTIONS */}
                  <div className="absolute top-0 left-0 right-0 p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        {mediaData.metadata?.title && (
                          <h3 className="text-white text-lg font-semibold drop-shadow-lg">
                            {mediaData.metadata.title}
                          </h3>
                        )}
                        <p className="text-white/80 text-sm">Premium Video Player</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon" className="control-button h-10 w-10 text-white">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="control-button h-10 w-10 text-white">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="control-button h-10 w-10 text-white">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* 🔥 BOTTOM CONTROLS - FULL FEATURED */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
                    {/* Progress Bar with Glow Effect */}
                    <div className="space-y-2">
                      <Slider
                        value={[duration ? (currentTime / duration) * 100 : 0]}
                        onValueChange={handleSeek}
                        max={100}
                        step={0.1}
                        className="w-full progress-glow"
                      />
                      <div className="flex items-center justify-between text-xs text-white/80">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>
                    
                    {/* Main Control Bar */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {/* Skip Back */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => skip(-10)}
                          className="control-button h-10 w-10 text-white"
                        >
                          <SkipBack className="h-4 w-4" />
                        </Button>
                        
                        {/* Main Play/Pause */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={togglePlayPause}
                          className="h-14 w-14 rounded-full bg-primary text-background hover:scale-110 transition-all duration-300"
                        >
                          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
                        </Button>
                        
                        {/* Skip Forward */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => skip(10)}
                          className="control-button h-10 w-10 text-white"
                        >
                          <SkipForward className="h-4 w-4" />
                        </Button>
                        
                        {/* Volume Controls */}
                        <div className="flex items-center space-x-3 ml-6">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleMute}
                            className="control-button h-10 w-10 text-white"
                          >
                            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                          </Button>
                          <Slider
                            value={[isMuted ? 0 : volume * 100]}
                            onValueChange={handleVolumeChange}
                            max={100}
                            className="w-24"
                          />
                        </div>
                      </div>
                      
                      {/* Right Controls */}
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => downloadFile(mediaData.url, 'video')}
                          className="control-button h-10 w-10 text-white"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={toggleFullscreen}
                          className="control-button h-10 w-10 text-white"
                        >
                          <Maximize2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {mediaData.type === 'image' && (
              <div className="relative group overflow-hidden rounded-lg">
                <img
                  ref={imageRef}
                  src={mediaData.url}
                  alt="Generated content"
                  className="w-full h-auto max-h-[80vh] object-contain bg-gradient-to-br from-secondary/20 to-accent/10"
                />
                
                {/* 🔥 IMAGE OVERLAY CONTROLS */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="absolute bottom-6 right-6">
                    <div className="flex space-x-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => downloadFile(mediaData.url, 'image')}
                        className="h-12 w-12 rounded-full glass-effect text-white hover:scale-110 transition-all duration-300 shadow-control"
                      >
                        <Download className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleFullscreen}
                        className="h-12 w-12 rounded-full glass-effect text-white hover:scale-110 transition-all duration-300 shadow-control"
                      >
                        <Maximize2 className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12 rounded-full glass-effect text-white hover:scale-110 transition-all duration-300 shadow-control"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {mediaData.type === 'audio' && (
              <div className="p-12 bg-gradient-to-b from-card to-background rounded-lg border border-primary/10">
                <audio
                  ref={audioRef}
                  src={mediaData.url}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
                
                <div className="max-w-lg mx-auto space-y-8">
                  {/* 🎨 MINIMALIST AUDIO VISUALIZATION */}
                  <div className="h-40 bg-gradient-to-b from-primary/10 to-transparent rounded-2xl flex items-center justify-center border border-primary/20">
                    <div className="flex items-end space-x-1.5">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 transition-all duration-150 ${
                            i % 2 === 0 ? 'bg-primary' : 'bg-background'
                          } ${isPlaying ? 'animate-pulse' : ''}`}
                          style={{
                            height: isPlaying ? `${Math.sin(Date.now() / 200 + i) * 30 + 50}px` : '20px',
                            animationDelay: `${i * 0.05}s`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Progress & Time */}
                  <div className="space-y-3">
                    <Slider
                      value={[duration ? (currentTime / duration) * 100 : 0]}
                      onValueChange={handleSeek}
                      max={100}
                      step={0.1}
                      className="w-full progress-glow"
                    />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                  
                  {/* 🔥 PREMIUM AUDIO CONTROLS */}
                  <div className="flex items-center justify-center space-x-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => skip(-10)}
                      className="h-12 w-12 rounded-full border border-primary/30 hover:bg-primary/10 hover:scale-110 transition-all duration-300"
                    >
                      <SkipBack className="h-5 w-5" />
                    </Button>
                    
                    <Button
                      variant="default"
                      size="icon"
                      onClick={togglePlayPause}
                      className="h-16 w-16 rounded-full bg-primary text-background hover:bg-primary/90 hover:scale-110 transition-all duration-300 border border-primary"
                    >
                      {isPlaying ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 ml-0.5" />}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => skip(10)}
                      className="h-12 w-12 rounded-full border border-primary/30 hover:bg-primary/10 hover:scale-110 transition-all duration-300"
                    >
                      <SkipForward className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  {/* Volume Control */}
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleMute}
                      className="h-10 w-10 rounded-full glass-effect"
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    <Slider
                      value={[isMuted ? 0 : volume * 100]}
                      onValueChange={handleVolumeChange}
                      max={100}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => downloadFile(mediaData.url, 'audio')}
                      className="h-10 w-10 rounded-full glass-effect"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 🔥 DOWNLOAD LINKS - PREMIUM DESIGN */}
      {mediaData.downloadLinks && mediaData.downloadLinks.length > 0 && (
        <Card className="w-full glass-effect shadow-dramatic animate-slide-up">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-accent to-accent-glow bg-clip-text text-transparent">
              Download Options
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mediaData.downloadLinks.map((link, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => downloadFile(link.url, link.label)}
                  className="justify-between h-auto p-6 glass-effect border-border/50 hover:border-accent/50 hover:shadow-glow transition-all duration-300 group"
                >
                  <div className="flex flex-col items-start space-y-1">
                    <span className="font-medium group-hover:text-accent transition-colors">{link.label}</span>
                    {link.quality && (
                      <span className="text-xs text-muted-foreground bg-accent/10 px-2 py-1 rounded-full">
                        {link.quality}
                      </span>
                    )}
                  </div>
                  <Download className="h-5 w-5 text-accent" />
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 🔥 METADATA - SLEEK INFO PANEL */}
      {mediaData.metadata && (
        <Card className="w-full glass-effect shadow-dramatic animate-slide-up">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {mediaData.metadata.title && (
                <h4 className="font-semibold text-lg bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  {mediaData.metadata.title}
                </h4>
              )}
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                {mediaData.metadata.duration && (
                  <span className="flex items-center space-x-2">
                    <span>Duration:</span>
                    <span className="text-accent font-medium">{formatTime(mediaData.metadata.duration)}</span>
                  </span>
                )}
                {mediaData.metadata.size && (
                  <span className="flex items-center space-x-2">
                    <span>Size:</span>
                    <span className="text-accent font-medium">{mediaData.metadata.size}</span>
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MediaViewer;