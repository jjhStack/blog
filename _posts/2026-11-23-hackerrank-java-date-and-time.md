---
title: "[HackerRank] Java Date and Time"
date: 2026-11-23 14:00:00 +01:00
description: "월, 일, 연도로 요일을 구하는 문제. Calendar를 만드는 법, 0부터 시작하는 MONTH, DAY_OF_WEEK와 LocalDate로 푸는 방법"
categories: [HackerRank, Java]
tags: [Java, 알고리즘, HackerRank]
render_with_liquid: false
---

# 문제

[HackerRank - Java Date and Time](https://www.hackerrank.com/challenges/java-date-and-time/problem)

월, 일, 연도를 받아서 그날의 요일을 **대문자 영어**로 돌려주는 `findDay(int month, int day, int year)`를 완성한다.

|입력|출력|
|---|---|
|`08 05 2015`|`WEDNESDAY`|

입력을 읽고 결과를 출력하는 `main`은 이미 주어져 있다. `findDay` 메서드 안만 채우면 된다.

`Calendar` 클래스 자체는 아래 글에 따로 정리했다.

[[java-calendar]]

# 풀기 전에 알아야 할 개념

## Calendar는 new로 만들 수 없다

`Calendar`는 `abstract class`라서 `new Calendar(...)`는 "Calendar is abstract; cannot be instantiated" 컴파일 오류가 난다. `(int, int, int)`를 받는 공개 생성자도 없다.

`Calendar.getInstance()`로 객체를 얻은 뒤 `set`으로 날짜를 넣거나, 구체 클래스인 `GregorianCalendar`를 직접 만든다.

```java
Calendar c = Calendar.getInstance();
c.set(year, month - 1, day);

// 또는
Calendar c2 = new GregorianCalendar(year, month - 1, day);
```

## MONTH는 0부터 시작한다

`Calendar`의 월은 `0`(1월)부터 `11`(12월)까지다. 입력 `08`을 그대로 넘기면 9월로 계산된다. 2015년 9월 5일은 토요일이라 `SATURDAY`가 나와 틀린다. 그래서 `month - 1`로 넘긴다.

## 요일은 DAY_OF_WEEK로 읽는다

날짜를 넣은 뒤 `get(Calendar.DAY_OF_WEEK)`로 요일을 읽는다. 값은 `1`(일요일)부터 `7`(토요일)까지인 숫자라서, 이름으로 바꾸는 단계가 한 번 더 필요하다.

# 풀이

## Calendar로 풀기

```java
public static String findDay(int month, int day, int year) {
    Calendar c = Calendar.getInstance();
    c.set(year, month - 1, day);   // MONTH는 0부터 시작

    return c.getDisplayName(Calendar.DAY_OF_WEEK, Calendar.LONG, Locale.ENGLISH)
            .toUpperCase();        // "Wednesday" → "WEDNESDAY"
}
```

`getDisplayName`은 `"Wednesday"`처럼 첫 글자만 대문자인 이름을 돌려주므로 `toUpperCase()`를 붙인다.
로케일을 빼면 실행 환경의 기본 로케일을 따르므로, 영어 이름이 나온다고 보장할 수 없다. `Locale.ENGLISH`를 명시한다.

`getDisplayName` 대신 숫자를 배열로 바꿔도 된다. `DAY_OF_WEEK`는 `1`(일요일)부터 시작하므로 인덱스 0은 비워 둔다.

```java
String[] days = {"", "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"};
return days[c.get(Calendar.DAY_OF_WEEK)];
```

## LocalDate로 풀기

Java 8부터는 `java.time.LocalDate`로 더 짧게 풀 수 있다. 월이 1부터 시작해서 `month - 1`도 필요 없다.

```java
import java.time.LocalDate;

public static String findDay(int month, int day, int year) {
    return LocalDate.of(year, month, day).getDayOfWeek().toString();
}
```

`getDayOfWeek()`는 `DayOfWeek` enum을 돌려주고, enum의 `toString()`은 상수 이름인 `"WEDNESDAY"`를 그대로 돌려준다. 이미 대문자라서 변환할 필요가 없다.

문제 템플릿의 import 목록에는 `java.time`이 없으므로 `import java.time.LocalDate;`를 추가하거나 `java.time.LocalDate.of(...)`처럼 전체 이름으로 쓴다.

`LocalDate` 클래스는 아래 글에 따로 정리했다.

[[java-localdate]]

|구분|`Calendar` 풀이|`LocalDate` 풀이|
|---|---|---|
|객체 생성|`Calendar.getInstance()` + `set`|`LocalDate.of(y, m, d)`|
|월 처리|`month - 1`|그대로 `month`|
|요일 이름|`getDisplayName(...)` + `toUpperCase()`|`getDayOfWeek().toString()`|
|문제가 의도한 것|`Calendar` 사용|더 현대적인 방법|

문제 설명이 `Calendar` 클래스를 소개하고 있으므로 연습 목적이라면 `Calendar` 풀이를, 실무 코드라면 `LocalDate` 풀이를 쓴다.

# 정리

- `Calendar`는 추상 클래스다. `new Calendar(...)`는 컴파일 오류이고, `Calendar.getInstance()`로 얻는다.
- `Calendar`의 `MONTH`는 `0`부터 시작하므로 입력 월은 `month - 1`로 넘긴다.
- 요일은 `get(Calendar.DAY_OF_WEEK)`로 읽고, `getDisplayName(..., Locale.ENGLISH)`으로 이름을 얻는다.
- `LocalDate.of(year, month, day).getDayOfWeek().toString()` 한 줄로도 풀린다.

# 영어로 설명하기

> `Calendar` is an abstract class, so it cannot be created with `new`. I get an instance with `Calendar.getInstance()` and set the date with `set(year, month - 1, day)`, because months in `Calendar` start at 0.

> Then I read `DAY_OF_WEEK` and turn it into an English name with `getDisplayName` and `toUpperCase()`. With Java 8 or later, `LocalDate.of(year, month, day).getDayOfWeek().toString()` gives "WEDNESDAY" in one line.
