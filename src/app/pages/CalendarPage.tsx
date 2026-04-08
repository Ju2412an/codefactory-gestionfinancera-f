import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Building2, LogOut, AlertCircle, LoaderCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { SpaceSelector } from '../components/SpaceSelector';
import { WeeklyCalendar } from '../components/WeeklyCalendar';
import { obtenerEspacios, limpiarAutenticacion, obtenerUsuarioLocal, Espacio, Usuario } from '../services/apiService';

export function CalendarPage() {
  const [espacios, setEspacios] = useState<Espacio[]>([]);
  const [selectedSpaceId, setSelectedSpaceId] = useState<number | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Verificar autenticación
        const usuarioLocal = obtenerUsuarioLocal();
        if (!usuarioLocal) {
          navigate('/');
          return;
        }
        setUsuario(usuarioLocal);

        // Obtener espacios del backend
        const espaciosCargados = await obtenerEspacios();
        setEspacios(espaciosCargados);
        
        if (espaciosCargados.length > 0) {
          setSelectedSpaceId(espaciosCargados[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar espacios');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [navigate]);

  const handleLogout = () => {
    limpiarAutenticacion();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoaderCircle className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Cargando espacios disponibles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 max-w-md">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">Error al cargar</h3>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
          <Button onClick={() => window.location.reload()} className="w-full mt-4">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  const selectedSpace = espacios.find(s => s.id === selectedSpaceId);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary rounded-lg p-2">
                <Building2 className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-foreground">Unidad Residencial</h1>
                <p className="text-sm text-muted-foreground">Sistema de Reservas</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm text-muted-foreground">Bienvenido,</p>
                <p className="text-foreground">{usuario?.nombre} {usuario?.apellido}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Selector de espacios */}
          {espacios.length > 0 && (
            <SpaceSelector
              spaces={espacios}
              selectedSpaceId={selectedSpaceId}
              onSelectSpace={setSelectedSpaceId}
            />
          )}

          {/* Calendario */}
          {selectedSpace && usuario && (
            <WeeklyCalendar
              key={selectedSpaceId}
              espacioId={selectedSpace.id}
              espacioNombre={selectedSpace.nombre}
              usuarioId={usuario.id}
              usuarioNombre={usuario.nombre}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>Sistema de Reservas de Espacios Comunes</p>
            <p className="mt-1">© 2026 Unidad Residencial. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}