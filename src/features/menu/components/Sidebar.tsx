import { NavLink } from "react-router-dom";
import { LayoutDashboard, Calendar, Store, Users, Ship, BarChart3, Megaphone } from "lucide-react";

const items = [
  { to: "/", label: "Inicio", icon: LayoutDashboard },
  { to: "/calendario", label: "Calendario", icon: Calendar },
  { to: "/tienda", label: "Tienda virtual", icon: Store },
  { to: "/operarios", label: "Operarios", icon: Users },
  { to: "/clientes-embarcaciones", label: "Clientes y Embarcaciones", icon: Ship },
  { to: "/reportes", label: "Análisis y Reportes", icon: BarChart3 },
  { to: "/anuncios", label: "Anuncios", icon: Megaphone },
];

export default function Sidebar() {
  return (
    // Contenedor relativo para posicionar el flyout
    <aside className="relative h-screen bg-white border-r shadow-sm group">
      {/* ---- Raíl fijo (64px) ---- */}
      <div className="w-16 h-full flex flex-col group-hover:pointer-events-none">
        <div className="h-14 flex items-center justify-center border-b">
          <div className="w-6 h-6 rounded-full bg-neutral-200" />
        </div>
        <nav className="py-2 flex-1">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end
              className={({ isActive }) =>
                `block no-underline text-inherit mx-2 my-1 rounded-xl ${
                  isActive ? "bg-black/5" : "hover:bg-black/5"
                }`
              }
              title={it.label}
            >
              <div className="h-9 px-3 flex items-center justify-center">
                <it.icon size={18} />
              </div>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* ---- Bandeja flotante (no empuja el layout) ---- */}
      <div
        className="pointer-events-none group-hover:pointer-events-auto
                    absolute left-0 top-0 bottom-0 w-64
                    opacity-0 group-hover:opacity-100 transition-opacity
                    bg-white border-r shadow-xl z-20"
      >
        <div className="h-14 flex items-center px-4 border-b font-medium">
          Menú
        </div>
        <nav className="py-2">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 mx-2 my-1 rounded-xl px-3 py-2 no-underline text-inherit ${
                  isActive ? "bg-black/5" : "hover:bg-black/5"
                }`
              }
            >
              <it.icon size={18} />
              <span className="text-sm">{it.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
