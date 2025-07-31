import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { selectPalette } from '../../../store/slices/paletteSlice';

/**
 * Live design preview showing colors in real UI contexts
 */
function DesignPreview() {
    const palette = useSelector(selectPalette);
    const [activeDesign, setActiveDesign] = useState('website');

    const designs = {
        website: {
            name: 'Website Header',
            icon: '🌐',
            component: WebsitePreview,
        },
        mobile: {
            name: 'Mobile App',
            icon: '📱',
            component: MobileAppPreview,
        },
        dashboard: {
            name: 'Dashboard',
            icon: '📊',
            component: DashboardPreview,
        },
        card: {
            name: 'Product Card',
            icon: '🛍️',
            component: ProductCardPreview,
        },
    };

    if (!palette.colors || palette.colors.length === 0) {
        return (
            <Card title="Design Preview" subtitle="See your colors in real UI designs">
                <div className="text-center py-8 text-white/60">
                    <div className="text-4xl mb-4">🎨</div>
                    <p>Generate colors to see design previews</p>
                </div>
            </Card>
        );
    }

    const ActiveComponent = designs[activeDesign].component;

    return (
        <Card title="Design Preview" subtitle="See your palette in real-world designs">
            <div className="space-y-6">
                {/* Design Type Selector */}
                <div className="flex flex-wrap gap-2">
                    {Object.entries(designs).map(([key, design]) => (
                        <button
                            key={key}
                            onClick={() => setActiveDesign(key)}
                            className={`px-3 py-2 rounded-lg text-sm transition-all ${activeDesign === key
                                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                                    : 'bg-white/5 text-white/70 border border-white/20 hover:bg-white/10'
                                }`}
                        >
                            <span className="mr-2">{design.icon}</span>
                            {design.name}
                        </button>
                    ))}
                </div>

                {/* Live Preview */}
                <div className="border border-white/20 rounded-lg overflow-hidden">
                    <ActiveComponent colors={palette.colors} />
                </div>

                {/* Color Usage Guide */}
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3">
                    <h5 className="text-sm font-medium text-indigo-400 mb-2">💡 Design Tips</h5>
                    <ul className="text-xs text-indigo-300/80 space-y-1">
                        <li>• Use the darkest color for text and primary elements</li>
                        <li>• Brightest colors work well for call-to-action buttons</li>
                        <li>• Medium tones are perfect for backgrounds and cards</li>
                        <li>• Ensure sufficient contrast for accessibility</li>
                    </ul>
                </div>
            </div>
        </Card>
    );
}

// Website Header Preview
function WebsitePreview({ colors }) {
    const [primary, secondary, accent, background, text] = colors.slice(0, 5);

    return (
        <div className="bg-white min-h-64">
            {/* Header */}
            <header style={{ backgroundColor: primary || '#000' }}>
                <div className="px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <div
                            className="w-8 h-8 rounded"
                            style={{ backgroundColor: accent || secondary || '#fff' }}
                        />
                        <h1 className="text-xl font-bold" style={{ color: text || '#fff' }}>
                            Your Brand
                        </h1>
                    </div>
                    <nav className="flex space-x-6">
                        {['Home', 'About', 'Services', 'Contact'].map((item) => (
                            <a
                                key={item}
                                href="#"
                                className="hover:opacity-80 transition-opacity"
                                style={{ color: text || '#fff' }}
                            >
                                {item}
                            </a>
                        ))}
                    </nav>
                    <button
                        className="px-4 py-2 rounded font-medium transition-colors hover:opacity-90"
                        style={{
                            backgroundColor: accent || secondary || '#fff',
                            color: primary || '#000',
                        }}
                    >
                        Get Started
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <section
                className="px-6 py-12"
                style={{ backgroundColor: background || secondary || '#f5f5f5' }}
            >
                <div className="max-w-4xl mx-auto text-center">
                    <h2
                        className="text-3xl font-bold mb-4"
                        style={{ color: primary || '#000' }}
                    >
                        Welcome to Our Amazing Service
                    </h2>
                    <p
                        className="text-lg mb-6"
                        style={{ color: text || primary || '#666' }}
                    >
                        Discover how our innovative solutions can transform your business
                        and drive success like never before.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <button
                            className="px-6 py-3 rounded font-medium transition-colors hover:opacity-90"
                            style={{
                                backgroundColor: primary || '#000',
                                color: background || '#fff',
                            }}
                        >
                            Learn More
                        </button>
                        <button
                            className="px-6 py-3 rounded border-2 font-medium transition-colors hover:opacity-80"
                            style={{
                                borderColor: primary || '#000',
                                color: primary || '#000',
                                backgroundColor: 'transparent',
                            }}
                        >
                            Watch Demo
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

// Mobile App Preview
function MobileAppPreview({ colors }) {
    const [primary, secondary, accent, background, text] = colors.slice(0, 5);

    return (
        <div className="bg-gray-100 flex justify-center py-8">
            <div
                className="w-64 h-96 rounded-3xl shadow-2xl overflow-hidden"
                style={{ backgroundColor: background || '#fff' }}
            >
                {/* Status Bar */}
                <div
                    className="h-8 flex justify-between items-center px-4 text-xs"
                    style={{ backgroundColor: primary || '#000', color: '#fff' }}
                >
                    <span>9:41</span>
                    <span>100% 📶</span>
                </div>

                {/* Header */}
                <div
                    className="p-4 flex justify-between items-center"
                    style={{ backgroundColor: primary || '#000' }}
                >
                    <h1 className="text-lg font-bold" style={{ color: '#fff' }}>
                        My App
                    </h1>
                    <div
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: accent || '#fff' }}
                    />
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: 'Balance', value: '$2,840' },
                            { label: 'Spent', value: '$890' },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="p-3 rounded-lg"
                                style={{ backgroundColor: secondary || '#f0f0f0' }}
                            >
                                <p
                                    className="text-xs"
                                    style={{ color: text || primary || '#666' }}
                                >
                                    {stat.label}
                                </p>
                                <p
                                    className="text-lg font-bold"
                                    style={{ color: primary || '#000' }}
                                >
                                    {stat.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Action Button */}
                    <button
                        className="w-full py-3 rounded-lg font-medium"
                        style={{
                            backgroundColor: accent || primary || '#000',
                            color: '#fff',
                        }}
                    >
                        Send Money
                    </button>

                    {/* Transaction List */}
                    <div className="space-y-2">
                        <h3
                            className="font-medium"
                            style={{ color: primary || '#000' }}
                        >
                            Recent Transactions
                        </h3>
                        {['Coffee Shop', 'Gas Station', 'Online Store'].map((item) => (
                            <div
                                key={item}
                                className="flex justify-between items-center p-2 rounded"
                                style={{ backgroundColor: background || '#f9f9f9' }}
                            >
                                <span style={{ color: text || '#333' }}>{item}</span>
                                <span
                                    className="font-medium"
                                    style={{ color: primary || '#000' }}
                                >
                                    -$12.50
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Dashboard Preview
function DashboardPreview({ colors }) {
    const [primary, secondary, accent, background, text] = colors.slice(0, 5);

    return (
        <div
            className="min-h-64 p-4"
            style={{ backgroundColor: background || '#f5f5f5' }}
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1
                    className="text-2xl font-bold"
                    style={{ color: primary || '#000' }}
                >
                    Analytics Dashboard
                </h1>
                <div className="flex space-x-2">
                    <button
                        className="px-4 py-2 rounded text-sm"
                        style={{
                            backgroundColor: secondary || '#e0e0e0',
                            color: text || '#333',
                        }}
                    >
                        Export
                    </button>
                    <button
                        className="px-4 py-2 rounded text-sm"
                        style={{
                            backgroundColor: primary || '#000',
                            color: '#fff',
                        }}
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Total Users', value: '12,456', change: '+12%' },
                    { label: 'Revenue', value: '$45,230', change: '+8%' },
                    { label: 'Orders', value: '1,234', change: '+15%' },
                    { label: 'Conversion', value: '3.2%', change: '+2%' },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className="p-4 rounded-lg border"
                        style={{
                            backgroundColor: '#fff',
                            borderColor: secondary || '#e0e0e0',
                        }}
                    >
                        <p
                            className="text-sm"
                            style={{ color: text || '#666' }}
                        >
                            {stat.label}
                        </p>
                        <p
                            className="text-2xl font-bold"
                            style={{ color: primary || '#000' }}
                        >
                            {stat.value}
                        </p>
                        <p
                            className="text-sm"
                            style={{ color: accent || '#00a854' }}
                        >
                            {stat.change}
                        </p>
                    </div>
                ))}
            </div>

            {/* Chart Area */}
            <div
                className="p-6 rounded-lg border"
                style={{
                    backgroundColor: '#fff',
                    borderColor: secondary || '#e0e0e0',
                }}
            >
                <h3
                    className="text-lg font-medium mb-4"
                    style={{ color: primary || '#000' }}
                >
                    Revenue Trend
                </h3>
                <div className="h-32 flex items-end space-x-2">
                    {[65, 45, 78, 52, 89, 67, 91, 45, 67, 89, 76, 88].map((height, i) => (
                        <div
                            key={i}
                            className="flex-1 rounded-t"
                            style={{
                                height: `${height}%`,
                                backgroundColor: i % 3 === 0 ? primary : i % 3 === 1 ? secondary : accent || '#ddd',
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

// Product Card Preview
function ProductCardPreview({ colors }) {
    const [primary, secondary, accent, background, text] = colors.slice(0, 5);

    return (
        <div
            className="p-8 flex justify-center"
            style={{ backgroundColor: background || '#f5f5f5' }}
        >
            <div
                className="w-72 rounded-xl shadow-lg overflow-hidden"
                style={{ backgroundColor: '#fff' }}
            >
                {/* Product Image */}
                <div
                    className="h-48 flex items-center justify-center"
                    style={{ backgroundColor: secondary || '#f0f0f0' }}
                >
                    <div
                        className="w-24 h-24 rounded-lg flex items-center justify-center text-2xl"
                        style={{ backgroundColor: accent || primary || '#ddd' }}
                    >
                        📱
                    </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                        <h3
                            className="text-lg font-bold"
                            style={{ color: primary || '#000' }}
                        >
                            Premium Smartphone
                        </h3>
                        <span
                            className="text-xs px-2 py-1 rounded"
                            style={{
                                backgroundColor: accent || '#e8f5e8',
                                color: primary || '#000',
                            }}
                        >
                            New
                        </span>
                    </div>

                    <p
                        className="text-sm mb-4"
                        style={{ color: text || '#666' }}
                    >
                        Latest technology with amazing features and sleek design.
                        Perfect for professionals.
                    </p>

                    <div className="flex justify-between items-center mb-4">
                        <span
                            className="text-2xl font-bold"
                            style={{ color: primary || '#000' }}
                        >
                            $899
                        </span>
                        <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    style={{ color: accent || '#ffd700' }}
                                >
                                    ⭐
                                </span>
                            ))}
                            <span
                                className="text-xs ml-1"
                                style={{ color: text || '#666' }}
                            >
                                (124)
                            </span>
                        </div>
                    </div>

                    <div className="flex space-x-2">
                        <button
                            className="flex-1 py-2 rounded font-medium"
                            style={{
                                backgroundColor: primary || '#000',
                                color: '#fff',
                            }}
                        >
                            Add to Cart
                        </button>
                        <button
                            className="px-4 py-2 rounded border-2"
                            style={{
                                borderColor: primary || '#000',
                                color: primary || '#000',
                                backgroundColor: 'transparent',
                            }}
                        >
                            ♡
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DesignPreview;
