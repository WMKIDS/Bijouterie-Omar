-- تفعيل حزم التحقق لإنشاء معرفات UUID آمنة ومقاومة للتخمين
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- إنشاء أنواع البيانات المخصصة (Custom Enums) لضمان اتساق المدخلات
CREATE TYPE jewelry_category AS ENUM ('خواتم', 'قلادات', 'أساور', 'أقراط');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'shipped', 'cancelled');

-- جدول المنتجات (Products Table)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(50) UNIQUE NOT NULL, -- معرف فريد لإدارة المخزون
    name VARCHAR(255) NOT NULL,
    category jewelry_category NOT NULL,
    price DECIMAL(12, 2) NOT NULL CHECK (price >= 0),
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    image_url TEXT NOT NULL,
    details JSONB, -- لتخزين المواصفات الفنية الإضافية (مثل عيار الذهب، نوع الأحجار، شهادة GIA)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- إنشاء فهارس (Indexes) لضمان سرعة الاستعلام العالية مع زيادة حجم البيانات
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_sku ON products(sku);

-- جدول تتبع وإحصائيات الطلبات الصادرة عبر الواتساب (WhatsApp Orders Tracking)
CREATE TABLE whatsapp_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_phone VARCHAR(20) NOT NULL,
    order_items JSONB NOT NULL, -- لقطة كاملة للسلة والأسعار وقت تنفيذ الطلب لمنع الاحتيال اللاحق
    total_amount DECIMAL(12, 2) NOT NULL CHECK (total_amount >= 0),
    status order_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
