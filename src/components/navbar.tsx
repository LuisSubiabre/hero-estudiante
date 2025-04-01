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

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { HeartFilledIcon, SearchIcon, LogoutIcon, HomeIcon, BookOpenIcon, UserGroupIcon, ClockIcon, DocumentTextIcon, FlagIcon } from "@/components/icons";
import { useAuth } from "@/context/AuthContext";

export const Navbar = () => {
  const { isAuthenticated, user } = useAuth();

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
      case "salir":
        return <LogoutIcon className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <HeroUINavbar className="transition-all duration-300" maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            href="/"
          >
            <img alt="LEUMAG" src="/images/logo.png" width={46} />
            <p className="font-bold text-inherit">LEUMAG</p>
          </Link>
        </NavbarBrand>
        {isAuthenticated ? (
          <div className="hidden lg:flex gap-4 justify-start ml-2">
            {siteConfig.navItems.map((item) => (
              <NavbarItem key={item.href}>
                <Link
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "data-[active=true]:text-primary data-[active=true]:font-medium"
                  )}
                  color="foreground"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </NavbarItem>
            ))}
          </div>
        ) : null}
      </NavbarContent>

      <NavbarContent
        className="hidden lg:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden lg:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>

        <NavbarItem className="hidden lg:flex gap-2">
          {isAuthenticated ? (
            <>
              <div className="text-sm font-normal text-default-600 bg-default-100 px-4 py-2 rounded-full flex items-center gap-2">
                <HeartFilledIcon className="text-danger" />
                <span>Hola: {user.email}</span>
              </div>
              <Link
                className="flex items-center gap-2 text-sm font-normal text-danger hover:bg-danger-100 px-4 py-2 rounded-full transition-colors"
                href="/logout"
                title="Cerrar sesión"
              >
                <LogoutIcon className="text-danger" size={20} />
                <span>Cerrar sesión</span>
              </Link>
            </>
          ) : (
            <Link href="/login">
              <div className="animate-pulse text-sm font-normal text-default-600 bg-default-100 px-4 py-2 rounded-full flex items-center gap-2 cursor-pointer">
                <HeartFilledIcon className="text-danger" />
                Iniciar sesión
              </div>
            </Link>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="flex lg:hidden" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle className="ml-2" />
      </NavbarContent>

      <NavbarMenu className="bg-default-50 dark:bg-default-900/50 backdrop-blur-lg">
        {isAuthenticated ? (
          <>
            {searchInput}
            <div className="mx-4 mt-4 flex flex-col gap-3">
              {siteConfig.navMenuItems.map((item, index) => (
                <NavbarMenuItem key={`${item}-${index}`}>
                  <Link
                    className="flex items-center gap-3 w-full py-3 px-4 rounded-lg transition-colors hover:bg-default-100 dark:hover:bg-default-800"
                    color={
                      index === 0
                        ? "primary"
                        : index === siteConfig.navMenuItems.length - 1
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
