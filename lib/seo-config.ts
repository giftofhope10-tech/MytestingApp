export const SEO_CONFIG = {
  siteName: 'Close Testing Group',
  siteUrl: 'https://closetesting.online',
  defaultTitle: 'Google Play Closed Testing Platform | Find Real Beta Testers',
  defaultDescription: 'Find real beta testers for your Android app. Join Close Testing Group - the professional platform for Google Play closed testing. Get verified testers and quality feedback fast.',
  
  primaryKeywords: [
    'google play closed testing',
    'android beta testing',
    'beta testers',
    'closed testing',
    'app testing',
    'android testers',
    'beta test apps',
    'play store testing',
    'app testers',
    'beta community',
  ],

  secondaryKeywords: [
    'android beta testers',
    'testing program',
    'closed beta android',
    'app testers',
    'testing service',
    'beta test apps',
    'play console testing',
    'app feedback',
    'mobile testing',
    'tester recruitment',
  ],

  longTailKeywords: [
    'join google play closed testing',
    'find beta testers android',
    'closed testing requirements',
    'become beta tester',
    'submit app testing',
    'internal vs closed testing',
    'closed testing invite',
    'get beta testers app',
    'closed testing 20 testers',
    'beta testing platform',
    'closed vs open testing',
    'pre-launch report',
    'app quality testing',
    'user testing',
    'beta testing developers',
    'developer testing',
    'app launch testing',
    'beta program',
    'testing community',
    'feedback platform',
  ],

  allKeywords: [] as string[],
};

SEO_CONFIG.allKeywords = [
  ...SEO_CONFIG.primaryKeywords,
  ...SEO_CONFIG.secondaryKeywords,
  ...SEO_CONFIG.longTailKeywords,
];

export const PAGE_SEO = {
  home: {
    title: 'Google Play Closed Testing Platform | Find Real Beta Testers - Close Testing Group',
    description: 'Find real beta testers for your Android app. Close Testing Group is the professional platform for Google Play closed testing. Get 20+ verified testers, real feedback, and launch faster.',
    keywords: ['google play closed testing', 'beta testers', 'android beta testing', 'closed testing platform', 'app testers'],
  },
  submit: {
    title: 'Submit Android App for Beta Testing | Close Testing Group',
    description: 'Submit your Android app for closed testing. Get verified beta testers and feedback.',
    keywords: ['submit app', 'closed testing', 'beta testers', 'app testing'],
  },
  about: {
    title: 'About Close Testing Group | Android Beta Testing Hub',
    description: 'Learn about Close Testing Group connecting developers with beta testers.',
    keywords: ['about', 'beta testing', 'android testing', 'community'],
  },
  blog: {
    title: 'Beta Testing Blog | Guides & Tips | Close Testing Group',
    description: 'Tips and guides on Google Play closed testing and beta testing strategies.',
    keywords: ['blog', 'testing guides', 'beta tips', 'tutorials'],
  },
  faq: {
    title: 'Frequently Asked Questions | Close Testing Group Help',
    description: 'Frequently asked questions about closed testing and beta testing programs.',
    keywords: ['faq', 'questions', 'help', 'testing'],
  },
  contact: {
    title: 'Contact Us | Close Testing Group Support Help Center',
    description: 'Contact Close Testing Group for support and questions.',
    keywords: ['contact', 'support', 'help'],
  },
  privacy: {
    title: 'Privacy Policy | Close Testing Group Data Protection',
    description: 'Privacy policy for Close Testing Group platform.',
    keywords: ['privacy', 'policy', 'data'],
  },
  terms: {
    title: 'Terms of Service | Close Testing Group User Agreement',
    description: 'Terms of service for using Close Testing Group platform.',
    keywords: ['terms', 'service', 'agreement'],
  },
  betaTesters: {
    title: 'Become Android Beta Tester | Join Testing Programs',
    description: 'Join as a beta tester. Test Android apps and earn rewards.',
    keywords: ['beta tester', 'join', 'test apps', 'rewards'],
  },
  developers: {
    title: 'Find Beta Testers for Android Apps | Developer Platform',
    description: 'Find beta testers for your Android app. Get quality feedback fast.',
    keywords: ['developers', 'find testers', 'app testing', 'feedback'],
  },
  closedTestingGuide: {
    title: 'Google Play Closed Testing Guide | Requirements & Setup',
    description: 'Complete guide to Google Play closed testing requirements and setup.',
    keywords: ['guide', 'closed testing', 'requirements', 'setup'],
  },
  dashboard: {
    title: 'Developer Dashboard | Manage Beta Testing Programs',
    description: 'Manage your testing programs and track progress.',
    keywords: ['dashboard', 'manage', 'testing'],
  },
};

export const STRUCTURED_DATA = {
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Close Testing Group',
    url: 'https://closetesting.online',
    logo: 'https://closetesting.online/logo.webp',
    description: 'Platform for Google Play closed testing connecting developers with beta testers.',
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@closetesting.online',
      contactType: 'customer support',
    },
  },
  website: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Close Testing Group',
    url: 'https://closetesting.online',
    description: 'Google Play Closed Testing Platform',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://closetesting.online/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  },
  softwareApplication: {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Close Testing Group',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  },
};

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateArticleSchema(article: {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  image?: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      '@type': 'Organization',
      name: article.author || 'Close Testing Group',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Close Testing Group',
      logo: {
        '@type': 'ImageObject',
        url: 'https://closetesting.online/logo.webp',
      },
    },
    image: article.image || 'https://closetesting.online/logo.webp',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url,
    },
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateHowToSchema(steps: { name: string; text: string }[], title: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: title,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}
