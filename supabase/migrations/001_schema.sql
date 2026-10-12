-- HeritageLens — Supabase Schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'visitor' CHECK (role IN ('visitor','student','contributor','expert','admin')),
  preferred_language TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Heritage Sites
CREATE TABLE heritage_sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en TEXT NOT NULL, name_ta TEXT,
  slug TEXT NOT NULL UNIQUE,
  description_en TEXT, description_ta TEXT,
  history_en TEXT, history_ta TEXT,
  location_name TEXT NOT NULL,
  latitude DECIMAL(10,7) NOT NULL, longitude DECIMAL(10,7) NOT NULL,
  heritage_type TEXT NOT NULL,
  historical_period TEXT, construction_date TEXT,
  builder TEXT, dynasty TEXT, current_condition TEXT,
  preservation_status TEXT NOT NULL DEFAULT 'good',
  featured_image TEXT,
  ar_available BOOLEAN DEFAULT FALSE,
  model_available BOOLEAN DEFAULT FALSE,
  is_unesco BOOLEAN DEFAULT FALSE,
  verification_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX ON heritage_sites(slug);

-- Timelines
CREATE TABLE heritage_timelines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  heritage_site_id UUID REFERENCES heritage_sites(id) ON DELETE CASCADE NOT NULL,
  year_label TEXT NOT NULL,
  title_en TEXT NOT NULL, title_ta TEXT,
  description_en TEXT, description_ta TEXT,
  sort_order INTEGER DEFAULT 0
);

-- Artifacts
CREATE TABLE artifacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  heritage_site_id UUID REFERENCES heritage_sites(id) ON DELETE CASCADE NOT NULL,
  name_en TEXT NOT NULL, name_ta TEXT,
  description_en TEXT, description_ta TEXT,
  image_url TEXT, model_url TEXT,
  historical_period TEXT, source_reference TEXT
);

-- Stories
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  heritage_site_id UUID REFERENCES heritage_sites(id) ON DELETE CASCADE NOT NULL,
  title_en TEXT NOT NULL, title_ta TEXT,
  content_en TEXT, content_ta TEXT,
  audio_en_url TEXT, audio_ta_url TEXT,
  verification_status TEXT DEFAULT 'pending',
  author TEXT
);

-- Sources
CREATE TABLE heritage_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  heritage_site_id UUID REFERENCES heritage_sites(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL, source_type TEXT,
  url TEXT, citation TEXT, publisher TEXT, year TEXT
);

-- Reconstructions
CREATE TABLE reconstructions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  heritage_site_id UUID REFERENCES heritage_sites(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL, model_url TEXT, thumbnail_url TEXT,
  period TEXT, confidence_level TEXT NOT NULL DEFAULT 'medium',
  evidence_summary TEXT, method TEXT,
  verification_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Nearby Places
CREATE TABLE nearby_places (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  heritage_site_id UUID REFERENCES heritage_sites(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL, category TEXT,
  latitude DECIMAL(10,7), longitude DECIMAL(10,7),
  distance DECIMAL(8,2), description TEXT,
  image_url TEXT, opening_info TEXT
);

-- Quizzes
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  heritage_site_id UUID REFERENCES heritage_sites(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL, description TEXT
);

CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL, question_ta TEXT,
  question_type TEXT NOT NULL DEFAULT 'multiple_choice',
  explanation TEXT, sort_order INTEGER DEFAULT 0
);

CREATE TABLE quiz_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID REFERENCES quiz_questions(id) ON DELETE CASCADE NOT NULL,
  option_text TEXT NOT NULL, option_text_ta TEXT,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE
);

-- Badges
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL, description TEXT, icon TEXT, color TEXT
);

-- Favorites, Visits, Badges, Attempts
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  heritage_site_id UUID REFERENCES heritage_sites(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, heritage_site_id)
);

CREATE TABLE visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  heritage_site_id UUID REFERENCES heritage_sites(id) ON DELETE CASCADE NOT NULL,
  visited_at TIMESTAMPTZ DEFAULT NOW(),
  method TEXT DEFAULT 'virtual'
);

CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contributions
CREATE TABLE contributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  heritage_site_id UUID REFERENCES heritage_sites(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL, description TEXT,
  location TEXT, language TEXT DEFAULT 'en',
  source_reference TEXT, media_urls TEXT[],
  status TEXT NOT NULL DEFAULT 'pending',
  reviewer_id UUID REFERENCES auth.users(id),
  review_notes TEXT, contributor_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (user_id, name, role, preferred_language)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)), COALESCE(NEW.raw_user_meta_data->>'role','visitor'), 'en');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();
