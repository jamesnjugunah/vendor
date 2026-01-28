import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table as TableIcon, List } from 'lucide-react';
import { cn } from '@/lib/utils';

type DensityType = 'compact' | 'comfortable';

interface TableDensityToggleProps {
  onDensityChange?: (density: DensityType) => void;
  className?: string;
}

export const TableDensityToggle = ({ onDensityChange, className }: TableDensityToggleProps) => {
  const [density, setDensity] = useState<DensityType>('comfortable');

  const handleToggle = (newDensity: DensityType) => {
    setDensity(newDensity);
    onDensityChange?.(newDensity);
  };

  return (
    <div className={cn('flex items-center gap-1 rounded-consistent bg-muted p-1', className)}>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          'h-8 px-3 transition-smooth',
          density === 'compact' && 'bg-background shadow-sm'
        )}
        onClick={() => handleToggle('compact')}
      >
        <List className="h-4 w-4 mr-1" />
        Compact
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          'h-8 px-3 transition-smooth',
          density === 'comfortable' && 'bg-background shadow-sm'
        )}
        onClick={() => handleToggle('comfortable')}
      >
        <TableIcon className="h-4 w-4 mr-1" />
        Comfortable
      </Button>
    </div>
  );
};

export const useTableDensity = () => {
  const [density, setDensity] = useState<DensityType>('comfortable');
  
  const getRowClass = () => {
    return density === 'compact' ? 'h-10' : 'h-14';
  };

  const getCellPadding = () => {
    return density === 'compact' ? 'py-2' : 'py-3';
  };

  return {
    density,
    setDensity,
    getRowClass,
    getCellPadding,
  };
};
