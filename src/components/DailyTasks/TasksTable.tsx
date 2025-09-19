import type { TareaDia } from "../../types/menu";
import Skeleton from "../widgets/Skeleton/Skeleton";

export default function TasksTable({ rows, loading }:{ rows: TareaDia[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({length:5}).map((_,i)=> <Skeleton key={i} className="h-10 rounded-xl" />)}
      </div>
    );
  }

  const pill = (txt:string, color?:TareaDia["estadoColor"]) => {
    const map: Record<string,string> = {
      green: "bg-green-100 text-green-700",
      blue: "bg-blue-100 text-blue-700",
      yellow: "bg-yellow-100 text-yellow-700",
    };
    return <span className={`px-2 py-0.5 rounded-full text-sm ${map[color||"green"]}`}>{txt}</span>;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-neutral-500">
          <tr className="border-b">
            <th className="text-left py-2 pr-2">Nombre</th>
            <th className="text-left py-2 pr-2">Apellido</th>
            <th className="text-left py-2 pr-2">Embarcación</th>
            <th className="text-left py-2 pr-2">Teléfono</th>
            <th className="text-left py-2 pr-2">Tarea</th>
            <th className="text-left py-2 pr-2">Operario</th>
            <th className="text-left py-2 pr-2">Horario</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className="border-b last:border-0">
              <td className="py-2 pr-2">{r.nombre}</td>
              <td className="py-2 pr-2">{r.apellido}</td>
              <td className="py-2 pr-2">{r.embarcacion}</td>
              <td className="py-2 pr-2">{r.telefono}</td>
              <td className="py-2 pr-2">{pill(r.tarea, r.estadoColor)}</td>
              <td className="py-2 pr-2">{r.operario}</td>
              <td className="py-2 pr-2">{r.horario}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
