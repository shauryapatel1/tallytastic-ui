
interface LogoIconProps {
  className?: string;
}

export const LogoIcon = ({ className }: LogoIconProps) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="24" height="24" rx="4" fill="url(#paint0_linear)" />
      <path d="M7 8H17V10H7V8Z" fill="white" />
      <path d="M7 12H17V14H7V12Z" fill="white" />
      <path d="M7 16H13V18H7V16Z" fill="white" />
      <defs>
        <linearGradient id="paint0_linear" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" />
          <stop offset="1" stopColor="#A855F7" />
        </linearGradient>
      </defs>
    </svg>
  );
};
