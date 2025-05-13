import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

const ImageInput = ({
  image,
    setImage,
  id
}: {
  image: File | null;
        setImage: React.Dispatch<React.SetStateAction<File | null>>;
    id: string;
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      // Create a preview URL for the selected image
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setImage(null);
      setPreviewUrl(null);
    }
  };

  // Clean up preview URL when component unmounts or image changes
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
      <>
      <Label
        htmlFor={`${id}-input`}
        className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-none p-6">
        {image ? (
          previewUrl ? (
            <img
              src={previewUrl}
              width={50}
              alt="Preview"
              className="max-w-full h-auto rounded-md border"
            />
          ) : null
        ) : (
          <Upload className="w-10 h-10 text-gray-400 mb-4" />
        )}
        {!image ? (
          <p className="text-gray-500 mb-2">Drag and Drop Logo</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Selected: {image?.name}
          </p>
        )}
      </Label>
      <Input
        id={`${id}-input`}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
    </>
  );
};

export default ImageInput;
