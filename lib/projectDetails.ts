export type Decision = {
  title: string
  before: string
  after: string
  why: string
}

export type CostModel = {
  model: string
  price: string
  nodes: { node: string; input: string; output: string; cost: string }[]
  before: { calc: string; total: string }
  after: { calc: string; total: string }
  rate: string
}

export type ResultAnalysis = {
  summary: string
  highlights: { label: string; value: string }[]
  cases?: { label: string; before: string; after: string }[]
  calls?: { before: string; after: string; rate: string }
  costModels?: CostModel[]
  insights?: string[]
  assumptions?: string[]
}

export type ProjectDetail = {
  tagline: string
  period?: string
  problem: string
  flowIntro: string
  flowCaption: string
  decisions: Decision[]
  result?: ResultAnalysis
  screens?: { src: string; alt: string; caption: string; small?: boolean }[]
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
      '분류가 확실하면 LLM 없이 바로 규정을 찾고 사용자가 "여기 없음"을 고를 때만 LLM이 다시 분류합니다.',
    flowCaption: '파란 칸만 LLM을 호출합니다. 초록 칸은 검색만 합니다.',
    decisions: [
      {
        title: '규정 생성 LLM → 순수 검색',
        before:
          '확실한 사진도 규정을 찾은 뒤 LLM이 답변을 생성 · 애매한 사진은 재분류 + judge 검증 + 규정 생성으로 LLM 3회',
        after:
          '멘토의 오버엔지니어링 피드백을 반영해 disposal_lookup을 메타데이터 필터 검색만으로 다시 설계하고 judge 노드를 비활성화',
        why: '품목이 확정되면 규정은 이미 정해져 있어서 LLM이 새로 생성할 필요가 없음',
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
    result: {
      summary:
        'judge 노드를 끄고 규정 조회(disposal_lookup)를 LLM 없는 순수 검색으로 다시 설계했습니다. 100건 요청 기준 LLM 호출이 120회에서 10회로 줄었고 없앤 노드가 출력 토큰을 많이 쓰는 생성 작업이라 비용은 그보다 더 많이 줄었습니다.',
      highlights: [
        { label: 'LLM 호출', value: '91.7%↓' },
        { label: '비용 · Gemini 2.5 Flash', value: '94.1%↓' },
        { label: '비용 · Gemini 3.8 Flash', value: '93.1%↓' },
      ],
      cases: [
        { label: '확실 (90%)', before: '규정 생성 1회', after: '0회' },
        {
          label: '애매 (10%)',
          before: '재분류 + 검증(judge) + 규정 생성 = 3회',
          after: '재분류(classify)만 1회',
        },
      ],
      calls: {
        before: '90% × 1 + 10% × 3 = 120회',
        after: '90% × 0 + 10% × 1 = 10회',
        rate: '91.7%',
      },
      costModels: [
        {
          model: 'Gemini 2.5 Flash',
          price: '입력 $0.30 / 출력 $2.50 (백만 토큰당)',
          nodes: [
            { node: 'classify', input: '1,432', output: '150', cost: '$0.00080' },
            { node: 'judge (개선 전만)', input: '1,232', output: '50', cost: '$0.00049' },
            { node: '규정 검색 + 답변 생성 (개선 전만)', input: '800', output: '400', cost: '$0.00124' },
          ],
          before: { calc: '확실 90 × $0.00124 + 애매 10 × $0.00254', total: '$0.1370' },
          after: { calc: '확실 0 + 애매 10 × $0.00080', total: '$0.0080' },
          rate: '94.1%',
        },
        {
          model: 'Gemini 3.8 Flash',
          price: '입력 $0.75 / 출력 $3.75 (백만 토큰당)',
          nodes: [
            { node: 'classify', input: '1,432', output: '150', cost: '$0.00164' },
            { node: 'judge (개선 전만)', input: '1,232', output: '50', cost: '$0.00111' },
            { node: '규정 검색 + 답변 생성 (개선 전만)', input: '800', output: '400', cost: '$0.00210' },
          ],
          before: { calc: '확실 90 × $0.00210 + 애매 10 × $0.00485', total: '$0.2375' },
          after: { calc: '확실 0 + 애매 10 × $0.00164', total: '$0.0164' },
          rate: '93.1%',
        },
      ],
      insights: [
        '비용 절감률이 호출 절감률보다 큰 건 출력 토큰 단가가 입력보다 훨씬 비싸기 때문입니다 (2.5 Flash 8.3배 · 3.8 Flash 5배).',
        '없앤 노드(judge · 규정 생성)가 출력 비중이 큰 생성 작업이라 생성형 응답을 검색으로 바꾼 효과가 비용에서 더 크게 나타납니다.',
      ],
      assumptions: [
        '토큰 수와 확실:애매 비율 90:10은 예시 가정값입니다. 실제 시스템 프롬프트와 이미지 해상도로 다시 계산해야 합니다.',
        '이미지 1장 ≈ 1,032토큰 (768×768 타일 4개) · 환율 1,361원/$ (2026-09-22 기준)',
        '가격 출처: OpenRouter의 Gemini 2.5 Flash · Gemini 3.8 Flash 가격 (3.8 Flash는 2026-12-31까지 기준)',
      ],
    },
    limits: [
      '라벨과 이미지가 맞는지 검증하는 judge 노드는 구현했지만 무료 API 응답 시간 때문에 꺼둠 → 졸업논문에서 신뢰성 검증 중',
      '사용자의 "맞아요/아니에요" 선택으로 분류 모델을 다시 학습하는 파이프라인 구현 · 실제 운영 데이터는 아직 없음',
      '품목·재질·처리방법 관계를 담는 GraphRAG 확장 예정',
    ],
    stack: ['LangGraph', 'Pinecone', 'Upstage Embedding', 'Gemini', 'YOLO', 'FastAPI', 'React'],
    links: [
      { label: 'GitHub 레포', href: 'https://github.com/rkqls8522/recycling_ssg' },
      { label: '발표자료 PDF', href: '/files/bunrissok/bunrissok.pdf' },
    ],
    relatedPosts: ['bunrissok-devlog'],
  },
  daeum: {
    tagline: '부모님 스마트폰의 의심 앱을 가족이 함께 확인하는 보안 케어 서비스',
    problem:
      '디지털 취약 계층을 위한 보안 앱인데 정작 그 앱을 부모님이 직접 써야 하고 탐지 결과도 어려워서 실제 대응으로 이어지지 않음',
    flowIntro:
      '정확히 일치하는 악성 앱은 바로 위험으로 판정하고 처음 보는 앱은 유사도로 판단합니다. 유사도가 기준보다 낮으면 안전하다고 말하지 않고 판단을 보류합니다.',
    flowCaption:
      '초록 칸은 검색만 하고 파란 칸만 LLM을 호출합니다. LLM은 판정에 관여하지 않고 판정이 끝난 뒤 설명만 만듭니다.',
    decisions: [
      {
        title: '주 사용자를 부모님 → 자녀로',
        before: '위험을 겪는 부모님이 직접 보안 앱을 설치하고 결과를 해석해야 함',
        after: '자녀가 부모님 폰의 위험을 확인하고 부모님이 따라 할 수 있는 안내문을 전달',
        why: '디지털 취약 계층에게 디지털 도구를 쓰라고 하는 모순을 풀기 위해서',
      },
      {
        title: '애매하면 판단 보류 (UNKNOWN)',
        before: '유사도만으로 위험과 안전을 나누면 처음 보는 악성 앱이 안전으로 표시될 수 있음',
        after:
          '유사도 0.80 이상만 MEDIUM으로 판정하고 미만은 UNKNOWN으로 보류 · UNKNOWN도 절대 안전으로 표시하지 않음',
        why: '보안에서는 틀린 "안전" 판정이 가장 위험해서 Precision을 우선함',
      },
      {
        title: '탐지보다 탐지 이후 행동에 집중',
        before: '기존 보안 서비스는 탐지와 차단에서 끝남',
        after: '판정 근거를 쉬운 말로 풀고 "지금 무엇을 해야 하는지"를 단계별 안내문으로 만듦',
        why: '이스트시큐리티 데이터에서 악성 앱이 탐지된 뒤에도 사용자가 예외 처리한 기록을 직접 발견함',
      },
      {
        title: 'LLM은 판정하지 않고 설명만',
        before: 'LLM이 직접 판정하면 존재하지 않는 악성코드를 지어낼 수 있음',
        after:
          '판정은 규칙(정확 일치)과 RAG 검색으로만 하고 LLM은 판정 뒤 설명만 생성 · JSON 출력을 강제하고 검색 결과에 없는 정보는 생성하지 않도록 프롬프트 설계',
        why: '보안 판정에서 환각은 곧 오탐이나 미탐이 되기 때문',
      },
    ],
    result: {
      summary:
        '판단 보류 구조로 유사도 기준 0.80에서 Precision 99%를 확보했습니다. 해커톤 성과로 참가자 200명 중 우수 수료생 20명에 선발되어 4주 OJT로 이어졌습니다.',
      highlights: [
        { label: 'Precision (threshold 0.80)', value: '99%' },
        { label: '검색 기준 개선', value: 'v1 → v3' },
        { label: '우수 수료생 선발', value: '20 / 200' },
      ],
      insights: [
        '알약 모바일 탐지 로그 1만 건에서 23개 필드 중 3개를 남기고 패키지명이 빈 1,465건을 제외해 학습·검색 데이터를 만들었습니다. Riskware가 59%로 편중된 불균형을 확인하고 전처리 전후 건수와 분포를 대조해 데이터 손실을 검증했습니다.',
        '검색 기준을 v1(패키지명만)에서 v3(이름 + 카테고리 + 판정 근거)까지 넓히며 비슷한 이름의 정상 앱과 악성 앱을 구분하도록 개선했습니다.',
        '패키지 데이터는 이미 패키지명 단위로 정리되어 있어 청킹 없이 레코드 하나를 벡터 하나로 저장했습니다.',
      ],
    },
    limits: [
      'UNKNOWN일 때 사용자가 무엇을 더 해야 하는지 안내가 부족함 → 판단 보류 이후 행동 안내 추가 예정',
      '패키지명 외 권한·설치 경로 같은 보안 요소로 확장하면 문서 구조가 바뀌어 청킹 전략을 새로 세워야 함',
      '임베딩은 한국어에 강한 Upstage Solar를 골랐지만 실제 검색 대상(패키지명)이 영어라 다른 모델과 비교가 필요함',
      '자녀가 부모님 폰 권한을 받아 직접 후속 조치를 할 수 있도록 확장 · GraphRAG 적용 검토 중',
    ],
    stack: ['FastAPI', 'LangChain', 'Pinecone', 'Upstage Solar Embedding', 'Alan LLM', 'Spring Boot', 'React', 'Docker'],
    links: [{ label: 'GitHub 레포', href: 'https://github.com/EST-AI-Challengers-31/saver' }],
    relatedPosts: [],
  },
  ojo: {
    tagline: '도로 사진 한 장으로 손상을 분석하고 점검 리포트 초안까지 만드는 점검 보조 플랫폼',
    problem:
      '담당자가 직접 순찰하며 육안으로 판단하는 방식이라 시간이 많이 들고 사람마다 판단 기준이 달라 점검 결과를 믿기 어려움',
    flowIntro:
      '손상 유무만 표시하는 데서 끝내지 않고 분할 결과를 면적·위치 지표로 바꾼 뒤 리포트 초안까지 이어지게 만들었습니다.',
    flowCaption:
      '초록 칸은 모델 추론과 지표 계산이고 파란 칸만 LLM을 호출합니다. AI는 판단을 보조하고 최종 결정은 담당자가 합니다.',
    decisions: [
      {
        title: '박스 탐지 → 픽셀 단위 분할',
        before:
          '제가 제안한 YOLO 계열 박스 탐지는 얇은 균열이나 경계가 불규칙한 포트홀의 면적을 재기 어려움',
        after:
          '후보 모델을 함께 파인튜닝해 비교한 뒤 팀원이 제안한 LiteRaceSegNet(Semantic Segmentation)을 채택 · 저는 학습 데이터 파이프라인과 프론트엔드를 맡는 것으로 역할을 다시 나눔',
        why: '손상 면적과 위치를 숫자로 뽑아야 보수 우선순위를 객관적으로 정할 수 있음',
      },
      {
        title: '데이터셋 구조 표준화',
        before: '모은 데이터셋마다 폴더 구조와 클래스 ID가 달라 그대로 학습에 넣을 수 없음',
        after:
          'organize.py로 폴더 구조와 클래스 ID를 하나로 맞추고 validate.py로 이미지·마스크 품질을 검증하는 단계를 만듦',
        why: '모델을 바꾸거나 데이터를 추가해도 같은 형식으로 바로 학습에 투입하기 위해서',
      },
      {
        title: '시각화에서 리포트 초안까지',
        before: '현장 사진을 사무실로 가져와 정리하고 보고서를 손으로 작성함',
        after:
          '원본과 분석 결과를 한 화면에 나란히 보여주고 손상 비율·유형·위치(카카오 지도 핀)를 바탕으로 LLM이 리포트 초안을 생성 · PDF로 다운로드',
        why: '반복되는 문서 작업을 줄이고 점검 기록의 형식을 일정하게 유지하기 위해서',
      },
    ],
    result: {
      summary:
        '팀 모델 LiteRaceSegNet은 mIoU 0.8072와 Precision 0.8864를 기록했고 파라미터 0.125M으로 이미지 한 장을 3.097ms에 처리합니다. 캡스톤디자인 경진대회에서 장려상을 받았습니다.',
      highlights: [
        { label: 'mIoU', value: '0.8072' },
        { label: 'Precision', value: '0.8864' },
        { label: '캡스톤디자인 경진대회', value: '장려상' },
      ],
      insights: [
        '구조 요소를 하나씩 뺀 비교에서 LiteASPP를 제거했을 때 mIoU가 0.0222로 가장 크게 떨어졌습니다. 문맥 정보가 도로 표면과 그림자를 구분하는 핵심이라는 뜻입니다.',
        '기존 연구의 아이디어(MobileNet · ASPP · Boundary-aware Segmentation)를 출처와 함께 밝히고 도로 손상에 맞춘 경량 재구성이라는 점을 기여 범위로 구분했습니다.',
      ],
      assumptions: [
        '데이터: train 2,400쌍 · val 10쌍 · test 10장 (AWS 검증 환경) · 검증 표본이 작아 일반화 해석은 보수적으로 봐야 합니다.',
      ],
    },
    limits: [
      'Boundary IoU 0.3212 · Recall 0.3350으로 작은 균열과 약한 경계는 놓치는 경우가 많음 → 경계 recall 개선이 다음 과제',
      '그림자나 도로 질감을 손상으로 잘못 검출할 가능성이 있음',
      '데이터 정리·검증 스크립트를 실제 포트홀 데이터로 다시 돌려 결과를 정리할 예정',
      '사진을 올리는 주체를 담당자 → 시민 → CCTV 자동 탐지로 넓혀도 같은 분석 파이프라인이 동작하도록 확장 구상',
    ],
    stack: ['React', 'Kakao Maps API', 'FastAPI', 'PyTorch', 'LiteRaceSegNet', 'LLM'],
    links: [{ label: 'GitHub 레포', href: 'https://github.com/ojo-hufs-ces-2026-capstone/capstone-project' }],
    relatedPosts: ['segmentation-robustness-eval', 'robustness-benchmark'],
  },
  tium: {
    tagline: '발표·면접 불안을 단계적으로 줄이는 점진적 노출 연습 서비스',
    problem:
      '발표·면접 불안이 큰 사람에게 처음부터 카메라를 켜고 실전처럼 연습하는 방식은 부담이 커서 연습을 시작하지 못함',
    flowIntro:
      '자기소개서로 맞춤 질문을 만든 뒤 글 → 음성 → 영상 순서로 조금씩 실전에 가까워지도록 설계했습니다.',
    flowCaption:
      '파란 칸만 LLM(Claude API)을 호출합니다. 초록 칸은 연습 단계이고 단계마다 답변을 모아 PDF로 저장할 수 있습니다.',
    screens: [
      { src: '/images/tium/landing.webp', alt: '틔움 랜딩 페이지', caption: '랜딩 · 가입 없이 바로 시작하고 평가나 저장 없이 가볍게 연습' },
      { src: '/images/tium/questions.webp', alt: '자기소개서 업로드 후 예상 질문 목록', caption: '자기소개서를 올리면 Claude API가 예상 질문을 만들어 보여줌' },
      { src: '/images/tium/step1-answer.webp', alt: '1단계 텍스트 답변 화면', caption: '1단계 · 시간 제한 없이 글로 답변 · 질문 의도를 힌트로 표시' },
      { src: '/images/tium/step1-complete.webp', alt: '1단계 완료 화면', caption: '1단계 완료 · 답변을 PDF로 저장하고 원할 때 다음 단계로' },
      {
        src: '/images/tium/character.webp',
        alt: '틔움 새싹 캐릭터',
        caption: '2단계 · 사람 대신 틔움 새싹 캐릭터를 마주 보며 목소리로 답변 · 누군가 앞에서 말하는 감각에 먼저 익숙해지는 단계',
        small: true,
      },
      { src: '/images/tium/step3-interviewer.webp', alt: '면접관 영상을 보며 답변하는 화면', caption: '3단계 · 면접관 영상을 보며 실전처럼 답변 · 답변 시간 타이머와 질문 이동' },
    ],
    decisions: [
      {
        title: '한 번에 실전 → 3단계 점진적 노출',
        before: '면접 연습 서비스 대부분이 처음부터 카메라와 실전 형식으로 연습하게 함',
        after: '1단계 글 답변 → 2단계 캐릭터를 보며 음성 답변 → 3단계 면접관 영상 순서로 부담을 조금씩 올림',
        why: '불안이 큰 사람은 첫 단계의 부담이 낮아야 연습을 시작할 수 있음',
      },
      {
        title: '일반 질문 → 자기소개서 기반 맞춤 질문',
        before: '누구에게나 같은 예상 질문 목록',
        after:
          'Claude API에 자기소개서를 넣어 질문 · 질문 의도 · 자소서 속 출처를 JSON으로 받고 의도를 답변 화면의 힌트로 보여줌',
        why: '내 경험에서 나온 질문이어야 실제 면접 준비로 이어짐',
      },
      {
        title: 'LLM 응답 실패 대비',
        before: 'LLM 응답 형식이 어긋나거나 API가 혼잡하면 화면이 멈춤',
        after:
          'JSON으로만 답하도록 프롬프트를 쓰고 코드 블록 표시를 지운 뒤 파싱 · 혼잡(503) · 요청 과다(429) · 파싱 실패(502) · 짧은 본문(400)을 나눠 안내',
        why: '외부 API 오류가 사용자에게 그대로 노출되지 않게 하기 위해서',
      },
      {
        title: '부담 없는 기록',
        before: '연습 기록을 남기려면 가입과 저장이 필요함',
        after: '가입 없이 시작하고 답변은 자동으로 모아 두었다가 html2canvas + jsPDF로 PDF 저장',
        why: '평가받는다는 느낌 없이 연습한 결과만 가져갈 수 있게',
      },
    ],
    limits: [
      '업로드 화면은 PDF·DOCX·TXT를 안내하지만 지금 백엔드는 DOCX만 읽음 → PDF·TXT 파서 추가 예정',
      '음성 답변 단계에서 STT로 답변을 텍스트로 바꿔 피드백하는 기능 구상',
    ],
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS v4', 'daisyUI', 'React Router', 'FastAPI', 'Claude API', 'html2canvas', 'jsPDF'],
    links: [{ label: 'GitHub 레포', href: 'https://github.com/genie-source/tieum' }],
    relatedPosts: [],
  },
}
