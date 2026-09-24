import { useEffect, useState } from "react";
import { CircleAlert } from "lucide-react";

interface Props {
  message: string;
  className?: string;
}

const TIME_DELAY = 5000; // 5s

const ErrorAlert = ({ message, className = "" }: Props) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(true);

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, TIME_DELAY);

    return () => clearTimeout(timer);
  }, [message]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`absolute inset-x-0 top-0 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300 ${className}`}
    >
      <CircleAlert className="h-4 w-4 shrink-0" strokeWidth={1.8} />
      <p className="min-w-0 flex-1 leading-5">{message}</p>
    </div>
  );
};

export default ErrorAlert;
