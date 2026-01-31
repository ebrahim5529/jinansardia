import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

type RegisterBody =
  | {
      accountType: "FACTORY";
      account: {
        email: string;
        password: string;
        name?: string;
      };
      factory: {
        factoryName: string;
        tradeName?: string;
        commercialRegNo: string;
        taxNo: string;
        activityType: string;
        country: string;
        city: string;
        address: string;

        contactPersonName: string;
        jobTitle: string;
        phone: string;
        altPhone?: string;
        officialEmail: string;
        website?: string;
      };
    }
  | {
      accountType: "HOSPITAL";
      account: {
        username: string;
        email: string;
        password: string;
      };
      hospital: {
        hospitalName: string;
        facilityType: "GOVERNMENT" | "PRIVATE" | "CHARITY";
        healthLicenseNo: string;
        supervisingAuthority: string;
        country: string;
        city: string;
        address: string;

        purchasingManagerName: string;
        jobTitle: string;
        phone: string;
        altPhone?: string;
        officialEmail: string;
      };
    };

export async function POST(req: Request) {
  const body = (await req.json()) as RegisterBody;

  if (body.accountType === "FACTORY") {
    const { email, password, name } = body.account;

    if (!email || !password) {
      return NextResponse.json({ message: "Missing email/password" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    try {
      const user = await prisma.user.create({
        data: {
          email,
          name: name ?? null,
          passwordHash,
          accountType: "FACTORY",
          factory: {
            create: {
              ...body.factory,
            },
          },
        },
        select: { id: true, email: true },
      });

      return NextResponse.json({ user }, { status: 201 });
    } catch (e) {
      return NextResponse.json({ message: "Registration failed" }, { status: 400 });
    }
  }

  if (body.accountType === "HOSPITAL") {
    const { email, password, username } = body.account;

    if (!email || !password || !username) {
      return NextResponse.json({ message: "Missing username/email/password" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    try {
      const user = await prisma.user.create({
        data: {
          email,
          name: username,
          passwordHash,
          accountType: "HOSPITAL",
          hospital: {
            create: {
              ...body.hospital,
            },
          },
        },
        select: { id: true, email: true },
      });

      return NextResponse.json({ user }, { status: 201 });
    } catch (e) {
      return NextResponse.json({ message: "Registration failed" }, { status: 400 });
    }
  }

  return NextResponse.json({ message: "Invalid accountType" }, { status: 400 });
}
