import { notFound } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import BunrissokFlow from '@/components/BunrissokFlow'
import DaeumFlow from '@/components/DaeumFlow'
import OjoFlow from '@/components/OjoFlow'
import TiumFlow from '@/components/TiumFlow'
import { getAllPosts } from '@/lib/posts'
import { getCategoryStyle } from '@/lib/category'
import { getProject, projects } from '@/lib/projects'
import { projectDetails } from '@/lib/projectDetails'
import postStyles from '../../posts/[slug]/page.module.css'
import styles from './page.module.css'

const flows: Record<string, () => React.ReactNode> = {
  bunrissok: () => <BunrissokFlow />,
  daeum: () => <DaeumFlow />,
  ojo: () => <OjoFlow />,
  tium: () => <TiumFlow />,
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
  const result = detail.result

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
              {detail.period && <span className={styles.metaDate}>{detail.period}</span>}
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

          {detail.screens && detail.screens.length > 0 && (
            <section>
              <h2 className={styles.h2}>화면</h2>
              <div className={styles.screens}>
                {detail.screens.map((sc) => (
                  <figure key={sc.src} className={styles.screen}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={sc.src}
                      alt={sc.alt}
                      className={`${styles.screenImg} ${sc.small ? styles.screenImgSmall : ''}`}
                      loading="lazy"
                    />
                    <figcaption className={styles.caption}>{sc.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </section>
          )}

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

          {result && (
          <section>
            <h2 className={styles.h2}>결과</h2>
            <p className={styles.p}>{result.summary}</p>

            <div className={styles.highlights}>
              {result.highlights.map((h) => (
                <div key={h.label} className={styles.highlight}>
                  <span className={styles.highlightValue}>{h.value}</span>
                  <span className={styles.highlightLabel}>{h.label}</span>
                </div>
              ))}
            </div>

            {result.cases && result.calls && (
            <>
            <h3 className={`${styles.h3} ${styles.subhead}`}>케이스별 LLM 호출</h3>
            <div className={styles.tableWrap}>
              <table className={`${styles.table} ${styles.tableLeft}`}>
                <thead>
                  <tr>
                    <th>케이스</th>
                    <th>개선 전</th>
                    <th>개선 후</th>
                  </tr>
                </thead>
                <tbody>
                  {result.cases.map((c) => (
                    <tr key={c.label}>
                      <td>{c.label}</td>
                      <td>{c.before}</td>
                      <td className={styles.afterCell}>{c.after}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={styles.calcList}>
              <div className={styles.calcRow}>
                <span className={styles.label}>Before</span>
                <span className={styles.calc}>{result.calls.before}</span>
              </div>
              <div className={styles.calcRow}>
                <span className={styles.label}>After</span>
                <span className={styles.calc}>{result.calls.after}</span>
              </div>
              <div className={styles.calcRow}>
                <span className={styles.label}>절감률</span>
                <span className={styles.change}>{result.calls.rate}</span>
              </div>
            </div>
            </>
            )}

            {result.costModels && (
            <>
            <h3 className={`${styles.h3} ${styles.subhead}`}>모델별 비용 (100건 기준)</h3>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>모델</th>
                    <th>개선 전</th>
                    <th>개선 후</th>
                    <th>절감률</th>
                  </tr>
                </thead>
                <tbody>
                  {result.costModels.map((m) => (
                    <tr key={m.model}>
                      <td>{m.model}</td>
                      <td className={styles.num}>{m.before.total}</td>
                      <td className={styles.num}>{m.after.total}</td>
                      <td className={styles.change}>{m.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {result.costModels.map((m) => (
              <details key={m.model} className={styles.details}>
                <summary className={styles.detailsSummary}>{m.model} 계산 과정 보기</summary>
                <div className={styles.detailsBody}>
                  <p className={styles.caption}>{m.price}</p>
                  <div className={styles.tableWrap}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>노드</th>
                          <th>입력 토큰</th>
                          <th>출력 토큰</th>
                          <th>1회 비용</th>
                        </tr>
                      </thead>
                      <tbody>
                        {m.nodes.map((n) => (
                          <tr key={n.node}>
                            <td>{n.node}</td>
                            <td className={styles.num}>{n.input}</td>
                            <td className={styles.num}>{n.output}</td>
                            <td className={styles.num}>{n.cost}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className={styles.calcList}>
                    <div className={styles.calcRow}>
                      <span className={styles.label}>Before</span>
                      <span className={styles.calc}>
                        {m.before.calc} = <b>{m.before.total}</b>
                      </span>
                    </div>
                    <div className={styles.calcRow}>
                      <span className={styles.label}>After</span>
                      <span className={styles.calc}>
                        {m.after.calc} = <b>{m.after.total}</b>
                      </span>
                    </div>
                  </div>
                </div>
              </details>
            ))}
            </>
            )}

            {result.insights && (
            <div className={styles.insight}>
              <div className={styles.insightLabel}>핵심 인사이트</div>
              <ul className={styles.insightList}>
                {result.insights.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
            )}

            {result.assumptions && (
            <ul className={styles.assumptions}>
              {result.assumptions.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
            )}
          </section>
          )}

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
