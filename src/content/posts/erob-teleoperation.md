---
title: 직접 개발하는 제어기로 eRob 실물 Teleoperation 연결
pubDatetime: 2026-10-17T00:01:00+09:00
category: 로봇 제어
tags: [teleoperation, lerobot, hardware, robot-control]
description: LeRobot 리더 암의 입력을 개인 제어기에 연결해 eRob 실물 로봇을 움직였다.
---

**LeRobot 리더 암으로 eRob 실물 로봇을 움직이는 Teleoperation을 구현했다.** 직접 개발하는 제어기에 리더의 관절 입력을 연결하고, 시뮬레이션 확인 후 실제 로봇에서 동작시켰다.

## 실물 시연

<figure>
  <video controls playsinline preload="none" poster="/media/images/teleoperation.jpg" aria-label="LeRobot 입력을 이용한 eRob 실물 Teleoperation 시연">
    <source src="/media/videos/teleoperation.mp4" type="video/mp4" />
    <a href="/media/videos/teleoperation.mp4">시연 영상 내려받기</a>
  </video>
  <figcaption>리더 암의 관절 입력과 eRob 실물 로봇의 움직임을 연결한 시연.</figcaption>
</figure>

## 구현한 내용

- 리더 암과 제어 로봇의 기준 자세를 관절 offset으로 맞췄다.
- 리더 입력을 제어 로봇의 관절 목표로 전달했다.
- 시뮬레이션에서 입력과 동작을 확인한 뒤 실물에 적용했다.

## 확인한 결과

2026년 6월 실험에서 사람의 관절 입력으로 실제 로봇을 조작하는 경로를 확인했다. 이 입력을 바탕으로 카메라 데이터 수집과 학습 정책 연동 실험을 이어갔다.
