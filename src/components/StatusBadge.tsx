import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type StatusType = 'success' | 'warning' | 'danger' | 'info' | 'default';

interface StatusBadgeProps {
  status: StatusType | string;
  label: string;
  className?: string;
}

export const StatusBadge = ({ status, label, className }: StatusBadgeProps) => {
  const statusStyles = {
    success: 'bg-success text-success-foreground hover:bg-success/90',
    warning: 'bg-warning text-warning-foreground hover:bg-warning/90',
    danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    info: 'bg-blue-500 text-white hover:bg-blue-600',
    default: 'bg-secondary text-secondary-foreground',
  };

  const getStatusType = (statusString: string): StatusType => {
    const normalized = statusString.toLowerCase();
    if (['active', 'paid', 'completed', 'approved', 'success'].includes(normalized)) {
      return 'success';
    }
    if (['pending', 'review', 'warning', 'low stock'].includes(normalized)) {
      return 'warning';
    }
    if (['inactive', 'suspended', 'cancelled', 'failed', 'danger'].includes(normalized)) {
      return 'danger';
    }
    if (['info', 'processing'].includes(normalized)) {
      return 'info';
    }
    return 'default';
  };

  const statusType = typeof status === 'string' ? getStatusType(status) : status;
  const style = statusStyles[statusType];

  return (
    <Badge 
      className={cn(
        'rounded-consistent transition-smooth font-medium',
        style,
        className
      )}
    >
      {label}
    </Badge>
  );
};
