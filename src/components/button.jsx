const Button = ({ onClick, children, variant = 'primary', size = 'md', ...props }) => {
  const baseClasses = 'font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 active:scale-95';

  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl',
    secondary: 'bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/30',
    accent: 'bg-gradient-to-r from-pink-500 to-red-500 text-white hover:from-pink-600 hover:to-red-600 shadow-lg hover:shadow-xl',
    ghost: 'text-white/80 hover:text-white hover:bg-white/10'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]}`;

  return (
    <button
      onClick={onClick}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
