---
title: "Retrieval 효율 개선을 위한 키워드 사전 활용"
date: 2026-07-24
category: 학습정리
description: 사용자 표현과 문서 용어의 불일치 문제를 dictionary_chain으로 해결하고, LCEL 파이프 연산자로 체인을 연결하는 방법 정리
---

### 기존 코드의 문제점

<aside>
⛔

**한계** : 사용자 표현과 문서 표현 간의 **용어 불일치**가 발생

</aside>

```python
query = '연봉 5천만원인 직장인의 소득세는 얼마인가요?'
```

- 실제 문서에는 과세 대상을 지칭할 때 "직장인"이라는 표현을 쓰지 않고 법률 용어인 "거주자" 명시돼 있다.
- 그치만 사용자는 일상적인 표현인 "직장은"을 사용
- 벡터 검색(retriever)은 query 임베딩과 문서 임베딩 간의 **유사도를 기반**으로 동작하는데 직장인-거주자는 실제 임베딩 공간에서 완벽히 가깝게 매핑되지 않을 수 있다.
- 즉 사용자가 아무리 질문을 명확하게 했어도 **문서에서 쓰는 용어와 사용자가 쓰는 용어가 다르면 검색 품질(정확도)이 떨어지는 근본적인 한계**가 있다

이 한계를 해결하기 위해 도입한 것이 **dictionary_chain**이다.
검색 전에 LLM을 활용해

1. 사용자의 query를 문서에서 **실제로 사용하는 용어로 먼저 변환**해준 다음
2. **변환된 query로 검색을 수행**하는 전처리 단계를 추가한 것이다.

## LCEL(Langchain Expression Language)

Langchain에서 여러 컴포넌트를 파이프 연산자 (`|`)로 연결해서 하나의 실행 흐름(체인)을 선언적으로 구성하는 문법이다.

### 사용 이유

1. **가독성** : 여러 단계를 별도 함수로 만들지 않고도 데이터 흐름을 한눈에 볼 수 있다.
2. **일관된 실행 방식** : 체인이 얼마나 복잡하든 항상 동일한 메서드로 실행한다.
3. **체인 연결(합성)이 쉬움** : 체인 자체도 하나의 `Runnable` 이라서 체인과 체인을 다시 `|` 로 이어붙여 더 큰 체인을 만들 수 있다.

### 체인 만들기

```python
# query를 직장인 -> 거주자로 변경하는 chain 추가

from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate

dictionary = ["사람을 나타내는 표현 -> 거주자"]

prompt = ChatPromptTemplate.from_template("""
    사용자의 질문을 보고 우리의 사전을 참고해서 사용자의 질문을 변경해주세요.
    만약 변경할 필요가 없다고 판단된다면 사용자의 질문을 변경하지 않아도 됩니다.
    그런 경우에는 질문만 리턴해주세요.
    사전 : {dictionary}
    질문 : {question}
""")

dictionary_chain = prompt | llm | StrOutputParser()

tax_chain = {"query": dictionary_chain} | qa_chain
ai_response = tax_chain.invoke({"question": query, "dictionary": dictionary})
```

**👀 한 줄씩 뜯어보기**

```python
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
```

- `StrOutputParser` : 변수를 채워 넣을 수 있는 프롬프트 템플릿을 만드는 클래스
- `ChatPromptTemplate` : LLM의 응답 객체에서 순수 텍스트만 뽑아내는 파서

```python
dictionary = ["사람을 나타내는 표현 -> 거주자"]
```

- 질문 속 표현을 어떻게 바꿀지 정의한 규칙(사전)
- 이 규칙을 통해 질문을 문서 용어에 맞게 변환하려는 것이다.

```python
prompt = ChatPromptTemplate.from_template("""
    사용자의 질문을 보고 우리의 사전을 참고해서 사용자의 질문을 변경해주세요.
    만약 변경할 필요가 없다고 판단된다면 사용자의 질문을 변경하지 않아도 됩니다.
    그런 경우에는 질문만 리턴해주세요.
    사전 : {dictionary}
    질문 : {question}
""")
```

- LLM에게 내릴 지시사항을 담은 프롬프트 템플릿

```python
dictionary_chain = prompt | llm | StrOutputParser()
```

- `|` 연산자로 세 요소를 파이프라인처럼 연결하는 LCEL문법
- 실행흐름
  1. `prompt` : `{dictionary}`, `{question}` 자리에 실제 값을 채워 완성된 프롬프트 텍스트 생성
  2. `llm` : 완성된 프롬프트를 LLM에 전달해서 응답 수신
  3. `StrOutputParser()` : 응답 객체에서 순수 문자열만 추출

```python
tax_chain = {"query": dictionary_chain} | qa_chain
ai_response = tax_chain.invoke({"question": query, "dictionary": dictionary})
```

- ⭐️ `dictionary_chain` 을 `qa_chain` 과 하나로 **이어 붙이는 부분**
- 입력값 전체가 dictionary chain에 그대로 전달
- dictionary chain이 직장인 → 거주자로 변환된 질문 문자열을 반환
- 그 문자열이 `{"query": "변환된 질문"}` 형태로 감싸져서
- qa_chain에 전달되고 이 변환된 질문으로 문서를 검색하여 최종 답변을 생성한다.

<img src="/images/rag/dictionary_chain_process.png" alt="rag 프로세스 시각화" width="700" />
