import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Chrome } from 'lucide-react';

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

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/learn',
        },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao login com Google';
      toast.error(msg);
      setLoading(false);
    }
  };

  return (
