import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Compass } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/lib/i18n';

export default function Header() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const navItems = [
    { href: '/careers',   label: t.nav.careers   },
    { href: '/colleges',  label: t.nav.colleges  },
    { href: '/classes',   label: t.nav.classes   },
    { href: '/dashboard', label: t.nav.dashboard },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Compass size={16} className="text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
              PathwayIQ
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === item.href
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA + Language switcher */}
          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher />
            <Button asChild size="sm" className="rounded-lg">
              <Link to="/quiz">{t.quiz.startBtn}</Link>
            </Button>
          </div>

          {/* Mobile: language + toggle */}
          <div className="md:hidden flex items-center gap-1">
            <LanguageSwitcher />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-muted rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary py-2 px-2 rounded-md hover:bg-muted ${
                    location.pathname === item.href
                      ? 'text-foreground bg-muted'
                      : 'text-muted-foreground'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-border mt-2">
                <Button asChild size="sm" className="w-full rounded-lg">
                  <Link to="/quiz" onClick={() => setIsMobileMenuOpen(false)}>
                    {t.quiz.startBtn}
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
