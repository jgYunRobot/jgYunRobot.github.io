---
title: 공간 경로와 시간 계획을 분리해서 모션 보기
pubDatetime: 2026-10-17T00:04:00+09:00
category: 모션·기구학
tags: [motion, trajectory, topp, cpp]
description: Path는 어디로 움직이는지, TimeProfile은 언제 어디에 있는지를 정한다. 개인 C++ 모션 구현의 그래프와 실물 시연을 함께 정리한다.
---

직선이나 원호를 정의했다고 로봇의 목표 궤적이 완성되는 것은 아니다. 같은 경로라도 얼마나 빠르게 출발하고, 어느 속도로 이동하고, 어떻게 멈추는지에 따라 전혀 다른 운동이 된다.

개인 모션 라이브러리에서는 **경로의 형상**과 **시간에 따른 진행량**을 나누어 다룬다.

## 목차

## Path는 형상을 정한다

Path는 정규화된 진행률 `s`를 받아 위치·자세와 경로 미분을 제공한다. Linear는 직선 위치 경로, Circle은 시작·경유·끝점을 지나는 원호, Orientation Path는 회전 경로를 표현한다.

![C++ 모션 예제의 직선 위치 경로](/media/images/linear-path.png)

![C++ 모션 예제의 원호 위치 경로](/media/images/circle-path.png)

## TimeProfile은 진행량을 정한다

TimeProfile은 시간에 따른 `s(t)`와 그 미분을 제공한다. Path와 결합하면 물리적인 위치·속도·가속도·저크를 계산할 수 있다.

```text
q(t)   = q(s(t))
q̇(t)   = q′(s) ṡ
q̈(t)   = q′(s) s̈ + q″(s) ṡ²
q⃛(t)   = q′(s) s⃛ + 3 q″(s) ṡ s̈ + q‴(s) ṡ³
```

직선 관절 경로는 2차 이상 경로 미분이 0이지만, 곡선에서는 곡률에 의한 항이 남는다. 따라서 진행률의 속도만 제한했다고 실제 운동의 가속도와 저크까지 자동으로 제한되는 것은 아니다.

## 그래프에서 확인하는 것

다음은 개인 포트폴리오에 정리한 C++ 모션 예제다. 위치와 자세의 성분 곡선, norm, 제한선을 구분해서 본다. 시간 계획과 실제 로봇 추종은 다른 검증 항목이다.

![직선 모션 예제의 위치·속도·가속도·저크 표본](/media/images/linear-profile.png)

![원호 모션 예제의 위치·속도·가속도·저크 표본](/media/images/circle-profile.png)

원호 예제는 제약을 보수적으로 처리한다. 이 예제를 모든 곡선 경로의 전역 최단 시간 해법으로 해석하지 않으며, 표본 그래프의 저크를 연속 시간 최대값에 대한 증명으로 사용하지 않는다.

## 실물 연결 시연

<figure>
  <video controls playsinline preload="none" poster="/media/images/motion-planning.jpg" aria-label="개인 모션 생성기를 연결한 실물 로봇 시연">
    <source src="/media/videos/motion-planning.mp4" type="video/mp4" />
    <a href="/media/videos/motion-planning.mp4">실물 시연 영상 내려받기</a>
  </video>
  <figcaption>개인 모션 생성기를 실제 로봇에 연결한 시연. 위 그래프와 동일한 조건의 추종 오차 측정 결과를 뜻하지 않는다.</figcaption>
</figure>

## 기록 시점을 함께 읽기

Notion의 motion 문서는 초기 JointPath·고정 7구간 구현을 설명한다. 이후 C++ 구현과 개인 모션 예제의 범위가 넓어졌으므로, 해당 문서의 당시 지원 범위와 이 글에 함께 둔 후속 예제를 동일한 버전의 기능 목록으로 읽지 않는 것이 좋다.

## 관련 기록

- [Motion 구조 — Notion](https://app.notion.com/p/3bfb9055f84c8053bf86dee5eaa09bb5)
- [초기 TOPP 설계 — Notion](https://app.notion.com/p/3bfb9055f84c80b89e97d777ad87c742)
- [개인 GitHub](https://github.com/jgYunRobot)
