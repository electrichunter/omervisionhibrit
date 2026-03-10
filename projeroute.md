# Proje Yol Haritası (Next.js + Supabase + Cloudinary + Netlify)

## Bölüm 1: MVP (Minimum Viable Product) - Çekirdek Sistem
Bu aşamanın amacı, projenin temel işlevlerini ayağa kaldırıp en kısa sürede yayına almaktır. Görsellikten çok çalışan bir sisteme odaklanılacaktır.

* **Faz 1: Altyapı ve Kurulum**
    * Next.js projesinin oluşturulması.
    * GitHub reposunun açılması ve Netlify'a bağlanması.
     
* **Faz 2: Veritabanı Mimarisi**
    * Supabase projesinin oluşturulması.
    * `posts` (blog yazıları) ve `projects` (portfolyo) tablolarının SQL şemalarının yazılması.
* **Faz 3: Medya Yönetimi Entegrasyonu**
    * Cloudinary hesabının açılması.
    * `app/api/upload/route.js` üzerinden görsel yükleme (WebP optimizasyonlu) API'sinin yazılması.
* **Faz 4: Kimlik Doğrulama (Auth)**
    * Supabase Auth ile yönetici (admin) girişinin sisteme entegre edilmesi.
    * Sadece yöneticinin erişebileceği `/admin` route'unun korunması (Middleware).
* **Faz 5: Yönetici Paneli - CRUD (Blog)**
    * Blog yazısı ekleme, silme, güncelleme formlarının oluşturulması.
    * Cloudinary görsel yükleme API'sinin bu forma bağlanması.
* **Faz 6: Yönetici Paneli - CRUD (Portfolyo)**
    * Portfolyo projelerinin sisteme girilmesi için gerekli form arayüzünün tamamlanması.
* **Faz 7: İstemci Arayüzü (Frontend) - Portfolyo**
    * Ana sayfa tasarımının kodlanması.
    * Supabase'den çekilen portfolyo verilerinin listelenmesi.
* **Faz 8: İstemci Arayüzü (Frontend) - Blog**
    * Blog listeleme sayfasının oluşturulması.
    * Dinamik yönlendirme (`/blog/[slug]`) ile tekil blog okuma sayfasının yapılması.
* **Faz 9: İçerik İşleyici**
    * Veritabanındaki metinlerin (Markdown veya Rich Text) frontend tarafında parse edilip düzgün okunabilir hale getirilmesi.
* **Faz 10: MVP Canlı Yayını**
    * Tüm çevre değişkenlerinin (Environment Variables) Netlify'a girilmesi.
    * Production build alınması ve hataların tespiti. Projenin kullanıma açılması.

---

## Bölüm 2: Tam Sürüm (Full Production) - Ölçeklendirme ve Güvenlik
Bu aşama, çalışan MVP'yi profesyonel bir ürüne dönüştürme adımlarını içerir.

* **Faz 11: SEO Mimarisi**
    * Dinamik sitemap.xml ve robots.txt oluşturulması.
    * Next.js Metadata API ile her blog yazısı için dinamik title, description ve OpenGraph etiketlerinin eklenmesi.
* **Faz 12: Performans Optimizasyonu (Caching)**
    * Next.js ISR (Incremental Static Regeneration) veya Cache stratejilerinin veritabanı sorgularına uygulanması.
* **Faz 13: Web Vitals İyileştirmeleri**
    * Lighthouse skorlarının 90+ seviyesine çekilmesi.
    * Gereksiz render işlemlerinin önlenmesi ve LCP (Largest Contentful Paint) sürelerinin düşürülmesi.
* **Faz 14: Ziyaretçi Etkileşimi**
    * Blog yazıları için yorum sisteminin Supabase üzerinde ilişkisel tablo (`comments`) kurularak entegre edilmesi.
* **Faz 15: Analitik Entegrasyonu**
    * Kullanıcı trafiğini izlemek için hafif bir analitik aracının (Google Analytics veya Umami) sisteme eklenmesi.
* **Faz 16: Güvenlik Sıkılaştırması (RLS)**
    * Supabase üzerinde Row Level Security (RLS) politikalarının yazılması ve veritabanına yetkisiz müdahalelerin tamamen engellenmesi.
* **Faz 17: API Güvenliği ve Rate Limiting**
    * Dışarıya açık endpoint'lere siber saldırıları (Brute force, DDoS) yavaşlatmak için Rate Limiting (istek sınırlaması) uygulanması.
* **Faz 18: Karanlık Mod ve UI/UX Cilası**
    * Sistem geneli Dark/Light mode entegrasyonu.
    * Framer Motion veya CSS ile mikro etkileşimlerin/animasyonların eklenmesi.
* **Faz 19: Otomasyon ve Yedekleme**
    * Supabase veritabanı yedekleme stratejisinin belirlenmesi.
* **Faz 20: Final Yayın ve Güvenlik Denetimi**
    * Sistemin tam kapasite yayına alınması.
    * Planlanan sızma testinin (penetration test) bu aşamada projeye uygulanıp açıkların raporlanması.