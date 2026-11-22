---
title: "[HackerRank] Java Static Initializer Block"
date: 2026-11-22 13:00:00 +01:00
description: "정답은 나왔지만 문제의 의도와 다르게 푼 풀이. static 초기화 블록과 Exception 출력 형식으로 다시 풀기"
categories: [HackerRank, Java]
tags: [Java, 알고리즘, HackerRank]
render_with_liquid: false
---

# 문제

[HackerRank - Java Static Initializer Block](https://www.hackerrank.com/challenges/java-static-initializer-block/problem)

두 줄로 평행사변형의 밑변 `B`와 높이 `H`를 입력받아 넓이를 출력한다.
둘 중 하나라도 0 이하이면 `java.lang.Exception: Breadth and height must be positive`를 출력한다.

|입력|출력|
|---|---|
|`1`, `3`|`3`|
|`-1`, `2`|`java.lang.Exception: Breadth and height must be positive`|

문제 제목 그대로 **static 초기화 블록**을 연습하는 문제다. static 키워드 자체는 아래 글에 따로 정리했다.

[[java-static]]

# 내 풀이

```java
Scanner sc = new Scanner(System.in);
int a = sc.nextInt();
int b = sc.nextInt();
if (a < 1 || b < 1) {
    System.out.println("java.lang.Exception: Breadth and height must be positive");
} else {
    System.out.println(a * b);
}
```

통과는 했다. 입력이 정수라서 `a < 1`은 `a <= 0`과 같으니 조건도 맞다.
하지만 문제가 연습시키려던 두 가지를 모두 피해 갔다.

1. 입력과 검사를 `static { }` 블록이 아니라 `main`에서 했다.
2. `java.lang.Exception: ...` 문구를 예외 객체로 만들지 않고 문자열로 직접 쳤다.

# 문제의 의도

|구분|내 풀이|의도한 풀이|
|---|---|---|
|입력을 읽는 곳|`main` 안|`static { }` 블록 안|
|값을 담는 곳|`main`의 지역 변수|static 변수 `B`, `H`, `flag`|
|0 이하 처리|`if`로 문자열 출력|`throw new Exception(...)` 후 `catch`에서 `println(e)`|
|`java.lang.Exception: ` 접두어|직접 타이핑|`Exception.toString()`이 만든다|
|`main`의 역할|입력, 검사, 출력 전부|`flag`가 `true`일 때 넓이만 출력|

## static 초기화 블록은 main보다 먼저 실행된다

JVM은 `Solution.main()`을 호출하기 전에 `Solution` 클래스를 먼저 초기화한다.
이때 static 필드 초기화와 static 블록이 **소스에 적힌 순서대로 한 번** 실행된다.

```
JVM이 Solution 클래스를 초기화
  └─ static 필드: flag = true
  └─ static { } 블록: 입력 읽기, 검사, 예외 출력
main(String[]) 호출
  └─ flag가 true면 B * H 출력
```

그래서 `flag = true` 선언이 블록보다 위에 있어야 블록에서 `false`로 바꾼 값이 남는다.

## 출력 문구가 java.lang.Exception으로 시작하는 이유

`System.out.println(e)`는 `e.toString()`을 호출하고, `Throwable.toString()`은 `클래스 전체 이름: 메시지` 형식의 문자열을 돌려준다.

```java
Exception e = new Exception("Breadth and height must be positive");
System.out.println(e); // java.lang.Exception: Breadth and height must be positive
```

문제의 출력 예시는 이 형식을 그대로 보여 준 것이다. 문구를 외워서 칠 게 아니라 예외를 던지고 잡아서 출력하라는 뜻이다.

# 다시 푼 풀이

HackerRank 원래 템플릿은 `flag`, `B`, `H`와 `main`이 주어지고 static 블록 부분을 채우는 형태다.

```java
import java.util.Scanner;

public class Solution {
    static boolean flag = true;
    static int B, H;

    static {
        Scanner sc = new Scanner(System.in);
        B = sc.nextInt();
        H = sc.nextInt();
        try {
            if (B <= 0 || H <= 0) {
                flag = false;
                throw new Exception("Breadth and height must be positive");
            }
        } catch (Exception e) {
            System.out.println(e);
        }
    }

    public static void main(String[] args) {
        if (flag) {
            int area = B * H;
            System.out.print(area);
        }
    }
}
```

`B`, `H`, `flag`를 static으로 선언한 이유는 static 블록과 static 메서드인 `main`에서 객체 없이 쓰기 위해서다.

# 정리

- 테스트를 통과했다고 문제의 의도대로 푼 것은 아니다. 문제 제목과 템플릿이 무엇을 연습시키는지 먼저 본다.
- static 초기화 블록은 클래스가 초기화될 때 한 번 실행되고, 시작 클래스라면 `main`보다 먼저 실행된다.
- static 필드 초기화와 static 블록은 소스에 적힌 순서대로 실행된다.
- `println(e)`는 `e.toString()`을 출력하고, 그 형식은 `클래스 전체 이름: 메시지`다.

# 영어로 설명하기

> My first solution passed the tests, but it did not use a static initializer block. I read the input and checked the values inside `main`, and I typed the exception message as a plain string.

> In the intended solution, the static block reads the input when the class is initialized, before `main` runs. If a value is not positive, it throws an `Exception` and prints it, so `toString()` produces the `java.lang.Exception:` prefix.
