export default function Dashboard() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {["Clientes activos", "Tareas hoy", "Ingresos del mes", "Gráfico"].map((t, i) => (
          <div key={i} className="bg-white rounded-2xl border shadow-sm p-4">
            <div className="text-sm text-neutral-500">{t}</div>
            <div className="text-3xl font-semibold mt-2">—</div>
          </div>
        ))}
      </div>
        <div className="bg-red-500 h-10">Tailwind activo</div>

      <section className="bg-white rounded-2xl border shadow-sm p-4">
        <p className="text-neutral-600">Panel listo. Próximo paso: widgets y gráficos.</p>
      </section>
    </div>
  );
}
