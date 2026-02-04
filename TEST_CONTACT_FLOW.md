# اختبار تدفق نموذج الاتصال

## الخطوات للتحقق من أن البيانات تُحفظ وتظهر بشكل صحيح

### 1. التحقق من Migration

**مهم جداً**: تأكد من تشغيل migration أولاً:

```bash
# في مجلد المشروع
npx prisma migrate dev --name add_website_settings_and_contact_submissions
npx prisma generate
```

### 2. التحقق من قاعدة البيانات

افتح Prisma Studio للتحقق من الجدول:

```bash
npx prisma studio
```

ثم افتح جدول `ContactSubmission` وتحقق من:
- أن الجدول موجود
- أن الحقول موجودة (id, name, email, subject, message, status, createdAt, updatedAt)

### 3. اختبار إرسال البيانات

#### الخطوة 1: افتح صفحة الاتصال
```
http://localhost:3000/contact
```

#### الخطوة 2: املأ النموذج
- **الاسم**: اختبار
- **البريد الإلكتروني**: test@example.com
- **الموضوع**: اختبار الاتصال
- **الرسالة**: هذه رسالة اختبار

#### الخطوة 3: أرسل النموذج
- اضغط على زر "إرسال"
- يجب أن تظهر رسالة نجاح: "تم إرسال رسالتك بنجاح"
- يجب أن تُمسح الحقول تلقائياً

#### الخطوة 4: تحقق من Console
افتح Developer Tools (F12) → Console
يجب أن ترى:
```
Contact form submitted successfully: [id]
```

#### الخطوة 5: تحقق من Network
افتح Developer Tools (F12) → Network
- ابحث عن `/api/contact/submit`
- يجب أن يكون Status: `201 Created`
- Response يجب أن يحتوي على:
  ```json
  {
    "success": true,
    "message": "تم إرسال رسالتك بنجاح",
    "id": "..."
  }
  ```

### 4. التحقق من قاعدة البيانات مباشرة

#### باستخدام Prisma Studio:
```bash
npx prisma studio
```
- افتح جدول `ContactSubmission`
- يجب أن ترى السجل الجديد

#### أو باستخدام SQL:
```sql
SELECT * FROM ContactSubmission ORDER BY createdAt DESC LIMIT 1;
```

### 5. اختبار عرض البيانات في لوحة التحكم

#### الخطوة 1: سجل الدخول
تأكد من تسجيل الدخول كمسؤول

#### الخطوة 2: افتح صفحة طلبات الاتصال
```
http://localhost:3000/settings/contacts
```

#### الخطوة 3: تحقق من البيانات
- يجب أن تظهر البيانات المرسلة في الجدول
- يجب أن تكون الحالة: "قيد الانتظار"
- يجب أن يظهر التاريخ والوقت

#### الخطوة 4: تحقق من Console
افتح Developer Tools (F12) → Console
يجب أن ترى:
```
Fetched X contact submissions (total: X)
Loaded X submissions
```

#### الخطوة 5: تحقق من Network
افتح Developer Tools (F12) → Network
- ابحث عن `/api/admin/contact-submissions`
- يجب أن يكون Status: `200 OK`
- Response يجب أن يحتوي على:
  ```json
  {
    "submissions": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": X,
      "totalPages": Y
    }
  }
  ```

### 6. اختبار الميزات الإضافية

#### تغيير الحالة:
1. اختر حالة جديدة من القائمة المنسدلة
2. يجب أن تتحدث الحالة فوراً
3. تحقق من Network → يجب أن ترى PATCH request

#### عرض التفاصيل:
1. اضغط على أيقونة العين
2. يجب أن يفتح modal مع جميع التفاصيل

#### البحث:
1. اكتب في حقل البحث
2. يجب أن يتم تصفية النتائج فوراً

#### الحذف:
1. اضغط على أيقونة الحذف
2. أكد الحذف
3. يجب أن يختفي السجل من الجدول

### 7. استكشاف الأخطاء

#### المشكلة: لا تظهر رسالة النجاح
**الحل**:
- تحقق من Console للأخطاء
- تحقق من Network → `/api/contact/submit`
- تحقق من أن migration تم تشغيله

#### المشكلة: البيانات لا تظهر في لوحة التحكم
**الحل**:
1. تحقق من تسجيل الدخول
2. تحقق من Console للأخطاء
3. تحقق من Network → `/api/admin/contact-submissions`
   - إذا كان Status: `401` → مشكلة في Authentication
   - إذا كان Status: `500` → مشكلة في قاعدة البيانات
4. تحقق من Prisma Studio أن البيانات موجودة

#### المشكلة: خطأ في قاعدة البيانات
**الحل**:
1. تحقق من `DATABASE_URL` في `.env`
2. تحقق من أن قاعدة البيانات تعمل
3. تحقق من أن migration تم تشغيله:
   ```bash
   npx prisma migrate status
   ```
4. إذا كان هناك migrations معلقة:
   ```bash
   npx prisma migrate deploy
   ```

#### المشكلة: خطأ "غير مصرح" (401)
**الحل**:
- تأكد من تسجيل الدخول
- تحقق من أن session موجودة
- تحقق من `NEXTAUTH_SECRET` في `.env`

### 8. سجلات التتبع

الكود يحتوي على console.log في:
- `/api/contact/submit` → عند إنشاء submission
- `/api/admin/contact-submissions` → عند جلب submissions
- صفحة `/settings/contacts` → عند تحميل البيانات

راقب هذه السجلات في:
- Terminal (لـ API routes)
- Browser Console (لـ Client-side)

### 9. التحقق النهائي

بعد كل الاختبارات، يجب أن:
- ✅ البيانات تُحفظ في قاعدة البيانات
- ✅ البيانات تظهر في لوحة التحكم
- ✅ يمكن تغيير الحالة
- ✅ يمكن عرض التفاصيل
- ✅ يمكن البحث والتصفية
- ✅ يمكن الحذف

إذا كانت كل هذه النقاط تعمل، فالنظام يعمل بشكل صحيح! ✅
