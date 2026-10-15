import styles from './Footer.module.css'
import { LINKEDIN_URL } from '@/lib/projects'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={styles.logo}>genie.log</span>
      <div className={styles.links}>
        <a href="https://github.com/genie-source" target="_blank" rel="noreferrer">GitHub</a>
        <a href="mailto:genie_lee@hufs.ac.kr">이메일</a>
        <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">LinkedIn</a>
      </div>
    </footer>
  )
}
