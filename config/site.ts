export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Medical Save",
  description: "Privacy-Preserving Medical Research Platform",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Doctor",
      href: "/doctor",
    },
    {
      title: "Patient",
      href: "/patient",
    },
    {
      title: "Research",
      href: "/research",
    },
  ],
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn/ui",
    docs: "https://ui.shadcn.com",
  },
};
