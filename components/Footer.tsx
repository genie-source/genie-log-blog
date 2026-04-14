import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={styles.logo}>genie.log</span>
      <div className={styles.links}>
        <a href="https://github.com/genie-source" target="_blank" rel="noreferrer">GitHub</a>
        <a href="mailto:genie_lee@hufs.ac.kr">이메일</a>
      </div>
    </footer>
  )
}
