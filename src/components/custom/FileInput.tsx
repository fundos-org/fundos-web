import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react'; // Assuming you're using lucide-react for icons
import { Label } from '../ui/label';
import { Input } from '../ui/input';

interface FileInputProps {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  id: string;
  accept?: string; // e.g., "image/*,video/*,.pdf"
  maxSize?: number; // in bytes
}

const FileInput = ({
  file,
  setFile,
  id,
  accept = 'image/*', // Default to images
  maxSize = 50 * 1024 * 1024, // Default to 50MB
}: FileInputProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setError(null); // Reset error

    if (selectedFile) {
      // Check file size
      if (selectedFile.size > maxSize) {
        setError(`File size exceeds limit of ${maxSize / (1024 * 1024)}MB`);
        setFile(null);
        setPreviewUrl(null);
        return;
      }

      // Check file type
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const isValidType = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return selectedFile.name.toLowerCase().endsWith(type.toLowerCase());
        }
        return selectedFile.type.match(type);
      });

      if (!isValidType) {
        setError(`Invalid file type. Allowed types: ${accept}`);
        setFile(null);
        setPreviewUrl(null);
        return;
      }

      setFile(selectedFile);

      // Create preview URL for images and videos
      if (
        selectedFile.type.startsWith('image/') ||
        selectedFile.type.startsWith('video/')
      ) {
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null); // No preview for non-image/video files
      }
    } else {
      setFile(null);
      setPreviewUrl(null);
    }
  };

  // Clean up preview URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="flex flex-col items-center">
      <Label
        htmlFor={`${id}-input`}
        className="min-w-[140px] max-w-[140px] h-[120px] flex flex-col items-center mt-2 justify-center border-2 border-dashed border-gray-300 rounded-none p-6"
      >
        {file && previewUrl && file.type.startsWith('image/') ? (
          <img
            src={previewUrl}
            width={50}
            alt="Preview"
            className="max-w-full h-auto rounded-md border"
          />
        ) : file && previewUrl && file.type.startsWith('video/') ? (
          <video
            src={previewUrl}
            width={50}
            controls
            className="max-w-full h-auto border"
          />
        ) : (
          <Upload className="w-10 h-10 text-gray-400 mb-4" />
        )}
        {file && (
          <p className="text-sm text-muted-foreground w-[100px] truncate text-ellipsis">
            {file.name}
          </p>
        )}
      </Label>
      <Input
        id={`${id}-input`}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default FileInput;
