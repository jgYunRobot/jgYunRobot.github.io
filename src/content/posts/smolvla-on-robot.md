---
title: SmolVLA로 실제 로봇의 노란 병 추종 시연
pubDatetime: 2026-10-17T00:02:00+09:00
category: Physical AI
tags: [smolvla, lerobot, policy, hardware]
description: 학습한 SmolVLA 정책을 실제 로봇에 연결해 노란 병을 따라가는 동작을 시연했다.
---

**SmolVLA를 학습하고 실제 로봇에 연결해 노란 병을 따라가는 동작을 시연했다.** 카메라 관측과 로봇 상태를 정책에 입력하고, 출력된 action을 직접 개발하는 제어기에 전달했다.

## 실물 시연

<figure>
  <video controls playsinline preload="none" poster="/media/images/smolvla.jpg" aria-label="SmolVLA로 노란 병을 따라가는 실제 로봇 시연">
    <source src="/media/videos/smolvla.mp4" type="video/mp4" />
    <a href="/media/videos/smolvla.mp4">시연 영상 내려받기</a>
  </video>
  <figcaption>“follow the yellow bottle” 작업의 학습·추론·실물 제어 연결 시연.</figcaption>
</figure>

## 연결한 내용

- LeRobot의 SmolVLA로 해당 작업을 학습했다.
- 카메라 영상과 현재 로봇 상태를 정책의 관측으로 사용했다.
- 출력에서 하나의 action을 적용한 뒤 다음 관측으로 다시 추론했다.

## 확인한 결과

2026년 8월 실험에서 관측, 학습 정책, 제어기를 연결해 실제 로봇을 구동했다. 해당 작업의 실물 연결과 동작을 확인한 시연이다.
