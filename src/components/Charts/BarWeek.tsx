import { BarChart, Bar, CartesianGrid, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { BarSemana } from "../../types/menu";

const BAR_COLORS = [
  "#60A5FA", // Lun  (sky-400)
  "#34D399", // Mar  (emerald-400)
  "#A78BFA", // Mié  (violet-400)
  "#F59E0B", // Jue  (amber-500)
  "#38BDF8", // Vie  (sky-400)
  "#F97316", // Sáb  (orange-500)
  "#EF4444", // Dom  (red-500)
];

export default function BarWeek({ data, loading }:{ data: BarSemana; loading: boolean }) {
  return (
    <div className="h-48">
      {loading ? (
        <div className="h-full animate-pulse bg-black/5 rounded-xl" />
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="d" tickLine={false} axisLine={false} />
            <Tooltip />
            <Bar dataKey="v" radius={[8,8,0,0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
