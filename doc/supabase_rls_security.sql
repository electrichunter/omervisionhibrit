-- ==============================================================================
-- 1. BÖLÜM: MEVCUT TABLOLARIN GÜVENLİĞİ (Blog, Proje ve Yorumlar)
-- ==============================================================================
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Eski kuralları temizle
DROP POLICY IF EXISTS "Enable read access for all" ON public.posts;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.posts;
DROP POLICY IF EXISTS "Enable update for auth users" ON public.posts;
DROP POLICY IF EXISTS "Enable delete for auth users" ON public.posts;
DROP POLICY IF EXISTS "Enable read access for all projects" ON public.projects;
DROP POLICY IF EXISTS "Enable insert for authenticated users only projects" ON public.projects;
DROP POLICY IF EXISTS "Enable update for auth users projects" ON public.projects;
DROP POLICY IF EXISTS "Enable delete for auth users projects" ON public.projects;
DROP POLICY IF EXISTS "Enable read access to public comments" ON public.comments;
DROP POLICY IF EXISTS "Enable insert for all comments" ON public.comments;
DROP POLICY IF EXISTS "Enable update for auth users comments" ON public.comments;
DROP POLICY IF EXISTS "Enable delete for auth users comments" ON public.comments;

-- Posts (Blog) Kuralları
CREATE POLICY "Public can read posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Admin can insert posts" ON public.posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin can update posts" ON public.posts FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin can delete posts" ON public.posts FOR DELETE USING (auth.role() = 'authenticated');

-- Projects (Portfolyo) Kuralları
CREATE POLICY "Public can read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Admin can insert projects" ON public.projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin can update projects" ON public.projects FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin can delete projects" ON public.projects FOR DELETE USING (auth.role() = 'authenticated');

-- Comments (Yorumlar) Kuralları
CREATE POLICY "Public can read comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Public can insert comments" ON public.comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can update comments" ON public.comments FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin can delete comments" ON public.comments FOR DELETE USING (auth.role() = 'authenticated');


-- ==============================================================================
-- 2. BÖLÜM: YENİ E-BÜLTEN (NEWSLETTER) TABLOSU VE GÜVENLİĞİ
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tablo RLS'i aktifleştir
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Olası eski kuralları temizle
DROP POLICY IF EXISTS "Public can insert subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "Admin can read subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "Admin can update subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "Admin can delete subscribers" ON public.subscribers;

-- Newsletter Kuralları
-- Ziyaretçiler sadece e-posta adresi kaydedebilir
CREATE POLICY "Public can insert subscribers" ON public.subscribers FOR INSERT WITH CHECK (true);

-- Verileri sadece yönetici görebilir, düzenleyebilir veya silebilir
CREATE POLICY "Admin can read subscribers" ON public.subscribers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can update subscribers" ON public.subscribers FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin can delete subscribers" ON public.subscribers FOR DELETE USING (auth.role() = 'authenticated');
