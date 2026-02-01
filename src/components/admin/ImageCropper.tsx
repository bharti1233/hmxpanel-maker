import { useState, useCallback } from "react";
import Cropper, { Area, Point } from "react-easy-crop";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, X, ZoomIn, RotateCw } from "lucide-react";

interface ImageCropperProps {
  imageUrl: string;
  open: boolean;
  onClose: () => void;
  onCropComplete: (croppedImageUrl: string) => void;
  aspectRatio?: number;
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.crossOrigin = "anonymous";
    image.src = url;
  });

const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: Area
): Promise<string> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas.toDataURL("image/jpeg", 0.9);
};

const ImageCropper = ({
  imageUrl,
  open,
  onClose,
  onCropComplete,
  aspectRatio = 16 / 9,
}: ImageCropperProps) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropChange = useCallback((location: Point) => {
    setCrop(location);
  }, []);

  const onZoomChange = useCallback((zoom: number) => {
    setZoom(zoom);
  }, []);

  const onCropCompleteCallback = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleSave = async () => {
    if (!croppedAreaPixels) return;

    setIsProcessing(true);
    try {
      const croppedImage = await getCroppedImg(imageUrl, croppedAreaPixels);
      onCropComplete(croppedImage);
      onClose();
    } catch (error) {
      console.error("Error cropping image:", error);
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
      <DialogContent className="max-w-lg w-full p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <span className="text-lg">✂️ Crop Image</span>
          </DialogTitle>
        </DialogHeader>

        <div className="relative w-full h-64 sm:h-80 bg-muted/50">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspectRatio}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropCompleteCallback}
            classes={{
              containerClassName: "rounded-none",
              cropAreaClassName: "!border-birthday-pink !border-2",
            }}
          />
        </div>

        <div className="p-4 space-y-4">
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
              step={0.1}
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
              min={0}
              max={360}
              step={1}
              className="touch-manipulation"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex-1 gap-2"
            >
              Reset
            </Button>
            <Button
              variant="ghost"
              onClick={onClose}
              className="gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
            <Button
              variant="birthday"
              onClick={handleSave}
              disabled={isProcessing}
              className="flex-1 gap-2"
            >
              <Check className="w-4 h-4" />
              {isProcessing ? "Processing..." : "Apply"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropper;
