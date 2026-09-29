'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { PostMeta } from '@/lib/posts'
import { getCategoryStyle } from '@/lib/category'
import styles from '@/app/page.module.css'

const ALL = '전체'

export default function PostList({
  posts,
  categories,
}: {
  posts: PostMeta[]
  categories: string[]
}) {
  const [selected, setSelected] = useState(ALL)
  const visiblePosts =
    selected === ALL ? posts : posts.filter((post) => post.category === selected)

  return (
    <>
      <div className={styles.catTabs}>
        {[ALL, ...categories].map((cat) => (
          <button
            key={cat}
            type="button"
            className={`${styles.catTab} ${cat === selected ? styles.catTabActive : ''}`}
            aria-pressed={cat === selected}
            onClick={() => setSelected(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className={styles.postList}>
        {posts.length === 0 ? (
          <div className={styles.emptyState}>
            <p>아직 작성된 글이 없어요.</p>
            <p>
              <code>posts/</code> 폴더에 <code>.md</code> 파일을 추가하면
              여기에 나타납니다.
            </p>
          </div>
        ) : (
          visiblePosts.map((post) => {
            const { bg, color } = getCategoryStyle(post.category)
            return (
              <Link
                key={post.slug}
                href={`/posts/${post.slug}`}
                className={styles.postRow}
              >
                <span
                  className={styles.postCatBadge}
                  style={{ background: bg, color }}
                >
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
          })
        )}
      </div>
    </>
  )
}
