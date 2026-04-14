type CategoryStyle = {
  bg: string
  color: string
}

const categoryMap: Record<string, CategoryStyle> = {
  Database: { bg: '#eef1ff', color: '#3d6cf4' },
  Backend:  { bg: '#f0fff8', color: '#1cc986' },
  Server:   { bg: '#fff8f0', color: '#f5a623' },
  Infra:    { bg: '#fff0f0', color: '#f4573d' },
  삽질기:   { bg: '#f7f7f7', color: '#888888' },
  논문정리: { bg: '#fef9ee', color: '#7c3aed' },

}

export function getCategoryStyle(category: string): CategoryStyle {
  return categoryMap[category] ?? { bg: '#f7f7f7', color: '#888888' }
}
