---
homeDate: 2026-02-17T00:00:00+09:00
homeTitle: Learning Pick & Place with LeRobot + SmolVLA
homeCategory: Physical AI
homeCoverAlt: A trained robot arm picking up an object and placing it in a bowl
cover: /media/images/lerobot-pick-place.jpg
coverAlt: 로봇팔이 물건을 집어 그릇에 넣는 실제 학습 실행
previewVideo: /media/previews/lerobot-pick-place.mp4
title: LeRobot·SmolVLA로 물건을 집어 그릇에 넣도록 학습
pubDatetime: 2026-10-17T00:06:00+09:00
featured: true
category: Physical AI
tags: [lerobot, smolvla, imitation-learning, pick-and-place]
description: 물건을 집어 그릇에 넣는 작업의 데이터를 수집하고, SmolVLA 첫 학습과 실제 로봇 실행을 진행했다.
---

**LeRobot으로 물건을 집어 그릇에 넣는 작업을 학습하고, SmolVLA의 첫 실물 실행을 진행했다.** 사람의 시연으로 학습 데이터를 만들고, 학습한 정책이 로봇을 움직이도록 연결했다.

## 첫 학습 결과

<figure>
  <video controls playsinline preload="none" poster="/media/images/lerobot-pick-place.jpg" aria-label="LeRobot·SmolVLA 집기·놓기 첫 학습 실행 영상">
    <source src="/media/videos/lerobot-pick-place.mp4" type="video/mp4" />
    <a href="/media/videos/lerobot-pick-place.mp4">첫 학습 실행 영상 내려받기</a>
  </video>
  <figcaption>물건을 집어 그릇에 넣는 작업을 대상으로 한 SmolVLA 첫 학습 실행 영상.</figcaption>
</figure>

2026년 2월 17일에 기록한 첫 학습의 실행 영상이다.

## 학습한 작업

작업은 **물건을 들어 그릇 안에 놓는 동작**이다. 데이터 수집과 실행 시 이 작업을 언어 지시로 전달했다.

| 항목               | 기록한 구성                               |
| ------------------ | ----------------------------------------- |
| 정책               | SmolVLA                                   |
| 관측               | 상단 카메라·손목 카메라, 로봇 상태        |
| 학습 데이터        | 사람이 Teleoperation으로 수행한 작업 시연 |
| 첫 학습 batch size | 8                                         |
| 첫 학습 steps      | 100,000                                   |

## 연결한 과정

1. 리더 암으로 작업을 시연하며 카메라 영상과 로봇 데이터를 수집했다.
2. 물건을 집어 그릇에 넣는 작업 지시와 함께 SmolVLA를 학습했다.
3. 학습한 정책을 로봇에 적용하고 실행 결과를 별도 평가 데이터로 기록하는 구성을 마련했다.

첫 학습과 로봇 실행을 연결한 기록이며, 작업 성공률을 집계한 평가는 포함하지 않았다.
