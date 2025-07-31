import React, { useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { ColorUtils } from '../../utils/colorUtils';

/**
 * Enhanced ColorPicker component with validation and accessibility
 */
function ColorPicker({
  value = '#000000',
  onChange,
  label,
  disabled = false,
  locked = false,
  onToggleLock,
  showHex = true,
  showLockButton = false,
  size = 'md',
  className = '',
  ...props
}) {
  const [inputValue, setInputValue] = useState(value);
  const [isValid, setIsValid] = useState(true);
  const colorInputRef = useRef(null);
  const textInputRef = useRef(null);

  // Handle color input change
  const handleColorChange = useCallback((event) => {
    const newColor = event.target.value;
    setInputValue(newColor);
    setIsValid(true);

    if (onChange) {
      onChange(newColor);
    }
  },
    [onChange],
  );

  // Handle text input change with validation
  const handleTextChange = useCallback((event) => {
    const newValue = event.target.value;
    setInputValue(newValue);

    // Validate color format
    const valid = ColorUtils.isValidColor(newValue);
    setIsValid(valid);

    if (valid && onChange) {
      onChange(newValue);
    }
  },
    [onChange],
  );

  // Handle text input blur - revert to last valid value if invalid
  const handleTextBlur = useCallback(() => {
    if (!isValid) {
      setInputValue(value);
      setIsValid(true);
    }
  }, [isValid, value]);

  // Handle lock toggle
  const handleLockToggle = useCallback(() => {
    if (onToggleLock) {
      onToggleLock();
    }
  }, [onToggleLock]);

  // Sync internal state with prop value
  React.useEffect(() => {
    if (value !== inputValue && ColorUtils.isValidColor(value)) {
      setInputValue(value);
      setIsValid(true);
    }
  }, [value, inputValue]);

  const sizes = {
    sm: {
      picker: 'w-10 h-10',
      text: 'text-xs px-2 py-1',
      lock: 'w-6 h-6 text-xs',
    },
    md: {
      picker: 'w-12 h-12',
      text: 'text-sm px-3 py-2',
      lock: 'w-8 h-8 text-sm',
    },
    lg: {
      picker: 'w-16 h-16',
      text: 'text-base px-4 py-3',
      lock: 'w-10 h-10 text-base',
    }
  };

  const sizeClasses = sizes[size] || sizes.md;

  const containerClasses = [
    'color-picker',
    'flex',
    'flex-col',
    'gap-2',
    ...(className ? [className] : []),
  ].join(' ');

  const pickerClasses = [
    sizeClasses.picker,
    'rounded-xl',
    'border-2',
    'border-white/20',
    'cursor-pointer',
    'transition-all',
    'duration-300',
    'hover:scale-105',
    'hover:border-white/40',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-blue-500/50',
    'focus:border-blue-500/50',
    ...(disabled ? ['opacity-50', 'cursor-not-allowed', 'hover:scale-100'] : []),
    ...(locked ? ['ring-2', 'ring-yellow-400/50'] : []),
  ].join(' ');

  const textClasses = [
    sizeClasses.text,
    'bg-white/10',
    'border',
    'border-white/20',
    'rounded-lg',
    'text-white',
    'font-mono',
    'transition-all',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-blue-500/50',
    'focus:border-blue-500/50',
    'placeholder-white/40',
    ...(disabled ? ['opacity-50', 'cursor-not-allowed'] : []),
    ...(locked ? ['cursor-not-allowed'] : []),
    ...(!isValid ? ['border-red-500/50', 'ring-2', 'ring-red-500/20'] : []),
  ].join(' ');

  const lockButtonClasses = [
    sizeClasses.lock,
    'flex',
    'items-center',
    'justify-center',
    'rounded-lg',
    'border',
    'border-white/20',
    'bg-white/10',
    'text-white/70',
    'transition-all',
    'duration-200',
    'hover:bg-white/20',
    'hover:text-white',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-blue-500/50',
    ...(locked ? ['bg-yellow-400/20', 'border-yellow-400/50', 'text-yellow-400'] : []),
  ].join(' ');

  return (
    <div className={containerClasses}>
      {label && (
        <label className="block text-sm font-medium text-white/80 mb-1">
          {label}
          {locked && <span className="ml-1 text-yellow-400">🔒</span>}
        </label>
      )}

      <div className="flex items-center gap-3">
        {/* Color Input */}
        <div className="relative">
          <input
            ref={colorInputRef}
            type="color"
            value={inputValue}
            onChange={handleColorChange}
            disabled={disabled || locked}
            className={pickerClasses}
            aria-label={label ? `${label} color picker` : 'Color picker'}
            {...props}
          />
          {locked && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl pointer-events-none">
              <span className="text-yellow-400 text-lg">🔒</span>
            </div>
          )}
        </div>

        {/* Text Input */}
        {showHex && (
          <div className="flex-1">
            <input
              ref={textInputRef}
              type="text"
              value={inputValue}
              onChange={handleTextChange}
              onBlur={handleTextBlur}
              disabled={disabled || locked}
              placeholder="#000000"
              className={textClasses}
              aria-label={label ? `${label} hex code` : 'Hex color code'}
              pattern="^#[0-9A-Fa-f]{6}$"
              maxLength={7}
            />
            {!isValid && (
              <p className="mt-1 text-xs text-red-400">
                Invalid color format
              </p>
            )}
          </div>
        )}

        {/* Lock Button */}
        {showLockButton && onToggleLock && (
          <button
            type="button"
            onClick={handleLockToggle}
            disabled={disabled}
            className={lockButtonClasses}
            aria-label={locked ? 'Unlock color' : 'Lock color'}
            title={locked ? 'Click to unlock this color' : 'Click to lock this color during randomization'}
          >
            {locked ? '🔒' : '🔓'}
          </button>
        )}
      </div>
    </div>
  );
}

ColorPicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  locked: PropTypes.bool,
  onToggleLock: PropTypes.func,
  showHex: PropTypes.bool,
  showLockButton: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};

export default ColorPicker;
