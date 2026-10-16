---
title: 처음부터 연결해 본 휠체어 장착형 4축 로봇팔
pubDatetime: 2026-10-17T00:05:00+09:00
category: 로봇 제작
tags: [robot-arm, vision, hardware, research]
description: 2021년 학부 연구에서 기구·감속기·모터 제어·비전·음성 명령을 하나의 로봇 동작으로 연결했던 기록.
---

2021년 1월부터 2022년 1월까지, 학부 연구로 휠체어에 장착하는 4축 로봇팔을 만들었다. 사용자가 음성으로 물체를 요청하면 이를 인식하고 움직임으로 연결하는 것이 목표였다.

한 가지 알고리즘보다 **기구·전장·인식·제어를 끝까지 연결하는 과정**이 중심인 프로젝트였다.

## 목차

## 기구와 동력 전달

휠체어에 장착할 수 있는 작업 반경과 구조를 정하고, Cycloidal 감속기와 Belt/Pulley 동력 전달 구조를 설계했다. 로봇의 운동은 기구학 식만으로 정해지지 않는다. 모터와 감속기, 동력 전달 구조를 함께 정해야 실제로 움직일 수 있다.

## 인식 결과를 목표 동작으로

YOLO와 Depth Vision으로 물체와 위치를 판단하고, Character Embedding 기반 명령 해석과 전·후처리로 음성 명령을 연결했다. Python으로 기구학과 via-point를 포함하는 시간 기반 궤적을 구현했다.

Arduino 기반 모터 드라이브에는 PID 제어와 UART 통신을 구성했다. 상위에서 만든 목표가 실제 관절의 움직임으로 이어지도록 통신과 모터 제어를 연결했다.

<figure>
  <video controls playsinline preload="none" poster="/media/images/wheelchair-arm.jpg" aria-label="음성 명령으로 컵을 파지하는 학부 연구 로봇팔 시연">
    <source src="/media/videos/wheelchair-arm.mp4" type="video/mp4" />
    <a href="/media/videos/wheelchair-arm.mp4">로봇팔 시연 영상 내려받기</a>
  </video>
  <figcaption>“컵 잡아줘” 동작 시연. 왼쪽은 객체 감지 화면, 오른쪽은 실제 로봇이다. 원본 영상은 3배속이다.</figcaption>
</figure>

## 이 경험에서 이어진 관심

인식 결과를 얻는 것과 실제 로봇이 그 결과를 이용해 움직이는 것 사이에는 많은 경계가 있다. 지금 개인적으로 개발하는 Nodus와 Physical AI 실험에서도 관측, 목표 생성, 모션, 장치 제어가 어떻게 연결되는지 계속 다루고 있다.

이 프로젝트의 결과는 특정 물체 파지 시연과 학부 연구 범위다. 인식 정확도나 모든 일상 작업의 성공률을 측정한 자료는 아니다.

## 발표 기록

ICROS 2021 학술대회에서 **「노약자와 장애인을 위한 휠체어 장착형 로봇팔 설계」**를 제1저자로 발표했다. 이 글은 당시 개인 연구·포트폴리오 자료를 바탕으로 정리했다.
