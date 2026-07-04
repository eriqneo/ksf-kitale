import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  Users, 
  UserPlus, 
  Flame, 
  Plus, 
  X, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  ArrowRight,
  Database,
  RefreshCw,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  Filter
} from 'lucide-react';
import { pb } from '../context/PocketBaseContext';
import PinGate from '../components/PinGate';

interface AttendanceRecord {
  id: string;
  event_date: string;
  event_type: string;
  event_name?: string;
  session: string;
  members_count: number;
  visitors_count: number;
  first_timers: number;
  children_count: number;
  youth_count: number;
  adults_count: number;
  salvations: number;
  recorded_by: string;
  notes?: string;
  created: string;
}

export default function ChurchAnalytics() {
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return sessionStorage.getItem('ksf_analytics_unlocked') === 'true';
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('ksf_analytics_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Filters State
  const [filterType, setFilterType] = useState('All');
  const [filterSession, setFilterSession] = useState('All');
  const [filterDateRange, setFilterDateRange] = useState('All Time');

  // Form State
  const [eventDate, setEventDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [eventType, setEventType] = useState('Sunday Service');
  const [eventName, setEventName] = useState('');
  const [session, setSession] = useState('Morning');
  const [membersCount, setMembersCount] = useState('');
  const [visitorsCount, setVisitorsCount] = useState('');
  const [firstTimers, setFirstTimers] = useState('');
  const [childrenCount, setChildrenCount] = useState('');
  const [youthCount, setYouthCount] = useState('');
  const [adultsCount, setAdultsCount] = useState('');
  const [salvations, setSalvations] = useState('');
  const [recordedBy, setRecordedBy] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  // Toggle Theme
  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('ksf_analytics_theme', next);
  };

  // Fetch Attendance Records
  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const res = await pb.collection('attendance_records').getFullList<AttendanceRecord>({
        sort: '-event_date',
        requestKey: null
      });
      setRecords(res);
    } catch (err) {
      console.error('Failed to fetch attendance records:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isUnlocked) {
      fetchRecords();
    }
  }, [isUnlocked]);

  const handleUnlockSuccess = () => {
    sessionStorage.setItem('ksf_analytics_unlocked', 'true');
    setIsUnlocked(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('ksf_analytics_unlocked');
    setIsUnlocked(false);
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    const mCount = parseInt(membersCount) || 0;
    const vCount = parseInt(visitorsCount) || 0;
    const fTimers = parseInt(firstTimers) || 0;
    const cCount = parseInt(childrenCount) || 0;
    const yCount = parseInt(youthCount) || 0;
    const aCount = parseInt(adultsCount) || 0;
    const sCount = parseInt(salvations) || 0;

    // Basic Validation
    if (!eventDate || !eventType || !session || !recordedBy) {
      setFormError('Please fill out all required fields.');
      setIsSubmitting(false);
      return;
    }

    if (fTimers > vCount) {
      setFormError('First-timers cannot exceed the total visitor count.');
      setIsSubmitting(false);
      return;
    }

    const totalHeadcount = mCount + vCount;
    const demographicSum = cCount + yCount + aCount;
    if (demographicSum !== totalHeadcount && (cCount > 0 || yCount > 0 || aCount > 0)) {
      setFormError(`Demographics mismatch: Children (${cCount}) + Youth (${yCount}) + Adults (${aCount}) = ${demographicSum}, but Total Headcount is ${totalHeadcount}. Please adjust counts.`);
      setIsSubmitting(false);
      return;
    }

    try {
      await pb.collection('attendance_records').create({
        event_date: new Date(eventDate).toISOString(),
        event_type: eventType,
        event_name: eventName || undefined,
        session: session,
        members_count: mCount,
        visitors_count: vCount,
        first_timers: fTimers,
        children_count: cCount,
        youth_count: yCount,
        adults_count: aCount,
        salvations: sCount,
        recorded_by: recordedBy,
        notes: notes || undefined
      });

      // Reset form states
      setEventDate(new Date().toISOString().split('T')[0]);
      setEventType('Sunday Service');
      setEventName('');
      setSession('Morning');
      setMembersCount('');
      setVisitorsCount('');
      setFirstTimers('');
      setChildrenCount('');
      setYouthCount('');
      setAdultsCount('');
      setSalvations('');
      setRecordedBy('');
      setNotes('');
      setIsFormOpen(false);
      
      // Refresh Dashboard data
      await fetchRecords();
    } catch (err: any) {
      console.error('Failed to create attendance record:', err);
      setFormError(err.message || 'An error occurred while saving the record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isUnlocked) {
    return <PinGate onSuccess={handleUnlockSuccess} />;
  }

  // --- FILTER RECORDS LOGIC ---
  const getRecordsInDateRange = (sourceRecords: AttendanceRecord[], rangeType: string, isPriorPeriod = false) => {
    const today = new Date();
    return sourceRecords.filter(r => {
      // 1. Meeting Type Filter
      if (filterType !== 'All' && r.event_type !== filterType) {
        return false;
      }

      // 2. Session Filter
      if (filterSession !== 'All' && r.session !== filterSession) {
        return false;
      }

      // 3. Date Range Filter (Current vs Prior period shift)
      const rDate = new Date(r.event_date);
      if (rangeType === '30 Days') {
        if (isPriorPeriod) {
          const sixtyDaysAgo = new Date();
          sixtyDaysAgo.setDate(today.getDate() - 60);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(today.getDate() - 30);
          return rDate >= sixtyDaysAgo && rDate < thirtyDaysAgo;
        } else {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(today.getDate() - 30);
          return rDate >= thirtyDaysAgo;
        }
      }
      if (rangeType === 'This Month') {
        if (isPriorPeriod) {
          const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
          const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59);
          return rDate >= startOfLastMonth && rDate <= endOfLastMonth;
        } else {
          const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          return rDate >= startOfThisMonth;
        }
      }
      if (rangeType === 'Year to Date') {
        if (isPriorPeriod) {
          const startOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
          const endOfLastYear = new Date(today.getFullYear() - 1, 11, 31, 23, 59, 59);
          return rDate >= startOfLastYear && rDate <= endOfLastYear;
        } else {
          const startOfThisYear = new Date(today.getFullYear(), 0, 1);
          return rDate >= startOfThisYear;
        }
      }
      // All Time has no prior period comparison
      return !isPriorPeriod;
    });
  };

  const currentPeriodRecords = getRecordsInDateRange(records, filterDateRange, false);
  const priorPeriodRecords = getRecordsInDateRange(records, filterDateRange, true);

  // Map filtered records to the current period to update charts/tables seamlessly
  const filteredRecords = currentPeriodRecords;

  // --- ANALYTICS CALCULATIONS (FILTERED & BASES) ---
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const computeKPIs = (periodRecords: AttendanceRecord[]) => {
    const totalAttendance = periodRecords.reduce((sum, r) => sum + r.members_count + r.visitors_count, 0);
    const firstTimers = periodRecords.reduce((sum, r) => sum + r.first_timers, 0);
    const salvations = periodRecords.reduce((sum, r) => sum + r.salvations, 0);
    const sundays = periodRecords.filter(r => r.event_type === 'Sunday Service');
    const sundayAvg = sundays.length > 0
      ? Math.round(sundays.reduce((sum, r) => sum + r.members_count + r.visitors_count, 0) / sundays.length)
      : 0;

    return { totalAttendance, firstTimers, salvations, sundayAvg };
  };

  const currentKPIs = computeKPIs(currentPeriodRecords);
  const priorKPIs = computeKPIs(priorPeriodRecords);

  const calculateDelta = (curr: number, prior: number) => {
    if (prior === 0) return null;
    const pct = ((curr - prior) / prior) * 100;
    return Math.round(pct * 10) / 10;
  };

  const headcountDelta = calculateDelta(currentKPIs.totalAttendance, priorKPIs.totalAttendance);
  const sundayAvgDelta = calculateDelta(currentKPIs.sundayAvg, priorKPIs.sundayAvg);
  const firstTimersDelta = calculateDelta(currentKPIs.firstTimers, priorKPIs.firstTimers);
  const salvationsDelta = calculateDelta(currentKPIs.salvations, priorKPIs.salvations);

  const thisMonthRecords = records.filter(r => {
    const d = new Date(r.event_date);
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  });

  // QA Alerts Engine
  const qaAlerts: { type: 'danger' | 'warning' | 'info'; message: string; description: string }[] = [];

  if (records.length > 0) {
    // 1. Data Gap Check (Last Sunday)
    const today = new Date();
    const lastSunday = new Date();
    lastSunday.setDate(today.getDate() - today.getDay());
    const lastSundayStr = lastSunday.toISOString().split('T')[0];

    const hasLastSundayRecord = records.some(r => {
      const rd = new Date(r.event_date).toISOString().split('T')[0];
      return r.event_type === 'Sunday Service' && rd === lastSundayStr;
    });

    if (!hasLastSundayRecord && today.getDay() >= 1) {
      qaAlerts.push({
        type: 'danger',
        message: 'Missing Attendance Entry',
        description: `No attendance record submitted for Sunday (${lastSunday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}).`
      });
    }

    // 2. Demographic Balance Warning (< 10% Youth & Kids)
    const latestSunday = records.find(r => r.event_type === 'Sunday Service');
    if (latestSunday) {
      const latestTotal = latestSunday.members_count + latestSunday.visitors_count;
      const youngPeopleCount = latestSunday.children_count + latestSunday.youth_count;
      if (latestTotal > 0 && (youngPeopleCount / latestTotal) < 0.1) {
        qaAlerts.push({
          type: 'warning',
          message: 'Demographics Disbalance',
          description: `Kids & Youth made up only ${Math.round((youngPeopleCount / latestTotal) * 100)}% of attendance in the last Sunday service.`
        });
      }
    }

    // 3. Significant Drop in Attendance Alert
    const allSundays = records.filter(r => r.event_type === 'Sunday Service');
    if (allSundays.length >= 2) {
      const latest = allSundays[0].members_count + allSundays[0].visitors_count;
      const previous = allSundays[1].members_count + allSundays[1].visitors_count;
      if (previous > 0 && ((previous - latest) / previous) >= 0.15) {
        const dropPct = Math.round(((previous - latest) / previous) * 100);
        qaAlerts.push({
          type: 'warning',
          message: 'Sharp Attendance Drop',
          description: `Sunday service attendance dropped by ${dropPct}% compared to the previous week (${latest} vs ${previous}).`
        });
      }
    }

    // --- POSITIVE CELEBRATION ALERTS (Senior Data Analyst Insight) ---
    // 4. Sunday growth streak (last 3 Sundays)
    const sundayAttendances = allSundays
      .slice(0, 3)
      .reverse()
      .map(r => r.members_count + r.visitors_count);

    if (sundayAttendances.length === 3 && sundayAttendances[2] > sundayAttendances[1] && sundayAttendances[1] > sundayAttendances[0]) {
      qaAlerts.push({
        type: 'info',
        message: 'Attendance Growth Streak! 🎉',
        description: `Attendance has increased for 3 consecutive Sunday services (${sundayAttendances.join(' → ')}). Praise God for the growth momentum!`
      });
    }

    // 5. Strong Visitor Connection Connection Rate (MTD first_timers / visitors)
    const totalMonthVisitors = thisMonthRecords.reduce((sum, r) => sum + r.visitors_count, 0);
    const totalMonthFirstTimers = thisMonthRecords.reduce((sum, r) => sum + r.first_timers, 0);
    const connectionRate = totalMonthVisitors > 0 ? Math.round((totalMonthFirstTimers / totalMonthVisitors) * 100) : 0;
    if (connectionRate >= 25) {
      qaAlerts.push({
        type: 'info',
        message: 'Visitor Connection Milestone 📈',
        description: `This month, ${connectionRate}% of visitors integrated as registered first-timers. Excellent hospitality flow!`
      });
    }

    // 6. Harvest Milestone
    const currentYearSalvations = records
      .filter(r => new Date(r.event_date).getFullYear() === currentYear)
      .reduce((sum, r) => sum + r.salvations, 0);
    if (currentYearSalvations >= 10) {
      qaAlerts.push({
        type: 'info',
        message: 'Fruitful Harvest 🔥',
        description: `KSF Kitale has celebrated ${currentYearSalvations} decisions for Christ this year! Keep interceding for the new converts.`
      });
    }
  }

  // Member vs Visitor breakdown totals
  const totalMembers = filteredRecords.reduce((sum, r) => sum + r.members_count, 0);
  const totalVisitors = filteredRecords.reduce((sum, r) => sum + r.visitors_count, 0);
  const totalRatio = totalMembers + totalVisitors;
  const memberPct = totalRatio > 0 ? Math.round((totalMembers / totalRatio) * 100) : 0;
  const visitorPct = totalRatio > 0 ? 100 - memberPct : 0;

  // Demographics totals (Children vs Youth vs Adults)
  const totalChildren = filteredRecords.reduce((sum, r) => sum + r.children_count, 0);
  const totalYouth = filteredRecords.reduce((sum, r) => sum + r.youth_count, 0);
  const totalAdults = filteredRecords.reduce((sum, r) => sum + r.adults_count, 0);
  const totalDemo = totalChildren + totalYouth + totalAdults;

  const childrenPct = totalDemo > 0 ? Math.round((totalChildren / totalDemo) * 100) : 0;
  const youthPct = totalDemo > 0 ? Math.round((totalYouth / totalDemo) * 100) : 0;
  const adultsPct = totalDemo > 0 ? 100 - (childrenPct + youthPct) : 0;

  // Trend line coordinates calculation (Filtered records, up to last 6)
  const trendPoints = [...filteredRecords].slice(0, 6).reverse();
  const maxVal = trendPoints.length > 0 
    ? Math.max(...trendPoints.map(r => r.members_count + r.visitors_count)) * 1.1 
    : 100;
  const minVal = trendPoints.length > 0
    ? Math.min(...trendPoints.map(r => r.members_count + r.visitors_count)) * 0.9
    : 0;

  // Calculate Average line point coordinate
  const trendAvg = trendPoints.length > 0 
    ? Math.round(trendPoints.reduce((sum, r) => sum + r.members_count + r.visitors_count, 0) / trendPoints.length)
    : 0;

  const chartWidth = 500;
  const chartHeight = 150;
  const pointsString = trendPoints.map((r, i) => {
    const x = (i / (Math.max(1, trendPoints.length - 1))) * chartWidth;
    const y = chartHeight - (((r.members_count + r.visitors_count - minVal) / (Math.max(1, maxVal - minVal))) * chartHeight);
    return `${x},${y}`;
  }).join(' ');

  // Handler to export filtered records as CSV (Senior Data Analyst addition)
  const handleExportCSV = () => {
    const headers = ['Date', 'Event Type', 'Event Name', 'Session', 'Members', 'Visitors', 'First Timers', 'Children', 'Youth', 'Adults', 'Salvations', 'Recorded By', 'Notes'];
    const rows = filteredRecords.map(r => [
      new Date(r.event_date).toLocaleDateString(),
      r.event_type,
      r.event_name || '',
      r.session,
      r.members_count,
      r.visitors_count,
      r.first_timers,
      r.children_count,
      r.youth_count,
      r.adults_count,
      r.salvations,
      r.recorded_by,
      (r.notes || '').replace(/"/g, '""')
    ]);
    const csvContent = [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ksf_kitale_attendance_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get unique list of event types for filter dropdown
  const uniqueEventTypes = Array.from(new Set(records.map(r => r.event_type)));

  return (
    <div className={`min-h-screen transition-colors duration-300 pt-24 pb-16 relative overflow-hidden select-none ${
      theme === 'dark' ? 'bg-[#070F1F] text-white' : 'bg-slate-50 text-slate-800'
    }`}>
      {/* Background Visual Gradients */}
      <div className={`absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none transition-opacity duration-300 ${
        theme === 'dark' ? 'bg-[#0D3875]/10 opacity-100' : 'bg-primary-blue/5 opacity-80'
      }`} />
      <div className={`absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none transition-opacity duration-300 ${
        theme === 'dark' ? 'bg-bold-red/5 opacity-100' : 'bg-bold-red/[0.03] opacity-80'
      }`} />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        {/* TOP STATUS NAVIGATION BANNER */}
        <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 p-6 rounded-3xl transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-white/[0.02] backdrop-blur-xl border border-white/10 shadow-2xl' 
            : 'bg-white border border-slate-200/80 shadow-md'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-white/5 to-white/[0.01] border border-white/10 text-sky-blue' 
                : 'bg-primary-blue/5 text-[#0D3875]'
            }`}>
              <TrendingUp size={24} />
            </div>
            <div>
              <span className="font-accent text-[10px] tracking-[3px] font-black uppercase text-sky-blue">
                CHURCH MANAGEMENT
              </span>
              <h1 className="font-headlines font-black text-2xl leading-none mt-0.5 tracking-tight">
                Headcount & Analytics
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                theme === 'dark' 
                  ? 'bg-white/[0.02] border border-white/10 hover:bg-white/5 text-yellow-400' 
                  : 'bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[#0D3875]'
              }`}
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                isFilterPanelOpen
                  ? 'bg-sky-blue text-white shadow-md'
                  : theme === 'dark'
                  ? 'bg-white/[0.02] border border-white/10 hover:bg-white/5 text-white/80'
                  : 'bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600'
              }`}
              title="Filter Controls"
            >
              <Filter size={16} />
            </button>

            <button
              onClick={() => setIsFormOpen(true)}
              className="flex-grow sm:flex-grow-0 bg-sky-blue hover:bg-sky-blue/90 text-white py-2.5 px-5 rounded-2xl font-accent font-black text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-sky-blue/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus size={14} />
              <span>Record Headcount</span>
            </button>

            <button
              onClick={handleLogout}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                theme === 'dark'
                  ? 'bg-white/[0.02] border border-white/10 hover:bg-white/5 text-white/70'
                  : 'bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600'
              }`}
              title="Lock Portal"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* EXPANDABLE FILTER BAR */}
        <AnimatePresence>
          {isFilterPanelOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginBottom: 0 }}
              animate={{ height: 'auto', opacity: 1, marginBottom: 24 }}
              exit={{ height: 0, opacity: 0, marginBottom: 0 }}
              className={`overflow-hidden rounded-3xl p-6 transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-white/[0.02] backdrop-blur-xl border border-white/10 shadow-2xl'
                  : 'bg-white border border-slate-200/80 shadow-md'
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 1. Meeting Type Filter */}
                <div>
                  <label className={`block text-[10px] font-accent font-bold uppercase mb-2 ${
                    theme === 'dark' ? 'text-white/40' : 'text-slate-400'
                  }`}>Meeting Type</label>
                  <div className="relative">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className={`w-full text-xs p-3 rounded-xl border outline-none appearance-none cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-white/[0.02] border-white/10 text-white focus:border-sky-blue [&>option]:bg-[#0B1528] [&>option]:text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-primary-blue'
                      }`}
                    >
                      <option value="All">All Types</option>
                      {uniqueEventTypes.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <ChevronDown className={`absolute right-3 top-3.5 pointer-events-none ${
                      theme === 'dark' ? 'text-white/40' : 'text-slate-400'
                    }`} size={14} />
                  </div>
                </div>

                {/* 2. Session Filter */}
                <div>
                  <label className={`block text-[10px] font-accent font-bold uppercase mb-2 ${
                    theme === 'dark' ? 'text-white/40' : 'text-slate-400'
                  }`}>Session</label>
                  <div className="relative">
                    <select
                      value={filterSession}
                      onChange={(e) => setFilterSession(e.target.value)}
                      className={`w-full text-xs p-3 rounded-xl border outline-none appearance-none cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-white/[0.02] border-white/10 text-white focus:border-sky-blue [&>option]:bg-[#0B1528] [&>option]:text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-primary-blue'
                      }`}
                    >
                      <option value="All">All Sessions</option>
                      <option value="Morning">Morning</option>
                      <option value="Afternoon">Afternoon</option>
                      <option value="Evening">Evening</option>
                      <option value="All Day">All Day</option>
                    </select>
                    <ChevronDown className={`absolute right-3 top-3.5 pointer-events-none ${
                      theme === 'dark' ? 'text-white/40' : 'text-slate-400'
                    }`} size={14} />
                  </div>
                </div>

                {/* 3. Date Range Filter */}
                <div>
                  <label className={`block text-[10px] font-accent font-bold uppercase mb-2 ${
                    theme === 'dark' ? 'text-white/40' : 'text-slate-400'
                  }`}>Date Range</label>
                  <div className="relative">
                    <select
                      value={filterDateRange}
                      onChange={(e) => setFilterDateRange(e.target.value)}
                      className={`w-full text-xs p-3 rounded-xl border outline-none appearance-none cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-white/[0.02] border-white/10 text-white focus:border-sky-blue [&>option]:bg-[#0B1528] [&>option]:text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-primary-blue'
                      }`}
                    >
                      <option value="All Time">All Time</option>
                      <option value="30 Days">Last 30 Days</option>
                      <option value="This Month">This Month</option>
                      <option value="Year to Date">Year to Date</option>
                    </select>
                    <ChevronDown className={`absolute right-3 top-3.5 pointer-events-none ${
                      theme === 'dark' ? 'text-white/40' : 'text-slate-400'
                    }`} size={14} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LOADING INDICATOR */}
        {isLoading ? (
          <div className={`flex flex-col items-center justify-center py-32 rounded-3xl transition-all duration-300 ${
            theme === 'dark' 
              ? 'bg-white/[0.02] border border-white/10 shadow-2xl backdrop-blur-xl' 
              : 'bg-white border border-slate-200 shadow-md'
          }`}>
            <RefreshCw size={36} className="animate-spin text-sky-blue mb-4" />
            <p className="font-accent font-bold text-xs text-sky-blue tracking-widest uppercase animate-pulse">
              Syncing Portal Data...
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Theme & Filter Helpers */}
            {(() => {
              const renderDeltaBadge = (delta: number | null) => {
                if (delta === null) return null;
                const isPositive = delta >= 0;
                if (theme === 'dark') {
                  return (
                    <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md mt-1 transition-colors ${
                      isPositive 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : 'bg-red-500/10 text-red-400'
                    }`}>
                      {isPositive ? `↑ +${delta}%` : `↓ ${delta}%`}
                      <span className="text-[8px] font-normal opacity-60 ml-0.5">vs prior</span>
                    </span>
                  );
                } else {
                  return (
                    <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md mt-1 transition-colors ${
                      isPositive 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'bg-red-50 text-red-700'
                    }`}>
                      {isPositive ? `↑ +${delta}%` : `↓ ${delta}%`}
                      <span className="text-[8px] font-normal opacity-60 ml-0.5">vs prior</span>
                    </span>
                  );
                }
              };

              const getAlertStyles = (type: 'danger' | 'warning' | 'info') => {
                if (theme === 'dark') {
                  if (type === 'danger') return 'bg-red-500/5 border-red-500/15 text-red-200';
                  if (type === 'warning') return 'bg-amber-500/5 border-amber-500/15 text-amber-200';
                  return 'bg-emerald-500/5 border-emerald-500/15 text-emerald-300';
                } else {
                  if (type === 'danger') return 'bg-red-50 border-red-100 text-red-900';
                  if (type === 'warning') return 'bg-amber-50 border-amber-100 text-amber-900';
                  return 'bg-emerald-50 border-emerald-100 text-emerald-900';
                }
              };

              const getAlertIcon = (type: 'danger' | 'warning' | 'info') => {
                if (type === 'danger') return '🔴';
                if (type === 'warning') return '⚠️';
                return '🎉';
              };

              return (
                <>
                  {/* KPI METRIC CARDS ROW */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Card 1: Attendance */}
                    <div className={`backdrop-blur-md p-5 rounded-2xl hover:scale-[1.02] hover:border-bold-red/40 transition-all flex items-center gap-4 group cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-white/[0.02] border border-white/10 shadow-xl text-white hover:shadow-[0_0_20px_rgba(214,48,49,0.15)]'
                        : 'bg-white border border-slate-200 shadow-sm text-slate-800'
                    }`}>
                      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-sky-blue group-hover:scale-110 transition-transform">
                        <Users size={24} />
                      </div>
                      <div>
                        <p className={`text-[10px] font-accent font-bold uppercase tracking-wider ${
                          theme === 'dark' ? 'text-white/40' : 'text-slate-400'
                        }`}>Filtered Headcount</p>
                        <p className="font-accent font-black text-2xl mt-1 leading-none">
                          {currentKPIs.totalAttendance} <span className={`text-xs font-medium ${
                            theme === 'dark' ? 'text-white/30' : 'text-slate-400'
                          }`}>Total</span>
                        </p>
                        {renderDeltaBadge(headcountDelta)}
                      </div>
                    </div>

                    {/* Card 2: Sunday Average */}
                    <div className={`backdrop-blur-md p-5 rounded-2xl hover:scale-[1.02] hover:border-bold-red/40 transition-all flex items-center gap-4 group cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-white/[0.02] border border-white/10 shadow-xl text-white hover:shadow-[0_0_20px_rgba(214,48,49,0.15)]'
                        : 'bg-white border border-slate-200 shadow-sm text-slate-800'
                    }`}>
                      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                        <TrendingUp size={24} />
                      </div>
                      <div>
                        <p className={`text-[10px] font-accent font-bold uppercase tracking-wider ${
                          theme === 'dark' ? 'text-white/40' : 'text-slate-400'
                        }`}>Sunday Average</p>
                        <p className="font-accent font-black text-2xl mt-1 leading-none">
                          {currentKPIs.sundayAvg} <span className={`text-xs font-medium ${
                            theme === 'dark' ? 'text-white/30' : 'text-slate-400'
                          }`}>/ Service</span>
                        </p>
                        {renderDeltaBadge(sundayAvgDelta)}
                      </div>
                    </div>

                    {/* Card 3: First Timers */}
                    <div className={`backdrop-blur-md p-5 rounded-2xl hover:scale-[1.02] hover:border-bold-red/40 transition-all flex items-center gap-4 group cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-white/[0.02] border border-white/10 shadow-xl text-white hover:shadow-[0_0_20px_rgba(214,48,49,0.15)]'
                        : 'bg-white border border-slate-200 shadow-sm text-slate-800'
                    }`}>
                      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                        <UserPlus size={24} />
                      </div>
                      <div>
                        <p className={`text-[10px] font-accent font-bold uppercase tracking-wider ${
                          theme === 'dark' ? 'text-white/40' : 'text-slate-400'
                        }`}>Filtered First-Timers</p>
                        <p className="font-accent font-black text-2xl mt-1 leading-none">
                          {currentKPIs.firstTimers} <span className={`text-xs font-medium ${
                            theme === 'dark' ? 'text-white/30' : 'text-slate-400'
                          }`}>Registered</span>
                        </p>
                        {renderDeltaBadge(firstTimersDelta)}
                      </div>
                    </div>

                    {/* Card 4: Salvations */}
                    <div className={`backdrop-blur-md p-5 rounded-2xl hover:scale-[1.02] hover:border-bold-red/40 transition-all flex items-center gap-4 group cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-white/[0.02] border border-white/10 shadow-xl text-white hover:shadow-[0_0_20px_rgba(214,48,49,0.15)]'
                        : 'bg-white border border-slate-200 shadow-sm text-slate-800'
                    }`}>
                      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-bold-red group-hover:scale-110 transition-transform">
                        <Flame size={24} />
                      </div>
                      <div>
                        <p className={`text-[10px] font-accent font-bold uppercase tracking-wider ${
                          theme === 'dark' ? 'text-white/40' : 'text-slate-400'
                        }`}>Salvations Count</p>
                        <p className="font-accent font-black text-2xl mt-1 leading-none">
                          {currentKPIs.salvations} <span className={`text-xs font-medium ${
                            theme === 'dark' ? 'text-white/30' : 'text-slate-400'
                          }`}>Decisions</span>
                        </p>
                        {renderDeltaBadge(salvationsDelta)}
                      </div>
                    </div>
                  </div>

                  {/* QA ALERTS SECTION */}
                  {qaAlerts.length > 0 && (
                    <div className={`p-6 rounded-3xl shadow-2xl transition-all duration-300 border ${
                      theme === 'dark'
                        ? 'bg-[#12203C] border-yellow-500/20 text-yellow-300'
                        : 'bg-amber-50 border-amber-200 text-amber-900'
                    }`}>
                      <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className={theme === 'dark' ? 'text-yellow-400' : 'text-amber-600'} size={18} />
                        <h3 className="font-headlines font-black text-sm uppercase tracking-wider">
                          Quality Assurance & Anomalies
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {qaAlerts.map((alert, i) => (
                          <div key={i} className={`flex gap-3 p-4 rounded-xl shadow-inner border transition-all ${getAlertStyles(alert.type)}`}>
                            <span className="text-lg">{getAlertIcon(alert.type)}</span>
                            <div>
                              <h4 className="font-headlines font-bold text-sm">{alert.message}</h4>
                              <p className="text-xs mt-0.5 leading-relaxed opacity-75">{alert.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}

            {/* DASHBOARD CHARTS ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 1. Sunday Attendance Trend Chart */}
              <div className={`p-6 rounded-3xl shadow-2xl col-span-1 lg:col-span-2 border transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-white/[0.02] border-white/10'
                  : 'bg-white border-slate-200/80'
              }`}>
                <h3 className="font-headlines font-black text-base mb-6">
                  Sunday Attendance Trend
                </h3>
                {trendPoints.length >= 2 ? (
                  <div className="w-full">
                    {/* SVG Line Chart */}
                    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full overflow-visible">
                      {/* Grid lines */}
                      <line x1="0" y1="0" x2={chartWidth} y2="0" stroke={theme==='dark' ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} strokeWidth="1" />
                      <line x1="0" y1={chartHeight/2} x2={chartWidth} y2={chartHeight/2} stroke={theme==='dark' ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} strokeWidth="1" />
                      <line x1="0" y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke={theme==='dark' ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"} strokeWidth="1.5" />

                      {/* Area below curve */}
                      <path
                        d={`M 0,${chartHeight} L ${pointsString} L ${chartWidth},${chartHeight} Z`}
                        fill="url(#trend-gradient)"
                      />

                      {/* Trend path line */}
                      <polyline
                        fill="none"
                        stroke={theme==='dark' ? "#38bdf8" : "#0D3875"}
                        strokeWidth="3.5"
                        points={pointsString}
                      />

                      {/* Average reference line */}
                      {trendAvg > 0 && (
                        <g>
                          <line
                            x1="0"
                            y1={trendAvg > 0 ? chartHeight - (((trendAvg - minVal) / Math.max(1, maxVal - minVal)) * chartHeight) : 0}
                            x2={chartWidth}
                            y2={trendAvg > 0 ? chartHeight - (((trendAvg - minVal) / Math.max(1, maxVal - minVal)) * chartHeight) : 0}
                            stroke={theme === 'dark' ? 'rgba(251, 191, 36, 0.4)' : 'rgba(180, 83, 9, 0.4)'}
                            strokeDasharray="4 4"
                            strokeWidth="1.5"
                          />
                          <text
                            x={chartWidth - 8}
                            y={(trendAvg > 0 ? chartHeight - (((trendAvg - minVal) / Math.max(1, maxVal - minVal)) * chartHeight) : 0) - 6}
                            textAnchor="end"
                            className="font-accent text-[8px] font-bold"
                            fill={theme === 'dark' ? '#fbbf24' : '#b45309'}
                          >
                            Average: {trendAvg}
                          </text>
                        </g>
                      )}

                      {/* Data point dots */}
                      {trendPoints.map((r, i) => {
                        const x = (i / (trendPoints.length - 1)) * chartWidth;
                        const y = chartHeight - (((r.members_count + r.visitors_count - minVal) / (maxVal - minVal)) * chartHeight);
                        return (
                          <g key={r.id}>
                            <circle
                              cx={x}
                              cy={y}
                              r="6"
                              fill="#FFFFFF"
                              stroke={theme==='dark' ? "#38bdf8" : "#0D3875"}
                              strokeWidth="3"
                            />
                            <text
                              x={x}
                              y={y - 12}
                              textAnchor="middle"
                              className="font-accent text-[9px] font-bold"
                              fill={theme==='dark' ? "#38bdf8" : "#0D3875"}
                            >
                              {r.members_count + r.visitors_count}
                            </text>
                          </g>
                        );
                      })}

                      {/* Define gradient */}
                      <defs>
                        <linearGradient id="trend-gradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={theme==='dark' ? "#38bdf8" : "#0D3875"} stopOpacity={theme==='dark' ? "0.15" : "0.08"} />
                          <stop offset="100%" stopColor={theme==='dark' ? "#38bdf8" : "#0D3875"} stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Chart axis tags */}
                    <div className={`flex justify-between items-center mt-4 px-1 text-[9px] font-accent font-bold uppercase ${
                      theme === 'dark' ? 'text-white/40' : 'text-slate-400'
                    }`}>
                      {trendPoints.map((r, i) => (
                        <span key={r.id}>
                          {new Date(r.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-40 flex items-center justify-center text-xs text-white/30">
                    Not enough Sunday data to render trend chart.
                  </div>
                )}
              </div>

              {/* 2. Demographics & Member/Visitor Breakdown */}
              <div className={`p-6 rounded-3xl shadow-2xl flex flex-col justify-between border transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-white/[0.02] border-white/10'
                  : 'bg-white border-slate-200/80'
              }`}>
                <div>
                  <h3 className="font-headlines font-black text-base mb-6">
                    Composition & Demographics
                  </h3>

                  {/* Member vs Visitor Split */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="font-bold">Affiliation Split</span>
                      <span className={`font-mono ${theme === 'dark' ? 'text-white/40' : 'text-slate-400'}`}>
                        {memberPct}% Member / {visitorPct}% Visitor
                      </span>
                    </div>
                    <div className={`h-2.5 w-full rounded-full overflow-hidden flex ${
                      theme==='dark' ? "bg-white/5" : "bg-slate-100"
                    }`}>
                      <div className="bg-[#38bdf8] h-full" style={{ width: `${memberPct}%` }} title="Members" />
                      <div className="bg-sky-blue h-full" style={{ width: `${visitorPct}%` }} title="Visitors" />
                    </div>
                    <div className={`flex gap-4 mt-2 text-[10px] ${theme === 'dark' ? 'text-white/40' : 'text-slate-400'}`}>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] block" />
                        <span>Members ({totalMembers})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-sky-blue block" />
                        <span>Visitors ({totalVisitors})</span>
                      </div>
                    </div>
                  </div>

                  {/* Demographic Age Breakdown */}
                  <div>
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="font-bold">Age Demographics</span>
                      <span className={`font-mono ${theme === 'dark' ? 'text-white/40' : 'text-slate-400'}`}>
                        {totalDemo} Tracked
                      </span>
                    </div>
                    
                    {/* Horizontal stack representation */}
                    <div className={`h-2.5 w-full rounded-full overflow-hidden flex mb-3 ${
                      theme==='dark' ? "bg-white/5" : "bg-slate-100"
                    }`}>
                      <div className="bg-bold-red h-full" style={{ width: `${childrenPct}%` }} />
                      <div className="bg-yellow-500 h-full" style={{ width: `${youthPct}%` }} />
                      <div className="bg-[#38bdf8] h-full" style={{ width: `${adultsPct}%` }} />
                    </div>

                    <div className="space-y-2">
                      <div className={`flex justify-between items-center text-[10px] ${theme === 'dark' ? 'text-white/60' : 'text-slate-600'}`}>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-bold-red block" />
                          <span>Children (0-12)</span>
                        </div>
                        <span className="font-bold">{totalChildren} ({childrenPct}%)</span>
                      </div>
                      <div className={`flex justify-between items-center text-[10px] ${theme === 'dark' ? 'text-white/60' : 'text-slate-600'}`}>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 block" />
                          <span>Youth (13-17)</span>
                        </div>
                        <span className="font-bold">{totalYouth} ({youthPct}%)</span>
                      </div>
                      <div className={`flex justify-between items-center text-[10px] ${theme === 'dark' ? 'text-white/60' : 'text-slate-600'}`}>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] block" />
                          <span>Adults (18+)</span>
                        </div>
                        <span className="font-bold">{totalAdults} ({adultsPct}%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PAST RECORDS TABLE */}
            <div className={`rounded-3xl overflow-hidden border transition-all duration-300 shadow-2xl ${
              theme === 'dark'
                ? 'bg-white/[0.02] border-white/10'
                : 'bg-white border-slate-200/80'
            }`}>
              <div className={`p-6 border-b flex justify-between items-center bg-white/[0.01] ${
                theme === 'dark' ? 'border-white/10' : 'border-slate-100'
              }`}>
                <h3 className="font-headlines font-black text-base">
                  Attendance Log Book
                </h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleExportCSV}
                    className={`text-[10px] border py-1.5 px-3.5 rounded-xl font-accent font-black tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white/80'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    Export CSV
                  </button>
                  <span className={`text-[10px] border py-1.5 px-3.5 rounded-xl font-accent font-bold ${
                    theme === 'dark' 
                      ? 'bg-white/5 border-white/10 text-white/50' 
                      : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}>
                    {filteredRecords.length} Filtered Meetings
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`font-accent font-black text-[9px] uppercase tracking-wider border-b ${
                      theme === 'dark' 
                        ? 'bg-white/[0.02] text-white/40 border-white/5' 
                        : 'bg-slate-50/50 text-slate-400 border-slate-100'
                    }`}>
                      <th className="p-4 pl-6">Date</th>
                      <th className="p-4">Event Details</th>
                      <th className="p-4 text-center">Session</th>
                      <th className="p-4 text-right">Headcount</th>
                      <th className="p-4 text-right">Members</th>
                      <th className="p-4 text-right">Visitors</th>
                      <th className="p-4 text-right">First-Timers</th>
                      <th className="p-4 text-right">Salvations</th>
                      <th className="p-4 pl-6">Notes</th>
                      <th className="p-4 text-center pr-6">By</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y font-body text-xs ${
                    theme === 'dark' ? 'divide-white/5 text-white/80' : 'divide-slate-100 text-slate-700'
                  }`}>
                    {filteredRecords.length > 0 ? (
                      filteredRecords.map(record => (
                        <tr key={record.id} className={`transition-colors ${
                          theme === 'dark' ? 'hover:bg-white/[0.01]' : 'hover:bg-slate-50/50'
                        }`}>
                          <td className="p-4 pl-6 font-semibold whitespace-nowrap">
                            {new Date(record.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="p-4">
                            <span className={`font-bold block ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                              {record.event_type}
                            </span>
                            {record.event_name && (
                              <span className={`text-[10px] block mt-0.5 ${
                                theme === 'dark' ? 'text-white/40' : 'text-slate-400'
                              }`}>
                                {record.event_name}
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#38bdf8]/10 text-[#38bdf8]">
                              {record.session}
                            </span>
                          </td>
                          <td className="p-4 text-right font-bold text-[#38bdf8]">
                            {record.members_count + record.visitors_count}
                          </td>
                          <td className="p-4 text-right font-mono opacity-80">{record.members_count}</td>
                          <td className="p-4 text-right font-mono opacity-80">{record.visitors_count}</td>
                          <td className="p-4 text-right font-mono text-emerald-400 font-semibold">+{record.first_timers}</td>
                          <td className="p-4 text-right">
                            {record.salvations > 0 ? (
                              <span className="font-bold text-bold-red font-mono">🔥 {record.salvations}</span>
                            ) : (
                              <span className="opacity-20 font-mono">-</span>
                            )}
                          </td>
                          <td className={`p-4 pl-6 max-w-xs truncate italic ${
                            theme === 'dark' ? 'text-white/50' : 'text-slate-400'
                          }`} title={record.notes}>
                            {record.notes || '-'}
                          </td>
                          <td className="p-4 text-center pr-6 font-semibold whitespace-nowrap opacity-80">
                            {record.recorded_by}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={10} className="p-12 text-center opacity-40 italic">
                          No records match active filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* COMPACT RECORDING SLIDING FORM DRAWER */}
      <AnimatePresence>
        {isFormOpen && (
          <>
            {/* Background screen overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="fixed inset-0 bg-[#070F1F]/80 z-40 backdrop-blur-xs"
            />

            {/* Sliding Form Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed inset-y-0 right-0 max-w-md w-full shadow-2xl z-50 flex flex-col border-l transition-colors duration-300 ${
                theme === 'dark'
                  ? 'bg-[#0B1528] border-white/10'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className={`p-6 border-b flex justify-between items-center transition-colors ${
                theme === 'dark' ? 'border-white/10 bg-[#070F1F]/40' : 'border-slate-100 bg-slate-50/50'
              }`}>
                <div className="flex items-center gap-2">
                  <Database size={16} className="text-sky-blue" />
                  <h3 className={`font-headlines font-black text-lg uppercase tracking-tight ${
                    theme === 'dark' ? 'text-white' : 'text-slate-800'
                  }`}>
                    Record Attendance
                  </h3>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    theme === 'dark' ? 'bg-white/5 text-white/60 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-6">
                
                {formError && (
                  <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 text-xs flex gap-2">
                    <span className="text-sm">⚠️</span>
                    <p className="font-medium leading-relaxed">{formError}</p>
                  </div>
                )}

                {/* Section 1: Meeting particulars */}
                <div className="space-y-4">
                  <h4 className={`font-accent font-black text-[10px] tracking-wider uppercase border-b pb-1 ${
                    theme === 'dark' ? 'text-white/40 border-white/5' : 'text-slate-400 border-slate-100'
                  }`}>
                    1. Meeting particulars
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-accent font-bold uppercase mb-1.5 opacity-60">Date *</label>
                      <input
                        type="date"
                        required
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className={`w-full text-xs p-3 rounded-xl border outline-none ${
                          theme === 'dark'
                            ? 'bg-white/[0.02] border-white/10 text-white focus:border-sky-blue'
                            : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-primary-blue'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-accent font-bold uppercase mb-1.5 opacity-60">Session *</label>
                      <div className="relative">
                        <select
                          value={session}
                          onChange={(e) => setSession(e.target.value)}
                          className={`w-full text-xs p-3 rounded-xl border outline-none appearance-none ${
                            theme === 'dark'
                              ? 'bg-white/[0.02] border-white/10 text-white focus:border-sky-blue [&>option]:bg-[#0B1528] [&>option]:text-white'
                              : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-primary-blue'
                          }`}
                        >
                          <option>Morning</option>
                          <option>Afternoon</option>
                          <option>Evening</option>
                          <option>All Day</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3.5 opacity-40 pointer-events-none" size={14} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-accent font-bold uppercase mb-1.5 opacity-60">Meeting Type *</label>
                    <div className="relative">
                      <select
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        className={`w-full text-xs p-3 rounded-xl border outline-none appearance-none ${
                          theme === 'dark'
                            ? 'bg-white/[0.02] border-white/10 text-white focus:border-sky-blue [&>option]:bg-[#0B1528] [&>option]:text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-primary-blue'
                        }`}
                      >
                        <option>Sunday Service</option>
                        <option>Wednesday Bible Study</option>
                        <option>Prayer Night</option>
                        <option>Special Event</option>
                        <option>Leadership Training</option>
                        <option>Youth Meeting</option>
                        <option>Women Fellowship</option>
                        <option>Men Fellowship</option>
                        <option>Home Fellowship</option>
                        <option>Other</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3.5 opacity-40 pointer-events-none" size={14} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-accent font-bold uppercase mb-1.5 opacity-60">Event Description name (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Covenant Service, Crossover..."
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                      className={`w-full text-xs p-3 rounded-xl border outline-none ${
                        theme === 'dark'
                          ? 'bg-white/[0.02] border-white/10 text-white focus:border-sky-blue placeholder:text-white/20'
                          : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-primary-blue placeholder:text-slate-400/60'
                      }`}
                    />
                  </div>
                </div>

                {/* Section 2: Affiliation Headcounts */}
                <div className="space-y-4">
                  <h4 className={`font-accent font-black text-[10px] tracking-wider uppercase border-b pb-1 ${
                    theme === 'dark' ? 'text-white/40 border-white/5' : 'text-slate-400 border-slate-100'
                  }`}>
                    2. Affiliation Headcounts
                  </h4>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-accent font-bold uppercase mb-1.5 opacity-60">Members *</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        required
                        value={membersCount}
                        onChange={(e) => setMembersCount(e.target.value)}
                        className={`w-full text-center font-mono text-sm p-3 rounded-xl border outline-none ${
                          theme === 'dark'
                            ? 'bg-white/[0.02] border-white/10 text-white focus:border-sky-blue'
                            : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-primary-blue'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-accent font-bold uppercase mb-1.5 opacity-60">Visitors *</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        required
                        value={visitorsCount}
                        onChange={(e) => setVisitorsCount(e.target.value)}
                        className={`w-full text-center font-mono text-sm p-3 rounded-xl border outline-none ${
                          theme === 'dark'
                            ? 'bg-white/[0.02] border-white/10 text-white focus:border-sky-blue'
                            : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-primary-blue'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-accent font-bold uppercase mb-1.5 opacity-60">1st Timers *</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        required
                        value={firstTimers}
                        onChange={(e) => setFirstTimers(e.target.value)}
                        className={`w-full text-center font-mono text-sm p-3 rounded-xl border outline-none ${
                          theme === 'dark'
                            ? 'bg-white/[0.02] border-white/10 text-white focus:border-sky-blue'
                            : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-primary-blue'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Demographic distribution */}
                <div className="space-y-4">
                  <h4 className={`font-accent font-black text-[10px] tracking-wider uppercase border-b pb-1 ${
                    theme === 'dark' ? 'text-white/40 border-white/5' : 'text-slate-400 border-slate-100'
                  }`}>
                    3. Demographic Age distribution
                  </h4>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[9px] font-accent font-bold uppercase mb-1.5 opacity-60">Kids (0-12) *</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        required
                        value={childrenCount}
                        onChange={(e) => setChildrenCount(e.target.value)}
                        className={`w-full text-center font-mono text-sm p-3 rounded-xl border outline-none ${
                          theme === 'dark'
                            ? 'bg-white/[0.02] border-white/10 text-white focus:border-sky-blue'
                            : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-primary-blue'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-accent font-bold uppercase mb-1.5 opacity-60">Youth (13-17) *</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        required
                        value={youthCount}
                        onChange={(e) => setYouthCount(e.target.value)}
                        className={`w-full text-center font-mono text-sm p-3 rounded-xl border outline-none ${
                          theme === 'dark'
                            ? 'bg-white/[0.02] border-white/10 text-white focus:border-sky-blue'
                            : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-primary-blue'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-accent font-bold uppercase mb-1.5 opacity-60">Adults (18+) *</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        required
                        value={adultsCount}
                        onChange={(e) => setAdultsCount(e.target.value)}
                        className={`w-full text-center font-mono text-sm p-3 rounded-xl border outline-none ${
                          theme === 'dark'
                            ? 'bg-white/[0.02] border-white/10 text-white focus:border-sky-blue'
                            : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-primary-blue'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 4: Harvest & Records metadata */}
                <div className="space-y-4">
                  <h4 className={`font-accent font-black text-[10px] tracking-wider uppercase border-b pb-1 ${
                    theme === 'dark' ? 'text-white/40 border-white/5' : 'text-slate-400 border-slate-100'
                  }`}>
                    4. Harvest & Metadata
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-accent font-bold uppercase mb-1.5 opacity-60">New Salvations *</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        required
                        value={salvations}
                        onChange={(e) => setSalvations(e.target.value)}
                        className={`w-full text-center font-mono text-sm p-3 rounded-xl border outline-none ${
                          theme === 'dark'
                            ? 'bg-white/[0.02] border-white/10 text-white focus:border-sky-blue'
                            : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-primary-blue'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-accent font-bold uppercase mb-1.5 opacity-60">Recorded By *</label>
                      <input
                        type="text"
                        placeholder="Your name"
                        required
                        value={recordedBy}
                        onChange={(e) => setRecordedBy(e.target.value)}
                        className={`w-full text-xs p-3 rounded-xl border outline-none ${
                          theme === 'dark'
                            ? 'bg-white/[0.02] border-white/10 text-white focus:border-sky-blue placeholder:text-white/20'
                            : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-primary-blue placeholder:text-slate-400/60'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-accent font-bold uppercase mb-1.5 opacity-60">Qualitative notes / observations</label>
                    <textarea
                      placeholder="e.g. rainy morning, guest minister was present..."
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className={`w-full text-xs p-3 rounded-xl border outline-none resize-none ${
                        theme === 'dark'
                          ? 'bg-white/[0.02] border-white/10 text-white focus:border-sky-blue placeholder:text-white/20'
                          : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-primary-blue placeholder:text-slate-400/60'
                      }`}
                    />
                  </div>
                </div>

                {/* Submit action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-sky-blue hover:bg-sky-blue/90 text-white py-3.5 rounded-2xl font-accent font-black text-[11px] tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-sky-blue/20 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Saving Records...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Record</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
