export const SEO_CONFIG = {
  siteName: 'Close Testing Group',
  siteUrl: 'https://closetesting.online',
  defaultTitle: 'Close Testing Group - Google Play Closed Testing Platform',
  defaultDescription: 'Professional platform for Google Play closed testing programs. Connect Android app developers with quality beta testers. Join testing programs, submit apps, and get real user feedback.',
  
  primaryKeywords: [
    'google play closed testing',
    'android beta testing',
    'app beta testers',
    'closed testing program',
    'google play beta test',
    'android app testing',
    'mobile app beta testing',
    'play store closed testing',
    'app testing platform',
    'beta tester community',
  ],

  secondaryKeywords: [
    'android app beta testers',
    'google play testing program',
    'closed beta testing android',
    'mobile app testers',
    'app testing service',
    'beta test android apps',
    'google play console testing',
    'android app feedback',
    'mobile beta testing',
    'app tester recruitment',
  ],

  longTailKeywords: [
    'how to join google play closed testing',
    'find beta testers for android app',
    'google play closed testing requirements',
    'become android beta tester',
    'submit app for closed testing',
    'google play internal testing vs closed testing',
    'android app closed testing invite',
    'how to get beta testers for my app',
    'google play closed testing 20 testers',
    'android beta testing platform',
    'closed testing vs open testing google play',
    'google play pre-launch report',
    'android app quality testing',
    'mobile app user testing',
    'beta testing for android developers',
    'google play developer testing',
    'android app launch testing',
    'play store beta program',
    'mobile app testing community',
    'android app feedback platform',
  ],

  relatedKeywords: [
    'app store optimization',
    'android app development',
    'mobile app quality assurance',
    'app user feedback',
    'android developer tools',
    'google play console',
    'app release management',
    'mobile app launch strategy',
    'android app marketing',
    'app store ranking',
    'mobile app reviews',
    'android app performance',
    'app crash testing',
    'mobile app compatibility',
    'android device testing',
    'app security testing',
    'mobile app UX testing',
    'android accessibility testing',
    'app localization testing',
    'mobile app analytics',
  ],

  developerKeywords: [
    'submit android app for testing',
    'find testers for android app',
    'google play developer beta',
    'android app pre-release testing',
    'closed testing track google play',
    'android app testing before launch',
    'google play staged rollout',
    'android app version testing',
    'mobile app qa testers',
    'android developer testing tools',
    'app testing before release',
    'google play alpha testing',
    'android app bug testing',
    'mobile app usability testing',
    'android app stress testing',
  ],

  testerKeywords: [
    'become beta tester android',
    'join closed testing program',
    'android beta tester jobs',
    'test android apps for free',
    'google play tester program',
    'mobile app testing jobs',
    'android app reviewer',
    'beta testing opportunities',
    'test apps before release',
    'android app early access',
    'mobile game beta testing',
    'android app tester community',
    'beta tester rewards',
    'app testing feedback',
    'android beta tester registration',
  ],

  industryKeywords: [
    'mobile app testing industry',
    'android app ecosystem',
    'google play store optimization',
    'mobile app development lifecycle',
    'android app quality standards',
    'mobile testing best practices',
    'app development workflow',
    'android release management',
    'mobile app distribution',
    'google play policies',
  ],

  allKeywords: [] as string[],
};

SEO_CONFIG.allKeywords = [
  ...SEO_CONFIG.primaryKeywords,
  ...SEO_CONFIG.secondaryKeywords,
  ...SEO_CONFIG.longTailKeywords,
  ...SEO_CONFIG.relatedKeywords,
  ...SEO_CONFIG.developerKeywords,
  ...SEO_CONFIG.testerKeywords,
  ...SEO_CONFIG.industryKeywords,
];

export const PAGE_SEO = {
  home: {
    title: 'Close Testing Group - Google Play Closed Testing Platform | Find Beta Testers',
    description: 'Join the leading platform for Google Play closed testing. Developers find quality beta testers, testers discover new Android apps. Start your 14-day testing journey today.',
    keywords: ['google play closed testing', 'android beta testing', 'find beta testers', 'closed testing platform', 'android app testers'],
  },
  submit: {
    title: 'Submit Your Android App for Closed Testing | Close Testing Group',
    description: 'Submit your Android app to our closed testing platform. Connect with verified beta testers, get real user feedback, and improve your app before launch.',
    keywords: ['submit android app', 'closed testing submission', 'find beta testers', 'android app testing', 'pre-launch testing'],
  },
  about: {
    title: 'About Close Testing Group | Google Play Testing Platform',
    description: 'Learn about Close Testing Group, the professional platform connecting Android developers with quality beta testers for Google Play closed testing programs.',
    keywords: ['about close testing', 'beta testing platform', 'android testing community', 'google play testing'],
  },
  blog: {
    title: 'Android Testing Blog | Tips, Guides & Best Practices | Close Testing Group',
    description: 'Expert guides on Google Play closed testing, beta testing strategies, and Android app quality assurance. Learn from industry professionals.',
    keywords: ['android testing blog', 'beta testing guides', 'google play tips', 'app testing tutorials'],
  },
  faq: {
    title: 'FAQ - Google Play Closed Testing Questions | Close Testing Group',
    description: 'Frequently asked questions about Google Play closed testing, becoming a beta tester, and submitting apps for testing. Get answers to common questions.',
    keywords: ['closed testing faq', 'beta testing questions', 'google play testing help', 'tester registration'],
  },
  contact: {
    title: 'Contact Us | Close Testing Group Support',
    description: 'Get in touch with Close Testing Group for support, partnerships, or questions about our Google Play closed testing platform.',
    keywords: ['contact close testing', 'beta testing support', 'testing platform help'],
  },
  privacy: {
    title: 'Privacy Policy | Close Testing Group',
    description: 'Read our privacy policy to understand how Close Testing Group collects, uses, and protects your personal information.',
    keywords: ['privacy policy', 'data protection', 'user privacy'],
  },
  terms: {
    title: 'Terms of Service | Close Testing Group',
    description: 'Review our terms of service for using the Close Testing Group platform for Google Play closed testing programs.',
    keywords: ['terms of service', 'user agreement', 'platform terms'],
  },
};

export const STRUCTURED_DATA = {
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Close Testing Group',
    url: 'https://closetesting.online',
    logo: 'https://closetesting.online/logo.png',
    description: 'Professional platform for Google Play closed testing programs connecting developers with quality beta testers.',
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
        url: 'https://closetesting.online/logo.png',
      },
    },
    image: article.image || 'https://closetesting.online/logo.png',
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
