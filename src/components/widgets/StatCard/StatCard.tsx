import Skeleton from "../Skeleton/Skeleton";
import type {Props}  from "../../../types/StatCardType";

export default function StatCard({ title, value, icon, loading = false }: Props) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-4 flex items-start gap-3">
      {icon && <div className="mt-1">{icon}</div>}
      <div className="flex-1">
        <div className="text-sm text-neutral-500">{title}</div>
        {loading ? (
          <Skeleton className="h-6 w-24 mt-2" />
        ) : (
          <div className="text-2xl font-semibold mt-2">{value ?? "—"}</div>
        )}
      </div>
    </div>
  );
}

