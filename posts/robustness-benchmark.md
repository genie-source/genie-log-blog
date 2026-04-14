---
title: "[논문 정리] 실제 환경 Robustness 벤치마크"
date: 2026-04-02
category: 논문정리
description: 비, 안개, 노이즈 같은 자연 손상에 대한 Segmentation 모델의 robustness 벤치마크 — Kamann & Rother (2021)
readTime: 8분
---

## 📄 Benchmarking the Robustness of Semantic Segmentation Models with Respect to Common Corruptions

저자: Kamann, Rother (International Journal of Computer Vision, 2021)

### ⚠️ 이 논문이 뭘 해결하려는지 (문제 정의)

이 논문은 조금 다른 관점으로 접근함.

> 자율주행 같은 실제 환경에서는 의도적 공격보다 비, 안개, 노이즈, 블러 같은 자연 발생적인 이미지 손상(Corruption)에 대한 robustness가 더 중요할 수도 있다

쉽게 말하면 그냥 카메라에 빗물이 묻거나 안개가 껴도 segmentation 모델이 제대로 동작하냐?를 따짐.

### ⚒️ 실험 방법

Cityscapes, PASCAL VOC 2012, ADE20K 세 데이터셋에서 거의 40만 장의 이미지를 생성해서 다양한 아키텍처의 segmentation 모델을 테스트.

테스트한 손상(Corruption) 종류:

| 카테고리 | 예시 |
|----------|------|
| Blur | 모션 블러, 초점 흐림, 가우시안 블러 |
| Noise | 가우시안 노이즈, 샷 노이즈 |
| Weather | 눈, 안개, 서리 |
| Digital | 밝기 변화, 대비 변화, JPEG 압축 |
| 자체 제안 | 실제 카메라 노이즈 모델, PSF 블러, 기하학적 왜곡 |

### ✅ 결과 (성능/실험)

1. 대부분의 모델이 **PSF 블러 같은 실제 카메라 블러에는 꽤 강함**
2. Dense Prediction Cell처럼 깨끗한 데이터 성능만 극대화하도록 설계된 아키텍처는 **손상된 이미지에서 오히려 성능이 크게 떨어짐**
3. 모델이 이미지 노이즈와 블러에는 잘 일반화되지만 디지털 손상이나 날씨 손상에는 그렇지 않음

### ❓ 캡스톤과의 연결점

이 논문이 기존에 읽은 논문들과 구분되는 중요한 점:

| 구분 | 기존 논문들 | 이번 논문 |
|------|------------|----------|
| 공격 유형 | 의도적 Adversarial Attack | 자연 발생 Corruption |
| 공격자 | 해커/공격자 존재 | 없음 (비, 안개, 노이즈) |
| 실제 위협 | 보안 위협 | 환경적 위협 |

⭐️ 캡스톤에서 도로 환경을 다룰 때 **"적대적 공격뿐만 아니라 날씨/노이즈 같은 자연 손상에도 강한 모델이어야 한다"**는 점을 논거로 활용할 수 있음.

---

## 참고

- [논문 출처 (Springer)](https://link.springer.com/article/10.1007/s11263-020-01383-2)
