type Tone = 'default' | 'llm' | 'done'

type Box = { x: number; y: number; title: string; sub?: string; tone?: Tone }

const W = 240
const H = 64

const boxes: Box[] = [
  { x: 40, y: 0, title: '자기소개서 업로드', sub: 'DOCX → 본문 추출' },
  { x: 40, y: 112, title: 'Claude API 예상 질문', sub: '질문 · 의도 · 출처 (JSON)', tone: 'llm' },
  { x: 40, y: 224, title: '1단계 · 글로 답변', sub: '시간 제한 없음 · 의도 힌트', tone: 'done' },
  { x: 40, y: 336, title: '2단계 · 음성으로 답변', sub: '캐릭터 화면을 보며', tone: 'done' },
  { x: 40, y: 448, title: '3단계 · 면접관 영상', sub: '영상을 보며 실전처럼 답변', tone: 'done' },
]

const side: Box = { x: 340, y: 224, title: '답변 PDF 저장', sub: 'html2canvas + jsPDF' }

const tones: Record<Tone, { fill: string; stroke: string; text: string; sub: string }> = {
  default: { fill: '#ffffff', stroke: '#dddddd', text: '#111111', sub: '#888888' },
  llm: { fill: '#eef1ff', stroke: '#3d6cf4', text: '#3d6cf4', sub: '#3d6cf4' },
  done: { fill: '#f0fff8', stroke: '#1cc986', text: '#0e8a5a', sub: '#0e8a5a' },
}

const lines = ['160,64 160,110', '160,176 160,222', '160,288 160,334', '160,400 160,446', '280,256 338,256']

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

export default function TiumFlow() {
  return (
    <svg
      viewBox="0 -8 600 528"
      role="img"
      aria-label="틔움 흐름: 자기소개서 업로드, Claude API 예상 질문 생성, 1단계 글 답변과 PDF 저장, 2단계 캐릭터를 보며 음성 답변, 3단계 면접관 영상을 보며 답변."
      style={{ width: '100%', maxWidth: 600, height: 'auto', display: 'block', margin: '0 auto' }}
    >
      <defs>
        <marker id="tium-arrow" orient="auto" markerWidth="8" markerHeight="8" refX="7" refY="4">
          <path d="M0 0 L8 4 L0 8 Z" fill="#bbbbbb" />
        </marker>
      </defs>
      {lines.map((points) => (
        <polyline key={points} points={points} fill="none" stroke="#bbbbbb" strokeWidth={2} markerEnd="url(#tium-arrow)" />
      ))}
      {boxes.map((b) => (
        <BoxView key={b.title} b={b} />
      ))}
      <BoxView b={side} />
    </svg>
  )
}
