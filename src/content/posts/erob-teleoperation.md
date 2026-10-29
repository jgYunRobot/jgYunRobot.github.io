---
homeDate: 2026-08-02T00:00:00+09:00
homeTitle: From Teleoperation to SmolVLA Control
homeCategory: Physical AI
homeCoverAlt: A leader arm controlling a real robot during teleoperation
cover: /media/images/teleoperation.jpg
coverAlt: 리더 암으로 실제 로봇을 원격 조작하는 장면
previewVideo: /media/previews/teleoperation.mp4
title: Teleoperation 데이터로 SmolVLA를 학습하고 실물 로봇에 적용
pubDatetime: 2026-10-17T00:07:00+09:00
category: Physical AI
tags: [teleoperation, lerobot, smolvla, multimodal, hardware]
description: eRob Teleoperation으로 로봇·비전 데이터와 메타데이터를 수집하고, 멀티모달 데이터 구성·SmolVLA 학습·실물 제어까지 연결했다.
---

**Teleoperation으로 수집한 로봇·비전 데이터를 멀티모달 학습 데이터로 구성하고, SmolVLA 학습을 거쳐 실제 로봇의 노란 병 추종까지 연결했다.** 직접 개발하는 제어기에 사람의 입력과 학습 정책의 출력을 각각 연결해 데이터 수집부터 실물 적용까지 진행했다.

## 1. Teleoperation으로 실물 로봇 조작

LeRobot 리더 암의 관절 입력으로 eRob 실물 로봇을 움직였다. 리더와 제어 로봇의 기준 자세를 offset으로 맞추고, 시뮬레이션에서 입력과 동작을 확인한 뒤 실물에 적용했다.

<figure>
  <video controls playsinline preload="none" poster="/media/images/teleoperation.jpg" aria-label="학습 데이터 수집을 위한 eRob 실물 Teleoperation 시연">
    <source src="/media/videos/teleoperation.mp4" type="video/mp4" />
    <a href="/media/videos/teleoperation.mp4">Teleoperation 영상 내려받기</a>
  </video>
  <figcaption>리더 암으로 실제 로봇을 조작하는 Teleoperation 시연.</figcaption>
</figure>

## 2. 로봇·비전·메타데이터를 멀티모달 데이터로 구성

Teleoperation 중 로봇 상태와 카메라 관측을 함께 수집했다. 각 데이터의 시각과 메타데이터를 함께 관리하고, 같은 시간 기준으로 기록해 학습에 사용할 멀티모달 데이터로 정리했다.

| 구성            | 수집·정리한 내용                               |
| --------------- | ---------------------------------------------- |
| 로봇 데이터     | 관절 입력과 로봇 상태·동작 데이터              |
| 비전 데이터     | 작업 장면의 카메라 관측                        |
| 시간·메타데이터 | 관측 시각과 로봇·비전 데이터를 대응시키는 정보 |
| 작업 정보       | 노란 병을 따라가는 작업 지시                   |

카메라 관측과 로봇 상태를 함께 정책 입력으로 사용할 수 있도록 데이터 수집과 학습 경로를 연결했다.

## 3. SmolVLA 학습과 실물 적용

수집한 멀티모달 데이터로 SmolVLA를 학습하고, 추론 결과를 실제 로봇 제어에 적용했다. 카메라 영상과 현재 로봇 상태를 입력해 action을 얻고, 이를 제어기에 전달했다.

<figure>
  <video controls playsinline preload="none" poster="/media/images/smolvla.jpg" aria-label="멀티모달 데이터로 학습한 SmolVLA의 노란 병 추종 실물 시연">
    <source src="/media/videos/smolvla.mp4" type="video/mp4" />
    <a href="/media/videos/smolvla.mp4">학습 후 실물 시연 영상 내려받기</a>
  </video>
  <figcaption>학습한 정책을 적용해 “follow the yellow bottle” 작업을 수행하는 실제 로봇.</figcaption>
</figure>

이 시연에서는 출력에서 하나의 action을 적용한 뒤 다음 관측으로 다시 추론했다.

## 연결한 결과

**실물 조작 → 데이터 수집 → 멀티모달 데이터 구성 → 정책 학습 → 실물 추론·제어** 흐름을 직접 연결했다. 2026년 6–8월의 개인 개발·시연 기록을 바탕으로 정리했다.
