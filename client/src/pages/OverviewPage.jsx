import { Package, Tags, AlertCircle, Boxes } from "lucide-react";
import { Link } from "../components/Link";
import { currency } from "../lib/utils";

// ---------------------------------------------------------------------------
// Dashboard overview
// ---------------------------------------------------------------------------
export function OverviewPage({ products, categories, onNavigate }) {
  const outOfStock = products.filter((p) => p.stock <= 0).length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  const stats = [
    { label: "Products", value: products.length, icon: Package },
    { label: "Categories", value: categories.length, icon: Tags },
    {
      label: "Low / out of stock",
      value: `${lowStock} / ${outOfStock}`,
      icon: AlertCircle,
    },
    { label: "Inventory value", value: currency(totalValue), icon: Boxes },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          An overview of your catalog.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-md border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2 font-mono text-2xl font-semibold tabular-nums">
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-md border p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium">Recent products</h2>
            <Link
              to="/products"
              onClick={() => onNavigate("products")}
              className="text-xs text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="space-y-2">
            {products.slice(0, 4).map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="truncate">{p.name}</span>
                <span className="font-mono tabular-nums text-muted-foreground">
                  {currency(p.price)}
                </span>
              </div>
            ))}
            {products.length === 0 && (
              <p className="text-sm text-muted-foreground">No products yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-md border p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium">Categories</h2>
            <Link
              to="/categories"
              onClick={() => onNavigate("categories")}
              className="text-xs text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="space-y-2">
            {categories.slice(0, 4).map((c) => (
              <div key={c.id} className="flex items-center gap-2 text-sm">
                <div className="h-6 w-6 overflow-hidden rounded border bg-muted">
                  {c.image && (
                    <img
                      src={c.image}
                      alt={c.name}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <span className="truncate">{c.name}</span>
              </div>
            ))}
            {categories.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No categories yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
