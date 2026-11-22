---
title: "[HackerRank] Java Output Formatting"
date: 2026-11-16 09:05:00 +01:00
description: "printf의 %-15s와 %03d로 문자열은 왼쪽 정렬 15칸, 정수는 0을 채운 3자리로 출력하기"
categories: [HackerRank, Java]
tags: [Java, 알고리즘, HackerRank]
render_with_liquid: false
---

# 문제

[HackerRank - Java Output Formatting](https://www.hackerrank.com/challenges/java-output-formatting/problem)

각 줄에 문자열 하나와 정수 하나가 들어온다. 이것을 두 칸(column)으로 맞춰 출력한다.

- 첫 번째 칸: 문자열을 **왼쪽 정렬해서 정확히 15칸**으로 출력한다. 남는 칸은 공백으로 채운다.
- 두 번째 칸: 정수를 **정확히 3자리**로 출력한다. 3자리보다 짧으면 앞을 `0`으로 채운다.

문자열은 최대 10글자, 정수는 0~999 범위다. 그래서 문자열이 15칸을 넘거나 정수가 3자리를 넘는 경우는 없다.

입력

```
java 100
cpp 65
python 50
```

출력

```
================================
java           100
cpp            065
python         050
================================
```

`printf`의 서식 지정자를 아는지 묻는 문제다. 서식 지정자 문법은 아래 글에 따로 정리했다.

[[java-string-formatting]]

# 풀이

```java
import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.println("================================");
        for (int i = 0; i < 3; i++) {
            String s1 = sc.next();
            int x = sc.nextInt();
            System.out.printf("%-15s%03d%n", s1, x);
        }
        System.out.println("================================");
        sc.close();
    }
}
```

반복 횟수 3은 HackerRank 템플릿에 처음부터 들어 있는 값이다. 입력은 항상 3줄이다.

# 서식 문자열 뜯어보기

`"%-15s%03d%n"`은 지정자 세 개가 붙어 있는 것이다.

|지정자|플래그|너비|변환|뜻|
|---|---|---|---|---|
|`%-15s`|`-` (왼쪽 정렬)|15|`s` (문자열)|문자열을 15칸에 왼쪽 정렬, 남는 칸은 오른쪽에 공백|
|`%03d`|`0` (0으로 채움)|3|`d` (10진 정수)|정수를 3칸에 오른쪽 정렬, 남는 칸은 앞에 `0`|
|`%n`|-|-|`n` (줄바꿈)|운영체제에 맞는 줄바꿈|

직접 실행해 보면 `[` `]` 사이가 정확히 18칸(15 + 3)이다.

```
[java           100]
[cpp            065]
[python         050]
```

## 기본은 오른쪽 정렬이다

너비만 주면 **오른쪽 정렬**이 기본이다. 그래서 문자열을 왼쪽에 붙이려면 `-` 플래그가 필요하다.

|서식|결과|
|---|---|
|`%10s`|`[      java]`|
|`%-10s`|`[java      ]`|

## 너비는 최소 너비다

`%03d`에 `1234`를 넣으면 잘리지 않고 `1234`가 그대로 나온다. 너비는 "최소 이만큼은 차지한다"는 뜻이지 "이 이상은 자른다"는 뜻이 아니다. 이 문제는 범위가 0~999라서 신경 쓰지 않아도 된다.

## `%n`과 `\n`

둘 다 줄바꿈이지만 `%n`은 실행하는 운영체제의 줄바꿈(Windows는 `\r\n`, Linux/Mac은 `\n`)을 쓴다. `printf`를 쓸 때는 `%n`을 쓰는 게 관례다.

# 정리

- `printf(서식, 값...)`은 서식 문자열의 `%` 지정자 자리에 값을 순서대로 채워 출력한다.
- `%-15s`: 문자열을 15칸에 왼쪽 정렬한다. `-`가 없으면 오른쪽 정렬이다.
- `%03d`: 정수를 3칸으로 맞추고 빈자리는 앞에 `0`을 채운다.
- 너비는 최소 너비라서 값이 더 길면 잘리지 않는다.
- 줄바꿈은 `%n`을 쓴다.

# 영어로 설명하기

> I used `printf` with the format string `%-15s%03d%n`. The `%-15s` part left-justifies the string in a field of 15 characters, and `%03d` prints the integer in three digits, padding it with leading zeros.

> The width in a format specifier is a minimum width, so longer values are not cut off. That is fine here because the input strings are at most 10 characters and the integers are between 0 and 999.
