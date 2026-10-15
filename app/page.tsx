import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import PostRow from "@/components/PostRow";
import { getAllPosts } from "@/lib/posts";
import { projects, selectedPostSlugs, LINKEDIN_URL } from "@/lib/projects";
import styles from "./page.module.css";

const now = [
  {
    color: "#1cc986",
    title: "한국어 검색 모델의 부정 이해 벤치마크",
    sub: "NevIR 한국어판 구축",
  },
  {
    color: "#f5a623",
    title: "졸업논문",
    sub: "Separating Logical Difficulty from Stylistic Cues in Text Anomaly Detection",
  },
];

export default function Home() {
  const posts = getAllPosts();
  const selectedPosts = selectedPostSlugs
    .map((slug) => posts.find((p) => p.slug === slug))
    .filter((p) => p !== undefined);

  return (
    <>
      <Nav />
      <main>
        {/* PROFILE */}
        <div className={styles.profileWrap}>
          <div className={styles.sectionLabel}>About Me</div>
          <div className={styles.profileCard}>
            <div className={styles.profileLeft}>
              <div className={styles.profileHead}>
                <div className={styles.profileName}>이진경</div>
                <p className={styles.profileTagline}>
                  판단이 애매할 때 멈추고
                  <br /> 필요할 때만 LLM을 부르는 RAG를 만듭니다.
                </p>
                <p className={styles.profilePath}>
                  HUFS 컴퓨터공학 → RAG·Agent Engineer
                </p>
              </div>
              <div className={styles.profileInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Email</span>
                  <span className={styles.infoValue}>genie_lee@hufs.ac.kr</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Univ</span>
                  <span className={styles.infoValue}>
                    한국외국어대학교 컴퓨터공학과
                  </span>
                </div>
              </div>
              <div className={styles.linkButtons}>
                <a
                  href="https://github.com/genie-source"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.linkButton}
                >
                  GitHub ↗
                </a>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.linkButton}
                >
                  LinkedIn ↗
                </a>
              </div>
            </div>
            <div className={styles.profileRight}>
              <div className={styles.rightBlock}>
                <div className={styles.rightBlockLabel}>Now</div>
                <div className={styles.workList}>
                  {now.map((item) => (
                    <div key={item.title} className={styles.workItem}>
                      <div
                        className={styles.workDot}
                        style={{ background: item.color }}
                      />
                      <div>
                        <div className={styles.workTitle}>{item.title}</div>
                        <div className={styles.workSub}>{item.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.rightBlock}>
                <div className={styles.rightBlockLabel}>Tech Stack</div>
                <div className={styles.techPills}>
                  {[
                    "Python",
                    "LangChain",
                    "LangGraph",
                    "Pinecone",
                    "PyTorch",
                    "FastAPI",
                    "React",
                  ].map((tech) => (
                    <span key={tech} className={styles.techPill}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PROJECTS */}
        <div className={styles.projectsWrap}>
          <div className={styles.sectionLabel}>Projects</div>
          <div className={styles.projectGrid}>
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>

        {/* POSTS */}
        <div className={styles.postsWrap}>
          <div className={styles.sectionLabel}>Selected Posts</div>
          <div className={styles.postList}>
            {selectedPosts.map((post) => (
              <PostRow key={post.slug} post={post} />
            ))}
          </div>
          <Link href="/posts" className={styles.allPostsBtn}>
            전체 글 보기 →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
