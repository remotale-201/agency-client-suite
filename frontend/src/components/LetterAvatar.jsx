import React from 'react';

const AVATAR_COLORS = [
  '#4F46E5', // Indigo
  '#2563EB', // Blue
  '#7C3AED', // Violet
  '#0D9488', // Teal
  '#059669', // Emerald
  '#D97706', // Amber
  '#E11D48', // Rose
  '#0F172A'  // Slate dark
];

export default function LetterAvatar({
  name = 'User',
  size = 32,
  bg,
  color = '#FFFFFF',
  style = {},
  className = ''
}) {
  const cleanName = (name && typeof name === 'string' && name.trim()) ? name.trim() : 'U';
  const initial = cleanName.charAt(0).toUpperCase();

  // Deterministic pleasant color selection based on name
  let charSum = 0;
  for (let i = 0; i < cleanName.length; i++) {
    charSum += cleanName.charCodeAt(i);
  }
  const pickedBg = bg || AVATAR_COLORS[charSum % AVATAR_COLORS.length];
  const fontSize = Math.max(10, Math.round(size * 0.42));

  return (
    <div
      className={`remotale-letter-avatar ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        borderRadius: '50%',
        background: pickedBg,
        color: color,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: `${fontSize}px`,
        lineHeight: 1,
        textTransform: 'uppercase',
        userSelect: 'none',
        flexShrink: 0,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        letterSpacing: '0.02em',
        ...style
      }}
      title={cleanName}
    >
      {initial}
    </div>
  );
}
