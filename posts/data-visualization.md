---
title: "데이터 탐색과 시각화 (1) — EDA, 공분산, 시간, 비교 시각화"
date: 2026-07-06
category: 학습정리
description: 계절학기 수업에서 배운 탐색적 데이터 분석부터 비교 시각화까지 정리
---

계절학기 수업 내용을 복습하면서 정리했습니다. EDA, 공분산과 상관성 분석, 시간 시각화, 비교 시각화 순서로 진행합니다.

---

데이터 분석 용어 중에 **'Garbage In, Garbage Out(GIGO)'** 이라는 말이 있습니다. 가치가 없는 잘못된 데이터를 사용하면 역시 무가치한 결과가 나온다는 뜻입니다. 데이터 마트에 쌓여 있는 그대로의 원천 데이터는 수많은 오류와 이상치를 가지고 있는 경우가 많습니다. 그렇기 때문에 **다양한 각도에서 데이터를 탐색하고 시각화**하여 **가치 있는 데이터로 정제**해 나가야 합니다.

데이터 시각화의 궁극적 목적은 분석 결과를 커뮤니케이션 하기 위함입니다. 전달하고자 하는 바를 효과적으로 전달하기 위해서는 올바른 시각화 기법을 사용해야 합니다.

---

## 1. 탐색적 데이터 분석 (EDA)

미국의 수학자 존튜기가 창안한 EDA(Exploratory Data Analysis)는 가공하지 않은 원천의 데이터를 있는 그대로 탐색하고 분석하는 기법을 뜻합니다. 기술통계와 데이터 시각화를 통해 데이터의 특성을 파악하는 것입니다. **EDA를 할 때는 극단적인 해석은 피해야 하며 지나친 추론이나 자의적 해석도 지양해야 합니다.**

EDA의 목적은 다음과 같습니다.

- 데이터의 형태와 척도가 분석에 알맞게 되어있는지 확인 (sanity checking)
- 데이터의 평균, 분포, 분산, 패턴 등의 확인을 통해 데이터 특성 파악
- 데이터의 결측값이나 이상치 파악 및 보완
- 변수 간의 관계성 파악
- 분석 목적과 방향성 점검 및 보정

### 실습

```python
# 필요한 패키지 임포트
import seaborn as sns  # 시각화 패키지
import matplotlib as plt  # 시각화 패키지
import pandas as pd  # csv 파일 불러오기부터 데이터 전처리하는 라이브러리
sns.set(color_codes=True)
%matplotlib inline
```

```python
# 데이터 불러오기
df = pd.read_csv("datasets/hotel_bookings.csv")

# 데이터 샘플 확인
df.head()    # 처음 5개 행
df.tail(10)  # 마지막 10개 행 확인
```

```python
# 각 칼럼의 속성 및 결측치 확인
df.info()

# 각 칼럼의 통계치 확인
df.describe()
```

- `.describe()` : 평균, 표준편차, 최대 최솟값 등을 한 번에 확인할 수 있는 함수

```python
# 각 컬럼의 왜도 확인 (왜도 = 분포가 좌우 어느 쪽으로 치우쳐 있는지)
# 왜도 계산 -> object는 연산시 에러 발생
# numeric_only=True 옵션을 주면 object 데이터는 제외하고 계산
# 왜도 : 오른쪽으로 긴 모양 -> 오른쪽 꼬리가 긴 분포
df.skew(numeric_only=True)

# 각 컬럼의 첨도 확인 (첨도 = 분포가 얼마나 뾰족하고 꼬리가 두꺼운지(극단값이 얼마나 많은지))
# 3 = 정규분포, 3 > 봉우리가 높은 분포, 3 < 봉우리가 낮은 분포
df.kurtosis(numeric_only=True)
```

```python
# 특정 변수 분포 시각화
sns.distplot(df['lead_time'])
```

- `.distplot()` : 확인하고자 하는 칼럼의 분포를 시각화하는 함수

```python
# 호텔 구분에 따른 lead_time 분포 차이 시각화
sns.violinplot(x="hotel", y="lead_time", data=df, color=".8")  # 그래프 모양 조절
sns.stripplot(x="hotel", y="lead_time", data=df, size=1)  # 분포도 조절
plt.show()
```

- `.violinplot()` : 분포를 효과적으로 표현하는 함수
- `.stripplot()` : 각 관측치의 위치를 직관적으로 표현하는 함수

---

## 2. 공분산과 상관성 분석

**타깃 변수 Y와 입력변수 X와의 관계는 물론 입력 변수 X들 간의 관계도 살펴봐야 합니다.** 이를 통해 다중공선성을 방지할 수 있으며 데이터에 대한 이해도를 높일 수 있습니다.

> 다중공선성 : 회귀분석에서 독립변수(예측변수)들끼리 서로 강한 상관관계를 가질 때 발생하는 문제

변수 간의 상관관계를 파악하는 대표적인 개념으로는 공분산과 상관계수가 있습니다. 상관분석을 하기 위해서는 우선 데이터가 등간이나 비율 척도이며 두 변수가 선형적 관계라는 기본 가정을 둡니다.

### 공분산

공분산은 **서로 공유하는 분산**을 나타냅니다. 분산은 한 변수의 각각의 데이터가 퍼진 정도를 나타내지만 **공분산은 두 분산의 관계를 뜻합니다.**

공분산은 두 변수가 함께 변하는 방향과 정도를 나타내는 지표이며 상관계수가 바로 이 공분산을 표준화한 버전이라고 보면 됩니다.

- 양의 상관관계 : X1이 커지면 X2도 커진다.
- 음의 상관관계 : X1이 커지면 X2는 작아진다.
- 무 상관관계 : X1과 X2는 선형적인 관계가 없다.

<img src="/images/data-visualization/correlation-types.png" width="800" />

### 상관계수

공분산의 한계는 각 변수 간의 다른 척도기준이 그대로 반영되어 공분산 값이 지니는 크기가 **상관성의 정도를 나타내지 못한다**는 것입니다.

예를 들어 X1과 X2의 공분산 값이 1300이고 X3과 X4의 공분산 값이 800이라 할 때, X1과 X2의 상관관계가 X3과 X4의 상관관계보다 크다고 할 수 없습니다.

이러한 한계를 해결하기 위해 공분산을 변수 각각의 표준편차 값으로 나누는 **정규화**를 하여 상관성을 비교하기도 합니다. 하지만 이 역시 절대적인 기준이 될 수 없기 때문에 **피어슨 상관계수**를 많이 사용합니다.

**피어슨 상관계수**는 쉽게 말해 변수 X1과 X2가 함께 변하는 정도(공분산)를 X1과 X2가 변하는 전체 정도로 나눠준 것입니다. 함께 변하는 정도는 전체가 변하는 총량을 초과할 수 없기 때문에 이 값은 `1`을 넘을 수 없으며 음의 상관관계도 `-1`보다 작을 수 없습니다. (-1 ≤ R ≤ 1)

여기서 주의할 점은 **산점도의 기울기와 상관계수는 관련이 없다**는 것입니다. 분산의 관계성이 같다면 기울기가 크든 작든 상관계수가 같습니다.
<img src="/images/data-visualization/correlation-coefficient.png" width="800" />

### 실습

```python
# 필요한 패키지 임포트
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
```

```python
# 산점도 행렬 시각화
sns.set(font_scale=1.1)   # 폰트 크기 설정
sns.set_style('ticks')    # 축 눈금 설정
sns.pairplot(df, diag_kind='kde')  # 상관계수가 1이면 분포로 표시
plt.show()
```

```python
# 공분산 확인
df.cov()

# object type 에러 해결 코드
numeric_df = df.select_dtypes(include=np.number)
numeric_df.cov()
```

공분산은 각 변수 간의 다른 척도기준이 그대로 반영되어 직관적으로 상관성의 높고 낮음을 파악하기 힘듭니다.

```python
# 피어슨 상관계수 확인
df.corr(method='pearson')

# 대각선은 다 1이고 대칭적으로 표시됨 -> 왜? 자기 자신과 상관관계는 1이기 때문
numeric_df = df.select_dtypes(include=np.number)
numeric_df.corr(method='pearson')
```

동일한 변수 간에는 상관계수가 1로 나오고 나머지는 -1~1의 값을 가지고 있습니다. 어떤 변수 간에 상관성이 높고 낮은지 쉽게 알 수 있습니다.

```python
# 히트맵 시각화
numeric_df = df.select_dtypes(include=np.number)
sns.heatmap(numeric_df.corr(), cmap='viridis')
```

```python
# clustermap 히트맵 시각화
numeric_df = df.select_dtypes(include=np.number)
sns.clustermap(numeric_df.corr(),
               annot=True,
               cmap='RdYlBu_r',
               vmin=-1, vmax=1,
               )
```

```python
# 중복 제거 히트맵 시각화
numeric_df = df.select_dtypes(include=np.number)

# 매트릭스의 우측 상단을 모두 True인 1로, 하단을 False인 0으로 변환
np.triu(np.ones_like(numeric_df.corr()))

# True/False mask 배열로 변환
mask = np.triu(np.ones_like(numeric_df.corr(), dtype=np.bool))

# 히트맵 그래프 생성
fig, ax = plt.subplots(figsize=(15, 10))
sns.heatmap(numeric_df.corr(),
            mask=mask,
            vmin=-1,
            vmax=1,
            annot=True,
            cmap="RdYlBu_r",
            cbar=True)
ax.set_title('Wine Quality Correlation', pad=15)
```

---

## 3. 시간 시각화

시점 요소가 있는 데이터는 시계열 형태로 표현할 수 있습니다. 시간 흐름에 따른 데이터의 변화를 표현하는 것입니다.

### 실습

```python
# 필요한 패키지 임포트
import matplotlib as plt
import pandas as pd
import datetime  # 날짜 가공용
```

```python
df.info()

# 결과 일부
# 2   Order Date     9800 non-null   object
# 3   Ship Date      9800 non-null   object
# date가 object type인걸 확인 할 수 있다.
# 날짜 형식으로 변환 필요
```

```python
# ⭐️ date 칼럼 날짜 형식 변환
# Order Date(문자형식) -> Date2(날짜형식) 변환해야 됨
df['Date2'] = pd.to_datetime(df['Order Date'], format='%d/%m/%Y')

# 날짜 오름차순 정렬
df = df.sort_values(by='Date2')
# 연도 칼럼 생성
df['Year'] = df['Date2'].dt.year

# 2018년 데이터만 생성
df_line = df[df.Year == 2018]

# 2018년 일별 매출액 가공
df_line = df_line.groupby('Date2')['Sales'].sum().reset_index()
df_line.head()
```

- `dt` : pandas에서 datetime 타입 컬럼에 들어있는 날짜/시간 관련 속성과 메소드에 접근할 때 쓰는 액세서
- `groupby('Date2')` : `Date2` 컬럼 값이 같은 행들끼리 그룹으로 묶어줌
- `['Sales'].sum()` : 각 그룹(날짜별)마다 `Sales` 컬럼 값을 다 더해줌
- `reset_index()` : 인덱스로 들어가 있던 `Date2`를 다시 일반 컬럼으로 꺼내줌. 안 하면 `Date2`가 인덱스라서 그래프 그릴 때나 다른 컬럼이랑 합칠 때 불편함이 생김

```python
# 30일 이동 평균 생성
df_line['Month'] = df_line['Sales'].rolling(window=30).mean()

# 선그래프 시각화
ax = df_line.plot(x='Date2', y='Sales', linewidth="0.5")
df_line.plot(x='Date2', y='Month', linewidth='1', ax=ax)
```

- `df_line['Sales'].rolling(window=30)` : 데이터를 30개씩 묶어서 슬라이딩 윈도우를 만든다. 그 뒤에 `.mean()`을 붙이면 그 30일 구간의 평균을 계산
- `ax` : matplotlib의 **Axes 객체**, 쉽게 말하면 그래프가 그려지는 "도화지(좌표 평면)" 그 자체를 가리키는 변수

```python
# 막대 그래프 시각화 - 데이터 준비
df_bar_1 = df.groupby('Year')['Sales'].sum().reset_index()
df_bar_1.head()

# 연도별 매출액 막대 그래프 시각화
ax = df_bar_1.plot.bar(x='Year', y='Sales', rot=0, figsize=(10,5))
```

```python
# 연도별, 고객 세그먼트별 매출액 데이터 가공
df_bar_2 = df.groupby(['Year', 'Segment'])['Sales'].sum().reset_index()

# 고객 세그먼트를 칼럼으로 피벗
df_bar_2_pv = df_bar_2.pivot(index='Year', columns='Segment', values='Sales').reset_index()
df_bar_2_pv.head()

# 연도별 고객 세그먼트별 매출액 누적 막대그래프 시각화
df_bar_2_pv.plot.bar(x='Year', y='Sales', stacked=True, figsize=(10,7))
```

**pivot 함수의 동작**

긴 형태의 데이터를 넓은 형태의 데이터로 변환하는 작업입니다.

- `index='Year'` → 새로운 데이터프레임의 행(인덱스)을 `Year`로 한다.
- `columns='Segment'` → `Segment` 컬럼에 들어있던 값들(예: Consumer, Corporate, Home Office)이 각각 새로운 컬럼 이름이 된다.
- `values='Sales'` → 그 교차하는 자리(연도 x 세그먼트)에 채워질 값은 `Sales`다.

```python
# 막대그래프 요일별/연도별 시각화
plt.figure(figsize=(8, 4))
sns.countplot(x="day_of_week", data=df,
              order=["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"])
plt.title("Pickups by Day of Week")
plt.xticks(rotation=45)
plt.show()
```

---

## 4. 비교 시각화

그룹별 요소가 많아지게 되면 보다 효율적인 표현 기법을 사용해야 합니다.

**히트맵 차트**는 그룹과 비교 요소가 많을 때 효과적으로 시각화를 할 수 있는 방법입니다. 히트맵 차트는 다른 시각화 방법에 비해 그리는 것이 까다롭기 때문에 현재 가지고 있는 데이터의 구조와 자신이 확인하고자 하는 목적을 정확히 파악한 다음 차트를 그려야 합니다.

추가적으로 비교 시각화를 하는 방법으로는 **방사형 차트**와 **평행 좌표 그래프**도 있습니다.

평행 좌표 그래프를 보다 효과적으로 표현하려면 변수별 값을 정규화하면 됩니다. **가장 낮은 값은 0%**로 **가장 높은 값은 100%**로 변환하여 차이를 더욱 부각시키는 것입니다. 이는 각 그룹의 요소별 차이 수준을 효과적으로 파악할 수 있고 집단적 경향성을 표현하는 데에 용이합니다.

### 실습

```python
# 필요한 패키지 임포트
import matplotlib.pyplot as plt
import pandas as pd
import datetime
import seaborn as sns
import numpy as np  # 수치 계산용
from math import pi
from pandas.plotting import parallel_coordinates  # 평행좌표그래프용
```

### 히트맵 시각화

```python
# 히트맵 시각화 V1을 위한 데이터 전처리

# 1단계: 행(팀) 필터링
df1 = df[df['Tm'].isin(['ATL', 'BOS', 'BRK', 'CHI', 'CHO'])]

# 2단계: 컬럼 필터링
df1 = df1[['Tm', 'ORB%', 'TRB%', 'AST%', 'BLK%', 'USG%']]

# 팀별 요소 평균 전처리
df1 = df1.groupby('Tm').mean()
df1.head()
```

```python
# 히트맵 시각화 V1
fig = plt.figure(figsize=(8,8))
fig.set_facecolor('white')
plt.pcolor(df1.values)

# x축 컬럼 설정
plt.xticks(range(len(df1.columns)), df1.columns)
# y축 컬럼 설정
plt.yticks(range(len(df1.index)), df1.index)
# x축 레이블 설정
plt.xlabel('Value', fontsize=14)
# y축 레이블 설정
plt.ylabel('Team', fontsize=14)
plt.colorbar()
plt.show()
```

- `plt.xticks(위치, 라벨)` 형태로 2개의 인자를 받음
  - `range(len(df1.columns))` : 눈금 찍을 위치 → 컬럼이 6개면 `[0,1,2,3,4,5]`
  - `df1.columns` : 그 위치에 표시할 라벨 → `['Tm', 'ORB%', 'TRB%', 'AST%', 'BLK%', 'USG%']`

```python
# 히트맵 시각화 V2를 위한 데이터 전처리

# 5개 팀만 필터링
df2 = df[df['Tm'].isin(['ATL','BOS','BRK','CHI','CHO'])]

# 팀명, 연령, 참여 게임 수 컬럼만 필터링
df2 = df2[['Tm','Age','G']]

# 팀 - 연령 기준 평균으로 전처리
df2 = df2.groupby(['Tm','Age']).mean().reset_index()

# 테이블 피벗
df2 = df2.pivot(index='Tm', columns='Age', values='G')
df2.head()
```

```python
# 히트맵 시각화 V2
fig = plt.figure(figsize=(8,8))
fig.set_facecolor('white')

plt.pcolor(df2.values)
plt.xticks(range(len(df2.columns)), df2.columns)
plt.yticks(range(len(df2.index)), df2.index)
plt.xlabel('Age', fontsize=14)
plt.ylabel('Team', fontsize=14)
plt.colorbar()
plt.show()
```

### 방사형 차트 시각화

```python
# 방사형 차트를 위한 인덱스 초기화
df3 = df1.reset_index()
df3.head()
```

```python
# 방사형 차트 (하나씩 시각화)
labels = df3.columns[1:]
num_labels = len(labels)

# 등분점 생성
angles = [x/float(num_labels)*(2*pi) for x in range(num_labels)]
angles += angles[:1]  # 시작점 생성

my_palette = plt.cm.get_cmap("Set2", len(df3.index))

fig = plt.figure(figsize=(15,20))
fig.set_facecolor('white')

for i, row in df3.iterrows():
    color = my_palette(i)
    data = df3.iloc[i].drop('Tm').tolist()
    data += data[:1]

    ax = plt.subplot(3, 2, i+1, polar=True)
    # 시작점 설정
    ax.set_theta_offset(pi / 2)
    # 시계방향 설정
    ax.set_theta_direction(-1)

    # 각도 축 눈금 생성
    plt.xticks(angles[:-1], labels, fontsize=13)
    # 각 축과 눈금 사이 여백생성
    ax.tick_params(axis='x', which='major', pad=15)
    # 반지름 축 눈금 라벨 각도 0으로 설정
    ax.set_rlabel_position(0)
    # 반지름 축 눈금 설정
    plt.yticks([0,5,10,15,20], ['0','5','10','15','20'], fontsize=10)
    plt.ylim(0, 20)

    # 방사형 차트 출력
    ax.plot(angles, data, color=color, linewidth=2, linestyle='solid')
    # 도형 안쪽 색상 설정
    ax.fill(angles, data, color=color, alpha=0.4)
    # 각 차트의 제목 생성
    plt.title(row.Tm, size=20, color=color, x=-0.2, y=1.2, ha='left')

# 차트 간 간격 설정
plt.tight_layout(pad=3)
plt.show()
```

```python
# 방사형 차트 (한 번에 시각화)
labels = df3.columns[1:]
num_labels = len(labels)

# 등분점 생성
angles = [x/float(num_labels)*(2*pi) for x in range(num_labels)]
# 시작점 생성
angles += angles[:1]

my_palette = plt.cm.get_cmap("Set2", len(df3.index))

fig = plt.figure(figsize=(8,8))
fig.set_facecolor('white')
ax = fig.add_subplot(polar=True)

for i, row in df3.iterrows():
    color = my_palette(i)
    data = df3.iloc[i].drop('Tm').tolist()
    data += data[:1]

    # 시작점
    ax.set_theta_offset(pi / 2)
    # 시계방향 설정
    ax.set_theta_direction(-1)

    # 각도 축 눈금 생성
    plt.xticks(angles[:-1], labels, fontsize=13)
    # 각 축과 눈금 사이 여백생성
    ax.tick_params(axis='x', which='major', pad=15)
    # 반지름 축 눈금 라벨 각도 0으로 설정
    ax.set_rlabel_position(0)
    # 반지름 축 눈금 설정
    plt.yticks([0,5,10,15,20], ['0','5','10','15','20'], fontsize=10)
    plt.ylim(0, 20)

    # 방사형 차트 출력
    ax.plot(angles, data, color=color, linewidth=2, linestyle='solid', label=row.Tm)
    # 도형 안쪽 색상 설정
    ax.fill(angles, data, color=color, alpha=0.4)

plt.legend(loc=(0.9, 0.9))
plt.show()
```

### 평행 좌표 그래프 시각화

```python
# 팀 기준 평행 좌표 그래프 생성
fig, axes = plt.subplots()
plt.figure(figsize=(16,8))  # 그래프 크기 조정
parallel_coordinates(df3, 'Tm', ax=axes, colormap='winter', linewidth="0.5")
```
