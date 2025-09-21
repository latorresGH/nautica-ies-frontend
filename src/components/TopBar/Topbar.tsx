// features/menu/components/Topbar.tsx
import UserMenu from "./UserMenu";

export default function Topbar() {
  return (
    <header className="h-14 flex items-center justify-between px-4 border-b bg-white top-0 z-0">
      <div className="w-24" />
      <h1 className="text-center font-semibold text-neutral-800 select-none">
        Nautica SANTA FE
      </h1>
      <div className="w-24 flex justify-end">
        {/* si después querés usar tu contexto: <UserMenu onLogout={logout} /> */}
        <UserMenu />
      </div>
    </header>
  );
}

