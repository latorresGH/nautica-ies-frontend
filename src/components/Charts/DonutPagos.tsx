import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { DonutPagos as DonutData } from "../../types/menu";

const COLORS: Record<string, string> = {
  "Pago":      "#83df83", // green-500
  "Pendiente": "#F59E0B", // amber-500
  "Adeuda":    "#EF4444", // red-500
};

export default function DonutPagos({ data, loading }:{ data: DonutData; loading: boolean }) {
  return (
    <div className="h-48">
      {loading ? (
        <div className="h-full animate-pulse bg-black/5 rounded-xl" />
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={0}
            >
              {data.map((entry, i) => (
                <Cell
                  key={i}
                  fill={COLORS[entry.name] ?? "#9CA3AF"}  // fallback gray
                  stroke="#00000096"
                  strokeWidth={1}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={24} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
