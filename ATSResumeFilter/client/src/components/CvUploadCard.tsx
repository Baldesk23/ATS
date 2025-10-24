import { useState } from 'react';
import { Upload, HelpCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { storage, db, ref, uploadBytes, getDownloadURL, collection, addDoc, serverTimestamp } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface CvUploadCardProps {
  onModeratorClick: () => void;
}

export default function CvUploadCard({ onModeratorClick }: CvUploadCardProps) {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCvFile(file);
    if (file && file.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0] || null;
    if (file) {
      setCvFile(file);
      if (file.type.startsWith('image/')) {
        setPreview(URL.createObjectURL(file));
      } else {
        setPreview(null);
      }
    }
  };

  const handleCvSubmit = async () => {
    if (!cvFile) return;
    setIsUploading(true);
    setStatus('Subiendo tu CV a Firebase...');

    try {
      const fileRef = ref(storage, `cvs/${Date.now()}_${cvFile.name}`);
      await uploadBytes(fileRef, cvFile);
      const url = await getDownloadURL(fileRef);

      await addDoc(collection(db, 'uploads'), {
        filename: cvFile.name,
        mimetype: cvFile.type,
        size: cvFile.size,
        url,
        createdAt: serverTimestamp(),
      });

      setStatus('¡CV enviado correctamente!');
      toast({
        title: '¡Éxito!',
        description: 'Tu CV ha sido enviado correctamente.',
      });

      setTimeout(() => {
        setCvFile(null);
        setPreview(null);
        setStatus('');
      }, 2000);
    } catch (err) {
      console.error(err);
      setStatus('Error al subir el CV.');
      toast({
        title: 'Error',
        description: 'Hubo un problema al subir tu CV. Por favor, intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-card-foreground" data-testid="text-section-title">
          Sube tu CV
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onModeratorClick}
          title="Acceso moderador"
          data-testid="button-moderator-access"
        >
          <HelpCircle className="w-5 h-5" />
        </Button>
      </div>

      <label
        className="w-full cursor-pointer border-2 border-dashed border-input rounded-2xl p-6 text-center bg-muted/30 hover-elevate block"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-testid="dropzone-cv"
      >
        <div className="flex flex-col items-center">
          <Upload className="w-6 h-6 mb-3 text-muted-foreground" />
          <span className="text-muted-foreground">
            {cvFile ? cvFile.name : 'Haz clic o arrastra tu CV aquí'}
          </span>
        </div>
        <input
          type="file"
          className="hidden"
          onChange={handleFileUpload}
          accept=".pdf,.doc,.docx,image/*"
          data-testid="input-file"
        />
      </label>

      {preview && (
        <img
          src={preview}
          alt="Vista previa del CV"
          className="mt-6 rounded-xl max-h-96 object-contain w-full animate-fade-in-up"
          data-testid="img-preview"
        />
      )}

      {cvFile && (
        <Button
          onClick={handleCvSubmit}
          className="mt-6 w-full"
          disabled={isUploading}
          data-testid="button-submit-cv"
        >
          {isUploading ? 'Enviando...' : 'Enviar CV a Firebase'}
        </Button>
      )}

      {status && (
        <p className="mt-4 text-sm text-muted-foreground" data-testid="text-status">
          {status}
        </p>
      )}
    </Card>
  );
}
