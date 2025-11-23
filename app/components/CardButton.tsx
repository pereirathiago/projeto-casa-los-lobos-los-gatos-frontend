interface CardButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const baseCardButtonStyles =
  'h-auto flex flex-col text-sm items-center hover:font-bold text-[var(--ong-purple)] justify-center border-2 border-gray-200 px-4 py-2.5 sm:px-6 sm:py-3 sm:text-base rounded-lg transition-all duration-200 cursor-pointer hover:border-[var(--ong-purple)] hover:bg-purple-50 w-full hover:outline-1';

function CardButton({
  onClick,
  title,
  children,
  className = '',
  ...props
}: CardButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${className} ${baseCardButtonStyles}`}
      {...props}
    >
      {children}
      <p className="font-semibold text-gray-700">{title}</p>
    </button>
  );
}

export default CardButton;
