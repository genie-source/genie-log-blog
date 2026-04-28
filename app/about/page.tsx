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
            Hi there 👋 I'm Jinkyung Lee<br/>
            I'm currently a senior student at Hankuk University of Foreign Studies.<br/>
            I'm interested in backend development, database.<br/>
            I hope to grow as a developer who understands systems deeply. ☀️<br/>

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
                <div className={styles.expPeriod}>2023 —<br />2024</div>
                <div>
                  <div className={styles.expTitle}>프론트엔드 개발자</div>
                  <div className={styles.expOrg}>// 구독 관리 SaaS 스타트업</div>
                  <div className={styles.expDesc}>
                    고객 미팅 피드백을 직접 제품에 반영하는 빠른 개발 루프로 운영. 150명 이상 규모 기업 고객 요청으로 CSV 업로드 기반 일괄 초대, 역할 기반 접근 권한(RBAC) UI, 권한 변경 이력 로그를 설계·개발. 배포 후 해당 고객사의 온보딩 소요 시간이 절반 이하로 단축.
                  </div>
                  <div className={styles.expTags}>
                    <span className={styles.expTag}>React</span>
                    <span className={styles.expTag}>RBAC</span>
                    <span className={styles.expTag}>SaaS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className={styles.sectionLabel}>Skills</div>
            {[
              { group: 'Languages',     skills: ['Python', 'Java', 'JavaScript', 'SQL'] },
              { group: 'Backend',       skills: ['FastAPI', 'Spring Boot'] },
              { group: 'Database',      skills: ['MySQL'] },
              { group: 'AI / ML',       skills: ['PyTorch'] },
              { group: 'Infra / Tools', skills: ['Linux', 'Git'] },
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
                name: 'Adversarial Attack 분석 (캡스톤)',
                badge: '졸업작품', badgeBg: '#eef1ff', badgeColor: '#3d6cf4',
                desc: 'SegFormer(B0/B1)와 DeepLab+MobileNetV3 두 모델에 FGSM 공격을 적용, 분할 성능 저하 패턴을 정량·정성 분석. SegFormer는 경미한 perturbation에서도 경계 영역 mIoU가 평균 18% 이상 하락하는 결과 도출. 노이즈 필터링 전략 제안으로 연구 마무리 중.',
                stack: ['Python', 'PyTorch', 'SegFormer', 'DeepLab', 'OpenCV', 'FGSM'],
                github: 'https://github.com/ojo-hufs-ces-2026-capstone/capstone-project', live: null,
              },
              {
                name: '멤버 초대 & RBAC 시스템',
                badge: '실무', badgeBg: '#f0fff8', badgeColor: '#1cc986',
                desc: '구독 관리 SaaS에서 150명+ 기업 고객 온보딩 문제를 해결하기 위해 직접 설계·개발. CSV 일괄 초대, 관리자·편집자·뷰어 3단계 권한 UI, 권한 변경 이력 로그 구현. 배포 후 온보딩 시간 50% 이상 단축.',
                stack: ['React', 'RBAC', 'CSV Upload'],
                github: null, live: null,
              },
              {
                name: '개인 개발 블로그 (genie.log)',
                badge: '개인', badgeBg: '#fff8f0', badgeColor: '#f5a623',
                desc: '마크다운 파일 기반 개인 개발 블로그. posts/ 폴더에 .md 파일을 추가하면 자동으로 포스팅되는 SSG 방식. Claude AI와 바이브 코딩으로 디자인부터 구현까지 진행.',
                stack: ['Next.js', 'TypeScript', 'Markdown', 'Vercel'],
                github: 'https://github.com/genie-source/genie-log-blog', live: null,
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
                  {p.github && <a className={styles.projLink} href={p.github}>GitHub →</a>}
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
            <div className={styles.expList}>
              <div className={styles.eduItem}>
                <div className={styles.eduPeriod}>2022 —<br />2025.02</div>
                <div>
                  <div className={styles.eduSchool}>한국외국어대학교</div>
                  <div className={styles.eduMajor}>컴퓨터공학과 편입 (4학년 재학 중)</div>
                </div>
              </div>
              <div className={styles.eduItem}>
                <div className={styles.eduPeriod}>2021</div>
                <div>
                  <div className={styles.eduSchool}>위코드 부트캠프 수료</div>
                  <div className={styles.eduMajor}>프론트엔드 과정</div>
                </div>
              </div>
            </div>
          </div>

          {/* <div>
            <div className={styles.sectionLabel}>Certificates</div>
            <div className={styles.certList}>
              {[
                { name: 'TOEIC SPEAKING',      issuer: 'IM1',      date: '2026.04' },
                { name: 'TOEIC',      issuer: '730',      date: '2024.09' },
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
          </div> */}
        </div>

      </div>
      <Footer />
    </>
  )
}
