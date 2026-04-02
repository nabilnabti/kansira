import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import type { Module } from '../../types/database';

type Language = 'bambara' | 'soninke';

const MOCK_MODULES: (Module & { lessons_count: number })[] = [
  { id: '1', language_id: 'bambara', title: 'Salutations', description: 'Les bases des salutations en Bambara', icon: '👋', order_index: 1, is_free: true, is_published: true, created_at: '2025-01-01', lessons_count: 5 },
  { id: '2', language_id: 'bambara', title: 'La famille', description: 'Vocabulaire de la famille', icon: '👨‍👩‍👧', order_index: 2, is_free: true, is_published: true, created_at: '2025-01-05', lessons_count: 4 },
  { id: '3', language_id: 'bambara', title: 'Le marché', description: 'Acheter et vendre au marché', icon: '🛒', order_index: 3, is_free: false, is_published: true, created_at: '2025-01-10', lessons_count: 6 },
  { id: '4', language_id: 'bambara', title: 'Les nombres', description: 'Compter en Bambara', icon: '🔢', order_index: 4, is_free: false, is_published: false, created_at: '2025-01-15', lessons_count: 3 },
  { id: '5', language_id: 'soninke', title: 'Salutations', description: 'Les bases des salutations en Soninké', icon: '👋', order_index: 1, is_free: true, is_published: true, created_at: '2025-02-01', lessons_count: 5 },
  { id: '6', language_id: 'soninke', title: 'La famille', description: 'Vocabulaire de la famille en Soninké', icon: '👨‍👩‍👧', order_index: 2, is_free: true, is_published: true, created_at: '2025-02-05', lessons_count: 4 },
  { id: '7', language_id: 'soninke', title: 'La nourriture', description: 'Les aliments et la cuisine', icon: '🍲', order_index: 3, is_free: false, is_published: true, created_at: '2025-02-10', lessons_count: 3 },
];

interface ModuleForm {
  title: string;
  description: string;
  icon: string;
  order_index: number;
  language_id: Language;
  is_free: boolean;
  is_published: boolean;
}

const emptyForm: ModuleForm = {
  title: '',
  description: '',
  icon: '📚',
  order_index: 1,
  language_id: 'bambara',
  is_free: false,
  is_published: false,
};

export default function AdminModules() {
  const [lang, setLang] = useState<Language>('bambara');
  const [modules, setModules] = useState(MOCK_MODULES);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ModuleForm>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = modules.filter((m) => m.language_id === lang);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, language_id: lang });
    setModalOpen(true);
  };

  const openEdit = (m: Module & { lessons_count: number }) => {
    setEditingId(m.id);
    setForm({
      title: m.title,
      description: m.description,
      icon: m.icon,
      order_index: m.order_index,
      language_id: m.language_id as Language,
      is_free: m.is_free,
      is_published: m.is_published,
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editingId) {
      setModules((prev) =>
        prev.map((m) =>
          m.id === editingId ? { ...m, ...form } : m
        )
      );
    } else {
      setModules((prev) => [
        ...prev,
        { ...form, id: crypto.randomUUID(), created_at: new Date().toISOString(), lessons_count: 0 },
      ]);
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      setModules((prev) => prev.filter((m) => m.id !== deleteId));
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-[#131516]">Modules</h1>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FF6B00] text-white rounded-lg text-sm font-medium hover:bg-[#FF6B00]/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouveau module
        </button>
      </div>

      {/* Language tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {(['bambara', 'soninke'] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              lang === l ? 'bg-white text-[#131516] shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {l === 'bambara' ? 'Bambara' : 'Soninké'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Ordre</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Titre</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Langue</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Leçons</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Gratuit</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Publié</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 text-gray-600">{m.order_index}</td>
                  <td className="px-4 py-3 font-medium text-[#131516]">
                    <span className="mr-2">{m.icon}</span>
                    {m.title}
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell capitalize">{m.language_id}</td>
                  <td className="px-4 py-3 text-gray-600">{m.lessons_count}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${m.is_free ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {m.is_free ? 'Oui' : 'Non'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${m.is_published ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {m.is_published ? 'Publié' : 'Brouillon'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(m)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#FF6B00] transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteId(m.id)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-red-500 transition-colors">
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
                  {editingId ? 'Modifier le module' : 'Nouveau module'}
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
                    placeholder="Ex: Salutations"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00] resize-none"
                    placeholder="Description du module..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icône (emoji)</label>
                    <input
                      type="text"
                      value={form.icon}
                      onChange={(e) => setForm({ ...form, icon: e.target.value })}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Langue</label>
                  <select
                    value={form.language_id}
                    onChange={(e) => setForm({ ...form, language_id: e.target.value as Language })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]"
                  >
                    <option value="bambara">Bambara</option>
                    <option value="soninke">Soninké</option>
                  </select>
                </div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div
                      onClick={() => setForm({ ...form, is_free: !form.is_free })}
                      className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${form.is_free ? 'bg-[#2D9F4F]' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.is_free ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                    </div>
                    <span className="text-sm text-gray-700">Gratuit</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <div
                      onClick={() => setForm({ ...form, is_published: !form.is_published })}
                      className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${form.is_published ? 'bg-[#2D9F4F]' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.is_published ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                    </div>
                    <span className="text-sm text-gray-700">Publié</span>
                  </label>
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
              <h3 className="text-lg font-semibold text-[#131516] mb-2">Supprimer le module ?</h3>
              <p className="text-sm text-gray-500 mb-6">
                Cette action est irréversible. Toutes les leçons et exercices associés seront également supprimés.
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
