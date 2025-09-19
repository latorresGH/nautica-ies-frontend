// features/menu/components/UserMenu.tsx
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUserDisplayName } from "../api/authToken";

type Props = {
  onLogout?: () => void; // opcional: si tenés tu propio logout()
};

export default function UserMenu({ onLogout }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const name = getUserDisplayName() ?? "Usuario";
  const initial = name.trim().charAt(0).toUpperCase() || "U";

  // cerrar al hacer click afuera
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const handleLogout = () => {
    if (onLogout) onLogout();
    else {
      localStorage.removeItem("auth_token");
      sessionStorage.removeItem("auth_token");
    }
    navigate("/login", { replace: true });
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm bg-white hover:bg-neutral-50"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <div className="w-7 h-7 rounded-full bg-neutral-200 grid place-items-center font-medium">
          {initial}
        </div>
        <span className="hidden sm:inline max-w-[160px] truncate">{name}</span>
        <ChevronDown size={16} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-44 rounded-xl border bg-white shadow-lg overflow-hidden z-50"
        >
          <button
            role="menuitem"
            className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50"
          >
            Perfil
          </button>
          <button
            role="menuitem"
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 text-red-600"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
