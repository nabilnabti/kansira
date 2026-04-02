import { motion } from 'framer-motion';
import { Users, Activity, BookCheck, Percent } from 'lucide-react';

const stats = [
  { label: 'Utilisateurs', value: '1 234', icon: Users, color: '#FF6B00' },
  { label: 'Actifs 7j', value: '456', icon: Activity, color: '#2D9F4F' },
  { label: 'Leçons complétées', value: '8 901', icon: BookCheck, color: '#3B82F6' },
  { label: 'Taux complétion', value: '67%', icon: Percent, color: '#8B5CF6' },
];

const monthlySignups = [
  { month: 'Sep', value: 65 },
  { month: 'Oct', value: 80 },
  { month: 'Nov', value: 72 },
  { month: 'Déc', value: 90 },
  { month: 'Jan', value: 110 },
  { month: 'Fév', value: 95 },
  { month: 'Mar', value: 130 },
];

const maxSignup = Math.max(...monthlySignups.map((m) => m.value));

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-[#131516]">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${stat.color}15` }}
            >
              <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#131516]">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bar chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h2 className="text-lg font-semibold text-[#131516] mb-6">Inscriptions par mois</h2>
        <div className="flex items-end gap-3 h-48">
          {monthlySignups.map((m) => (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-medium text-gray-600">{m.value}</span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(m.value / maxSignup) * 100}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="w-full rounded-t-md"
                style={{ backgroundColor: '#FF6B00' }}
              />
              <span className="text-xs text-gray-500">{m.month}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
