export default function Topbar() {
  return (
    <header className="h-14 flex items-center justify-between px-4 border-b bg-white sticky top-0 z-20">
      <div className="w-24" /> {/* espacio para balancear el centrado */}
      <h1 className="text-center font-semibold text-neutral-800 select-none">
        Nombre de la Náutica aquí
      </h1>
      <div className="w-24 text-right text-sm">Usuario</div> {/* luego lo convertimos en menú */}
    </header>
  );
}
