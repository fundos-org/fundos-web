import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react'; // Assuming lucide-react for icons
import { Input } from '../ui/input';
import { Button } from '../ui/button'; // Assuming a Button component from your UI library
import { Label } from '../ui/label';

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
        selectedFile.type.startsWith('video/') ||
        selectedFile.type.startsWith('application/pdf')
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
    <div className="flex flex-col items-start w-full mt-2">
      <Label
        htmlFor={`${id}-input-file`}
        className="relative w-full"
        onClick={() => document.getElementById(`${id}-input-file`)?.click()}
      >
        <Input
          id={`${id}-input`}
          type="text"
          readOnly
          value={file ? file.name : ''}
          placeholder="No file selected"
          className="pr-24 rounded-none border-gray-300 cursor-pointer"
        />
        <Button
          type="button"
          className="absolute rounded-none right-[1px] top-1/2 -translate-y-1/2 h-8 px-3 bg-gray-800 text-white hover:bg-gray-800"
        >
          <Upload className="w-4 h-4" />
        </Button>
      </Label>
      <Input
        id={`${id}-input-file`}
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
