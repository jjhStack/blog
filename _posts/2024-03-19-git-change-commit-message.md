---
title: "[Git] 커밋 메세지 수정 방법(changing commit message)"
date: 2024-03-19 15:00:00 +09:00
description: "push 전후로 나눠서 이미 한 커밋의 메시지를 고치는 방법"
categories: [형상관리, git]
tags: [git]
render_with_liquid: false
---

![error](/assets/img/post/202403/git-change-commit-message-01.png)

# PUSH하기 전인 경우
> local에서만 commit 했을 때

```bash
git commit --amend
```

이 명령은 가장 최근의 커밋 메시지를 변경합니다. 
이를 실행하면 텍스트 편집기가 열리고, 새로운 커밋 메시지를 입력할 수 있다.

![error](/assets/img/post/202403/git-change-commit-message-02.png)

![error](/assets/img/post/202403/git-change-commit-message-03.png)

커밋내역이 변경된 것을 확인할 수 있다.
