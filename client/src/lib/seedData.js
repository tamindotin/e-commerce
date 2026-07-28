export const seedCategories = [
  {
    id: "cat-1",
    name: "Footwear",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop",
  },
  {
    id: "cat-2",
    name: "Audio",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop",
  },
  {
    id: "cat-3",
    name: "Bags",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop",
  },
  {
    id: "cat-4",
    name: "Wearables",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop",
  },
];

export const seedProducts = [
  {
    id: "prod-1",
    name: "Aero Runner Sneaker",
    description:
      "Lightweight knit running sneaker with responsive foam midsole.",
    brand: "Voltrun",
    category: "cat-1",
    model: "AR-220",
    price: 4499,
    stock: 32,
    sku: "VR-AR220-BLK",
    specification: "Weight: 240g\nUpper: Knit mesh\nSole: EVA foam",
    tags: ["running", "lightweight", "new"],
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&h=300&fit=crop",
    ],
  },
  {
    id: "prod-2",
    name: "Pulse Wireless Earbuds",
    description: "Active noise-cancelling earbuds with 30h total battery life.",
    brand: "Sonique",
    category: "cat-2",
    model: "PW-04",
    price: 3299,
    stock: 6,
    sku: "SQ-PW04-WHT",
    specification: "Driver: 10mm dynamic\nBattery: 6h + 24h case\nANC: Yes",
    tags: ["audio", "wireless", "anc"],
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop",
    ],
  },
  {
    id: "prod-3",
    name: "Trailhead Canvas Backpack",
    description:
      "20L water-resistant canvas backpack with padded laptop sleeve.",
    brand: "Northfare",
    category: "cat-3",
    model: "TC-20",
    price: 2199,
    stock: 0,
    sku: "NF-TC20-OLV",
    specification: "Capacity: 20L\nMaterial: Waxed canvas\nLaptop: up to 15in",
    tags: ["travel", "everyday"],
    images: [],
  },
];
