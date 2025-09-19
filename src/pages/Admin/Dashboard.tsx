// src/pages/admin/Dashboard.tsx
import { Activity, UsersRound, Banknote } from "lucide-react";
import StatCard from "../../components/widgets/StatCard/StatCard";
import DaysAvailability from "../../components/widgets/DaysAvaliability/DaysAvailability";
import BarWeek from "../../components/Charts/BarWeek";
import DonutPagos from "../../components/Charts/DonutPagos";
import TasksTable from "../../components/DailyTasks/TasksTable";

import { useDashboardData } from "../../hooks/useDashboardData";
import { useSemanaCalendario } from "../../hooks/useSemanaCalendario";
import { useBarSemana } from "../../hooks/useBarSemana";

export default function Dashboard() {
  // KPIs, donut y tareas
  const { loading, error, kpis, donut, tareas } = useDashboardData();

  // Barra: alturas numéricas
  const bar = useBarSemana(1);

  // Calendario: abierto/cerrado + labels
  const cal = useSemanaCalendario();

  // loading combinado para el chart
  const loadingCharts = loading || bar.loading || cal.loading;

  return (
    <div className="space-y-6">
      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-xl">
          {error}
        </div>
      ) : null}

      {/* --- Tarjetas superiores --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Clientes activos"
          value={kpis?.clientesActivos ?? 0}
          loading={loading}
          icon={<UsersRound size={18} />}
        />
        <StatCard
          title="Tareas hoy"
          value={kpis?.tareasHoy ?? 0}
          loading={loading}
          icon={<Activity size={18} />}
        />
        <StatCard
          title="Ingresos del mes"
          value={`$ ${kpis?.ingresosMes?.toFixed?.(2) ?? "0.00"}`}
          loading={loading}
          icon={<Banknote size={18} />}
        />
        <div className="bg-white rounded-2xl border shadow-sm p-4">
          <div className="text-sm text-neutral-500 mb-2">Estado de pagos del mes</div>
          <DonutPagos data={donut} loading={loading} />
        </div>
      </div>

      {/* --- Barras S-1 + Días hábiles --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section className="bg-white rounded-2xl border shadow-sm p-4 lg:col-span-2">
          <h2 className="font-medium mb-2">Tareas realizadas S-1</h2>
          <BarWeek
            data={bar.data}
            loading={loadingCharts}
            openMask={cal.openMask}
            labels={cal.labels}
          />
        </section>

        <DaysAvailability />
      </div>

      {/* --- Tareas del día --- */}
      <section className="bg-white rounded-2xl border shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-medium">Tareas del día</h2>
          <button className="text-sm text-blue-600">Ver todo</button>
        </div>
        <TasksTable rows={Array.isArray(tareas) ? tareas : []} loading={loading} />
      </section>
    </div>
  );
}
