import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Compass,
  Briefcase,
  FlaskConical,
  Palette,
  Users,
  Globe,
  Heart,
  Code2,
  BookOpen,
  MessageSquare,
  Calculator,
  Wrench,
  Target,
  TrendingUp,
  Award,
  Handshake,
  Rocket,
  GraduationCap,
  Building2,
  Brain,
  PenLine,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useProfile } from '@/lib/profile-context';
import { useLanguage } from '@/lib/i18n';

// ─── Types ───────────────────────────────────────────────────────────────────

// Each option directly awards points to one or more buckets.
// Weights: 3 = strong signal, 2 = moderate, 1 = mild, 0 = neutral
interface Scores {
  stem:     number;
  creative: number;
  social:   number;
  business: number;
}

interface Option {
  id: string;
  label: string;
  icon: React.ElementType;
  scores: Scores;
}

interface Step {
  id: string;
  title: string;
  subtitle: string;
  type: 'multi' | 'single';
  options: Option[];
}

// ─── Section labels ───────────────────────────────────────────────────────────

const SECTION_LABEL_KEYS = ['interests', 'strengths', 'schoolLife', 'futureGoals', 'careerSignals'] as const;
type SectionKey = typeof SECTION_LABEL_KEYS[number];

function getSectionKey(stepIndex: number): SectionKey {
  return SECTION_LABEL_KEYS[Math.floor(stepIndex / 5)] ?? 'interests';
}

// ─── Step id → translation key map ───────────────────────────────────────────

const STEP_QUESTION_KEY: Record<string, keyof import('@/lib/i18n').Translations['quiz']['questions']> = {
  'work-excites':    'workExcites',
  'subjects':        'subjects',
  'interesting':     'interesting',
  'work-with':       'workWith',
  'motivation':      'motivation',
  'strongest':       'strongest',
  'problem-solving': 'problemSolving',
  'easiest':         'easiest',
  'learning':        'learning',
  'personality':     'personality',
  'fav-subjects':    'favSubjects',
  'assignments':     'assignments',
  'ap-attitude':     'apAttitude',
  'coding-interest': 'codingInterest',
  'school-mindset':  'schoolMindset',
  'goals':           'goals',
  'college':         'college',
  'hard-classes':    'hardClasses',
  'internships':     'internships',
  'planning':        'planning',
  'field':           'field',
  'work-style':      'workStyle',
  'team':            'team',
  'risk':            'risk',
  'life-goal':       'lifeGoal',
};

// ─── Quiz data ────────────────────────────────────────────────────────────────
// 25 questions across 5 sections · every option has explicit bucket weights.
// Weights: 3 = strong signal  2 = moderate  1 = mild  0 = none
// Goals + Life Goal steps get 2× multiplier — strongest signals.

const steps: Step[] = [

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 1 · INTERESTS
  // ════════════════════════════════════════════════════════════════════════════

  // Q1 · What type of work excites you most?
  {
    id: 'work-excites',
    title: 'What type of work excites you most?',
    subtitle: 'Pick everything that genuinely lights you up.',
    type: 'multi',
    options: [
      { id: 'we-math',     label: 'Solving math or logic problems',  icon: Calculator,    scores: { stem: 3, creative: 0, social: 0, business: 1 } },
      { id: 'we-apps',     label: 'Building apps or tech',           icon: Code2,         scores: { stem: 3, creative: 1, social: 0, business: 1 } },
      { id: 'we-design',   label: 'Designing creative projects',     icon: Palette,       scores: { stem: 0, creative: 3, social: 1, business: 1 } },
      { id: 'we-business', label: 'Starting a business',             icon: Briefcase,     scores: { stem: 0, creative: 1, social: 0, business: 3 } },
      { id: 'we-people',   label: 'Helping people directly',         icon: Heart,         scores: { stem: 0, creative: 0, social: 3, business: 1 } },
      { id: 'we-data',     label: 'Working with data',               icon: Brain,         scores: { stem: 3, creative: 0, social: 0, business: 2 } },
      { id: 'we-content',  label: 'Creating videos or art',          icon: Sparkles,      scores: { stem: 0, creative: 3, social: 1, business: 1 } },
      { id: 'we-lead',     label: 'Leading teams',                   icon: Users,         scores: { stem: 0, creative: 0, social: 2, business: 3 } },
      { id: 'we-research', label: 'Researching deep topics',         icon: BookOpen,      scores: { stem: 3, creative: 1, social: 1, business: 0 } },
      { id: 'we-writing',  label: 'Writing stories or essays',       icon: PenLine,       scores: { stem: 0, creative: 3, social: 2, business: 0 } },
      { id: 'we-build',    label: 'Building physical things',        icon: Wrench,        scores: { stem: 3, creative: 2, social: 0, business: 0 } },
    ],
  },

  // Q2 · What subjects do you enjoy most?
  {
    id: 'subjects',
    title: 'What subjects do you enjoy most?',
    subtitle: 'Select all that genuinely interest you.',
    type: 'multi',
    options: [
      { id: 'sub-math',    label: 'Math',              icon: Calculator,    scores: { stem: 3, creative: 0, social: 0, business: 1 } },
      { id: 'sub-bio',     label: 'Biology',           icon: FlaskConical,  scores: { stem: 3, creative: 0, social: 1, business: 0 } },
      { id: 'sub-chem',    label: 'Chemistry',         icon: FlaskConical,  scores: { stem: 3, creative: 0, social: 0, business: 0 } },
      { id: 'sub-physics', label: 'Physics',           icon: Rocket,        scores: { stem: 3, creative: 0, social: 0, business: 0 } },
      { id: 'sub-cs',      label: 'Computer Science',  icon: Code2,         scores: { stem: 3, creative: 1, social: 0, business: 1 } },
      { id: 'sub-biz',     label: 'Business / Econ',   icon: Briefcase,     scores: { stem: 1, creative: 0, social: 1, business: 3 } },
      { id: 'sub-english', label: 'English',           icon: PenLine,       scores: { stem: 0, creative: 3, social: 2, business: 0 } },
      { id: 'sub-history', label: 'History',           icon: BookOpen,      scores: { stem: 0, creative: 1, social: 3, business: 0 } },
      { id: 'sub-psych',   label: 'Psychology',        icon: Brain,         scores: { stem: 1, creative: 1, social: 3, business: 0 } },
      { id: 'sub-art',     label: 'Art / Design',      icon: Palette,       scores: { stem: 0, creative: 3, social: 1, business: 0 } },
      { id: 'sub-eng',     label: 'Engineering',       icon: Wrench,        scores: { stem: 3, creative: 1, social: 0, business: 0 } },
    ],
  },

  // Q3 · What sounds most interesting?
  {
    id: 'interesting',
    title: 'What sounds most interesting to you?',
    subtitle: 'Pick everything that genuinely appeals to you.',
    type: 'multi',
    options: [
      { id: 'int-coding',   label: 'Coding apps',                  icon: Code2,         scores: { stem: 3, creative: 1, social: 0, business: 1 } },
      { id: 'int-company',  label: 'Running a company',            icon: Building2,     scores: { stem: 0, creative: 0, social: 1, business: 3 } },
      { id: 'int-help',     label: 'Helping people in need',       icon: Heart,         scores: { stem: 0, creative: 0, social: 3, business: 0 } },
      { id: 'int-products', label: 'Designing products',           icon: Palette,       scores: { stem: 1, creative: 3, social: 0, business: 1 } },
      { id: 'int-behavior', label: 'Studying human behavior',      icon: Brain,         scores: { stem: 1, creative: 1, social: 3, business: 0 } },
      { id: 'int-science',  label: 'Solving scientific problems',  icon: FlaskConical,  scores: { stem: 3, creative: 0, social: 0, business: 0 } },
      { id: 'int-content',  label: 'Creating content online',      icon: Sparkles,      scores: { stem: 0, creative: 3, social: 2, business: 1 } },
      { id: 'int-lead',     label: 'Leading a team',               icon: Users,         scores: { stem: 0, creative: 0, social: 2, business: 3 } },
      { id: 'int-writing',  label: 'Writing books or articles',    icon: PenLine,       scores: { stem: 0, creative: 3, social: 1, business: 0 } },
      { id: 'int-robots',   label: 'Building robots',              icon: Wrench,        scores: { stem: 3, creative: 2, social: 0, business: 0 } },
      { id: 'int-data',     label: 'Analyzing data',               icon: Calculator,    scores: { stem: 3, creative: 0, social: 0, business: 2 } },
    ],
  },

  // Q4 · What do you prefer working with?
  {
    id: 'work-with',
    title: 'What do you prefer working with?',
    subtitle: 'Pick everything that feels natural to you.',
    type: 'multi',
    options: [
      { id: 'ww-numbers',  label: 'Numbers',     icon: Calculator,    scores: { stem: 3, creative: 0, social: 0, business: 2 } },
      { id: 'ww-people',   label: 'People',      icon: Users,         scores: { stem: 0, creative: 0, social: 3, business: 2 } },
      { id: 'ww-ideas',    label: 'Ideas',       icon: Sparkles,      scores: { stem: 1, creative: 3, social: 1, business: 1 } },
      { id: 'ww-machines', label: 'Machines',    icon: Wrench,        scores: { stem: 3, creative: 1, social: 0, business: 0 } },
      { id: 'ww-data',     label: 'Data',        icon: Brain,         scores: { stem: 3, creative: 0, social: 0, business: 2 } },
      { id: 'ww-words',    label: 'Words',       icon: PenLine,       scores: { stem: 0, creative: 3, social: 2, business: 1 } },
      { id: 'ww-art',      label: 'Art',         icon: Palette,       scores: { stem: 0, creative: 3, social: 1, business: 0 } },
      { id: 'ww-systems',  label: 'Systems',     icon: Building2,     scores: { stem: 3, creative: 0, social: 0, business: 2 } },
      { id: 'ww-problems', label: 'Problems',    icon: Target,        scores: { stem: 2, creative: 1, social: 1, business: 2 } },
      { id: 'ww-teams',    label: 'Teams',       icon: Handshake,     scores: { stem: 0, creative: 1, social: 2, business: 3 } },
      { id: 'ww-tech',     label: 'Technology',  icon: Code2,         scores: { stem: 3, creative: 1, social: 0, business: 1 } },
    ],
  },

  // Q5 · What motivates you most?
  {
    id: 'motivation',
    title: 'What motivates you most?',
    subtitle: 'Pick your top motivators — be honest with yourself.',
    type: 'multi',
    options: [
      { id: 'mot-money',     label: 'Money',          icon: TrendingUp,    scores: { stem: 1, creative: 0, social: 0, business: 3 } },
      { id: 'mot-helping',   label: 'Helping others', icon: Heart,         scores: { stem: 0, creative: 0, social: 3, business: 0 } },
      { id: 'mot-creative',  label: 'Creativity',     icon: Palette,       scores: { stem: 0, creative: 3, social: 0, business: 0 } },
      { id: 'mot-innovation',label: 'Innovation',     icon: Rocket,        scores: { stem: 3, creative: 2, social: 0, business: 1 } },
      { id: 'mot-prestige',  label: 'Prestige',       icon: Award,         scores: { stem: 2, creative: 0, social: 0, business: 2 } },
      { id: 'mot-freedom',   label: 'Freedom',        icon: Globe,         scores: { stem: 0, creative: 2, social: 1, business: 2 } },
      { id: 'mot-success',   label: 'Success',        icon: Target,        scores: { stem: 1, creative: 1, social: 0, business: 3 } },
      { id: 'mot-learning',  label: 'Learning',       icon: BookOpen,      scores: { stem: 3, creative: 1, social: 1, business: 0 } },
      { id: 'mot-leadership',label: 'Leadership',     icon: Users,         scores: { stem: 0, creative: 0, social: 2, business: 3 } },
      { id: 'mot-stability', label: 'Stability',      icon: Building2,     scores: { stem: 1, creative: 0, social: 1, business: 2 } },
      { id: 'mot-impact',    label: 'Impact',         icon: Sparkles,      scores: { stem: 1, creative: 1, social: 3, business: 1 } },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 2 · STRENGTHS
  // ════════════════════════════════════════════════════════════════════════════

  // Q6 · What are you strongest at?
  {
    id: 'strongest',
    title: 'What are you strongest at?',
    subtitle: 'Pick the skills that come most naturally to you.',
    type: 'multi',
    options: [
      { id: 'str-math',    label: 'Math',                   icon: Calculator,    scores: { stem: 3, creative: 0, social: 0, business: 1 } },
      { id: 'str-writing', label: 'Writing',                icon: PenLine,       scores: { stem: 0, creative: 3, social: 1, business: 1 } },
      { id: 'str-comm',    label: 'Communication',          icon: MessageSquare, scores: { stem: 0, creative: 1, social: 3, business: 2 } },
      { id: 'str-create',  label: 'Creativity',             icon: Sparkles,      scores: { stem: 0, creative: 3, social: 1, business: 1 } },
      { id: 'str-lead',    label: 'Leadership',             icon: Target,        scores: { stem: 0, creative: 0, social: 2, business: 3 } },
      { id: 'str-org',     label: 'Organization',           icon: Building2,     scores: { stem: 1, creative: 0, social: 1, business: 3 } },
      { id: 'str-problem', label: 'Problem solving',        icon: Brain,         scores: { stem: 3, creative: 1, social: 1, business: 2 } },
      { id: 'str-coding',  label: 'Coding',                 icon: Code2,         scores: { stem: 3, creative: 1, social: 0, business: 1 } },
      { id: 'str-design',  label: 'Design',                 icon: Palette,       scores: { stem: 0, creative: 3, social: 0, business: 1 } },
      { id: 'str-empathy', label: 'Emotional understanding',icon: Heart,         scores: { stem: 0, creative: 1, social: 3, business: 0 } },
      { id: 'str-research',label: 'Research',               icon: BookOpen,      scores: { stem: 3, creative: 1, social: 1, business: 0 } },
    ],
  },

  // Q7 · How do you solve problems?
  {
    id: 'problem-solving',
    title: 'How do you solve problems?',
    subtitle: 'Pick the approaches that feel most natural.',
    type: 'multi',
    options: [
      { id: 'ps-logic',    label: 'Step-by-step logic',      icon: Brain,         scores: { stem: 3, creative: 0, social: 0, business: 1 } },
      { id: 'ps-creative', label: 'Creative thinking',       icon: Sparkles,      scores: { stem: 0, creative: 3, social: 1, business: 1 } },
      { id: 'ps-ask',      label: 'Asking others',           icon: Users,         scores: { stem: 0, creative: 0, social: 3, business: 1 } },
      { id: 'ps-research', label: 'Researching deeply',      icon: BookOpen,      scores: { stem: 3, creative: 1, social: 0, business: 0 } },
      { id: 'ps-trial',    label: 'Trial and error',         icon: Wrench,        scores: { stem: 2, creative: 2, social: 0, business: 1 } },
      { id: 'ps-data',     label: 'Data analysis',           icon: Calculator,    scores: { stem: 3, creative: 0, social: 0, business: 2 } },
      { id: 'ps-collab',   label: 'Collaboration',           icon: Handshake,     scores: { stem: 0, creative: 1, social: 3, business: 2 } },
      { id: 'ps-fast',     label: 'Fast decision-making',    icon: Rocket,        scores: { stem: 0, creative: 1, social: 0, business: 3 } },
      { id: 'ps-plan',     label: 'Structured planning',     icon: Target,        scores: { stem: 2, creative: 0, social: 1, business: 3 } },
      { id: 'ps-intuition',label: 'Intuition',               icon: Compass,       scores: { stem: 0, creative: 2, social: 2, business: 1 } },
      { id: 'ps-hands',    label: 'Hands-on testing',        icon: FlaskConical,  scores: { stem: 2, creative: 2, social: 0, business: 0 } },
    ],
  },

  // Q8 · What comes easiest to you?
  {
    id: 'easiest',
    title: 'What comes easiest to you?',
    subtitle: 'Pick the tasks that feel almost effortless.',
    type: 'multi',
    options: [
      { id: 'ez-math',     label: 'Math problems',      icon: Calculator,    scores: { stem: 3, creative: 0, social: 0, business: 1 } },
      { id: 'ez-essays',   label: 'Essays',             icon: PenLine,       scores: { stem: 0, creative: 3, social: 1, business: 0 } },
      { id: 'ez-speaking', label: 'Speaking',           icon: MessageSquare, scores: { stem: 0, creative: 1, social: 3, business: 2 } },
      { id: 'ez-design',   label: 'Designing things',   icon: Palette,       scores: { stem: 0, creative: 3, social: 0, business: 1 } },
      { id: 'ez-group',    label: 'Group work',         icon: Users,         scores: { stem: 0, creative: 0, social: 3, business: 2 } },
      { id: 'ez-tech',     label: 'Technical tasks',    icon: Code2,         scores: { stem: 3, creative: 1, social: 0, business: 1 } },
      { id: 'ez-ideas',    label: 'Creative ideas',     icon: Sparkles,      scores: { stem: 0, creative: 3, social: 1, business: 1 } },
      { id: 'ez-lead',     label: 'Leadership tasks',   icon: Target,        scores: { stem: 0, creative: 0, social: 1, business: 3 } },
      { id: 'ez-research', label: 'Research',           icon: BookOpen,      scores: { stem: 3, creative: 1, social: 1, business: 0 } },
      { id: 'ez-org',      label: 'Organizing work',    icon: Building2,     scores: { stem: 1, creative: 0, social: 1, business: 3 } },
      { id: 'ez-build',    label: 'Building things',    icon: Wrench,        scores: { stem: 3, creative: 2, social: 0, business: 0 } },
    ],
  },

  // Q9 · How do you learn best?
  {
    id: 'learning',
    title: 'How do you learn best?',
    subtitle: 'Pick the styles that match how you actually absorb information.',
    type: 'multi',
    options: [
      { id: 'lrn-practice',label: 'Practice',           icon: Wrench,        scores: { stem: 2, creative: 2, social: 0, business: 1 } },
      { id: 'lrn-reading', label: 'Reading',            icon: BookOpen,      scores: { stem: 2, creative: 1, social: 0, business: 1 } },
      { id: 'lrn-videos',  label: 'Videos',             icon: Sparkles,      scores: { stem: 1, creative: 3, social: 0, business: 1 } },
      { id: 'lrn-hands',   label: 'Hands-on',           icon: FlaskConical,  scores: { stem: 2, creative: 2, social: 0, business: 1 } },
      { id: 'lrn-discuss', label: 'Group discussion',   icon: MessageSquare, scores: { stem: 0, creative: 1, social: 3, business: 2 } },
      { id: 'lrn-projects',label: 'Projects',           icon: Target,        scores: { stem: 2, creative: 2, social: 1, business: 2 } },
      { id: 'lrn-teach',   label: 'Teaching others',    icon: Users,         scores: { stem: 0, creative: 1, social: 3, business: 1 } },
      { id: 'lrn-exp',     label: 'Experimenting',      icon: Brain,         scores: { stem: 3, creative: 2, social: 0, business: 0 } },
      { id: 'lrn-notes',   label: 'Notes / lectures',   icon: PenLine,       scores: { stem: 2, creative: 0, social: 0, business: 1 } },
      { id: 'lrn-solve',   label: 'Problem solving',    icon: Calculator,    scores: { stem: 3, creative: 1, social: 0, business: 2 } },
      { id: 'lrn-visual',  label: 'Visual learning',    icon: Palette,       scores: { stem: 1, creative: 3, social: 0, business: 1 } },
    ],
  },

  // Q10 · Which describes you best?
  {
    id: 'personality',
    title: 'Which words describe you best?',
    subtitle: 'Pick everything that genuinely fits your personality.',
    type: 'multi',
    options: [
      { id: 'per-logical',    label: 'Logical',      icon: Brain,         scores: { stem: 3, creative: 0, social: 0, business: 1 } },
      { id: 'per-creative',   label: 'Creative',     icon: Palette,       scores: { stem: 0, creative: 3, social: 1, business: 0 } },
      { id: 'per-social',     label: 'Social',       icon: Users,         scores: { stem: 0, creative: 0, social: 3, business: 1 } },
      { id: 'per-organized',  label: 'Organized',    icon: Target,        scores: { stem: 1, creative: 0, social: 0, business: 3 } },
      { id: 'per-curious',    label: 'Curious',      icon: Compass,       scores: { stem: 2, creative: 2, social: 1, business: 0 } },
      { id: 'per-leader',     label: 'Leader',       icon: Award,         scores: { stem: 0, creative: 0, social: 2, business: 3 } },
      { id: 'per-independent',label: 'Independent',  icon: Rocket,        scores: { stem: 2, creative: 2, social: 0, business: 1 } },
      { id: 'per-analytical', label: 'Analytical',   icon: Calculator,    scores: { stem: 3, creative: 0, social: 0, business: 2 } },
      { id: 'per-expressive', label: 'Expressive',   icon: Sparkles,      scores: { stem: 0, creative: 3, social: 2, business: 0 } },
      { id: 'per-hardworking',label: 'Hard-working', icon: Wrench,        scores: { stem: 1, creative: 1, social: 1, business: 2 } },
      { id: 'per-innovative', label: 'Innovative',   icon: FlaskConical,  scores: { stem: 2, creative: 2, social: 0, business: 2 } },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 3 · SCHOOL LIFE
  // ════════════════════════════════════════════════════════════════════════════

  // Q11 · Favorite subjects?
  {
    id: 'fav-subjects',
    title: 'What are your favorite subjects in school?',
    subtitle: 'Pick everything you genuinely enjoy.',
    type: 'multi',
    options: [
      { id: 'fs-math',    label: 'Math',            icon: Calculator,    scores: { stem: 3, creative: 0, social: 0, business: 1 } },
      { id: 'fs-science', label: 'Science',         icon: FlaskConical,  scores: { stem: 3, creative: 0, social: 1, business: 0 } },
      { id: 'fs-english', label: 'English',         icon: PenLine,       scores: { stem: 0, creative: 3, social: 2, business: 0 } },
      { id: 'fs-biz',     label: 'Business',        icon: Briefcase,     scores: { stem: 0, creative: 0, social: 1, business: 3 } },
      { id: 'fs-art',     label: 'Art',             icon: Palette,       scores: { stem: 0, creative: 3, social: 1, business: 0 } },
      { id: 'fs-cs',      label: 'Computer Science',icon: Code2,         scores: { stem: 3, creative: 1, social: 0, business: 1 } },
      { id: 'fs-history', label: 'History',         icon: BookOpen,      scores: { stem: 0, creative: 1, social: 3, business: 0 } },
      { id: 'fs-psych',   label: 'Psychology',      icon: Brain,         scores: { stem: 1, creative: 1, social: 3, business: 0 } },
      { id: 'fs-econ',    label: 'Economics',       icon: TrendingUp,    scores: { stem: 2, creative: 0, social: 1, business: 3 } },
      { id: 'fs-eng',     label: 'Engineering',     icon: Wrench,        scores: { stem: 3, creative: 1, social: 0, business: 0 } },
      { id: 'fs-media',   label: 'Media',           icon: Sparkles,      scores: { stem: 0, creative: 3, social: 2, business: 1 } },
    ],
  },

  // Q12 · Preferred assignments?
  {
    id: 'assignments',
    title: 'What types of assignments do you prefer?',
    subtitle: 'Pick the formats where you do your best work.',
    type: 'multi',
    options: [
      { id: 'asgn-tests',    label: 'Tests',           icon: Target,        scores: { stem: 3, creative: 0, social: 0, business: 1 } },
      { id: 'asgn-essays',   label: 'Essays',          icon: PenLine,       scores: { stem: 0, creative: 3, social: 1, business: 0 } },
      { id: 'asgn-projects', label: 'Projects',        icon: Wrench,        scores: { stem: 2, creative: 2, social: 1, business: 2 } },
      { id: 'asgn-present',  label: 'Presentations',   icon: MessageSquare, scores: { stem: 0, creative: 1, social: 3, business: 2 } },
      { id: 'asgn-coding',   label: 'Coding tasks',    icon: Code2,         scores: { stem: 3, creative: 1, social: 0, business: 1 } },
      { id: 'asgn-group',    label: 'Group work',      icon: Users,         scores: { stem: 0, creative: 1, social: 3, business: 2 } },
      { id: 'asgn-creative', label: 'Creative work',   icon: Palette,       scores: { stem: 0, creative: 3, social: 1, business: 0 } },
      { id: 'asgn-research', label: 'Research papers', icon: BookOpen,      scores: { stem: 2, creative: 1, social: 1, business: 0 } },
      { id: 'asgn-labs',     label: 'Labs',            icon: FlaskConical,  scores: { stem: 3, creative: 1, social: 0, business: 0 } },
      { id: 'asgn-case',     label: 'Case studies',    icon: Brain,         scores: { stem: 1, creative: 1, social: 1, business: 3 } },
      { id: 'asgn-design',   label: 'Design work',     icon: Sparkles,      scores: { stem: 0, creative: 3, social: 0, business: 1 } },
    ],
  },

  // Q13 · AP / honors attitude?
  {
    id: 'ap-attitude',
    title: 'How do you feel about AP or honors classes?',
    subtitle: 'Pick the statement that best matches your mindset.',
    type: 'single',
    options: [
      { id: 'ap-love',     label: 'I love the challenge — bring it on',         icon: Rocket,        scores: { stem: 2, creative: 1, social: 0, business: 2 } },
      { id: 'ap-some',     label: 'I can handle some, not all',                 icon: Target,        scores: { stem: 1, creative: 1, social: 1, business: 1 } },
      { id: 'ap-easier',   label: 'I prefer easier classes',                    icon: Globe,         scores: { stem: 0, creative: 1, social: 2, business: 0 } },
      { id: 'ap-rigor',    label: 'I want top academic rigor',                  icon: Award,         scores: { stem: 3, creative: 0, social: 0, business: 2 } },
      { id: 'ap-balance',  label: 'I focus on balance, not just grades',        icon: Heart,         scores: { stem: 0, creative: 1, social: 2, business: 0 } },
      { id: 'ap-push',     label: 'I push myself in subjects I care about',     icon: Brain,         scores: { stem: 2, creative: 2, social: 0, business: 1 } },
      { id: 'ap-stress',   label: 'I avoid stress — grades aren\'t everything', icon: Compass,       scores: { stem: 0, creative: 2, social: 2, business: 0 } },
      { id: 'ap-prep',     label: 'I want strong college prep',                 icon: GraduationCap, scores: { stem: 2, creative: 0, social: 0, business: 3 } },
    ],
  },

  // Q14 · Coding interest?
  {
    id: 'coding-interest',
    title: 'How do you feel about coding?',
    subtitle: 'Be honest — this helps us match you to the right tech-related paths.',
    type: 'single',
    options: [
      { id: 'code-love',    label: 'I love it — coding is my thing',        icon: Code2,         scores: { stem: 3, creative: 1, social: 0, business: 1 } },
      { id: 'code-like',    label: 'I like it and want to do more',         icon: Rocket,        scores: { stem: 3, creative: 1, social: 0, business: 1 } },
      { id: 'code-neutral', label: 'Neutral — it\'s fine but not my focus', icon: Compass,       scores: { stem: 1, creative: 1, social: 1, business: 1 } },
      { id: 'code-apps',    label: 'Interested in building apps',           icon: Sparkles,      scores: { stem: 2, creative: 2, social: 0, business: 1 } },
      { id: 'code-games',   label: 'Interested in game development',        icon: Target,        scores: { stem: 2, creative: 3, social: 0, business: 0 } },
      { id: 'code-try',     label: 'I want to try it but haven\'t yet',     icon: Brain,         scores: { stem: 2, creative: 1, social: 0, business: 0 } },
      { id: 'code-curious', label: 'Curious but not sure it\'s for me',     icon: BookOpen,      scores: { stem: 1, creative: 1, social: 0, business: 0 } },
      { id: 'code-no',      label: 'Not interested in coding',              icon: Heart,         scores: { stem: 0, creative: 1, social: 2, business: 1 } },
    ],
  },

  // Q15 · School mindset?
  {
    id: 'school-mindset',
    title: 'What best describes your school mindset?',
    subtitle: 'Pick the one that feels most true.',
    type: 'single',
    options: [
      { id: 'sm-grades',   label: 'Grades focused — I want top marks',         icon: Award,         scores: { stem: 2, creative: 0, social: 0, business: 2 } },
      { id: 'sm-learning', label: 'Learning focused — I love understanding',   icon: BookOpen,      scores: { stem: 3, creative: 1, social: 1, business: 0 } },
      { id: 'sm-balanced', label: 'Balanced — grades and life both matter',    icon: Globe,         scores: { stem: 1, creative: 1, social: 1, business: 1 } },
      { id: 'sm-curious',  label: 'Curious — I explore beyond the curriculum', icon: Compass,       scores: { stem: 2, creative: 2, social: 1, business: 0 } },
      { id: 'sm-goals',    label: 'Goal-driven — I know what I\'m working for',icon: Target,        scores: { stem: 1, creative: 0, social: 0, business: 3 } },
      { id: 'sm-compete',  label: 'Competitive — I want to be the best',       icon: TrendingUp,    scores: { stem: 2, creative: 0, social: 0, business: 3 } },
      { id: 'sm-explore',  label: 'Exploration focused — I try everything',    icon: Rocket,        scores: { stem: 1, creative: 2, social: 2, business: 0 } },
      { id: 'sm-relaxed',  label: 'Relaxed — I go with the flow',              icon: Heart,         scores: { stem: 0, creative: 1, social: 2, business: 0 } },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 4 · FUTURE GOALS
  // ════════════════════════════════════════════════════════════════════════════

  // Q16 · What matters most? (2× multiplier)
  {
    id: 'goals',
    title: 'What matters most to you in your future career?',
    subtitle: 'This carries the most weight in your profile — pick your top priorities.',
    type: 'multi',
    options: [
      { id: 'gl-money',     label: 'Money',          icon: TrendingUp,    scores: { stem: 1, creative: 0, social: 0, business: 3 } },
      { id: 'gl-impact',    label: 'Impact',         icon: Heart,         scores: { stem: 1, creative: 1, social: 3, business: 0 } },
      { id: 'gl-creative',  label: 'Creativity',     icon: Palette,       scores: { stem: 0, creative: 3, social: 0, business: 0 } },
      { id: 'gl-freedom',   label: 'Freedom',        icon: Globe,         scores: { stem: 0, creative: 2, social: 1, business: 2 } },
      { id: 'gl-prestige',  label: 'Prestige',       icon: Award,         scores: { stem: 2, creative: 0, social: 0, business: 2 } },
      { id: 'gl-stability', label: 'Stability',      icon: Building2,     scores: { stem: 1, creative: 0, social: 1, business: 2 } },
      { id: 'gl-innovation',label: 'Innovation',     icon: Rocket,        scores: { stem: 3, creative: 2, social: 0, business: 1 } },
      { id: 'gl-helping',   label: 'Helping people', icon: Handshake,     scores: { stem: 0, creative: 0, social: 3, business: 0 } },
      { id: 'gl-lead',      label: 'Leadership',     icon: Target,        scores: { stem: 0, creative: 0, social: 2, business: 3 } },
      { id: 'gl-balance',   label: 'Balance',        icon: Compass,       scores: { stem: 0, creative: 1, social: 2, business: 1 } },
      { id: 'gl-success',   label: 'Success',        icon: Sparkles,      scores: { stem: 1, creative: 1, social: 0, business: 3 } },
    ],
  },

  // Q17 · College goal?
  {
    id: 'college',
    title: 'What is your college goal?',
    subtitle: 'Pick the option that best matches your college ambitions.',
    type: 'single',
    options: [
      { id: 'col-ivy',     label: 'Ivy League — I\'m aiming for the top',      icon: Award,         scores: { stem: 2, creative: 1, social: 1, business: 2 } },
      { id: 'col-uc',      label: 'UC schools — strong public universities',   icon: Building2,     scores: { stem: 2, creative: 1, social: 1, business: 1 } },
      { id: 'col-private', label: 'Top private schools',                       icon: GraduationCap, scores: { stem: 2, creative: 1, social: 0, business: 2 } },
      { id: 'col-state',   label: 'Good state schools',                        icon: Globe,         scores: { stem: 1, creative: 1, social: 1, business: 1 } },
      { id: 'col-rank',    label: 'High ranking — prestige matters to me',     icon: TrendingUp,    scores: { stem: 2, creative: 0, social: 0, business: 2 } },
      { id: 'col-fit',     label: 'Best fit — culture and programs matter most',icon: Heart,        scores: { stem: 1, creative: 2, social: 2, business: 0 } },
      { id: 'col-afford',  label: 'Affordable — cost is a major factor',       icon: Compass,       scores: { stem: 1, creative: 1, social: 1, business: 1 } },
      { id: 'col-notsure', label: 'Not sure yet',                              icon: Sparkles,      scores: { stem: 1, creative: 1, social: 1, business: 1 } },
    ],
  },

  // Q18 · Hard classes?
  {
    id: 'hard-classes',
    title: 'Are you willing to take hard classes to reach your goals?',
    subtitle: 'Pick the statement that best matches your approach.',
    type: 'single',
    options: [
      { id: 'hc-allin',   label: 'Yes — all in, I want the hardest path',    icon: Rocket,        scores: { stem: 2, creative: 0, social: 0, business: 2 } },
      { id: 'hc-mostly',  label: 'Mostly yes — I push myself',               icon: Target,        scores: { stem: 2, creative: 1, social: 0, business: 2 } },
      { id: 'hc-some',    label: 'Some — depends on the subject',            icon: Compass,       scores: { stem: 1, creative: 1, social: 1, business: 1 } },
      { id: 'hc-balance', label: 'I prefer balance over maximum rigor',      icon: Heart,         scores: { stem: 0, creative: 1, social: 2, business: 0 } },
      { id: 'hc-stress',  label: 'I avoid stress — wellbeing comes first',   icon: Globe,         scores: { stem: 0, creative: 1, social: 2, business: 0 } },
      { id: 'hc-push',    label: 'I push sometimes but not always',          icon: Brain,         scores: { stem: 1, creative: 1, social: 1, business: 1 } },
      { id: 'hc-mixed',   label: 'Mixed — I\'m still figuring it out',       icon: Sparkles,      scores: { stem: 1, creative: 1, social: 1, business: 1 } },
      { id: 'hc-no',      label: 'No — I prefer an easier path',             icon: BookOpen,      scores: { stem: 0, creative: 1, social: 1, business: 0 } },
    ],
  },

  // Q19 · Internships?
  {
    id: 'internships',
    title: 'How important are internships and real-world experience to you?',
    subtitle: 'Pick the option that best matches your mindset.',
    type: 'single',
    options: [
      { id: 'int-early',    label: 'Very important — I want internships early',    icon: Rocket,        scores: { stem: 1, creative: 1, social: 1, business: 3 } },
      { id: 'int-tech',     label: 'Tech internships are my priority',             icon: Code2,         scores: { stem: 3, creative: 1, social: 0, business: 1 } },
      { id: 'int-biz',      label: 'Business internships are my priority',         icon: Briefcase,     scores: { stem: 0, creative: 0, social: 0, business: 3 } },
      { id: 'int-creative', label: 'Creative internships are my priority',         icon: Palette,       scores: { stem: 0, creative: 3, social: 1, business: 0 } },
      { id: 'int-research', label: 'Research internships are my priority',         icon: FlaskConical,  scores: { stem: 3, creative: 0, social: 1, business: 0 } },
      { id: 'int-later',    label: 'Maybe later — I\'ll focus on school first',    icon: BookOpen,      scores: { stem: 1, creative: 1, social: 1, business: 1 } },
      { id: 'int-flexible', label: 'Flexible — I\'ll take what comes',             icon: Globe,         scores: { stem: 1, creative: 1, social: 1, business: 1 } },
      { id: 'int-notsure',  label: 'Not sure yet',                                 icon: Compass,       scores: { stem: 1, creative: 1, social: 1, business: 1 } },
    ],
  },

  // Q20 · Planning style?
  {
    id: 'planning',
    title: 'What is your planning style?',
    subtitle: 'Pick the approach that best describes how you think about your future.',
    type: 'single',
    options: [
      { id: 'plan-strict',   label: 'Strict plan — I know exactly what I want',   icon: Target,        scores: { stem: 1, creative: 0, social: 0, business: 3 } },
      { id: 'plan-flexible', label: 'Flexible plan — I have a direction',         icon: Compass,       scores: { stem: 1, creative: 1, social: 1, business: 2 } },
      { id: 'plan-roadmap',  label: 'Detailed roadmap — step by step',            icon: Brain,         scores: { stem: 2, creative: 0, social: 0, business: 3 } },
      { id: 'plan-guided',   label: 'Guided — I want help figuring it out',       icon: GraduationCap, scores: { stem: 1, creative: 1, social: 1, business: 1 } },
      { id: 'plan-open',     label: 'Open-ended — I\'ll explore and decide',      icon: Globe,         scores: { stem: 1, creative: 2, social: 2, business: 0 } },
      { id: 'plan-adaptive', label: 'Adaptive — I adjust as I learn more',        icon: Sparkles,      scores: { stem: 1, creative: 2, social: 1, business: 1 } },
      { id: 'plan-simple',   label: 'Simple guidance — just point me in a direction', icon: Rocket,    scores: { stem: 1, creative: 1, social: 1, business: 1 } },
      { id: 'plan-none',     label: 'No plan — I go with the flow',               icon: Heart,         scores: { stem: 0, creative: 2, social: 2, business: 0 } },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 5 · CAREER SIGNALS
  // ════════════════════════════════════════════════════════════════════════════

  // Q21 · Field preference?
  {
    id: 'field',
    title: 'Which career field appeals to you most?',
    subtitle: 'Pick everything that genuinely interests you.',
    type: 'multi',
    options: [
      { id: 'fld-stem',    label: 'STEM',       icon: FlaskConical,  scores: { stem: 3, creative: 0, social: 0, business: 0 } },
      { id: 'fld-biz',     label: 'Business',   icon: Briefcase,     scores: { stem: 0, creative: 0, social: 0, business: 3 } },
      { id: 'fld-creative',label: 'Creative',   icon: Palette,       scores: { stem: 0, creative: 3, social: 0, business: 0 } },
      { id: 'fld-social',  label: 'Social',     icon: Users,         scores: { stem: 0, creative: 0, social: 3, business: 0 } },
      { id: 'fld-tech',    label: 'Tech',       icon: Code2,         scores: { stem: 3, creative: 1, social: 0, business: 1 } },
      { id: 'fld-health',  label: 'Health',     icon: Heart,         scores: { stem: 2, creative: 0, social: 3, business: 0 } },
      { id: 'fld-law',     label: 'Law',        icon: BookOpen,      scores: { stem: 0, creative: 1, social: 3, business: 2 } },
      { id: 'fld-design',  label: 'Design',     icon: Sparkles,      scores: { stem: 0, creative: 3, social: 0, business: 1 } },
      { id: 'fld-science', label: 'Science',    icon: Brain,         scores: { stem: 3, creative: 0, social: 1, business: 0 } },
      { id: 'fld-edu',     label: 'Education',  icon: GraduationCap, scores: { stem: 0, creative: 1, social: 3, business: 0 } },
      { id: 'fld-mixed',   label: 'Mixed',      icon: Globe,         scores: { stem: 1, creative: 1, social: 1, business: 1 } },
    ],
  },

  // Q22 · Work style?
  {
    id: 'work-style',
    title: 'What is your preferred work style?',
    subtitle: 'Pick everything that describes how you like to work.',
    type: 'multi',
    options: [
      { id: 'ws-build',    label: 'Build',        icon: Wrench,        scores: { stem: 2, creative: 2, social: 0, business: 1 } },
      { id: 'ws-analyze',  label: 'Analyze',      icon: Brain,         scores: { stem: 3, creative: 0, social: 0, business: 2 } },
      { id: 'ws-help',     label: 'Help',         icon: Heart,         scores: { stem: 0, creative: 0, social: 3, business: 0 } },
      { id: 'ws-create',   label: 'Create',       icon: Palette,       scores: { stem: 0, creative: 3, social: 0, business: 0 } },
      { id: 'ws-lead',     label: 'Lead',         icon: Target,        scores: { stem: 0, creative: 0, social: 2, business: 3 } },
      { id: 'ws-research', label: 'Research',     icon: FlaskConical,  scores: { stem: 3, creative: 1, social: 0, business: 0 } },
      { id: 'ws-design',   label: 'Design',       icon: Sparkles,      scores: { stem: 0, creative: 3, social: 0, business: 1 } },
      { id: 'ws-solve',    label: 'Solve',        icon: Calculator,    scores: { stem: 3, creative: 1, social: 1, business: 1 } },
      { id: 'ws-organize', label: 'Organize',     icon: Building2,     scores: { stem: 0, creative: 0, social: 1, business: 3 } },
      { id: 'ws-comm',     label: 'Communicate',  icon: MessageSquare, scores: { stem: 0, creative: 1, social: 3, business: 2 } },
      { id: 'ws-innovate', label: 'Innovate',     icon: Rocket,        scores: { stem: 2, creative: 2, social: 0, business: 2 } },
    ],
  },

  // Q23 · Team preference?
  {
    id: 'team',
    title: 'What is your team preference?',
    subtitle: 'Pick the work environment that fits you best.',
    type: 'single',
    options: [
      { id: 'tm-lead',    label: 'Lead a team — I want to be in charge',       icon: Target,        scores: { stem: 0, creative: 0, social: 2, business: 3 } },
      { id: 'tm-alone',   label: 'Work alone — I focus best independently',    icon: Compass,       scores: { stem: 2, creative: 2, social: 0, business: 1 } },
      { id: 'tm-mix',     label: 'Mix — some solo, some team',                 icon: Users,         scores: { stem: 1, creative: 1, social: 2, business: 2 } },
      { id: 'tm-small',   label: 'Small teams — close collaboration',          icon: Handshake,     scores: { stem: 1, creative: 2, social: 2, business: 1 } },
      { id: 'tm-large',   label: 'Large teams — I thrive in big organizations',icon: Building2,     scores: { stem: 0, creative: 0, social: 2, business: 3 } },
      { id: 'tm-collab',  label: 'Collaborative — always working with others', icon: Heart,         scores: { stem: 0, creative: 1, social: 3, business: 1 } },
      { id: 'tm-struct',  label: 'Structured teams with clear roles',          icon: Brain,         scores: { stem: 2, creative: 0, social: 1, business: 3 } },
      { id: 'tm-flexible',label: 'Flexible — whatever the project needs',      icon: Globe,         scores: { stem: 1, creative: 1, social: 1, business: 1 } },
    ],
  },

  // Q24 · Risk preference?
  {
    id: 'risk',
    title: 'How do you feel about risk in your career?',
    subtitle: 'Pick the statement that best matches your comfort level.',
    type: 'single',
    options: [
      { id: 'rsk-high',    label: 'High risk — big rewards are worth it',         icon: Rocket,        scores: { stem: 1, creative: 2, social: 0, business: 3 } },
      { id: 'rsk-balanced',label: 'Balanced — some risk is fine',                 icon: Compass,       scores: { stem: 1, creative: 1, social: 1, business: 2 } },
      { id: 'rsk-safe',    label: 'Safe — I prefer stability',                    icon: Building2,     scores: { stem: 2, creative: 0, social: 2, business: 1 } },
      { id: 'rsk-entrep',  label: 'Entrepreneurial — I want to build my own thing',icon: Briefcase,   scores: { stem: 1, creative: 2, social: 0, business: 3 } },
      { id: 'rsk-stable',  label: 'Stable job — predictability matters to me',    icon: Target,        scores: { stem: 2, creative: 0, social: 1, business: 1 } },
      { id: 'rsk-compete', label: 'Competitive — I want to win in a tough field', icon: Award,         scores: { stem: 2, creative: 0, social: 0, business: 3 } },
      { id: 'rsk-exp',     label: 'Experimental — I want to try new things',      icon: FlaskConical,  scores: { stem: 2, creative: 3, social: 0, business: 1 } },
      { id: 'rsk-mixed',   label: 'Mixed — depends on the opportunity',           icon: Globe,         scores: { stem: 1, creative: 1, social: 1, business: 2 } },
    ],
  },

  // Q25 · Life goal? (2× multiplier — strongest signal)
  {
    id: 'life-goal',
    title: 'What is your ultimate life goal?',
    subtitle: 'Pick the one that matters most — this is the strongest signal in your profile.',
    type: 'single',
    options: [
      { id: 'lg-wealth',    label: 'Wealth — financial freedom and security',     icon: TrendingUp,    scores: { stem: 1, creative: 0, social: 0, business: 3 } },
      { id: 'lg-impact',    label: 'Impact — change the world for the better',    icon: Globe,         scores: { stem: 1, creative: 1, social: 3, business: 0 } },
      { id: 'lg-creative',  label: 'Creativity — build something truly original', icon: Palette,       scores: { stem: 0, creative: 3, social: 1, business: 0 } },
      { id: 'lg-freedom',   label: 'Freedom — live life on my own terms',         icon: Rocket,        scores: { stem: 0, creative: 2, social: 1, business: 2 } },
      { id: 'lg-success',   label: 'Success — be recognized as the best',         icon: Award,         scores: { stem: 2, creative: 0, social: 0, business: 3 } },
      { id: 'lg-innovation',label: 'Innovation — invent something that matters',  icon: FlaskConical,  scores: { stem: 3, creative: 2, social: 0, business: 1 } },
      { id: 'lg-helping',   label: 'Helping others — make a difference daily',    icon: Heart,         scores: { stem: 0, creative: 0, social: 3, business: 0 } },
      { id: 'lg-lead',      label: 'Leadership — lead people and organizations',  icon: Target,        scores: { stem: 0, creative: 0, social: 2, business: 3 } },
      { id: 'lg-balance',   label: 'Balance — fulfilling work and personal life', icon: Compass,       scores: { stem: 0, creative: 1, social: 2, business: 1 } },
      { id: 'lg-prestige',  label: 'Prestige — respected career and reputation',  icon: GraduationCap, scores: { stem: 2, creative: 0, social: 1, business: 2 } },
      { id: 'lg-explore',   label: 'Exploration — keep learning and discovering', icon: Sparkles,      scores: { stem: 2, creative: 2, social: 1, business: 0 } },
    ],
  },
];

// ─── Profile engine ───────────────────────────────────────────────────────────
// Sums direct point values across all steps.
// Goals step (single-select) gets a 2× multiplier — strongest signal.
// Role models step (single-select) gets a 1.5× multiplier.
// Derives majorCluster and collegeType from the dominant bucket + college step.

const STEP_MULTIPLIERS: Record<string, number> = {
  'goals':     2,
  'life-goal': 2,
};

export interface ProfileResult {
  type:         string;
  pathway:      string;
  color:        string;
  bg:           string;
  scores:       { stem: number; creative: number; social: number; business: number };
  total:        number;
  majorCluster: 'STEM' | 'Business' | 'Creative' | 'Social';
  collegeType:  'research' | 'arts' | 'business' | 'liberal-arts' | 'public';
  // Stable bucket key — used to re-derive translated type/pathway at render time
  bucket:       'stem' | 'creative' | 'social' | 'business';
}

function computeProfile(answers: Record<string, string[]>): ProfileResult {
  const totals = { stem: 0, creative: 0, social: 0, business: 0 };

  for (const step of steps) {
    const selected = answers[step.id] ?? [];
    const multiplier = STEP_MULTIPLIERS[step.id] ?? 1;
    for (const optId of selected) {
      const opt = step.options.find((o) => o.id === optId);
      if (!opt) continue;
      totals.stem     += opt.scores.stem     * multiplier;
      totals.creative += opt.scores.creative * multiplier;
      totals.social   += opt.scores.social   * multiplier;
      totals.business += opt.scores.business * multiplier;
    }
  }

  const total = totals.stem + totals.creative + totals.social + totals.business || 1;
  const max   = Math.max(totals.stem, totals.creative, totals.social, totals.business);

  let type: string, pathway: string, color: string, bg: string;
  let majorCluster: ProfileResult['majorCluster'];
  let bucket: ProfileResult['bucket'];

  if (max === totals.stem) {
    bucket = 'stem';     type = 'STEM Innovator';     pathway = 'Science & Technology';        color = 'text-emerald-600'; bg = 'bg-emerald-50'; majorCluster = 'STEM';
  } else if (max === totals.creative) {
    bucket = 'creative'; type = 'Creative Visionary'; pathway = 'Arts & Design';               color = 'text-teal-600';    bg = 'bg-teal-50';    majorCluster = 'Creative';
  } else if (max === totals.social) {
    bucket = 'social';   type = 'People Champion';    pathway = 'Social & Human Services';     color = 'text-green-600';   bg = 'bg-green-50';   majorCluster = 'Social';
  } else {
    bucket = 'business'; type = 'Business Leader';    pathway = 'Business & Entrepreneurship'; color = 'text-lime-700';    bg = 'bg-lime-50';    majorCluster = 'Business';
  }

  // Derive college type from college-step selection + dominant bucket
  const collegeAnswers = answers['college'] ?? [];
  let collegeType: ProfileResult['collegeType'] = 'public';
  if (majorCluster === 'STEM'     || collegeAnswers.includes('col-ivy') || collegeAnswers.includes('col-private')) collegeType = 'research';
  else if (majorCluster === 'Creative')  collegeType = 'arts';
  else if (majorCluster === 'Business')  collegeType = 'business';
  else if (majorCluster === 'Social')    collegeType = 'liberal-arts';
  if (collegeAnswers.includes('col-afford')) collegeType = 'public'; // override if cost matters

  return { type, pathway, color, bg, scores: totals, total, majorCluster, collegeType, bucket };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function OptionCard({
  option,
  selected,
  onClick,
}: {
  option: Option;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-150 w-full',
        'hover:border-primary/50 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        selected
          ? 'border-primary bg-primary/8 shadow-sm'
          : 'border-border bg-background',
      )}
      aria-pressed={selected}
    >
      <div className={cn(
        'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors',
        selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
      )}>
        <option.icon size={16} />
      </div>
      <span className={cn(
        'text-sm font-medium leading-tight',
        selected ? 'text-foreground' : 'text-muted-foreground',
      )}>
        {option.label}
      </span>
      {selected && (
        <CheckCircle2 size={15} className="ml-auto shrink-0 text-primary" />
      )}
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function QuizPage() {
  const navigate = useNavigate();
  const { saveProfile } = useProfile();
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [direction, setDirection] = useState(1);
  const [done, setDone] = useState(false);

  const step = steps[currentStep];
  const stepAnswers = answers[step?.id] ?? [];
  const progress = (currentStep / steps.length) * 100;
  const canContinue = stepAnswers.length > 0;

  // Derive translated title/subtitle/option labels for current step
  const qKey = STEP_QUESTION_KEY[step?.id ?? ''];
  const translatedQ = qKey ? t.quiz.questions[qKey] : null;
  const displayTitle    = translatedQ?.title    ?? step?.title    ?? '';
  const displaySubtitle = translatedQ?.subtitle ?? step?.subtitle ?? '';

  function getOptionLabel(optId: string): string {
    return t.quiz.options[optId] ?? optId;
  }

  function toggle(optionId: string) {
    const key = step.id;
    if (step.type === 'single') {
      setAnswers((prev) => ({ ...prev, [key]: [optionId] }));
    } else {
      setAnswers((prev) => {
        const current = prev[key] ?? [];
        return {
          ...prev,
          [key]: current.includes(optionId)
            ? current.filter((id) => id !== optionId)
            : [...current, optionId],
        };
      });
    }
  }

  function goNext() {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep((s) => s + 1);
    } else {
      // Compute and persist profile before showing results
      const computed = computeProfile(answers);
      saveProfile(computed);
      setDone(true);
    }
  }

  function goBack() {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((s) => s - 1);
    }
  }

  const profile: ProfileResult | null = done ? computeProfile(answers) : null;

  // Helper: get translated type/pathway from bucket key
  function getProfileDisplay(p: ProfileResult) {
    const pt = t.quiz.profileTypes;
    switch (p.bucket) {
      case 'stem':     return { type: pt.stemType,     pathway: pt.stemPathway     };
      case 'creative': return { type: pt.creativeType, pathway: pt.creativePathway };
      case 'social':   return { type: pt.socialType,   pathway: pt.socialPathway   };
      case 'business': return { type: pt.businessType, pathway: pt.businessPathway };
      default:         return { type: p.type,          pathway: p.pathway          };
    }
  }

  // ── Results screen ──
  if (done && profile) {
    const { type: displayType, pathway: displayPathway } = getProfileDisplay(profile);
    const buckets = [
      { label: 'STEM',     value: profile.scores.stem,     color: 'bg-emerald-500' },
      { label: 'Creative', value: profile.scores.creative, color: 'bg-teal-500'    },
      { label: 'Social',   value: profile.scores.social,   color: 'bg-green-500'   },
      { label: 'Business', value: profile.scores.business, color: 'bg-lime-500'    },
    ];
    const maxBucket = Math.max(...buckets.map((b) => b.value)) || 1;

    return (
      <>
        <Helmet>
          <title>{t.quiz.resultsTitle} — PathwayIQ</title>
          <meta name="description" content={t.quiz.resultsSubtitle} />
        </Helmet>
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-background to-emerald-50 px-4 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full max-w-lg"
          >
            {/* Profile type */}
            <div className="text-center mb-8">
              <div className={cn('mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl', profile.bg)}>
                <Compass size={36} className={profile.color} />
              </div>
              <div className={cn('inline-block rounded-full px-4 py-1.5 text-sm font-semibold mb-3', profile.bg, profile.color)}>
                {displayType}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                {t.quiz.yourProfile}: <span className="text-primary">{displayPathway}</span>
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
                {t.quiz.resultsSubtitle}
              </p>
            </div>

            {/* Score breakdown */}
            <div className="bg-background rounded-2xl border border-border p-6 mb-6 shadow-sm">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                {t.quiz.scoreBreakdown}
              </p>
              <div className="flex flex-col gap-3">
                {buckets.map((b) => {
                  const pct = Math.round((b.value / maxBucket) * 100);
                  return (
                    <div key={b.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-foreground">{b.label}</span>
                        <span className="text-xs font-bold text-muted-foreground">{b.value} pts</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <motion.div
                          className={cn('h-full rounded-full', b.color)}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="flex-1 rounded-xl py-6 text-base shadow-md"
                onClick={() => navigate('/dashboard')}
              >
                {t.quiz.viewDashboard}
                <ArrowRight size={18} className="ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl px-6 py-6 text-base"
                onClick={() => { setDone(false); setCurrentStep(0); setAnswers({}); }}
              >
                {t.quiz.retake}
              </Button>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  // ── Quiz screen ──
  return (
    <>
      <Helmet>
        <title>{t.quiz.title} — PathwayIQ</title>
        <meta name="description" content={t.quiz.subtitle} />
        <link rel="canonical" href="https://pathwayiq.com/quiz" />
      </Helmet>

      <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-background to-emerald-50/40 flex flex-col">
        {/* Top progress bar */}
        <div className="bg-background border-b border-border px-4 py-4">
          <div className="container mx-auto max-w-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">
                {t.quiz.progress
                  .replace('{n}', String(currentStep + 1))
                  .replace('{total}', String(steps.length))
                  .replace('{section}', t.quiz.sections[getSectionKey(currentStep)])}
              </span>
              <span className="text-xs font-semibold text-primary">
                {Math.round(progress)}{t.quiz.complete}
              </span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        </div>

        {/* Step content */}
        <div className="flex-1 flex flex-col items-center justify-start px-4 py-10">
          <div className="w-full max-w-2xl">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step.id}
                custom={direction}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -40 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                {/* Heading */}
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    {displayTitle}
                  </h2>
                  <p className="text-muted-foreground text-sm md:text-base">
                    {displaySubtitle}
                  </p>
                  {step.type === 'multi' && stepAnswers.length > 0 && (
                    <p className="mt-2 text-xs text-primary font-medium">
                      {t.quiz.selectedCount.replace('{n}', String(stepAnswers.length))}
                    </p>
                  )}
                </div>

                {/* Options grid */}
                <div className="grid sm:grid-cols-2 gap-2.5 mb-10">
                  {step.options.map((option) => (
                    <OptionCard
                      key={option.id}
                      option={{ ...option, label: getOptionLabel(option.id) }}
                      selected={stepAnswers.includes(option.id)}
                      onClick={() => toggle(option.id)}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={goBack}
                disabled={currentStep === 0}
                className="gap-1.5 rounded-lg text-muted-foreground"
              >
                <ArrowLeft size={15} />
                {t.quiz.back}
              </Button>

              <Button
                size="lg"
                onClick={goNext}
                disabled={!canContinue}
                className="rounded-xl px-8 gap-2 shadow-sm"
              >
                {currentStep === steps.length - 1 ? t.quiz.submit : t.quiz.next}
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
