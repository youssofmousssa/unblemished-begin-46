import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Upload, Image as ImageIcon, X, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadImageToSnapzion } from '@/services/uploadService';

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  label?: string;
  placeholder?: string;
  currentUrl?: string;
  onUrlChange?: (url: string) => void;
  showUrlInput?: boolean;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onUploadComplete,
  label = "Upload Image",
  placeholder = "Select an image file to upload",
  currentUrl = "",
  onUrlChange,
  showUrlInput = false,
  className = ""
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file (PNG, JPG, JPEG, GIF, WebP)",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 10MB",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const result = await uploadImageToSnapzion(file);
      
      if (result.success && result.url) {
        onUploadComplete(result.url);
        toast({
          title: "Upload Successful",
          description: "Image uploaded and ready to use!"
        });
      } else {
        throw new Error(result.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setPreviewUrl(null);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const clearUpload = () => {
    setPreviewUrl(null);
    onUploadComplete("");
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Label className="text-foreground">{label}</Label>
      
      {/* Upload Area */}
      <Card className="relative overflow-hidden">
        <CardContent className="p-0">
          <div
            className={`relative border-2 border-dashed rounded-lg transition-all duration-200 ${
              dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            } ${isUploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="hidden"
              disabled={isUploading}
            />
            
            {/* Preview or Upload State */}
            {previewUrl ? (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Upload preview"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearUpload();
                      }}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
                <div className="absolute top-2 right-2">
                  <div className="bg-green-500 text-white p-1 rounded-full">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className={`mx-auto w-16 h-16 mb-4 rounded-full flex items-center justify-center ${
                  isUploading 
                    ? 'bg-primary/20 animate-pulse' 
                    : 'bg-primary/10'
                }`}>
                  {isUploading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
                  ) : (
                    <Upload className="w-8 h-8 text-primary" />
                  )}
                </div>
                
                <div className="space-y-2">
                  <p className="text-lg font-medium text-foreground">
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isUploading 
                      ? 'Please wait while we upload your image' 
                      : 'Drag & drop an image here, or click to select'
                    }
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports PNG, JPG, JPEG, GIF, WebP (Max 10MB)
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Optional URL Input */}
      {showUrlInput && onUrlChange && (
        <div className="space-y-2">
          <Label className="text-foreground text-sm">Or enter image URL directly:</Label>
          <div className="flex gap-2">
            <input
              type="url"
              value={currentUrl}
              onChange={(e) => onUrlChange(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            {currentUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUrlChange("")}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;