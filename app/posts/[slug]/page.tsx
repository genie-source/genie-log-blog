import { notFound } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { getAllPosts, getPostBySlug } from '@/lib/posts'
import { getCategoryStyle } from '@/lib/category'
import { MDXRemote } from 'next-mdx-remote/rsc'
import styles from './page.module.css'

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: {params: Promise<{ slug: string }>}) {
  const post = getPostBySlug((await params).slug)
  if (!post) return {}
  return {
    title: `${post.title} — genie.log`,
    description: post.description,
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }>} ) {
  const post = getPostBySlug((await params).slug)
  if (!post) notFound()

  const allPosts = getAllPosts()
  const related = allPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3)

  const { bg, color } = getCategoryStyle(post.category)

  return (
    <>
      <Nav />
      <div className={styles.pageWrap}>
        {/* ── MAIN ── */}
        <main className={styles.main}>
          <Link href="/" className={styles.backLink}>← 목록으로</Link>

          <div className={styles.postHeader}>
            <span className={styles.catBadge} style={{ background: bg, color }}>
              {post.category}
            </span>
            <h1 className={styles.postTitle}>{post.title}</h1>
            <div className={styles.metaRow}>
              <div className={styles.metaAuthor}>
                <div className={styles.authorDot}>이</div>
                <span className={styles.authorName}>이진경</span>
              </div>
              <span className={styles.metaSep}>·</span>
              <span className={styles.metaDate}>{post.date}</span>
            </div>
          </div>

          <div className={styles.postBody}>
            <MDXRemote source={post.content} />
          </div>
        </main>

        {/* ── SIDEBAR ── */}
        <aside className={styles.sidebar}>
          {related.length > 0 && (
            <div className={styles.relatedBox}>
              <div className={styles.sideLabel}>Related Posts</div>
              <div className={styles.relatedList}>
                {related.map((r) => {
                  const rc = getCategoryStyle(r.category)
                  return (
                    <Link key={r.slug} href={`/posts/${r.slug}`} className={styles.relatedItem}>
                      <div className={styles.relatedCat} style={{ color: rc.color }}>
                        {r.category}
                      </div>
                      <div className={styles.relatedTitle}>{r.title}</div>
                      <div className={styles.relatedDate}>{r.date}</div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </aside>
      </div>
      <Footer />
    </>
  )
}
