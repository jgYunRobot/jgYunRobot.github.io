---
title: LeRobot 입력으로 eRob을 움직여 보기
pubDatetime: 2026-10-17T00:01:00+09:00
category: Physical AI
tags: [teleoperation, lerobot, hardware, nodus]
description: 리더 암의 관절 입력을 실제 eRob 로봇에 연결했던 과정과, 이 시연에서 확인한 범위를 정리한다.
---

학습 정책을 실제 로봇에 연결하기 전에 사람이 만든 입력으로 제어 경로를 먼저 확인했다. 2026년 6월의 이 실험은 LeRobot 리더 입력을 eRob 로봇의 관절 목표에 연결한 기록이다.

## 목차

## 먼저 시뮬레이션에서 입력을 연결했다

리더 암과 제어 로봇은 관절 구성이 그대로 일치하지 않는다. 이 실험에서는 관절 offset으로 기준 자세를 맞추고, 입력을 관절 목표로 전달했다. 시뮬레이션에서 동작을 확인한 뒤 실제 로봇에 연결했다.

<figure>
  <video controls playsinline preload="none" poster="/media/images/teleoperation.jpg" aria-label="LeRobot 리더 입력으로 eRob을 움직이는 개인 실험 영상">
    <source src="/media/videos/teleoperation.mp4" type="video/mp4" />
    영상 재생을 지원하지 않는 브라우저입니다. <a href="/media/videos/teleoperation.mp4">영상을 내려받을 수 있습니다.</a>
  </video>
  <figcaption>실물 Teleoperation 시연. 리더 입력과 실제 로봇 움직임의 연결을 확인하는 영상이다.</figcaption>
</figure>

## Task Space 제어와 구분하기

리더의 관절 목표를 전달하는 것과 TCP의 위치·자세를 지정하는 것은 다른 문제다. 전자는 관절 대응과 offset이 중요하고, 후자는 기준 좌표계와 기구학, 도달 가능한 목표, 모션 생성까지 함께 다뤄야 한다.

당시에는 우선 관절 입력 경로부터 연결했다. 이후에는 online trajectory generation을 사용하는 Task Jog도 실험했다. 두 단계를 구분해야 영상에서 확인한 동작을 과도하게 일반화하지 않을 수 있다.

## 이 실험이 다음 단계에 남긴 것

사람이 만든 입력을 전달할 수 있으면, 그 자리에 정책이 만든 출력을 연결하는 실험으로 넘어갈 수 있다. 입력을 만드는 주체가 바뀌어도 장치 통신과 하위 제어 전체를 다시 작성하지 않는 것이 Nodus를 나누어 구성하는 이유 중 하나다.

이 영상에서 확인한 것은 해당 구성의 실물 Teleoperation이다. 다른 로봇 구성 사이의 일반적인 retargeting이나 정량적인 추종 성능까지 측정한 결과는 아니다.

## 관련 기록

- [Controlling eRob with LeRobot — Notion 원문](https://app.notion.com/p/37db9055f84c8023ade0e9886a11b929)
- [원본 시연 영상 — YouTube](https://youtu.be/ZDIYzo6jYt0)
- [SmolVLA를 실물 제어에 연결한 기록](/posts/smolvla-on-robot/)
