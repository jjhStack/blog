---
title: "[HackerRank] Java Strings Introduction"
date: 2026-11-24 10:30:00 +01:00
description: "두 문자열의 길이 합, 사전순 비교, 첫 글자 대문자를 출력하는 문제. compareTo와 substring으로 풀기"
categories: [HackerRank, Java]
tags: [Java, 알고리즘, HackerRank]
render_with_liquid: false
---

# 문제

[HackerRank - Java Strings Introduction](https://www.hackerrank.com/challenges/java-strings-introduction/problem)

소문자로만 된 문자열 `A`, `B`를 받아서 세 줄을 출력한다.

1. `A`와 `B`의 길이 합
2. `A`가 `B`보다 **사전적으로 크면**(사전에서 `B`보다 뒤에 오면) `Yes`, 아니면 `No`
3. `A`와 `B`의 첫 글자를 대문자로 바꿔서 공백 하나로 이어 출력

|입력|출력|
|---|---|
|`hello`<br>`java`|`9`<br>`No`<br>`Hello Java`|

`"hello"`는 사전에서 `"java"`보다 앞이므로 `A`가 더 크지 않다. 그래서 `No`다.

# 1. 사전순으로 앞서는지 확인하는 방법

문자열은 `>`로 비교할 수 없고 `compareTo`를 쓴다. `A.compareTo(B)`가 **양수**면 `A`가 사전에서 뒤, 즉 사전적으로 더 크다.

```java
"hello".compareTo("java");   // 'h' - 'j' = -2, 음수 → No
"java".compareTo("hello");   // 2, 양수 → Yes
```

```java
System.out.println(A.compareTo(B) > 0 ? "Yes" : "No");
```

# 2. 앞 한 글자만 대문자로 바꾸는 법

첫 글자(`substring(0, 1)`)만 `toUpperCase()`로 바꾸고 나머지(`substring(1)`)를 붙인다.

```java
String capA = A.substring(0, 1).toUpperCase() + A.substring(1);   // "Hello"
```

`String`은 불변이라 `A.toUpperCase()`만 호출하면 `A`는 그대로다. 결과를 새 변수에 담아 쓴다.

`compareTo`의 계산 방식, 대소문자 순서, 빈 문자열 처리와 String의 다른 자주 쓰는 메서드는 아래 글에 정리했다.

[[java-string]]

# 풀이

```java
import java.util.Scanner;

public class Solution {

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String A = sc.next();
        String B = sc.next();
        sc.close();

        System.out.println(A.length() + B.length());
        System.out.println(A.compareTo(B) > 0 ? "Yes" : "No");

        String capA = A.substring(0, 1).toUpperCase() + A.substring(1);
        String capB = B.substring(0, 1).toUpperCase() + B.substring(1);
        System.out.println(capA + " " + capB);
    }
}
```

입력은 소문자 영어 글자로만 되어 있으므로 빈 문자열 처리와 대소문자 비교 문제는 신경 쓰지 않아도 된다.

`Scanner.next()`가 공백과 줄바꿈 기준으로 한 단어씩 읽는 방식은 아래 글에 있다.

[[java-scanner]]

# 정리

- 길이 합은 `A.length() + B.length()`다.
- "사전적으로 크다"는 길이가 아니라 사전 순서다. `A.compareTo(B) > 0`이면 `Yes`다. 같을 때는 `No`다.
- 출력 문구는 대소문자까지 정확히 맞춘다.
- 첫 글자만 대문자: `s.substring(0, 1).toUpperCase() + s.substring(1)`.

# 영어로 설명하기

> Lexicographic order means dictionary order, not length, so I check whether A comes after B with A.compareTo(B) > 0.

> I capitalized each word by upper-casing the first character with substring(0, 1) and appending the rest with substring(1).
