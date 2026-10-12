-- HeritageLens — Row Level Security

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE heritage_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE heritage_timelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE heritage_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE reconstructions ENABLE ROW LEVEL SECURITY;
ALTER TABLE nearby_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;

-- Public reads
CREATE POLICY "public read sites" ON heritage_sites FOR SELECT USING (verification_status IN ('verified','partial','interpretive'));
CREATE POLICY "public read timelines" ON heritage_timelines FOR SELECT USING (true);
CREATE POLICY "public read artifacts" ON artifacts FOR SELECT USING (true);
CREATE POLICY "public read sources" ON heritage_sources FOR SELECT USING (true);
CREATE POLICY "public read recons" ON reconstructions FOR SELECT USING (true);
CREATE POLICY "public read nearby" ON nearby_places FOR SELECT USING (true);
CREATE POLICY "public read quizzes" ON quizzes FOR SELECT USING (true);
CREATE POLICY "public read questions" ON quiz_questions FOR SELECT USING (true);
CREATE POLICY "public read options" ON quiz_options FOR SELECT USING (true);
CREATE POLICY "public read badges" ON badges FOR SELECT USING (true);
CREATE POLICY "public read approved stories" ON stories FOR SELECT USING (verification_status IN ('verified','partial'));

-- Profiles
CREATE POLICY "profiles public read" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles own insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "profiles own update" ON profiles FOR UPDATE USING (auth.uid() = user_id);

-- Favorites
CREATE POLICY "favorites own" ON favorites USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Visits
CREATE POLICY "visits own insert" ON visits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "visits own read" ON visits FOR SELECT USING (auth.uid() = user_id);

-- Quiz attempts
CREATE POLICY "attempts own" ON quiz_attempts USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- User badges
CREATE POLICY "user_badges own read" ON user_badges FOR SELECT USING (auth.uid() = user_id);

-- Contributions
CREATE POLICY "contrib own insert" ON contributions FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "contrib approved read" ON contributions FOR SELECT USING (auth.uid() = user_id OR status = 'approved');
CREATE POLICY "contrib admin read" ON contributions FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role IN ('admin','expert')));
CREATE POLICY "contrib admin update" ON contributions FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role IN ('admin','expert')));

-- Admin full access to sites
CREATE POLICY "admin sites" ON heritage_sites USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role IN ('admin','expert')));
