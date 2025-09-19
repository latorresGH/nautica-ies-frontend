// src/components/Charts/BarWeek.tsx
import { BarChart, Bar, CartesianGrid, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { BarSemana } from "@/types/menu";

const BAR_COLORS = ["#60A5FA","#34D399","#A78BFA","#F59E0B","#38BDF8","#F97316","#EF4444"];
const CLOSED_COLOR = "#D1D5DB";

type Props = {
  data: BarSemana;
  loading: boolean;
  openMask?: boolean[];
  labels?: string[];
};

export default function BarWeek({ data, loading, openMask, labels }: Props) {
  const plotted = labels && labels.length === data.length
    ? data.map((d, i) => ({ ...d, d: labels[i] }))
    : data;

  if (loading) {
    return <div className="h-48 animate-pulse bg-black/5 rounded-xl" />;
  }

  if (!plotted || plotted.length === 0) {
    return <div className="h-48 grid place-items-center text-sm text-neutral-500">Sin datos</div>;
  }

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={plotted}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="d" tickLine={false} axisLine={false} />
          <Tooltip />
          <Bar dataKey="v" radius={[8,8,0,0]}>
            {plotted.map((_, i) => {
              const isOpen = openMask ? !!openMask[i] : true;
              const fill = isOpen ? BAR_COLORS[i % BAR_COLORS.length] : CLOSED_COLOR;
              return <Cell key={i} fill={fill} opacity={isOpen ? 1 : 0.6} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
