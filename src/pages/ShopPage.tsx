import AppLayout from '@/components/AppLayout';
import { useProfile, useShopPurchaseMutation } from '@/hooks/useGameData';
import { Button } from '@/components/ui/button';
import { Heart, Zap, Snowflake, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

const SHOP_ITEMS = [
  {
    id: 'heart_refill',
    name: 'Recarga de Corações',
    description: 'Restaura todos os 5 corações',
    price: 10,
    icon: Heart,
    color: 'text-finlingo-hearts',
  },
  {
    id: 'xp_boost',
    name: 'Boost de XP',
    description: 'Dobra o XP ganho por 30 minutos',
    price: 50,
    icon: Zap,
    color: 'text-finlingo-xp',
  },
  {
    id: 'streak_freeze',
    name: 'Proteção de Sequência',
    description: 'Protege sua sequência por 1 dia',
    price: 20,
    icon: Snowflake,
    color: 'text-secondary',
  },
];

export default function ShopPage() {
  const { data: profile } = useProfile();
  const purchase = useShopPurchaseMutation();

  const handlePurchase = async (item: typeof SHOP_ITEMS[0]) => {
    if (!profile) return;
    if (profile.fincoins < item.price) {
      toast.error('FinCoins insuficientes!');
      return;
    }

    try {
      await purchase.mutateAsync(item.id);
      toast.success(`${item.name} comprado! 🎉`);
    } catch {
      toast.error('Erro ao comprar item');
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <ShoppingCart className="h-10 w-10 text-accent mx-auto" />
          <h1 className="text-2xl font-black text-foreground">Loja</h1>
          <p className="text-muted-foreground">
            Você tem <span className="font-bold text-finlingo-coins">{profile?.fincoins ?? 0} FinCoins</span>
          </p>
        </div>

        <div className="space-y-4">
          {SHOP_ITEMS.map(item => {
            const Icon = item.icon;
            const canAfford = (profile?.fincoins ?? 0) >= item.price;

            return (
              <div
                key={item.id}
                className="bg-card rounded-2xl border p-4 flex items-center gap-4"
              >
                <div className={`w-14 h-14 rounded-xl bg-muted flex items-center justify-center ${item.color}`}>
                  <Icon className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <Button
                  variant="coins"
                  size="sm"
                  onClick={() => handlePurchase(item)}
                  disabled={!canAfford || purchase.isPending}
                  className="min-w-[80px]"
                >
                  {item.price} 🪙
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
