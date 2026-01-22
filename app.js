const { useState, useMemo, useEffect } = React;
const { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } = Recharts;

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSuLoAIfMc889kp56PKQIEE6mmdQwako_Orxj1ZmSjbmChHfQilbKx82X3LzwYy9nci_G780ApKj1ZH/pub?output=csv';

const COLORS = { primary: '#8BC34A', secondary: '#FF9800', accent: '#2196F3' };
const dayNamesShort = ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'];

function parseCSV(text) {
  const lines = text.split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] ? values[index].replace(/"/g, '').trim() : '';
    });
    data.push(row);
  }
  return data;
}

function parseDate(dateStr) {
  if (!dateStr) return null;
  // Formát DD.MM.YYYY nebo YYYY-MM-DD
  if (dateStr.includes('.')) {
    const [day, month, year] = dateStr.split('.');
    return new Date(year, month - 1, day);
  }
  return new Date(dateStr);
}

function parseTime(timeStr) {
  if (!timeStr) return '08:00';
  // Vrátí čas ve formátu HH:MM
  const match = timeStr.match(/(\d{1,2}):(\d{2})/);
  if (match) return `${match[1].padStart(2, '0')}:${match[2]}`;
  return '08:00';
}

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
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  useEffect(() => {
    fetch(SHEET_URL)
      .then(response => response.text())
      .then(text => {
        const rawData = parseCSV(text);
        const parsed = rawData.map((row, index) => ({
          id: index + 1,
          date: row['Datum úrazu'] || '',
          time: parseTime(row['Čas úrazu']),
          location: row['Místo úrazu'] || 'Neuvedeno',
          cause: row['Příčina'] || 'Neuvedeno',
          source: row['Zdroj'] || 'Neuvedeno',
          injuryType: row['Druh zranění'] || 'Neuvedeno',
          severity: row['Závažnost'] || 'Neuvedeno',
          bodyPart: row['Část těla'] || 'Neuvedeno',
          employee: row['Jméno a příjmení'] || 'Neuvedeno',
        })).filter(row => row.date);
        setIncidents(parsed);
        setLoading(false);
      })
      .catch(err => {
        setError('Nepodařilo se načíst data');
        setLoading(false);
      });
  }, []);

  const years = useMemo(() => {
    const uniqueYears = [...new Set(incidents.map(i => {
      const d = parseDate(i.date);
      return d ? d.getFullYear() : null;
    }).filter(Boolean))];
    return uniqueYears.sort((a, b) => b - a);
  }, [incidents]);

  const locations = useMemo(() => [...new Set(incidents.map(i => i.location))].filter(l => l && l !== 'Neuvedeno').sort(), [incidents]);

  const filteredIncidents = useMemo(() => incidents.filter(i => {
    const d = parseDate(i.date);
    if (!d) return false;
    const year = d.getFullYear().toString();
    return (selectedYear === 'all' || year === selectedYear) && (selectedLocation === 'all' || i.location === selectedLocation);
  }), [incidents, selectedYear, selectedLocation]);

  const locationColors = useMemo(() => {
    const colors = ['#8BC34A', '#FF9800', '#2196F3', '#9C27B0', '#F44336', '#00BCD4', '#E91E63'];
    const colorMap = {};
    locations.forEach((loc, i) => {
      colorMap[loc] = colors[i % colors.length];
    });
    return colorMap;
  }, [locations]);

  const yearQuarterData = useMemo(() => {
    const data = {};
    years.forEach(year => {
      for (let q = 1; q <= 4; q++) {
        const key = `${year} Q${q}`;
        data[key] = { name: key, year, quarter: q };
        locations.forEach(loc => { data[key][loc] = 0; });
      }
    });
    incidents.forEach(i => {
      const d = parseDate(i.date);
      if (!d) return;
      const key = `${d.getFullYear()} Q${Math.ceil((d.getMonth() + 1) / 3)}`;
      if (data[key] && i.location) data[key][i.location] = (data[key][i.location] || 0) + 1;
    });
    return Object.values(data).sort((a, b) => a.year !== b.year ? a.year - b.year : a.quarter - b.quarter);
  }, [incidents, years, locations]);

  const dayHourMatrix = useMemo(() => {
    const matrix = {};
    for (let d = 0; d < 7; d++) { matrix[d] = {}; for (let h = 6; h <= 18; h++) matrix[d][h] = 0; }
    let maxValue = 0;
    filteredIncidents.forEach(i => {
      const d = parseDate(i.date);
      if (!d) return;
      const day = d.getDay();
      const hour = parseInt(i.time.split(':')[0]);
      if (hour >= 6 && hour <= 18) {
        matrix[day][hour]++;
        maxValue = Math.max(maxValue, matrix[day][hour]);
      }
    });
    return { matrix, maxValue };
  }, [filteredIncidents]);

  const dayOfWeekData = useMemo(() => {
    const counts = [0, 0, 0, 0, 0, 0, 0];
    filteredIncidents.forEach(i => {
      const d = parseDate(i.date);
      if (d) counts[d.getDay()]++;
    });
    return dayNamesShort.map((name, i) => ({ name, počet: counts[i] }));
  }, [filteredIncidents]);

  const sourceData = useMemo(() => {
    const counts = {};
    filteredIncidents.forEach(i => { if (i.source) counts[i.source] = (counts[i.source] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, počet: value })).sort((a, b) => b.počet - a.počet).slice(0, 10);
  }, [filteredIncidents]);

  const causeData = useMemo(() => {
    const counts = {};
    filteredIncidents.forEach(i => { if (i.cause) counts[i.cause] = (counts[i.cause] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name: name.length > 20 ? name.slice(0, 18) + '...' : name, fullName: name, počet: value })).sort((a, b) => b.počet - a.počet).slice(0, 10);
  }, [filteredIncidents]);

  const yearlyData = useMemo(() => years.map(year => ({
    name: year.toString(),
    počet: incidents.filter(i => { const d = parseDate(i.date); return d && d.getFullYear() === year; }).length
  })).reverse(), [incidents, years]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Načítám data z Google Sheets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl mb-2">⚠️ Chyba</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-green-500 text-white px-4 py-2 rounded-md font-bold text-sm">alza.cz</div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Evidence úrazů</h1>
              <p className="text-xs text-gray-500">Dashboard BOZP • Data z Google Sheets</p>
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
          <StatCard title="Tento rok" value={incidents.filter(i => { const d = parseDate(i.date); return d && d.getFullYear() === new Date().getFullYear(); }).length} icon="📅" />
          <StatCard title="Lokality" value={locations.length} subtitle="Sledované" icon="📍" />
          <StatCard title="Průměr/rok" value={years.length ? Math.round(incidents.length / years.length) : 0} icon="📈" />
        </div>

        {yearQuarterData.length > 0 && (
          <div className="mb-7">
            <ChartCard title="Počet úrazů podle roků a kvartálů" subtitle="Rozložení podle lokalit">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={yearQuarterData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9E9E9E', fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9E9E9E', fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ paddingTop: '16px' }} />
                  {locations.map((loc, i) => <Bar key={loc} dataKey={loc} stackId="a" fill={locationColors[loc]} radius={i === locations.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]} />)}
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        )}

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
                <Pie data={locations.map(l => ({ name: l, value: incidents.filter(i => i.location === l).length }))} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={2} dataKey="value">
                  {locations.map((l, i) => <Cell key={i} fill={locationColors[l]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </main>

      <footer className="border-t border-gray-200 py-5 text-center bg-white mt-8">
        <p className="text-gray-400 text-xs">Evidence pracovních úrazů © 2025 • Systém BOZP • Načteno {incidents.length} záznamů</p>
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Dashboard />);
