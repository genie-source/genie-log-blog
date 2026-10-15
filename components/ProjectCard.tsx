import Link from 'next/link'
import type { Project } from '@/lib/projects'
import styles from '@/app/page.module.css'

export default function ProjectCard({ project }: { project: Project }) {
  const clickable = project.hasDetail || project.link
  return (
    <div className={`${styles.projectCard} ${clickable ? styles.projectCardLink : ''}`}>
      <div className={styles.projectHead}>
        <div className={styles.projectTitleRow}>
          <span className={styles.projectName}>{project.name}</span>
          <span className={styles.projectOrigin}>{project.origin}</span>
        </div>
        <span className={styles.projectMeta}>{project.meta}</span>
      </div>
      <div className={styles.projectRows}>
        <div className={styles.projectRow}>
          <span className={styles.infoLabel}>Problem</span>
          <span>{project.problem}</span>
        </div>
        <div className={styles.projectRow}>
          <span className={styles.infoLabel}>Built</span>
          <span>{project.built}</span>
        </div>
        {project.result && (
          <div className={styles.projectRow}>
            <span className={styles.infoLabel}>Result</span>
            <span className={styles.projectResult}>
              {project.result}
              {project.resultNote && (
                <span className={styles.projectResultNote}> {project.resultNote}</span>
              )}
            </span>
          </div>
        )}
      </div>
      <div className={styles.projectActions}>
        {project.hasDetail && (
          <Link href={`/projects/${project.slug}`} className={`${styles.projectMore} ${styles.stretchedLink}`}>
            자세히 보기 →
          </Link>
        )}
        {!project.hasDetail && project.link && (
          <a href={project.link} target="_blank" rel="noreferrer" className={`${styles.projectMore} ${styles.stretchedLink}`}>
            바로가기 ↗
          </a>
        )}
        {project.github && (
          <a href={project.github} target="_blank" rel="noreferrer" className={styles.githubButton}>
            GitHub ↗
          </a>
        )}
      </div>
    </div>
  )
}
