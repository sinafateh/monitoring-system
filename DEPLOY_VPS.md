# راهنمای استقرار روی VPS

## پیش‌نیازها

- Ubuntu 22.04 یا 24.04
- Node.js مطابق engines داخل package.json
- PostgreSQL 14 یا بالاتر
- Nginx و PM2
- دامنه‌ای که رکورد A آن به IP سرور اشاره کند

## نصب و ساخت پروژه

~~~bash
sudo apt update
sudo apt install -y nginx postgresql postgresql-contrib
sudo npm install -g pm2

sudo mkdir -p /var/www/monitoring-system
sudo chown -R $USER:$USER /var/www/monitoring-system
cd /var/www/monitoring-system
git clone YOUR_REPOSITORY_URL .
npm ci
npm run build
~~~

## ساخت دیتابیس

~~~bash
sudo -u postgres psql
CREATE USER monitoring_app WITH ENCRYPTED PASSWORD 'CHANGE_THIS_PASSWORD';
CREATE DATABASE monitoring_system OWNER monitoring_app;
\\q

psql "postgresql://monitoring_app:CHANGE_THIS_PASSWORD@localhost:5432/monitoring_system" -f server/schema.sql
~~~

## تنظیم محیط اجرا

~~~bash
cp .env.example .env
nano .env
~~~

در فایل .env مقدار DATABASE_URL را با رمز واقعی production تنظیم کن. فایل .env نباید commit یا عمومی شود.

## اجرای سرویس

~~~bash
pm2 start deploy/ecosystem.config.cjs
pm2 save
pm2 startup
~~~

## اتصال Nginx و SSL

فایل deploy/nginx.conf.example را با دامنه‌ی واقعی جایگزین کن و در Nginx فعال کن:

~~~bash
sudo cp deploy/nginx.conf.example /etc/nginx/sites-available/monitoring-system
sudo ln -s /etc/nginx/sites-available/monitoring-system /etc/nginx/sites-enabled/monitoring-system
sudo nginx -t
sudo systemctl reload nginx
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.ir -d www.your-domain.ir
~~~

## تست نهایی

~~~bash
curl https://your-domain.ir/api/health
pm2 status
pm2 logs monitoring-system
~~~

باید پاسخ health شامل ok: true و database: connected باشد.
npm run build فایل‌های فرانت‌اند را داخل dist می‌سازد و Express همان پوشه را روی دامنه سرو می‌کند.
server/schema.sql را فقط برای ساخت جدول‌های لازم روی دیتابیس production اجرا کن.
.env را روی سرور بساز و داخل Git قرار نده.
