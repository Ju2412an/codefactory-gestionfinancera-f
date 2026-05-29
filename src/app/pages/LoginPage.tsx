import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { login, guardarUsuario } from '../services/apiService';
import { Eye, EyeOff, AlertCircle, LoaderCircle, DollarSign } from 'lucide-react';

const MAX_ATTEMPTS = 3;

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(MAX_ATTEMPTS);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const usuario = await login(email, password);
      guardarUsuario(usuario);
      navigate('/');
    } catch (err) {
      const remaining = attempts - 1;
      setAttempts(remaining);
      setError('Correo o contraseña incorrectos. Verifica tus datos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e8edf2] flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#2c5f7c] rounded-lg p-2">
          <DollarSign className="w-7 h-7 text-white" />
        </div>
        <span className="text-3xl font-bold text-[#2c3e50]">FinanzApp</span>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-[#2c5f7c] mb-6">Inicia sesión</h1>

      {/* Error */}
      {error && attempts < MAX_ATTEMPTS && (
        <div className="w-full max-w-md mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">{error}</p>
            <p className="text-sm text-red-600">Intentos restantes: {attempts}</p>
          </div>
        </div>
      )}

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#2c3e50] uppercase tracking-wide">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="correo@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading || attempts <= 0}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c5f7c]/30 focus:border-[#2c5f7c] disabled:bg-gray-100"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#2c3e50] uppercase tracking-wide">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading || attempts <= 0}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm pr-12 focus:outline-none focus:ring-2 focus:ring-[#2c5f7c]/30 focus:border-[#2c5f7c] disabled:bg-gray-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || attempts <= 0}
            className="w-full bg-[#2c5f7c] hover:bg-[#234d65] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <LoaderCircle className="w-5 h-5 animate-spin mr-2" />
                Ingresando...
              </>
            ) : (
              'Ingresar'
            )}
          </button>

          {/* Forgot */}
          <p className="text-center text-sm text-[#2c5f7c] hover:underline cursor-pointer">
            ¿Olvidaste tu contraseña?
          </p>
        </form>
      </div>

      {/* Register */}
      <p className="mt-8 text-sm text-[#2c5f7c]">
        ¿No tienes cuenta?{' '}
        <Link to="/register" className="font-bold underline hover:text-[#234d65]">
          Regístrate
        </Link>
      </p>
    </div>
  );
}
