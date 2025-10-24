import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface PasswordPromptProps {
  onSuccess: () => void;
}

export default function PasswordPrompt({ onSuccess }: PasswordPromptProps) {
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const handlePasswordSubmit = () => {
    if (password === 'Sanro') {
      onSuccess();
    } else {
      toast({
        title: 'Error',
        description: 'Contraseña incorrecta',
        variant: 'destructive',
      });
      setPassword('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePasswordSubmit();
    }
  };

  return (
    <Card className="mt-6 w-full max-w-md p-6">
      <h2 className="text-lg font-bold text-card-foreground mb-4" data-testid="text-prompt-title">
        Acceso Moderador
      </h2>
      <Input
        type="password"
        placeholder="Ingresa la contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleKeyDown}
        className="mb-4"
        data-testid="input-password"
      />
      <Button
        onClick={handlePasswordSubmit}
        className="w-full"
        data-testid="button-submit-password"
      >
        Entrar
      </Button>
    </Card>
  );
}
