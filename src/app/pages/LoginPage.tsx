import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Building2, Lock, User, AlertCircle, LoaderCircle } from 'lucide-react';
import { autenticar, guardarUsuarioLocal } from '../services/apiService';

export function LoginPage() {
  const [email, setEmail] = useState('juan.perez@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const usuario = await autenticar(email, password);
      guardarUsuarioLocal(usuario);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const completarCredenciales = (mail: string, pass: string) => {
    setEmail(mail);
    setPassword(pass);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4A7C59] to-[#6BAA75] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto bg-primary rounded-full p-4 w-20 h-20 flex items-center justify-center">
            <Building2 className="w-10 h-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl">Unidad Residencial</CardTitle>
          <CardDescription className="text-base">
            Sistema de Reservas de Espacios Comunes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4" />
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Ingrese su email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-input-background border-border"
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="flex items-center gap-2 text-sm">
                <Lock className="w-4 h-4" />
                Contraseña
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-input-background border-border"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-md">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full mt-6 bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoaderCircle className="w-4 h-4 animate-spin mr-2" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>
          
          {/* Credenciales de demostración */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-center text-xs font-semibold text-muted-foreground mb-3">
              Credenciales de Demostración
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => completarCredenciales('juan.perez@example.com', 'password123')}
                className="w-full text-left p-3 bg-muted/50 hover:bg-muted rounded-md transition text-sm"
              >
                <p className="font-medium text-foreground">Juan Pérez</p>
                <p className="text-muted-foreground text-xs">juan.perez@example.com</p>
              </button>
              <button
                type="button"
                onClick={() => completarCredenciales('maria.garcia@example.com', 'password456')}
                className="w-full text-left p-3 bg-muted/50 hover:bg-muted rounded-md transition text-sm"
              >
                <p className="font-medium text-foreground">María García</p>
                <p className="text-muted-foreground text-xs">maria.garcia@example.com</p>
              </button>
              <button
                type="button"
                onClick={() => completarCredenciales('carlos.lopez@example.com', 'password789')}
                className="w-full text-left p-3 bg-muted/50 hover:bg-muted rounded-md transition text-sm"
              >
                <p className="font-medium text-foreground">Carlos López</p>
                <p className="text-muted-foreground text-xs">carlos.lopez@example.com</p>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
