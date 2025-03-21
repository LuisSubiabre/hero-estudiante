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
      label: "Certificados",
      href: "/certificados",
    },
  ],
  navMenuItems: [
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
      label: "Certificados",
      href: "/certificados",
    },
    {
      label: "Salir",
      href: "/Logout",
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
