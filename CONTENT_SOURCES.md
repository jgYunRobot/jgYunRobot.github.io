# 글과 자료의 출처

Notion의 개인 개발 기록과 개인·학부 연구 미디어를 글 단위로 선별했습니다.
원문 URL은 공개된 글에도 연결했습니다. Notion 원문은 독자의 접근 권한에 따라 열리지 않을 수 있습니다.
블로그 본문·이미지·영상은 Notion 로그인이 없어도 로컬 정적 파일에서 제공됩니다.

| 글 | 근거 | 사용 미디어 |
| --- | --- | --- |
| Nodus에서 모델·제어·입력의 경계를 나누는 방법 | 개인 Nodus 저장소의 README·설계 경계, [API 기록](https://app.notion.com/p/3e6b9055f84c807a9740cd4324b96857), 개인 프레임워크 설명 자료 | 없음 |
| LeRobot 입력으로 eRob을 움직여 보기 | [Teleoperation 원문](https://app.notion.com/p/37db9055f84c8023ade0e9886a11b929) | teleoperation.jpg / .mp4 |
| SmolVLA의 출력을 실제 로봇 제어에 연결하기 | [정책 연동 원문](https://app.notion.com/p/3b0b9055f84c809dabcbd1e0cdf32f5e) | smolvla.jpg / .mp4 |
| 움직이는 기준 Frame에서 원을 그리며 TCP offset 바꾸기 | [Combined Task Motion](https://app.notion.com/p/3eeb9055f84c80239eb1df58087fc3fd), [Jacobian](https://app.notion.com/p/3cab9055f84c80ba9da6f2a479f09818) | frame-motion.jpg / .mp4, dual-arm.jpg / .mp4 |
| 공간 경로와 시간 계획을 분리해서 모션 보기 | [motion](https://app.notion.com/p/3bfb9055f84c8053bf86dee5eaa09bb5), [초기 topp](https://app.notion.com/p/3bfb9055f84c80b89e97d777ad87c742), 개인 C++ 모션 예제·설명 자료 | linear-path.png, circle-path.png, linear-profile.png, circle-profile.png, motion-planning.jpg / .mp4 |
| 처음부터 연결해 본 휠체어 장착형 4축 로봇팔 | 학부 연구 자료, ICROS 2021 발표 기록 | wheelchair-arm.jpg / .mp4 |

## 시점과 검증 범위

- 모든 글의 작성일은 2026-10-17입니다. 원래 실험 시점은 본문에 구분했습니다.
- Nodus 구조 설명은 초기 pa_control의 mailbox 문서를 그대로 복제하지 않고, 후속 embedded gateway·Pilot 구조를 반영했습니다.
- Teleoperation과 SmolVLA는 특정 작업의 실물 연결 시연입니다.
- 복합 Frame·양팔 상대 모션은 VC/Gym 시뮬레이션입니다.
- 모션 표본 그래프와 실물 영상은 같은 추종 정확도 측정의 결과로 결합하지 않았습니다.
- 초기 TOPP 문서의 JointPath·고정 profile 범위와 후속 C++ 모션 예제의 차이를 본문에 밝혔습니다.
- 학부 로봇팔 영상의 원본 3배속 표기를 유지했습니다.
- 임시 Notion 다운로드 URL, 접근 토큰, 원문 첨부파일 식별자, 개인 환경 설정은 복사하지 않았습니다.

## 화면 구성 참고

AstroPaper 원본 revision: `35cfa7fbe0b897306d27670d3819e55d5205f3dd`.
테마의 Markdown 글·태그·검색·아카이브·RSS 구조를 사용하고, 한국어 UI·분류 페이지·기본 다크 모드·개인 글과 미디어를 추가했습니다.
