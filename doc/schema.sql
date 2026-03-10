-- ==========================================
-- ÖMERVISION HİBRİT - SUPABASE FULL SCHEMA
-- ==========================================

-- 1. `posts` (Blog Yazıları) Tablosu
CREATE TABLE IF NOT EXISTS posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text NOT NULL,
  cover_image text,
  published boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. `projects` (Portfolyo Projeleri) Tablosu
CREATE TABLE IF NOT EXISTS projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL,
  content text, 
  image_url text,
  project_url text,
  github_url text,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. `comments` (Blog Yorumları) Tablosu
CREATE TABLE IF NOT EXISTS comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  content text NOT NULL,
  approved boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- GÜVENLİK VE RLS (Row Level Security) KURALLARI
-- ==========================================

-- Tablolar için RLS'yi aktifleştir
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Posts (Blog) Politikaları
-- Yöneticiler (Authenticated user) her şeyi yapabilir, ziyaretçiler (anon) sadece published=true yazıları görebilir.
CREATE POLICY "Public profiles are viewable by everyone." ON posts FOR SELECT USING (published = true);
CREATE POLICY "Admin can do all on posts" ON posts TO authenticated USING (true) WITH CHECK (true);

-- Projects (Portfolyo) Politikaları
-- Ziyaretçiler tüm projeleri görebilir, sadece admin düzenleyebilir.
CREATE POLICY "Public projects are viewable by everyone." ON projects FOR SELECT USING (true);
CREATE POLICY "Admin can do all on projects" ON projects TO authenticated USING (true) WITH CHECK (true);

-- Comments (Yorumlar) Politikaları
-- Herkes onaylanmış yorumları görebilir
CREATE POLICY "Public comments are viewable by everyone." ON comments FOR SELECT USING (approved = true);
-- Herkes (ziyaretçiler dahil) yorum ekleyebilir
CREATE POLICY "Anyone can insert a comment." ON comments FOR INSERT WITH CHECK (true);
-- Adminler yorumları silebilir/güncelleyebilir
CREATE POLICY "Admin can manage comments" ON comments TO authenticated USING (true) WITH CHECK (true);
