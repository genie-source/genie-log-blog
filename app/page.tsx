import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PostList from "@/components/PostList";
import { getAllPosts, getAllCategories } from "@/lib/posts";
import styles from "./page.module.css";

export default function Home() {
  const posts = getAllPosts();
  const categories = getAllCategories(posts);

  return (
    <>
      <Nav />
      <main>
        {/* PROFILE */}
        <div className={styles.profileWrap}>
          <div className={styles.sectionLabel}>About Me</div>
          <div className={styles.profileCard}>
            <div className={styles.profileLeft}>
              <div className={styles.profileName}>이진경</div>
              <div className={styles.profileInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Email</span>
                  <span className={styles.infoValue}>genie_lee@hufs.ac.kr</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>GitHub</span>
                  <span className={styles.infoValue}>
                    <a
                      href="https://github.com/genie-source"
                      target="_blank"
                      rel="noreferrer"
                    >
                      github.com/genie-source
                    </a>
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Univ</span>
                  <span className={styles.infoValue}>
                    한국외국어대학교 컴퓨터공학과
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>City</span>
                  <span className={styles.infoValue}>Seoul, Korea</span>
                </div>
              </div>
            </div>
            <div className={styles.profileRight}>
              <div className={styles.rightBlock}>
                <div className={styles.rightBlockLabel}>Tech Stack</div>
                <div className={styles.techPills}>
                  {["Python", "LangChain", "LangGraph", "Pinecone", "FastAPI", "React"].map((tech) => (
                    <span key={tech} className={styles.techPill}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className={styles.rightBlock}>
                <div className={styles.rightBlockLabel}>
                  Currently Working On
                </div>
                <div className={styles.workList}>
                  <div className={styles.workItem}>
                    <div
                      className={styles.workDot}
                      style={{ background: "#3d6cf4" }}
                    />
                    <div>
                      <div className={styles.workTitle}>
                        분리배출 안내 서비스 <strong>분리쏙</strong>에서 재분류
                        검증(judge) 루프를 다시 연결하고, 품목·재질 관계를 담는
                        GraphRAG 확장을 준비하고 있습니다.
                      </div>
                      <div className={styles.workSub}>
                        4인 팀 프로젝트 · 졸업논문으로 이어가는 중
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className={styles.aboutBtnWrap}>
                <Link href="/about" className={styles.aboutBtn}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="8" cy="5.5" r="2.5"/>
                    <path d="M2.5 13.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" strokeLinecap="round"/>
                  </svg>
                  소개 페이지 보기
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div> */}
            </div>
          </div>
        </div>

        {/* POSTS */}
        <div className={styles.postsWrap}>
          <div className={styles.sectionLabel}>Post</div>
          <PostList posts={posts} categories={categories} />
        </div>
      </main>
      <Footer />
    </>
  );
}
