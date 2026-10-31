# jgYunRobot — 로봇 개발 노트

개인 로봇 개발·학부 연구·Physical AI 실험을 정리하는 기술 블로그입니다.
AstroPaper를 기반으로 구성했습니다.

## 개발 및 미리보기

Node.js 24를 사용합니다.

```bash
npm ci
npm run dev
```

검색까지 포함한 완성된 정적 사이트를 확인하려면:

```bash
npm run build
python3 scripts/check_links.py
npm run preview -- --host 127.0.0.1 --port 4173
```

## 글 쓰기

`src/content/posts/`에 Markdown 파일을 추가합니다. 파일 이름이 글 주소가 됩니다.

```yaml
---
title: 글 제목
pubDatetime: 2026-10-17T10:00:00+09:00
category: 모션·기구학
tags: [motion, cpp]
description: 글 목록과 검색에 표시할 요약
---
```

`## 목차`를 넣으면 본문의 제목으로 목차를 만듭니다. `featured: true`는 홈의 먼저 읽기에 표시합니다.
본문에 영상은 `controls playsinline preload="none"`을 사용해 독자가 선택했을 때 재생합니다.

## 사이트 설정

- 제목·작성자·주소·외부 링크: `astro-paper.config.ts`
- 소개: `src/content/pages/about.md`
- 테마 색상: `src/styles/theme.css`
- 시스템 연동·사용자 테마 선택: `src/scripts/theme.ts`, `src/layouts/Layout.astro`
- 한글 UI: `src/i18n/lang/ko.ts`
- 개인 미디어: `public/media/`

홈은 시스템·브라우저 설정과 저장된 테마에 관계없이 어두운 배경·은색 제목·민트색 N으로 고정합니다. `src/styles/nodus-home.css`의 홈 전용 팔레트와 첫 HTML의 다크 선언, 사전 렌더 포스터, WebGL 재질을 함께 고정해 최초 표시와 페이지 복귀 때도 같은 색을 사용합니다.
글 읽기 화면은 기존처럼 시스템/라이트/다크를 선택하고 저장합니다. 홈을 방문해도 그 선택을 덮어쓰지 않습니다. 일반 문서의 팔레트는 `src/styles/theme.css`에 있습니다.
실제 삼성 인터넷의 강제 다크 변환을 줄이기 위해 홈 배경과 카드 단색 면은 1×1 sRGB 캔버스에 한 번만 그려 늘려 씁니다. 글·링크·영상은 기존 HTML이며, 캔버스는 입력을 가로채지 않고 별도 애니메이션 루프도 실행하지 않습니다. 카드 표지도 로딩 후 최대 너비 768px의 sRGB 캔버스에 한 번만 그려 삼성의 이미지 밝기 변환을 줄이며, 원래 이미지의 대체 텍스트와 HTML 영상 재생은 유지합니다.
카드·바닥 그림자는 작은 검정/투명 WebP를 재사용하고 multiply 합성으로 밝은 번짐을 줄입니다. CSS box-shadow·실시간 blur는 사용하지 않으며, 그림자는 `node scripts/generate-home-shadows.mjs`로 다시 생성할 수 있습니다.
연결한 Android 16·삼성 인터넷 30.0.5.27 실기기의 밝게 보기/어둡게 보기에서 배경 `#080b0e`·카드 면 `#161d23`과 흰 번짐 제거를 확인했습니다. 다른 버전의 강제 색 보정은 별도 확인이 필요합니다.
기본 우클릭 메뉴는 `src/scripts/site-interactions.ts`에서 차단합니다. 외부 iframe 내부 메뉴는 해당 서비스에서 처리합니다.

## GitHub Pages

GitHub 저장소의 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 설정합니다.
`main`에 반영하면 `.github/workflows/pages.yml`이 빌드·링크 확인 후 `dist/`만 배포합니다.
PR에서는 빌드와 링크 확인만 실행합니다. 목표 주소는 `https://jgyunrobot.github.io/`입니다.

## 콘텐츠 관리

- 블로그 글은 개인 개발 기록과 학부 연구 자료를 사용합니다.
- 소개 페이지는 제공된 이력서의 회사 경력기술서를 담습니다.
- 본문은 결과를 먼저 쓰고 구현 내용과 확인 범위를 간결하게 정리합니다.
- 외부 계정 링크와 수식, 개인 제어기의 내부 구조·고유 이름을 노출하지 않습니다.
- 실물 시연·시뮬레이션·코드 설계를 구분합니다.
- 기존 이력서나 포트폴리오 PDF는 배포하지 않습니다.
- 작성일은 블로그에 정리한 날짜이며, 과거 실험의 시점은 본문에 표기합니다.
- 출처와 미디어 대응은 `CONTENT_SOURCES.md`에 기록했습니다.

## 테마 및 라이선스

테마: AstroPaper, MIT License, Sat Naing.
원본 테마 라이선스는 `LICENSE`에 유지했습니다. 개인 글·사진·영상의 권리는 각 원저작자에게 있습니다.

구성 참고: [AstroPaper](https://astro-paper.pages.dev/), [Chirpy](https://chirpy.cotes.page/).
빌드·배포 방식은 GitHub Pages 공식 문서를 참고했습니다.

## Project Nodus 홈

홈은 Three.js로 만든 조명을 받는 입체 타이틀과 CSS 3D 프로젝트 캐러셀로 구성합니다.
카드에 마우스를 올리면 그 카드만 올라오며 무음 미리보기가 재생됩니다. 벗어나거나 카드를
넘기면 영상이 멈춥니다. 이전·다음 버튼, 방향키, 카드 영역의 마우스 휠, 드래그·스와이프를 지원하며 작은 화면에는
영상 미리보기 버튼을 표시합니다. Motion 버튼과 시스템의 움직임 줄이기 설정을 반영합니다.

홈은 영어로 구성하며, 글 frontmatter의 `homeTitle`, `homeCategory`, `homeCoverAlt`로 영어 카드 문구를 지정합니다.
원래 글 제목·분류·본문은 유지합니다. 중앙 Timeline 날짜는 기본적으로 블로그 등록일인 `pubDatetime`을 사이트 시간대로 표시합니다.
기존 글 6개에만 원문 작업 기록을 대조한 마지막 날짜를 `homeDate`로 보정했습니다. 일부는 마지막 기록일·프로젝트 종료 월말을 사용한 근사 날짜이며, 실험 실행일의 정밀한 확정값은 아닙니다.
새 글은 `homeDate`를 추가하지 않고 등록일을 사용합니다.
날짜가 달라지면 숫자가 굴러가고 Motion off 또는 움직임 줄이기 설정에서는 즉시 갱신합니다.
홈 카드는 왼쪽 과거 → 오른쪽 최근 순서로 배치하고 처음에는 최신 카드를 중앙에 표시합니다. 양 끝은 기존처럼 원형으로 이어집니다. 대표 이미지·미리보기 경로도 frontmatter에서 지정합니다.

```yaml
homeTitle: Linear & Circular Motion in C++
homeCategory: Motion & Kinematics
homeCoverAlt: A real robot executing linear and circular motion
cover: /media/images/motion-planning.jpg
coverAlt: 실제 로봇의 직선·원호 동작
previewVideo: /media/previews/motion-planning.mp4
```

YouTube 영상을 쓰는 글은 `previewVideo` 대신 `previewYoutube`에 영상 ID를 넣습니다.
이 경우 카드를 미리 볼 때만 개인정보 보호 강화 모드의 플레이어가 생기고, 종료 시 제거됩니다.
로컬 미리보기는 기존 원본에서 만든 최대 8초의 무음 클립입니다. 본문의 원본 영상은 유지합니다.
대표 이미지·미리보기를 지정하지 않은 글도 기존 글 목록에서 읽을 수 있습니다.

카드·날짜 이동은 transform/opacity 중심으로 처리하고, 드래그 위치 갱신은 브라우저 프레임에 맞춥니다.
화면 밖·먼 카드의 부유 애니메이션도 정지합니다. 3D 글자는 기존 대비 삼각형 수를 약 39% 줄였으며,
렌더링 목표는 데스크톱 60 Hz·모바일 30 Hz입니다. 실제 프레임률은 기기와 브라우저 부하에 따라 달라집니다.

새로고침 시 실제 Three.js 장면에서 만든 정적 포스터를 먼저 표시하고, 같은 크기·구도의 첫 WebGL 화면이 준비되면 한 번에 교체합니다. PC·모바일용 다크 투명 WebP 두 장은 `src/assets/title-posters/`에 있으며 HTML에 인라인으로 포함되어 별도 이미지 요청이나 웹폰트·JavaScript 로딩을 기다리지 않습니다. 제목 공간은 고정하며, JavaScript 미사용·렌더러 실패 시에도 포스터가 계속 보입니다. 제목의 글자·재질·조명·기준 카메라를 바꾸면 두 포스터도 같은 정지 장면에서 다시 생성해야 합니다.

3D 코드는 홈에서만 동적으로 불러옵니다. 화면 밖·백그라운드 탭에서는 렌더링을 멈추고,
페이지를 이동할 때 WebGL 리소스를 해제합니다. WebGL 사용이 어려우면 정적 포스터를 유지하며
JavaScript 없이도 프로젝트 링크를 이용할 수 있습니다. 설계는 `DESIGN.md`, 자산 출처는
`THIRD_PARTY_NOTICES.md`를 참고합니다.

## 홈의 회사 경력 탐색

개인 Project Nodus의 가로 프로젝트 탐색과 회사 업무의 세로 경력 탐색을 같은 홈에서 연결합니다. 중앙 카드 위의 넓은 **Professional Experience** 영역에서 아래로 스크롤하거나 클릭하면, 타이틀과 중앙 카드가 물러나고 배경 위에 경력이 길게 펼쳐집니다.

- 회사명·직책·재직 기간과 업무 요약은 기존 `src/content/pages/about.md`를 사용합니다. 상세 경력은 `/about/`에서 읽습니다.
- 경력을 읽는 동안에는 좌우 카드의 위치를 유지합니다. 가로 탐색을 요청하면 경력 전환을 마친 뒤 프로젝트를 이동해 겹침을 방지합니다.
- 경력 맨 위에서 위로 다시 스크롤하거나, 터치로 아래로 당기거나, Projects·Esc로 복귀합니다.
- 로고는 Project Nodus와 Junggil Yun / Professional Experience 사이를 같은 위치에서 부드럽게 전환합니다.
- 터치 기기에는 마우스 없이도 보이는 3D 타이틀 회전과 조명 움직임을 적용합니다. 움직임 줄이기와 Motion off를 존중합니다.
- 관련 파일은 `src/components/NodusExperience.astro`, `src/scripts/nodus-experience.ts`, `src/styles/nodus-experience.css`입니다. 시안의 진단 표시·임시 번들·import map은 배포에 포함하지 않습니다.
