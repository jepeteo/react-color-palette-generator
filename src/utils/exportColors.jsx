const exportPalette = (palette, format = 'json') => {
  console.log(palette);
  let content = '';
  let filename = `palette.${format}`;

  switch (format) {
    case 'json':
      content = JSON.stringify(palette, null, 2);
      break;
    case 'css':
      content = Object.entries(palette)
        .map(([key, value]) => `--color-${key}: ${value};`)
        .join('\n');
      break;
    case 'scss':
      content = Object.entries(palette)
        .map(([key, value]) => `$color-${key}: ${value};`)
        .join('\n');
      break;
    default:
      throw new Error('Unsupported format');
  }

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default exportPalette;
