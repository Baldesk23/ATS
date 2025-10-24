import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { db, collection, addDoc, serverTimestamp } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface JobOfferFormProps {
  onLogout: () => void;
}

export default function JobOfferForm({ onLogout }: JobOfferFormProps) {
  const [jobOffer, setJobOffer] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const { toast } = useToast();

  const handlePublishOffer = async () => {
    if (!jobOffer.trim()) {
      toast({
        title: 'Error',
        description: 'Por favor, describe la oferta laboral antes de publicar.',
        variant: 'destructive',
      });
      return;
    }

    setIsPublishing(true);

    try {
      await addDoc(collection(db, 'joboffers'), {
        description: jobOffer.trim(),
        createdAt: serverTimestamp(),
      });

      toast({
        title: '¡Éxito!',
        description: 'Oferta publicada exitosamente.',
      });

      setJobOffer('');
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'Error al publicar la oferta.',
        variant: 'destructive',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Card className="mt-6 w-full max-w-2xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-card-foreground" data-testid="text-moderator-title">
          Cargar Oferta Laboral
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onLogout}
          title="Cerrar sesión"
          className="text-destructive hover:text-destructive"
          data-testid="button-logout"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>

      <Textarea
        placeholder="Describe la oferta laboral..."
        value={jobOffer}
        onChange={(e) => setJobOffer(e.target.value)}
        rows={6}
        className="mb-4"
        data-testid="textarea-job-offer"
      />

      <Button
        onClick={handlePublishOffer}
        className="w-full"
        disabled={isPublishing}
        data-testid="button-publish-offer"
      >
        {isPublishing ? 'Publicando...' : 'Publicar Oferta'}
      </Button>
    </Card>
  );
}
