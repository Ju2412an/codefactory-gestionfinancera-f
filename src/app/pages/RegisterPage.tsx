import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { registrarUsuario } from '../services/apiService';
import { Eye, EyeOff, AlertCircle, LoaderCircle, DollarSign, CheckCircle } from 'lucide-react';

function getPasswordStrength(password: string): { level: number; label: string; color: string } {
  if (!password) return { level: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { level: 1, label: 'Débil', color: 'bg-red-500' };
  if (score <= 3) return { level: 2, label: 'Media', color: 'bg-yellow-500' };
  return { level: 3, label: 'Contraseña fuerte', color: 'bg-green-700' };
}

export function RegisterPage() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const strength = getPasswordStrength(password);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    // Split nombre completo into nombre + apellido
    const parts = nombre.trim().split(' ');
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ') || firstName;

    try {
      await registrarUsuario(email, firstName, lastName, password);
      setSuccess(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al registrar';
      if (msg.toLowerCase().includes('correo') || msg.toLowerCase().includes('email') || msg.toLowerCase().includes('existe')) {
        setEmailError('Este correo ya está en uso. ¿Olvidaste tu contraseña?');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (success) {
    return (
      <div className="min-h-screen bg-[#e8edf2] flex flex-col items-center justify-center p-4">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-[#2c5f7c] rounded-lg p-2">
            <DollarSign className="w-7 h-7 text-white" />
          </div>
          <span className="text-3xl font-bold text-[#2c3e50]">FinanzApp</span>
        </div>

        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-10 text-center">
          <div className="mx-auto mb-6 w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-700" />
          </div>
          <h2 className="text-2xl font-bold text-[#2c3e50] mb-2">¡Cuenta creada exitosamente!</h2>
          <p className="text-gray-500 mb-8">Ya puedes iniciar sesión con tu correo y contraseña</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-[#2c5f7c] hover:bg-[#234d65] text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Ir a iniciar sesión
          </button>
        </div>
      </div>
    );
  }

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
      <h1 className="text-2xl font-bold text-[#2c5f7c] mb-6">Crea tu cuenta</h1>

      {/* General error */}
      {error && (
        <div className="w-full max-w-md mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      )}

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <form onSubmit={handleRegister} className="space-y-5">
          {/* Nombre completo */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#2c3e50] uppercase tracking-wide">
              Nombre completo
            </label>
            <input
              type="text"
              placeholder="María Camila Restrepo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c5f7c]/30 focus:border-[#2c5f7c] disabled:bg-gray-100"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#2c3e50] uppercase tracking-wide">
              Correo electrónico
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="maria.restrepo@gmail.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                required
                disabled={loading}
                className={`w-full px-4 py-3 border rounded-lg text-sm pr-12 focus:outline-none focus:ring-2 disabled:bg-gray-100 ${
                  emailError
                    ? 'border-red-400 focus:ring-red-300 focus:border-red-400'
                    : 'border-gray-300 focus:ring-[#2c5f7c]/30 focus:border-[#2c5f7c]'
                }`}
              />
              {emailError && (
                <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-400" />
              )}
            </div>
            {emailError && (
              <p className="text-sm text-red-500">{emailError}</p>
            )}
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
                disabled={loading}
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
            {/* Strength bar */}
            {password && (
              <>
                <div className="flex gap-1">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full ${
                        i <= strength.level ? strength.color : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <p className={`text-xs ${
                  strength.level === 3 ? 'text-green-700' : strength.level === 2 ? 'text-yellow-600' : 'text-red-500'
                }`}>
                  {strength.label}
                </p>
              </>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#2c3e50] uppercase tracking-wide">
              Confirmar contraseña
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm pr-12 focus:outline-none focus:ring-2 focus:ring-[#2c5f7c]/30 focus:border-[#2c5f7c] disabled:bg-gray-100"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2c5f7c] hover:bg-[#234d65] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <><LoaderCircle className="w-5 h-5 animate-spin mr-2" /> Creando cuenta...</>
            ) : (
              'Crear cuenta'
            )}
          </button>
        </form>
      </div>

      {/* Login link */}
      <p className="mt-8 text-sm text-[#2c5f7c]">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="font-bold underline hover:text-[#234d65]">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
