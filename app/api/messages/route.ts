import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const targetUserId = searchParams.get("userId");

        let whereClause: any = {};

        if (session.user.role === "ADMIN") {
            // ADMIN logic
            if (targetUserId) {
                whereClause = { userId: parseInt(targetUserId) };
            } else {
                // Admin gets all messages by default for now
                whereClause = {};
            }
        } else {
            // CUSTOMER logic: ONLY see messages for their own ID
            whereClause = { userId: session.user.id };
        }

        const messages = await prisma.message.findMany({
            where: whereClause,
            orderBy: { createdAt: "asc" },
            include: {
                user: {
                    select: { id: true, name: true, role: true }
                }
            }
        });

        return NextResponse.json(messages);
    } catch (error) {
        console.error("Fetch messages error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { content, targetUserId } = await request.json();
        if (!content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }

        let userId = session.user.id;
        const isAdmin = session.user.role === "ADMIN";

        if (isAdmin) {
            if (!targetUserId) {
                return NextResponse.json({ error: "targetUserId is required for admin replies" }, { status: 400 });
            }
            userId = parseInt(targetUserId);
        }

        const message = await prisma.message.create({
            data: {
                content,
                userId: userId,
                isAdmin: isAdmin,
            },
        });

        return NextResponse.json(message, { status: 201 });
    } catch (error) {
        console.error("Send message error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
