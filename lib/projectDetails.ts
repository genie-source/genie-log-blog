export type Decision = {
  title: string
  before: string
  after: string
  why: string
}

export type ProjectDetail = {
  tagline: string
  period: string
  problem: string
  flowIntro: string
  flowCaption: string
  decisions: Decision[]
  results: { metric: string; before: string; after: string; change: string }[]
  resultNote: string
  limits: string[]
  stack: string[]
  links: { label: string; href: string }[]
  relatedPosts: string[]
}

export const projectDetails: Record<string, ProjectDetail> = {
  bunrissok: {
    tagline: '사진 한 장으로 우리 동네 분리배출 규정을 안내하는 서비스',
    period: '2026. 08 – 09',
    problem:
      '학교나 직장 때문에 이사 온 20·30대가 지자체마다 다른 분리배출 규정 때문에 헷갈림',
    flowIntro:
      '분류가 확실하면 LLM 없이 바로 규정을 찾고 사용자가 "여기 없음"을 고를 때만 LLM이 다시 분류해요.',
    flowCaption: '파란 칸만 LLM을 호출해요. 초록 칸은 검색만 해요.',
    decisions: [
      {
        title: '노드마다 LLM → 꼭 필요한 곳에만',
        before: '규정 RAG · 가이드 생성 · QA 3개 노드가 각각 LLM 호출',
        after:
          '멘토의 오버엔지니어링 피드백을 반영해 규정 찾기는 LLM 없는 검색으로 바꾸고 답변 생성 단계를 없앰',
        why: '품목이 확정되면 규정은 정해져 있어서 생성할 필요가 없음',
      },
      {
        title: '임계값 자동 분기 → 사용자 확인',
        before: 'confidence 0.5 / 0.3~0.49 구간으로 자동 분기',
        after:
          '결과를 먼저 보여주고 묻기 · 후보 선택은 LLM 없이 반영 · "여기 없음"일 때만 Gemini 재분류',
        why: '애매한 사진은 모델보다 사진을 찍은 사용자가 가장 정확히 판단함',
      },
      {
        title: '지자체 규정 섞임 → 메타데이터 필터링',
        before: '비슷한 품목의 다른 지자체 규정이 검색돼 잘못 인용됨',
        after:
          '상위 법령과 다른 지자체 예외만 지역·품목 단위로 저장 · 문서 종류와 대분류·소분류로 필터 · 소분류가 없으면 대분류로 다시 검색',
        why: '예외만 저장하면 데이터가 작아지고 검색 대상이 명확해짐',
      },
    ],
    results: [
      { metric: 'LLM 호출 (100건당)', before: '120회', after: '10회', change: '91.7%' },
      {
        metric: '비용 (Gemini 2.5 Flash · 100건)',
        before: '$0.1370',
        after: '$0.0080',
        change: '94.1%',
      },
    ],
    resultNote:
      '확실:애매 요청 비율 90:10과 노드별 토큰 수를 가정해 계산한 추정치예요. 비용이 호출 수보다 더 줄어든 건 없앤 노드가 출력 토큰이 많은 생성 작업이었기 때문이에요.',
    limits: [
      '라벨과 이미지가 맞는지 검증하는 judge 노드는 구현했지만 무료 API 응답 시간 때문에 꺼둠 → 졸업논문에서 신뢰성 검증 중',
      '사용자의 "맞아요/아니에요" 선택으로 분류 모델을 다시 학습하는 파이프라인 구현 · 실제 운영 데이터는 아직 없음',
      '품목·재질·처리방법 관계를 담는 GraphRAG 확장 예정',
    ],
    stack: ['LangGraph', 'Pinecone', 'Upstage Embedding', 'Gemini', 'YOLO', 'FastAPI', 'React'],
    links: [{ label: '발표자료 PDF', href: '/files/bunrissok/bunrissok.pdf' }],
    relatedPosts: ['bunrissok-devlog'],
  },
}
