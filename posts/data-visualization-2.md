---
title: "데이터 시각화 기초 정리 2 — 분포, 관계, 공간, 박스 플롯"
date: 2026-07-07
category: 학습정리
description: 계절학기 수업에서 배운 분포 시각화부터 박스 플롯까지 정리했습니다
---

지난 글에 이어서 분포, 관계, 공간, 박스 플롯 시각화를 정리했습니다.

---

## 1. 분포 시각화

분포 시각화는 데이터의 척도에 따라 방법이 달라집니다.

**양적 척도** (키, 나이, 매출액 등 숫자 자체에 의미가 있는 데이터)는 히스토그램, 막대그래프, 선그래프로 표현합니다.

**질적 척도** (혈액형, 성별 등 범주를 나타내는 데이터)는 파이차트, 도넛차트를 사용합니다. 구성 요소가 복잡할 때는 트리맵 차트가 효과적입니다. 와플 차트도 비슷한 용도로 쓰이지만, 트리맵과 달리 위계구조를 표현하지는 못합니다.

### 히스토그램

```python
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns
import numpy as np
import plotly.express as px
from pywaffle import Waffle

# 기본 히스토그램
df1 = df[['height_cm']]
plt.hist(df1, bins=10, label='bins=10')
plt.legend()
plt.show()

# 그룹별 히스토그램 비교
df_man   = df[df['sex'].isin(['man'])][['height_cm']]
df_woman = df[df['sex'].isin(['woman'])][['height_cm']]

plt.hist(df_man,   bins=10, label='MAN',   color='green', alpha=0.2, density=True)
plt.hist(df_woman, bins=10, label='WOMAN', color='red',   alpha=0.2, density=True)
plt.legend()
plt.show()
```

`density=True`를 쓰면 y축이 개수 대신 비율로 바뀌어서, 데이터 개수가 다른 그룹끼리도 분포 모양을 공정하게 비교할 수 있습니다.

### 파이차트 / 도넛차트

```python
# 파이차트
fig = plt.figure(figsize=(8,8))
fig.set_facecolor('white')
ax = fig.add_subplot()

ax.pie(df2.height_cm,
       labels=df2.country,
       startangle=0,
       counterclock=False,
       autopct=lambda p : '{:.1f}%'.format(p))
plt.legend()
plt.show()

# 도넛차트
wedgeprops = {'width': 0.7, 'edgecolor': 'w', 'linewidth': 5}
plt.pie(df2.height_cm, labels=df2.country, autopct='%.1f%%',
        startangle=90, counterclock=False, wedgeprops=wedgeprops)
plt.show()
```

### 트리맵 / 와플 차트

```python
# 트리맵 (plotly 사용)
fig = px.treemap(df3,
                 path=['sex', 'country'],
                 values='height_cm',
                 color='height_cm',
                 color_continuous_scale='viridis')
fig.show()

# 와플 차트
fig = plt.figure(
    FigureClass=Waffle,
    plots={
        111: {
            'values': df2['height_cm'],
            'labels': ["{0} ({1})".format(n, v) for n, v in df2['country'].items()],
            'legend': {'loc': 'upper left', 'bbox_to_anchor': (1.05, 1), 'fontsize': 8},
            'title': {'label': 'Waffle chart test', 'loc': 'left'}
        }
    },
    rows=10,
    figsize=(10, 10)
)
```

---

## 2. 관계 시각화

산점도는 두 연속형 변수의 관계를 표현합니다. 한 가지 주의할 점은 **극단치를 제거하고 그리는 것이 좋다**는 점입니다. 극단치가 있으면 주요 분포 구간이 압축되어 시각화 효율이 떨어집니다.

두 변수 간 관계만 표현할 수 있다는 한계가 있는데, 버블 차트를 사용하면 세 가지 요소의 상관관계를 한 번에 표현할 수 있습니다.

```python
import matplotlib.pyplot as plt
import seaborn as sns

# 기본 산점도
plt.scatter(df['R&D Spend'], df['Profit'], s=50, alpha=0.4)

# 회귀선 추가
sns.lmplot(x='R&D Spend', y='Profit', data=df)

# 네 가지 요소를 한 번에 표현 (x, y, 점 크기, 점 색상)
plt.scatter(df['R&D Spend'], df['Profit'],
            s=df['Marketing Spend'] * 0.001,
            c=df['Administration'],
            alpha=0.5,
            cmap='Spectral')
plt.colorbar()
plt.show()
```

`c=df['Administration']`으로 점의 색을 특정 변수 값에 따라 다르게 표현할 수 있습니다. 이렇게 하면 x, y, 크기, 색상으로 4가지 정보를 한 차트에 담을 수 있습니다.

---

## 3. 공간 시각화

데이터에 지리적 위치 정보(위도, 경도)가 있다면 지도 위에 표현하는 것이 가장 직관적입니다.

대표적인 기법으로는 도트맵, 코로플레스맵, 버블맵, 커넥션맵이 있습니다.

공간 시각화는 인터랙티브하게 활용할 수 있기 때문에 **거시적에서 미시적으로 진행되는 스토리라인을 잡고 적용하는 것이 좋습니다.**

---

## 4. 박스 플롯

박스 플롯(상자 수염 그림)은 하나의 그림으로 데이터의 분포, 편향성, 평균, 중앙값, 이상치까지 한눈에 보여주는 시각화 방법입니다.

구성 요소는 다음과 같습니다.

- **박스(IQR)** — Q1~Q3 구간, 데이터의 중간 50%
- **중앙값** — 박스 안의 선, 평균과 다름
- **수염** — IQR × 1.5 범위 안의 최댓/최솟값
- **이상치** — 수염 밖으로 벗어난 극단값

```python
import matplotlib.pyplot as plt
import seaborn as sns

# 세로 박스 플롯
plt.figure(figsize=(8,6))
sns.boxplot(y='Profit', data=df)
plt.show()

# 가로 박스 플롯
plt.figure(figsize=(8,6))
sns.boxplot(x='Profit', data=df)
plt.show()

# 그룹별 박스 플롯
plt.figure(figsize=(8,5))
sns.boxplot(x='State', y='Profit', data=df)
plt.show()
```

---

## 마치며

분포 시각화에서 척도에 따라 차트를 다르게 선택해야 한다는 점, 산점도에서 극단치를 미리 제거해야 한다는 점, 박스 플롯 하나로 얼마나 많은 정보를 담을 수 있는지 — 이번에 처음 알게 된 것들입니다.

다음에는 실제 데이터로 직접 적용해보면서 손에 익혀볼 예정입니다.
