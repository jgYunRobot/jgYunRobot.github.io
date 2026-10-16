---
title: C++ 모션 생성기로 직선·원호 동작 구현
pubDatetime: 2026-10-17T00:04:00+09:00
category: 모션·기구학
tags: [motion, trajectory, cpp, robot-control]
description: 직선·원호 경로와 시간 계획을 구현하고, 생성한 모션을 실제 로봇에 연결했다.
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
