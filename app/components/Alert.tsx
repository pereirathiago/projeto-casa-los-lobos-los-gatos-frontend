interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

export default function Alert({ type, message, onClose }: AlertProps) {
  const styles = {
    success: 'bg-green-50 border-green-500 text-green-800',
    error: 'bg-red-50 border-red-500 text-red-800',
    warning: 'bg-yellow-50 border-yellow-500 text-yellow-800',
    info: 'bg-blue-50 border-blue-500 text-blue-800',
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div
      className={`mb-4 rounded-r-lg border-l-4 p-3 ${styles[type]} flex items-start justify-between sm:p-4`}
    >
      <div className="flex items-start">
        <span className="mr-2 text-lg sm:mr-3 sm:text-xl">{icons[type]}</span>
        <p className="text-sm font-medium sm:text-base">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 text-gray-500 transition-colors hover:text-gray-700 sm:ml-4"
        >
          ✕
        </button>
      )}
    </div>
  );
}
