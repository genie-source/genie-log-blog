import Link from 'next/link'
import type { Project } from '@/lib/projects'
import styles from '@/app/page.module.css'

function CardBody({ project }: { project: Project }) {
  return (
    <>
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
      <div className={styles.stackPills}>
        {project.stack.map((s) => (
          <span key={s} className={styles.stackPill}>
            {s}
          </span>
        ))}
      </div>
      {project.hasDetail && <span className={styles.projectMore}>자세히 보기 →</span>}
    </>
  )
}

export default function ProjectCard({ project }: { project: Project }) {
  if (project.hasDetail) {
    return (
      <Link href={`/projects/${project.slug}`} className={`${styles.projectCard} ${styles.projectCardLink}`}>
        <CardBody project={project} />
      </Link>
    )
  }
  if (project.link) {
    return (
      <a href={project.link} target="_blank" rel="noreferrer" className={`${styles.projectCard} ${styles.projectCardLink}`}>
        <CardBody project={project} />
      </a>
    )
  }
  return (
    <div className={styles.projectCard}>
      <CardBody project={project} />
    </div>
  )
}
