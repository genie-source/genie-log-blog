import Link from 'next/link'
import type { PostMeta } from '@/lib/posts'
import { getCategoryStyle } from '@/lib/category'
import styles from '@/app/page.module.css'

export default function PostRow({ post }: { post: PostMeta }) {
  const { bg, color } = getCategoryStyle(post.category)
  return (
    <Link href={`/posts/${post.slug}`} className={styles.postRow}>
      <span className={styles.postCatBadge} style={{ background: bg, color }}>
        {post.category}
      </span>
      <div>
        <h3 className={styles.postTitle}>{post.title}</h3>
        <p className={styles.postDesc}>{post.description}</p>
      </div>
      <div className={styles.postRight}>
        <span className={styles.postDate}>{post.date}</span>
      </div>
    </Link>
  )
}
