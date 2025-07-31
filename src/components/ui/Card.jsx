import React from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable Card component with glass morphism design
 */
const Card = ({
    children,
    title,
    subtitle,
    headerAction,
    className = '',
    bodyClassName = '',
    variant = 'default',
    hoverable = true,
    ...props
}) => {
    const baseClasses = [
        'rounded-2xl',
        'border',
        'border-white/10',
        'backdrop-filter',
        'backdrop-blur-xl',
        'transition-all',
        'duration-300',
        'ease-out'
    ];

    const variants = {
        default: [
            'bg-white/5',
            'shadow-lg'
        ],
        glass: [
            'bg-white/10',
            'shadow-xl'
        ],
        solid: [
            'bg-gray-900/90',
            'shadow-2xl'
        ],
        gradient: [
            'bg-gradient-to-br',
            'from-white/10',
            'to-white/5',
            'shadow-xl'
        ]
    };

    const hoverClasses = hoverable ? [
        'hover:bg-white/8',
        'hover:border-white/20',
        'hover:shadow-2xl',
        'hover:transform',
        'hover:-translate-y-1'
    ] : [];

    const combinedClasses = [
        ...baseClasses,
        ...(variants[variant] || variants.default),
        ...hoverClasses,
        ...(className ? [className] : [])
    ].join(' ');

    const bodyClasses = [
        'p-6',
        ...(bodyClassName ? [bodyClassName] : [])
    ].join(' ');

    return (
        <div className={combinedClasses} {...props}>
            {(title || subtitle || headerAction) && (
                <div className="px-6 pt-6 pb-4 border-b border-white/10">
                    <div className="flex items-start justify-between">
                        <div>
                            {title && (
                                <h3 className="text-xl font-semibold text-white mb-1">
                                    {title}
                                </h3>
                            )}
                            {subtitle && (
                                <p className="text-sm text-white/60">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                        {headerAction && (
                            <div className="ml-4 flex-shrink-0">
                                {headerAction}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className={bodyClasses}>
                {children}
            </div>
        </div>
    );
};

Card.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    headerAction: PropTypes.node,
    className: PropTypes.string,
    bodyClassName: PropTypes.string,
    variant: PropTypes.oneOf(['default', 'glass', 'solid', 'gradient']),
    hoverable: PropTypes.bool
};

export default Card;
