import { Link } from 'react-router-dom';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion } from 'motion/react';
import { ArrowRight, Briefcase, GraduationCap, BookOpen, Star, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.12, ease: 'easeOut' as const },
  }),
};

const unlocks = [
  { icon: Briefcase,      label: 'Career Matches' },
  { icon: GraduationCap, label: 'College Fits'    },
  { icon: BookOpen,       label: 'Course Plans'   },
  { icon: Star,           label: 'Activities'     },
];

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>PathwayIQ — Your Personalized Academic & Career Planner</title>
        <meta
          name="description"
          content="Take a short quiz and get a personalized academic and career plan built around your strengths, interests, and goals."
        />
        <link rel="canonical" href="https://pathwayiq.com/" />
        <meta property="og:title" content="PathwayIQ — Your Personalized Academic & Career Planner" />
        <meta property="og:description" content="Take a short quiz and get a personalized plan built around you." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pathwayiq.com/" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'PathwayIQ',
          url: 'https://pathwayiq.com',
          description: 'Personalized academic and career planning for high school students.',
          applicationCategory: 'EducationalApplication',
        })}</script>
      </Helmet>

      {/* Full-viewport hero split */}
      <section className="min-h-[calc(100vh-64px)] grid md:grid-cols-2">

        {/* Left — content */}
        <div className="flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16 bg-background">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <div className="flex items-center gap-2 mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Compass size={16} className="text-primary-foreground" />
              </div>
              <span className="text-sm font-semibold text-primary tracking-wide uppercase">PathwayIQ</span>
            </div>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-5"
          >
            Find your path.<br />
            <span className="text-primary">Own your future.</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-md"
          >
            Take a short quiz and get a personalized academic and career plan
            built around your strengths, interests, and goals.
          </motion.p>

          {/* Unlock pills */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="flex flex-wrap gap-2 mb-10"
          >
            {unlocks.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground"
              >
                <Icon size={12} className="text-primary" />
                {label}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={4}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Button asChild size="lg" className="rounded-xl text-base px-8 py-6 shadow-md">
              <Link to="/quiz">
                Start the Quiz
                <ArrowRight size={18} className="ml-2" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="rounded-xl text-base px-6 py-6 text-muted-foreground">
              <Link to="/dashboard">See a sample dashboard</Link>
            </Button>
          </motion.div>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={5}
            className="mt-5 text-xs text-muted-foreground"
          >
            Free for all students · Takes about 10–15 minutes
          </motion.p>
        </div>

        {/* Right — image */}
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative hidden md:block"
        >
          <img
            src="/airo-assets/images/pages/home/hero"
            alt="High school student planning their academic future"
            className="absolute inset-0 h-full w-full object-cover"
            width={1200}
            height={700}
            loading="eager"
            fetchPriority="high"
          />
          {/* Subtle left-edge fade to blend with content panel */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/10 to-transparent" />
        </motion.div>

      </section>
    </>
  );
}
