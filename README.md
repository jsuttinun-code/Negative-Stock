# CPAXTRA · Negative Stock Checker

เว็บแอปตรวจสอบสินค้าติดลบ (ทำงานในเบราว์เซอร์ทั้งหมด ไม่ต้องมี server)

- Import ไฟล์ Item List (.xlsx/.xls/.csv) ได้หลายไฟล์
- เก็บเฉพาะรายการที่ ASOH หรือ USOH ติดลบ · ไม่นำ Pack Size เข้ามา
- กรองตาม สาขา / Division / Dept / Buyer / Class / Status / Source / ช่วงยอดติดลบ / ค้นหา
- Division แมปจาก Dept (Fresh 1-5, Dry 6-10, Premium 21-24, Non food 31-46)
- ส่งออก CSV / Excel ตามตัวกรองที่เลือก

## ใช้งาน
เปิด `index.html` หรือเปิดผ่าน GitHub Pages (Settings → Pages → Deploy from branch → main / root)

## ให้ทุกเครื่องเห็นข้อมูลเดียวกัน (Vercel + Upstash Redis)
1. อัปโหลดโฟลเดอร์ `api/` (ไฟล์ `api/data.js`) ขึ้น GitHub ที่ราก repo
2. Vercel → โปรเจกต์ → Storage → Create Database → Upstash Redis (Free) → Connect to Project
3. Settings → Environment Variables → เพิ่ม `APP_PASSWORD` = รหัสผ่านที่ต้องการ
4. Deployments → Redeploy
