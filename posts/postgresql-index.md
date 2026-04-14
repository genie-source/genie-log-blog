---
title: PostgreSQL 인덱스, 제대로 이해하고 쓰자
date: 2025-04-08
category: Database
description: B-Tree, Hash, GIN 인덱스를 언제, 어떻게 써야 하는지 실제 사례로 정리
readTime: 8분
---

쿼리가 느려서 `EXPLAIN ANALYZE`를 찍어봤더니 `Seq Scan`... 처음엔 왜 느린지 감도 안 잡혔는데, 인덱스를 공부하면서 그 이유를 알게 됐습니다.

## 왜 인덱스가 필요한가?

PostgreSQL은 기본적으로 테이블 전체를 처음부터 끝까지 읽는 **Sequential Scan**을 수행합니다. 데이터가 수백 건이라면 문제없지만, 수십만 건이 넘어가면 얘기가 달라집니다.

> 💡 인덱스가 항상 좋은 건 아닙니다. 쓰기(INSERT / UPDATE / DELETE) 성능을 희생하는 트레이드오프가 있어요.

## 인덱스의 종류

### B-Tree 인덱스

PostgreSQL의 기본 인덱스 타입입니다. `=`, `<`, `>`, `BETWEEN`, `LIKE 'abc%'` 같은 범위 조건에 효과적입니다.

```sql
-- B-Tree 인덱스 생성
CREATE INDEX idx_users_email
  ON users(email);

-- 실행 계획 확인
EXPLAIN ANALYZE
SELECT * FROM users
WHERE email = 'genie@example.com';
```

### GIN 인덱스

배열, JSONB, 전문 검색(Full-Text Search)에 사용합니다.

```sql
CREATE INDEX idx_posts_fts
  ON posts USING gin(
    to_tsvector('korean', content)
  );
```

## 실전 팁

- 카디널리티가 높은 컬럼에 인덱스를 걸어야 효과가 있습니다
- 복합 인덱스는 컬럼 순서가 중요합니다
- `EXPLAIN (ANALYZE, BUFFERS)`로 실제 I/O까지 확인하세요
- 불필요한 인덱스는 `pg_stat_user_indexes`로 찾아서 제거합니다
