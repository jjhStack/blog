# jjh.log

개발하다 만난 에러와 배운 것, 일상을 적어 두는 개인 기록장입니다.
https://jjhstack.github.io/blog

정적 사이트 생성기 Jekyll 위에 직접 만든 테마를 올렸습니다. 외부 테마나 Node 빌드 도구는 쓰지 않습니다. `main` 브랜치에 push하면 GitHub Actions가 빌드해서 GitHub Pages에 배포합니다.

## 구조

| 경로 | 내용 |
|---|---|
| `_posts/` | 글. 파일 이름은 `YYYY-MM-DD-제목.md` |
| `_layouts/` | 페이지 틀 (`home`, `post`, `page`, `taxonomy`) |
| `_includes/` | 공통 조각 (`head`, `home-hero`, `post-head`, `disqus`, `stack`) |
| `_plugins/` | 본문 이미지 경로에 `/blog`를 붙이는 플러그인 |
| `assets/css/main.css` | 전체 스타일 |
| `assets/js/main.js` | 다크 모드, 검색, 코드 복사, 목차 |
| `assets/img/post/YYYYMM/` | 글 이미지 |
| `_design/` | 디자인 목업 (사이트 빌드에서 제외) |

## 글 쓰기

```yaml
---
title: "[Spring Error] DataSource 설정 에러"
date: 2024-03-24 16:42:00 +09:00
error: "Failed to configure a DataSource: 'url' attribute is not specified"  # 에러 글이면
description: "에러가 아닌 글이면 목록에 보일 한 줄 설명"
categories: [springboot, error]
tags: [spring, springboot]
render_with_liquid: false
---
```

- `error`를 적으면 목록과 글 맨 위에 에러 메시지가 강조되어 나옵니다.
- 목록의 스택 이름은 카테고리 중 `error`를 뺀 마지막 항목입니다.
- 본문은 `# 문제`, `# 원인`, `# 해결`, `# 결과` 순서로 쓰면 오른쪽 목차가 자동으로 만들어집니다.

## 로컬에서 보기

Ruby 3.3이 필요합니다. Windows에서는 RubyInstaller(DevKit 포함)로 설치합니다.

```bash
bundle install
bundle exec jekyll serve
```

http://127.0.0.1:4000/blog/ 에서 확인합니다.
