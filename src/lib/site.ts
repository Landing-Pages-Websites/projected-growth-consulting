/** Single source of truth for nav + footer links. Every page pulls from here. */

export const site = {
  name: 'Projected Growth Consulting',
  tagline: 'The Business OS for Elective Medical Practices.',
  description:
    "The operator's business school for elective medical practices. Helping owners build more profitable, predictable businesses through coaching, courses, and proven growth systems.",
  url: 'https://projectedgrowthconsultancy.com',
  /**
   * Transcribed from the Figma /contact-us frame (184:2202). Single source of
   * truth so the contact section and the Organization schema can never disagree.
   *
   * [OWNER] The email domain is `projectedgrowthconsulting.com` while the site
   * is `projectedgrowthconsultancy.com` — consulting vs consultancy. That is
   * what the design says, so it ships unchanged; confirm which is correct
   * before launch, because a dead contact address loses enquiries silently.
   */
  contact: {
    email: 'info@projectedgrowthconsulting.com',
    phone: '(877) 716-1291',
    phoneHref: '+18777161291',
    locality: 'St. Petersburg',
    region: 'FL',
    country: 'US',
  },
  /**
   * [OWNER] Real profile URLs required. Empty strings render no icon and emit
   * no schema `sameAs` — deliberately: the previous values pointed at
   * instagram.com and linkedin.com themselves, so every visitor who clicked a
   * social icon landed on a login wall, and `sameAs` would have claimed the
   * brand owns those homepages. An absent link beats a wrong one.
   */
  social: {
    instagram: '',
    linkedin: '',
  },
} as const;

export type NavItem = { label: string; href: string; children?: NavItem[] };

export const primaryNav: NavItem[] = [
  { label: 'About', href: '/about' },
  { label: 'Growth Hub', href: '/growth-hub' },
  { label: 'Courses', href: '/courses' },
  { label: 'Consulting', href: '/consulting' },
  {
    label: 'Resources',
    href: '/resources',
    children: [
      { label: 'Resources', href: '/resources' },
      { label: 'PGC Proof', href: '/pgc-proof' },
      { label: 'Testimonials', href: '/testimonials' },
      { label: 'Press', href: '/press' },
    ],
  },
  { label: 'Blogs', href: '/blog' },
];

export const footerNav: { title: string; links: NavItem[] }[] = [
  {
    title: 'Programs',
    links: [
      { label: 'The Growth Hub', href: '/growth-hub' },
      { label: 'Courses', href: '/courses' },
      { label: 'Consulting', href: '/consulting' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Books', href: '/resources' },
      { label: 'Free Tools', href: '/resources' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Kelly Smith', href: '/about' },
      { label: 'Contact', href: '/contact-us' },
      { label: 'Press', href: '/press' },
      { label: 'Testimonials', href: '/testimonials' },
    ],
  },
];

export const legalNav: NavItem[] = [
  { label: 'Cookies Settings', href: '/privacy-policy#cookies' },
  { label: 'Licenses', href: '/privacy-policy#licenses' },
  { label: 'Term & Privacy', href: '/privacy-policy' },
];

/** Social-proof line reused in the hero and the footer CTA. */
export const socialProof = {
  count: '1K+',
  copy: 'Join thousands of practice owners building more predictable growth.',
} as const;
