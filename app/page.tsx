import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { getAllPosts, getAllCategories } from '@/lib/posts'
import { getCategoryStyle } from '@/lib/category'
import styles from './page.module.css'

const AI_STORIES = [
  {
    tag: '// Prompt',
    title: 'SQL 튜닝을 Claude한테 맡겨봤더니',
    desc: '느린 쿼리를 붙여넣고 EXPLAIN ANALYZE 결과를 주면 꽤 쓸만한 인덱스 제안을 해준다',
    date: '2025.04.05',
    read: '4분',
  },
  {
    tag: '// Automation',
    title: 'GitHub Actions + AI로 PR 리뷰 자동화',
    desc: '코드 diff를 LLM에 넣어서 리뷰 코멘트 자동 생성 — 아직 완벽하진 않지만 꽤 유용',
    date: '2025.03.20',
    read: '6분',
  },
  {
    tag: '// Tool',
    title: '로컬에서 LLM 돌려서 개발 보조로 쓰기',
    desc: 'Ollama + CodeLlama 셋업부터 실제 사용 후기까지',
    date: '2025.03.01',
    read: '8분',
  },
]

export default function Home() {
  const posts = getAllPosts()
  const categories = getAllCategories(posts)

  return (
    <>
      <Nav />
      <main>

        {/* PROFILE */}
        <div className={styles.profileWrap}>
          <div className={styles.sectionLabel}>About Me</div>
          <div className={styles.profileCard}>
            <div className={styles.profileLeft}>
              <div className={styles.profileName}>이진경</div>
              <div className={styles.profileInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Email</span>
                  <span className={styles.infoValue}>genie_lee@hufs.ac.kr</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>GitHub</span>
                  <span className={styles.infoValue}>
                    <a href="https://github.com/genie-source" target="_blank" rel="noreferrer">
                      github.com/genie-source
                    </a>
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Univ</span>
                  <span className={styles.infoValue}>한국외국어대학교 컴퓨터공학과</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>City</span>
                  <span className={styles.infoValue}>Seoul, Korea</span>
                </div>
              </div>
            </div>
            <div className={styles.profileRight}>
              <div className={styles.rightBlock}>
                <div className={styles.rightBlockLabel}>Tech Stack</div>
                <div className={styles.techPills}>
                  {['Python', 'Java', 'JavaScript', 'Git'].map((tech) => (
                    <span key={tech} className={styles.techPill}>{tech}</span>
                  ))}
                </div>
              </div>
              <div className={styles.rightBlock}>
                <div className={styles.rightBlockLabel}>Currently Working On</div>
                <div className={styles.workList}>
                  <div className={styles.workItem}>
                    <div className={styles.workDot} style={{ background: '#3d6cf4' }} />
                    <div>
                      <div className={styles.workTitle}>
                        영상에서 객체를 segmentation하고, adversarial attack을 적용하여 모델의 취약성을 분석하는 프로젝트
                      </div>
                      <div className={styles.workSub}>졸업작품 프로젝트 진행 중</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className={styles.aboutBtnWrap}>
                <Link href="/about" className={styles.aboutBtn}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="8" cy="5.5" r="2.5"/>
                    <path d="M2.5 13.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" strokeLinecap="round"/>
                  </svg>
                  소개 페이지 보기
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div> */}
            </div>
          </div>
        </div>

        {/* POSTS */}
        <div className={styles.postsWrap}>
          <div className={styles.sectionLabel}>Post</div>
          <div className={styles.catTabs}>
            {['전체', ...categories].map((cat) => (
              <span key={cat} className={styles.catTab}>{cat}</span>
            ))}
          </div>
          <div className={styles.postList}>
            {posts.length === 0 ? (
              <div className={styles.emptyState}>
                <p>아직 작성된 글이 없어요.</p>
                <p><code>posts/</code> 폴더에 <code>.md</code> 파일을 추가하면 여기에 나타납니다.</p>
              </div>
            ) : (
              posts.map((post) => {
                const { bg, color } = getCategoryStyle(post.category)
                return (
                  <Link key={post.slug} href={`/posts/${post.slug}`} className={styles.postRow}>
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
              })
            )}
          </div>
        </div>

        {/* AI STORIES */}
        <div className={styles.aiSection}>
          <div className={styles.aiInner}>
            <div className={styles.aiLabel}>AI Stories</div>
            <div className={styles.aiTitle}>AI로 개발 효율 올리기</div>
            <div className={styles.aiGrid}>
              {AI_STORIES.map((item) => (
                <div key={item.title} className={styles.aiCard}>
                  <div className={styles.aiCardTag}>{item.tag}</div>
                  <h4 className={styles.aiCardTitle}>{item.title}</h4>
                  <p className={styles.aiCardDesc}>{item.desc}</p>
                  <div className={styles.aiCardFoot}>{item.date} · {item.read}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </>
  )
}
