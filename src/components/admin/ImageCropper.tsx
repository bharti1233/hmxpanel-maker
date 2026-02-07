import { useState, useCallback, useEffect } from "react";
import Cropper, { Area, Point } from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, X, ZoomIn, RotateCw, Square, RectangleHorizontal, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";

interface ImageCropperProps {
  imageUrl: string;
  open: boolean;
  onClose: () => void;
  onCropComplete: (croppedImageUrl: string) => void;
  aspectRatio?: number;
}

type AspectOption = {
  label: string;
  value: number;
  icon: React.ReactNode;
};

const ASPECT_OPTIONS: AspectOption[] = [
  { label: "1:1", value: 1, icon: <Square className="w-4 h-4" /> },
  { label: "4:3", value: 4 / 3, icon: <RectangleHorizontal className="w-4 h-4" /> },
  { label: "16:9", value: 16 / 9, icon: <RectangleHorizontal className="w-4 h-4" /> },
];

// Convert image URL to base64 data URL to avoid CORS issues
const urlToDataUrl = async (url: string): Promise<string> => {
  // If already a data URL, return as-is
  if (url.startsWith("data:")) {
    return url;
  }

  try {
    // Fetch the image as a blob
    const response = await fetch(url, { mode: "cors" });
    if (!response.ok) throw new Error("Failed to fetch image");
    
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    // If CORS fails, try loading via img element (works for same-origin)
    logger.warn("CORS fetch failed, trying canvas approach:", error);
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("No canvas context"));
          return;
        }
        ctx.drawImage(img, 0, 0);
        try {
          resolve(canvas.toDataURL("image/jpeg", 0.9));
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = url;
    });
  }
};

// Convert base64 to Blob for upload
const dataURLtoBlob = (dataURL: string): Blob => {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

// Upload image to Supabase storage and return public URL
const uploadToStorage = async (dataUrl: string): Promise<string> => {
  const blob = dataURLtoBlob(dataUrl);
  const fileName = `cropped/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
  
  const { data, error } = await supabase.storage
    .from('images')
    .upload(fileName, blob, {
      contentType: 'image/jpeg',
      cacheControl: '3600',
      upsert: false,
    });
  
  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from('images')
    .getPublicUrl(data.path);
  
  return urlData.publicUrl;
};

const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: Area,
  rotation: number = 0
): Promise<string> => {
  // Create image from data URL (no CORS issues)
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imageSrc;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  // Calculate bounding box of rotated image
  const rotRad = (rotation * Math.PI) / 180;
  const sin = Math.abs(Math.sin(rotRad));
  const cos = Math.abs(Math.cos(rotRad));
  
  const bBoxWidth = image.width * cos + image.height * sin;
  const bBoxHeight = image.width * sin + image.height * cos;

  // Set canvas size to bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // Translate and rotate
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);

  // Create a new canvas for the cropped area
  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d");

  if (!croppedCtx) {
    throw new Error("No 2d context for cropped canvas");
  }

  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return croppedCanvas.toDataURL("image/jpeg", 0.85);
};

const ImageCropper = ({
  imageUrl,
  open,
  onClose,
  onCropComplete,
  aspectRatio: initialAspect = 1,
}: ImageCropperProps) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(initialAspect);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [localImageUrl, setLocalImageUrl] = useState<string>("");

  // Load and convert image to data URL when dialog opens
  useEffect(() => {
    if (open && imageUrl) {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
      setAspectRatio(initialAspect);
      setImageError(false);
      setErrorMessage("");
      setIsLoading(true);
      setLocalImageUrl("");

      // Convert to data URL to avoid CORS issues
      urlToDataUrl(imageUrl)
        .then((dataUrl) => {
          setLocalImageUrl(dataUrl);
          setIsLoading(false);
        })
        .catch((err) => {
          logger.error("Failed to load image:", err);
          setImageError(true);
          setErrorMessage(
            "Unable to load this image for cropping. This might be due to CORS restrictions. " +
            "Try using a direct image URL or an image hosting service that allows cross-origin access."
          );
          setIsLoading(false);
        });
    }
  }, [open, imageUrl, initialAspect]);

  const onCropChange = useCallback((location: Point) => {
    setCrop(location);
  }, []);

  const onZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  const onCropCompleteCallback = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleMediaLoaded = useCallback(() => {
    setIsLoading(false);
    setImageError(false);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels || !localImageUrl) return;

    setIsProcessing(true);
    try {
      // Get cropped image as data URL
      const croppedDataUrl = await getCroppedImg(localImageUrl, croppedAreaPixels, rotation);
      
      // Upload to storage and get public URL
      const publicUrl = await uploadToStorage(croppedDataUrl);
      
      onCropComplete(publicUrl);
      onClose();
    } catch (error) {
      logger.error("Error cropping image:", error);
      setImageError(true);
      setErrorMessage(error instanceof Error ? error.message : "Failed to crop image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full p-0 overflow-hidden max-h-[90vh]">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle className="flex items-center gap-2">
            <span className="text-lg">✂️ Crop Image</span>
          </DialogTitle>
        </DialogHeader>

        <div className="relative w-full h-56 sm:h-72 bg-muted/50">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
              <Loader2 className="w-8 h-8 animate-spin text-birthday-pink" />
            </div>
          )}
          {imageError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50 text-center p-4">
              <p className="text-destructive font-medium mb-2">Unable to load image</p>
              <p className="text-sm text-muted-foreground max-w-xs">
                {errorMessage || "The image may be from a different domain. Try using a direct image URL."}
              </p>
            </div>
          ) : localImageUrl ? (
            <Cropper
              image={localImageUrl}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={aspectRatio}
              onCropChange={onCropChange}
              onZoomChange={onZoomChange}
              onCropComplete={onCropCompleteCallback}
              onMediaLoaded={handleMediaLoaded}
              classes={{
                containerClassName: "rounded-none touch-manipulation",
                cropAreaClassName: "!border-birthday-pink !border-2",
              }}
            />
          ) : null}
        </div>

        <div className="p-4 space-y-3 overflow-y-auto">
          {/* Aspect Ratio Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Aspect Ratio</label>
            <div className="flex gap-2">
              {ASPECT_OPTIONS.map((option) => (
                <Button
                  key={option.label}
                  type="button"
                  variant={aspectRatio === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAspectRatio(option.value)}
                  className={`flex-1 gap-1 touch-manipulation ${
                    aspectRatio === option.value
                      ? "bg-birthday-pink hover:bg-birthday-pink/90"
                      : ""
                  }`}
                >
                  {option.icon}
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Zoom Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <ZoomIn className="w-4 h-4 text-birthday-pink" />
                Zoom
              </label>
              <span className="text-xs text-muted-foreground">{Math.round(zoom * 100)}%</span>
            </div>
            <Slider
              value={[zoom]}
              onValueChange={([value]) => setZoom(value)}
              min={1}
              max={3}
              step={0.05}
              className="touch-manipulation"
            />
          </div>

          {/* Rotation Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <RotateCw className="w-4 h-4 text-birthday-cyan" />
                Rotation
              </label>
              <span className="text-xs text-muted-foreground">{rotation}°</span>
            </div>
            <Slider
              value={[rotation]}
              onValueChange={([value]) => setRotation(value)}
              min={-180}
              max={180}
              step={1}
              className="touch-manipulation"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={handleReset}
              size="sm"
              className="gap-1 touch-manipulation"
            >
              Reset
            </Button>
            <Button
              variant="ghost"
              onClick={onClose}
              size="sm"
              className="gap-1 touch-manipulation"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
            <Button
              variant="birthday"
              onClick={handleSave}
              disabled={isProcessing || imageError || !localImageUrl}
              size="sm"
              className="flex-1 gap-1 touch-manipulation"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Apply Crop
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropper;
