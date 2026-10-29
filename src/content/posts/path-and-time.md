---
cover: /media/images/motion-planning.jpg
coverAlt: 실제 로봇에서 직선과 원호 모션을 실행하는 장면
previewVideo: /media/previews/motion-planning.mp4
title: C++ 모션 생성기로 직선·원호 동작 구현
pubDatetime: 2026-10-17T00:04:00+09:00
category: 모션·기구학
tags: [motion, trajectory, cpp, robot-control]
description: 직선·원호 경로에 TOPP 시간 계획을 적용하고, 위치·자세·속도·가속도·저크 그래프와 실물 동작을 확인했다.
---

**C++로 직선·원호 모션을 생성하고, 실제 로봇에 연결해 동작을 시연했다.** 위치와 자세의 경로를 구성하고 속도·가속도·저크 제한을 반영해 시간에 따른 목표를 만들었다.

## 실물 시연

<figure>
  <video controls playsinline preload="none" poster="/media/images/motion-planning.jpg" aria-label="개인 C++ 모션 생성기를 연결한 실제 로봇 시연">
    <source src="/media/videos/motion-planning.mp4" type="video/mp4" />
    <a href="/media/videos/motion-planning.mp4">실물 시연 영상 내려받기</a>
  </video>
  <figcaption>직접 생성한 모션을 실제 로봇 제어에 연결한 동작 시연.</figcaption>
</figure>

## 구현한 내용

- 시작·도착 위치를 잇는 직선 경로를 생성했다.
- 시작·경유·도착점을 지나는 원호 경로를 생성했다.
- 위치와 자세의 진행을 맞추고, 운동 제한을 반영한 시간 계획을 적용했다.
- C++ 출력 표본을 그래프로 확인한 뒤 실물 동작에 연결했다.

## 경로 결과

![C++로 생성한 직선 위치 경로](/media/images/linear-path.png)

![C++로 생성한 원호 위치 경로](/media/images/circle-path.png)

그래프는 모션 생성 결과이고, 영상은 실제 로봇에 연결한 시연이다. 원호 모션은 제한을 보수적으로 처리하는 방식으로 구현했다.

## TOPP 시간 계획 결과

**직선은 약 3.48초, 원호는 약 4.03초의 목표 궤적을 생성했다.** 같은 시작·도착 위치와 자세에 운동 제한을 적용하고, 원호에는 경유점을 추가했다. 두 예제 모두 정지 상태에서 출발해 정지 상태로 도착한다.

TOPP 단계에서 7구간 시간 프로파일을 계획하고, 위치·자세 경로와 결합했다. 아래는 C++ 모션 생성기에서 출력한 시간별 위치·자세·속도·가속도·저크다.

### 직선 모션

<figure>
  <a href="/media/images/topp-linear-pose-pvaj.png" aria-label="직선 모션 TOPP 그래프 원본 크게 보기">
    <img src="/media/images/topp-linear-pose-pvaj.png" alt="약 3.48초 직선 모션의 병진·회전 위치, 속도, 가속도, 수치 저크와 크기 제한 그래프" width="2371" height="2037" loading="lazy" decoding="async" />
  </a>
  <figcaption>직선 경로와 자세 변화에 시간 계획을 적용한 결과. 그래프를 누르면 원본 크기로 볼 수 있다.</figcaption>
</figure>

### 원호 모션

<figure>
  <a href="/media/images/topp-circle-pose-pvaj.png" aria-label="원호 모션 TOPP 그래프 원본 크게 보기">
    <img src="/media/images/topp-circle-pose-pvaj.png" alt="약 4.03초 원호 모션의 병진·회전 위치, 속도, 가속도, 수치 저크와 크기 제한 그래프" width="2355" height="2037" loading="lazy" decoding="async" />
  </a>
  <figcaption>경유점을 지나는 원호와 자세 변화에 시간 계획을 적용한 결과. 그래프를 누르면 원본 크기로 볼 수 있다.</figcaption>
</figure>

왼쪽 열은 병진, 오른쪽 열은 회전이다. 위에서부터 위치·자세, 속도, 가속도, 저크를 표시했다. 속도·가속도·저크 그래프의 검은 점선은 벡터의 크기(norm), 주황 점선은 설정한 크기 제한이다.

| 운동 제한 | 병진      | 회전        |
| --------- | --------- | ----------- |
| 속도      | 0.45 m/s  | 0.80 rad/s  |
| 가속도    | 0.90 m/s² | 1.60 rad/s² |
| 저크      | 3.60 m/s³ | 6.40 rad/s³ |

저크는 출력 가속도를 수치 미분한 표본값이다. 이 그래프는 생성한 목표 궤적을 보여주며, 실물 추종 오차는 별도로 측정해야 한다. 원호 예제는 운동 제한을 만족하도록 보수적으로 시간 계획을 적용했다.
