---
title: "Claude와 바이브 코딩으로 개발 블로그 만들기"
date: 2026-05-13
category: 개발일지
description: 디자인부터 배포까지, AI와 함께한 블로그 개발기
---

벨로그에 글을 올리다가 나만의 블로그가 갖고 싶어졌습니다.  
직접 만들어보고 싶다는 생각은 있었지만 디자인도 막막하고 Next.js로 처음부터 구현하자니 시작이 쉽지 않았습니다. 그래서 Claude와 대화하며 만들어가는 바이브 코딩 방식으로 진행해봤습니다.


## 기능

- 마크다운 파일 기반 포스팅 (`posts/` 폴더에 `.md` 파일 추가 시 자동 게시)
- 카테고리별 분류 및 색상 구분
- 포스트 상세 페이지 + 관련 글
- About 페이지 (소개, 스킬, 프로젝트, 학력, 자격증)
- AI Stories 섹션
- 반응형 지원 (모바일 대응)
- Vercel 자동 배포 (push 시 즉시 반영)


## 기술 스택

- **Framework** — Next.js 16 (App Router)
- **Language** — TypeScript
- **Styling** — CSS Modules
- **포스팅** — Markdown + gray-matter
- **배포** — Vercel
- **도메인** — genie.io.kr (가비아)


## 어떻게 만들었냐면

### 대화로 디자인을 잡았습니다

처음엔 다크 테마에 컬러풀한 느낌으로 시작했다가 pxd 기술 블로그를 참고해서 방향을 바꿨습니다.  
"이 블로그처럼 만들어줘"라고 말하니 그 느낌이 나왔습니다.

이후에는 마음에 안 드는 부분을 하나씩 말하며 다듬었습니다.

- "프로필 사진 없애줘"
- "볼드체 빼줘"
- "소개 페이지 연결하는 버튼 추가해줘"

이런 대화를 반복하면서 지금의 디자인이 완성됐습니다.

### 포스팅 방식

가장 중요하게 생각한 건 글 쓰는 과정이 번거롭지 않아야 한다는 점이었습니다.  
`posts/` 폴더에 마크다운 파일 하나를 추가하면 자동으로 포스팅되는 구조로 만들었습니다.

```markdown
---
title: 글 제목
date: 2026-04-15
category: Database
description: 짧은 설명
---

본문...
```

`lib/posts.ts`에서 빌드 시점에 폴더를 읽어 정적 페이지를 생성합니다. CMS도, 관리자 페이지도 없이 파일 하나로 동작합니다.

```typescript
export function getAllPosts(): PostMeta[] {
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'))
  return files
    .map((filename) => {
      const { data } = matter(
        fs.readFileSync(path.join(postsDir, filename), 'utf-8')
      )
      return {
        slug: filename.replace(/\.md$/, ''),
        title: data.title,
        date: data.date ? String(data.date) : '',
        category: data.category,
        description: data.description,
      }
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}
```

### 배포

GitHub 레포를 만들고 Vercel에 연결한 뒤, 가비아에서 `genie.io.kr` 도메인을 구매해 연결했습니다.  
이후에는 `git push`만 하면 자동으로 배포됩니다.


## 느낀점

### 바이브 코딩에 대해

직접 해보니 생각보다 훨씬 간편했습니다.  
원하는 방향을 말로 설명하면 코드가 나오고 마음에 안 드는 부분은 다시 말하면 바로 수정됩니다. 코드를 한 줄씩 직접 짜는 것보다 훨씬 빠르게 결과물을 볼 수 있었습니다.

다만 방향을 잡는 건 결국 사람의 몫이었습니다.  
-> 어떤 구조로 만들지, 어떤 디자인으로 갈지, 어떤 기능이 필요한지  
이걸 명확하게 알고 있어야 원하는 결과가 나왔습니다. 도구가 편해졌을 뿐 생각하는 것은 여전히 제가 해야 하는 일이었습니다.

### 앞으로

이 블로그를 공부한 내용을 기록하는 공간으로 꾸준히 채워나갈 예정입니다.  
배우면서 정리한 것들을 쌓다 보면 언젠가 이 블로그 자체가 저를 잘 나타내는 하나의 기록이 될 것 같습니다.
