import { cn } from "@/lib/utils";

interface TagBadgeProps {
  name: string;
  color: string;
  className?: string;
  onClick?: () => void;
}

export default function TagBadge({ name, color, className, onClick }: TagBadgeProps) {
  // Function to determine if the text color should be dark or light based on background color
  const getTextColor = (bgColor: string) => {
    // Convert hex to RGB
    let hex = bgColor.replace('#', '');
    if (hex.length === 3) {
      hex = hex.split('').map(h => h + h).join('');
    }
    
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Calculate luminance - this is a simplified version
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black for bright colors and white for dark colors
    return luminance > 0.5 ? 'text-gray-800' : 'text-white';
  };

  // Apply styles with colors
  const badgeStyle = {
    backgroundColor: color,
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        getTextColor(color),
        onClick ? "cursor-pointer hover:opacity-90" : "",
        className
      )}
      style={badgeStyle}
      onClick={onClick}
    >
      {name}
    </span>
  );
}
