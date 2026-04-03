import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { StoryCard } from '../components/stories/StoryCard'
import { mockStories } from '../data/mockStories'

export default function StoriesPage() {
  const navigate = useNavigate()

  return (
    <div className="px-5 pb-32 pt-2">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <BookOpen size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-dark">Histoires</h1>
            <p className="text-sm text-dark/50">Lis et apprends avec des histoires interactives</p>
          </div>
        </div>
      </motion.div>

      {/* Stories grid */}
      <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {mockStories.map((story, index) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StoryCard
              story={story}
              onTap={() => navigate(`/app/story/${story.id}`)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
