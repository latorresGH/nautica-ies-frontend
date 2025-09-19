// src/components/widgets/DaysAvaliability/DaysAvailability.tsx
import { useSemanaCalendario } from "../../../hooks/useSemanaCalendario";

export default function DaysAvailability() {
  const { loading, error, openMask, labels } = useSemanaCalendario();

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border shadow-sm p-4">
        <h2 className="font-medium mb-3">Días hábiles de la semana</h2>
        <div className="flex gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="px-3 py-2 rounded-lg text-sm animate-pulse bg-black/10" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border shadow-sm p-4">
        <h2 className="font-medium mb-3">Días hábiles de la semana</h2>
        <div className="text-sm text-red-600">Error: {error}</div>
      </div>
    );
  }

  // Fallbacks defensivos
  const days = Array.isArray(labels) && labels.length === 7 ? labels : ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];
  const mask = Array.isArray(openMask) && openMask.length === 7 ? openMask : [true,true,true,true,true,true,true];

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-4">
      <h2 className="font-medium mb-3">Días hábiles de la semana</h2>
      <div className="flex gap-2">
        {days.map((d, i) => {
          const abierto = !!mask[i];
          return (
            <div
              key={d}
              className={`px-3 py-2 rounded-lg text-sm
                ${abierto ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
              title={abierto ? "Abierto" : "Cerrado"}
            >
              {d}
            </div>
          );
        })}
      </div>
    </div>
  );
}
