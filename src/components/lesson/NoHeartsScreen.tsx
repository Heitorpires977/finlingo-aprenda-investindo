import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NoHeartsScreenProps {
  onBack: () => void;
}

export function NoHeartsScreen({ onBack }: NoHeartsScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center space-y-6 animate-fade-in">
      <div className="animate-bounce-in">
        <Heart className="h-20 w-20 text-finlingo-hearts" />
      </div>
      <h2 className="text-2xl font-black text-foreground">Sem corações!</h2>
      <p className="text-muted-foreground">Aguarde a recarga automática ou use FinCoins na loja.</p>
      <Button onClick={onBack}>Voltar</Button>
    </div>
  );
}
