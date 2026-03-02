import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting seed...");

    // ─── Create Admin User ─────────────────────────────────────────
    const adminPassword = await bcrypt.hash("admin123", 10);
    const admin = await prisma.user.upsert({
        where: { email: "admin@clothstore.com" },
        update: {},
        create: {
            email: "admin@clothstore.com",
            password: adminPassword,
            name: "Store Admin",
            role: "ADMIN",
        },
    });
    console.log(`✅ Admin created: ${admin.email}`);

    // ─── Create Sample Products ────────────────────────────────────
    const products = [
        {
            name: "Classic White Tee",
            description:
                "A timeless wardrobe essential. Made from 100% premium organic cotton with a relaxed fit perfect for everyday wear.",
            price: 29.99,
            image:
                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
        },
        {
            name: "Indigo Slim Jeans",
            description:
                "Premium denim with a modern slim cut. Features stretch fabric for comfort and durability through daily adventures.",
            price: 89.99,
            image:
                "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80",
        },
        {
            name: "Urban Hoodie",
            description:
                "Your go-to layer for cooler days. Heavyweight French terry with a cozy kangaroo pocket and adjustable drawcord.",
            price: 59.99,
            image:
                "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80",
        },
        {
            name: "Floral Summer Dress",
            description:
                "Light and breezy midi dress with a beautiful floral print. Perfect for brunches, picnics, or beach days.",
            price: 74.99,
            image:
                "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80",
        },
        {
            name: "Cargo Pants",
            description:
                "Versatile utility pants with multiple pockets. Durable ripstop fabric that looks great dressed up or down.",
            price: 69.99,
            image:
                "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
        },
        {
            name: "Linen Blazer",
            description:
                "A sophisticated lightweight blazer crafted from breathable linen blend. Elevate any outfit effortlessly.",
            price: 139.99,
            image:
                "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80",
        },
        {
            name: "Striped Polo Shirt",
            description:
                "A smart-casual staple with classic nautical stripes. Piqué knit fabric keeps you cool and looking sharp.",
            price: 44.99,
            image:
                "https://images.unsplash.com/photo-1608744882201-52a7f7f3dd60?w=800&q=80",
        },
        {
            name: "Leather Jacket",
            description:
                "Iconic biker-style jacket in genuine leather. Asymmetrical zipper and quilted panels for a bold statement look.",
            price: 199.99,
            image:
                "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
        },
    ];

    for (const product of products) {
        const created = await prisma.product.upsert({
            where: { name: product.name } as any,
            update: {},
            create: product,
        });
        console.log(`✅ Product: ${created.name} ($${created.price})`);
    }

    console.log("\n🎉 Seed completed!");
    console.log("──────────────────────────────────────────");
    console.log("  Admin Login:");
    console.log("  Email:    admin@clothstore.com");
    console.log("  Password: admin123");
    console.log("──────────────────────────────────────────");
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
