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
- 기본 다크 모드·사용자 테마 선택: `src/scripts/theme.ts`, `src/layouts/Layout.astro`
- 한글 UI: `src/i18n/lang/ko.ts`
- 개인 미디어: `public/media/`

OS의 화면 모드에 관계없이 첫 방문은 다크 모드입니다. 독자가 테마를 바꾸면 선택을 저장합니다.

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
넘기면 영상이 멈춥니다. 이전·다음 버튼, 방향키, 드래그·스와이프를 지원하며 작은 화면에는
영상 미리보기 버튼을 표시합니다. Motion 버튼과 시스템의 움직임 줄이기 설정을 반영합니다.

글 frontmatter의 대표 이미지·미리보기 경로를 사용합니다.

```yaml
cover: /media/images/motion-planning.jpg
coverAlt: 실제 로봇의 직선·원호 동작
previewVideo: /media/previews/motion-planning.mp4
```

YouTube 영상을 쓰는 글은 `previewVideo` 대신 `previewYoutube`에 영상 ID를 넣습니다.
이 경우 카드를 미리 볼 때만 개인정보 보호 강화 모드의 플레이어가 생기고, 종료 시 제거됩니다.
로컬 미리보기는 기존 원본에서 만든 최대 8초의 무음 클립입니다. 본문의 원본 영상은 유지합니다.
대표 이미지·미리보기를 지정하지 않은 글도 기존 글 목록에서 읽을 수 있습니다.

3D 코드는 홈에서만 동적으로 불러옵니다. 화면 밖·백그라운드 탭에서는 렌더링을 멈추고,
페이지를 이동할 때 WebGL 리소스를 해제합니다. WebGL 사용이 어려우면 CSS 타이틀을 표시하며
JavaScript 없이도 프로젝트 링크를 이용할 수 있습니다. 설계는 `DESIGN.md`, 자산 출처는
`THIRD_PARTY_NOTICES.md`를 참고합니다.
