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

첫 방문은 시스템의 라이트·다크 설정을 따릅니다. 테마 선택기에서 시스템/라이트/다크를 고를 수 있고, 수동 선택은 저장합니다. 시스템 모드에서는 OS 설정이 바뀌면 즉시 반영합니다.
홈의 두 팔레트는 `src/styles/nodus-home.css`, 일반 문서는 `src/styles/theme.css`에서 직접 정의합니다.
페이지 바탕과 브라우저 테마색, 기본 UI color-scheme, 3D 글자 재질도 함께 바뀝니다.
삼성 인터넷의 별도 강제 다크 설정은 사이트 선언을 무시할 수 있어 실기기 확인이 필요합니다.
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

새로고침 시 작은 대체 제목과 준비 중인 캔버스는 숨기고, 최종 크기의 첫 WebGL 화면이 준비되면 제목만 즉시 표시합니다. 제목 공간은 처음부터 고정하며, JavaScript 미사용·렌더러 실패 시에는 정적 대체 제목을 표시합니다.

3D 코드는 홈에서만 동적으로 불러옵니다. 화면 밖·백그라운드 탭에서는 렌더링을 멈추고,
페이지를 이동할 때 WebGL 리소스를 해제합니다. WebGL 사용이 어려우면 CSS 타이틀을 표시하며
JavaScript 없이도 프로젝트 링크를 이용할 수 있습니다. 설계는 `DESIGN.md`, 자산 출처는
`THIRD_PARTY_NOTICES.md`를 참고합니다.
