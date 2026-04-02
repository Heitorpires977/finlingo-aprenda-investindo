import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
        // Persist "remember me" preference
        if (rememberMe) {
          localStorage.setItem('finlingo-remember', 'true');
        } else {
          localStorage.setItem('finlingo-remember', 'false');
        }
        toast.success('Bem-vindo de volta!');
      } else {
        await signUp(email, password, username);
        localStorage.setItem('finlingo-remember', 'true');
        toast.success('Conta criada com sucesso!');
      }
      navigate('/learn');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro desconhecido';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2">
            <span className="text-5xl">💰</span>
            <h1 className="text-4xl font-black text-primary">FinLingo</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Aprenda finanças de forma divertida!
          </p>
        </div>

        {/* Form */}
        <div className="bg-card rounded-2xl shadow-lg border p-6 space-y-6">
          <div className="flex rounded-xl bg-muted p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${
                isLogin ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${
                !isLogin ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground'
              }`}
            >
              Criar Conta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-sm font-semibold text-foreground">Nome de usuário</label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Seu apelido"
                  className="mt-1"
                  required={!isLogin}
                />
              </div>
            )}
            <div>
              <label className="text-sm font-semibold text-foreground">E-mail</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="mt-1"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground">Senha</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="mt-1"
                required
                minLength={6}
              />
            </div>

            {isLogin && (
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  className="border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <label
                  htmlFor="remember-me"
                  className="text-sm font-semibold text-foreground cursor-pointer select-none flex items-center gap-1.5"
                >
                  <span>💰</span> Lembrar de mim
                </label>
              </div>
            )}

            <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
              {loading ? 'Carregando...' : isLogin ? 'Entrar' : 'Criar Conta'}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Aprenda sobre investimentos, ações e mercado financeiro de forma gamificada 🚀
        </p>
      </div>
    </div>
  );
}
