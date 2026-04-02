-- Kan Sira - Initial Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Exercise type enum
CREATE TYPE exercise_type AS ENUM (
  'multiple_choice',
  'translation',
  'word_match',
  'fill_blank',
  'listen_choose',
  'word_order'
);

-- Languages table
CREATE TABLE languages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  native_name TEXT NOT NULL,
  flag TEXT NOT NULL DEFAULT '🇲🇱',
  is_active BOOLEAN NOT NULL DEFAULT true
);

INSERT INTO languages (id, name, native_name, flag) VALUES
  ('bm', 'Bambara', 'Bamanankan', '🇲🇱'),
  ('snk', 'Soninké', 'Sooninkanxanne', '🇲🇱');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  preferred_lang TEXT NOT NULL DEFAULT 'bm' REFERENCES languages(id),
  daily_goal INTEGER NOT NULL DEFAULT 20,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Modules table
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  language_id TEXT NOT NULL REFERENCES languages(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT '📚',
  order_index INTEGER NOT NULL DEFAULT 0,
  is_free BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Lessons table
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  xp_reward INTEGER NOT NULL DEFAULT 10,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Exercises table
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  type exercise_type NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User progress
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  perfect BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User XP
CREATE TABLE user_xp (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User streaks
CREATE TABLE user_streaks (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Badge definitions
CREATE TABLE badge_definitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '🏅',
  condition JSONB NOT NULL DEFAULT '{}',
  is_premium BOOLEAN NOT NULL DEFAULT false
);

-- User badges
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badge_definitions(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Indexes
CREATE INDEX idx_modules_language ON modules(language_id, order_index);
CREATE INDEX idx_lessons_module ON lessons(module_id, order_index);
CREATE INDEX idx_exercises_lesson ON exercises(lesson_id, order_index);
CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_user_progress_lesson ON user_progress(lesson_id);
CREATE INDEX idx_user_badges_user ON user_badges(user_id);

-- Trigger: auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));

  INSERT INTO user_xp (user_id) VALUES (NEW.id);
  INSERT INTO user_streaks (user_id) VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Trigger: update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER user_xp_updated_at
  BEFORE UPDATE ON user_xp
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER user_streaks_updated_at
  BEFORE UPDATE ON user_streaks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS Policies

-- Languages: public read
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Languages are viewable by everyone" ON languages FOR SELECT USING (true);
CREATE POLICY "Languages are editable by admins" ON languages FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Profiles: own read/write, admin full
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can update all profiles" ON profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Modules: public read published, admin full
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published modules are viewable" ON modules FOR SELECT USING (is_published = true);
CREATE POLICY "Admins full access modules" ON modules FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Lessons: public read (via published module), admin full
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lessons viewable via published modules" ON lessons FOR SELECT USING (
  EXISTS (SELECT 1 FROM modules WHERE modules.id = lessons.module_id AND modules.is_published = true)
);
CREATE POLICY "Admins full access lessons" ON lessons FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Exercises: public read, admin full
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Exercises viewable via published modules" ON exercises FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM lessons
    JOIN modules ON modules.id = lessons.module_id
    WHERE lessons.id = exercises.lesson_id AND modules.is_published = true
  )
);
CREATE POLICY "Admins full access exercises" ON exercises FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- User progress: own read/write
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own progress" ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all progress" ON user_progress FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- User XP: own read/write
ALTER TABLE user_xp ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own xp" ON user_xp FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own xp" ON user_xp FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own xp" ON user_xp FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User streaks: own read/write
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own streaks" ON user_streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own streaks" ON user_streaks FOR UPDATE USING (auth.uid() = user_id);

-- Badge definitions: public read
ALTER TABLE badge_definitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Badges viewable by everyone" ON badge_definitions FOR SELECT USING (true);
CREATE POLICY "Admins full access badges" ON badge_definitions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- User badges: own read/write
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own badges" ON user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own badges" ON user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert default badge definitions
INSERT INTO badge_definitions (name, description, icon, condition) VALUES
  ('Premier pas', 'Complétez votre première leçon', '👣', '{"type": "lessons_completed", "count": 1}'),
  ('Assidu', 'Maintenez une série de 7 jours', '🔥', '{"type": "streak", "days": 7}'),
  ('Savant', 'Accumulez 1000 XP', '🧠', '{"type": "total_xp", "amount": 1000}'),
  ('Parfait', 'Obtenez 100% sur 10 leçons', '⭐', '{"type": "perfect_lessons", "count": 10}'),
  ('Bilingue', 'Complétez une leçon dans chaque langue', '🌍', '{"type": "both_languages"}'),
  ('Maître', 'Terminez un module complet', '🎓', '{"type": "module_completed"}'),
  ('Explorateur', 'Essayez tous les types d''exercices', '🗺️', '{"type": "all_exercise_types"}'),
  ('Marathon', 'Maintenez une série de 30 jours', '🏃', '{"type": "streak", "days": 30}'),
  ('Érudit', 'Accumulez 5000 XP', '📖', '{"type": "total_xp", "amount": 5000}'),
  ('Légende', 'Accumulez 10000 XP', '👑', '{"type": "total_xp", "amount": 10000}');
