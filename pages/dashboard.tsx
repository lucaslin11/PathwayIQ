import { Link } from 'react-router-dom';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion } from 'motion/react';
import {
  Briefcase,
  GraduationCap,
  BookOpen,
  Star,
  MessageCircle,
  Map,
  ArrowRight,
  Zap,
  Users,
  Lightbulb,
  TrendingUp,
  ChevronRight,
  Compass,
  BarChart2,
  FlaskConical,
  Palette,
  Handshake,
  Brain,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useProfile, type StoredProfile } from '@/lib/profile-context';
import { useLanguage } from '@/lib/i18n';
import { cn } from '@/lib/utils';

// ─── Animation ────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: 'easeOut' as const },
  }),
};

// ─── Profile-driven data derivation ──────────────────────────────────────────
// Everything below is computed from the stored profile scores.
// No hardcoded sample data — all values are derived from quiz results.

interface CareerMatch {
  id: string;
  title: string;
  field: string;
  cluster: string;
  match: number;
}

interface StrengthBar {
  label: string;
  score: number;
  icon: React.ElementType;
  color: string;
}

function deriveStrengths(p: StoredProfile): StrengthBar[] {
  const { stem, creative, social, business } = p.scores;
  const max = Math.max(stem, creative, social, business) || 1;
  const pct = (v: number) => Math.round((v / max) * 100);

  return [
    { label: 'Analytical / STEM',    score: pct(stem),     icon: BarChart2, color: 'text-emerald-600' },
    { label: 'Creative Thinking',    score: pct(creative), icon: Lightbulb, color: 'text-teal-600'    },
    { label: 'People & Social',      score: pct(social),   icon: Users,     color: 'text-green-600'   },
    { label: 'Business & Leadership',score: pct(business), icon: Zap,       color: 'text-lime-600'    },
  ].sort((a, b) => b.score - a.score);
}

function deriveInterests(p: StoredProfile): string[] {
  const clusterTags: Record<string, string[]> = {
    STEM:     ['Technology', 'Engineering', 'Mathematics', 'Research', 'Data Science'],
    Creative: ['Design', 'Writing', 'Arts', 'Film & Media', 'Music'],
    Social:   ['Psychology', 'Community', 'Education', 'Public Service', 'Healthcare'],
    Business: ['Entrepreneurship', 'Finance', 'Marketing', 'Leadership', 'Strategy'],
  };
  // Lead with cluster tags, then fill from score order
  const primary = clusterTags[p.majorCluster] ?? [];
  const { stem, creative, social, business } = p.scores;
  const secondary: Array<[string, number]> = [
    ['Technology',      stem     ],
    ['Design',          creative ],
    ['Leadership',      business ],
    ['Psychology',      social   ],
  ];
  const extra = secondary
    .sort((a, b) => b[1] - a[1])
    .map(([l]) => l)
    .filter((l) => !primary.includes(l));
  return [...primary, ...extra].slice(0, 5);
}

function deriveTopCareers(p: StoredProfile): CareerMatch[] {
  const { stem, creative, social, business } = p.scores;
  const total = p.total || 1;

  // Career pool — each has bucket affinities [stem, creative, social, business]
  // and a cluster tag so we can boost careers in the user's primary cluster
  const careers: Array<{ id: string; title: string; field: string; cluster: string; w: [number, number, number, number] }> = [
    { id: 'software-engineer',    title: 'Software Engineer',        field: 'Technology',     cluster: 'STEM',     w: [3, 1, 0, 1] },
    { id: 'data-scientist',       title: 'Data Scientist',           field: 'Analytics',      cluster: 'STEM',     w: [3, 0, 0, 1] },
    { id: 'biomedical-engineer',  title: 'Biomedical Engineer',      field: 'Engineering',    cluster: 'STEM',     w: [3, 0, 1, 0] },
    { id: 'env-engineer',         title: 'Environmental Scientist',  field: 'Science',        cluster: 'STEM',     w: [3, 1, 1, 0] },
    { id: 'ux-designer',          title: 'UX / Product Designer',    field: 'Design',         cluster: 'Creative', w: [1, 3, 1, 1] },
    { id: 'graphic-designer',     title: 'Graphic Designer',         field: 'Creative',       cluster: 'Creative', w: [0, 3, 1, 1] },
    { id: 'content-creator',      title: 'Content Creator',          field: 'Media',          cluster: 'Creative', w: [0, 3, 2, 1] },
    { id: 'architect',            title: 'Architect',                field: 'Design & Build', cluster: 'Creative', w: [2, 3, 0, 1] },
    { id: 'psychologist',         title: 'Psychologist',             field: 'Social Science', cluster: 'Social',   w: [1, 1, 3, 0] },
    { id: 'teacher',              title: 'Teacher / Educator',       field: 'Education',      cluster: 'Social',   w: [1, 1, 3, 0] },
    { id: 'social-worker',        title: 'Social Worker',            field: 'Human Services', cluster: 'Social',   w: [0, 1, 3, 0] },
    { id: 'public-health',        title: 'Public Health Specialist', field: 'Healthcare',     cluster: 'Social',   w: [2, 0, 3, 0] },
    { id: 'marketing-manager',    title: 'Marketing Manager',        field: 'Marketing',      cluster: 'Business', w: [0, 2, 2, 3] },
    { id: 'entrepreneur',         title: 'Entrepreneur',             field: 'Business',       cluster: 'Business', w: [1, 1, 1, 3] },
    { id: 'financial-analyst',    title: 'Financial Analyst',        field: 'Finance',        cluster: 'Business', w: [2, 0, 0, 3] },
    { id: 'product-manager',      title: 'Product Manager',          field: 'Tech / Biz',     cluster: 'Business', w: [2, 1, 1, 2] },
  ];

  const scored = careers.map((c) => {
    const raw = c.w[0] * stem + c.w[1] * creative + c.w[2] * social + c.w[3] * business;
    const maxPossible = Math.max(...c.w) * total;
    let match = maxPossible > 0
      ? Math.min(99, Math.max(40, Math.round((raw / maxPossible) * 100)))
      : 50;
    if (c.cluster === p.majorCluster) match = Math.min(99, match + 8);
    return { id: c.id, title: c.title, field: c.field, cluster: c.cluster, match };
  });

  return scored.sort((a, b) => b.match - a.match).slice(0, 4);
}

function deriveTagline(p: StoredProfile): string {
  // Keyed by bucket (stable) — falls back to English type string for legacy profiles
  const bucket = p.bucket ?? (
    p.type === 'STEM Innovator' ? 'stem' :
    p.type === 'Creative Visionary' ? 'creative' :
    p.type === 'People Champion' ? 'social' : 'business'
  );
  const map: Record<string, string> = {
    'stem':     'You think analytically, love solving problems, and thrive when building things that matter.',
    'creative': 'You see the world differently — your ideas, expression, and originality are your greatest strengths.',
    'social':   'You connect deeply with others and are driven to make a real difference in people\'s lives.',
    'business': 'You are ambitious, strategic, and energised by leading teams and turning ideas into results.',
  };
  return map[bucket] ?? 'Your unique combination of skills and interests sets you apart.';
}

function derivePathIcon(p: StoredProfile): React.ElementType {
  const bucket = p.bucket ?? (
    p.type === 'STEM Innovator' ? 'stem' :
    p.type === 'Creative Visionary' ? 'creative' :
    p.type === 'People Champion' ? 'social' : 'business'
  );
  const map: Record<string, React.ElementType> = {
    'stem':     FlaskConical,
    'creative': Palette,
    'social':   Handshake,
    'business': Briefcase,
  };
  return map[bucket] ?? Compass;
}

function deriveSuggestedDirection(p: StoredProfile): { headline: string; body: string } {
  const bucket = p.bucket ?? (
    p.type === 'STEM Innovator' ? 'stem' :
    p.type === 'Creative Visionary' ? 'creative' :
    p.type === 'People Champion' ? 'social' : 'business'
  );
  const collegeHint: Record<StoredProfile['collegeType'], string> = {
    'research':     'Research universities like MIT, UC Berkeley, or Carnegie Mellon are strong fits.',
    'arts':         'Schools with strong arts programs like RISD, CalArts, or NYU Tisch align well.',
    'business':     'Top business schools like Wharton, Ross, or Haas match your direction.',
    'liberal-arts': 'Liberal arts colleges with strong social science programs suit your profile.',
    'public':       'Strong public universities like the UC system or ASU offer great value for your path.',
  };
  const map: Record<string, { headline: string; body: string }> = {
    'stem': {
      headline: 'STEM Pathway',
      body: `Computer science, engineering, or data science align best with your scores. ${collegeHint[p.collegeType]}`,
    },
    'creative': {
      headline: 'Creative Pathway',
      body: `Design, media, writing, or the arts match your creative strengths. ${collegeHint[p.collegeType]}`,
    },
    'social': {
      headline: 'Social & Human Services Pathway',
      body: `Psychology, education, social work, or public service are where you shine. ${collegeHint[p.collegeType]}`,
    },
    'business': {
      headline: 'Business & Entrepreneurship Pathway',
      body: `Finance, marketing, management, or launching your own venture fit your drive. ${collegeHint[p.collegeType]}`,
    },
  };
  return map[bucket] ?? { headline: 'Explore Your Path', body: 'Take the quiz to unlock your personalised direction.' };
}

// ─── Score breakdown bar ──────────────────────────────────────────────────────

function ScoreBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.round((value / (max || 1)) * 100);
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-foreground">{label}</span>
        <span className="text-xs font-bold text-muted-foreground">{value} pts</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <motion.div
          className={cn('h-full rounded-full', color)}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

// ─── No-profile state ─────────────────────────────────────────────────────────

function NoProfile() {
  const { t } = useLanguage();
  return (
    <>
      <Helmet>
        <title>{t.dashboard.title} — PathwayIQ</title>
        <meta name="description" content="Take the PathwayIQ quiz to unlock your personalised academic and career dashboard." />
      </Helmet>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-background to-emerald-50/40 px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center max-w-md"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10">
            <Compass size={36} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-3">Your dashboard is waiting</h1>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">
            {t.dashboard.noProfile}
          </p>
          <Button asChild size="lg" className="rounded-xl px-8 py-6 text-base shadow-md">
            <Link to="/quiz">
              {t.dashboard.takeQuiz}
              <ArrowRight size={18} className="ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { profile } = useProfile();
  const { t } = useLanguage();

  if (!profile) return <NoProfile />;

  const strengths       = deriveStrengths(profile);
  const interests       = deriveInterests(profile);
  const topCareers      = deriveTopCareers(profile);
  const tagline         = deriveTagline(profile);
  const PathIcon        = derivePathIcon(profile);
  const direction       = deriveSuggestedDirection(profile);
  const { stem, creative, social, business } = profile.scores;
  const maxScore        = Math.max(stem, creative, social, business) || 1;

  // Derive translated type/pathway from bucket key
  const bucket = profile.bucket ?? (
    profile.type === 'STEM Innovator' ? 'stem' :
    profile.type === 'Creative Visionary' ? 'creative' :
    profile.type === 'People Champion' ? 'social' : 'business'
  );
  const displayType = bucket === 'stem' ? t.quiz.profileTypes.stemType :
    bucket === 'creative' ? t.quiz.profileTypes.creativeType :
    bucket === 'social' ? t.quiz.profileTypes.socialType :
    t.quiz.profileTypes.businessType;
  const displayPathway = bucket === 'stem' ? t.quiz.profileTypes.stemPathway :
    bucket === 'creative' ? t.quiz.profileTypes.creativePathway :
    bucket === 'social' ? t.quiz.profileTypes.socialPathway :
    t.quiz.profileTypes.businessPathway;

  const quickLinks = [
    { icon: Briefcase,      label: 'Careers',    href: '/careers',  desc: `${topCareers.length} matches`,    color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
    { icon: GraduationCap,  label: 'Colleges',   href: '/colleges', desc: '10 great fits',                   color: 'bg-teal-50 text-teal-700 border-teal-100'          },
    { icon: BookOpen,       label: 'Classes',    href: '/classes',  desc: '10 recommended',                  color: 'bg-green-50 text-green-700 border-green-100'        },
    { icon: Star,           label: 'Activities', href: '/classes',  desc: '12 opportunities',                color: 'bg-lime-50 text-lime-700 border-lime-100'           },
  ];

  return (
    <>
      <Helmet>
        <title>{t.dashboard.title} — PathwayIQ</title>
        <meta name="description" content={t.dashboard.subtitle} />
        <link rel="canonical" href="https://pathwayiq.com/dashboard" />
        <meta property="og:title" content={`${t.dashboard.title} — PathwayIQ`} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="bg-muted/20 min-h-screen">
        {/* Header bar */}
        <div className="bg-background border-b border-border">
          <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <motion.h1
                initial="hidden" animate="visible" variants={fadeUp} custom={0}
                className="text-2xl font-bold text-foreground"
              >
                Your PathwayIQ Profile
              </motion.h1>
              <motion.p
                initial="hidden" animate="visible" variants={fadeUp} custom={1}
                className="text-sm text-muted-foreground mt-0.5"
              >
                Based on your quiz — here is your personalised academic and career snapshot.
              </motion.p>
            </div>
            <motion.div
              initial="hidden" animate="visible" variants={fadeUp} custom={2}
              className="flex gap-2"
            >
              <Button asChild variant="outline" size="sm" className="rounded-lg gap-1.5">
                <Link to="/quiz">
                  <Compass size={14} />
                  {t.quiz.retake}
                </Link>
              </Button>
              <Button asChild size="sm" className="rounded-lg gap-1.5">
                <Link to="/careers">
                  <Map size={14} />
                  {t.careers.title}
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-6">

            {/* ── Left column ── */}
            <div className="lg:col-span-1 flex flex-col gap-6">

              {/* Profile card */}
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1}>
                <Card className="border border-border shadow-sm overflow-hidden">
                  <div className="h-2 bg-primary w-full" />
                  <CardContent className="pt-6 pb-6 px-6">
                    <div className="flex items-start gap-4 mb-5">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                        <PathIcon size={24} className="text-primary" />
                      </div>
                      <div>
                        <Badge className="mb-1 bg-primary/10 text-primary border-0 text-xs">
                          {displayType}
                        </Badge>
                        <h2 className="text-base font-semibold text-foreground">{displayPathway}</h2>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                      {tagline}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {interests.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Score breakdown */}
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}>
                <Card className="border border-border shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Brain size={15} className="text-primary" />
                      Score Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-6 flex flex-col gap-3">
                    <ScoreBar label="STEM"     value={stem}     max={maxScore} color="bg-emerald-500" />
                    <ScoreBar label="Creative" value={creative} max={maxScore} color="bg-teal-500"    />
                    <ScoreBar label="Social"   value={social}   max={maxScore} color="bg-green-500"   />
                    <ScoreBar label="Business" value={business} max={maxScore} color="bg-lime-500"    />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Strengths */}
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}>
                <Card className="border border-border shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <TrendingUp size={15} className="text-primary" />
                      Your Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-6 flex flex-col gap-4">
                    {strengths.map((s) => (
                      <div key={s.label}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <s.icon size={13} className={s.color} />
                            <span className="text-xs font-medium text-foreground">{s.label}</span>
                          </div>
                          <span className="text-xs font-semibold text-primary">{s.score}%</span>
                        </div>
                        <Progress value={s.score} className="h-1.5" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick actions */}
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4}>
                <Card className="border border-border shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-foreground">
                      {t.dashboard.quickActions}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-6 flex flex-col gap-2">
                    <Button asChild className="w-full justify-between rounded-lg" size="sm">
                      <Link to="/careers">
                        <span className="flex items-center gap-2">
                          <MessageCircle size={14} />
                          Explore My Careers
                        </span>
                        <ArrowRight size={13} />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full justify-between rounded-lg" size="sm">
                      <Link to="/colleges">
                        <span className="flex items-center gap-2">
                          <GraduationCap size={14} />
                          Browse College Matches
                        </span>
                        <ArrowRight size={13} />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* ── Right column ── */}
            <div className="lg:col-span-2 flex flex-col gap-6">

              {/* Quick nav tiles */}
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1}>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {quickLinks.map((link) => (
                    <Link key={link.label} to={link.href} className="group">
                      <Card className={`border shadow-sm group-hover:shadow-md group-hover:border-primary/30 transition-all duration-200 ${link.color}`}>
                        <CardContent className="pt-5 pb-4 px-4 text-center">
                          <link.icon size={22} className="mx-auto mb-2" />
                          <p className="text-sm font-semibold">{link.label}</p>
                          <p className="text-xs opacity-70 mt-0.5">{link.desc}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* Major cluster + college type chips */}
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}>
                <Card className="border border-border shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <GraduationCap size={15} className="text-primary" />
                      Recommended Focus Areas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    {/* Major cluster */}
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t.dashboard.recommendedMajor}</p>
                    {(() => {
                      const clusterMajors: Record<string, string[]> = {
                        STEM:     ['Computer Science', 'Engineering', 'Data Science', 'Biology', 'Mathematics'],
                        Creative: ['Graphic Design', 'Film & Media', 'Creative Writing', 'Architecture', 'Music'],
                        Social:   ['Psychology', 'Education', 'Sociology', 'Public Health', 'Social Work'],
                        Business: ['Business Administration', 'Finance', 'Marketing', 'Entrepreneurship', 'Economics'],
                      };
                      const majors = clusterMajors[profile.majorCluster] ?? [];
                      return (
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {majors.map((m) => (
                            <span key={m} className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">
                              {m}
                            </span>
                          ))}
                        </div>
                      );
                    })()}
                    {/* College type */}
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t.dashboard.collegeMatch}</p>
                    {(() => {
                      const typeLabels: Record<StoredProfile['collegeType'], string> = {
                        'research':     'Research University',
                        'arts':         'Arts & Design School',
                        'business':     'Business School',
                        'liberal-arts': 'Liberal Arts College',
                        'public':       'Public University',
                      };
                      return (
                        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                          {typeLabels[profile.collegeType]}
                        </span>
                      );
                    })()}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Top career matches */}
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}>
                <Card className="border border-border shadow-sm">
                  <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Briefcase size={15} className="text-primary" />
                      {t.dashboard.topCareers}
                    </CardTitle>
                    <Link to="/careers" className="text-xs text-primary hover:underline flex items-center gap-0.5">
                      View all <ChevronRight size={12} />
                    </Link>
                  </CardHeader>
                  <CardContent className="px-6 pb-6 flex flex-col gap-3">
                    {topCareers.map((career, i) => (
                      <motion.div
                        key={career.id}
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        custom={i + 3}
                        className="flex items-center justify-between p-3 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors cursor-pointer group"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                            {t.careerTitles[career.id] ?? career.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">{career.field}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-sm font-bold text-primary">{career.match}%</p>
                            <p className="text-xs text-muted-foreground">{t.common.match}</p>
                          </div>
                          <div className="w-16">
                            <Progress value={career.match} className="h-1.5" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Suggested direction banner */}
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4}>
                <Card className="border border-primary/20 bg-primary/5 shadow-sm">
                  <CardContent className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15">
                        <Compass size={18} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{t.dashboard.suggestedDirection}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          Based on your profile, a{' '}
                          <strong className="text-foreground">{direction.headline}</strong>{' '}
                          is your strongest fit. {direction.body}
                        </p>
                      </div>
                    </div>
                    <Button asChild size="sm" className="shrink-0 rounded-lg">
                      <Link to="/careers">
                        Explore Path
                        <ArrowRight size={13} className="ml-1.5" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Completed at note */}
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5}>
                <p className="text-xs text-muted-foreground text-right">
                  Profile generated{' '}
                  {new Date(profile.completedAt).toLocaleDateString('en-US', {
                    month: 'long', day: 'numeric', year: 'numeric',
                  })}
                  {' · '}
                  <Link to="/quiz" className="text-primary hover:underline">Retake to update</Link>
                </p>
              </motion.div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
