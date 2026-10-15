export type Project = {
  slug: string;
  name: string;
  origin: string;
  meta: string;
  problem: string;
  built: string;
  result?: string;
  resultNote?: string;
  stack: string[];
  /** 상세 페이지가 있으면 true, 없으면 link로 이동하거나 카드만 표시 */
  hasDetail?: boolean;
  link?: string;
  /** 카드에 GitHub 버튼으로 표시 */
  github?: string;
};

export const projects: Project[] = [
  {
    slug: "bunrissok",
    github: "https://github.com/rkqls8522/recycling_ssg",
    name: "분리쏙",
    origin: "이스트소프트 AI Challengers OJT",
    meta: "기획 / 프론트 / RAG·Agent",
    problem: "지자체마다 다른 분리배출 규정을 사진 한 장으로 안내",
    built:
      "사용자 확인 구조로 애매할 때만 LLM 호출 · 지자체별 메타데이터 필터링 · 부족한 클래스 이미지 직접 수집",
    result: "LLM 호출 91.7%↓ · 비용 94.1%↓",
    resultNote: "(추정)",
    stack: ["LangGraph", "Pinecone", "Gemini", "FastAPI", "React"],
    hasDetail: true,
  },
  {
    slug: "daeum",
    github: "https://github.com/EST-AI-Challengers-31/saver",
    name: "닿음",
    origin: "이스트소프트 AI Challengers 해커톤",
    meta: "PM / AI·RAG",
    problem: "디지털 취약 고령자의 악성앱 위험을 자녀가 대신 확인",
    built:
      "정확 일치 → 벡터 유사도 → LLM 설명 3단계 탐지 · 애매하면 UNKNOWN으로 판단 보류 · reranking v1→v3",
    result: "Precision 99% (threshold 0.80) · 200명 중 우수 수료생 20명",
    stack: ["FastAPI", "Pinecone", "Upstage Solar", "Alan LLM"],
    hasDetail: true,
  },
  {
    slug: "ojo",
    github: "https://github.com/ojo-hufs-ces-2026-capstone/capstone-project",
    name: "ojo",
    origin: "한국외국어대학교 캡스톤디자인",
    meta: "기획 / 데이터셋 / 프론트",
    problem: "담당자마다 주관적이던 도로 손상 판단을 표준 기준으로 탐지·리포트",
    built:
      "데이터셋 구조·클래스 ID 표준화 · 품질 검증 스크립트 · 탐지 결과 화면 · 후보 모델 비교로 세그멘테이션 모델 채택",
    result: "캡스톤디자인 경진대회 장려상",
    stack: ["LiteRaceSegNet", "Python", "React"],
    hasDetail: true,
  },
  {
    slug: "tium",
    github: "https://github.com/genie-source/tieum",
    name: "틔움",
    origin: "개인 프로젝트",
    meta: "기획 / 프론트 / 백엔드",
    problem: "발표·면접 불안을 단계적으로 줄이는 연습",
    built:
      "글 답변 → 캐릭터 보며 음성 답변 → 면접관 영상의 3단계 노출 구조 · Claude API로 자소서 기반 예상 질문 생성 · 답변 PDF 저장",
    stack: ["React", "TypeScript", "FastAPI", "Claude API"],
    hasDetail: true,
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** 홈 Selected Posts에 보여줄 글 (posts/ 폴더의 파일 이름, 보여줄 순서대로) */
export const selectedPostSlugs = [
  "bunrissok-devlog",
  "rag-dictionary-chain-lcel",
  "rag-full-pipeline-langchain",
  "text-preprocessing-vectorization",
];

export const LINKEDIN_URL =
  "https://www.linkedin.com/in/" + encodeURIComponent("진경-‍이-aa95ab420");
