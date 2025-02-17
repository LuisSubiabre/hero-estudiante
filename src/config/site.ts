export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Liceo Experimental Umag",
  description: "Portal Estudiante",
  navItems: [
    {
      label: "Inicio",
      href: "/",
    },
    {
      label: "Notas",
      href: "/notas",
    },
    {
      label: "Asistencia",
      href: "/asistencia",
    },
    {
      label: "ACLES",
      href: "/acles",
    },
    {
      label: "Atrasos",
      href: "/atrasos",
    },
    {
      label: "Informes",
      href: "/informes",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Team",
      href: "/team",
    },
    {
      label: "Calendar",
      href: "/calendar",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/frontio-ai/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
