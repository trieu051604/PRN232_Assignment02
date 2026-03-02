import Link from "next/link";
import prisma from "@/lib/prisma";
import ProductGrid from "@/components/ProductGrid";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; minPrice?: string; maxPrice?: string; page?: string }>;
}) {
  const { query, minPrice, maxPrice, page } = await searchParams;
  const pageSize = 8;
  const currentPage = parseInt(page || "1");

  try {
    const where: any = {};
    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ];
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (currentPage - 1) * pageSize,
        take: pageSize,
      }),
      prisma.product.count({ where }),
    ]);

    const session = await getSession();
    const totalPages = Math.ceil(totalCount / pageSize);

    return (
      <div>
        <div className="mb-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Discover Collection</h1>
              <p className="text-gray-500 font-medium">Find the perfect outfit for your premium lifestyle.</p>
            </div>
          </div>

          <div className="bg-white p-2 rounded-[2rem] shadow-xl shadow-indigo-50/50 border border-indigo-50 flex flex-col md:flex-row items-center gap-2">
            <form action="/" className="flex-1 w-full flex items-center bg-gray-50 rounded-2xl px-4 py-1">
              <input
                name="query"
                type="text"
                placeholder="Search products..."
                defaultValue={query}
                className="flex-1 bg-transparent border-none outline-none py-3 px-2 text-gray-900 font-medium placeholder:text-gray-400"
              />
              <button type="submit" className="p-2 hover:bg-white rounded-xl transition-all shadow-sm">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </button>
            </form>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <form action="/" className="flex items-center gap-2">
                {query && <input type="hidden" name="query" value={query} />}
                <div className="flex items-center bg-gray-50 rounded-2xl px-3 py-2 border border-transparent focus-within:border-indigo-100 transition-all">
                  <span className="text-xs font-bold text-gray-400 mr-1">$</span>
                  <input
                    name="minPrice"
                    type="number"
                    placeholder="Min"
                    defaultValue={minPrice}
                    className="w-16 bg-transparent outline-none text-sm font-bold text-gray-900"
                  />
                </div>
                <div className="flex items-center bg-gray-50 rounded-2xl px-3 py-2 border border-transparent focus-within:border-indigo-100 transition-all">
                  <span className="text-xs font-bold text-gray-400 mr-1">$</span>
                  <input
                    name="maxPrice"
                    type="number"
                    placeholder="Max"
                    defaultValue={maxPrice}
                    className="w-16 bg-transparent outline-none text-sm font-bold text-gray-900"
                  />
                </div>
                <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                  Apply
                </button>
                {(query || minPrice || maxPrice) && (
                  <a href="/" className="p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-100" title="Clear filters">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </a>
                )}
              </form>
            </div>
          </div>
        </div>

        <ProductGrid initialProducts={products} user={session?.user} />

        {totalPages > 1 && (
          <div className="mt-16 flex justify-center gap-2">
            {currentPage > 1 && (
              <Link
                href={`/?${new URLSearchParams({
                  ...(query && { query }),
                  ...(minPrice && { minPrice }),
                  ...(maxPrice && { maxPrice }),
                  page: (currentPage - 1).toString(),
                })}`}
                className="px-6 py-3 rounded-2xl bg-white border border-gray-100 text-gray-600 font-bold hover:bg-gray-50 transition-all shadow-sm"
              >
                Previous
              </Link>
            )}

            {[...Array(totalPages)].map((_, i) => (
              <Link
                key={i}
                href={`/?${new URLSearchParams({
                  ...(query && { query }),
                  ...(minPrice && { minPrice }),
                  ...(maxPrice && { maxPrice }),
                  page: (i + 1).toString(),
                })}`}
                className={`w-12 h-12 flex items-center justify-center rounded-2xl font-bold transition-all ${currentPage === i + 1
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                  : "bg-white border border-gray-100 text-gray-600 hover:bg-gray-50 shadow-sm"
                  }`}
              >
                {i + 1}
              </Link>
            ))}

            {currentPage < totalPages && (
              <Link
                href={`/?${new URLSearchParams({
                  ...(query && { query }),
                  ...(minPrice && { minPrice }),
                  ...(maxPrice && { maxPrice }),
                  page: (currentPage + 1).toString(),
                })}`}
                className="px-6 py-3 rounded-2xl bg-white border border-gray-100 text-gray-600 font-bold hover:bg-gray-50 transition-all shadow-sm"
              >
                Next
              </Link>
            )}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Database connection error:", error);
    return (
      <div className="text-center py-20 bg-red-50 rounded-xl border border-red-200">
        <h1 className="text-2xl font-bold text-red-700 mb-4">Database Error</h1>
        <p className="text-red-600">
          Could not connect to the database. Please check your DATABASE_URL and IP allowlist.
        </p>
        <p className="text-sm text-red-400 mt-4">
          Error: {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }
}
