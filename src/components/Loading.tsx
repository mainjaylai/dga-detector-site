import './Loading.css';

interface LoadingProps {
  size?: number;
  color?: string;
}

export function Loading({ size = 30, color = '#646cff' }: LoadingProps) {
  return (
    <div 
      className="loading-spinner"
      style={{ 
        width: size, 
        height: size,
        borderColor: color,
        borderTopColor: 'transparent'
      }}
    />
  );
} 