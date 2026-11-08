export const demoCategories = [
  { id: 1, name: 'Real Estate', slug: 'real-estate', description: 'Thoughtful property discovery and practical real estate support.', icon: 'building' },
  { id: 2, name: 'Events & Experiences', slug: 'events-experiences', description: 'Intentional occasions and seamless coordination.', icon: 'calendar' },
  { id: 3, name: 'Travel & Tourism', slug: 'travel-tourism', description: 'Plan journeys and discover new perspectives.', icon: 'compass' },
  { id: 4, name: 'Business Connections', slug: 'business-connections', description: 'Introductions, possibilities and ideas for what comes next.', icon: 'network' }
];
export const demoServices = [
  ['Property Discovery', 'property-discovery', 'Find spaces that fit the way you live or work.', 0],
  ['Property Advisory', 'property-advisory', 'Make your next property decision with more clarity.', 0],
  ['Event Planning', 'event-planning', 'From the first idea to a considered experience.', 1],
  ['Corporate Experiences', 'corporate-experiences', 'Gather your people with purpose.', 1],
  ['Travel Planning', 'travel-planning', 'Every great journey starts with a good plan.', 2],
  ['Local Experiences', 'local-experiences', 'Find a different way to explore.', 2],
  ['Business Introductions', 'business-introductions', 'Meaningful connections for new opportunities.', 3],
  ['Business Support', 'business-support', 'Explore practical paths forward.', 3]
].map(([title, slug, summary, categoryIndex], i) => ({
  id: i + 1, title, slug, summary,
  description: `${summary} Get in touch with our team to discuss your goals and explore the right next steps.`,
  category_name: demoCategories[categoryIndex].name, category_slug: demoCategories[categoryIndex].slug
}));
export const demoSite = {
  demo: true, settings: {}, categories: demoCategories, featuredServices: demoServices.filter((_, i) => i % 2 === 0),
  sections: {
    hero: { eyebrow: 'TRUVEXA SERVICES LTD', title: 'Beyond expectations. Into possibility.', subtitle: 'A refined partner for property, experiences, travel and business connections.', body: 'Different ambitions call for different paths. We bring your ideas into focus with personal attention and a thoughtful approach.', cta_label: 'Explore our services', cta_href: '/services' },
    about: { eyebrow: 'WHO WE ARE', title: 'One company. Many possibilities.', subtitle: 'A connected approach to the things that move you forward.', body: 'TRUVEXA SERVICES LTD brings together diverse services under one clear purpose: helping people explore opportunities with confidence.', cta_label: 'Discover our story', cta_href: '/about' },
    process: { eyebrow: 'OUR APPROACH', title: 'A better experience starts with understanding.', subtitle: 'Listen. Plan. Connect. Deliver.', body: 'Every inquiry begins with a conversation. We learn what matters to you, help identify the right direction and communicate clearly along the way.', cta_label: 'Start a conversation', cta_href: '/contact' },
    contact: { eyebrow: 'LET’S CONNECT', title: 'Your next move starts here.', subtitle: 'Have an idea, a question or an opportunity? We would love to hear from you.', body: 'Tell us what you are exploring, and our team will review your message.', cta_label: 'Contact TRUVEXA', cta_href: '/contact' }
  }
};
