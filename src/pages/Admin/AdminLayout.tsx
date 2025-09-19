import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar"
import Topbar from "../../components/TopBar/Topbar";

export default function MainLayout() {
  return (
    // 👇 ancho completo y alto pantalla; dos columnas fijas: 64px + resto
    <div className="w-screen min-h-screen bg-neutral-50 text-neutral-900 grid grid-cols-[64px_1fr]">
      <Sidebar />
      <div className="flex flex-col w-full min-w-0">
        <Topbar />
        {/* El área de contenido ocupa todo y hace scroll si hace falta */}
        <main className="p-4 md:p-6 lg:p-8 min-h-[calc(100vh-56px)] w-full overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

