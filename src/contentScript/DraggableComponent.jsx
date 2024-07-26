import React, { useRef, useState } from 'react';

const DraggableComponent: React.FC = () => {
  const draggableRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsDragging(true);
    draggableRef.current!.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    setPosition({
      x: e.clientX - draggableRef.current!.offsetWidth / 2,
      y: e.clientY - draggableRef.current!.offsetHeight / 2,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    draggableRef.current!.style.cursor = 'grab';
  };

  React.useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={draggableRef}
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '200px',
        height: '200px',
        backgroundColor: '#48bb78',
        cursor: 'grab',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #e2e8f0',
        borderRadius: '0.375rem',
      }}
    >
      Drag me around!
    </div>
  );
};

export default DraggableComponent;
