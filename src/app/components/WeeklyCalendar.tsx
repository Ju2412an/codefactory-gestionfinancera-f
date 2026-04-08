import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle, AlertCircle, LoaderCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { obtenerCalendario, crearReserva, Calendario, Franja } from '../services/apiService';

interface WeeklyCalendarProps {
  espacioId: number;
  espacioNombre: string;
  usuarioId: number;
  usuarioNombre: string;
}

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

export function WeeklyCalendar({ espacioId, espacioNombre, usuarioId, usuarioNombre }: WeeklyCalendarProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getMonday(new Date()));
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  const [calendarios, setCalendarios] = useState<Map<string, Calendario>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [creatingReserva, setCreatingReserva] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Cargar calendarios para la semana
  useEffect(() => {
    const cargarCalendarios = async () => {
      setLoading(true);
      setError('');
      const nuevosMaps = new Map<string, Calendario>();

      try {
        const dates: Date[] = [];
        for (let i = 0; i < 7; i++) {
          const date = new Date(currentWeekStart);
          date.setDate(currentWeekStart.getDate() + i);
          dates.push(date);
          const dateStr = date.toISOString().split('T')[0];

          try {
            const calendario = await obtenerCalendario(espacioId, dateStr);
            nuevosMaps.set(dateStr, calendario);
          } catch (err) {
            console.error(`Error cargando calendario para ${dateStr}:`, err);
          }
        }
        setWeekDates(dates);
        setCalendarios(nuevosMaps);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar calendarios');
      } finally {
        setLoading(false);
      }
    };

    cargarCalendarios();
  }, [currentWeekStart, espacioId]);

  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const goToToday = () => {
    setCurrentWeekStart(getMonday(new Date()));
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getDayName = (date: Date) => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return days[date.getDay()];
  };

  const getMonthName = (date: Date) => {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return months[date.getMonth()];
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getCalendarioParaFecha = (dateStr: string): Calendario | undefined => {
    return calendarios.get(dateStr);
  };

  const obtenerFranjaParaHora = (dateStr: string, hora: string): Franja | undefined => {
    const calendario = getCalendarioParaFecha(dateStr);
    if (!calendario) return undefined;
    
    return calendario.franjas.find(f => {
      const horaFranja = f.horaInicio.substring(11, 16); // HH:mm
      return horaFranja === hora;
    });
  };

  const extraerHoras = (): string[] => {
    if (calendarios.size === 0) return [];
    const primerCalendario = Array.from(calendarios.values())[0];
    return primerCalendario.franjas.map(f => f.horaInicio.substring(11, 16));
  };

  const handleSlotClick = (dateStr: string, hora: string) => {
    const franja = obtenerFranjaParaHora(dateStr, hora);
    if (franja && franja.estado === 'DISPONIBLE') {
      setSelectedDate(dateStr);
      setSelectedTime(hora);
      setConfirmDialogOpen(true);
    }
  };

  const confirmReserva = async () => {
    if (!selectedDate || !selectedTime) return;

    setCreatingReserva(true);
    
    try {
      const franja = obtenerFranjaParaHora(selectedDate, selectedTime);
      if (!franja) throw new Error('Franja no encontrada');

      const reserva = await crearReserva({
        usuarioId,
        espacioId,
        fechaInicio: franja.horaInicio,
        fechaFin: franja.horaFin,
      });

      setSuccessMessage(`¡Reserva confirmada! ID: ${reserva.id}`);
      setShowSuccessMessage(true);
      setConfirmDialogOpen(false);
      
      // Recargar calendarios
      setTimeout(() => {
        setCurrentWeekStart(new Date(currentWeekStart));
        setShowSuccessMessage(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear reserva');
    } finally {
      setCreatingReserva(false);
    }
  };

  const horas = extraerHoras();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoaderCircle className="w-6 h-6 animate-spin mr-2" />
        <span>Cargando calendario...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
          <div>
            <p className="text-foreground font-medium">Error al cargar el calendario</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (weekDates.length === 0 || horas.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <span className="text-muted-foreground">No hay datos disponibles</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header del calendario */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-6 h-6 text-primary" />
          <div>
            <h3 className="text-foreground">{espacioNombre}</h3>
            <p className="text-sm text-muted-foreground">
              {getMonthName(weekDates[0])} {weekDates[0]?.getFullYear()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="hidden sm:flex"
          >
            Hoy
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={goToPreviousWeek}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNextWeek}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap gap-4 p-3 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border-2 border-border rounded"></div>
          <span className="text-sm text-muted-foreground">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-destructive/20 border-2 border-destructive/50 rounded"></div>
          <span className="text-sm text-muted-foreground">Ocupado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary/20 border-2 border-primary rounded"></div>
          <span className="text-sm text-muted-foreground">Hoy</span>
        </div>
      </div>

      {/* Calendario */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Días de la semana */}
            <div className="grid grid-cols-8 border-b border-border bg-muted/20">
              <div className="p-3 text-sm text-muted-foreground sticky left-0 bg-muted/20 z-10">
                Horario
              </div>
              {weekDates.map((date, index) => {
                const dateStr = formatDate(date);
                const calendario = getCalendarioParaFecha(dateStr);
                const disponibles = calendario?.totalDisponibles || 0;
                const fullyBooked = disponibles === 0;
                
                return (
                  <div
                    key={index}
                    className={`p-3 text-center border-l border-border ${
                      isToday(date) ? 'bg-primary/10' : ''
                    }`}
                  >
                    <div className="text-sm text-muted-foreground">{getDayName(date)}</div>
                    <div className={`text-lg mt-1 ${
                      isToday(date) ? 'text-primary font-semibold' : 'text-foreground'
                    }`}>
                      {date.getDate()}
                    </div>
                    {fullyBooked ? (
                      <Badge variant="destructive" className="mt-1 text-xs">
                        Sin disponibilidad
                      </Badge>
                    ) : (
                      <div className="text-xs text-muted-foreground mt-1">
                        {disponibles} disponibles
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Franjas horarias */}
            {horas.map((hora) => (
              <div key={hora} className="grid grid-cols-8 border-b border-border hover:bg-muted/10">
                <div className="p-3 text-sm text-muted-foreground border-r border-border sticky left-0 bg-background z-10">
                  {hora}
                </div>
                {weekDates.map((date, index) => {
                  const dateStr = formatDate(date);
                  const franja = obtenerFranjaParaHora(dateStr, hora);
                  const isTodayCell = isToday(date);
                  const isOcupado = franja?.estado === 'OCUPADO';
                  
                  return (
                    <div
                      key={index}
                      onClick={() => handleSlotClick(dateStr, hora)}
                      className={`p-2 border-l border-border min-h-[60px] transition-all cursor-pointer ${
                        isOcupado
                          ? 'bg-destructive/20 hover:bg-destructive/30' 
                          : isTodayCell
                          ? 'bg-primary/5 hover:bg-primary/10'
                          : 'hover:bg-accent/20'
                      }`}
                    >
                      {isOcupado ? (
                        <div className="space-y-1">
                          <Badge variant="destructive" className="text-xs">
                            Ocupado
                          </Badge>
                          {franja?.reservaId && (
                            <p className="text-xs text-muted-foreground">ID: {franja.reservaId}</p>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-xs text-muted-foreground">
                            Disponible
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Dialogo de confirmación */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Reserva</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres reservar este horario?
            </DialogDescription>
          </DialogHeader>
          
          {selectedDate && selectedTime && (
            <div className="bg-muted/30 p-4 rounded-lg space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p className="text-muted-foreground">Espacio:</p>
                <p className="text-foreground font-medium">{espacioNombre}</p>
                
                <p className="text-muted-foreground">Fecha:</p>
                <p className="text-foreground font-medium">
                  {new Date(selectedDate).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                
                <p className="text-muted-foreground">Horario:</p>
                <p className="text-foreground font-medium">
                  {selectedTime}
                </p>
                
                <p className="text-muted-foreground">Usuario:</p>
                <p className="text-foreground font-medium">{usuarioNombre}</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setConfirmDialogOpen(false);
                setSelectedDate(null);
                setSelectedTime(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={confirmReserva}
              disabled={creatingReserva}
            >
              {creatingReserva ? (
                <>
                  <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
                  Creando...
                </>
              ) : (
                'Confirmar Reserva'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mensaje de éxito */}
      {showSuccessMessage && (
        <Card className="p-4 bg-primary/10 border-primary/30">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <h4 className="text-foreground">¡Reserva Exitosa!</h4>
              </div>
              <div className="space-y-1 text-sm">
                <p>{successMessage}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSuccessMessage(false)}
            >
              Cerrar
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}