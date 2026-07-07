---
title: "데이터 탐색과 시각화 (2) — 분포, 관계, 공간, 박스 플롯"
date: 2026-07-07
category: 학습정리
description: 계절학기 수업에서 배운 분포 시각화부터 박스 플롯까지 정리
---

지난 글에 이어서 분포, 관계, 공간, 박스 플롯 시각화를 정리했습니다.

---

## 1. 분포 시각화

분포 시각화는 연속형과 같은 양적 척도인지 명목형과 같은 질적 척도인지에 따라 구분해서 그립니다.

**양적 척도**의 경우 막대그래프나 선그래프로 분포를 나타낼 수도 있고, 히스토그램을 통해 분포를 단순화하여 보다 알아보기 쉽게 만들 수도 있습니다. 양적 척도란 숫자로 표현되고 그 숫자 자체에 크기나 양의 의미가 있는 데이터입니다. 예를 들면 키, 나이, 매출액, 온도 등이 있습니다.

**질적 척도**로 이루어진 변수는 구성이 단순한 경우 파이차트나 도넛차트를 사용합니다. 구성 요소가 복잡한 질적 척도를 표현할 때는 트리맵 차트를 이용하면 보다 효과적으로 표현할 수 있습니다. 또 유사한 시각화 방법으로는 와플 차트가 있습니다. **와플 차트는** 와플처럼 일정한 네모난 조각들로 분포를 표현합니다. 하지만 트리맵 차트처럼 **위계구조를 표현하지는 못합니다.** 질적 척도란 숫자가 아니라 범주나 카테고리를 나타내는 데이터로, 혈액형, 성별 등이 있습니다.

### 실습

```python
# 필요한 패키지 설치 및 임포트
!pip install plotly
!pip install pywaffle
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns
import numpy as np
import plotly.express as px  # 인터랙티브 시각화
from pywaffle import Waffle  # 와플차트 라이브러리
plt.rcParams['figure.dpi'] = 300
```

### 기본 히스토그램 시각화

```python
# 신장 칼럼만 필터링
df1 = df[['height_cm']]

# 10cm 단위로 히스토그램 시각화
plt.hist(df1, bins=10, label='bins=10')
plt.legend()
plt.show()
```

- `bins=10` : 전체 값의 범위를 10개로 나누겠다는 뜻
- `plt.legend()` : 지정한 `label`들을 모아서 그래프 한쪽 구석에 작은 범례 박스로 보여주는 함수. 히스토그램이 하나뿐이면 사실 큰 의미는 없지만 여러 개를 겹쳐 그릴 때 어떤 색이 어떤 데이터인지 구분하는 데 꼭 필요합니다.

```python
# 남성/여성 히스토그램 시각화
df1_1 = df[df['sex'].isin(['man'])]
df1_1 = df1_1[['height_cm']]
df1_2 = df[df['sex'].isin(['woman'])]
df1_2 = df1_2[['height_cm']]

# 10cm 단위로 남성, 여성 히스토그램 시각화
plt.hist(df1_1, bins=10, label='MAN', color='green', alpha=0.2, density=True)
plt.hist(df1_2, bins=10, label='WOMAN', color='red', alpha=0.2, density=True)
plt.legend()
plt.show()
```

- `density` : 히스토그램 y축을 개수 대신 비율(전체 면적 합=1)로 바꿔서 데이터 개수가 다른 그룹끼리도 분포 모양을 공정하게 비교할 수 있게 해주는 옵션

### 파이차트와 도넛차트 시각화

```python
# 파이차트, 도넛차트 시각화를 위한 데이터 전처리
df2 = df[['country', 'height_cm']]
# 키 175 이상만 추출
df2 = df2[df.height_cm >= 175]
df2 = df2.groupby('country').count().reset_index()
df2.head()
```

```python
# 파이차트 시각화
fig = plt.figure(figsize=(8,8))  # 캔버스 생성
fig.set_facecolor('white')  # 캔버스 배경색 설정
ax = fig.add_subplot()  # 프레임 생성

# 파이차트 출력
ax.pie(df2.height_cm,
       labels=df2.country,  # 라벨 출력
       startangle=0,  # 시작점 degree 설정
       counterclock=False,  # 시계 방향
       autopct=lambda p : '{:.1f}%'.format(p))  # 퍼센트 자릿수 설정

plt.legend()
plt.show()
```

```python
# 도넛차트 시각화
# 차트 형태 옵션 설정
wedgeprops = {'width': 0.7, 'edgecolor': 'w', 'linewidth': 5}

plt.pie(df2.height_cm, labels=df2.country, autopct='%.1f%%',
        startangle=90, counterclock=False, wedgeprops=wedgeprops)
plt.show()
```

### 트리맵 차트 시각화

```python
# 트리맵 차트용 데이터셋 전처리
df3 = df[['country', 'sex', 'height_cm']]
df3 = df3[df.height_cm >= 175]
# 국가, 성별 단위 신장 175cm 이상 카운팅
df3 = df3.groupby(['country', 'sex']).count().reset_index()
df3.head(10)
```

```python
# 트리맵 차트 시각화
fig = px.treemap(df3,
                 path=['sex', 'country'],
                 values='height_cm',
                 color='height_cm',
                 color_continuous_scale='viridis')
fig.show()
```

### 와플 차트 시각화

```python
# 와플차트 시각화
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

산점도를 통해 두 개의 연속형 변수의 관계를 표현할 수 있습니다. **주의할 점은 산점도를 그릴 때는 극단치를 제거하고서 그리는 것이 좋습니다. 극단치로 인해 주요 분포 구간이 압축되어 시각화의 효율이 떨어지기 때문입니다.**

그리고 산점도는 두 개의 변수 간 관계만 표현할 수 있다는 단점이 있습니다. 버블 차트를 이용하면 세 가지 요소의 상관관계를 표현할 수 있습니다.

### 실습

```python
# 필요한 패키지 임포트
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns
import numpy as np
```

```python
# 기본 산점도 시각화
plt.scatter(df['R&D Spend'], df['Profit'], s=50, alpha=0.4)
```

- `s` : 점 크기 옵션

```python
# 산점도에 회귀선 추가
ax = sns.lmplot(x='R&D Spend', y='Profit', data=df)
```

```python
# 네 가지 요소의 정보를 포함한 산점도 시각화
plt.scatter(df['R&D Spend'], df['Profit'],
            s=df['Marketing Spend'] * 0.001,
            c=df['Administration'],
            alpha=0.5,
            cmap='Spectral')
plt.colorbar()
plt.show()
```

- `c=df['Administration']` : 점의 색깔, Administration의 값에 따라 달라짐
- x축, y축 외에 점의 크기(`s`)와 색상(`c`)으로 총 4가지 요소의 정보를 하나의 차트에 담을 수 있습니다.

---

## 3. 공간 시각화

데이터가 지리적 위치와 관련되어 있으면 실제 지도 위에 데이터를 표현하는 것이 효과적입니다. 공간 시각화는 위치 정보인 위도와 경도 데이터를 지도에 매핑하여 시각적으로 표현합니다.

공간 시각화는 지도를 확대하거나 위치를 옮기는 등 인터랙티브한 활용이 가능하기에 **거시적에서 미시적으로 진행되는 분석 방향과 같이 스토리라인을 잡고 시각화를 적용**하는 것이 좋습니다.

대표적인 기법으로 도트맵, 코로플레스맵, 버블맵, 커넥션맵 등이 있습니다.

---

## 4. 박스 플롯

상자 수염 그림으로도 불리는 박스 플롯은 네모 상자 모양에 최댓값과 최솟값을 나타내는 선이 결합된 모양의 데이터 시각화 방법입니다.

**박스 플롯은 하나의 그림으로 양적 척도 데이터의 분포 및 편향성, 평균과 중앙값 등 다양한 수치를 보기 쉽게 정리해 줍니다.**

구성 요소는 다음과 같습니다.

- **박스(IQR)** : Q1~Q3 구간, 데이터의 중간 50%가 여기에 해당
- **중앙값(빨간 선)** : 데이터를 반으로 나누는 값, 평균과 다름
- **수염** : 박스에서 뻗어나온 선, IQR × 1.5 범위 안의 최댓/최솟값까지
- **이상치(동그라미)** : 수염 밖으로 벗어난 극단값

<img src="/images/data-visualization/boxplot.png" width="800" />

### 실습

```python
# 필요한 패키지 임포트
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns
```

```python
# 세로 박스 플롯
plt.figure(figsize=(8,6))
sns.boxplot(y='Profit', data=df)
plt.show()

# 가로 박스 플롯
plt.figure(figsize=(8,6))
sns.boxplot(x='Profit', data=df)
plt.show()

# State 구분에 따른 박스 플롯 시각화
plt.figure(figsize=(8,5))
sns.boxplot(x='State', y='Profit', data=df)
plt.show()
```

---

## 마치며

분포 시각화에서 척도에 따라 차트를 다르게 선택해야 한다는 점, 산점도에서 극단치를 미리 제거해야 한다는 점, 박스 플롯 하나로 얼마나 많은 정보를 담을 수 있는지 — 처음 알게 된 것들이 많았습니다.
