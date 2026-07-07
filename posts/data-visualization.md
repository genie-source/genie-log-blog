---
title: "데이터 시각화 기초 정리 — EDA부터 비교 시각화까지"
date: 2026-07-06
category: 학습정리
description: 계절학기 수업에서 배운 탐색적 데이터 분석과 시각화 기법 정리
---

계절학기 수업에서 데이터 시각화를 처음 제대로 배웠습니다. 이론도 코드도 전부 새로웠는데 복습하면서 핵심 개념과 코드를 정리해봤습니다.

---

## 들어가며 — Garbage In, Garbage Out

데이터 분석에는 **GIGO(Garbage In, Garbage Out)** 라는 말이 있습니다. 잘못된 데이터를 넣으면 결과도 쓸모없다는 뜻입니다. 원천 데이터에는 오류와 이상치가 많기 때문에 분석 전에 데이터를 탐색하고 정제하는 과정이 반드시 필요합니다.

---

## 1. 탐색적 데이터 분석 (EDA)

EDA(Exploratory Data Analysis)는 데이터를 있는 그대로 탐색하고 분석하는 기법입니다. 기술통계와 시각화를 통해 데이터의 특성을 파악하는 것이 목적입니다.

EDA를 통해 확인하는 것들은 다음과 같습니다.

- 데이터 형태와 척도가 분석에 적합한지 (sanity checking)
- 평균, 분포, 분산, 패턴 등 데이터 특성
- 결측값과 이상치
- 변수 간의 관계성

한 가지 주의할 점은 **EDA 단계에서는 극단적인 해석이나 지나친 추론을 피해야 한다**는 것입니다. 탐색 단계이기 때문입니다.

### 실습 코드

```python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
sns.set(color_codes=True)
%matplotlib inline

df = pd.read_csv("datasets/hotel_bookings.csv")

# 데이터 기본 확인
df.head()       # 처음 5개 행
df.info()       # 칼럼별 속성 및 결측치
df.describe()   # 평균, 표준편차, 최대최솟값 등

# 왜도: 분포가 좌우 어느 쪽으로 치우쳐 있는지
df.skew(numeric_only=True)

# 첨도: 분포가 얼마나 뾰족한지 (3 = 정규분포)
df.kurtosis(numeric_only=True)

# 특정 변수 분포 시각화
sns.distplot(df['lead_time'])

# 그룹별 분포 비교
sns.violinplot(x="hotel", y="lead_time", data=df, color=".8")
sns.stripplot(x="hotel", y="lead_time", data=df, size=1)
plt.show()
```

---

## 2. 공분산과 상관성 분석

변수 간의 관계를 파악하는 것은 분석에서 중요합니다. 입력 변수들끼리 서로 강한 상관관계를 가지면 **다중공선성** 문제가 생길 수 있기 때문입니다.

### 공분산 vs 상관계수

**공분산**은 두 변수가 함께 변하는 방향과 정도를 나타냅니다. 다만 각 변수의 척도가 그대로 반영되기 때문에, 공분산 값의 크기만으로 상관성의 높고 낮음을 판단하기 어렵습니다.

이 한계를 보완한 것이 **피어슨 상관계수**입니다. 공분산을 각 변수의 표준편차로 나눠 정규화한 값으로, `-1`에서 `1` 사이의 값을 가집니다.

여기서 주의할 점은 **산점도의 기울기와 상관계수는 관련이 없다**는 것입니다. 분산의 관계성이 같다면 기울기가 달라도 상관계수는 같습니다.

### 실습 코드

```python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

# 산점도 행렬로 변수 간 관계 한눈에 보기
sns.pairplot(df, diag_kind='kde')
plt.show()

# 공분산 확인
numeric_df = df.select_dtypes(include=np.number)
numeric_df.cov()

# 피어슨 상관계수 확인
numeric_df.corr(method='pearson')

# 히트맵으로 시각화
sns.heatmap(numeric_df.corr(), cmap='viridis')
```

---

## 3. 시간 시각화

시점 요소가 있는 데이터는 시계열로 표현합니다. 시간 흐름에 따른 데이터 변화를 파악하는 데 유용합니다.

한 가지 중요한 점은 날짜 데이터가 `object` 타입으로 불러와지는 경우가 많다는 것입니다. 시각화 전에 반드시 날짜 형식으로 변환해야 합니다.

### 실습 코드

```python
import matplotlib.pyplot as plt
import pandas as pd
import datetime

# object → datetime 변환
df['Date2'] = pd.to_datetime(df['Order Date'], format='%d/%m/%Y')
df = df.sort_values(by='Date2')
df['Year'] = df['Date2'].dt.year

# 일별 매출 합계
df_line = df[df.Year == 2018]
df_line = df_line.groupby('Date2')['Sales'].sum().reset_index()

# 30일 이동 평균
df_line['Month'] = df_line['Sales'].rolling(window=30).mean()

# 선그래프 시각화
ax = df_line.plot(x='Date2', y='Sales', linewidth="0.5")
df_line.plot(x='Date2', y='Month', linewidth='1', ax=ax)

# 연도별 막대그래프
df_bar = df.groupby('Year')['Sales'].sum().reset_index()
df_bar.plot.bar(x='Year', y='Sales', rot=0, figsize=(10,5))
```

`rolling(window=30).mean()`은 30개씩 묶어서 슬라이딩 윈도우 평균을 계산합니다. 단기 노이즈를 제거하고 추세를 보기 좋아집니다.

---

## 4. 비교 시각화

그룹별 요소가 많아지면 효율적인 표현 기법이 필요합니다. 주로 사용하는 방법은 세 가지입니다.

- **히트맵 차트** — 그룹과 비교 요소가 많을 때 효과적
- **방사형 차트** — 여러 변수를 하나의 차트로 비교
- **평행 좌표 그래프** — 변수별 값을 정규화해서 집단 경향성 파악

### 실습 코드

```python
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns
import numpy as np
from math import pi
from pandas.plotting import parallel_coordinates

# 히트맵 시각화
fig = plt.figure(figsize=(8,8))
plt.pcolor(df1.values)
plt.xticks(range(len(df1.columns)), df1.columns)
plt.yticks(range(len(df1.index)), df1.index)
plt.colorbar()
plt.show()

# 방사형 차트
labels = df3.columns[1:]
num_labels = len(labels)
angles = [x/float(num_labels)*(2*pi) for x in range(num_labels)]
angles += angles[:1]

fig = plt.figure(figsize=(8,8))
ax = fig.add_subplot(polar=True)

for i, row in df3.iterrows():
    data = df3.iloc[i].drop('Tm').tolist()
    data += data[:1]
    ax.plot(angles, data, linewidth=2, linestyle='solid', label=row.Tm)
    ax.fill(angles, data, alpha=0.4)

plt.legend(loc=(0.9,0.9))
plt.show()

# 평행 좌표 그래프
fig, axes = plt.subplots()
plt.figure(figsize=(16,8))
parallel_coordinates(df3, 'Tm', ax=axes, colormap='winter', linewidth="0.5")
```

---

## 마치며

EDA부터 시간 시각화, 비교 시각화까지 처음 배워본 내용들을 정리했습니다. 공분산과 상관계수의 차이, 이동 평균의 개념, 피벗 함수의 동작 방식 등 새로 알게 된 것들이 많았습니다.

다음엔 실제 데이터셋으로 직접 분석해보면서 감을 더 익혀볼 예정입니다.
