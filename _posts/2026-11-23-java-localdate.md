---
title: "[Java] LocalDate 클래스 정리"
date: 2026-11-23 14:45:00 +01:00
description: "java.time.LocalDate를 만드는 법, 값 읽기, 변경 불가능(immutable)한 날짜 계산, DayOfWeek와 Month enum, 날짜 차이, 포맷과 파싱"
categories: [Java]
tags: [Java]
render_with_liquid: false
---

`java.time.LocalDate`는 **시각과 시간대 없이 날짜(연-월-일)만** 나타내는 클래스다. Java 8에서 추가된 `java.time` 패키지에 들어 있고, 오래된 `Calendar`의 불편한 점을 고친 API다.

`Calendar`는 아래 글에 따로 정리했다.

[[java-calendar]]

# LocalDate의 특징

- **날짜만 가진다.** 시, 분, 초와 시간대 정보가 없다. 생일, 기념일, 마감일처럼 "몇 시"가 필요 없는 날짜에 맞다.
- **변경 불가능(immutable)하다.** 날짜를 바꾸는 메서드는 객체를 고치지 않고 새 `LocalDate`를 돌려준다.
- **스레드 안전하다.** 값이 바뀌지 않으므로 여러 스레드가 같은 객체를 함께 써도 문제가 없다.
- **월이 1부터 시작한다.** 1월은 `1`, 12월은 `12`다.

# 만들기

`LocalDate`는 생성자가 공개되어 있지 않다. static 팩토리 메서드로 만든다.

```java
import java.time.LocalDate;
import java.time.Month;

LocalDate today = LocalDate.now();                 // 오늘 날짜 (시스템 시간대 기준)
LocalDate d1 = LocalDate.of(2015, 8, 5);           // 2015-08-05
LocalDate d2 = LocalDate.of(2015, Month.AUGUST, 5); // Month enum으로도 가능
LocalDate d3 = LocalDate.parse("2015-08-05");      // ISO 형식(yyyy-MM-dd) 문자열
```

없는 날짜를 넣으면 객체를 만들 때 바로 예외가 난다. `Calendar`는 기본 설정에서 넘친 값을 다음 달로 넘겨서 조용히 다른 날짜를 만드는 것과 다르다.

```java
LocalDate.of(2015, 2, 30);  // DateTimeException: Invalid date 'FEBRUARY 30'
LocalDate.of(2015, 13, 1);  // DateTimeException: 월 범위(1~12)를 벗어남
```

# 값 읽기

```java
LocalDate d = LocalDate.of(2015, 8, 5);

d.getYear();        // 2015
d.getMonthValue();  // 8          (int)
d.getMonth();       // AUGUST     (Month enum)
d.getDayOfMonth();  // 5
d.getDayOfWeek();   // WEDNESDAY  (DayOfWeek enum)
d.getDayOfYear();   // 217        (그해의 몇 번째 날)
d.lengthOfMonth();  // 31         (그달의 일수)
d.isLeapYear();     // false
```

`Calendar`의 `get(Calendar.YEAR)`처럼 필드 상수를 넘기지 않고, 값마다 이름 있는 메서드가 있다.

# DayOfWeek와 Month enum

요일과 월은 숫자가 아니라 **enum**으로 돌려준다.

|구분|`DayOfWeek`|`Month`|
|---|---|---|
|상수|`MONDAY` ~ `SUNDAY`|`JANUARY` ~ `DECEMBER`|
|`getValue()`|`1`(월요일) ~ `7`(일요일)|`1`(1월) ~ `12`(12월)|
|`toString()`|`"WEDNESDAY"`처럼 상수 이름|`"AUGUST"`처럼 상수 이름|

`DayOfWeek`는 **월요일이 1**이다. `Calendar.DAY_OF_WEEK`는 일요일이 1이었으므로 두 API를 섞어 쓸 때 주의한다.

enum의 `toString()`은 상수 이름을 그대로 돌려주므로 대문자 영어 이름이 바로 나온다. 다른 형태의 이름이 필요하면 `getDisplayName`을 쓴다.

```java
import java.time.DayOfWeek;
import java.time.format.TextStyle;
import java.util.Locale;

DayOfWeek dow = LocalDate.of(2015, 8, 5).getDayOfWeek();

dow.toString();                                   // "WEDNESDAY"
dow.getValue();                                   // 3
dow.getDisplayName(TextStyle.FULL, Locale.ENGLISH);  // "Wednesday"
dow.getDisplayName(TextStyle.SHORT, Locale.ENGLISH); // "Wed"
dow.getDisplayName(TextStyle.FULL, Locale.KOREAN);   // "수요일"
```

# 날짜 계산

`plus...`, `minus...`로 더하고 뺀다. 월말을 넘어가면 월과 연도도 알아서 바뀐다.

```java
LocalDate d = LocalDate.of(2015, 12, 30);

d.plusDays(5);     // 2016-01-04
d.minusWeeks(1);   // 2015-12-23
d.plusMonths(2);   // 2016-02-29  (2월 30일이 없어서 그달 마지막 날로 맞춤)
d.plusYears(1);    // 2016-12-30
```

특정 필드만 바꿀 때는 `with...`를 쓴다.

```java
d.withDayOfMonth(1);  // 2015-12-01  (그달 1일)
d.withYear(2020);     // 2020-12-30
```

## 결과를 받지 않으면 아무 일도 일어나지 않는다

`LocalDate`는 변경 불가능하므로 `plusDays`는 원래 객체를 바꾸지 않는다. 결과를 변수에 받아야 한다.

```java
LocalDate d = LocalDate.of(2015, 8, 5);
d.plusDays(1);       // 새 객체를 만들고 버림. d는 그대로 2015-08-05
d = d.plusDays(1);   // d가 2015-08-06이 됨
```

`Calendar`의 `add`는 객체 자체를 바꾸기 때문에 결과를 받지 않아도 됐다. 이 차이 때문에 `Calendar`에 익숙하면 자주 하는 실수다.

# 비교와 날짜 차이

```java
import java.time.Period;
import java.time.temporal.ChronoUnit;

LocalDate a = LocalDate.of(2015, 8, 5);
LocalDate b = LocalDate.of(2016, 1, 4);

a.isBefore(b);   // true
a.isAfter(b);    // false
a.equals(LocalDate.of(2015, 8, 5)); // true. ==가 아니라 equals로 비교한다

ChronoUnit.DAYS.between(a, b);   // 152  (총 일수)
Period p = Period.between(a, b); // P4M30D (4개월 30일)
p.getMonths();                   // 4
p.getDays();                     // 30
```

`ChronoUnit.DAYS.between`은 **총 일수**를, `Period.between`은 **연·월·일로 나눈 차이**를 돌려준다. `Period`의 `getDays()`는 총 일수가 아니라 월을 빼고 남은 일수다.

# 포맷과 파싱

`DateTimeFormatter`로 원하는 형식의 문자열로 바꾸거나, 그 형식의 문자열을 읽는다.

```java
import java.time.format.DateTimeFormatter;

DateTimeFormatter f = DateTimeFormatter.ofPattern("MM dd yyyy");

LocalDate d = LocalDate.parse("08 05 2015", f); // 2015-08-05
String s = d.format(DateTimeFormatter.ofPattern("yyyy.MM.dd")); // "2015.08.05"
d.toString();                                    // "2015-08-05" (ISO 형식)
```

패턴 문자는 대소문자를 구분한다. `MM`은 월, `mm`은 분이다. `LocalDate`에는 시각이 없으므로 `mm`처럼 시각 패턴을 넣고 `format`하면 예외가 난다.

# LocalDate와 비슷한 클래스

|클래스|가진 정보|예|
|---|---|---|
|`LocalDate`|날짜|`2015-08-05`|
|`LocalTime`|시각|`14:30:00`|
|`LocalDateTime`|날짜 + 시각|`2015-08-05T14:30:00`|
|`ZonedDateTime`|날짜 + 시각 + 시간대|`2015-08-05T14:30+09:00[Asia/Seoul]`|

`Local`은 "특정 시간대에 묶이지 않은"이라는 뜻이다. 같은 `LocalDateTime`이라도 서울과 런던에서는 서로 다른 순간을 가리킨다. 실제 한 순간을 나타내야 하면 `ZonedDateTime`이나 `Instant`를 쓴다.

# Calendar와 비교

|구분|`Calendar`|`LocalDate`|
|---|---|---|
|패키지|`java.util`|`java.time` (Java 8+)|
|만들기|`Calendar.getInstance()` 후 `set`|`LocalDate.of(y, m, d)`|
|월|`0` ~ `11`|`1` ~ `12`|
|요일|`int`, 일요일이 `1`|`DayOfWeek` enum, 월요일이 `1`|
|없는 날짜|기본 설정에서 다음 달로 넘김|`DateTimeException`|
|날짜 계산|`add`가 객체 자체를 바꿈|`plusDays`가 새 객체를 돌려줌|
|가진 정보|날짜, 시각, 시간대|날짜만|

기존 코드에서 받은 `Calendar`는 `GregorianCalendar`로 바꾼 뒤 `toZonedDateTime()`을 거쳐 `LocalDate`로 바꿀 수 있다.

```java
Calendar c = Calendar.getInstance();
LocalDate d = ((GregorianCalendar) c).toZonedDateTime().toLocalDate();
```

`Calendar`와 `LocalDate`로 같은 문제(날짜로 요일 구하기)를 각각 푼 풀이는 아래 글에 정리했다.

[[hackerrank-java-date-and-time]]

# 정리

- `LocalDate`는 시각과 시간대 없이 날짜만 나타내고, 변경 불가능하며 스레드 안전하다.
- `LocalDate.of(y, m, d)`, `now()`, `parse(...)`로 만든다. 월은 `1`부터 시작한다.
- 없는 날짜는 `DateTimeException`이 난다.
- `getDayOfWeek()`는 `DayOfWeek` enum을 돌려주고, `toString()`은 `"WEDNESDAY"`처럼 대문자 이름이다. `DayOfWeek`는 월요일이 `1`이다.
- `plusDays` 같은 메서드는 새 객체를 돌려주므로 결과를 받아야 한다.
- 날짜 차이는 총 일수면 `ChronoUnit.DAYS.between`, 연·월·일 단위면 `Period.between`을 쓴다.
- 문자열 변환은 `DateTimeFormatter`로 하고, `MM`(월)과 `mm`(분)을 구분한다.

# 영어로 설명하기

> `LocalDate` represents a date without a time or a time zone. You create it with factory methods like `LocalDate.of(2015, 8, 5)` or `LocalDate.now()`, and months start at 1, unlike `Calendar`.

> `LocalDate` is immutable, so methods like `plusDays` return a new object instead of changing the original one. `getDayOfWeek()` returns a `DayOfWeek` enum, and its `toString()` gives the name in capital letters, such as "WEDNESDAY".
