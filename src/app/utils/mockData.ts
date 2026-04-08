export interface Space {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Reservation {
  id: string;
  spaceId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  residentName: string;
  apartment: string;
}

export const spaces: Space[] = [
  {
    id: 'salon-social',
    name: 'Salón Social',
    description: 'Espacio amplio para eventos y reuniones sociales',
    icon: 'Users'
  },
  {
    id: 'zona-bbq',
    name: 'Zona BBQ',
    description: 'Área de parrilla con mobiliario para asados',
    icon: 'Flame'
  },
  {
    id: 'sala-reuniones',
    name: 'Sala de Reuniones',
    description: 'Sala equipada para reuniones de trabajo',
    icon: 'Briefcase'
  }
];

// Función para obtener la fecha de hoy en formato YYYY-MM-DD
const getTodayString = () => {
  const today = new Date(2026, 2, 17); // March 17, 2026 (Tuesday)
  return today.toISOString().split('T')[0];
};

// Función para obtener fechas de la semana actual
const getWeekDates = () => {
  const today = new Date(2026, 2, 17); // March 17, 2026 (Tuesday)
  const dayOfWeek = today.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Ajustar para que lunes sea el primer día
  
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff);
  
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

const weekDates = getWeekDates();

// Datos simulados de reservas
export const mockReservations: Reservation[] = [
  // Salón Social
  {
    id: 'res-1',
    spaceId: 'salon-social',
    date: weekDates[0], // Lunes
    startTime: '09:00',
    endTime: '11:00',
    residentName: 'María González',
    apartment: 'Apto 301'
  },
  {
    id: 'res-2',
    spaceId: 'salon-social',
    date: weekDates[0], // Lunes
    startTime: '14:00',
    endTime: '16:00',
    residentName: 'Carlos Rodríguez',
    apartment: 'Apto 205'
  },
  {
    id: 'res-3',
    spaceId: 'salon-social',
    date: weekDates[1], // Martes (hoy)
    startTime: '10:00',
    endTime: '13:00',
    residentName: 'Ana Martínez',
    apartment: 'Apto 102'
  },
  {
    id: 'res-4',
    spaceId: 'salon-social',
    date: weekDates[2], // Miércoles
    startTime: '15:00',
    endTime: '18:00',
    residentName: 'Luis Pérez',
    apartment: 'Apto 401'
  },
  {
    id: 'res-5',
    spaceId: 'salon-social',
    date: weekDates[5], // Sábado
    startTime: '10:00',
    endTime: '22:00',
    residentName: 'Patricia Silva',
    apartment: 'Apto 503'
  },
  
  // Zona BBQ
  {
    id: 'res-6',
    spaceId: 'zona-bbq',
    date: weekDates[1], // Martes (hoy)
    startTime: '12:00',
    endTime: '15:00',
    residentName: 'Roberto Jiménez',
    apartment: 'Apto 204'
  },
  {
    id: 'res-7',
    spaceId: 'zona-bbq',
    date: weekDates[1], // Martes (hoy)
    startTime: '17:00',
    endTime: '20:00',
    residentName: 'Sandra López',
    apartment: 'Apto 105'
  },
  {
    id: 'res-8',
    spaceId: 'zona-bbq',
    date: weekDates[5], // Sábado
    startTime: '11:00',
    endTime: '15:00',
    residentName: 'Diego Ramírez',
    apartment: 'Apto 302'
  },
  {
    id: 'res-9',
    spaceId: 'zona-bbq',
    date: weekDates[5], // Sábado
    startTime: '16:00',
    endTime: '21:00',
    residentName: 'Carmen Torres',
    apartment: 'Apto 404'
  },
  {
    id: 'res-10',
    spaceId: 'zona-bbq',
    date: weekDates[6], // Domingo
    startTime: '12:00',
    endTime: '16:00',
    residentName: 'Fernando Gutiérrez',
    apartment: 'Apto 201'
  },
  
  // Sala de Reuniones
  {
    id: 'res-11',
    spaceId: 'sala-reuniones',
    date: weekDates[0], // Lunes
    startTime: '08:00',
    endTime: '10:00',
    residentName: 'Adriana Castro',
    apartment: 'Apto 303'
  },
  {
    id: 'res-12',
    spaceId: 'sala-reuniones',
    date: weekDates[0], // Lunes
    startTime: '14:00',
    endTime: '16:00',
    residentName: 'Jorge Mendoza',
    apartment: 'Apto 501'
  },
  {
    id: 'res-13',
    spaceId: 'sala-reuniones',
    date: weekDates[1], // Martes (hoy)
    startTime: '09:00',
    endTime: '11:00',
    residentName: 'Valentina Rojas',
    apartment: 'Apto 402'
  },
  {
    id: 'res-14',
    spaceId: 'sala-reuniones',
    date: weekDates[2], // Miércoles
    startTime: '10:00',
    endTime: '12:00',
    residentName: 'Miguel Vargas',
    apartment: 'Apto 203'
  },
  {
    id: 'res-15',
    spaceId: 'sala-reuniones',
    date: weekDates[3], // Jueves
    startTime: '15:00',
    endTime: '17:00',
    residentName: 'Laura Morales',
    apartment: 'Apto 104'
  },
  {
    id: 'res-16',
    spaceId: 'sala-reuniones',
    date: weekDates[4], // Viernes
    startTime: '08:00',
    endTime: '10:00',
    residentName: 'Andrés Herrera',
    apartment: 'Apto 305'
  }
];

// Horarios disponibles (8:00 AM - 10:00 PM)
export const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
];

// Función para verificar si un horario está ocupado
export const isTimeSlotOccupied = (
  spaceId: string,
  date: string,
  time: string
): Reservation | null => {
  const reservation = mockReservations.find(res => {
    if (res.spaceId !== spaceId || res.date !== date) return false;
    
    const slotTime = parseInt(time.replace(':', ''));
    const startTime = parseInt(res.startTime.replace(':', ''));
    const endTime = parseInt(res.endTime.replace(':', ''));
    
    return slotTime >= startTime && slotTime < endTime;
  });
  
  return reservation || null;
};

// Función para obtener la fecha de hoy
export const getTodayDate = () => {
  return new Date(2026, 2, 17); // March 17, 2026 (Tuesday)
};
