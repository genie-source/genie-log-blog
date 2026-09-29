import Link from 'next/link'
import styles from './Nav.module.css'

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>
        genie<em>.</em>log
      </Link>
    </nav>
  )
}
