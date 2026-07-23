import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                <Compass size={14} className="text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">PathwayIQ</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Personalized academic and career planning for high school students.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-12">
            <div>
              <p className="text-xs font-semibold text-foreground uppercase tracking-widest mb-3">Explore</p>
              <nav className="flex flex-col gap-2">
                {[
                  { href: '/careers', label: 'Careers' },
                  { href: '/colleges', label: 'Colleges' },
                  { href: '/classes', label: 'Classes' },
                ].map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground uppercase tracking-widest mb-3">Account</p>
              <nav className="flex flex-col gap-2">
                {[
                  { href: '/quiz', label: 'Take the Quiz' },
                  { href: '/dashboard', label: 'My Dashboard' },
                ].map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-muted-foreground">
            © {currentYear} PathwayIQ. All rights reserved.
          </p>
          <nav className="flex gap-4">
            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
