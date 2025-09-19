import type { LucideIcon } from "lucide-react";

type Props = { icon: LucideIcon; label: string; active?: boolean };

export default function SidebarItem({ icon: Icon, label, active }: Props) {
  return (
    <div
      className={`mx-2 my-1 flex items-center gap-3 rounded-xl px-3 py-2 transition-colors
      ${active ? "bg-black/5 text-black" : "hover:bg-black/5 text-neutral-700"}`}
    >
      <Icon size={18} className="min-w-5" />
      {/* El texto aparece cuando la sidebar se expande por hover */}
      <span className="text-sm opacity-0 -translate-x-2 whitespace-nowrap overflow-hidden
                       group-hover:opacity-100 group-hover:translate-x-0 transition-all">
        {label}
      </span>
    </div>
  );
}
