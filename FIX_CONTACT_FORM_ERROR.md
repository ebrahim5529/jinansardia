# إصلاح خطأ نموذج الاتصال

## المشكلة
عند إرسال نموذج الاتصال، يظهر الخطأ: "فشل إرسال الرسالة. يرجى المحاولة مرة أخرى."

## الأسباب المحتملة والحلول

### 1. Migration لم يتم تشغيله (الأكثر احتمالاً)

**المشكلة**: الجدول `ContactSubmission` غير موجود في قاعدة البيانات.

**الحل**:
```bash
# في مجلد المشروع
npx prisma migrate dev --name add_website_settings_and_contact_submissions
npx prisma generate
```

**التحقق**:
```bash
npx prisma migrate status
```
يجب أن يظهر أن جميع migrations تم تطبيقها.

### 2. Prisma Client لم يتم إنشاؤه

**المشكلة**: Prisma Client لا يحتوي على نموذج `ContactSubmission`.

**الحل**:
```bash
npx prisma generate
```

### 3. مشكلة في الاتصال بقاعدة البيانات

**المشكلة**: `DATABASE_URL` غير صحيح أو قاعدة البيانات غير متاحة.

**الحل**:
1. تحقق من ملف `.env`:
   ```env
   DATABASE_URL="mysql://user:password@localhost:3306/database_name"
   ```

2. اختبر الاتصال:
   ```bash
   npx prisma db pull
   ```

3. تحقق من أن قاعدة البيانات تعمل

### 4. الجدول موجود لكن Prisma Client قديم

**الحل**:
```bash
# إعادة إنشاء Prisma Client
npx prisma generate

# أو إعادة تشغيل السيرفر
# Ctrl+C ثم npm run dev
```

## خطوات الإصلاح الكاملة

### الخطوة 1: تحقق من Migration
```bash
npx prisma migrate status
```

إذا كان هناك migrations معلقة:
```bash
npx prisma migrate dev
```

### الخطوة 2: إنشاء Prisma Client
```bash
npx prisma generate
```

### الخطوة 3: التحقق من قاعدة البيانات
```bash
npx prisma studio
```

افتح جدول `ContactSubmission` وتحقق من:
- أن الجدول موجود
- أن الحقول موجودة

### الخطوة 4: إعادة تشغيل السيرفر
```bash
# أوقف السيرفر (Ctrl+C)
npm run dev
```

### الخطوة 5: اختبار مرة أخرى
1. اذهب إلى: `http://localhost:3000/contact`
2. املأ النموذج وأرسله
3. تحقق من Console للأخطاء

## فحص الأخطاء في Terminal

عند إرسال النموذج، تحقق من Terminal (حيث يعمل `npm run dev`) لرؤية:
- رسائل console.error
- Prisma error codes
- تفاصيل الخطأ

## الأخطاء الشائعة ورمزها

- **P1001**: لا يمكن الاتصال بقاعدة البيانات
- **P2002**: السجل موجود بالفعل (unique constraint)
- **P2025**: السجل غير موجود
- **Unknown model**: Prisma Client لم يتم إنشاؤه أو قديم

## إذا استمرت المشكلة

1. **تحقق من Terminal**:
   - ابحث عن رسائل الخطأ الكاملة
   - ابحث عن Prisma error codes

2. **تحقق من Console في المتصفح**:
   - افتح Developer Tools (F12)
   - اذهب إلى Console
   - ابحث عن تفاصيل الخطأ

3. **تحقق من Network**:
   - افتح Developer Tools (F12)
   - اذهب إلى Network
   - ابحث عن `/api/contact/submit`
   - انقر عليه وافتح Response
   - ابحث عن `details` أو `code` في الرد

4. **تحقق من Prisma Schema**:
   - تأكد من أن `ContactSubmission` موجود في `prisma/schema.prisma`
   - تأكد من أن الحقول صحيحة

## بعد الإصلاح

بعد تطبيق الحلول:
1. أعد تشغيل السيرفر
2. اختبر إرسال النموذج
3. تحقق من قاعدة البيانات باستخدام Prisma Studio
