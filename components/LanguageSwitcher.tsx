/**
 * LanguageSwitcher — globe icon button that opens a dropdown with all 20 languages.
 * Tier 1 and Tier 2 are shown in separate groups.
 */

import { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage, LANGUAGES, type LangCode } from '@/lib/i18n';

export default function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = LANGUAGES.find(l => l.code === lang) ?? LANGUAGES[0];
  const tier1 = LANGUAGES.filter(l => l.tier === 1);
  const tier2 = LANGUAGES.filter(l => l.tier === 2);

  function pick(code: LangCode) {
    setLang(code);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        aria-label={t.langPicker.label}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <Globe size={15} className="shrink-0" />
        <span className="hidden sm:inline max-w-[80px] truncate">{current.label}</span>
        <ChevronDown size={13} className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 z-50 w-56 rounded-xl border border-border bg-card shadow-xl overflow-hidden"
          role="listbox"
          aria-label={t.langPicker.label}
        >
          {/* Tier 1 */}
          <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/50">
            {t.langPicker.tier1}
          </div>
          {tier1.map(l => (
            <LangOption key={l.code} meta={l} active={lang === l.code} onPick={pick} />
          ))}

          {/* Tier 2 */}
          <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/50 border-t border-border mt-0.5">
            {t.langPicker.tier2}
          </div>
          {tier2.map(l => (
            <LangOption key={l.code} meta={l} active={lang === l.code} onPick={pick} />
          ))}
        </div>
      )}
    </div>
  );
}

function LangOption({
  meta,
  active,
  onPick,
}: {
  meta: (typeof LANGUAGES)[number];
  active: boolean;
  onPick: (code: LangCode) => void;
}) {
  return (
    <button
      role="option"
      aria-selected={active}
      onClick={() => onPick(meta.code)}
      className={`w-full flex items-center justify-between px-3 py-2 text-sm transition-colors text-left
        ${active
          ? 'bg-primary/10 text-primary font-semibold'
          : 'text-foreground hover:bg-muted'
        }`}
    >
      <span>{meta.label}</span>
      {active && <Check size={13} className="text-primary shrink-0" />}
    </button>
  );
}
