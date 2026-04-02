import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

interface MockUser {
  id: string;
  display_name: string;
  email: string;
  is_premium: boolean;
  is_admin: boolean;
  total_xp: number;
  current_streak: number;
  created_at: string;
  progress: { module: string; lessons_completed: number; total_lessons: number }[];
}

const MOCK_USERS: MockUser[] = [
  {
    id: 'u1',
    display_name: 'Amadou Diallo',
    email: 'amadou@example.com',
    is_premium: true,
    is_admin: true,
    total_xp: 4520,
    current_streak: 12,
    created_at: '2025-03-15',
    progress: [
      { module: 'Salutations', lessons_completed: 5, total_lessons: 5 },
      { module: 'La famille', lessons_completed: 3, total_lessons: 4 },
    ],
  },
  {
    id: 'u2',
    display_name: 'Fatoumata Traoré',
    email: 'fatou@example.com',
    is_premium: true,
    is_admin: false,
    total_xp: 3210,
    current_streak: 7,
    created_at: '2025-04-20',
    progress: [
      { module: 'Salutations', lessons_completed: 5, total_lessons: 5 },
      { module: 'La famille', lessons_completed: 2, total_lessons: 4 },
    ],
  },
  {
    id: 'u3',
    display_name: 'Moussa Konaté',
    email: 'moussa@example.com',
    is_premium: false,
    is_admin: false,
    total_xp: 1850,
    current_streak: 3,
    created_at: '2025-06-10',
    progress: [
      { module: 'Salutations', lessons_completed: 4, total_lessons: 5 },
    ],
  },
  {
    id: 'u4',
    display_name: 'Aïssata Coulibaly',
    email: 'aissata@example.com',
    is_premium: false,
    is_admin: false,
    total_xp: 920,
    current_streak: 0,
    created_at: '2025-08-01',
    progress: [
      { module: 'Salutations', lessons_completed: 2, total_lessons: 5 },
    ],
  },
  {
    id: 'u5',
    display_name: 'Ibrahim Sangaré',
    email: 'ibrahim@example.com',
    is_premium: true,
    is_admin: false,
    total_xp: 5670,
    current_streak: 21,
    created_at: '2025-02-28',
    progress: [
      { module: 'Salutations', lessons_completed: 5, total_lessons: 5 },
      { module: 'La famille', lessons_completed: 4, total_lessons: 4 },
      { module: 'Le marché', lessons_completed: 2, total_lessons: 6 },
    ],
  },
  {
    id: 'u6',
    display_name: 'Mariam Keïta',
    email: 'mariam@example.com',
    is_premium: false,
    is_admin: false,
    total_xp: 450,
    current_streak: 1,
    created_at: '2025-11-15',
    progress: [
      { module: 'Salutations (Soninké)', lessons_completed: 1, total_lessons: 5 },
    ],
  },
];

export default function AdminUsers() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = users.filter(
    (u) =>
      u.display_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleField = (userId: string, field: 'is_premium' | 'is_admin') => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, [field]: !u[field] } : u))
    );
  };

  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#131516]">Utilisateurs</h1>

      {/* Search */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par nom ou email..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00] bg-white"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Nom</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Premium</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Admin</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">XP</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Streak</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Inscrit le</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <motion.tbody key={u.id} layout>
                  <tr
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer"
                    onClick={() => setExpandedId(expandedId === u.id ? null : u.id)}
                  >
                    <td className="px-4 py-3 font-medium text-[#131516]">{u.display_name}</td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{u.email}</td>
                    <td className="px-4 py-3">
                      <div
                        onClick={(e) => { e.stopPropagation(); toggleField(u.id, 'is_premium'); }}
                        className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${u.is_premium ? 'bg-[#FF6B00]' : 'bg-gray-300'}`}
                      >
                        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${u.is_premium ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div
                        onClick={(e) => { e.stopPropagation(); toggleField(u.id, 'is_admin'); }}
                        className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${u.is_admin ? 'bg-[#2D9F4F]' : 'bg-gray-300'}`}
                      >
                        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${u.is_admin ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{u.total_xp.toLocaleString()}</td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${u.current_streak > 0 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'}`}>
                        {u.current_streak}j
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{formatDate(u.created_at)}</td>
                    <td className="px-4 py-3">
                      {expandedId === u.id ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </td>
                  </tr>

                  {/* Expanded details */}
                  <AnimatePresence>
                    {expandedId === u.id && (
                      <tr>
                        <td colSpan={8} className="px-4 py-0">
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="py-4 pl-4 space-y-3">
                              <p className="text-sm font-medium text-gray-700">Progression par module</p>
                              {u.progress.length === 0 ? (
                                <p className="text-sm text-gray-400">Aucune progression</p>
                              ) : (
                                <div className="space-y-2 max-w-md">
                                  {u.progress.map((p) => {
                                    const pct = Math.round((p.lessons_completed / p.total_lessons) * 100);
                                    return (
                                      <div key={p.module}>
                                        <div className="flex justify-between text-xs mb-1">
                                          <span className="text-gray-600">{p.module}</span>
                                          <span className="text-gray-500">
                                            {p.lessons_completed}/{p.total_lessons} leçons ({pct}%)
                                          </span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                          <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${pct}%` }}
                                            className="h-full rounded-full bg-[#2D9F4F]"
                                          />
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                              <p className="text-xs text-gray-400 md:hidden">
                                {u.email} &middot; {u.total_xp.toLocaleString()} XP &middot; Streak: {u.current_streak}j &middot; Inscrit le {formatDate(u.created_at)}
                              </p>
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </motion.tbody>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
