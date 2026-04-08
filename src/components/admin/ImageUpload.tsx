import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { validateFileUpload, generateSafeFilename } from "@/lib/sanitize";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

const ImageUpload = ({ value, onChange }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please select an image file.", variant: "destructive" });
      return;
    }

    const validation = await validateFileUpload(file);
    if (!validation.valid) {
      toast({ title: "Invalid file", description: validation.error, variant: "destructive" });
      return;
    }

    setUploading(true);
    const filename = generateSafeFilename(file.name);

    const { error } = await supabase.storage
      .from("blog-images")
      .upload(filename, file, { contentType: file.type });

    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } else {
      const { data: urlData } = supabase.storage.from("blog-images").getPublicUrl(filename);
      onChange(urlData.publicUrl);
      toast({ title: "Image uploaded" });
    }

    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <Label>Cover Image</Label>
      {value && (
        <div className="relative w-full max-w-md rounded-md overflow-hidden border border-border">
          <img src={value} alt="Cover" className="w-full h-40 object-cover" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-7 w-7"
            onClick={() => onChange("")}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Upload className="w-4 h-4 mr-1" />}
          {uploading ? "Uploading…" : "Upload Image"}
        </Button>
        <span className="text-xs text-muted-foreground">or paste a URL below</span>
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://... or upload above"
      />
    </div>
  );
};

export default ImageUpload;
