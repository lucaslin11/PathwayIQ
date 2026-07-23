import { useState, useMemo } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion } from 'motion/react';
import {
  GraduationCap,
  MapPin,
  Users,
  DollarSign,
  BookOpen,
  Search,
  SlidersHorizontal,
  ChevronRight,
  Bookmark,
  Star,
  TrendingUp,
  Building2,
  Award,
  Globe,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useProfile } from '@/lib/profile-context';
import { colleges, computeCollegeFit, type College } from '@/lib/colleges-data';
import { useLanguage } from '@/lib/i18n';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const tierLabel: Record<string, string> = {
  ivy:    'Ivy League',
  elite:  'Elite Private',
  uc:     'UC System',
  public: 'Top Public',
  safety: 'Safety / Match',
};

const tierColor: Record<string, string> = {
  ivy:    'bg-violet-100 text-violet-700 border-violet-200',
  elite:  'bg-blue-100 text-blue-700 border-blue-200',
  uc:     'bg-emerald-100 text-emerald-700 border-emerald-200',
  public: 'bg-teal-100 text-teal-700 border-teal-200',
  safety: 'bg-lime-100 text-lime-700 border-lime-200',
};

const difficultyColor: Record<string, string> = {
  reach:  'bg-red-50 text-red-600',
  target: 'bg-yellow-50 text-yellow-700',
  safety: 'bg-green-50 text-green-700',
};

const categoryIcon: Record<string, React.ElementType> = {
  Ivy:     Award,
  Elite:   TrendingUp,
  UC:      Building2,
  Public:  Globe,
  Safety:  BookOpen,
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
    transition: { duration: 0.4, delay: i * 0.04, ease: 'easeOut' as const },
  }),
};

const filterTabs = [
  { id: 'all',    labelKey: 'filterAll'   as const },
  { id: 'Ivy',    labelKey: 'ivyLeague'   as const },
  { id: 'Elite',  labelKey: 'elitePrivate' as const },
  { id: 'UC',     labelKey: 'ucSystem'    as const },
  { id: 'Public', labelKey: 'topPublic'   as const },
  { id: 'Safety', labelKey: 'safetyMatch' as const },
];

const difficultyTabs = [
  { id: 'all',    labelKey: 'allLevels' as const },
  { id: 'reach',  labelKey: 'reach'     as const },
  { id: 'target', labelKey: 'target'    as const },
  { id: 'safety', labelKey: 'safety'    as const },
];

// ─── College Card ─────────────────────────────────────────────────────────────

function CollegeCard({
  college,
  fit,
  saved,
  onToggleSave,
  index,
}: {
  college: College;
  fit: number;
  saved: boolean;
  onToggleSave: () => void;
  index: number;
}) {
  const Icon = categoryIcon[college.category] ?? GraduationCap;
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
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Icon size={18} className="text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">
                  {college.name}
                </h3>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin size={10} className="text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">{college.location}</p>
                </div>
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

          {/* Tier + difficulty badges */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className={cn('rounded-full border px-2.5 py-0.5 text-[10px] font-semibold', tierColor[college.tier])}>
              {tierLabel[college.tier]}
            </span>
            <span className={cn('rounded-full px-2.5 py-0.5 text-[10px] font-semibold', difficultyColor[college.difficulty])}>
              {college.difficulty.charAt(0).toUpperCase() + college.difficulty.slice(1)}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">
            {t.collegeDescriptions[college.id] ?? college.description}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { icon: DollarSign, label: t.colleges.tuition,    value: college.tuition         },
              { icon: Award,      label: t.colleges.acceptance, value: college.acceptanceRate   },
              { icon: Users,      label: t.colleges.enrollment, value: college.enrollment       },
            ].map(({ icon: StatIcon, label, value }) => (
              <div key={label} className="rounded-lg bg-muted/40 px-2 py-2 text-center">
                <StatIcon size={11} className="mx-auto mb-1 text-primary" />
                <p className="text-[10px] text-muted-foreground">{label}</p>
                <p className="text-[10px] font-semibold text-foreground leading-tight mt-0.5">{value}</p>
              </div>
            ))}
          </div>

          {/* Top programs */}
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
              {t.colleges.topPrograms}
            </p>
            <div className="flex flex-wrap gap-1">
              {college.topPrograms.slice(0, 4).map((prog) => (
                <Badge key={prog} variant="secondary" className="text-[10px] px-2 py-0.5 rounded-full font-normal">
                  {prog}
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

export default function CollegesPage() {
  const { profile } = useProfile();
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeDifficulty, setActiveDifficulty] = useState('all');
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState<string[]>([]);

  // Compute fit scores for all colleges
  const scored = useMemo(() => {
    return colleges.map((c) => ({
      college: c,
      fit: profile
        ? computeCollegeFit(c, profile.scores, profile.total)
        : 70, // neutral score when no profile
    })).sort((a, b) => b.fit - a.fit);
  }, [profile]);

  const topMatch = scored[0];

  const filtered = useMemo(() => {
    return scored.filter(({ college }) => {
      const matchesCategory   = activeCategory === 'all'   || college.category === activeCategory;
      const matchesDifficulty = activeDifficulty === 'all' || college.difficulty === activeDifficulty;
      const q = search.toLowerCase();
      const matchesSearch = q === '' ||
        college.name.toLowerCase().includes(q) ||
        college.shortName.toLowerCase().includes(q) ||
        college.location.toLowerCase().includes(q) ||
        college.topPrograms.some((p) => p.toLowerCase().includes(q)) ||
        college.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesDifficulty && matchesSearch;
    });
  }, [scored, activeCategory, activeDifficulty, search]);

  function toggleSave(id: string) {
    setSaved((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  }

  return (
    <>
      <Helmet>
        <title>{t.colleges.title} — PathwayIQ</title>
        <meta name="description" content={t.colleges.subtitle} />
        <link rel="canonical" href="https://pathwayiq.com/colleges" />
        <meta property="og:title" content={`${t.colleges.title} — PathwayIQ`} />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Page header */}
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <Link to="/dashboard" className="hover:text-primary transition-colors">{t.dashboard.title}</Link>
              <ChevronRight size={12} />
              <span className="text-foreground font-medium">{t.nav.colleges}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-1">{t.colleges.title}</h1>
                <p className="text-muted-foreground text-sm">
                  {t.colleges.subtitle}
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
                    <Link to="/quiz">
                      {t.dashboard.takeQuiz} <ArrowRight size={13} />
                    </Link>
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
                    <span className="text-sm font-semibold text-foreground">{t.colleges.topMatch}</span>
                    <span className="text-sm text-primary font-bold">
                      {topMatch.college.shortName} — {topMatch.fit}% {t.common.match}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground sm:ml-auto">
                    {t.colleges.basedOn.replace('{type}', profile.type)}
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
                placeholder={t.colleges.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 rounded-xl"
              />
            </div>
          </motion.div>

          {/* Category filter */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="mb-3 flex flex-wrap gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={cn(
                  'rounded-full px-4 py-1.5 text-sm font-medium transition-all border',
                  activeCategory === tab.id
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground',
                )}
              >
                {t.colleges[tab.labelKey]}
              </button>
            ))}
          </motion.div>

          {/* Difficulty filter */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4} className="mb-6 flex flex-wrap gap-2">
            {difficultyTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveDifficulty(tab.id)}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-medium transition-all border',
                  activeDifficulty === tab.id
                    ? 'bg-foreground text-background border-foreground shadow-sm'
                    : 'bg-background text-muted-foreground border-border hover:border-foreground/40',
                )}
              >
                {t.colleges[tab.labelKey]}
              </button>
            ))}
          </motion.div>

          {/* Results count */}
          <p className="text-xs text-muted-foreground mb-4">
            {t.colleges.showing.replace('{n}', String(filtered.length))}{filtered.length !== 1 ? 's' : ''}
            {activeCategory !== 'all' ? ` · ${activeCategory}` : ''}
            {activeDifficulty !== 'all' ? ` · ${activeDifficulty}` : ''}
            {search ? ` · "${search}"` : ''}
          </p>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <GraduationCap size={36} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">{t.colleges.noResults}</p>
              <p className="text-sm mt-1">{t.colleges.tryDifferent}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(({ college, fit }, i) => (
                <CollegeCard
                  key={college.id}
                  college={college}
                  fit={fit}
                  saved={saved.includes(college.id)}
                  onToggleSave={() => toggleSave(college.id)}
                  index={i + 5}
                />
              ))}
            </div>
          )}

          {/* CTA */}
          <motion.div
            initial="hidden" animate="visible" variants={fadeUp}
            custom={filtered.length + 5}
            className="mt-10 text-center"
          >
            <p className="text-sm text-muted-foreground mb-3">{t.colleges.moreResults}</p>
            <Button asChild className="rounded-xl">
              <Link to="/quiz">{t.colleges.retakeQuiz}</Link>
            </Button>
          </motion.div>

        </div>
      </div>
    </>
  );
}
