# إصلاح سريع لمشكلة Prisma

## الطريقة السريعة (الأفضل)

### 1. أوقف السيرفر
في Terminal الذي يعمل فيه `npm run dev`:
- اضغط `Ctrl+C`

### 2. شغّل الأمر التالي:
```powershell
npm run prisma:fix
```

هذا الأمر سيقوم بـ:
- حذف مجلد `.prisma` القديم
- إنشاء Prisma Client من جديد
- تشغيل Migration

### 3. أعد تشغيل السيرفر:
```powershell
npm run dev
```

## الطريقة اليدوية

إذا لم تعمل الطريقة السريعة:

### 1. أوقف السيرفر (Ctrl+C)

### 2. احذف مجلد .prisma:
```powershell
Remove-Item -Recurse -Force "node_modules\.prisma" -ErrorAction SilentlyContinue
```

### 3. أنشئ Prisma Client:
```powershell
npm run prisma:generate
```

### 4. شغّل Migration:
```powershell
npm run prisma:migrate
```

### 5. أعد تشغيل السيرفر:
```powershell
npm run dev
```

## استخدام Script PowerShell

يمكنك أيضاً استخدام الملف `fix-prisma.ps1`:

```powershell
.\fix-prisma.ps1
```

## بعد الإصلاح

1. ✅ تأكد من أن السيرفر يعمل
2. ✅ اذهب إلى: `http://localhost:3000/contact`
3. ✅ املأ النموذج وأرسله
4. ✅ يجب أن يعمل الآن!

## للتحقق من النجاح

```powershell
npx prisma studio
```

يجب أن يفتح Prisma Studio وترى جدول `ContactSubmission`.
