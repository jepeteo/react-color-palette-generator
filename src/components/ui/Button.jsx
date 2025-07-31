import React from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable Button component with multiple variants and sizes
 */
function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'left',
  className = '',
  type = 'button',
  ...props
}) {
  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'font-medium',
    'transition-all',
    'duration-200',
    'rounded-lg',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-1',
    'active:scale-95',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'disabled:transform-none',
  ];

  const variants = {
    primary: [
      'bg-gradient-to-r',
      'from-blue-500',
      'to-purple-600',
      'text-white',
      'hover:from-blue-600',
      'hover:to-purple-700',
      'focus:ring-blue-500/50',
      'shadow-lg',
      'hover:shadow-xl',
    ],
    secondary: [
      'bg-white/10',
      'text-white',
      'border',
      'border-white/20',
      'hover:bg-white/20',
      'hover:border-white/30',
      'focus:ring-white/50',
    ],
    accent: [
      'bg-gradient-to-r',
      'from-pink-500',
      'to-red-500',
      'text-white',
      'hover:from-pink-600',
      'hover:to-red-600',
      'focus:ring-pink-500/50',
      'shadow-lg',
      'hover:shadow-xl',
    ],
    ghost: [
      'text-white/80',
      'hover:text-white',
      'hover:bg-white/10',
      'focus:ring-white/30',
    ],
    outline: [
      'border-2',
      'border-current',
      'text-white',
      'hover:bg-white/10',
      'focus:ring-white/30',
    ],
    danger: [
      'bg-red-500',
      'text-white',
      'hover:bg-red-600',
      'focus:ring-red-500/50',
    ],
    success: [
      'bg-green-500',
      'text-white',
      'hover:bg-green-600',
      'focus:ring-green-500/50',
    ],
  };

  const sizes = {
    xs: ['px-2', 'py-1', 'text-xs', 'gap-1'],
    sm: ['px-3', 'py-1.5', 'text-sm', 'gap-1.5'],
    md: ['px-4', 'py-2', 'text-sm', 'gap-2'],
    lg: ['px-6', 'py-3', 'text-base', 'gap-2'],
    xl: ['px-8', 'py-4', 'text-lg', 'gap-3'],
  };

  const combinedClasses = [
    ...baseClasses,
    ...(variants[variant] || variants.primary),
    ...(sizes[size] || sizes.md),
    ...(className ? [className] : []),
  ].join(' ');

  const renderIcon = () => {
    if (loading) {
      return (
        <svg
          className="h-4 w-4 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      );
    }

    if (icon) {
      return React.cloneElement(icon, {
        className: `h-4 w-4 ${icon.props.className || ''}`,
        'aria-hidden': true,
      });
    }

    return null;
  };

  const iconElement = renderIcon();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={combinedClasses}
      aria-busy={loading}
      {...props}
    >
      {iconElement && iconPosition === 'left' && iconElement}
      {children && (
        <span className={loading ? 'opacity-75' : ''}>{children}</span>
      )}
      {iconElement && iconPosition === 'right' && iconElement}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'accent',
    'ghost',
    'outline',
    'danger',
    'success',
  ]),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  icon: PropTypes.element,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
};

export default Button;
