import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "جميع الحقول مطلوبة" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "البريد الإلكتروني غير صحيح" },
        { status: 400 }
      );
    }

    // Save to database
    const submission = await prisma.contactSubmission.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
        status: "pending",
      },
    });

    console.log("Contact submission created:", submission.id);

    return NextResponse.json(
      { 
        success: true, 
        message: "تم إرسال رسالتك بنجاح",
        id: submission.id 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error submitting contact form:", error);
    console.error("Error stack:", error.stack);
    
    // Log more details for debugging
    if (error.code) {
      console.error("Prisma error code:", error.code);
    }
    if (error.meta) {
      console.error("Prisma error meta:", JSON.stringify(error.meta, null, 2));
    }
    
    // Check for common Prisma errors
    let errorMessage = "فشل إرسال الرسالة. يرجى المحاولة مرة أخرى.";
    let errorDetails = "";
    
    if (error.code === "P2002") {
      errorMessage = "هذا السجل موجود بالفعل";
      errorDetails = error.meta?.target?.join(", ") || "";
    } else if (error.code === "P2025") {
      errorMessage = "السجل غير موجود";
    } else if (error.code === "P1001") {
      errorMessage = "لا يمكن الاتصال بقاعدة البيانات. تأكد من إعدادات الاتصال.";
    } else if (error.message?.includes("Unknown model") || error.message?.includes("contactSubmission")) {
      errorMessage = "خطأ في قاعدة البيانات. يرجى تشغيل migration أولاً.";
      errorDetails = "قم بتشغيل: npx prisma migrate dev && npx prisma generate";
    } else if (error.message) {
      errorDetails = error.message;
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? errorDetails : undefined,
        code: process.env.NODE_ENV === "development" ? error.code : undefined
      },
      { status: 500 }
    );
  }
}
