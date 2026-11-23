---
title: "[Java] Calendar 클래스 정리"
date: 2026-11-23 14:30:00 +01:00
description: "추상 클래스 Calendar를 getInstance()로 만드는 이유, 0부터 시작하는 MONTH, DAY_OF_WEEK로 요일 구하기, java.time의 LocalDate와 비교"
categories: [Java]
tags: [Java]
render_with_liquid: false
---

`java.util.Calendar`는 **특정 시점(instant)**과 **연·월·일·시 같은 달력 필드** 사이를 변환해 주는 클래스다. 날짜를 넣고 요일을 꺼내거나, 날짜에 며칠을 더하는 일을 한다.
이 내용은 아래 문제를 풀다가 정리했다.

[[hackerrank-java-date-and-time]]

# Calendar는 추상 클래스다

`Calendar`는 `abstract class`라서 `new`로 객체를 만들 수 없다.

```java
Calendar c = new Calendar(2015, 8, 5); // 컴파일 오류: Calendar is abstract; cannot be instantiated
```

추상 클래스는 공통 기능만 정의하고, 실제 계산은 하위 클래스가 맡는다. 달력 규칙(어느 해가 윤년인지, 한 해가 언제 시작하는지)은 달력 체계마다 다르기 때문이다. Java가 제공하는 대표적인 하위 클래스가 우리가 쓰는 양력인 `GregorianCalendar`다.

객체는 두 가지 방법으로 얻는다.

```java
// (1) 팩토리 메서드: 기본 로케일과 시간대에 맞는 Calendar를 돌려준다
Calendar c1 = Calendar.getInstance();

// (2) 하위 클래스를 직접 생성한다
Calendar c2 = new GregorianCalendar(2015, Calendar.AUGUST, 5);
```

`Calendar.getInstance()`는 **현재 날짜와 시각**으로 채워진 객체를 돌려준다. 대부분의 로케일에서 실제 타입은 `GregorianCalendar`다.

# 필드 상수

`Calendar`는 날짜의 각 부분을 정수 상수로 구분한다. `get(필드)`로 읽고 `set(필드, 값)`으로 바꾼다.

|필드|뜻|값의 범위|
|---|---|---|
|`YEAR`|연도|예: `2015`|
|`MONTH`|월|**`0`(1월) ~ `11`(12월)**|
|`DAY_OF_MONTH`|그 달의 며칠|`1` ~ `31`|
|`DAY_OF_WEEK`|요일|`1`(일요일) ~ `7`(토요일)|
|`HOUR_OF_DAY`|시(24시간제)|`0` ~ `23`|
|`HOUR`|시(12시간제)|`0` ~ `11`|
|`MINUTE`, `SECOND`|분, 초|`0` ~ `59`|

```java
Calendar c = Calendar.getInstance();
int year = c.get(Calendar.YEAR);
c.set(Calendar.DAY_OF_MONTH, 1);
```

## MONTH는 0부터 시작한다

`Calendar`에서 가장 많이 틀리는 부분이다. 1월이 `0`, 8월이 `7`, 12월이 `11`이다.

```java
Calendar c = Calendar.getInstance();
c.set(2015, 8, 5);      // 2015년 9월 5일이 된다
c.set(2015, 8 - 1, 5);  // 2015년 8월 5일
c.set(2015, Calendar.AUGUST, 5); // 상수를 쓰면 헷갈리지 않는다 (AUGUST == 7)
```

입력이 사람 기준의 월(1~12)이라면 `month - 1`로 넘겨야 한다.

## DAY_OF_WEEK는 일요일이 1이다

`Calendar.SUNDAY`가 `1`, `MONDAY`가 `2`, ..., `SATURDAY`가 `7`이다. 0부터 시작하지도 않고 월요일부터 시작하지도 않는다.

# 요일 이름 얻기

`DAY_OF_WEEK`는 숫자라서 이름으로 바꾸는 방법이 필요하다.

```java
Calendar c = Calendar.getInstance();
c.set(2015, Calendar.AUGUST, 5);

int dow = c.get(Calendar.DAY_OF_WEEK); // 4 (WEDNESDAY)

// (1) getDisplayName: 로케일에 맞는 이름
String name = c.getDisplayName(Calendar.DAY_OF_WEEK, Calendar.LONG, Locale.ENGLISH); // "Wednesday"

// (2) 배열로 직접 매핑: 인덱스 0은 비워 둔다
String[] days = {"", "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"};
String name2 = days[dow]; // "WEDNESDAY"
```

`getDisplayName`에 로케일을 지정하지 않고 기본 로케일을 쓰면, 한국어 환경에서는 `"수요일"`이 나올 수 있다. 영어 이름이 필요하면 `Locale.ENGLISH`를 명시한다.

# 날짜 계산: add와 roll

```java
Calendar c = Calendar.getInstance();
c.set(2015, Calendar.DECEMBER, 30);
c.add(Calendar.DAY_OF_MONTH, 5);  // 2016년 1월 4일 (월과 연도도 올라감)

c.set(2015, Calendar.DECEMBER, 30);
c.roll(Calendar.DAY_OF_MONTH, 5); // 2015년 12월 4일 (일만 돌고 월은 그대로)
```

`add`는 넘친 만큼 위 필드에 반영하고, `roll`은 해당 필드 안에서만 돈다.

# Calendar의 단점과 java.time

`Calendar`는 오래된 API라서 불편한 점이 많다.

- 월이 0부터 시작해서 실수하기 쉽다.
- 객체가 **변경 가능(mutable)**하다. `set`, `add`가 객체 자체를 바꾸기 때문에 여러 곳에서 같은 객체를 공유하면 값이 꼬인다.
- 스레드 안전하지 않다.

그래서 Java 8부터 `java.time` 패키지(`LocalDate`, `LocalDateTime`, `DayOfWeek` 등)가 추가됐다. 새로 작성하는 코드에서는 보통 `java.time`을 쓴다.

```java
import java.time.LocalDate;

LocalDate date = LocalDate.of(2015, 8, 5);   // 월이 1부터 시작한다
String name = date.getDayOfWeek().toString(); // "WEDNESDAY"
LocalDate next = date.plusDays(5);            // 새 객체를 돌려준다. date는 그대로
```

|구분|`Calendar`|`LocalDate`|
|---|---|---|
|패키지|`java.util`|`java.time` (Java 8+)|
|객체 생성|`Calendar.getInstance()` 후 `set`|`LocalDate.of(y, m, d)`|
|월|`0` ~ `11`|`1` ~ `12`|
|요일|`int` (`1`=일요일)|`DayOfWeek` enum (`MONDAY` ~ `SUNDAY`)|
|변경|객체 자체가 바뀜(mutable)|새 객체를 돌려줌(immutable)|
|시간 정보|날짜, 시각, 시간대를 모두 가짐|날짜만 가짐|

`LocalDate`의 사용법은 아래 글에 따로 정리했다.

[[java-localdate]]

# 정리

- `Calendar`는 추상 클래스라서 `new Calendar(...)`는 컴파일 오류다. `Calendar.getInstance()`나 `new GregorianCalendar(...)`로 만든다.
- `getInstance()`는 현재 날짜와 시각으로 채워진 객체를 돌려준다. 원하는 날짜는 `set`으로 넣는다.
- `MONTH`는 `0`부터 시작한다. 사람 기준의 월은 `month - 1`로 넘긴다.
- `DAY_OF_WEEK`는 `1`(일요일)부터 `7`(토요일)까지다.
- 요일 이름은 `getDisplayName(..., Locale.ENGLISH)`이나 배열 매핑으로 얻는다.
- 새 코드에서는 월이 1부터 시작하고 변경 불가능한 `java.time.LocalDate`를 주로 쓴다.

# 영어로 설명하기

> `Calendar` is an abstract class, so you cannot create it with `new`. You get an instance with `Calendar.getInstance()`, which usually returns a `GregorianCalendar` set to the current date and time, and then you set the fields you need.

> Be careful with the fields: `MONTH` starts at 0 for January, and `DAY_OF_WEEK` goes from 1 for Sunday to 7 for Saturday. Since Java 8, the `java.time` API, such as `LocalDate`, is usually a better choice because months start at 1 and the objects are immutable.
