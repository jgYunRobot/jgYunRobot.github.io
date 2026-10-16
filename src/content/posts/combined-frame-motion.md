---
title: 움직이는 기준 Frame에서 원을 그리며 TCP offset 바꾸기
pubDatetime: 2026-10-17T00:03:00+09:00
category: 모션·기구학
tags: [frame, jacobian, motion, simulation]
description: 사각형으로 움직이는 기준 Frame, 그 안에서 원을 그리는 TCP, 실시간 offset 변화를 하나의 Task로 합성한 시뮬레이션 기록.
---

TCP가 어느 위치로 이동하는지를 지정할 때, 그 목표를 표현하는 기준 Frame도 움직일 수 있다. 여기에 flange와 TCP 사이의 offset까지 바뀌면 관절이 만들어야 하는 운동에는 여러 항이 함께 들어간다.

2026년 10월의 개인 VC/Gym 실험에서는 이 세 움직임을 동시에 주었다.

## 목차

## 시뮬레이션 조건

- 기준 **B Frame**은 world에서 한 변 6 cm의 사각형을 그린다.
- **TCP**는 B의 XY 평면보다 2 cm 위에서 반지름 1 cm의 원을 반복한다.
- B의 속도 제한은 0.004 m/s, TCP의 B 기준 속도 제한은 0.05 m/s다.
- flange → TCP offset은 5초 간격으로 변경하며, 각 변경은 1초 동안 보간한다.

<figure>
  <video controls playsinline preload="none" poster="/media/images/frame-motion.jpg" aria-label="상대 Frame 모션과 TCP offset 변화를 합성하는 VC/Gym 시뮬레이션">
    <source src="/media/videos/frame-motion.mp4" type="video/mp4" />
    <a href="/media/videos/frame-motion.mp4">시뮬레이션 영상 내려받기</a>
  </video>
  <figcaption>VC/Gym 시뮬레이션. 실물 로봇의 추종 성능을 측정한 영상은 아니다.</figcaption>
</figure>

## 상대 운동을 world에서 보기

world에서 본 TCP 위치는 B의 위치와 B 안에서의 상대 위치를 합친 것이다. 속도에는 기준 Frame의 회전이 만들어 내는 항도 추가된다.

```text
p_T = p_B + R_B p_BT

v_T = v_B + ω_B × (p_T − p_B) + R_B v_BT
ω_T = ω_B + R_B ω_BT
```

모든 world 위치·속도는 같은 좌표계로 표현하고, `v_BT`, `ω_BT`는 B에서 표현한 상대 속도다. 이 실험에서는 B의 자세가 고정되어 있어 기준 Frame 회전으로 생기는 항은 0이다.

이 구분을 하지 않고 상대 속도를 그대로 더하면 B가 회전하는 경우에 좌표축이 맞지 않는 계산을 하게 된다.

## offset 변화는 관절 운동과 다르다

TCP offset이 스스로 변하면서 만들어 내는 속도를 관절이 만든 속도로 계산하면 안 된다. 현재 offset을 반영한 TCP Jacobian을 사용하고, offset 변화로 생긴 속도는 목표 TCP 속도에서 빼서 관절 운동을 보정한다.

이렇게 구성하면 TCP가 B 기준의 원을 유지하는 동안에도 flange의 위치·자세와 flange → TCP 벡터는 달라질 수 있다.

## 양팔의 상대 운동으로 확장하기

같은 관점으로 왼팔의 절대 운동과 왼팔을 기준으로 한 오른팔의 상대 운동을 구성했다.

<figure>
  <video controls playsinline preload="none" poster="/media/images/dual-arm.jpg" aria-label="왼팔 기준 오른팔 상대 모션의 양팔 시뮬레이션">
    <source src="/media/videos/dual-arm.mp4" type="video/mp4" />
    <a href="/media/videos/dual-arm.mp4">양팔 시뮬레이션 영상 내려받기</a>
  </video>
  <figcaption>양팔 상대 모션 역시 VC/Gym 시뮬레이션 범위에서 확인했다.</figcaption>
</figure>

## 관련 기록

- [Combined Task Motion — Notion 원문](https://app.notion.com/p/3eeb9055f84c80239eb1df58087fc3fd)
- [Jacobian 일반화에 대한 개인 기록](https://app.notion.com/p/3cab9055f84c80ba9da6f2a479f09818)
