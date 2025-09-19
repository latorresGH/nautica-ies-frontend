// src/utils/fechas.ts
export function getWeekRange(date = new Date()) {
  // Asumimos semana que empieza Lunes. Trabajamos en local time.
  const d = new Date(date);
  const day = d.getDay(); // 0=Dom,1=Lun,...6=Sab
  const diffToMonday = (day + 6) % 7; // cuántos días restar hasta lunes
  const monday = new Date(d);
  monday.setDate(d.getDate() - diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const toISO = (x: Date) => x.toISOString().slice(0, 10); // YYYY-MM-DD (local→UTC ojo: si querés exactitud TZ, usa dayjs/temporal)

  return { from: toISO(monday), to: toISO(sunday), monday, sunday };
}
