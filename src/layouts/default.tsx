import { Link } from "@heroui/link";
import packageJson from "../../package.json";

import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
       
          <span className="text-default-600">Desarrollado por</span> 
          <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://liceoexperimental.cl"
          title="Leumag homepage"
        >
          <p className="text-primary">Liceo Experimental Umag</p> 
           </Link>
          <span className="text-default-600">v{packageJson.version}</span>
      
      </footer>
    </div>
  );
}
