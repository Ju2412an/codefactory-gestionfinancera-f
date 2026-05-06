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
  return { level: 3, label: 'Fuerte', color: 'bg-green-700' };
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

    const cleanName = nombre.trim();

    if (!cleanName) {
      setError('El nombre es obligatorio');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    // Separar nombre y apellido correctamente
    const parts = cleanName.split(' ');
    const firstName = parts[0];
    const lastName = parts.length > 1 ? parts.slice(1).join(' ') : '';

    try {
      await registrarUsuario(email, firstName, lastName, password);
      setSuccess(true);

      // Redirección automática opcional (más profesional)
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al registrar';

      if (
        msg.toLowerCase().includes('correo') ||
        msg.toLowerCase().includes('email') ||
        msg.toLowerCase().includes('existe')
      ) {
        setEmailError('Este correo ya está en uso');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Pantalla éxito
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

          <h2 className="text-2xl font-bold text-[#2c3e50] mb-2">
            ¡Cuenta creada exitosamente!
          </h2>

          <p className="text-gray-500 mb-4">
            Serás redirigido al login...
          </p>

          <button
            onClick={() => navigate('/login')}
            className="w-full bg-[#2c5f7c] hover:bg-[#234d65] text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Ir ahora
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e8edf2] flex flex-col items-center justify-center p-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#2c5f7c] rounded-lg p-2">
          <DollarSign className="w-7 h-7 text-white" />
        </div>
        <span className="text-3xl font-bold text-[#2c3e50]">FinanzApp</span>
      </div>

      <h1 className="text-2xl font-bold text-[#2c5f7c] mb-6">
        Crea tu cuenta
      </h1>

      {error && (
        <div className="w-full max-w-md mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <form onSubmit={handleRegister} className="space-y-5">
          
          {/* Nombre */}
          <input
            type="text"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-lg"
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-lg"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-lg"
          />

          {/* Confirm */}
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-lg"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2c5f7c] text-white py-3 rounded-lg"
          >
            {loading ? 'Creando...' : 'Crear cuenta'}
          </button>

        </form>
      </div>

      <p className="mt-6">
        ¿Ya tienes cuenta? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
