import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(products);
    } catch (error) {
        console.error("GET /api/products error:", error);
        return NextResponse.json({ error: "Failed to fetch products", details: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, description, price, image } = body;

        if (!name || !description || !price) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                image,
            },
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error("POST /api/products error:", error);
        return NextResponse.json(
            {
                error: "Failed to create product",
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}
