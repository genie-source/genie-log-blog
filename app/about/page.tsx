import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import styles from './page.module.css'

export const metadata = {
  title: '소개 — genie.log',
  description: '이진경 소개 페이지',
}

export default function AboutPage() {
  return (
    <>
      <Nav />
      <div className={styles.wrap}>

        {/* HERO */}
        <div className={styles.hero}>
          <div className={styles.heroGreeting}>// Hello, World!</div>
          <div className={styles.heroName}>이진경</div>
          <div className={styles.heroDesc}>
            한국외국어대학교 컴퓨터공학과 4학년입니다. 백엔드 개발과 데이터베이스에 관심이 많고, 서버와 인프라도 공부하고 있습니다. 아직 방향을 정해가는 중이지만, 배운 것들을 꾸준히 기록하며 성장하고 있어요.
          </div>
          <div className={styles.heroLinks}>
            <a className={`${styles.heroLink} ${styles.primary}`} href="/resume.pdf" target="_blank">이력서 다운로드</a>
            <a className={styles.heroLink} href="https://github.com/genie-source" target="_blank" rel="noreferrer">github.com/genie-source</a>
            <a className={styles.heroLink} href="mailto:genie_lee@hufs.ac.kr">genie_lee@hufs.ac.kr</a>
          </div>
        </div>

        {/* EXPERIENCE + SKILLS */}
        <div className={styles.twoCol}>
          <div>
            <div className={styles.sectionLabel}>Experience</div>
            <div className={styles.expList}>
              <div className={styles.expItem}>
                <div className={styles.expPeriod}>2024.09 —<br />2025.02</div>
                <div>
                  <div className={styles.expTitle}>백엔드 개발 인턴</div>
                  <div className={styles.expOrg}>// (주) OOO 회사</div>
                  <div className={styles.expDesc}>REST API 설계 및 개발, PostgreSQL 쿼리 최적화 작업 참여. 기존 Seq Scan 쿼리에 인덱스를 추가해 응답 속도 개선.</div>
                  <div className={styles.expTags}>
                    <span className={styles.expTag}>FastAPI</span>
                    <span className={styles.expTag}>PostgreSQL</span>
                    <span className={styles.expTag}>Docker</span>
                  </div>
                </div>
              </div>
              <div className={styles.expItem}>
                <div className={styles.expPeriod}>2024.03 —<br />2024.08</div>
                <div>
                  <div className={styles.expTitle}>교내 개발 동아리 활동</div>
                  <div className={styles.expOrg}>// OO 개발 동아리</div>
                  <div className={styles.expDesc}>팀 프로젝트 백엔드 파트 담당. Spring Boot 기반 API 서버 구축 및 AWS EC2 배포 경험.</div>
                  <div className={styles.expTags}>
                    <span className={styles.expTag}>Spring Boot</span>
                    <span className={styles.expTag}>MySQL</span>
                    <span className={styles.expTag}>AWS EC2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className={styles.sectionLabel}>Skills</div>
            {[
              { group: 'Languages',    skills: ['Python', 'Java', 'JavaScript', 'SQL'] },
              { group: 'Backend',      skills: ['FastAPI', 'Spring Boot', 'Node.js'] },
              { group: 'Database',     skills: ['PostgreSQL', 'MySQL', 'Redis'] },
              { group: 'Infra / Tools',skills: ['Docker', 'Linux', 'Nginx', 'Git', 'AWS EC2'] },
            ].map(({ group, skills }) => (
              <div key={group} className={styles.skillGroup}>
                <div className={styles.skillGroupName}>{group}</div>
                <div className={styles.skillPills}>
                  {skills.map((s) => <span key={s} className={styles.skillPill}>{s}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PROJECTS */}
        <div className={styles.oneCol}>
          <div className={styles.sectionLabel}>Projects</div>
          <div className={styles.projGrid}>
            {[
              {
                name: 'Adversarial Attack 분석 프로젝트',
                badge: '졸업작품', badgeBg: '#eef1ff', badgeColor: '#3d6cf4',
                desc: '영상에서 객체를 segmentation하고, adversarial attack을 적용하여 딥러닝 모델의 취약성을 분석하는 연구 프로젝트. YOLOv8 기반 segmentation 모델 실험 중.',
                stack: ['Python', 'PyTorch', 'YOLOv8', 'OpenCV'],
                github: '#', live: null,
              },
              {
                name: '개인 개발 블로그 (genie.log)',
                badge: '개인', badgeBg: '#f0fff8', badgeColor: '#1cc986',
                desc: '마크다운 파일 기반의 개인 개발 블로그. 백엔드·DBA·서버 공부 내용을 정리해 기록하는 공간. Next.js + SSG 방식으로 구현.',
                stack: ['Next.js', 'TypeScript', 'Vercel'],
                github: '#', live: '#',
              },
              {
                name: '팀 일정 관리 서비스',
                badge: '팀', badgeBg: '#fff8f0', badgeColor: '#f5a623',
                desc: '동아리 팀원들의 일정을 공유하고 관리하는 웹 서비스. Spring Boot REST API + MySQL 기반으로 구현, AWS EC2에 배포.',
                stack: ['Spring Boot', 'MySQL', 'AWS EC2', 'React'],
                github: '#', live: null,
              },
              {
                name: 'DB 성능 비교 실험',
                badge: '연구', badgeBg: '#fff0f0', badgeColor: '#f4573d',
                desc: 'PostgreSQL vs MySQL 인덱스 전략 및 쿼리 성능 비교 실험. 데이터베이스 수업 팀 프로젝트로 진행. EXPLAIN ANALYZE 기반 벤치마크 정리.',
                stack: ['PostgreSQL', 'MySQL', 'Python'],
                github: '#', live: null,
              },
            ].map((p) => (
              <div key={p.name} className={styles.projCard}>
                <div className={styles.projHeader}>
                  <div className={styles.projName}>{p.name}</div>
                  <span className={styles.projBadge} style={{ background: p.badgeBg, color: p.badgeColor }}>{p.badge}</span>
                </div>
                <div className={styles.projDesc}>{p.desc}</div>
                <div className={styles.projStack}>
                  {p.stack.map((s) => <span key={s}>{s}</span>)}
                </div>
                <div className={styles.projLinks}>
                  <a className={styles.projLink} href={p.github}>GitHub →</a>
                  {p.live && <a className={styles.projLink} href={p.live}>Live →</a>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* EDUCATION + CERTIFICATES */}
        <div className={styles.twoCol}>
          <div>
            <div className={styles.sectionLabel}>Education</div>
            <div className={styles.eduItem}>
              <div className={styles.eduPeriod}>2021.03 —<br />2025.02</div>
              <div>
                <div className={styles.eduSchool}>한국외국어대학교</div>
                <div className={styles.eduMajor}>컴퓨터공학과 (4학년 재학 중)</div>
                <div className={styles.eduNote}>// GPA 3.X / 4.5</div>
              </div>
            </div>
          </div>

          <div>
            <div className={styles.sectionLabel}>Certificates</div>
            <div className={styles.certList}>
              {[
                { name: '정보처리기사',   issuer: '한국산업인력공단',      date: '2024.06' },
                { name: 'SQLD (SQL 개발자)', issuer: '한국데이터산업진흥원', date: '2024.04' },
                { name: 'OPIc IM2',       issuer: 'ACTFL',                date: '2023.11' },
              ].map((c) => (
                <div key={c.name} className={styles.certItem}>
                  <div>
                    <div className={styles.certName}>{c.name}</div>
                    <div className={styles.certIssuer}>// {c.issuer}</div>
                  </div>
                  <div className={styles.certDate}>{c.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
      <Footer />
    </>
  )
}
