# Sistem Mimarisi ve Mantık (OMERVISION_HIBRIT)

Bu doküman projenin (Next.js + Supabase + Cloudinary) çalışma mantığını farklı bağlamlarda açıklar.

## 1. Frontend (İstemci) Mantığı
Frontend React 19 ve Next.js (App Router) üzerine inşa edilmiştir. Temel prensipler:
- **Server Components (RSC):** Veri çekme işlemleri çoğunlukla sunucu bileşenlerinde (`page.tsx`) yapılarak istemciye gereksiz JavaScript yüklenmesinin önüne geçilir.
- **Client Components (`'use client'`):** Etkileşim gerektiren (butonlara basılması, form durumunun yönetilmesi, BlockNote zengin metin editörü) bileşenler için kullanılır.
- **Global Stil ve Tema:** Tailwind CSS (`app/globals.css`) kullanılarak `zinc` ve `neutral` skalasında, karanlık mod (dark/minimalist) ağırlıklı bir estetik hedeflenmiştir (Vercel tasarımı örnek alınarak).
- **Yönetici Paneli (Admin):** Supabase Auth aracılığıyla korunan `/admin` rotaları, sadece yetkili oturumlara içeriği değiştirebilme hakkı tanır.

## 2. Backend (Sunucu) Mantığı
Tam teşekküllü geleneksel bir Node.js veya Python backend'i yerine sunucusuz (Serverless) mimari benimsenmiştir:
- **Next.js Route Handlers (`app/api/...`):** Özel API uçları oluşturmak için kullanılır (örneğin Cloudinary görsel yüklemeleri için `app/api/upload/route.ts`).
- **Server Actions (`actions.ts`):** Form gönderimlerini veya veritabanı yazma/silme işlemlerini (örneğin yorum eklemek `addComment`) doğrudan Next.js sunucusunda işler. API endpoint yazma zahmetini ortadan kaldırır.
- **Supabase BaaS:** Ana "backend" veritabanı (PostgreSQL) ve kimlik doğrulaması (Auth) için Supabase kullanılır. Tüm tablolar, ilişkiler ve oturumlar burada tutulur.

## 3. Siber Güvenlik (Cyber) Mantığı
Uygulamayı yetkisiz erişimlerden ve web saldırılarından korumaya yönelik alınan temel önlemler:
- **Kimlik Doğrulama:** Supabase'in entegre JWT tabanlı Auth sistemi kullanılır. Sadece geçerli bir oturumu (Session) olan kullanıcılar (Admin) paneli açabilir. Middleware (`middleware.ts`), her istekte bu oturumu denetler.
- **Row Level Security (RLS):** Supabase veritabanındaki tablolara (`posts`, `projects`) erişimi kısıtlayan en kritik veritabanı seviyesi savunmasıdır. Yanlışlıkla bir API açık kalsa bile, RLS admin olmayan kimsenin `INSERT`, `UPDATE`, `DELETE` işlemlerini yapmasına izin vermez (**Sıfır Güven - Zero Trust ilkesi**).
- **Rate Limiting (İstek Sınırlandırma):** Blog yorumları ve görsel yükleme API'leri gibi uçlara kötü amaçlı veya script tabanlı yoğun isteklerin (DDoS, spam) atılmasını yavaşlatmak için bellek içi (In-memory) Rate Limiting sistemi uygulanır. 

## 4. IoT (Nesnelerin İnterneti) Entegrasyon Mantığı
Şu an pasif durumda olsa da, projenin "hibrit" yapısı IoT entegrasyonuna genişletilebilecek şekilde kurgulanmıştır:
- **Cihazlardan Veri Akışı:** Next.js Route Handlers ile `/api/iot-webhook` gibi endpoint'ler oluşturularak ESP32 veya Raspberry Pi gibi donanımlardan sensör verisi alınabilir.
- **Supabase Realtime:** Sensör verisi (örneğin oda sıcaklığı, alarm durumu) Supabase'e yazıldığında, Realtime (PostgreSQL Listen/Notify) özellikleri ile bağlı istemcilere WebSocket üzerinden anında iletilip UI dinamik olarak güncellenebilir.
- **Güvenlik (IoT İçin):** IoT cihazlarından gelen istekler, sabit API anahtarları (API Keys) veya cihaz bazlı JWT token'ları kullanılarak Rate Limiter arkasında yetkilendirilmelidir.
