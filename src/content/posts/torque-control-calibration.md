---
title: 전류 토크·마찰·처짐 보상으로 실제 로봇 경로 오차 줄이기
pubDatetime: 2026-10-29T00:00:00+09:00
category: 로봇 제어
tags: [robot-control, torque-control, friction, calibration, motion]
description: 전류 토크 보정과 6축 마찰 식별을 진행하고, 사각형·원 경로에서 마찰 및 처짐 보상에 따른 실물 경로 오차를 비교했다.
---

**실제 로봇에서 전류 토크를 점검하고 6축 마찰을 식별한 뒤, 마찰 보상과 처짐 보상의 효과를 각각 비교했다.** 처짐 보상 시험에서는 사각형의 경로 형상 오차 RMS가 0.874 → 0.286 mm, 원은 0.454 → 0.288 mm로 줄었다.

아래 위치 결과는 <strong>관절 엔코더와 같은 모델의 순기구학(FK)</strong>으로 계산했다. 외부 측정기로 확인한 TCP 절대 정확도는 아니다. 마찰 시험과 처짐 시험은 날짜·조건·반복 횟수가 다른 별도 실험이다.

## 결과 요약

| 실험                  | 경로               | 비교 지표          | OFF → ON         |
| --------------------- | ------------------ | ------------------ | ---------------- |
| 마찰 보상 · 10월 26일 | 사각형 200 mm, XY  | 위치 추종 RMS      | 1.66 → 0.91 mm   |
| 마찰 보상 · 10월 26일 | 원 지름 100 mm, XZ | 위치 추종 RMS      | 1.31 → 0.87 mm   |
| 처짐 보상 · 10월 29일 | 사각형 200 mm, XY  | 경로 형상 오차 RMS | 0.874 → 0.286 mm |
| 처짐 보상 · 10월 29일 | 원 지름 100 mm, XZ | 경로 형상 오차 RMS | 0.454 → 0.288 mm |

위치 추종 오차는 같은 시각의 목표와 실제 위치 차이, 경로 형상 오차는 실제 위치에서 목표 도형까지의 거리다. 그래프를 누르면 원본 크기로 볼 수 있다.

## 전류 토크 보정

정지 자세별로 실제 PD 피드백 토크를 분리해 모델 중력과 비교하고 J2·J3·J4·J5를 점검·보정했다. J6은 접근 이력에 따른 편차가 커 기존 계수를 유지했다. 이 과정은 모델을 기준으로 한 정합성 확인이며, 독립 토크 센서에 대한 절대 교정은 아니다.

## 최신 실측: 전류 토크와 모델·마찰 토크 비교

**10월 29일 마지막 실측의 J3 사각형 경로**를 사용했다. 같은 전류 토크를 강체 모델만으로 비교했을 때와, 모델에 실제 적용한 마찰 보상 토크를 더했을 때를 나란히 표시했다. 전류 토크에서 PD를 빼지 않았다.

<figure>
  <a href="/media/images/torque-latest-j3.png" aria-label="최신 J3 전류·모델·마찰 토크 비교 그래프 크게 보기">
    <img src="/media/images/torque-latest-j3.png" alt="동일한 최신 J3 전류 토크를 강체 모델과 모델·마찰 합산 토크에 비교한 전체 경로 및 첫째·셋째 변 확대 그래프" width="2660" height="2432" loading="lazy" decoding="async" />
  </a>
  <figcaption>파랑은 실측 전류 토크, 회색은 강체 모델, 주황은 모델+실제 마찰 보상 토크. 양쪽 모두 실제 마찰·처짐 보상 ON인 동일 로그의 비교다. 별도의 물리적 마찰 OFF/ON 시험을 뜻하지 않는다.</figcaption>
</figure>

| 전류 토크와 비교한 대상    | 원신호 차이 RMS | 15 Hz 필터 후 차이 RMS |
| -------------------------- | --------------- | ---------------------- |
| 강체 모델                  | 12.63 Nm        | 12.59 Nm               |
| 강체 모델 + 마찰 보상 토크 | 3.93 Nm         | 3.79 Nm                |

15 Hz 기준 차이 RMS가 **69.9% 감소**했다. 전체 경로와 첫째·셋째 변을 확대했으며 가감속·반전에서 남는 잔차도 표시했다. 모델은 실제 관절 자세·속도와 목표 가속도를 사용한 강체 역동역학 토크다.

## 6축 마찰 모델 피팅

저속부터 설정 최고속도까지 정·역방향으로 수집했다. 같은 관절 위치에서 **전류 토크와 강체 모델 토크의 잔차를 양방향으로 비교**해, 방향에 따라 부호가 바뀌는 마찰 성분을 피팅했다. 방향 공통 편향은 제외하고 Coulomb·Stribeck·3차 점성항을 사용했다.

<figure>
  <a href="/media/images/friction-fit-six-axes.png" aria-label="음수·양수 속도 전 범위 6축 마찰 모델 피팅 그래프 크게 보기">
    <img src="/media/images/friction-fit-six-axes.png" alt="J1부터 J6까지 음수·양수 속도의 수집점과 현재 마찰 모델, 별도 검증점 및 이전 모델을 비교한 2행 3열 통합 그래프" width="2960" height="1850" loading="lazy" decoding="async" />
  </a>
  <figcaption>파란 점은 정·역방향에서 구한 마찰 성분, 주황은 현재 모델, 초록 ×는 별도 검증, 회색 점선은 이전 모델이다. 양·음 속도를 모두 표시했으며 0 부근 ±1°/s는 선형, 바깥은 로그 축이다.</figcaption>
</figure>

피팅 수집·독립 검증은 **10월 25일**에 진행했다. 위 6축 계수는 **10월 29일 마지막 운전 설정과 모두 일치**한다. 별도 검증 RMS는 J1 0.27, J2 0.50, J3 0.39, J4 0.29, J5 0.27, J6 0.17 Nm였다. 이 값은 위치를 맞춰 분리한 마찰 성분에 대한 오차로, 앞 절의 전체 주행 토크 차이 RMS와 평가 대상이 다르다.

## 마찰 보상 OFF/ON: 실물 경로 비교

10월 26일에 모델·전류 보정·PD·처짐 보상을 고정하고 마찰 보상만 OFF/ON으로 바꿔 **각 1회** 주행했다. 수평 사각형은 한 변 200 mm(XY), 수직 원은 지름 100 mm(XZ)다.

### 수평 사각형

<figure>
  <a href="/media/images/friction-square.png" aria-label="마찰 보상 OFF·ON 사각형 경로 결과 크게 보기">
    <img src="/media/images/friction-square.png" alt="마찰 보상 전후 200 mm 수평 사각형의 목표·실제 평면 경로, 3D 경로, 위치 오차 및 TCP 속도" width="2210" height="1530" loading="lazy" decoding="async" />
  </a>
  <figcaption>검정은 목표, 주황은 마찰 OFF, 파랑은 ON. 위치 추종 RMS는 1.66 → 0.91 mm였다.</figcaption>
</figure>

### 수직 원

<figure>
  <a href="/media/images/friction-circle.png" aria-label="마찰 보상 OFF·ON 원 경로 결과 크게 보기">
    <img src="/media/images/friction-circle.png" alt="마찰 보상 전후 지름 100 mm 수직 원의 목표·실제 경로, 위치 오차 및 TCP 속도" width="2210" height="1530" loading="lazy" decoding="async" />
  </a>
  <figcaption>위치 추종 RMS는 1.31 → 0.87 mm였다. 두 경로에서 위치 추종 개선을 관측했으며 원의 자세 오차 개선은 확인하지 못했다.</figcaption>
</figure>

속도 입력 상한은 500 mm/s였지만, 가속도·저크 및 경로 길이·곡률 제약을 적용한 생성 최고속도는 사각형 약 390 mm/s, 원 약 283 mm/s였다. 실제 FK를 21 ms 국소 다항식으로 미분한 TCP 최고속도는 사각형 OFF/ON 약 407/407 mm/s, 원 약 318/313 mm/s였다. 500 mm/s 정속 시험으로 해석하지 않는다.

### 실물 영상

<figure>
  <iframe class="experiment-video" src="https://www.youtube-nocookie.com/embed/9N0JM_-uXR0?rel=0" title="실제 로봇의 마찰 보상 비교 동작 영상" width="1280" height="720" loading="lazy" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
  <figcaption>마찰 보상 동작을 확인하는 실물 영상. 앞 절의 10월 29일 최신 토크 로그와는 별도 자료다.</figcaption>
</figure>

## 처짐 보상 OFF/ON: 같은 경로에서 반복 비교

10월 29일에는 마찰·PD·모델을 고정하고 처짐 보상 유무만 바꿨다. 모터 위치·속도 목표에 토크에 따른 처짐을 반영한 조건과, 관절 위치·속도 목표를 그대로 전달한 조건을 **ON → OFF → OFF → ON, 조건별 2회** 실행했다. 관절 속도 실측 피크는 설정 최대의 46.6%였다.

| 경로               | 위치 추종 RMS, OFF → ON       | 경로 형상 오차 RMS, OFF → ON  |
| ------------------ | ----------------------------- | ----------------------------- |
| 사각형 200 mm, XY  | 1.055 → 0.609 mm · 42.3% 감소 | 0.874 → 0.286 mm · 67.2% 감소 |
| 원 지름 100 mm, XZ | 1.005 → 0.596 mm · 40.7% 감소 | 0.454 → 0.288 mm · 36.7% 감소 |

### 수평 사각형

<figure>
  <a href="/media/images/deflection-square.png" aria-label="처짐 보상 OFF·ON 사각형 반복 측정 결과 크게 보기">
    <img src="/media/images/deflection-square.png" alt="처짐 보상 전후 각 2회 측정한 수평 사각형의 평면·3D 경로, 위치 추종 오차와 TCP 속도" width="2210" height="1615" loading="lazy" decoding="async" />
  </a>
  <figcaption>검정은 목표, 주황은 처짐 보상 OFF, 파랑은 ON. 실선은 1회차, 같은 색 파선은 2회차다.</figcaption>
</figure>

### 수직 원

<figure>
  <a href="/media/images/deflection-circle.png" aria-label="처짐 보상 OFF·ON 원 반복 측정 결과 크게 보기">
    <img src="/media/images/deflection-circle.png" alt="처짐 보상 전후 각 2회 측정한 지름 100 mm 수직 원의 경로, 위치 추종 오차와 TCP 속도" width="2210" height="1615" loading="lazy" decoding="async" />
  </a>
  <figcaption>두 반복 모두 같은 개선 방향을 보였다. 위치는 무필터이며 속도만 21 ms 미분으로 계산했다.</figcaption>
</figure>

그래프에는 정지 구간을 표시했고, 처짐 비교의 RMS에서는 준비·진입·정지·복귀를 제외했다. 이 결과는 해당 모델·속도·자세·부하에서 관측한 반복 측정이며, 외부 계측 기반 절대 정확도나 통계적 인수 검증을 뜻하지 않는다.
