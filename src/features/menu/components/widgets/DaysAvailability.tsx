const days = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];

export default function DaysAvailability() {
  // Mock: marcamos Mié como no hábil
  const status: ("ok"|"off")[] = ["ok","ok","off","ok","ok","ok","ok"];

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-4">
      <h2 className="font-medium mb-3">Días hábiles de la semana</h2>
      <div className="flex gap-2">
        {days.map((d, i) => (
          <div
            key={d}
            className={`px-3 py-2 rounded-lg text-sm
              ${status[i]==="ok" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            {d}
          </div>
        ))}
      </div>
    </div>
  );
}
