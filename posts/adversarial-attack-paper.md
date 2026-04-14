---
title: "[논문 정리] 적대적 공격(Adversarial Attack)의 원리 및 대응 방안"
date: 2026-04-02
category: 논문정리
description: Goodfellow의 FGSM과 Madry의 PGD — 적대적 예시의 원리부터 방어법까지 두 논문을 정리했습니다
---

## 📄 Explaining and Harnessing Adversarial Examples

저자: Ian Goodfellow, Jonathon Shlens, Christian Szegedy (Google, 2014)

### ⚠️ 이 논문이 뭘 해결하려는지 (문제 정의)

AI모델(특히 이미지 분류 신경망)한테 아래와 같은 이상한 현상이 있었음

> 사람 눈엔 똑같아 보이는 사진인데 AI는 전혀 다른 걸로 분류해버림

예를 들어 판다 사진에 사람 눈에 안 보이는 아주 미세한 노이즈를 추가하면 AI가 갑자기 원숭이라고 판단해버림.
이런 조작된 입력을 **Adversarial Example(적대적 예시)**라고 부름.
왜 이런 일이 생기는지 의문이었고 이 논문이 그 원인을 밝혀냄.

### 💡 핵심 아이디어 (방법론)

#### 신경망이 너무 선형적(Linear)이기 때문이다

기존엔 신경망이 너무 복잡하고 비선형적이라서 생기는 버그라고 생각했는데
Goodfellow 팀은 오히려 **신경망의 선형적인 특성 때문**이라고 주장함.

쉽게 말하면:

- 신경망은 입력값의 아주 작은 변화에도 누적 반응이 엄청 커질 수 있음
- 픽셀 수가 수만 개니까 각각 아주 조금씩만 바꿔도 전체 합산 효과가 엄청나짐
- 그래서 사람 눈에는 안 보여도 AI는 완전히 다른 입력으로 받아들임

#### ⚒️ 핵심 기법: FGSM (Fast Gradient Sign Method)

이 논문에서 Adversarial Example을 빠르게 만드는 방법인 FGSM을 제안했는데
이걸로 MNIST 테스트셋에 적용하자 오류율이 89.4%까지 치솟음.

FGSM을 한 줄로 요약하면:

> 모델이 틀리는 방향으로 그라디언트를 구해서 그 방향으로 아주 조금만 픽셀을 바꿔라

수식:

```
x_adversarial = x + ε * sign(∇_x J(θ, x, y))
```

- `x` : 원본 이미지
- `ε` : 노이즈 크기 (아주 작은 값)
- `∇_x J` : 손실 함수의 그라디언트 (모델이 틀리는 방향)

### ✅ 결과 (성능/실험)

- 다양한 구조의 모델과 다양한 학습 데이터로 훈련된 모델들이 **같은 Adversarial Example에서 동일하게 틀림** → 이건 단순한 버그가 아니라 **딥러닝의 근본적인 취약점**을 보여줌
- **Adversarial Training**이라는 방어법도 제안: 적대적 예시를 학습 데이터에 섞어서 같이 훈련시키면 모델이 더 강해짐

### ❓ 캡스톤과의 연결점

1. 모델 Robustness: segmentation 모델도 adversarial attack에 취약할 수 있어서 배경 지식으로 알아두기
2. Target object에 노이즈/방해요소 처리 관련

---

## 📄 Towards Deep Learning Models Resistant to Adversarial Attacks

저자: Aleksander Madry 외 4명 (MIT, 2017)

### ⚠️ 이 논문이 뭘 해결하려는지 (문제 정의)

GoodFellow 논문이 "왜 공격이 가능한지"를 설명했다면 이 논문은 한 단계 더 나아가
**"그럼 어떻게 하면 공격에 진짜로 강한 모델을 만들 수 있을까?"**를 물음.

기존 방어 기법들(defensive distillation, feature squeezing 등)은 자기들이 얼마나 안전한지 보장을 제대로 못함. 어떤 공격이 가장 강력한 공격인지도 모르고 방어가 진짜 효과 있는지도 불분명했음.

### 💡 핵심 아이디어 (방법론)

#### 공격과 방어를 수학 문제로 바꿔버리자

이 논문의 핵심은 adversarial robustness를 **최적화 문제(min-max 문제)**로 공식화함.

쉽게 말하면:

> 공격자(Max): 이 모델을 가장 크게 틀리게 만드는 입력을 찾아라
> 방어자(Min): 그 최악의 공격에도 손실이 최소가 되도록 모델을 훈련해라

이 두 목표가 동시에 존재하는 "안장점(Saddle Point) 문제"로 표현됨.

```
min(θ)  max(δ ∈ S)  L(θ, x+δ, y)
 ↑모델 훈련     ↑최악의 공격 찾기
```

#### ⚒️ 핵심 기법: PGD (Projected Gradient Descent)

FGSM이 "한 번에 크게 한 발" 공격이었다면
**PGD는 FGSM을 여러 번 반복하면서 조금씩 최악의 방향으로 나아가는 방식**임.
이걸 논문에서 **"가장 강력한 1차 공격자(universal first-order adversary)"**라고 부름.

### ✅ 결과 (성능/실험)

**🛡️ PGD Adversarial Training — 방어법**

이 논문의 방어법은 PGD로 만든 강력한 공격 예시를 학습 데이터에 계속 섞어서 훈련하는 것임.
이렇게 하면 어떤 1차 공격에도 견딜 수 있는 구체적인 안전 보장을 제공할 수 있음.

### ❓ 캡스톤과의 연결점

- 우리 모델은 PGD 공격을 받으면 정확도가 얼마나 떨어지나?
- PGD Adversarial Training을 적용하면 얼마나 회복되나?

---

## 참고

- [논문 1 출처 (arXiv)](https://arxiv.org/abs/1412.6572)
- [논문 2 출처 (arXiv)](https://arxiv.org/abs/1706.06083)
- [FGSM 구현 실습 튜토리얼 (TensorFlow)](https://www.tensorflow.org/tutorials/generative/adversarial_fgsm?hl=ko)
