import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDir = path.join(process.cwd(), 'posts')

export type PostMeta = {
  slug: string
  title: string
  date: string
  category: string
  description: string
  readTime: string
}

export type Post = PostMeta & {
  content: string
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDir)) return []

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'))

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.md$/, '')
    const raw = fs.readFileSync(path.join(postsDir, filename), 'utf-8')
    const { data } = matter(raw)

    return {
      slug,
      title: data.title ?? '제목 없음',
      date: data.date ? String(data.date) : '',
      category: data.category ?? 'etc',
      description: data.description ?? '',
      readTime: data.readTime ?? '5분',
    }
  })

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(postsDir, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  return {
    slug,
    title: data.title ?? '제목 없음',
    date: data.date ?? '',
    category: data.category ?? 'etc',
    description: data.description ?? '',
    readTime: data.readTime ?? '5분',
    content,
  }
}

export function getAllCategories(posts: PostMeta[]): string[] {
  const cats = Array.from(new Set(posts.map((p) => p.category)))
  return cats
}
