import { notFound } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import BunrissokFlow from '@/components/BunrissokFlow'
import { getAllPosts } from '@/lib/posts'
import { getCategoryStyle } from '@/lib/category'
import { getProject, projects } from '@/lib/projects'
import { projectDetails } from '@/lib/projectDetails'
import postStyles from '../../posts/[slug]/page.module.css'
import styles from './page.module.css'

const flows: Record<string, () => React.ReactNode> = {
  bunrissok: () => <BunrissokFlow />,
}

export function generateStaticParams() {
  return projects.filter((p) => p.hasDetail).map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const project = getProject((await params).slug)
  const detail = project ? projectDetails[project.slug] : undefined
  if (!project || !detail) return {}
  return {
    title: `${project.name} — genie.log`,
    description: detail.tagline,
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProject(slug)
  const detail = projectDetails[slug]
  if (!project || !detail) notFound()

  const posts = getAllPosts()
  const related = detail.relatedPosts
    .map((s) => posts.find((p) => p.slug === s))
    .filter((p) => p !== undefined)
  const Flow = flows[slug]

  return (
    <>
      <Nav />
      <div className={`${postStyles.pageWrap} ${styles.pageWrap}`}>
        <main className={styles.main}>
          <Link href="/" className={postStyles.backLink}>
            ← 프로젝트 목록
          </Link>

          <header className={styles.header}>
            <span className={styles.origin}>{project.origin}</span>
            <h1 className={postStyles.postTitle}>{project.name}</h1>
            <p className={styles.tagline}>{detail.tagline}</p>
            <div className={styles.metaRow}>
              <span>{project.meta}</span>
              <span className={styles.metaDate}>{detail.period}</span>
            </div>
          </header>

          <div className={styles.summary}>
            <div className={styles.summaryRow}>
              <span className={styles.label}>Problem</span>
              <span>{detail.problem}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.label}>Built</span>
              <span>{project.built}</span>
            </div>
            {project.result && (
              <div className={styles.summaryRow}>
                <span className={styles.label}>Result</span>
                <span className={styles.result}>
                  {project.result}
                  {project.resultNote && <span className={styles.note}> {project.resultNote}</span>}
                </span>
              </div>
            )}
          </div>

          {Flow && (
            <section>
              <h2 className={styles.h2}>구조</h2>
              <p className={styles.p}>{detail.flowIntro}</p>
              <div className={styles.flowBox}>{Flow()}</div>
              <p className={styles.caption}>{detail.flowCaption}</p>
            </section>
          )}

          <section>
            <h2 className={styles.h2}>핵심 결정</h2>
            <div className={styles.decisions}>
              {detail.decisions.map((d) => (
                <div key={d.title} className={styles.decision}>
                  <h3 className={styles.h3}>{d.title}</h3>
                  <div className={styles.decisionRow}>
                    <span className={styles.label}>Before</span>
                    <span>{d.before}</span>
                  </div>
                  <div className={styles.decisionRow}>
                    <span className={styles.label}>After</span>
                    <span>{d.after}</span>
                  </div>
                  <div className={styles.decisionRow}>
                    <span className={styles.label}>Why</span>
                    <span>{d.why}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className={styles.h2}>결과</h2>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>지표</th>
                    <th>개선 전</th>
                    <th>개선 후</th>
                    <th>감소</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.results.map((r) => (
                    <tr key={r.metric}>
                      <td>{r.metric}</td>
                      <td className={styles.num}>{r.before}</td>
                      <td className={styles.num}>{r.after}</td>
                      <td className={styles.change}>{r.change}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={styles.caption}>{detail.resultNote}</p>
          </section>

          <section>
            <h2 className={styles.h2}>한계와 다음 단계</h2>
            <ul className={styles.list}>
              {detail.limits.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </section>
        </main>

        <aside className={`${postStyles.sidebar} ${styles.sidebar}`}>
          <div className={postStyles.relatedBox}>
            <div className={postStyles.sideLabel}>Stack</div>
            <div className={styles.pills}>
              {detail.stack.map((s) => (
                <span key={s} className={styles.pill}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          {detail.links.length > 0 && (
            <div className={postStyles.relatedBox}>
              <div className={postStyles.sideLabel}>Links</div>
              <div className={postStyles.relatedList}>
                {detail.links.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className={`${postStyles.relatedItem} ${styles.sideLink}`}>
                    {l.label} →
                  </a>
                ))}
              </div>
            </div>
          )}

          {related.length > 0 && (
            <div className={postStyles.relatedBox}>
              <div className={postStyles.sideLabel}>Related Posts</div>
              <div className={postStyles.relatedList}>
                {related.map((r) => {
                  const rc = getCategoryStyle(r.category)
                  return (
                    <Link key={r.slug} href={`/posts/${r.slug}`} className={postStyles.relatedItem}>
                      <div className={postStyles.relatedCat} style={{ color: rc.color }}>
                        {r.category}
                      </div>
                      <div className={postStyles.relatedTitle}>{r.title}</div>
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
