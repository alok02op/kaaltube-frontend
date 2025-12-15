import { createPortal } from 'react-dom';
import { Button } from '@/components';

export default function Confirm({ handleConfirm, headingText, onCancel, className = '', stopPropagation }) {
  const handleClick = (e) => {
    if (stopPropagation) e.stopPropagation();
  }
  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50" 
      onClick={handleClick}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-xs flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-center">{headingText}</h2>

        <div className="flex justify-center gap-4">
          <Button variant="outline" className="w-24 cursor-pointer" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            className={`w-24 bg-red-600 hover:bg-red-700 text-white cursor-pointer ${className}`} 
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
