const { useState, useMemo } = React;
const { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } = Recharts;

const mockIncidents = [
  { id: 1, date: '2025-01-15', time: '08:30', location: 'Sklad Jažlovice', cause: 'Špatně odhadnuté riziko', source: 'Nástroj, nářadí' },
  { id: 2, date: '2025-01-14', time: '14:15', location: 'Sklad Rajhrad', cause: 'Porušení pracovní kázně', source: 'Stroje a zařízení' },
  { id: 3, date: '2025-01-12', time: '10:00', location: 'Centrála Praha', cause: 'Závady na pracovišti', source: 'Pád' },
  { id: 4, date: '2025-01-10', time: '16:45', location: 'Sklad Jažlovice', cause: 'Porucha nebo vadný stav zdroje', source: 'Materiál, břemena' },
  { id: 5, date: '2025-01-08', time: '11:30', location: 'Showroom Holešovice', cause: 'Nepředvídatelné riziko', source: 'Oheň, výbušniny' },
  { id: 6, date: '2025-01-06', time: '09:00', location: 'Sklad Jažlovice', cause: 'Nedostatečné OOPP', source: 'Pád' },
  { id: 7, date: '2025-01-03', time: '13:20', location: 'Sklad Rajhrad', cause: 'Špatně odhadnuté riziko', source: 'Nástroj, nářadí' },
  { id: 8, date: '2024-12-28', time: '07:45', location: 'Sklad Jažlovice', cause: 'Špatně odhadnuté riziko', source: 'Nástroj, nářadí' },
  { id: 9, date: '2024-12-20', time: '15:30', location: 'Sklad Rajhrad', cause: 'Závady na pracovišti', source: 'Pád' },
  { id: 10, date: '2024-12-15', time: '10:15', location: 'Sklad Jažlovice', cause: 'Porušení pracovní kázně', source: 'Materiál, břemena' },
  { id: 11, date: '2024-12-10', time: '12:00', location: 'Centrála Praha', cause: 'Nedostatečné OOPP', source: 'Chemické látky' },
  { id: 12, date: '2024-12-05', time: '08:00', location: 'Showroom Holešovice', cause: 'Špatně odhadnuté riziko', source: 'Pád' },
  { id: 13, date: '2024-11-28', time: '14:45', location: 'Sklad Jažlovice', cause: 'Porucha nebo vadný stav zdroje', source: 'Stroje a zařízení' },
  { id: 14, date: '2024-11-20', time: '09:30', location: 'Sklad Rajhrad', cause: 'Závady na pracovišti', source: 'Pád' },
  { id: 15, date: '2024-11-15', time: '16:00', location: 'Sklad Jažlovice', cause: 'Nepředvídatelné riziko', source: 'Dopravní prostředek' },
  { id: 16, date: '2024-11-10', time: '11:15', location: 'Centrála Praha', cause: 'Špatně odhadnuté riziko', source: 'Nástroj, nářadí' },
  { id: 17, date: '2024-10-25', time: '13:00', location: 'Sklad Jažlovice', cause: 'Porušení pracovní kázně', source: 'Materiál, břemena' },
  { id: 18, date: '2024-10-18', time: '08:45', location: 'Sklad Rajhrad', cause: 'Závady na pracovišti', source: 'Pád' },
  { id: 19, date: '2024-10-12', time: '15:00', location: 'Showroom Holešovice', cause: 'Nedostatečné OOPP', source: 'Stroje a zařízení' },
  { id: 20, date: '2024-10-05', time: '10:30', location: 'Sklad Jažlovice', cause: 'Špatně odhadnuté riziko', source: 'Nástroj, nářadí' },
  { id: 21, date: '2024-09-28', time: '07:30', location: 'Sklad Jažlovice', cause: 'Porucha nebo vadný stav zdroje', source: 'Stroje a zařízení' },
  { id: 22, date: '2024-09-20', time: '14:00', location: 'Sklad Rajhrad', cause: 'Nepředvídatelné riziko', source: 'Pád' },
  { id: 23, date: '2024-09-15', time: '09:15', location: 'Centrála Praha', cause: 'Špatně odhadnuté riziko', source: 'Materiál, břemena' },
  { id: 24, date: '2024-09-08', time: '11:45', location: 'Sklad Jažlovice', cause: 'Závady na pracovišti', source: 'Nástroj, nářadí' },
  { id: 25, date: '2024-08-25', time: '16:30', location: 'Sklad Rajhrad', cause: 'Porušení pracovní kázně', source: 'Pád' },
  { id: 26, date: '2024-08-18', time: '08:15', location: 'Showroom Holešovice', cause: 'Nedostatečné OOPP', source: 'Chemické látky' },
  { id: 27, date: '2024-08-10', time: '13:45', location: 'Sklad Jažlovice', cause: 'Špatně odhadnuté riziko', source: 'Stroje a zařízení' },
  { id: 28, date: '2024-07-22', time: '10:00', location: 'Centrála Praha', cause: 'Porucha nebo vadný stav zdroje', source: 'Elektrická energie' },
  { id: 29, date: '2024-07-15', time: '15:15', location: 'Sklad Jažlovice', cause: 'Závady na pracovišti', source: 'Pád' },
  { id: 30, date: '2024-07-08', time: '07:00', location: 'Sklad Rajhrad', cause: 'Nepředvídatelné riziko', source: 'Materiál, břemena' },
  { id: 31, date: '2024-06-25', time: '12:30', location: 'Sklad Jažlovice', cause: 'Špatně odhadnuté riziko', source: 'Nástroj, nářadí' },
  { id: 32, date: '2024-06-18', time: '09:45', location: 'Showroom Holešovice', cause: 'Porušení pracovní kázně', source: 'Pád' },
  { id: 33, date: '2024-06-10', time: '14:30', location: 'Sklad Rajhrad', cause: 'Nedostatečné OOPP', source: 'Stroje a zařízení' },
  { id: 34, date: '2024-05-28', time: '08:00', location: 'Sklad Jažlovice', cause: 'Závady na pracovišti', source: 'Materiál, břemena' },
  { id: 35, date: '2024-05-20', time: '16:15', location: 'Centrála Praha', cause: 'Porucha nebo vadný stav zdroje', source: 'Pád' },
  { id: 36, date: '2024-05-12', time: '11:00', location: 'Sklad Jažlovice', cause: 'Špatně odhadnuté riziko', source: 'Chemické látky' },
  { id: 37, date: '2024-04-25', time: '13:15', location: 'Sklad Rajhrad', cause: 'Nepředvídatelné riziko', source: 'Nástroj, nářadí' },
  { id: 38, date: '2024-04-18', time: '07:45', location: 'Showroom Holešovice', cause: 'Porušení pracovní kázně', source: 'Stroje a zařízení' },
  { id: 39, date: '2024-04-10', time: '15:45', location: 'Sklad Jažlovice', cause: 'Závady na pracovišti', source: 'Pád' },
  { id: 40, date: '2024-03-28', time: '10:30', location: 'Sklad Jažlovice', cause: 'Špatně odhadnuté riziko', source: 'Materiál, břemena' },
  { id: 41, date: '2024-03-20', time: '08:30', location: 'Centrála Praha', cause: 'Nedostatečné OOPP', source: 'Pád' },
  { id: 42, date: '2024-03-12', time: '14:00', location: 'Sklad Rajhrad', cause: 'Porucha nebo vadný stav zdroje', source: 'Stroje a zařízení' },
  { id: 43, date: '2024-02-25', time: '09:00', location: 'Sklad Jažlovice', cause: 'Závady na pracovišti', source: 'Nástroj, nářadí' },
  { id: 44, date: '2024-02-18', time: '12:15', location: 'Showroom Holešovice', cause: 'Nepředvídatelné riziko', source: 'Pád' },
  { id: 45, date: '2024-02-10', time: '16:00', location: 'Sklad Rajhrad', cause: 'Špatně odhadnuté riziko', source: 'Chemické látky' },
  { id: 46, date: '2024-01-28', time: '07:15', location: 'Sklad Jažlovice', cause: 'Porušení pracovní kázně', source: 'Materiál, břemena' },
  { id: 47, date: '2024-01-20', time: '13:30', location: 'Centrála Praha', cause: 'Nedostatečné OOPP', source: 'Stroje a zařízení' },
  { id: 48, date: '2024-01-12', time: '10:45', location: 'Sklad Jažlovice', cause: 'Závady na pracovišti', source: 'Pád' },
  { id: 49, date: '2023-12-15', time: '09:30', location: 'Sklad Jažlovice', cause: 'Špatně odhadnuté riziko', source: 'Nástroj, nářadí' },
  { id: 50, date: '2023-11-20', time: '14:45', location: 'Sklad Rajhrad', cause: 'Porucha nebo vadný stav zdroje', source: 'Stroje a zařízení' },
  { id: 51, date: '2023-10-18', time: '08:00', location: 'Centrála Praha', cause: 'Nepředvídatelné riziko', source: 'Pád' },
  { id: 52, date: '2023-09-25', time: '11:30', location: 'Sklad Jažlovice', cause: 'Závady na pracovišti', source: 'Materiál, břemena' },
  { id: 53, date: '2023-08-15', time: '15:00', location: 'Showroom Holešovice', cause: 'Porušení pracovní kázně', source: 'Pád' },
  { id: 54, date: '2023-07-22', time: '07:45', location: 'Sklad Rajhrad', cause: 'Nedostatečné OOPP', source: 'Chemické látky' },
  { id: 55, date: '2023-06-18', time: '13:00', location: 'Sklad Jažlovice', cause: 'Špatně odhadnuté riziko', source: 'Stroje a zařízení' },
  { id: 56, date: '2023-05-12', time: '10:15', location: 'Centrála Praha', cause: 'Porucha nebo vadný stav zdroje', source: 'Nástroj, nářadí' },
  { id: 57, date: '2023-04-08', time: '16:30', location: 'Sklad Jažlovice', cause: 'Závady na pracovišti', source: 'Pád' },
  { id: 58, date: '2023-03-25', time: '08:45', location: 'Sklad Rajhrad', cause: 'Nepředvídatelné riziko', source: 'Materiál, břemena' },
  { id: 59, date: '2023-02-18', time: '12:00', location: 'Showroom Holešovice', cause: 'Špatně odhadnuté riziko', source: 'Stroje a zařízení' },
  { id: 60, date: '2023-01-10', time: '09:15', location: 'Sklad Jažlovice', cause: 'Porušení pracovní kázně', source: 'Pád' },
  { id: 61, date: '2022-12-20', time: '14:30', location: 'Sklad Jažlovice', cause: 'Nedostatečné OOPP', source: 'Chemické látky' },
  { id: 62, date: '2022-11-15', time: '07:30', location: 'Sklad Rajhrad', cause: 'Závady na pracovišti', source: 'Nástroj, nářadí' },
  { id: 63, date: '2022-10-08', time: '11:00', location: 'Centrála Praha', cause: 'Porucha nebo vadný stav zdroje', source: 'Stroje a zařízení' },
  { id: 64, date: '2022-09-22', time: '15:45', location: 'Sklad Jažlovice', cause: 'Špatně odhadnuté riziko', source: 'Pád' },
  { id: 65, date: '2022-08-18', time: '08:15', location: 'Showroom Holešovice', cause: 'Nepředvídatelné riziko', source: 'Materiál, břemena' },
  { id: 66, date: '2022-07-12', time: '13:45', location: 'Sklad Rajhrad', cause: 'Porušení pracovní kázně', source: 'Stroje a zařízení' },
  { id: 67, date: '2022-06-05', time: '10:00', location: 'Sklad Jažlovice', cause: 'Závady na pracovišti', source: 'Pád' },
  { id: 68, date: '2022-05-28', time: '16:15', location: 'Centrála Praha', cause: 'Nedostatečné OOPP', source: 'Nástroj, nářadí' },
  { id: 69, date: '2022-04-20', time: '09:30', location: 'Sklad Jažlovice', cause: 'Špatně odhadnuté riziko', source: 'Chemické látky' },
  { id: 70, date: '2022-03-15', time: '12:45', location: 'Sklad Rajhrad', cause: 'Porucha nebo vadný stav zdroje', source: 'Stroje a zařízení' },
];

const COLORS = { primary: '#8BC34A', secondary: '#FF9800', accent: '#2196F3' };
const LOCATION_COLORS = { 'Sklad Jažlovice': '#8BC34A', 'Sklad Rajhrad': '#FF9800', 'Centrála Praha': '#2196F3', 'Showroom Holešovice': '#9C27B0' };
const dayNamesShort = ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'];

const StatCard = ({ title, value, subtitle, icon }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h2 className="text-4xl font-bold text-gray-900 my-2">{value}</h2>
        {subtitle && <p className="text-gray-400 text-xs">{subtitle}</p>}
      </div>
      <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl">{icon}</div>
    </div>
  </div>
);

const ChartCard = ({ title, subtitle, children }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
    <div className="mb-5">
      <h3 className="text-gray-900 text-base font-semibold">{title}</h3>
      {subtitle && <p className="text-gray-400 text-xs mt-1">{subtitle}</p>}
    </div>
    {children}
  </div>
);

const HeatmapCell = ({ value, maxValue }) => {
  const intensity = maxValue > 0 ? value / maxValue : 0;
  const style = value > 0 ? { backgroundColor: `rgba(139, 195, 74, ${0.2 + intensity * 0.8})` } : { backgroundColor: '#f9fafb' };
  return (
    <div 
      className={`aspect-square rounded flex items-center justify-center text-xs border border-gray-200 ${intensity > 0.5 ? 'text-white' : 'text-gray-700'} ${value > 0 ? 'font-semibold' : ''}`}
      style={style}
    >
      {value > 0 ? value : ''}
    </div>
  );
};

function Dashboard() {
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const years = useMemo(() => [...new Set(mockIncidents.map(i => new Date(i.date).getFullYear()))].sort((a, b) => b - a), []);
  const locations = useMemo(() => [...new Set(mockIncidents.map(i => i.location))].sort(), []);

  const filteredIncidents = useMemo(() => mockIncidents.filter(i => {
    const year = new Date(i.date).getFullYear().toString();
    return (selectedYear === 'all' || year === selectedYear) && (selectedLocation === 'all' || i.location === selectedLocation);
  }), [selectedYear, selectedLocation]);

  const yearQuarterData = useMemo(() => {
    const data = {};
    years.forEach(year => { for (let q = 1; q <= 4; q++) { const key = `${year} Q${q}`; data[key] = { name: key, year, quarter: q }; locations.forEach(loc => { data[key][loc] = 0; }); } });
    mockIncidents.forEach(i => { const d = new Date(i.date); const key = `${d.getFullYear()} Q${Math.ceil((d.getMonth() + 1) / 3)}`; if (data[key]) data[key][i.location]++; });
    return Object.values(data).sort((a, b) => a.year !== b.year ? a.year - b.year : a.quarter - b.quarter);
  }, [years, locations]);

  const dayHourMatrix = useMemo(() => {
    const matrix = {}; for (let d = 0; d < 7; d++) { matrix[d] = {}; for (let h = 6; h <= 18; h++) matrix[d][h] = 0; }
    let maxValue = 0;
    filteredIncidents.forEach(i => { const day = new Date(i.date).getDay(); const hour = parseInt(i.time.split(':')[0]); if (hour >= 6 && hour <= 18) { matrix[day][hour]++; maxValue = Math.max(maxValue, matrix[day][hour]); } });
    return { matrix, maxValue };
  }, [filteredIncidents]);

  const dayOfWeekData = useMemo(() => {
    const counts = [0, 0, 0, 0, 0, 0, 0];
    filteredIncidents.forEach(i => counts[new Date(i.date).getDay()]++);
    return dayNamesShort.map((name, i) => ({ name, počet: counts[i] }));
  }, [filteredIncidents]);

  const sourceData = useMemo(() => {
    const counts = {}; filteredIncidents.forEach(i => counts[i.source] = (counts[i.source] || 0) + 1);
    return Object.entries(counts).map(([name, value]) => ({ name, počet: value })).sort((a, b) => b.počet - a.počet);
  }, [filteredIncidents]);

  const causeData = useMemo(() => {
    const counts = {}; filteredIncidents.forEach(i => counts[i.cause] = (counts[i.cause] || 0) + 1);
    return Object.entries(counts).map(([name, value]) => ({ name: name.length > 18 ? name.slice(0, 16) + '...' : name, počet: value })).sort((a, b) => b.počet - a.počet);
  }, [filteredIncidents]);

  const yearlyData = useMemo(() => years.map(year => ({ name: year.toString(), počet: mockIncidents.filter(i => new Date(i.date).getFullYear() === year).length })).reverse(), [years]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-green-500 text-white px-4 py-2 rounded-md font-bold text-sm">alza.cz</div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Evidence úrazů</h1>
              <p className="text-xs text-gray-500">Dashboard BOZP</p>
            </div>
          </div>
          <div className="flex gap-3">
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-sm">
              <option value="all">Všechny roky</option>
              {years.map(y => <option key={y} value={y.toString()}>{y}</option>)}
            </select>
            <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-sm">
              <option value="all">Všechny lokality</option>
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-4 gap-5 mb-7">
          <StatCard title="Celkem úrazů" value={filteredIncidents.length} subtitle="Ve vybraném období" icon="📊" />
          <StatCard title="Rok 2025" value={mockIncidents.filter(i => new Date(i.date).getFullYear() === 2025).length} icon="📅" />
          <StatCard title="Lokality" value={locations.length} subtitle="Sledované" icon="📍" />
          <StatCard title="Průměr/rok" value={Math.round(mockIncidents.length / years.length)} icon="📈" />
        </div>

        <div className="mb-7">
          <ChartCard title="Počet úrazů podle roků a kvartálů" subtitle="Rozložení podle lokalit">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={yearQuarterData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9E9E9E', fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9E9E9E', fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ paddingTop: '16px' }} />
                {locations.map((loc, i) => <Bar key={loc} dataKey={loc} stackId="a" fill={LOCATION_COLORS[loc]} radius={i === locations.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]} />)}
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="grid grid-cols-3 gap-5 mb-7">
          <div className="col-span-2">
            <ChartCard title="Matice: Den v týdnu vs. Hodina úrazu" subtitle="Kdy dochází k úrazům nejčastěji">
              <div className="grid gap-1" style={{ gridTemplateColumns: 'auto repeat(13, 1fr)' }}>
                <div></div>
                {Array.from({ length: 13 }, (_, i) => i + 6).map(h => <div key={h} className="text-center text-xs text-gray-400">{h}h</div>)}
                {[1, 2, 3, 4, 5, 6, 0].map(day => (
                  <React.Fragment key={day}>
                    <div className="flex items-center text-xs text-gray-500 pr-2 font-medium">{dayNamesShort[day]}</div>
                    {Array.from({ length: 13 }, (_, i) => i + 6).map(h => <HeatmapCell key={`${day}-${h}`} value={dayHourMatrix.matrix[day]?.[h] || 0} maxValue={dayHourMatrix.maxValue} />)}
                  </React.Fragment>
                ))}
              </div>
            </ChartCard>
          </div>
          <ChartCard title="Úrazy podle dne v týdnu">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={dayOfWeekData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9E9E9E', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9E9E9E', fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="počet" fill={COLORS.primary} radius={[4, 4, 0, 0]}>
                  {dayOfWeekData.map((_, i) => <Cell key={i} fill={i === 0 || i === 6 ? COLORS.secondary : COLORS.primary} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="grid grid-cols-2 gap-5 mb-7">
          <ChartCard title="Zdroje úrazů" subtitle="Co způsobilo zranění">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={sourceData} layout="vertical">
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#9E9E9E', fontSize: 11 }} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9E9E9E', fontSize: 11 }} width={110} />
                <Tooltip />
                <Bar dataKey="počet" fill={COLORS.accent} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Příčiny úrazů" subtitle="Analýza příčin">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={causeData} layout="vertical">
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#9E9E9E', fontSize: 11 }} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9E9E9E', fontSize: 11 }} width={130} />
                <Tooltip />
                <Bar dataKey="počet" fill={COLORS.secondary} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <ChartCard title="Vývoj podle roků" subtitle="Trend v čase">
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={yearlyData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9E9E9E', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9E9E9E', fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="počet" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Podíl lokalit" subtitle="Celkové rozložení">
            <ResponsiveContainer width="100%" height={230}>
              <PieChart>
                <Pie data={locations.map(l => ({ name: l, value: mockIncidents.filter(i => i.location === l).length }))} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={2} dataKey="value">
                  {locations.map((l, i) => <Cell key={i} fill={LOCATION_COLORS[l]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </main>

      <footer className="border-t border-gray-200 py-5 text-center bg-white mt-8">
        <p className="text-gray-400 text-xs">Evidence pracovních úrazů © 2025 • Systém BOZP</p>
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Dashboard />);
