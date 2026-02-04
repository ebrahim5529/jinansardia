import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// GET - Get all website settings or specific setting by key
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    if (key) {
      // Get specific setting
      const setting = await prisma.websiteSettings.findUnique({
        where: { key },
      });

      if (!setting) {
        return NextResponse.json({ value: null });
      }

      return NextResponse.json({ value: setting.value });
    } else {
      // Get all settings
      const settings = await prisma.websiteSettings.findMany({
        orderBy: { key: "asc" },
      });

      const settingsMap: Record<string, string> = {};
      settings.forEach((setting) => {
        settingsMap[setting.key] = setting.value;
      });

      return NextResponse.json(settingsMap);
    }
  } catch (error) {
    console.error("Error fetching website settings:", error);
    return NextResponse.json(
      { error: "فشل جلب الإعدادات" },
      { status: 500 }
    );
  }
}

// POST - Create or update website settings
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const body = await req.json();
    const { settings } = body; // { key: value } object

    if (!settings || typeof settings !== "object") {
      return NextResponse.json(
        { error: "بيانات غير صحيحة" },
        { status: 400 }
      );
    }

    const userId = (session.user as any)?.id || "system";

    // Upsert each setting
    const updates = Object.entries(settings).map(([key, value]) =>
      prisma.websiteSettings.upsert({
        where: { key },
        update: {
          value: String(value),
          updatedBy: userId,
        },
        create: {
          key,
          value: String(value),
          updatedBy: userId,
        },
      })
    );

    await Promise.all(updates);

    return NextResponse.json({
      success: true,
      message: "تم حفظ الإعدادات بنجاح",
    });
  } catch (error) {
    console.error("Error saving website settings:", error);
    return NextResponse.json(
      { error: "فشل حفظ الإعدادات" },
      { status: 500 }
    );
  }
}

// PUT - Update specific setting
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const body = await req.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: "المفتاح والقيمة مطلوبان" },
        { status: 400 }
      );
    }

    const userId = (session.user as any)?.id || "system";

    const setting = await prisma.websiteSettings.upsert({
      where: { key },
      update: {
        value: String(value),
        updatedBy: userId,
      },
      create: {
        key,
        value: String(value),
        updatedBy: userId,
      },
    });

    return NextResponse.json({
      success: true,
      setting,
    });
  } catch (error) {
    console.error("Error updating website setting:", error);
    return NextResponse.json(
      { error: "فشل تحديث الإعداد" },
      { status: 500 }
    );
  }
}
