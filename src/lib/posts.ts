/**
 * The blog post store — transcribed from Figma /blog (desktop 184:3015,
 * mobile 184:4434). Single source of truth for the /blog index, the single
 * post page and the Home "Blogs" section, so they never drift apart.
 *
 * Order is newest-first, exactly as Figma lays the cards out.
 * ponytail: a plain array. Swap for a content collection when posts get bodies.
 */

export type PostCategory =
  | 'Profit Killers'
  | 'Financial'
  | 'Operations'
  | 'Marketing'
  | 'Sales'
  | 'Training'
  | 'Events'
  | 'Startup'
  | 'General';

export type Post = {
  title: string;
  slug: string;
  excerpt: string;
  /** ISO, for <time datetime> and sorting. */
  date: string;
  /** Exactly as written in Figma — its formatting is inconsistent on purpose. */
  dateLabel: string;
  category: PostCategory;
  image: string;
  imageWidth: number;
  imageHeight: number;
  readingTime: string;
  /** The three cards in the "Featured Insights" band (and on Home). */
  featured?: boolean;
};

export const author = {
  name: 'Kelly Smith',
  avatar: '/images/blog/kelly-smith.jpg',
} as const;

/** Figma 184:3224 — the filter rail above "Latest Articles". */
export const categories: PostCategory[] = [
  'Profit Killers',
  'Financial',
  'Operations',
  'Marketing',
  'Sales',
  'Training',
  'Events',
  'Startup',
  'General',
];

export const posts: Post[] = [
  {
    title: 'Profit Killer #5: Not Knowing Your Key Performance Indicators',
    slug: 'profit-killer-5-not-knowing-your-key-performance-indicators',
    excerpt:
      'We recommend tracking and measuring the number of leads, conversions and consultation ratios combined with the ROI necessary to create the desired revenue or sales for your practice.',
    date: '2026-06-20',
    dateLabel: '20 June 2026',
    category: 'Profit Killers',
    image: '/images/blog/profit-killer-5-kpis.jpg',
    imageWidth: 895,
    imageHeight: 503,
    readingTime: '5 min read',
    featured: true,
  },
  {
    title: 'Med Spa KPIs: The Owner’s Dashboard Guide',
    slug: 'med-spa-kpis-dashboard-guide',
    excerpt:
      'Schedule a consultation to turn med spa KPIs into smarter weekly decisions, stronger margins, and a focused plan for profitable practice growth.',
    date: '2026-06-20',
    dateLabel: '20 June 2026',
    category: 'Financial',
    image: '/images/blog/med-spa-kpis.jpg',
    imageWidth: 1600,
    imageHeight: 800,
    readingTime: '5 min read',
    featured: true,
  },
  {
    title: '9 Keys to Stronger Aesthetic Clinic Operations',
    slug: '9-keys-to-stronger-aesthetic-clinic-operations',
    excerpt:
      'Get practical tips to improve aesthetic clinic operations, streamline your workflow, and create a smoother patient experience for lasting business growth.',
    date: '2026-06-20',
    dateLabel: '20 June 2026',
    category: 'Operations',
    image: '/images/blog/aesthetic-clinic-operations.jpg',
    imageWidth: 1600,
    imageHeight: 800,
    readingTime: '5 min read',
    featured: true,
  },
  {
    title: 'Med Spa Pricing Strategy for Profitable Services',
    slug: 'med-spa-pricing-strategy-for-profitable-services',
    excerpt:
      'Schedule a pricing strategy consultation and build a med spa pricing strategy that protects margins, improves decisions, and supports profitable growth.',
    date: '2026-06-20',
    dateLabel: '20 June 2026',
    category: 'Financial',
    image: '/images/blog/med-spa-pricing-strategy.jpg',
    imageWidth: 1600,
    imageHeight: 800,
    readingTime: '8 min read',
  },
  {
    title: 'Scaling Medical Aesthetic Practice: Solo to Multi-Provider Guide',
    slug: 'scaling-medical-aesthetic-practice-solo-to-multi-provider-guide',
    excerpt:
      'Schedule your scaling medical aesthetic practice consultation. Learn the systems, team strategies, and leadership transitions solo injectors need to grow.',
    date: '2026-06-16',
    dateLabel: '16 June 2026',
    category: 'Operations',
    image: '/images/blog/scaling-medical-aesthetic-practice.jpg',
    imageWidth: 1600,
    imageHeight: 800,
    readingTime: '10 min read',
  },
  {
    title: 'Med Spa Annual Marketing Plan: Your Step-by-Step Guide',
    slug: 'med-spa-annual-marketing-plan-step-by-step-guide',
    excerpt:
      'Book your free consultation today. Learn how to build a highly effective med spa annual marketing plan to align your goals and grow your practice.',
    date: '2026-06-10',
    dateLabel: '10 June 2026',
    category: 'Marketing',
    image: '/images/blog/med-spa-annual-marketing-plan.jpg',
    imageWidth: 1600,
    imageHeight: 800,
    readingTime: '5 min read',
  },
  {
    title: 'How to Sell Med Spa Memberships: A Practical Guide',
    slug: 'how-to-sell-med-spa-memberships',
    excerpt:
      'Schedule a consultation to learn how to sell med spa memberships using proven consultation, event, follow-up, front desk, and sales metrics strategies.',
    date: '2026-05-18',
    dateLabel: '18 May 2026',
    category: 'Sales',
    image: '/images/blog/sell-med-spa-memberships.jpg',
    imageWidth: 1600,
    imageHeight: 800,
    readingTime: '7 min read',
  },
  {
    title: 'What does Social Media have to do with your Business?',
    slug: 'what-does-social-media-have-to-do-with-your-business',
    excerpt:
      'We all use it, most of us every day. We see new platforms being created, constantly being updated to have the newest and best features.',
    date: '2026-05-10',
    dateLabel: '10 May 2026',
    category: 'Events',
    image: '/images/blog/social-media-and-your-business.jpg',
    imageWidth: 1600,
    imageHeight: 1069,
    readingTime: '5 min read',
  },
  {
    title: 'Wellness and Med Spa: Key Service Differences',
    slug: 'wellness-and-med-spa-key-service-differences',
    excerpt:
      'Compare wellness and med spa services, from holistic care to advanced treatments. Learn what sets each apart and how to choose the right option for you.',
    date: '2026-04-05',
    dateLabel: '05 Apr 2026',
    category: 'General',
    image: '/images/blog/wellness-vs-med-spa.jpg',
    imageWidth: 1600,
    imageHeight: 800,
    readingTime: '5 min read',
  },
];

/**
 * Every post now resolves to a real page: med-spa-kpis-dashboard-guide has its
 * own designed page, and blog/[slug].astro generates a shell for the rest.
 * The shells are noindex and carry no article schema until their copy is written
 * (see HANDOFF.md), so linking to them is safe — no 404s, nothing fabricated.
 */
export const postHref = (slug: string) => `/blog/${slug}`;

/**
 * Slugs with real, written bodies. The single source of truth for two things
 * that must never disagree: which posts get their own hand-built page instead
 * of a shell (blog/[slug].astro), and which ones the sitemap may advertise.
 * Add a slug here the moment its article ships.
 */
export const publishedSlugs = new Set<string>(['med-spa-kpis-dashboard-guide']);

export const featuredPosts = posts.filter((p) => p.featured);
export const latestPosts = posts.filter((p) => !p.featured);
