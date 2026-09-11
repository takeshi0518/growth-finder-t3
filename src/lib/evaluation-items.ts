export const EVALUATION_CATEGORIES = [
  { key: "barista", label: "バリスタ" },
  { key: "cashier", label: "接客・レジ" },
  { key: "cleanliness", label: "清掃・備品管理" },
] as const;

export const EVALUATION_ITEMS = [
  { itemName: "抽出技術", category: "barista", maxScore: 5, displayOrder: 1 },
  {
    itemName: "ドリンク品質の安定性",
    category: "barista",
    maxScore: 5,
    displayOrder: 2,
  },
  { itemName: "接客対応", category: "cashier", maxScore: 5, displayOrder: 3 },
  { itemName: "レジ精度", category: "cashier", maxScore: 5, displayOrder: 4 },
  {
    itemName: "清掃の徹底",
    category: "cleanliness",
    maxScore: 5,
    displayOrder: 5,
  },
  {
    itemName: "備品管理",
    category: "cleanliness",
    maxScore: 5,
    displayOrder: 6,
  },
] as const;
