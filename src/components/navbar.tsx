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
import { HeartFilledIcon, SearchIcon, LogoutIcon } from "@/components/icons";
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

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
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
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>

        <NavbarItem className="hidden md:flex gap-2">
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

      <NavbarContent className="sm:hidden" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        {isAuthenticated ? (
          <>
            {searchInput}
            <div className="mx-4 mt-2 flex flex-col gap-2">
              {siteConfig.navMenuItems.map((item, index) => (
                <NavbarMenuItem key={`${item}-${index}`}>
                  <Link
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
                    {item.label}
                  </Link>
                </NavbarMenuItem>
              ))}
            </div>
          </>
        ) : (
          <div className="mx-4 mt-2 flex flex-col gap-2">
            <NavbarMenuItem>
              <Link color="primary" href="/login" size="lg">
                Iniciar sesión
              </Link>
            </NavbarMenuItem>
          </div>
        )}
      </NavbarMenu>
    </HeroUINavbar>
  );
};
