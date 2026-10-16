---
title: 음성 명령으로 물체를 집는 휠체어 장착형 로봇팔 제작
pubDatetime: 2026-10-17T00:05:00+09:00
category: 로봇 제작
tags: [robot-arm, vision, hardware, research]
description: 휠체어 장착형 4축 로봇팔을 제작하고, 비전·음성 명령·모터 제어를 연결해 물체 파지를 시연했다.
---

**휠체어 장착형 4축 로봇팔을 제작하고, “컵 잡아줘”라는 음성 명령으로 물체를 파지하는 동작을 시연했다.** 기구·감속기 설계부터 비전, 명령 해석, 모터 제어까지 연결한 학부 연구다.

## 동작 결과

<figure>
  <video controls playsinline preload="none" poster="/media/images/wheelchair-arm.jpg" aria-label="음성 명령으로 컵을 파지하는 휠체어 장착형 로봇팔">
    <source src="/media/videos/wheelchair-arm.mp4" type="video/mp4" />
    <a href="/media/videos/wheelchair-arm.mp4">시연 영상 내려받기</a>
  </video>
  <figcaption>음성 명령을 받아 컵을 파지하는 실제 로봇팔. 원본 영상은 3배속이다.</figcaption>
</figure>

## 제작한 내용

- 휠체어 장착을 위한 4축 기구, Cycloidal 감속기와 동력 전달 구조를 설계했다.
- Python으로 기구학과 궤적 생성 프로그램을 구현했다.
- Arduino에 PID 모터 제어와 UART 통신을 구현했다.
- YOLO·Depth Vision의 물체 위치와 음성 명령 해석을 로봇 동작에 연결했다.

## 연구·발표

2021년 1월부터 2022년 1월까지 진행했다. ICROS 2021에서 **「노약자와 장애인을 위한 휠체어 장착형 로봇팔 설계」**를 제1저자로 발표했다.
