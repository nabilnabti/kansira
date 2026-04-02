import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, ListChecks } from 'lucide-react';

interface MockLesson {
  id: string;
  module_id: string;
  title: string;
  description: string;
  xp_reward: number;
  order_index: number;
  exercises_count: number;
  module_title: string;
}

const MOCK_MODULES = [
  { id: '1', title: 'Salutations (Bambara)' },
  { id: '2', title: 'La famille (Bambara)' },
  { id: '3', title: 'Le marché (Bambara)' },
  { id: '5', title: 'Salutations (Soninké)' },
];

const MOCK_LESSONS: MockLesson[] = [
  { id: 'l1', module_id: '1', title: 'Bonjour et au revoir', description: 'Apprenez les salutations de base', xp_reward: 15, order_index: 1, exercises_count: 6, module_title: 'Salutations (Bambara)' },
  { id: 'l2', module_id: '1', title: 'Comment ça va ?', description: 'Demander et répondre sur la santé', xp_reward: 15, order_index: 2, exercises_count: 5, module_title: 'Salutations (Bambara)' },
  { id: 'l3', module_id: '1', title: 'Se présenter', description: 'Dire son nom et son origine', xp_reward: 20, order_index: 3, exercises_count: 7, module_title: 'Salutations (Bambara)' },
  { id: 'l4', module_id: '2', title: 'Les parents', description: 'Mère, père, frère, soeur', xp_reward: 15, order_index: 1, exercises_count: 5, module_title: 'La famille (Bambara)' },
  { id: 'l5', module_id: '2', title: 'La famille élargie', description: 'Oncle, tante, cousin...', xp_reward: 20, order_index: 2, exercises_count: 6, module_title: 'La famille (Bambara)' },
  { id: 'l6', module_id: '5', title: 'An maarenge', description: 'Les salutations de base en Soninké', xp_reward: 15, order_index: 1, exercises_count: 5, module_title: 'Salutations (Soninké)' },
];

interface LessonForm {
  title: string;
  description: string;
  module_id: string;
  xp_reward: number;
  order_index: number;
}

const emptyForm: LessonForm = {
  title: '',
  description: '',
  module_id: '1',
  xp_reward: 15,
  order_index: 1,
};

export default function AdminLessons() {
  const [filterModule, setFilterModule] = useState('all');
  const [lessons, setLessons] = useState(MOCK_LESSONS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<LessonForm>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = filterModule === 'all' ? lessons : lessons.filter((l) => l.module_id === filterModule);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, module_id: filterModule === 'all' ? '1' : filterModule });
    setModalOpen(true);
  };

  const openEdit = (l: MockLesson) => {
    setEditingId(l.id);
    setForm({
      title: l.title,
      description: l.description,
      module_id: l.module_id,
      xp_reward: l.xp_reward,
      order_index: l.order_index,
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    const moduleName = MOCK_MODULES.find((m) => m.id === form.module_id)?.title || '';
    if (editingId) {
      setLessons((prev) =>
        prev.map((l) =>
          l.id === editingId ? { ...l, ...form, module_title: moduleName } : l
        )
      );
    } else {
      setLessons((prev) => [
        ...prev,
        { ...form, id: crypto.randomUUID(), exercises_count: 0, module_title: moduleName },
      ]);
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      setLessons((prev) => prev.filter((l) => l.id !== deleteId));
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-[#131516]">Leçons</h1>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FF6B00] text-white rounded-lg text-sm font-medium hover:bg-[#FF6B00]/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouvelle leçon
        </button>
      </div>

      {/* Module filter */}
      <div>
        <select
          value={filterModule}
          onChange={(e) => setFilterModule(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00] bg-white"
        >
          <option value="all">Tous les modules</option>
          {MOCK_MODULES.map((m) => (
            <option key={m.id} value={m.id}>{m.title}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Ordre</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Titre</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Module</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">XP</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Exercices</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 text-gray-600">{l.order_index}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-[#131516]">{l.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{l.description}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{l.module_title}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-[#FF6B00]/10 text-[#FF6B00]">
                      {l.xp_reward} XP
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{l.exercises_count}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link
                        to={`/admin/exercises/${l.id}`}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#2D9F4F] transition-colors"
                        title="Gérer les exercices"
                      >
                        <ListChecks className="w-4 h-4" />
                      </Link>
                      <button onClick={() => openEdit(l)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#FF6B00] transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteId(l.id)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-[#131516]">
                  {editingId ? 'Modifier la leçon' : 'Nouvelle leçon'}
                </h2>
                <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg hover:bg-gray-100">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]"
                    placeholder="Ex: Bonjour et au revoir"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
                  <select
                    value={form.module_id}
                    onChange={(e) => setForm({ ...form, module_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]"
                  >
                    {MOCK_MODULES.map((m) => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">XP Reward</label>
                    <input
                      type="number"
                      value={form.xp_reward}
                      onChange={(e) => setForm({ ...form, xp_reward: parseInt(e.target.value) || 0 })}
                      min={0}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ordre</label>
                    <input
                      type="number"
                      value={form.order_index}
                      onChange={(e) => setForm({ ...form, order_index: parseInt(e.target.value) || 1 })}
                      min={1}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-[#FF6B00] text-white rounded-lg text-sm font-medium hover:bg-[#FF6B00]/90 transition-colors"
                >
                  {editingId ? 'Enregistrer' : 'Créer'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-[#131516] mb-2">Supprimer la leçon ?</h3>
              <p className="text-sm text-gray-500 mb-6">
                Cette action est irréversible. Tous les exercices associés seront également supprimés.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
