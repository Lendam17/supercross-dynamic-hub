import { Input } from "@/components/ui/input";

interface ImageUploadProps {
  imageUrl: string | null;
  onUpload: (file: File) => void;
  isUploading: boolean;
}

const ImageUpload = ({ imageUrl, onUpload, isUploading }: ImageUploadProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div>
      <label htmlFor="image" className="block text-sm mb-1">
        Image
      </label>
      <Input
        id="image"
        type="file"
        accept="image/*"
        onChange={handleChange}
        disabled={isUploading}
      />
      {imageUrl && (
        <div className="mt-2">
          <img
            src={imageUrl}
            alt="Preview"
            className="w-20 h-20 object-cover rounded"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;