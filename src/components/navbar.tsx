import { Kbd } from "@heroui/kbd";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";
import { UserIcon } from "lucide-react";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { HeartFilledIcon, SearchIcon, LogoutIcon, HomeIcon, BookOpenIcon, UserGroupIcon, ClockIcon, DocumentTextIcon, FlagIcon } from "@/components/icons";
import { useAuth } from "@/context/AuthContext";
import { useJWT } from "@/hooks/useJWT";

export const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const { curso_id } = useJWT();

  // Función para filtrar elementos de navegación según el curso_id
  const getFilteredNavItems = () => {
    if (!curso_id || curso_id < 1 || curso_id > 5) {
      return siteConfig.navItems;
    }
    
    // Si el curso_id está entre 1 y 5, excluir "Notas" y "Personalidad"
    return siteConfig.navItems.filter(item => 
      item.label !== "Notas" && item.label !== "Personalidad"
    );
  };

  const getFilteredNavMenuItems = () => {
    if (!curso_id || curso_id < 1 || curso_id > 5) {
      return siteConfig.navMenuItems;
    }
    
    // Si el curso_id está entre 1 y 5, excluir "Notas" y "Personalidad"
    return siteConfig.navMenuItems.filter(item => 
      item.label !== "Notas" && item.label !== "Personalidad"
    );
  };

  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  const getIconForLabel = (label: string) => {
    switch (label.toLowerCase()) {
      case "inicio":
        return <HomeIcon className="w-5 h-5" />;
      case "notas":
        return <BookOpenIcon className="w-5 h-5" />;
      case "asistencia":
        return <UserGroupIcon className="w-5 h-5" />;
      case "atrasos":
        return <ClockIcon className="w-5 h-5" />;
      case "certificados":
        return <DocumentTextIcon className="w-5 h-5" />;
      case "acles":
        return <FlagIcon className="w-5 h-5" />;
      case "personalidad":
        return <UserIcon className="w-5 h-5" />;
      case "salir":
        return <LogoutIcon className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <HeroUINavbar className="transition-all duration-300" maxWidth="xl" position="sticky">
      {/* Logo y Brand */}
      <NavbarContent className="basis-1/6 sm:basis-1/5" justify="start">
        <NavbarBrand className="gap-2 max-w-fit">
          <Link
            className="flex justify-start items-center gap-2"
            color="foreground"
            href="/"
          >
            <img alt="LEUMAG" className="flex-shrink-0" height={40} src="/images/logo.png" width={40} />
            <p className="font-bold text-inherit text-lg">LEUMAG</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Navegación Principal - Solo visible en desktop */}
      {isAuthenticated && (
        <NavbarContent className="hidden lg:flex basis-2/3" justify="center">
          <div className="flex gap-6 justify-center items-center">
            {getFilteredNavItems().map((item) => (
              <NavbarItem key={item.href}>
                <Link
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "data-[active=true]:text-primary data-[active=true]:font-medium text-sm font-medium px-3 py-2 rounded-lg transition-colors hover:bg-default-100"
                  )}
                  color="foreground"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </NavbarItem>
            ))}
          </div>
        </NavbarContent>
      )}

      {/* Elementos de Usuario y Controles */}
      <NavbarContent className="basis-1/6 sm:basis-1/5" justify="end">
        <div className="hidden lg:flex items-center gap-3">
          {/* Theme Switch */}
          <NavbarItem>
            <ThemeSwitch />
          </NavbarItem>

          {/* Información de Usuario y Logout */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className="text-xs font-normal text-default-600 bg-default-100 px-3 py-1.5 rounded-full flex items-center gap-1.5 max-w-[200px]">
                <HeartFilledIcon className="text-danger w-3 h-3 flex-shrink-0" />
                <span className="truncate">Hola: {user.email}</span>
              </div>
              <Link
                className="flex items-center gap-1.5 text-xs font-normal text-danger hover:bg-danger-100 px-3 py-1.5 rounded-full transition-colors"
                href="/logout"
                title="Cerrar sesión"
              >
                <LogoutIcon className="text-danger w-4 h-4" />
                <span className="hidden xl:inline">Salir</span>
              </Link>
            </div>
          ) : (
            <Link href="/login">
              <div className="animate-pulse text-xs font-normal text-default-600 bg-default-100 px-3 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer">
                <HeartFilledIcon className="text-danger w-3 h-3" />
                <span>Iniciar sesión</span>
              </div>
            </Link>
          )}
        </div>

        {/* Controles Mobile */}
        <div className="flex lg:hidden items-center gap-2">
          <ThemeSwitch />
          <NavbarMenuToggle />
        </div>
      </NavbarContent>

      {/* Menú Mobile */}
      <NavbarMenu className="bg-default-50 dark:bg-default-900/50 backdrop-blur-lg">
        {isAuthenticated ? (
          <>
            {searchInput}
            <div className="mx-4 mt-4 flex flex-col gap-3">
              {getFilteredNavMenuItems().map((item, index) => (
                <NavbarMenuItem key={`${item}-${index}`}>
                  <Link
                    className="flex items-center gap-3 w-full py-3 px-4 rounded-lg transition-colors hover:bg-default-100 dark:hover:bg-default-800"
                    color={
                      index === 0
                        ? "primary"
                        : index === getFilteredNavMenuItems().length - 1
                          ? "danger"
                          : "foreground"
                    }
                    href={item.href}
                    size="lg"
                  >
                    {getIconForLabel(item.label)}
                    <span>{item.label}</span>
                  </Link>
                </NavbarMenuItem>
              ))}
            </div>
          </>
        ) : (
          <div className="mx-4 mt-4 flex flex-col gap-3">
            <NavbarMenuItem>
              <Link 
                className="flex items-center gap-3 w-full py-3 px-4 rounded-lg transition-colors hover:bg-default-100 dark:hover:bg-default-800"
                color="primary" 
                href="/login" 
                size="lg"
              >
                <HeartFilledIcon className="w-5 h-5" />
                <span>Iniciar sesión</span>
              </Link>
            </NavbarMenuItem>
          </div>
        )}
      </NavbarMenu>
    </HeroUINavbar>
  );
};
