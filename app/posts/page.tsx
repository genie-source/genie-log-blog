import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import PostList from '@/components/PostList'
import { getAllPosts, getAllCategories } from '@/lib/posts'
import styles from '../page.module.css'

export const metadata = {
  title: '전체 글 — genie.log',
  description: '이진경의 개발 블로그 전체 글',
}

export default function PostsPage() {
  const posts = getAllPosts()
  const categories = getAllCategories(posts)

  return (
    <>
      <Nav />
      <main className={styles.postsWrap}>
        <Link href="/" className={styles.backLink}>
          ← 홈으로
        </Link>
        <div className={styles.pageHead}>
          <h1 className={styles.pageTitle}>전체 글</h1>
          <p className={styles.pageSub}>글 {posts.length}개</p>
        </div>
        <PostList posts={posts} categories={categories} />
      </main>
      <Footer />
    </>
  )
}
