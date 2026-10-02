type CategoryStyle = {
  bg: string;
  color: string;
};

const categoryMap: Record<string, CategoryStyle> = {
  Database: { bg: "#eef1ff", color: "#3d6cf4" },
  Backend: { bg: "#f0fff8", color: "#1cc986" },
  Server: { bg: "#fff8f0", color: "#f5a623" },
  Infra: { bg: "#fff0f0", color: "#f4573d" },
  삽질기: { bg: "#f7f7f7", color: "#888888" },
  논문정리: { bg: "#fef9ee", color: "#7c3aed" },
  학습정리: { bg: "#fdf2f8", color: "#db2777" }, // 핑크
  개발일지: { bg: "#f0fafa", color: "#0891b2" }, // 청록
  NLP: { bg: "#f7fee7", color: "#65a30d" }, // 연두
};

export function getCategoryStyle(category: string): CategoryStyle {
  return categoryMap[category] ?? { bg: "#f7f7f7", color: "#888888" };
}
