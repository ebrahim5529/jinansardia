# إصلاح خطأ EPERM في Prisma

## المشكلة
```
EPERM: operation not permitted, rename '...query_engine-windows.dll.node.tmp...'
```

هذا الخطأ يحدث لأن Prisma Client يحاول تحديث ملفات بينما السيرفر يستخدمها.

## الحل السريع

### الطريقة 1: إيقاف السيرفر أولاً (الأفضل)

1. **أوقف السيرفر**:
   - في Terminal الذي يعمل فيه `npm run dev`
   - اضغط `Ctrl+C` لإيقافه

2. **شغّل Prisma Generate**:
   ```bash
   npx prisma generate
   ```

3. **شغّل Migration** (إذا لم يتم تشغيله):
   ```bash
   npx prisma migrate dev --name add_website_settings_and_contact_submissions
   ```

4. **أعد تشغيل السيرفر**:
   ```bash
   npm run dev
   ```

### الطريقة 2: استخدام PowerShell كمسؤول

1. **أغلق جميع Terminals**
2. **افتح PowerShell كمسؤول**:
   - اضغط `Win + X`
   - اختر "Windows PowerShell (Admin)" أو "Terminal (Admin)"
3. **انتقل لمجلد المشروع**:
   ```powershell
   cd "E:\Nextjs-Project\JinanSardia ‎"
   ```
4. **شغّل الأوامر**:
   ```powershell
   npx prisma generate
   npx prisma migrate dev --name add_website_settings_and_contact_submissions
   ```

### الطريقة 3: حذف node_modules/.prisma وإعادة الإنشاء

إذا استمرت المشكلة:

1. **أوقف السيرفر** (Ctrl+C)

2. **احذف مجلد .prisma**:
   ```powershell
   Remove-Item -Recurse -Force "node_modules\.prisma"
   ```

3. **أعد إنشاء Prisma Client**:
   ```powershell
   npx prisma generate
   ```

4. **شغّل Migration**:
   ```powershell
   npx prisma migrate dev --name add_website_settings_and_contact_submissions
   ```

5. **أعد تشغيل السيرفر**:
   ```powershell
   npm run dev
   ```

## خطوات كاملة للإصلاح

### 1. أوقف السيرفر
في Terminal الذي يعمل فيه `npm run dev`:
- اضغط `Ctrl+C`
- انتظر حتى يتوقف تماماً

### 2. شغّل Migration
```powershell
npx prisma migrate dev --name add_website_settings_and_contact_submissions
```

### 3. أنشئ Prisma Client
```powershell
npx prisma generate
```

### 4. تحقق من النجاح
يجب أن ترى:
```
✔ Generated Prisma Client
```

### 5. أعد تشغيل السيرفر
```powershell
npm run dev
```

### 6. اختبر النموذج
- اذهب إلى: `http://localhost:3000/contact`
- املأ النموذج وأرسله
- يجب أن يعمل الآن!

## نصائح إضافية

### إذا استمرت المشكلة:

1. **أغلق جميع Terminals و VS Code**
2. **افتح PowerShell كمسؤول**
3. **انتقل للمجلد وشغّل الأوامر**

### للتحقق من أن Migration تم:

```powershell
npx prisma migrate status
```

يجب أن يظهر:
```
Database schema is up to date!
```

### للتحقق من Prisma Client:

```powershell
npx prisma studio
```

يجب أن يفتح Prisma Studio وترى جدول `ContactSubmission`.

## ملاحظات

- **مهم**: دائماً أوقف السيرفر قبل تشغيل `npx prisma generate`
- إذا كان السيرفر يعمل في Terminal منفصل، أوقفه أولاً
- في Windows، قد تحتاج صلاحيات مسؤول أحياناً
