import { useState, useMemo } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion } from 'motion/react';
import {
  BookOpen,
  Star,
  Search,
  SlidersHorizontal,
  ChevronRight,
  Bookmark,
  Clock,
  GraduationCap,
  FlaskConical,
  Calculator,
  Palette,
  Globe,
  Code2,
  Leaf,
  TrendingUp,
  Award,
  Heart,
  Briefcase,
  Mic,
  Camera,
  Newspaper,
  Trophy,
  Wrench,
  DollarSign,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useProfile } from '@/lib/profile-context';
import { majors, type MajorCluster } from '@/lib/majors-data';
import { useLanguage } from '@/lib/i18n';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Course {
  id: string;
  title: string;
  subject: string;
  category: string;
  level: 'Standard' | 'Honors' | 'AP' | 'Dual Enrollment';
  grade: string;
  match: number;
  credits: string;
  duration: string;
  description: string;
  skills: string[];
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  topPick: boolean;
  collegeImpact: 'High' | 'Medium' | 'Low';
}

interface Activity {
  id: string;
  title: string;
  type: string;
  category: string;
  match: number;
  timeCommitment: string;
  description: string;
  benefits: string[];
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  topPick: boolean;
  collegeImpact: 'High' | 'Medium' | 'Low';
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const courseCategories = [
  { id: 'all',      label: 'All Courses' },
  { id: 'STEM',     label: 'STEM'        },
  { id: 'Business', label: 'Business'    },
  { id: 'Creative', label: 'Creative'    },
  { id: 'Social',   label: 'Humanities'  },
  { id: 'Tech',     label: 'Technology'  },
];

const activityCategories = [
  { id: 'all',        label: 'All Activities' },
  { id: 'Academic',   label: 'Academic'       },
  { id: 'STEM',       label: 'STEM'           },
  { id: 'Leadership', label: 'Leadership'     },
  { id: 'Creative',   label: 'Creative'       },
  { id: 'Sports',     label: 'Sports'         },
  { id: 'Community',  label: 'Community'      },
];

const courses: Course[] = [
  {
    id: 'ap-cs',
    title: 'AP Computer Science A',
    subject: 'Computer Science',
    category: 'Tech',
    level: 'AP',
    grade: '10–12',
    match: 97,
    credits: '1.0',
    duration: 'Full Year',
    description: 'Learn object-oriented programming in Java. Covers algorithms, data structures, and problem solving — directly aligned with college CS programs.',
    skills: ['Java', 'Algorithms', 'Problem Solving', 'Logic'],
    icon: Code2,
    iconColor: 'text-emerald-700',
    iconBg: 'bg-emerald-50',
    topPick: true,
    collegeImpact: 'High',
  },
  {
    id: 'ap-calc-bc',
    title: 'AP Calculus BC',
    subject: 'Mathematics',
    category: 'STEM',
    level: 'AP',
    grade: '11–12',
    match: 93,
    credits: '1.0',
    duration: 'Full Year',
    description: 'The most rigorous high school math course — covers limits, derivatives, integrals, and series. Essential for STEM majors.',
    skills: ['Calculus', 'Analytical Thinking', 'Problem Solving', 'Precision'],
    icon: Calculator,
    iconColor: 'text-teal-700',
    iconBg: 'bg-teal-50',
    topPick: true,
    collegeImpact: 'High',
  },
  {
    id: 'ap-physics',
    title: 'AP Physics C: Mechanics',
    subject: 'Physics',
    category: 'STEM',
    level: 'AP',
    grade: '11–12',
    match: 88,
    credits: '1.0',
    duration: 'Full Year',
    description: 'Calculus-based physics covering mechanics, motion, and energy. Highly valued by engineering and physics programs.',
    skills: ['Physics', 'Calculus', 'Lab Work', 'Critical Thinking'],
    icon: FlaskConical,
    iconColor: 'text-green-700',
    iconBg: 'bg-green-50',
    topPick: true,
    collegeImpact: 'High',
  },
  {
    id: 'ap-stats',
    title: 'AP Statistics',
    subject: 'Mathematics',
    category: 'STEM',
    level: 'AP',
    grade: '10–12',
    match: 84,
    credits: '1.0',
    duration: 'Full Year',
    description: 'Covers data collection, probability, and statistical inference. Valuable for data science, psychology, and business tracks.',
    skills: ['Statistics', 'Data Analysis', 'Research', 'Reasoning'],
    icon: TrendingUp,
    iconColor: 'text-blue-700',
    iconBg: 'bg-blue-50',
    topPick: false,
    collegeImpact: 'High',
  },
  {
    id: 'ap-bio',
    title: 'AP Biology',
    subject: 'Biology',
    category: 'STEM',
    level: 'AP',
    grade: '10–12',
    match: 79,
    credits: '1.0',
    duration: 'Full Year',
    description: 'Deep dive into molecular biology, genetics, evolution, and ecology. Ideal for pre-med, biomedical, and environmental science paths.',
    skills: ['Biology', 'Lab Skills', 'Research', 'Critical Thinking'],
    icon: Leaf,
    iconColor: 'text-lime-700',
    iconBg: 'bg-lime-50',
    topPick: false,
    collegeImpact: 'High',
  },
  {
    id: 'intro-cs',
    title: 'Introduction to Computer Science',
    subject: 'Computer Science',
    category: 'Tech',
    level: 'Standard',
    grade: '9–10',
    match: 76,
    credits: '0.5',
    duration: 'Semester',
    description: 'A beginner-friendly intro to programming concepts, computational thinking, and basic coding using Python or Scratch.',
    skills: ['Python', 'Logic', 'Creativity', 'Problem Solving'],
    icon: Code2,
    iconColor: 'text-emerald-700',
    iconBg: 'bg-emerald-50',
    topPick: false,
    collegeImpact: 'Medium',
  },
  {
    id: 'ap-econ',
    title: 'AP Microeconomics',
    subject: 'Economics',
    category: 'Business',
    level: 'AP',
    grade: '11–12',
    match: 72,
    credits: '0.5',
    duration: 'Semester',
    description: 'Study how individuals and firms make decisions in markets. Great foundation for business, finance, and policy careers.',
    skills: ['Economics', 'Analytical Thinking', 'Research', 'Writing'],
    icon: Briefcase,
    iconColor: 'text-orange-700',
    iconBg: 'bg-orange-50',
    topPick: false,
    collegeImpact: 'Medium',
  },
  {
    id: 'graphic-design',
    title: 'Graphic Design & Digital Media',
    subject: 'Visual Arts',
    category: 'Creative',
    level: 'Standard',
    grade: '9–12',
    match: 68,
    credits: '1.0',
    duration: 'Full Year',
    description: 'Learn design principles, typography, and digital tools like Adobe Illustrator and Photoshop. Great for creative and tech-oriented students.',
    skills: ['Design', 'Creativity', 'Adobe Suite', 'Communication'],
    icon: Palette,
    iconColor: 'text-purple-700',
    iconBg: 'bg-purple-50',
    topPick: false,
    collegeImpact: 'Medium',
  },
  {
    id: 'ap-lang',
    title: 'AP English Language & Composition',
    subject: 'English',
    category: 'Social',
    level: 'AP',
    grade: '11',
    match: 65,
    credits: '1.0',
    duration: 'Full Year',
    description: 'Develop advanced writing, rhetoric, and argumentation skills. Valuable for any college-bound student regardless of major.',
    skills: ['Writing', 'Rhetoric', 'Analysis', 'Communication'],
    icon: BookOpen,
    iconColor: 'text-indigo-700',
    iconBg: 'bg-indigo-50',
    topPick: false,
    collegeImpact: 'High',
  },
  {
    id: 'ap-world',
    title: 'AP World History',
    subject: 'History',
    category: 'Social',
    level: 'AP',
    grade: '10',
    match: 60,
    credits: '1.0',
    duration: 'Full Year',
    description: 'Explore global history from 1200 CE to the present. Builds critical thinking, writing, and contextual analysis skills.',
    skills: ['History', 'Writing', 'Critical Thinking', 'Research'],
    icon: Globe,
    iconColor: 'text-cyan-700',
    iconBg: 'bg-cyan-50',
    topPick: false,
    collegeImpact: 'Medium',
  },
];

const activities: Activity[] = [
  {
    id: 'robotics',
    title: 'Robotics Club / FIRST Robotics',
    type: 'Club',
    category: 'STEM',
    match: 96,
    timeCommitment: '8–12 hrs/week',
    description: 'Design, build, and compete with robots in regional and national competitions. One of the most impressive STEM extracurriculars for college apps.',
    benefits: ['Engineering Skills', 'Teamwork', 'Competition Experience', 'College Appeal'],
    icon: Wrench,
    iconColor: 'text-emerald-700',
    iconBg: 'bg-emerald-50',
    topPick: true,
    collegeImpact: 'High',
  },
  {
    id: 'math-team',
    title: 'Math Team / AMC Competition',
    type: 'Academic Competition',
    category: 'Academic',
    match: 92,
    timeCommitment: '3–5 hrs/week',
    description: 'Compete in AMC, AIME, and other math competitions. Demonstrates exceptional analytical ability to top colleges.',
    benefits: ['Problem Solving', 'Competition Awards', 'College Recognition', 'Peer Network'],
    icon: Calculator,
    iconColor: 'text-teal-700',
    iconBg: 'bg-teal-50',
    topPick: true,
    collegeImpact: 'High',
  },
  {
    id: 'coding-club',
    title: 'Coding / Hackathon Club',
    type: 'Club',
    category: 'STEM',
    match: 90,
    timeCommitment: '3–6 hrs/week',
    description: 'Build projects, compete in hackathons, and collaborate with peers on real software. Excellent for CS and engineering applicants.',
    benefits: ['Portfolio Projects', 'Collaboration', 'Industry Exposure', 'Leadership Opportunities'],
    icon: Code2,
    iconColor: 'text-green-700',
    iconBg: 'bg-green-50',
    topPick: true,
    collegeImpact: 'High',
  },
  {
    id: 'student-gov',
    title: 'Student Government',
    type: 'Leadership',
    category: 'Leadership',
    match: 82,
    timeCommitment: '4–6 hrs/week',
    description: 'Lead school initiatives, represent your peers, and develop real leadership and communication skills.',
    benefits: ['Leadership', 'Public Speaking', 'Organizational Skills', 'Community Impact'],
    icon: Award,
    iconColor: 'text-yellow-700',
    iconBg: 'bg-yellow-50',
    topPick: false,
    collegeImpact: 'High',
  },
  {
    id: 'science-fair',
    title: 'Science Fair / Research Project',
    type: 'Academic',
    category: 'STEM',
    match: 80,
    timeCommitment: '5–10 hrs/week',
    description: 'Conduct original research and present findings at regional or national science fairs. Highly valued by STEM-focused colleges.',
    benefits: ['Research Skills', 'Awards Potential', 'College Essays', 'Mentorship'],
    icon: FlaskConical,
    iconColor: 'text-lime-700',
    iconBg: 'bg-lime-50',
    topPick: false,
    collegeImpact: 'High',
  },
  {
    id: 'newspaper',
    title: 'School Newspaper / Journalism',
    type: 'Publication',
    category: 'Creative',
    match: 72,
    timeCommitment: '3–5 hrs/week',
    description: 'Write, edit, and publish school news. Builds writing, communication, and deadline management skills.',
    benefits: ['Writing Skills', 'Editing', 'Teamwork', 'Portfolio Building'],
    icon: Newspaper,
    iconColor: 'text-slate-700',
    iconBg: 'bg-slate-50',
    topPick: false,
    collegeImpact: 'Medium',
  },
  {
    id: 'debate',
    title: 'Debate Team',
    type: 'Academic Competition',
    category: 'Academic',
    match: 70,
    timeCommitment: '5–8 hrs/week',
    description: 'Research, argue, and defend positions on complex topics. Builds critical thinking, public speaking, and persuasion skills.',
    benefits: ['Public Speaking', 'Research', 'Critical Thinking', 'Competition Awards'],
    icon: Mic,
    iconColor: 'text-blue-700',
    iconBg: 'bg-blue-50',
    topPick: false,
    collegeImpact: 'High',
  },
  {
    id: 'nhs',
    title: 'National Honor Society',
    type: 'Honor Society',
    category: 'Academic',
    match: 68,
    timeCommitment: '2–3 hrs/week',
    description: 'Recognize academic excellence while contributing to community service and leadership initiatives.',
    benefits: ['Academic Recognition', 'Community Service', 'Scholarship Eligibility', 'Leadership'],
    icon: GraduationCap,
    iconColor: 'text-indigo-700',
    iconBg: 'bg-indigo-50',
    topPick: false,
    collegeImpact: 'Medium',
  },
  {
    id: 'photography',
    title: 'Photography / Film Club',
    type: 'Club',
    category: 'Creative',
    match: 65,
    timeCommitment: '2–4 hrs/week',
    description: 'Develop visual storytelling skills through photography and videography. Great for creative and design-oriented students.',
    benefits: ['Creative Portfolio', 'Technical Skills', 'Artistic Expression', 'Collaboration'],
    icon: Camera,
    iconColor: 'text-purple-700',
    iconBg: 'bg-purple-50',
    topPick: false,
    collegeImpact: 'Medium',
  },
  {
    id: 'volunteering',
    title: 'Community Volunteering',
    type: 'Community Service',
    category: 'Community',
    match: 62,
    timeCommitment: '2–4 hrs/week',
    description: 'Give back to your community through consistent volunteer work. Demonstrates character and commitment beyond academics.',
    benefits: ['Character Building', 'Community Impact', 'College Essays', 'Empathy'],
    icon: Heart,
    iconColor: 'text-rose-700',
    iconBg: 'bg-rose-50',
    topPick: false,
    collegeImpact: 'Medium',
  },
  {
    id: 'varsity-sport',
    title: 'Varsity Sport',
    type: 'Athletics',
    category: 'Sports',
    match: 58,
    timeCommitment: '10–15 hrs/week',
    description: 'Compete at the varsity level in any sport. Shows discipline, teamwork, and time management — all valued by colleges.',
    benefits: ['Discipline', 'Teamwork', 'Time Management', 'Scholarship Potential'],
    icon: Trophy,
    iconColor: 'text-orange-700',
    iconBg: 'bg-orange-50',
    topPick: false,
    collegeImpact: 'Medium',
  },
  {
    id: 'model-un',
    title: 'Model United Nations',
    type: 'Academic Competition',
    category: 'Leadership',
    match: 55,
    timeCommitment: '3–5 hrs/week',
    description: 'Simulate UN diplomacy, debate global issues, and represent countries in conferences. Builds global awareness and leadership.',
    benefits: ['Public Speaking', 'Global Awareness', 'Research', 'Networking'],
    icon: Globe,
    iconColor: 'text-cyan-700',
    iconBg: 'bg-cyan-50',
    topPick: false,
    collegeImpact: 'Medium',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function matchColor(score: number) {
  if (score >= 85) return 'bg-emerald-100 text-emerald-700';
  if (score >= 70) return 'bg-teal-100 text-teal-700';
  return 'bg-muted text-muted-foreground';
}

function impactColor(impact: 'High' | 'Medium' | 'Low') {
  if (impact === 'High')   return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (impact === 'Medium') return 'bg-yellow-50 text-yellow-700 border-yellow-200';
  return 'bg-muted text-muted-foreground border-border';
}

function levelColor(level: Course['level']) {
  if (level === 'AP')               return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (level === 'Honors')           return 'bg-teal-50 text-teal-700 border-teal-200';
  if (level === 'Dual Enrollment')  return 'bg-blue-50 text-blue-700 border-blue-200';
  return 'bg-muted text-muted-foreground border-border';
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.04, ease: 'easeOut' as const },
  }),
};

// ─── Profile type → major cluster mapping ─────────────────────────────────────

const profileToCluster: Record<string, MajorCluster> = {
  'STEM Innovator':    'STEM',
  'Creative Visionary': 'Creative',
  'People Champion':   'Social',
  'Business Leader':   'Business',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ClassesPage() {
  const { profile } = useProfile();
  const { t } = useLanguage();
  const [tab, setTab] = useState<'courses' | 'activities' | 'majors'>('courses');
  const [courseCategory, setCourseCategory] = useState('all');
  const [activityCategory, setActivityCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [savedCourses, setSavedCourses] = useState<string[]>([]);
  const [savedActivities, setSavedActivities] = useState<string[]>([]);

  // Derive recommended majors from profile cluster
  const recommendedCluster: MajorCluster | null = profile
    ? (profileToCluster[profile.type] ?? null)
    : null;

  const filteredMajors = useMemo(() => {
    return majors
      .filter((m) => !recommendedCluster || m.cluster === recommendedCluster)
      .sort((a, b) => {
        // Sort by bucket affinity matching the profile
        if (!profile) return 0;
        const bucketIdx = recommendedCluster === 'STEM' ? 0
          : recommendedCluster === 'Creative' ? 1
          : recommendedCluster === 'Social' ? 2
          : 3;
        return b.w[bucketIdx] - a.w[bucketIdx];
      });
  }, [recommendedCluster, profile]);

  const filteredCourses = courses.filter((c) => {
    const matchesCat = courseCategory === 'all' || c.category === courseCategory;
    const matchesSearch =
      search === '' ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const filteredActivities = activities.filter((a) => {
    const matchesCat = activityCategory === 'all' || a.category === activityCategory;
    const matchesSearch =
      search === '' ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.type.toLowerCase().includes(search.toLowerCase()) ||
      a.benefits.some((b) => b.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  function toggleCourse(id: string) {
    setSavedCourses((p) => p.includes(id) ? p.filter((s) => s !== id) : [...p, id]);
  }
  function toggleActivity(id: string) {
    setSavedActivities((p) => p.includes(id) ? p.filter((s) => s !== id) : [...p, id]);
  }

  return (
    <>
      <Helmet>
        <title>Classes & Activities — PathwayIQ</title>
        <meta
          name="description"
          content="Recommended high school courses and extracurricular activities matched to your academic profile on PathwayIQ."
        />
        <link rel="canonical" href="https://pathwayiq.com/classes" />
        <meta property="og:title" content="Classes & Activities — PathwayIQ" />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Page header */}
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <Link to="/dashboard" className="hover:text-primary transition-colors">{t.dashboard.title}</Link>
              <ChevronRight size={12} />
              <span className="text-foreground font-medium">{t.nav.classes}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-1">Classes & Activities</h1>
                <p className="text-muted-foreground text-sm">
                  Courses, extracurriculars, and recommended majors — ranked by fit with your profile
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

          {/* Top pick callout */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1} className="mb-6">
            <Card className="border border-primary/20 bg-primary/5">
              <CardContent className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-primary fill-primary" />
                  <span className="text-sm font-semibold text-foreground">Top Course Pick:</span>
                  <span className="text-sm text-primary font-bold">AP Computer Science A — 97% fit</span>
                </div>
                <span className="text-xs text-muted-foreground sm:ml-auto">
                  {profile ? `Based on your ${profile.type} profile` : 'Take the quiz for personalized picks'}
                </span>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tabs */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2} className="mb-6">
            <Tabs value={tab} onValueChange={(v) => { setTab(v as 'courses' | 'activities' | 'majors'); setSearch(''); }}>
              <TabsList className="rounded-xl">
                <TabsTrigger value="courses" className="rounded-lg gap-1.5">
                  <BookOpen size={14} />
                  Courses ({courses.length})
                </TabsTrigger>
                <TabsTrigger value="activities" className="rounded-lg gap-1.5">
                  <Star size={14} />
                  Activities ({activities.length})
                </TabsTrigger>
                <TabsTrigger value="majors" className="rounded-lg gap-1.5">
                  <GraduationCap size={14} />
                  Majors ({filteredMajors.length})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>

          {/* Search — only for courses and activities tabs */}
          {tab !== 'majors' && (
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="mb-5">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={tab === 'courses' ? 'Search courses, subjects, or skills...' : 'Search activities, types, or benefits...'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 rounded-xl"
              />
            </div>
          </motion.div>
          )}

          {/* Category filters — only for courses and activities tabs */}
          {tab !== 'majors' && (
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4} className="mb-5 flex flex-wrap gap-2">
            {(tab === 'courses' ? courseCategories : activityCategories).map((cat) => {
              const active = tab === 'courses' ? courseCategory : activityCategory;
              const setActive = tab === 'courses' ? setCourseCategory : setActivityCategory;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActive(cat.id)}
                  className={cn(
                    'rounded-full px-4 py-1.5 text-sm font-medium transition-all border',
                    active === cat.id
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground',
                  )}
                >
                  {cat.label}
                </button>
              );
            })}
          </motion.div>
          )}

          {/* ── COURSES ── */}
          {tab === 'courses' && (
            <>
              <p className="text-xs text-muted-foreground mb-4">
                Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
              </p>
              {filteredCourses.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                  <BookOpen size={36} className="mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No courses found</p>
                  <p className="text-sm mt-1">Try a different search or category</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredCourses.map((course, i) => (
                    <motion.div key={course.id} initial="hidden" animate="visible" variants={fadeUp} custom={i + 5}>
                      <Card className={cn(
                        'h-full border shadow-sm hover:shadow-md transition-all duration-200 group',
                        course.topPick ? 'border-primary/30' : 'border-border',
                      )}>
                        {course.topPick && <div className="h-1 w-full bg-primary rounded-t-xl" />}
                        <CardContent className="pt-5 pb-5 px-5 flex flex-col h-full">

                          {/* Header */}
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-3">
                              <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', course.iconBg)}>
                                <course.icon size={18} className={course.iconColor} />
                              </div>
                              <div>
                                <h3 className="text-sm font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">
                                  {course.title}
                                </h3>
                                <p className="text-xs text-muted-foreground">{course.subject}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className={cn('rounded-full px-2.5 py-1 text-xs font-bold', matchColor(course.match))}>
                                {course.match}%
                              </span>
                              <button
                                onClick={() => toggleCourse(course.id)}
                                className="p-1 rounded-md hover:bg-muted transition-colors"
                                aria-label={savedCourses.includes(course.id) ? 'Unsave' : 'Save'}
                              >
                                <Bookmark
                                  size={14}
                                  className={savedCourses.includes(course.id) ? 'text-primary fill-primary' : 'text-muted-foreground'}
                                />
                              </button>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">
                            {course.description}
                          </p>

                          {/* Stats row */}
                          <div className="grid grid-cols-3 gap-2 mb-4">
                            {[
                              { icon: GraduationCap, label: 'Grade',    value: course.grade    },
                              { icon: Clock,         label: 'Duration', value: course.duration  },
                              { icon: BookOpen,      label: 'Credits',  value: course.credits   },
                            ].map(({ icon: Icon, label, value }) => (
                              <div key={label} className="rounded-lg bg-muted/40 px-2 py-2 text-center">
                                <Icon size={11} className="mx-auto mb-1 text-primary" />
                                <p className="text-[10px] text-muted-foreground">{label}</p>
                                <p className="text-[10px] font-semibold text-foreground leading-tight mt-0.5">{value}</p>
                              </div>
                            ))}
                          </div>

                          {/* Badges */}
                          <div className="flex flex-wrap items-center gap-1.5 mb-3">
                            <Badge variant="outline" className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium border', levelColor(course.level))}>
                              {course.level}
                            </Badge>
                            <Badge variant="outline" className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium border', impactColor(course.collegeImpact))}>
                              {course.collegeImpact} college impact
                            </Badge>
                          </div>

                          {/* Skills */}
                          <div className="flex flex-wrap gap-1">
                            {course.skills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-[10px] px-2 py-0.5 rounded-full font-normal">
                                {skill}
                              </Badge>
                            ))}
                          </div>

                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── ACTIVITIES ── */}
          {tab === 'activities' && (
            <>
              <p className="text-xs text-muted-foreground mb-4">
                Showing {filteredActivities.length} activit{filteredActivities.length !== 1 ? 'ies' : 'y'}
              </p>
              {filteredActivities.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                  <Star size={36} className="mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No activities found</p>
                  <p className="text-sm mt-1">Try a different search or category</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredActivities.map((activity, i) => (
                    <motion.div key={activity.id} initial="hidden" animate="visible" variants={fadeUp} custom={i + 5}>
                      <Card className={cn(
                        'h-full border shadow-sm hover:shadow-md transition-all duration-200 group',
                        activity.topPick ? 'border-primary/30' : 'border-border',
                      )}>
                        {activity.topPick && <div className="h-1 w-full bg-primary rounded-t-xl" />}
                        <CardContent className="pt-5 pb-5 px-5 flex flex-col h-full">

                          {/* Header */}
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-3">
                              <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', activity.iconBg)}>
                                <activity.icon size={18} className={activity.iconColor} />
                              </div>
                              <div>
                                <h3 className="text-sm font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">
                                  {activity.title}
                                </h3>
                                <p className="text-xs text-muted-foreground">{activity.type}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className={cn('rounded-full px-2.5 py-1 text-xs font-bold', matchColor(activity.match))}>
                                {activity.match}%
                              </span>
                              <button
                                onClick={() => toggleActivity(activity.id)}
                                className="p-1 rounded-md hover:bg-muted transition-colors"
                                aria-label={savedActivities.includes(activity.id) ? 'Unsave' : 'Save'}
                              >
                                <Bookmark
                                  size={14}
                                  className={savedActivities.includes(activity.id) ? 'text-primary fill-primary' : 'text-muted-foreground'}
                                />
                              </button>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">
                            {activity.description}
                          </p>

                          {/* Time commitment */}
                          <div className="flex items-center gap-1.5 mb-4 rounded-lg bg-muted/40 px-3 py-2">
                            <Clock size={12} className="text-primary shrink-0" />
                            <span className="text-xs text-muted-foreground">Time commitment:</span>
                            <span className="text-xs font-semibold text-foreground">{activity.timeCommitment}</span>
                          </div>

                          {/* College impact badge */}
                          <div className="mb-3">
                            <Badge variant="outline" className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium border', impactColor(activity.collegeImpact))}>
                              {activity.collegeImpact} college impact
                            </Badge>
                          </div>

                          {/* Benefits */}
                          <div>
                            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                              Key Benefits
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {activity.benefits.map((benefit) => (
                                <Badge key={benefit} variant="secondary" className="text-[10px] px-2 py-0.5 rounded-full font-normal">
                                  {benefit}
                                </Badge>
                              ))}
                            </div>
                          </div>

                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── MAJORS ── */}
          {tab === 'majors' && (
            <>
              {recommendedCluster && (
                <p className="text-xs text-muted-foreground mb-4">
                  Showing {filteredMajors.length} major{filteredMajors.length !== 1 ? 's' : ''} in the <span className="font-semibold text-foreground">{recommendedCluster}</span> cluster — matched to your profile
                </p>
              )}
              {!recommendedCluster && (
                <p className="text-xs text-muted-foreground mb-4">
                  Showing all {filteredMajors.length} majors — take the quiz for personalized recommendations
                </p>
              )}
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredMajors.map((major, i) => (
                  <motion.div key={major.id} initial="hidden" animate="visible" variants={fadeUp} custom={i + 5}>
                    <Card className="h-full border border-border shadow-sm hover:shadow-md transition-all duration-200 group">
                      <CardContent className="pt-5 pb-5 px-5 flex flex-col h-full">

                        {/* Header */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                              <GraduationCap size={18} className="text-primary" />
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">
                                {major.name}
                              </h3>
                              <p className="text-xs text-muted-foreground mt-0.5">{major.cluster}</p>
                            </div>
                          </div>
                          <div className="shrink-0">
                            <span className="rounded-full px-2.5 py-1 text-xs font-bold bg-emerald-100 text-emerald-700">
                              {major.avgSalary}
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">
                          {major.description}
                        </p>

                        {/* Avg salary stat */}
                        <div className="flex items-center gap-1.5 mb-4 rounded-lg bg-muted/40 px-3 py-2">
                          <DollarSign size={12} className="text-primary shrink-0" />
                          <span className="text-xs text-muted-foreground">Avg. starting salary:</span>
                          <span className="text-xs font-semibold text-foreground">{major.avgSalary}</span>
                        </div>

                        {/* Career paths */}
                        <div>
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                            Career Paths
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {major.careers.map((career) => (
                              <Badge key={career} variant="secondary" className="text-[10px] px-2 py-0.5 rounded-full font-normal">
                                {career}
                              </Badge>
                            ))}
                          </div>
                        </div>

                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {/* CTA */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={20}
            className="mt-10 text-center"
          >
            <p className="text-sm text-muted-foreground mb-3">Want more personalized results?</p>
            <Button asChild className="rounded-xl">
              <Link to="/quiz">Retake the Quiz</Link>
            </Button>
          </motion.div>

        </div>
      </div>
    </>
  );
}
