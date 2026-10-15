type Box = {
  x: number
  y: number
  title: string
  sub?: string
  tone?: 'llm' | 'search'
}

const W = 180
const H = 64

const boxes: Box[] = [
  { x: 40, y: 0, title: '사진 촬영' },
  { x: 40, y: 112, title: 'YOLO 분류', sub: '후보와 confidence' },
  { x: 40, y: 224, title: '사용자 확인', sub: '"이거 맞아요?"' },
  { x: 316, y: 224, title: '후보 3개 제시', sub: '+ 여기 없음' },
  { x: 316, y: 368, title: 'Gemini 재분류', sub: 'LLM 호출 1회', tone: 'llm' },
  { x: 40, y: 512, title: '규정 검색', sub: '메타데이터 필터 · LLM 없음', tone: 'search' },
]

const tones = {
  default: { fill: '#ffffff', stroke: '#dddddd', text: '#111111', sub: '#888888' },
  llm: { fill: '#eef1ff', stroke: '#3d6cf4', text: '#3d6cf4', sub: '#3d6cf4' },
  search: { fill: '#f0fff8', stroke: '#1cc986', text: '#0e8a5a', sub: '#0e8a5a' },
}

// [points, hasArrowHead]
const lines: [string, boolean][] = [
  ['130,64 130,110', true],
  ['130,176 130,222', true],
  ['220,256 314,256', true],
  ['130,288 130,510', true],
  ['406,288 406,366', true],
  ['406,432 406,533 222,533', true],
  ['496,256 544,256 544,555 222,555', true],
]

const labels = [
  { x: 267, y: 246, text: '아니에요', anchor: 'middle' },
  { x: 142, y: 404, text: '맞아요', anchor: 'start' },
  { x: 418, y: 332, text: '여기 없음', anchor: 'start' },
  { x: 462, y: 575, text: '후보 선택', anchor: 'middle' },
] as const

export default function BunrissokFlow() {
  return (
    <svg
      viewBox="0 -8 600 600"
      role="img"
      aria-label="분리쏙 처리 흐름: 사진 촬영 후 YOLO 분류, 사용자 확인. 맞으면 바로 규정 검색, 아니면 후보 3개 제시. 후보를 고르면 규정 검색, 여기 없음을 고르면 Gemini 재분류 후 규정 검색."
      style={{ width: '100%', maxWidth: 600, height: 'auto', display: 'block', margin: '0 auto' }}
    >
      <defs>
        <marker id="flow-arrow" orient="auto" markerWidth="8" markerHeight="8" refX="7" refY="4">
          <path d="M0 0 L8 4 L0 8 Z" fill="#bbbbbb" />
        </marker>
      </defs>
      {lines.map(([points, head]) => (
        <polyline
          key={points}
          points={points}
          fill="none"
          stroke="#bbbbbb"
          strokeWidth={2}
          strokeLinejoin="round"
          markerEnd={head ? 'url(#flow-arrow)' : undefined}
        />
      ))}
      {boxes.map((b) => {
        const t = tones[b.tone ?? 'default']
        return (
          <g key={b.title}>
            <rect x={b.x} y={b.y} width={W} height={H} rx={12} fill={t.fill} stroke={t.stroke} />
            <text
              x={b.x + W / 2}
              y={b.sub ? b.y + 28 : b.y + 37}
              textAnchor="middle"
              fontSize={14}
              fontWeight={700}
              fill={t.text}
            >
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
