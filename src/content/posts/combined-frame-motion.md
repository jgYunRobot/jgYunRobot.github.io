---
title: 기준 Frame 이동과 TCP offset 변경을 동시에 적용
pubDatetime: 2026-10-17T00:03:00+09:00
category: 모션·기구학
tags: [frame, motion, simulation, robot-control]
description: 움직이는 기준 Frame에서 TCP 상대 모션을 유지하며 offset을 바꾸고, 양팔 상대 모션까지 시뮬레이션으로 확인했다.
---

**기준 Frame이 움직이는 동안 TCP의 상대 모션을 유지하고, TCP offset도 실시간으로 변경했다.** 직접 개발하는 제어기를 MuJoCo 기반 물리 엔진 시뮬레이션에 연결해 복합 모션과 양팔 상대 모션을 확인했다.

## 복합 모션 결과

<figure>
  <video controls playsinline preload="none" poster="/media/images/frame-motion.jpg" aria-label="기준 Frame과 TCP의 복합 모션 시뮬레이션">
    <source src="/media/videos/frame-motion.mp4" type="video/mp4" />
    <a href="/media/videos/frame-motion.mp4">복합 모션 영상 내려받기</a>
  </video>
  <figcaption>기준 Frame의 사각형 이동, TCP의 상대 원운동, offset 변경을 함께 적용한 시뮬레이션.</figcaption>
</figure>

## 적용한 동작

- 기준 Frame은 한 변 6 cm의 사각형을 따라 이동한다.
- TCP는 기준 Frame의 평면보다 2 cm 위에서 반지름 1 cm의 원을 그린다.
- 모션 중 TCP offset의 위치와 자세를 부드럽게 바꾼다.

## 양팔 상대 모션 결과

<figure>
  <video controls playsinline preload="none" poster="/media/images/dual-arm.jpg" aria-label="왼팔 기준 오른팔 상대 모션 시뮬레이션">
    <source src="/media/videos/dual-arm.mp4" type="video/mp4" />
    <a href="/media/videos/dual-arm.mp4">양팔 상대 모션 영상 내려받기</a>
  </video>
  <figcaption>왼팔의 절대 모션과 왼팔 기준 오른팔의 상대 모션을 함께 실행했다.</figcaption>
</figure>

2026년 10월의 두 실험은 모두 MuJoCo 기반 물리 엔진 시뮬레이션에서 동작을 확인했다.
