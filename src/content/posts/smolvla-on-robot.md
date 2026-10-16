---
title: SmolVLA의 출력을 실제 로봇 제어에 연결하기
pubDatetime: 2026-10-17T00:02:00+09:00
category: Physical AI
tags: [smolvla, lerobot, policy, hardware]
description: 카메라 관측과 로봇 상태를 정책 입력으로 사용해 노란 병을 따라가는 작업을 시연했다. 정책 실행 방식과 검증 범위를 함께 남긴다.
---

Teleoperation 다음으로 해 본 것은 학습 정책이 만든 출력을 로봇의 움직임으로 연결하는 일이었다. LeRobot의 SmolVLA를 이용해 간단한 학습을 수행하고, **“follow the yellow bottle”** 작업을 실제 로봇에서 시연했다. 원래 실험 기록은 2026년 8월에 작성했다.

## 목차

## 관측에서 동작까지

이 실험에서는 카메라 관측과 로봇 상태를 정책 입력으로 사용한다. 정책이 출력한 action은 로봇 제어 경로로 전달한다. 모델을 실행하는 것뿐 아니라 관측을 읽는 시점, 로봇 상태와 action의 의미, 하위 제어로 넘기는 경계가 함께 맞아야 움직임으로 이어진다.

```text
카메라 관측 + 로봇 상태
          ↓
     SmolVLA 추론
          ↓
   action을 제어 경로에 전달
          ↓
      로봇 동작
          ↓
   다음 관측으로 다시 추론
```

<figure>
  <video controls playsinline preload="none" poster="/media/images/smolvla.jpg" aria-label="SmolVLA 정책을 적용한 로봇의 노란 병 추종 시연">
    <source src="/media/videos/smolvla.mp4" type="video/mp4" />
    <a href="/media/videos/smolvla.mp4">시연 영상 내려받기</a>
  </video>
  <figcaption>노란 병을 따라가는 실물 연결 시연. 세로 영상은 원본 비율을 유지했다.</figcaption>
</figure>

## 한 번에 적용한 action은 하나

이 시연에서는 action chunk 전체를 차례대로 소비하지 않는다. chunk에서 하나의 action을 적용한 뒤, 새로운 관측으로 다시 추론하는 방식으로 동작시켰다.

그래서 이 결과를 chunk 실행 전략까지 완성한 시스템으로 설명하지 않는다. 원래 기록에서도 chunk를 모두 사용하거나 후처리하는 방식은 다음에 검토할 항목으로 남겨 두었다.

## 영상과 성능 평가의 차이

영상은 관측·추론·실물 제어가 연결되었다는 사실을 보여 준다. 작업 성공률, 지연 시간 분포, 다른 물체나 환경에서의 일반화 성능을 측정한 평가 자료는 아니다.

이번 실험의 범위는 단순한 작업을 통해 학습 정책의 출력이 실제 제어 경로까지 전달되는지 확인하는 데 있다. 이후 실행 방식을 비교할 때도 어떤 action을 언제 소비했는지 기록으로 남기는 것이 필요하다.

## 관련 기록

- [Control powered by SmolVLA — Notion 원문](https://app.notion.com/p/3b0b9055f84c809dabcbd1e0cdf32f5e)
- [원본 영상 — YouTube](https://www.youtube.com/shorts/BIje8d85zEM)
