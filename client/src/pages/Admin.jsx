import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutDashboard, Package, Tags, Boxes } from "lucide-react";
import { Link } from "react-router";
import { OverviewPage } from "./OverviewPage";
import { ProductsPage } from "./ProductsPage";
import { CategoriesPage } from "./CategoriesPage";
import { seedCategories, seedProducts } from "../lib/seedData";

// ---------------------------------------------------------------------------
// Shell: sidebar + content router
// ---------------------------------------------------------------------------
export default function AdminDashboard() {
  const [page, setPage] = useState("overview");
  const [products, setProducts] = useState(seedProducts);
  const [categories, setCategories] = useState(seedCategories);

  const navItems = [
    { key: "overview", label: "Dashboard", icon: LayoutDashboard, to: "/" },
    { key: "products", label: "Products", icon: Package, to: "/products" },
    { key: "categories", label: "Categories", icon: Tags, to: "/categories" },
  ];

  return (
    <div className="flex min-h-screen bg-muted/30 text-foreground">
      <aside className="hidden w-60 shrink-0 border-r bg-background md:flex md:flex-col">
        <div className="flex h-14 items-center gap-2 border-b px-5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Boxes className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold">Commerce Admin</span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => (
            <Link
              key={item.key}
              to={item.to}
              onClick={() => setPage(item.key)}
              className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
                page === item.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t p-3 text-xs text-muted-foreground">
          Signed in as{" "}
          <span className="font-medium text-foreground">admin@store.com</span>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b bg-background px-4 md:hidden">
          <span className="text-sm font-semibold">Commerce Admin</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Menu
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {navItems.map((item) => (
                <DropdownMenuItem
                  key={item.key}
                  onClick={() => setPage(item.key)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 p-6">
          {page === "overview" && (
            <OverviewPage
              products={products}
              categories={categories}
              onNavigate={setPage}
            />
          )}
          {page === "products" && (
            <ProductsPage
              products={products}
              setProducts={setProducts}
              categories={categories}
            />
          )}
          {page === "categories" && (
            <CategoriesPage
              categories={categories}
              setCategories={setCategories}
              products={products}
            />
          )}
        </main>
      </div>
    </div>
  );
}
