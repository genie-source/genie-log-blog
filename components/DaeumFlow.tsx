type Tone = 'default' | 'llm' | 'search' | 'danger' | 'warn' | 'hold'

type Box = {
  x: number
  y: number
  title: string
  sub?: string
  tone?: Tone
}

const W = 180
const H = 64

const boxes: Box[] = [
  { x: 40, y: 0, title: '앱 목록 입력', sub: '스크린샷 OCR → 패키지명' },
  { x: 40, y: 112, title: '규칙 기반', sub: '알약 탐지 데이터와 정확 일치', tone: 'search' },
  { x: 316, y: 112, title: '위험', sub: '탐지 이력 있음', tone: 'danger' },
  { x: 40, y: 224, title: 'RAG 검색', sub: 'Pinecone 유사도 top-3', tone: 'search' },
  { x: 316, y: 224, title: '확인 필요', sub: '유사한 악성 앱 있음', tone: 'warn' },
  { x: 40, y: 336, title: '판단 보류', sub: '안전으로 표시하지 않음', tone: 'hold' },
  { x: 316, y: 448, title: 'LLM 설명 생성', sub: '근거 풀이 · 부모님 안내문', tone: 'llm' },
]

const tones: Record<Tone, { fill: string; stroke: string; text: string; sub: string }> = {
  default: { fill: '#ffffff', stroke: '#dddddd', text: '#111111', sub: '#888888' },
  llm: { fill: '#eef1ff', stroke: '#3d6cf4', text: '#3d6cf4', sub: '#3d6cf4' },
  search: { fill: '#f0fff8', stroke: '#1cc986', text: '#0e8a5a', sub: '#0e8a5a' },
  danger: { fill: '#fff0f0', stroke: '#f4573d', text: '#c9341c', sub: '#c9341c' },
  warn: { fill: '#fff8f0', stroke: '#f5a623', text: '#a86600', sub: '#a86600' },
  hold: { fill: '#f7f7f7', stroke: '#bbbbbb', text: '#555555', sub: '#777777' },
}

const lines: string[] = [
  '130,64 130,110',
  '220,144 314,144',
  '130,176 130,222',
  '220,256 314,256',
  '130,288 130,334',
  '496,144 544,144 544,470 498,470',
  '406,288 406,446',
  '130,400 130,480 314,480',
]

const labels = [
  { x: 267, y: 134, text: '일치', anchor: 'middle' },
  { x: 142, y: 204, text: '불일치', anchor: 'start' },
  { x: 267, y: 246, text: '≥ 0.80', anchor: 'middle' },
  { x: 142, y: 316, text: '< 0.80', anchor: 'start' },
] as const

export default function DaeumFlow() {
  return (
    <svg
      viewBox="0 -8 600 528"
      role="img"
      aria-label="닿음 판정 흐름: 앱 패키지명을 알약 탐지 데이터와 정확히 비교해 일치하면 위험. 불일치하면 RAG 유사도 검색으로 0.80 이상이면 확인 필요, 미만이면 판단 보류. 세 판정 모두 LLM이 설명과 부모님 안내문을 생성."
      style={{ width: '100%', maxWidth: 600, height: 'auto', display: 'block', margin: '0 auto' }}
    >
      <defs>
        <marker id="daeum-arrow" orient="auto" markerWidth="8" markerHeight="8" refX="7" refY="4">
          <path d="M0 0 L8 4 L0 8 Z" fill="#bbbbbb" />
        </marker>
      </defs>
      {lines.map((points) => (
        <polyline
          key={points}
          points={points}
          fill="none"
          stroke="#bbbbbb"
          strokeWidth={2}
          strokeLinejoin="round"
          markerEnd="url(#daeum-arrow)"
        />
      ))}
      {boxes.map((b) => {
        const t = tones[b.tone ?? 'default']
        return (
          <g key={b.title}>
            <rect x={b.x} y={b.y} width={W} height={H} rx={12} fill={t.fill} stroke={t.stroke} />
            <text x={b.x + W / 2} y={b.sub ? b.y + 28 : b.y + 37} textAnchor="middle" fontSize={14} fontWeight={700} fill={t.text}>
              {b.title}
            </text>
            {b.sub && (
              <text x={b.x + W / 2} y={b.y + 47} textAnchor="middle" fontSize={12} fill={t.sub}>
                {b.sub}
              </text>
            )}
          </g>
        )
      })}
      {labels.map((l) => (
        <text key={l.text} x={l.x} y={l.y} textAnchor={l.anchor} fontSize={13} fill="#888888">
          {l.text}
        </text>
      ))}
    </svg>
  )
}
