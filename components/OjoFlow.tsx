type Tone = 'default' | 'llm' | 'model'

type Box = { x: number; y: number; title: string; sub?: string; tone?: Tone }

const W = 220
const H = 64

const boxes: Box[] = [
  { x: 40, y: 0, title: '도로 사진 업로드', sub: '스마트폰 촬영 · 카카오 지도 위치 핀' },
  { x: 40, y: 112, title: 'LiteRaceSegNet 분할', sub: '균열 · 포트홀 픽셀 마스크', tone: 'model' },
  { x: 40, y: 224, title: '지표 산출', sub: '손상 면적 비율 · 유형 · 위치', tone: 'model' },
  { x: 40, y: 336, title: 'LLM 리포트 초안', sub: '정량 지표 → 자연어 점검 리포트', tone: 'llm' },
  { x: 40, y: 448, title: '담당자 검토 · PDF 다운로드', sub: '최종 판단은 사람이' },
]

const side: Box = { x: 340, y: 112, title: '원본 · 결과 비교 화면', sub: '좌: 원본 / 우: 분할 오버레이' }

const tones: Record<Tone, { fill: string; stroke: string; text: string; sub: string }> = {
  default: { fill: '#ffffff', stroke: '#dddddd', text: '#111111', sub: '#888888' },
  llm: { fill: '#eef1ff', stroke: '#3d6cf4', text: '#3d6cf4', sub: '#3d6cf4' },
  model: { fill: '#f0fff8', stroke: '#1cc986', text: '#0e8a5a', sub: '#0e8a5a' },
}

const lines = [
  '150,64 150,110',
  '150,176 150,222',
  '150,288 150,334',
  '150,400 150,446',
  '260,144 338,144',
]

function BoxView({ b }: { b: Box }) {
  const t = tones[b.tone ?? 'default']
  return (
    <g>
      <rect x={b.x} y={b.y} width={W} height={H} rx={12} fill={t.fill} stroke={t.stroke} />
      <text x={b.x + W / 2} y={b.y + 28} textAnchor="middle" fontSize={14} fontWeight={700} fill={t.text}>
        {b.title}
      </text>
      {b.sub && (
        <text x={b.x + W / 2} y={b.y + 47} textAnchor="middle" fontSize={12} fill={t.sub}>
          {b.sub}
        </text>
      )}
    </g>
  )
}

export default function OjoFlow() {
  return (
    <svg
      viewBox="0 -8 600 528"
      role="img"
      aria-label="ojo 처리 흐름: 도로 사진 업로드, LiteRaceSegNet 분할, 손상 면적·유형·위치 지표 산출, LLM 리포트 초안 생성, 담당자 검토와 PDF 다운로드. 분할 결과는 원본과 나란히 비교 화면에 표시."
      style={{ width: '100%', maxWidth: 600, height: 'auto', display: 'block', margin: '0 auto' }}
    >
      <defs>
        <marker id="ojo-arrow" orient="auto" markerWidth="8" markerHeight="8" refX="7" refY="4">
          <path d="M0 0 L8 4 L0 8 Z" fill="#bbbbbb" />
        </marker>
      </defs>
      {lines.map((points) => (
        <polyline key={points} points={points} fill="none" stroke="#bbbbbb" strokeWidth={2} markerEnd="url(#ojo-arrow)" />
      ))}
      {boxes.map((b) => (
        <BoxView key={b.title} b={b} />
      ))}
      <BoxView b={side} />
    </svg>
  )
}
