import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Card from '../../ui/Card';
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
      <Card
        title="Design Preview"
        subtitle="See your colors in real UI designs"
      >
        <div className="py-8 text-center text-white/60">
          <div className="mb-4 text-4xl">🎨</div>
          <p>Generate colors to see design previews</p>
        </div>
      </Card>
    );
  }

  const ActiveComponent = designs[activeDesign].component;

  return (
    <Card
      title="Design Preview"
      subtitle="See your palette in real-world designs"
    >
      <div className="space-y-6">
        {/* Design Type Selector */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(designs).map(([key, design]) => (
            <button
              key={key}
              onClick={() => setActiveDesign(key)}
              className={`rounded-lg px-3 py-2 text-sm transition-all ${
                activeDesign === key
                  ? 'border border-blue-500/50 bg-blue-500/20 text-blue-300'
                  : 'border border-white/20 bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              <span className="mr-2">{design.icon}</span>
              {design.name}
            </button>
          ))}
        </div>

        {/* Live Preview */}
        <div className="overflow-hidden rounded-lg border border-white/20">
          <ActiveComponent colors={palette.colors} />
        </div>

        {/* Color Usage Guide */}
        <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-3">
          <h5 className="mb-2 text-sm font-medium text-indigo-400">
            💡 Design Tips
          </h5>
          <ul className="space-y-1 text-xs text-indigo-300/80">
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
    <div className="min-h-64 bg-white">
      {/* Header */}
      <header style={{ backgroundColor: primary || '#000' }}>
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div
              className="h-8 w-8 rounded"
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
                className="transition-opacity hover:opacity-80"
                style={{ color: text || '#fff' }}
              >
                {item}
              </a>
            ))}
          </nav>
          <button
            className="rounded px-4 py-2 font-medium transition-colors hover:opacity-90"
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
        <div className="mx-auto max-w-4xl text-center">
          <h2
            className="mb-4 text-3xl font-bold"
            style={{ color: primary || '#000' }}
          >
            Welcome to Our Amazing Service
          </h2>
          <p
            className="mb-6 text-lg"
            style={{ color: text || primary || '#666' }}
          >
            Discover how our innovative solutions can transform your business
            and drive success like never before.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              className="rounded px-6 py-3 font-medium transition-colors hover:opacity-90"
              style={{
                backgroundColor: primary || '#000',
                color: background || '#fff',
              }}
            >
              Learn More
            </button>
            <button
              className="rounded border-2 px-6 py-3 font-medium transition-colors hover:opacity-80"
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
    <div className="flex justify-center bg-gray-100 py-8">
      <div
        className="h-96 w-64 overflow-hidden rounded-3xl shadow-2xl"
        style={{ backgroundColor: background || '#fff' }}
      >
        {/* Status Bar */}
        <div
          className="flex h-8 items-center justify-between px-4 text-xs"
          style={{ backgroundColor: primary || '#000', color: '#fff' }}
        >
          <span>9:41</span>
          <span>100% 📶</span>
        </div>

        {/* Header */}
        <div
          className="flex items-center justify-between p-4"
          style={{ backgroundColor: primary || '#000' }}
        >
          <h1 className="text-lg font-bold" style={{ color: '#fff' }}>
            My App
          </h1>
          <div
            className="h-8 w-8 rounded-full"
            style={{ backgroundColor: accent || '#fff' }}
          />
        </div>

        {/* Content */}
        <div className="space-y-4 p-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Balance', value: '$2,840' },
              { label: 'Spent', value: '$890' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg p-3"
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
            className="w-full rounded-lg py-3 font-medium"
            style={{
              backgroundColor: accent || primary || '#000',
              color: '#fff',
            }}
          >
            Send Money
          </button>

          {/* Transaction List */}
          <div className="space-y-2">
            <h3 className="font-medium" style={{ color: primary || '#000' }}>
              Recent Transactions
            </h3>
            {['Coffee Shop', 'Gas Station', 'Online Store'].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded p-2"
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
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: primary || '#000' }}>
          Analytics Dashboard
        </h1>
        <div className="flex space-x-2">
          <button
            className="rounded px-4 py-2 text-sm"
            style={{
              backgroundColor: secondary || '#e0e0e0',
              color: text || '#333',
            }}
          >
            Export
          </button>
          <button
            className="rounded px-4 py-2 text-sm"
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
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          { label: 'Total Users', value: '12,456', change: '+12%' },
          { label: 'Revenue', value: '$45,230', change: '+8%' },
          { label: 'Orders', value: '1,234', change: '+15%' },
          { label: 'Conversion', value: '3.2%', change: '+2%' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border p-4"
            style={{
              backgroundColor: '#fff',
              borderColor: secondary || '#e0e0e0',
            }}
          >
            <p className="text-sm" style={{ color: text || '#666' }}>
              {stat.label}
            </p>
            <p
              className="text-2xl font-bold"
              style={{ color: primary || '#000' }}
            >
              {stat.value}
            </p>
            <p className="text-sm" style={{ color: accent || '#00a854' }}>
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Chart Area */}
      <div
        className="rounded-lg border p-6"
        style={{
          backgroundColor: '#fff',
          borderColor: secondary || '#e0e0e0',
        }}
      >
        <h3
          className="mb-4 text-lg font-medium"
          style={{ color: primary || '#000' }}
        >
          Revenue Trend
        </h3>
        <div className="flex h-32 items-end space-x-2">
          {[65, 45, 78, 52, 89, 67, 91, 45, 67, 89, 76, 88].map((height, i) => (
            <div
              key={i}
              className="flex-1 rounded-t"
              style={{
                height: `${height}%`,
                backgroundColor:
                  i % 3 === 0
                    ? primary
                    : i % 3 === 1
                      ? secondary
                      : accent || '#ddd',
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
      className="flex justify-center p-8"
      style={{ backgroundColor: background || '#f5f5f5' }}
    >
      <div
        className="w-72 overflow-hidden rounded-xl shadow-lg"
        style={{ backgroundColor: '#fff' }}
      >
        {/* Product Image */}
        <div
          className="flex h-48 items-center justify-center"
          style={{ backgroundColor: secondary || '#f0f0f0' }}
        >
          <div
            className="flex h-24 w-24 items-center justify-center rounded-lg text-2xl"
            style={{ backgroundColor: accent || primary || '#ddd' }}
          >
            📱
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6">
          <div className="mb-2 flex items-start justify-between">
            <h3
              className="text-lg font-bold"
              style={{ color: primary || '#000' }}
            >
              Premium Smartphone
            </h3>
            <span
              className="rounded px-2 py-1 text-xs"
              style={{
                backgroundColor: accent || '#e8f5e8',
                color: primary || '#000',
              }}
            >
              New
            </span>
          </div>

          <p className="mb-4 text-sm" style={{ color: text || '#666' }}>
            Latest technology with amazing features and sleek design. Perfect
            for professionals.
          </p>

          <div className="mb-4 flex items-center justify-between">
            <span
              className="text-2xl font-bold"
              style={{ color: primary || '#000' }}
            >
              $899
            </span>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} style={{ color: accent || '#ffd700' }}>
                  ⭐
                </span>
              ))}
              <span className="ml-1 text-xs" style={{ color: text || '#666' }}>
                (124)
              </span>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              className="flex-1 rounded py-2 font-medium"
              style={{
                backgroundColor: primary || '#000',
                color: '#fff',
              }}
            >
              Add to Cart
            </button>
            <button
              className="rounded border-2 px-4 py-2"
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
