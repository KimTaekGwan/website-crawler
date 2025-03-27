import { cn } from '@/lib/utils';

interface CaptureStatusBadgeProps {
  status: string;
  className?: string;
}

export default function CaptureStatusBadge({ status, className }: CaptureStatusBadgeProps) {
  // Map status to appropriate colors
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'complete':
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          label: 'Complete'
        };
      case 'in_progress':
        return {
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          label: 'In Progress'
        };
      case 'failed':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          label: 'Failed'
        };
      case 'pending':
        return {
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          label: 'Pending'
        };
      default:
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          label: status
        };
    }
  };

  const { bgColor, textColor, label } = getStatusConfig(status);

  return (
    <span
      className={cn(
        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
        bgColor,
        textColor,
        className
      )}
    >
      {label}
    </span>
  );
}
