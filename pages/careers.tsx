import { useState, useMemo } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion } from 'motion/react';
import {
  Briefcase,
  Code2,
  Palette,
  Users,
  DollarSign,
  Heart,
  GraduationCap,
  TrendingUp,
  Search,
  SlidersHorizontal,
  ChevronRight,
  Bookmark,
  Star,
  Compass,
  ArrowRight,
  Microscope,
  Scale,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useProfile } from '@/lib/profile-context';
import { careers, computeCareerFit, type CareerCluster } from '@/lib/careers-data';
import { useLanguage } from '@/lib/i18n';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const clusterIcon: Record<CareerCluster, React.ElementType> = {
  STEM:       Code2,
  Business:   Briefcase,
  Creative:   Palette,
  Social:     Users,
  Healthcare: Heart,
  Law:        Scale,
  Science:    Microscope,
  Hybrid:     Zap,
};

const clusterColor: Record<CareerCluster, string> = {
  STEM:       'bg-emerald-50 text-emerald-700',
  Business:   'bg-blue-50 text-blue-700',
  Creative:   'bg-purple-50 text-purple-700',
  Social:     'bg-teal-50 text-teal-700',
  Healthcare: 'bg-rose-50 text-rose-700',
  Law:        'bg-amber-50 text-amber-700',
  Science:    'bg-cyan-50 text-cyan-700',
  Hybrid:     'bg-lime-50 text-lime-700',
};

function matchColor(score: number) {
  if (score >= 80) return 'bg-emerald-100 text-emerald-700';
  if (score >= 65) return 'bg-teal-100 text-teal-700';
  return 'bg-muted text-muted-foreground';
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.35, delay: i * 0.03, ease: 'easeOut' as const },
  }),
};

const filterTabs: Array<{ id: string; label: string }> = [
  { id: 'all',        label: 'All Careers'  },
  { id: 'STEM',       label: 'STEM / Tech'  },
  { id: 'Business',   label: 'Business'     },
  { id: 'Creative',   label: 'Creative'     },
  { id: 'Social',     label: 'Social'       },
  { id: 'Healthcare', label: 'Healthcare'   },
  { id: 'Law',        label: 'Law / Gov'    },
  { id: 'Science',    label: 'Science'      },
  { id: 'Hybrid',     label: 'Hybrid'       },
];

// Cluster tab labels use English identifiers (data-driven) — only "All" is translated

// ─── Career Card ──────────────────────────────────────────────────────────────

function CareerCard({
  career,
  fit,
  saved,
  onToggleSave,
  index,
}: {
  career: (typeof careers)[0];
  fit: number;
  saved: boolean;
  onToggleSave: () => void;
  index: number;
}) {
  const Icon = clusterIcon[career.cluster];
  const colorClass = clusterColor[career.cluster];
  const { t } = useLanguage();

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={index}>
      <Card className={cn(
        'h-full border shadow-sm hover:shadow-md transition-all duration-200 group',
        fit >= 80 ? 'border-primary/30' : 'border-border',
      )}>
        {fit >= 80 && <div className="h-1 w-full bg-primary rounded-t-xl" />}
        <CardContent className="pt-5 pb-5 px-5 flex flex-col h-full">

          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', colorClass)}>
                <Icon size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">
                  {t.careerTitles[career.id] ?? career.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">{career.field}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className={cn('rounded-full px-2.5 py-1 text-xs font-bold', matchColor(fit))}>
                {fit}% fit
              </span>
              <button
                onClick={onToggleSave}
                className="p-1 rounded-md hover:bg-muted transition-colors"
                aria-label={saved ? 'Unsave' : 'Save'}
              >
                <Bookmark size={14} className={saved ? 'text-primary fill-primary' : 'text-muted-foreground'} />
              </button>
            </div>
          </div>

          {/* Cluster badge */}
          <div className="mb-3">
            <span className={cn('rounded-full px-2.5 py-0.5 text-[10px] font-semibold', colorClass)}>
              {career.cluster}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">
            {t.careerDescriptions[career.id] ?? career.description}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { icon: DollarSign,    label: t.careers.salary,    value: career.salary     },
              { icon: TrendingUp,    label: t.careers.growth,    value: career.growth     },
              { icon: GraduationCap, label: t.careers.education, value: career.education  },
            ].map(({ icon: StatIcon, label, value }) => (
              <div key={label} className="rounded-lg bg-muted/40 px-2 py-2 text-center">
                <StatIcon size={11} className="mx-auto mb-1 text-primary" />
                <p className="text-[10px] text-muted-foreground">{label}</p>
                <p className="text-[10px] font-semibold text-foreground leading-tight mt-0.5">{value}</p>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
              {t.careers.skills}
            </p>
            <div className="flex flex-wrap gap-1">
              {career.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-[10px] px-2 py-0.5 rounded-full font-normal">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function CareersPage() {
  const { profile } = useProfile();
  const { t } = useLanguage();
  const [activeCluster, setActiveCluster] = useState('all');
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState<string[]>([]);

  // Compute fit scores for all careers
  const scored = useMemo(() => {
    return careers.map((c) => ({
      career: c,
      fit: profile
        ? computeCareerFit(c, profile.scores, profile.total)
        : 65,
    })).sort((a, b) => b.fit - a.fit);
  }, [profile]);

  const topMatch = scored[0];

  const filtered = useMemo(() => {
    return scored.filter(({ career }) => {
      const matchesCluster = activeCluster === 'all' || career.cluster === activeCluster;
      const q = search.toLowerCase();
      const matchesSearch = q === '' ||
        career.title.toLowerCase().includes(q) ||
        career.field.toLowerCase().includes(q) ||
        career.cluster.toLowerCase().includes(q) ||
        career.skills.some((s) => s.toLowerCase().includes(q));
      return matchesCluster && matchesSearch;
    });
  }, [scored, activeCluster, search]);

  function toggleSave(id: string) {
    setSaved((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  }

  return (
    <>
      <Helmet>
        <title>{t.careers.title} — PathwayIQ</title>
        <meta name="description" content={t.careers.subtitle} />
        <link rel="canonical" href="https://pathwayiq.com/careers" />
        <meta property="og:title" content={`${t.careers.title} — PathwayIQ`} />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Page header */}
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <Link to="/dashboard" className="hover:text-primary transition-colors">{t.dashboard.title}</Link>
              <ChevronRight size={12} />
              <span className="text-foreground font-medium">{t.nav.careers}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-1">{t.careers.title}</h1>
                <p className="text-muted-foreground text-sm">
                  {t.careers.subtitle}
                </p>
              </div>
              <Button asChild variant="outline" size="sm" className="rounded-lg gap-1.5 self-start sm:self-auto">
                <Link to="/quiz">
                  <SlidersHorizontal size={13} />
                  {t.quiz.retake}
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="bg-muted/20 min-h-screen">
        <div className="container mx-auto px-4 py-8">

          {/* No profile banner */}
          {!profile && (
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="mb-6">
              <Card className="border border-primary/20 bg-primary/5">
                <CardContent className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Compass size={16} className="text-primary" />
                    <span className="text-sm text-muted-foreground">
                      {t.dashboard.noProfile}
                    </span>
                  </div>
                  <Button asChild size="sm" className="rounded-lg gap-1.5 sm:ml-auto shrink-0">
                    <Link to="/quiz">{t.dashboard.takeQuiz} <ArrowRight size={13} /></Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Top match callout */}
          {profile && topMatch && (
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1} className="mb-6">
              <Card className="border border-primary/20 bg-primary/5">
                <CardContent className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Star size={16} className="text-primary fill-primary" />
                    <span className="text-sm font-semibold text-foreground">{t.careers.topMatch}</span>
                    <span className="text-sm text-primary font-bold">
                      {topMatch.career.title} — {topMatch.fit}% {t.common.match}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground sm:ml-auto">
                    {t.careers.basedOn.replace('{type}', profile.type)}
                  </span>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Search */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2} className="mb-5">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t.careers.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 rounded-xl"
              />
            </div>
          </motion.div>

          {/* Cluster filter */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="mb-6 flex flex-wrap gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCluster(tab.id)}
                className={cn(
                  'rounded-full px-4 py-1.5 text-sm font-medium transition-all border',
                  activeCluster === tab.id
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground',
                )}
              >
                {tab.id === 'all' ? t.careers.filterAll : tab.label}
              </button>
            ))}
          </motion.div>

          {/* Results count */}
          <p className="text-xs text-muted-foreground mb-4">
            {t.careers.showing.replace('{n}', String(filtered.length))}{filtered.length !== 1 ? 's' : ''}
            {activeCluster !== 'all' ? ` · ${activeCluster}` : ''}
            {search ? ` · "${search}"` : ''}
          </p>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Briefcase size={36} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">{t.careers.noResults}</p>
              <p className="text-sm mt-1">{t.careers.tryDifferent}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(({ career, fit }, i) => (
                <CareerCard
                  key={career.id}
                  career={career}
                  fit={fit}
                  saved={saved.includes(career.id)}
                  onToggleSave={() => toggleSave(career.id)}
                  index={i + 4}
                />
              ))}
            </div>
          )}

          {/* CTA */}
          <motion.div
            initial="hidden" animate="visible" variants={fadeUp}
            custom={filtered.length + 4}
            className="mt-10 text-center"
          >
            <p className="text-sm text-muted-foreground mb-3">{t.careers.moreResults}</p>
            <Button asChild className="rounded-xl">
              <Link to="/quiz">{t.careers.retakeQuiz}</Link>
            </Button>
          </motion.div>

        </div>
      </div>
    </>
  );
}
