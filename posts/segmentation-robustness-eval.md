---
title: "[논문 정리] Segmentation 모델의 Adversarial Robustness 평가"
date: 2026-04-02
category: 논문정리
description: 물리 세계 패치 공격과 Segmentation Robustness 평가 방법론 — Nesti(2021)와 Halmosi(2024) 두 논문 정리
readTime: 10분
---

## 📄 Evaluating the Robustness of Semantic Segmentation for Autonomous Driving against Real-World Adversarial Patch Attacks

저자: Federico Nesti 외 4명 (2021, WACV 2022 게재)

### ⚠️ 이 논문이 뭘 해결하려는지 (문제 정의)

- Semantic Segmentation: 픽셀 하나하나가 도로인지, 사람인지, 차인지 구분

기존 연구들은 대부분 디지털 공격(컴퓨터 안에서만 픽셀 바꾸기)에만 집중했지만 이 논문은 **"실제 물리 세계에서 빌보드나 인쇄 가능한 패치 같은 물체로 공격하면 어떻게 될까?"**를 물음.

### 💡 핵심 아이디어 (방법론)

#### 3단계 공격 실험

디지털 공격과 실제 세계 Adversarial Patch 공격을 모두 테스트하는 심층 평가를 진행함.

- **1단계 — 디지털 공격**: 컴퓨터 안에서 Cityscapes 데이터셋으로 패치 생성 및 테스트
- **2단계 — 시뮬레이터 공격**: CARLA 자율주행 시뮬레이터 안에 3D로 패치를 배치해서 현실감 있게 테스트
- **3단계 — 실제 물리 공격**: 진짜로 패치를 인쇄해서 야외 빌보드에 붙이고 실제 주행하며 테스트

#### ⚒️ 핵심 기법: EOT 확장

기존에 있던 **EOT(Expectation Over Transformation) 기법**을 Semantic Segmentation에 맞게 처음으로 확장함.

EOT를 쉽게 말하자면:

> 패치가 다양한 각도, 거리, 조명에서 봐도 공격이 먹히도록 여러 변환 상황을 전부 고려해서 패치를 만들어라

실제 도로에선 카메라가 움직이고 빛도 바뀌니까 이게 없으면 현실 공격이 불가능.

### ✅ 결과 (성능/실험)

실험 결과 디지털 공격은 강력하게 먹혔지만 **실제 물리 환경에서는 공격 효과가 눈에 띄게 떨어짐** (흥미로운 포인트).

이게 자율주행 SS 모델에 대한 적대적 공격의 현실적 위협이 어느 정도인지 의문을 던지게 만드는 결과임.

---

## 📄 Evaluating the Adversarial Robustness of Semantic Segmentation: Trying Harder Pays Off

저자: Halmosi, Mohos, Jelasity (ECCV 2024 — 컴퓨터 비전 최고 학회)

### ⚠️ 이 논문이 뭘 해결하려는지 (문제 정의)

이미지 분류 모델은 robustness 평가 방법이 잘 정립되어 있는데, **Semantic Segmentation은 현재 평가 방식이 충분하지 않음.**

기존 논문들이 "우리 모델은 공격에 강하다"고 발표했지만 이 논문이 "그거 제대로 테스트한 거 맞아?"하고 다시 검증함.

### 💡 핵심 발견 3가지

**1. 기존 평가가 너무 낙관적이었다.**
실험 결과 기존에 강하다고 알려진 대부분의 최신 segmentation 모델들이 실제로는 이전에 보고된 것보다 훨씬 더 공격에 취약했음.

**2. 크기 편향(size-bias) 발견**
작은 객체가 큰 객체보다 훨씬 공격받기 쉬운 크기 편향이 존재하는데, 기존 평가 지표로는 이게 전혀 드러나지 않았음.
도로 상황으로 바꿔 말하면 → 멀리 있는 보행자(작은 객체)가 가까운 차(큰 객체)보다 공격에 훨씬 취약함 (자율주행에서는 엄청 위험한 문제).

**3. 모델마다 취약한 공격이 다르다**
어떤 모델은 A 공격에 취약하고 다른 모델은 B 공격에 취약해서 다양한 공격을 조합해서 평가해야 진짜 robustness를 알 수 있음.

#### ⚒️ 핵심 기여: 새로운 공격 기법 + 평가 프레임워크

PAdam-CE, PAdam-Cos 같은 새로운 공격 기법을 제안함 → 이것들을 기존 최강 공격들과 조합한 평가 프레임워크를 만듦.

- [Robust-Segmentation-Evaluation GitHub](https://github.com/szegedai/robust-segmentation-evaluation)

### ❓ 캡스톤과의 연결점

| 논문 | 역할 |
|------|------|
| GoodFellow (2014) | 공격이 왜 가능한가? — 이론 |
| Madry (2017) | 어떻게 방어하나 — 방어 기법 |
| Nesti (2021) | 도로 + Segmentation에 실제로 적용하면? |
| Halmosi (2024) | Segmentation robustness 평가 방법론 |

---

## 참고

- [논문 1 출처 (arXiv)](https://arxiv.org/abs/2108.06179)
- [SemSegAdvPatch GitHub](https://github.com/retis-ai/SemSegAdvPatch)
- [논문 2 출처 (arXiv)](https://arxiv.org/abs/2407.09150)
