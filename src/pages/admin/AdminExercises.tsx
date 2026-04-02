import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, GripVertical, ArrowLeft, Eye, Upload } from 'lucide-react';
import type { ExerciseType, ExerciseData, MultipleChoiceData, TranslationData, WordMatchData, FillBlankData, ListenChooseData, WordOrderData } from '../../types/database';

interface MockExercise {
  id: string;
  lesson_id: string;
  type: ExerciseType;
  order_index: number;
  data: ExerciseData;
}

const LESSON_TITLES: Record<string, string> = {
  l1: 'Bonjour et au revoir',
  l2: 'Comment ça va ?',
  l3: 'Se présenter',
  l4: 'Les parents',
  l5: 'La famille élargie',
  l6: 'An maarenge',
};

const createMockExercises = (lessonId: string): MockExercise[] => [
  {
    id: 'e1',
    lesson_id: lessonId,
    type: 'multiple_choice',
    order_index: 1,
    data: { type: 'multiple_choice', question: 'Comment dit-on "Bonjour" en Bambara ?', options: ['I ni ce', 'I ni sogoma', 'I ni tile', 'I ni wula'], correct_index: 0 },
  },
  {
    id: 'e2',
    lesson_id: lessonId,
    type: 'translation',
    order_index: 2,
    data: { type: 'translation', prompt: 'I ni ce', correct_answer: 'Bonjour', accepted_answers: ['Bonjour', 'Salut'], word_bank: ['Bonjour', 'Au revoir', 'Merci', 'Salut'], source_lang: 'bambara', target_lang: 'french' },
  },
  {
    id: 'e3',
    lesson_id: lessonId,
    type: 'word_match',
    order_index: 3,
    data: { type: 'word_match', pairs: [{ left: 'I ni ce', right: 'Bonjour' }, { left: 'I ni sogoma', right: 'Bonne matinée' }, { left: 'I ni tile', right: 'Bon après-midi' }, { left: 'I ni wula', right: 'Bonsoir' }] },
  },
  {
    id: 'e4',
    lesson_id: lessonId,
    type: 'fill_blank',
    order_index: 4,
    data: { type: 'fill_blank', sentence: 'I ___ ce', blank_index: 1, options: ['ni', 'na', 'ka', 'ye'], correct_index: 0 },
  },
  {
    id: 'e5',
    lesson_id: lessonId,
    type: 'listen_choose',
    order_index: 5,
    data: { type: 'listen_choose', audio_url: '/audio/i-ni-ce.mp3', options: ['Bonjour', 'Au revoir', 'Merci', 'Pardon'], correct_index: 0, transcript: 'I ni ce' },
  },
  {
    id: 'e6',
    lesson_id: lessonId,
    type: 'word_order',
    order_index: 6,
    data: { type: 'word_order', prompt: 'Construis la phrase : "Bonjour, comment ça va ?"', correct_order: ['I', 'ni', 'ce', ',', 'hera', 'sira', '?'], shuffled_words: ['sira', 'ni', '?', 'hera', 'I', ',', 'ce'] },
  },
];

const EXERCISE_TYPE_LABELS: Record<ExerciseType, string> = {
  multiple_choice: 'QCM',
  translation: 'Traduction',
  word_match: 'Associer les mots',
  fill_blank: 'Compléter',
  listen_choose: 'Écouter & choisir',
  word_order: 'Ordre des mots',
};

const EXERCISE_TYPE_COLORS: Record<ExerciseType, string> = {
  multiple_choice: 'bg-blue-100 text-blue-700',
  translation: 'bg-purple-100 text-purple-700',
  word_match: 'bg-green-100 text-green-700',
  fill_blank: 'bg-yellow-100 text-yellow-700',
  listen_choose: 'bg-pink-100 text-pink-700',
  word_order: 'bg-indigo-100 text-indigo-700',
};

// Form state types
interface MCForm { question: string; options: [string, string, string, string]; correct_index: number; image_url: string; }
interface TransForm { prompt: string; correct_answer: string; accepted_answers: string; word_bank: string; source_lang: string; target_lang: string; }
interface MatchForm { pairs: { left: string; right: string }[]; }
interface FillForm { sentence: string; blank_index: number; options: string; correct_index: number; }
interface ListenForm { audio_url: string; options: string; correct_index: number; transcript: string; }
interface OrderForm { prompt: string; correct_order: string; }

type AnyForm = MCForm | TransForm | MatchForm | FillForm | ListenForm | OrderForm;

function getDefaultForm(type: ExerciseType): AnyForm {
  switch (type) {
    case 'multiple_choice': return { question: '', options: ['', '', '', ''], correct_index: 0, image_url: '' };
    case 'translation': return { prompt: '', correct_answer: '', accepted_answers: '', word_bank: '', source_lang: 'bambara', target_lang: 'french' };
    case 'word_match': return { pairs: [{ left: '', right: '' }, { left: '', right: '' }] };
    case 'fill_blank': return { sentence: '', blank_index: 0, options: '', correct_index: 0 };
    case 'listen_choose': return { audio_url: '', options: '', correct_index: 0, transcript: '' };
    case 'word_order': return { prompt: '', correct_order: '' };
  }
}

function dataToForm(type: ExerciseType, data: ExerciseData): AnyForm {
  switch (type) {
    case 'multiple_choice': {
      const d = data as MultipleChoiceData;
      return { question: d.question, options: [d.options[0] || '', d.options[1] || '', d.options[2] || '', d.options[3] || ''] as [string, string, string, string], correct_index: d.correct_index, image_url: d.image_url || '' };
    }
    case 'translation': {
      const d = data as TranslationData;
      return { prompt: d.prompt, correct_answer: d.correct_answer, accepted_answers: d.accepted_answers.join(', '), word_bank: (d.word_bank || []).join(', '), source_lang: d.source_lang, target_lang: d.target_lang };
    }
    case 'word_match': {
      const d = data as WordMatchData;
      return { pairs: d.pairs.map((p) => ({ ...p })) };
    }
    case 'fill_blank': {
      const d = data as FillBlankData;
      return { sentence: d.sentence, blank_index: d.blank_index, options: d.options.join(', '), correct_index: d.correct_index };
    }
    case 'listen_choose': {
      const d = data as ListenChooseData;
      return { audio_url: d.audio_url, options: d.options.join(', '), correct_index: d.correct_index, transcript: d.transcript };
    }
    case 'word_order': {
      const d = data as WordOrderData;
      return { prompt: d.prompt, correct_order: d.correct_order.join(', ') };
    }
  }
}

function formToData(type: ExerciseType, form: AnyForm): ExerciseData {
  switch (type) {
    case 'multiple_choice': {
      const f = form as MCForm;
      return { type, question: f.question, options: [...f.options], correct_index: f.correct_index, ...(f.image_url ? { image_url: f.image_url } : {}) };
    }
    case 'translation': {
      const f = form as TransForm;
      const accepted = f.accepted_answers.split(',').map((s) => s.trim()).filter(Boolean);
      const bank = f.word_bank.split(',').map((s) => s.trim()).filter(Boolean);
      return { type, prompt: f.prompt, correct_answer: f.correct_answer, accepted_answers: accepted, word_bank: bank.length ? bank : undefined, source_lang: f.source_lang, target_lang: f.target_lang };
    }
    case 'word_match': {
      const f = form as MatchForm;
      return { type, pairs: f.pairs.filter((p) => p.left && p.right) };
    }
    case 'fill_blank': {
      const f = form as FillForm;
      return { type, sentence: f.sentence, blank_index: f.blank_index, options: f.options.split(',').map((s) => s.trim()).filter(Boolean), correct_index: f.correct_index };
    }
    case 'listen_choose': {
      const f = form as ListenForm;
      return { type, audio_url: f.audio_url, options: f.options.split(',').map((s) => s.trim()).filter(Boolean), correct_index: f.correct_index, transcript: f.transcript };
    }
    case 'word_order': {
      const f = form as OrderForm;
      const order = f.correct_order.split(',').map((s) => s.trim()).filter(Boolean);
      const shuffled = [...order].sort(() => Math.random() - 0.5);
      return { type, prompt: f.prompt, correct_order: order, shuffled_words: shuffled };
    }
  }
}

// Preview component
function ExercisePreview({ type, data }: { type: ExerciseType; data: ExerciseData }) {
  switch (type) {
    case 'multiple_choice': {
      const d = data as MultipleChoiceData;
      return (
        <div className="space-y-2">
          <p className="text-sm font-medium text-[#131516]">{d.question}</p>
          <div className="space-y-1.5">
            {d.options.map((o, i) => (
              <div key={i} className={`text-xs px-3 py-1.5 rounded-lg border ${i === d.correct_index ? 'border-[#2D9F4F] bg-[#2D9F4F]/10 text-[#2D9F4F]' : 'border-gray-200 text-gray-600'}`}>
                {o}
              </div>
            ))}
          </div>
        </div>
      );
    }
    case 'translation': {
      const d = data as TranslationData;
      return (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">Traduire :</p>
          <p className="text-sm font-medium text-[#131516]">{d.prompt}</p>
          <p className="text-xs text-[#2D9F4F]">Reponse : {d.correct_answer}</p>
          {d.word_bank && d.word_bank.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {d.word_bank.map((w, i) => (
                <span key={i} className="text-xs px-2 py-1 bg-gray-100 rounded-md">{w}</span>
              ))}
            </div>
          )}
        </div>
      );
    }
    case 'word_match': {
      const d = data as WordMatchData;
      return (
        <div className="space-y-1.5">
          {d.pairs.map((p, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className="px-2 py-1 bg-blue-50 rounded text-blue-700">{p.left}</span>
              <span className="text-gray-400">&harr;</span>
              <span className="px-2 py-1 bg-green-50 rounded text-green-700">{p.right}</span>
            </div>
          ))}
        </div>
      );
    }
    case 'fill_blank': {
      const d = data as FillBlankData;
      const words = d.sentence.split(' ');
      return (
        <div className="space-y-2">
          <p className="text-sm">
            {words.map((w, i) => (
              <span key={i}>
                {i === d.blank_index ? (
                  <span className="inline-block px-3 py-0.5 border-b-2 border-[#FF6B00] text-[#FF6B00] font-medium">___</span>
                ) : (
                  w
                )}
                {i < words.length - 1 ? ' ' : ''}
              </span>
            ))}
          </p>
          <div className="flex flex-wrap gap-1">
            {d.options.map((o, i) => (
              <span key={i} className={`text-xs px-2 py-1 rounded-md ${i === d.correct_index ? 'bg-[#2D9F4F]/10 text-[#2D9F4F]' : 'bg-gray-100 text-gray-600'}`}>{o}</span>
            ))}
          </div>
        </div>
      );
    }
    case 'listen_choose': {
      const d = data as ListenChooseData;
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FF6B00]/10 flex items-center justify-center">
              <span className="text-xs">&#9654;</span>
            </div>
            <span className="text-xs text-gray-500">{d.transcript}</span>
          </div>
          <div className="space-y-1">
            {d.options.map((o, i) => (
              <div key={i} className={`text-xs px-3 py-1.5 rounded-lg border ${i === d.correct_index ? 'border-[#2D9F4F] bg-[#2D9F4F]/10 text-[#2D9F4F]' : 'border-gray-200 text-gray-600'}`}>
                {o}
              </div>
            ))}
          </div>
        </div>
      );
    }
    case 'word_order': {
      const d = data as WordOrderData;
      return (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">{d.prompt}</p>
          <div className="flex flex-wrap gap-1">
            {d.shuffled_words.map((w, i) => (
              <span key={i} className="text-xs px-2 py-1 bg-gray-100 rounded-md">{w}</span>
            ))}
          </div>
          <p className="text-xs text-[#2D9F4F]">Ordre : {d.correct_order.join(' ')}</p>
        </div>
      );
    }
  }
}

export default function AdminExercises() {
  const { id: lessonId } = useParams<{ id: string }>();
  const effectiveId = lessonId || 'l1';
  const lessonTitle = LESSON_TITLES[effectiveId] || 'Leçon inconnue';

  const [exercises, setExercises] = useState<MockExercise[]>(() => createMockExercises(effectiveId));
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<ExerciseType>('multiple_choice');
  const [form, setForm] = useState<AnyForm>(getDefaultForm('multiple_choice'));
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const openCreate = () => {
    setEditingId(null);
    setSelectedType('multiple_choice');
    setForm(getDefaultForm('multiple_choice'));
    setModalOpen(true);
  };

  const openEdit = (ex: MockExercise) => {
    setEditingId(ex.id);
    setSelectedType(ex.type);
    setForm(dataToForm(ex.type, ex.data));
    setModalOpen(true);
  };

  const handleTypeChange = (type: ExerciseType) => {
    setSelectedType(type);
    setForm(getDefaultForm(type));
  };

  const handleSave = () => {
    const data = formToData(selectedType, form);
    if (editingId) {
      setExercises((prev) =>
        prev.map((e) => (e.id === editingId ? { ...e, type: selectedType, data } : e))
      );
    } else {
      setExercises((prev) => [
        ...prev,
        { id: crypto.randomUUID(), lesson_id: effectiveId, type: selectedType, order_index: prev.length + 1, data },
      ]);
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      setExercises((prev) => prev.filter((e) => e.id !== deleteId));
      setDeleteId(null);
    }
  };

  // Dynamic form rendering
  const renderForm = () => {
    switch (selectedType) {
      case 'multiple_choice': {
        const f = form as MCForm;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
              <input type="text" value={f.question} onChange={(e) => setForm({ ...f, question: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]" placeholder="Comment dit-on ... ?" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Options (4)</label>
              {f.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correct"
                    checked={f.correct_index === i}
                    onChange={() => setForm({ ...f, correct_index: i })}
                    className="accent-[#2D9F4F]"
                  />
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const newOpts = [...f.options] as [string, string, string, string];
                      newOpts[i] = e.target.value;
                      setForm({ ...f, options: newOpts });
                    }}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]"
                    placeholder={`Option ${i + 1}`}
                  />
                </div>
              ))}
              <p className="text-xs text-gray-400">Sélectionnez la bonne réponse avec le bouton radio</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image (optionnel)</label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-[#FF6B00]/50 transition-colors cursor-pointer">
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Glisser une image ou cliquer pour uploader</p>
                <input type="text" value={f.image_url} onChange={(e) => setForm({ ...f, image_url: e.target.value })} className="w-full mt-2 px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]" placeholder="Ou entrer l'URL de l'image" />
              </div>
            </div>
          </div>
        );
      }
      case 'translation': {
        const f = form as TransForm;
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Langue source</label>
                <select value={f.source_lang} onChange={(e) => setForm({ ...f, source_lang: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]">
                  <option value="bambara">Bambara</option>
                  <option value="soninke">Soninké</option>
                  <option value="french">Français</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Langue cible</label>
                <select value={f.target_lang} onChange={(e) => setForm({ ...f, target_lang: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]">
                  <option value="french">Français</option>
                  <option value="bambara">Bambara</option>
                  <option value="soninke">Soninké</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Texte à traduire</label>
              <input type="text" value={f.prompt} onChange={(e) => setForm({ ...f, prompt: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Réponse correcte</label>
              <input type="text" value={f.correct_answer} onChange={(e) => setForm({ ...f, correct_answer: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Réponses acceptées (séparées par virgule)</label>
              <input type="text" value={f.accepted_answers} onChange={(e) => setForm({ ...f, accepted_answers: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]" placeholder="Bonjour, Salut, Hello" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Banque de mots (séparés par virgule)</label>
              <input type="text" value={f.word_bank} onChange={(e) => setForm({ ...f, word_bank: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]" placeholder="Bonjour, Au revoir, Merci" />
            </div>
          </div>
        );
      }
      case 'word_match': {
        const f = form as MatchForm;
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Paires de mots</label>
            <div className="space-y-2">
              {f.pairs.map((pair, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="text" value={pair.left} onChange={(e) => { const pairs = [...f.pairs]; pairs[i] = { ...pairs[i], left: e.target.value }; setForm({ ...f, pairs }); }} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]" placeholder="Mot source" />
                  <span className="text-gray-400 text-sm">&harr;</span>
                  <input type="text" value={pair.right} onChange={(e) => { const pairs = [...f.pairs]; pairs[i] = { ...pairs[i], right: e.target.value }; setForm({ ...f, pairs }); }} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]" placeholder="Traduction" />
                  {f.pairs.length > 2 && (
                    <button onClick={() => { const pairs = f.pairs.filter((_, j) => j !== i); setForm({ ...f, pairs }); }} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => setForm({ ...f, pairs: [...f.pairs, { left: '', right: '' }] })}
              className="text-sm text-[#FF6B00] hover:text-[#FF6B00]/80 font-medium"
            >
              + Ajouter une paire
            </button>
          </div>
        );
      }
      case 'fill_blank': {
        const f = form as FillForm;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phrase (les mots séparés par des espaces)</label>
              <input type="text" value={f.sentence} onChange={(e) => setForm({ ...f, sentence: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]" placeholder="I ___ ce" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Index du mot manquant (commence à 0)</label>
              <input type="number" value={f.blank_index} onChange={(e) => setForm({ ...f, blank_index: parseInt(e.target.value) || 0 })} min={0} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Options (séparées par virgule)</label>
              <input type="text" value={f.options} onChange={(e) => setForm({ ...f, options: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]" placeholder="ni, na, ka, ye" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Index réponse correcte (commence à 0)</label>
              <input type="number" value={f.correct_index} onChange={(e) => setForm({ ...f, correct_index: parseInt(e.target.value) || 0 })} min={0} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]" />
            </div>
          </div>
        );
      }
      case 'listen_choose': {
        const f = form as ListenForm;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL audio</label>
              <input type="text" value={f.audio_url} onChange={(e) => setForm({ ...f, audio_url: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]" placeholder="/audio/example.mp3" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transcription</label>
              <input type="text" value={f.transcript} onChange={(e) => setForm({ ...f, transcript: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Options (séparées par virgule)</label>
              <input type="text" value={f.options} onChange={(e) => setForm({ ...f, options: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]" placeholder="Bonjour, Au revoir, Merci, Pardon" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Index réponse correcte (commence à 0)</label>
              <input type="number" value={f.correct_index} onChange={(e) => setForm({ ...f, correct_index: parseInt(e.target.value) || 0 })} min={0} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]" />
            </div>
          </div>
        );
      }
      case 'word_order': {
        const f = form as OrderForm;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Consigne</label>
              <input type="text" value={f.prompt} onChange={(e) => setForm({ ...f, prompt: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]" placeholder='Construis la phrase : "..."' />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ordre correct (mots séparés par virgule)</label>
              <input type="text" value={f.correct_order} onChange={(e) => setForm({ ...f, correct_order: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]" placeholder="I, ni, ce" />
              <p className="text-xs text-gray-400 mt-1">L'ordre mélangé sera généré automatiquement</p>
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/admin/lessons" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#131516]">Exercices</h1>
          <p className="text-sm text-gray-500">{lessonTitle}</p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FF6B00] text-white rounded-lg text-sm font-medium hover:bg-[#FF6B00]/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouvel exercice
        </button>
      </div>

      {/* Exercise list */}
      <div className="space-y-3">
        {exercises.map((ex) => (
          <motion.div
            key={ex.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="text-gray-300 cursor-grab">
                <GripVertical className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-gray-400 w-6">{ex.order_index}</span>
              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${EXERCISE_TYPE_COLORS[ex.type]}`}>
                {EXERCISE_TYPE_LABELS[ex.type]}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#131516] truncate">
                  {ex.type === 'multiple_choice' && (ex.data as MultipleChoiceData).question}
                  {ex.type === 'translation' && (ex.data as TranslationData).prompt}
                  {ex.type === 'word_match' && `${(ex.data as WordMatchData).pairs.length} paires`}
                  {ex.type === 'fill_blank' && (ex.data as FillBlankData).sentence}
                  {ex.type === 'listen_choose' && (ex.data as ListenChooseData).transcript}
                  {ex.type === 'word_order' && (ex.data as WordOrderData).prompt}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPreviewId(previewId === ex.id ? null : ex.id)}
                  className={`p-1.5 rounded-lg hover:bg-gray-100 transition-colors ${previewId === ex.id ? 'text-[#FF6B00] bg-[#FF6B00]/10' : 'text-gray-500'}`}
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button onClick={() => openEdit(ex)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#FF6B00] transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => setDeleteId(ex.id)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Preview panel */}
            <AnimatePresence>
              {previewId === ex.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pt-1 ml-14 border-t border-gray-50">
                    <div className="bg-[#FFF3E0]/50 rounded-lg p-4 max-w-sm">
                      <p className="text-xs font-medium text-gray-400 mb-2 uppercase">Aperçu</p>
                      <ExercisePreview type={ex.type} data={ex.data} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
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
                  {editingId ? 'Modifier l\'exercice' : 'Nouvel exercice'}
                </h2>
                <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg hover:bg-gray-100">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Type selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type d'exercice</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(EXERCISE_TYPE_LABELS) as ExerciseType[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => handleTypeChange(t)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors border ${
                          selectedType === t
                            ? 'border-[#FF6B00] bg-[#FF6B00]/10 text-[#FF6B00]'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {EXERCISE_TYPE_LABELS[t]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic form */}
                {renderForm()}
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
              <h3 className="text-lg font-semibold text-[#131516] mb-2">Supprimer l'exercice ?</h3>
              <p className="text-sm text-gray-500 mb-6">Cette action est irréversible.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Annuler</button>
                <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">Supprimer</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
