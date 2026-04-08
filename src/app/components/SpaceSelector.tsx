import { Users, Flame, Briefcase, LucideIcon, Home, Music } from 'lucide-react';
import { Card } from './ui/card';
import { Espacio } from '../services/apiService';

interface SpaceSelectorProps {
  spaces: Espacio[];
  selectedSpaceId: number | null;
  onSelectSpace: (spaceId: number) => void;
}

const iconMap: Record<string, LucideIcon> = {
  Users: Users,
  Flame: Flame,
  Briefcase: Briefcase,
  Home: Home,
  Music: Music
};

// Función para extraer icono basado en el nombre del espacio
const getIconForSpace = (spaceName: string): LucideIcon => {
  const lowerName = spaceName.toLowerCase();
  
  if (lowerName.includes('sala') || lowerName.includes('juntas') || lowerName.includes('reuniones')) {
    return Briefcase;
  } else if (lowerName.includes('auditorio') || lowerName.includes('eventos')) {
    return Users;
  } else if (lowerName.includes('cancha') || lowerName.includes('tenis')) {
    return Music;
  }
  
  return Home;
};

export function SpaceSelector({ spaces, selectedSpaceId, onSelectSpace }: SpaceSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-foreground font-semibold">Seleccione un espacio</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {spaces.map((space) => {
          const Icon = getIconForSpace(space.nombre);
          const isSelected = selectedSpaceId === space.id;
          
          return (
            <Card
              key={space.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected 
                  ? 'border-2 border-primary bg-accent/10' 
                  : 'border border-border hover:border-primary/50'
              }`}
              onClick={() => onSelectSpace(space.id)}
            >
              <div className="p-6 space-y-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  isSelected ? 'bg-primary' : 'bg-muted'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    isSelected ? 'text-primary-foreground' : 'text-foreground'
                  }`} />
                </div>
                <div>
                  <h4 className="text-foreground mb-1 font-medium truncate">{space.nombre}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">{space.descripcion}</p>
                  <p className="text-xs text-muted-foreground mt-1">📍 {space.ubicacion}</p>
                  <p className="text-xs text-muted-foreground">👥 Capacidad: {space.capacidad}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
