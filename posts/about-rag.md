---
title: "RAG(Retrieval Augmented Generation)란?"
date: 2026-07-22
category: 학습정리
description: RAG의 3단계 개념과 Vector Store, Vector Database, 유사도 검색 프로세스를 정리했습니다
---

# RAG란?

`다중 선택` `TIL`

## Retrieval Augmented Generation (RAG)

### 1. Retrival

- 데이터를 가져오는 것
- 구체적으로는 컴퓨터 시스템에 저장된 자료를 취득하는 것
- 언어모델이 가지고 있지 않은 정보를 가져오는 것
  - 언어 모델이 아웃풋을 만드는데 필요한 정보를 제공하는 것
  - 언어모델이 **답변 생성에 능숙**하지만 답변 생성을 위한 **모든 정보를 가지고 있지는 않음**!

### 2. Augmented

- AR/VR에 사용되는 것과 같은단어
- 마치 사실인 것처럼 Retrieval된 데이터를 LLM에게 주면서 **"마치 이 정보를 아는 것 처럼"** 동작

### 3. Generation

- 생성
- **내가 가져온 데이터를 제공할테니 이 정보를 아는 것 처럼 생성**

## Vector Store

Vector Store란 텍스트를 숫자 벡터로 변환해서 저장하고, **"의미가 비슷한 것끼리 가깝게"** 검색할 수 있게 해주는 데이터베이스이다.

### 1. 사용자의 질문과 관련있는 데이터

- **관련성 파악을 위해 vector를 활용함**
- 단어 또는 문장의 유사도를 파악해서 관련성을 측정함

### 2. Vector를 사용하는 법

a. 문장에서 비슷한 단어가 자주 붙어있는 것을 학습

b. Embedding projector
<img src="/images/rag/foot_vector.png" alt="feet과 상관관계를 가진 단어들을 확인 할 수 있다." width="800" />
feet과 상관관계를 가진 단어들을 확인 할 수 있다.

### 3. Vector Database란

- Embedding 모델을 활용해 생성된 **vector를 저장**
- 단순히 vector만 저장하면 안되고 **metadata**도 같이 저장 → LLM이 생성하는 답변의 퀄리티가 상승

### 4. Vector를 대상으로 유사도 검색 프로세스

**Retrieval** : 사용자 질문과 가장 비슷한 문서를 가져옴. 문서 크기가 크기 때문에 **Chunking**(작은 단위로 분할)해서 저장해야 함

**Augmented** : 가져온 문서를 프롬프트를 통해 LLM에 제공

**Generation** : LLM은 프롬프트를 활용해서 답변 생성
