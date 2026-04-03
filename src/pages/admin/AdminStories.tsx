import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X, ChevronDown, ChevronUp, GripVertical } from 'lucide-react'
import type { StoryData, StorySlide, StoryBackground } from '../../types/database'

const MOCK_STORIES: StoryData[] = [
  {
    id: 'story-1',
    language_id: 'bm',
    title: 'Moussa va au marché',
    description: 'Moussa salue ses voisins en allant au marché.',
    icon: '🛒',
    level: 1,
    xp_reward: 20,
    is_free: true,
    slides: [
      { id: 's1', text_target: 'Moussa bɛ bɔ a ka so kɔnɔ.', text_french: 'Moussa sort de chez lui.', background: 'morning', illustration: '🏠🚶‍♂️☀️', speaker: 'Narrateur' },
      { id: 's2', text_target: 'I ni ce !', text_french: 'Bonjour !', background: 'morning', illustration: '🚶‍♂️👋🧑', speaker: 'Moussa' },
    ],
  },
]

const backgrounds: StoryBackground[] = ['morning', 'market', 'night', 'village', 'river']
const bgLabels: Record<StoryBackground, string> = {
  morning: '🌅 Matin', market: '🏪 Marché', night: '🌙 Nuit', village: '🌿 Village', river: '🌊 Rivière',
}

interface StoryForm {
  title: string
  description: string
  icon: string
  level: number
  xp_reward: number
  language_id: string
  is_free: boolean
  slides: StorySlide[]
}

const emptySlide: StorySlide = {
  id: '', text_target: '', text_french: '', background: 'morning', illustration: '', speaker: '',
}

const emptyForm: StoryForm = {
  title: '', description: '', icon: '📖', level: 1, xp_reward: 20, language_id: 'bm', is_free: true, slides: [],
}

export default function AdminStories() {
  const [stories, setStories] = useState(MOCK_STORIES)
  const [lang, setLang] = useState<'bm' | 'snk'>('bm')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<StoryForm>(emptyForm)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [expandedSlide, setExpandedSlide] = useState<number | null>(null)

  const filtered = stories.filter((s) => s.language_id === lang)

  const openCreate = () => {
    setEditingId(null)
    setForm({ ...emptyForm, language_id: lang, slides: [{ ...emptySlide, id: crypto.randomUUID() }] })
    setExpandedSlide(0)
    setModalOpen(true)
  }

  const openEdit = (s: StoryData) => {
    setEditingId(s.id)
    setForm({
      title: s.title, description: s.description, icon: s.icon, level: s.level,
      xp_reward: s.xp_reward, language_id: s.language_id, is_free: s.is_free, slides: [...s.slides],
    })
    setExpandedSlide(null)
    setModalOpen(true)
  }

  const handleSave = () => {
    if (editingId) {
      setStories((prev) => prev.map((s) => s.id === editingId ? { ...s, ...form } : s))
    } else {
      setStories((prev) => [...prev, { ...form, id: crypto.randomUUID() } as StoryData])
    }
    setModalOpen(false)
  }

  const handleDelete = () => {
    if (deleteId) { setStories((prev) => prev.filter((s) => s.id !== deleteId)); setDeleteId(null) }
  }

  const addSlide = () => {
    const newSlide = { ...emptySlide, id: crypto.randomUUID() }
    setForm({ ...form, slides: [...form.slides, newSlide] })
    setExpandedSlide(form.slides.length)
  }

  const updateSlide = (index: number, patch: Partial<StorySlide>) => {
    const slides = [...form.slides]
    slides[index] = { ...slides[index], ...patch }
    setForm({ ...form, slides })
  }

  const removeSlide = (index: number) => {
    setForm({ ...form, slides: form.slides.filter((_, i) => i !== index) })
    setExpandedSlide(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#131516]">Histoires</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gérez les histoires interactives</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FF6B00] text-white rounded-xl text-sm font-medium hover:bg-[#FF6B00]/90 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Nouvelle histoire
        </button>
      </div>

      {/* Language tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {(['bm', 'snk'] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              lang === l ? 'bg-white text-[#131516] shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {l === 'bm' ? '🇲🇱 Bambara' : '🇲🇱 Soninké'}
          </button>
        ))}
      </div>

      {/* Stories cards grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <span className="text-4xl mb-3 block">📖</span>
          <p className="text-gray-500 text-sm">Aucune histoire pour cette langue.</p>
          <button onClick={openCreate} className="mt-4 text-sm font-medium text-[#FF6B00] hover:underline cursor-pointer">
            Créer la première histoire
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((story, i) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl">{story.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#131516] text-base">{story.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{story.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                    {story.slides.length} slides
                  </span>
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-600">
                    Niv. {story.level}
                  </span>
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600">
                    {story.xp_reward} XP
                  </span>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${story.is_free ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                    {story.is_free ? 'Gratuit' : 'Premium'}
                  </span>
                </div>
              </div>
              <div className="flex border-t border-gray-100">
                <button onClick={() => openEdit(story)} className="flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium text-gray-500 hover:text-[#FF6B00] hover:bg-orange-50/50 transition-colors cursor-pointer">
                  <Pencil className="w-3.5 h-3.5" /> Modifier
                </button>
                <div className="w-px bg-gray-100" />
                <button onClick={() => setDeleteId(story.id)} className="flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium text-gray-500 hover:text-red-500 hover:bg-red-50/50 transition-colors cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" /> Supprimer
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-[#131516]">
                  {editingId ? 'Modifier l\'histoire' : 'Nouvelle histoire'}
                </h2>
                <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                {/* Basic info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                    <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]"
                      placeholder="Ex: Moussa va au marché" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00] resize-none"
                      placeholder="Description courte..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icône</label>
                    <input type="text" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Langue</label>
                    <select value={form.language_id} onChange={(e) => setForm({ ...form, language_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]">
                      <option value="bm">Bambara</option>
                      <option value="snk">Soninké</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
                    <select value={form.level} onChange={(e) => setForm({ ...form, level: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]">
                      <option value={1}>1 - Débutant</option>
                      <option value={2}>2 - Intermédiaire</option>
                      <option value={3}>3 - Avancé</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">XP Récompense</label>
                    <input type="number" value={form.xp_reward} onChange={(e) => setForm({ ...form, xp_reward: parseInt(e.target.value) || 0 })}
                      min={0} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]" />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <div onClick={() => setForm({ ...form, is_free: !form.is_free })}
                    className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${form.is_free ? 'bg-[#2D9F4F]' : 'bg-gray-300'}`}>
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.is_free ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                  </div>
                  <span className="text-sm text-gray-700">Gratuit</span>
                </label>

                {/* Slides */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-[#131516]">Slides ({form.slides.length})</h3>
                    <button onClick={addSlide} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#FF6B00] bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors cursor-pointer">
                      <Plus className="w-3 h-3" /> Ajouter un slide
                    </button>
                  </div>
                  <div className="space-y-2">
                    {form.slides.map((slide, idx) => (
                      <div key={slide.id || idx} className="border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setExpandedSlide(expandedSlide === idx ? null : idx)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <GripVertical className="w-4 h-4 text-gray-300" />
                          <span className="text-xs font-bold text-gray-400 w-6">#{idx + 1}</span>
                          <span className="text-sm text-[#131516] flex-1 truncate">
                            {slide.text_target || 'Slide vide...'}
                          </span>
                          <span className="text-xs text-gray-400">{bgLabels[slide.background]}</span>
                          {expandedSlide === idx ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </button>
                        {expandedSlide === idx && (
                          <div className="px-4 pb-4 pt-2 border-t border-gray-100 space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="sm:col-span-2">
                                <label className="block text-xs font-medium text-gray-600 mb-1">Texte cible (Bambara/Soninké)</label>
                                <input type="text" value={slide.text_target} onChange={(e) => updateSlide(idx, { text_target: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]"
                                  placeholder="I ni ce !" />
                              </div>
                              <div className="sm:col-span-2">
                                <label className="block text-xs font-medium text-gray-600 mb-1">Traduction française</label>
                                <input type="text" value={slide.text_french} onChange={(e) => updateSlide(idx, { text_french: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]"
                                  placeholder="Bonjour !" />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Fond</label>
                                <select value={slide.background} onChange={(e) => updateSlide(idx, { background: e.target.value as StoryBackground })}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]">
                                  {backgrounds.map((b) => <option key={b} value={b}>{bgLabels[b]}</option>)}
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Personnage</label>
                                <input type="text" value={slide.speaker || ''} onChange={(e) => updateSlide(idx, { speaker: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]"
                                  placeholder="Moussa" />
                              </div>
                              <div className="sm:col-span-2">
                                <label className="block text-xs font-medium text-gray-600 mb-1">Illustration (emojis)</label>
                                <input type="text" value={slide.illustration} onChange={(e) => updateSlide(idx, { illustration: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]"
                                  placeholder="🏠🚶‍♂️☀️" />
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <button onClick={() => removeSlide(idx)} className="text-xs text-red-500 hover:text-red-600 font-medium cursor-pointer">
                                Supprimer ce slide
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
                <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors cursor-pointer">
                  Annuler
                </button>
                <button onClick={handleSave} className="px-5 py-2 bg-[#FF6B00] text-white rounded-xl text-sm font-medium hover:bg-[#FF6B00]/90 transition-colors cursor-pointer">
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteId(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-[#131516] mb-2">Supprimer l'histoire ?</h3>
              <p className="text-sm text-gray-500 mb-6">Cette action est irréversible.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                  Annuler
                </button>
                <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors cursor-pointer">
                  Supprimer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
