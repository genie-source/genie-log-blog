---
title: "RAG의 전체 구성 과정 (LangChain 실습)"
date: 2026-07-23
category: 학습정리
description: Document Loader, Text Splitter, 임베딩, ChromaDB, RetrievalQA 체인까지 LangChain으로 RAG를 구성하는 전체 흐름 정리
---

## RAG의 전체 구성 과정

1. 문서의 내용을 읽는다.
2. 문서를 쪼갠다.
3. 임베딩
4. 질문이 있을 때 백터 데이터베이스에 유사도 검색을 한다.
5. 유사도 검색으로 가져온 문서를 LLM에 질문과 같이 전달한다.

### 1. 문서의 내용을 읽는다. (Document Loader 사용)

**Document Loader란?**
→ LangChain에서 다양한 형식의 원본 문서를 읽어서 **표준화된 `Document` 객체로 변환**해주는 컴포넌트

```python
# Document 객체의 구조

Document(
	page_content = "여기에 실제 텍스트 내용이 들어감...",
	metadata = {"source" : "./tax.docx"}
)
```

```python
from langchain_community.document_loaders import Docx2txtLoader

loader = Docx2txtLoader("./tax.docx")
```

### 2. 문서를 쪼갠다. (Text Splitter 사용)

문서를 쪼개는 이유는 아래와 같다.

- **토큰 수 초과**로 답변을 생성하지 못할 수 있고
- 문서가 길면 답변 생성이 **오래 걸림**

**Text Splitter란?**
→ **긴 문서를 작은 조각(chunk)으로 쪼개는 컴포넌트**이다. Document Loader가 문서를 읽어온 다음 Text Splitter가 그 문서를 잘게 나눠주는 역할을 한다.

```python
from langchain_text_splitters import RecursiveCharacterTextSplitter

text_splitter = RecursiveCharacterTextSplitter(
	chunk_size = 1500, # 문서를 쪼갤 때 하나의 chunk의 최대 길이
	chunk_overlap = 200 # 문서를 쪼갤 때 chunk간의 겹치는 길이
)

document_list = loader.load_and_split(text_splitter=text_splitter)
# 나눠진 문서를 배열 형태로 받을 수 있다.
```

### 3. 임베딩

**임베딩이란?**
→ 텍스트를 컴퓨터가 의미 단위로 비교할 수 있는 숫자 벡터로 변환하는 과정이다.

예를들면 "소득세 계산 방법"과 "세금 산출 방식"은 사람 눈에는 비슷한 의미지만 컴퓨터에게는 그냥 다른 문자열일 뿐이다.
이런 텍스트를 예를들어 `[0.03, -0.21, 0.88, ...]`처럼 수백~수천 차원의 숫자 배열로 바꿔주는데 **의미가 비슷한 문장일수록 벡터 공간에서 서로 가까운 위치**에 놓이도록 학습되어 있다.

```python
from langchain_upstage import UpstageEmbeddings

load_dotenv()
embeddings = UpstageEmbeddings(model="solar-embedding-2-query")
```

### 4. 데이터베이스에서 유사도 검색 (ChromaDB)

**ChromaDB란?**
→ **임베딩(벡터)를 저장**하고 나중에 유**사도 검색을 해주는 벡터 데이터베이스**이다.

일반 DB는 "정확히 일치하는 값"을 찾는데 특화되어 있지만 **벡터 DB는 "의미상 가장 비슷한 것"을 찾는 데 특화**되어 있다.
저장된 수많은 벡터들 중에서 질문 벡터와 거리가 가장 가까운 것들을 빠르게 찾아내는 게 핵심 기능이다.

```python
from langchain_chroma import Chroma

database = Chroma(
	collection_name="chroma_tax_v2",
	embedding_function=embeddings,
	persist_directory="./chroma_v2"
	)
```

- `collection_name` : 벡터DB 안에서 데이터 묶음을 구분하는 이름
- `embedding_function` : Chroma는 텍스트를 직접 벡터로 바꾸는 능력은 없음 → 텍스트가 들어오면 **"이 함수(모델)를 써서 벡터로 변환해" 라고 알려주는 역할**
- `persist_directory` : 벡터 데이터가 실제로 저장되는 디스크 경로

### 5. LLM에게 전달 (retrieved QA chain 사용)

**retrieved QA chain란?**
→ Retriever(문서 검색기)가 찾아온 관련 문서를 LLM에 넘겨서 그 문서 내용을 근거로 **질문에 답하는 문장을 생성하게 만드는 체인**

**langchain hub란?**
다른 사람들이 만들어 놓은 프롬프트(prompt), 체인(chain), 에이전트 설정 등을 검색하고 가져와 쓸 수 있는 공유 저장소

```python
# 동작 흐름

qa_chain.invoke({"query" : "연봉 5천만원인 직장인의 소득세는 얼마인가요?"})

1. retriever가 ChromaDB에서 질문과 유사한 문서 조각 검색
2. 검색된 문서(context) + 질문(question)을 prompt에 끼워넣음
3. 완성딘 프롬프트를 llm에 전달
4. LLM이 문서 내용을 근거로 답변 생성

결과: {'query': '...', 'result': '연봉 5천만원인 직장인의 소득세는 554만원입니다.'}
```

```python
# query와 llm 생성

query = "연봉 5천만원인 직장인의 소득세는 얼마인가요?"

from langchaian_upstage import ChanUpstage

llm = ChatUpstage()
```

```python
# 프롬프트 가져오기

from langsmith import Client

client = Client()
prompt = client.pull_prompt(
		'rlm/rag-prompt',
		include_model=False,
		dangerously_pull_public_prompt=True
)
```

- `Client` : LangSmith 서버에 접속하는 클라이언트 객체 생성
- `client.pull_prompt` : rlm 이라는 사용자가 올려둔 rag-prompt 라는 프롬프트 템플릿을 원격에서 다운로드
  - `include_model=False` : 프롬프트에 딸려올 수 있는 모델 설정은 제외하고 **순수 프롬프트 텍스트**만 가져옴
  - `dangerously_pull_public_prompt=True` : 공개 프롬프트를 신뢰하고 가져오겠다는 명시적 동의

```python
# RetrievalQA 체인 조립

from langchain_classic.chains import RetrievalQA

qa_chain = RetrievalQA.from_chain_type(
		llm=llm,
		retriever = database.as_retriever(),
		chain_type_kwargs={"prompt": prompt}
)
```

- `retriever=database.as_retriever()` : ChromaDB(`database`)를 검색 도구로 변환, 질문이 들어오면 여기서 유사한 문서를 찾아옴
- `chain_type_kwargs={"prompt": prompt}` : 검색된 문서(`context`)와 질문(`question`)을 조합할 때 방금 위에서 가져온 `rlm/rag-prompt` 템플릿을 사용하라고 지정

```python
# 최종적으로 qa_chain이 하는 일

ai_message = qa_chain({"query": query})
ai_message

# 결과
{'query': '연봉 5천만원인 직장인의 소득세는 얼마인가요?',
 'result': '연봉 5천만원인 직장인의 소득세는 554만원입니다. (지방세 포함)'}
```

### 👀 프로세스 시각화

<img src="/images/rag/rag_process.png" alt="rag 프로세스 시각화" width="700" />

---

## ✅ pinecone으로 DB 변경하기

pinecone이란?
→ Chroma와 같은 벡터 데이터베이스 서비스이지만 Chroma는 inbase인 반면 **pinecone을 클라우드 기반 관리형 서비스**이다.

```python
from langchain_pinecone import PineconeVectorStore

# 데이터를 처음 저장할 때
index_name = 'tax-upstage-index'

database = PineconeVectorStore.from_documents(
    document_list,
    embedding,
    index_name=index_name
)
```
