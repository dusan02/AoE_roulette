// ============================================================
// AoE IV Roulette – InlineNameEditor
// Click the player name to edit it directly in the slot machine
// ============================================================

import { useState, useRef } from 'react';
import type { CSSProperties } from 'react';

interface InlineNameEditorProps {
  value: string;
  onChange: (v: string) => void;
  /** Tailwind class for base color (used when no colorHex) */
  colorClass?: string;
  /** Hex color applied via inline style — overrides colorClass */
  colorHex?: string;
  disabled?: boolean;
}

export function InlineNameEditor({
  value, onChange, colorClass = '', colorHex, disabled,
}: InlineNameEditorProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const startEdit = () => {
    if (disabled) return;
    setDraft(value);
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const commit = () => {
    onChange(draft.trim() || value);
    setEditing(false);
  };

  const textStyle: CSSProperties = {
    color: colorHex,
    transition: 'color 0.6s ease',
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={draft}
        maxLength={20}
        autoFocus
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') setEditing(false);
        }}
        style={textStyle}
        className={`text-center text-[11px] font-cinzel font-bold tracking-widest uppercase
          bg-transparent border-b border-current outline-none pb-0.5 min-w-[80px] ${colorClass}`}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={startEdit}
      title="Click to edit name"
      style={textStyle}
      className={`text-center text-[11px] font-cinzel font-bold tracking-widest uppercase
        hover:opacity-70 cursor-text min-w-[80px]
        ${colorClass} ${disabled ? 'cursor-default opacity-60' : ''}`}
    >
      {value}
    </button>
  );
}
