---
title: "[Java] NumberFormat으로 숫자와 통화 형식 맞추기"
date: 2025-01-02 10:00:00 +01:00
description: "java.text.NumberFormat의 팩토리 메서드, Locale에 따라 달라지는 통화 형식, 인도 Locale 만들기, 반올림 방식, Java 버전마다 출력이 다른 이유"
categories: [Java]
tags: [Java, NumberFormat, Locale]
render_with_liquid: false
---

`java.text.NumberFormat`은 숫자를 **나라와 언어(Locale)에 맞는 문자열**로 바꾸는 클래스다. 같은 `12324.134`라도 미국에서는 `$12,324.13`, 프랑스에서는 `12 324,13 €`로 적는다. 천 단위 구분 기호, 소수점 기호, 통화 기호의 위치를 Locale이 정하고, `NumberFormat`이 그 규칙대로 출력한다.

[[https://docs.oracle.com/javase/8/docs/api/java/text/NumberFormat.html]]

# new로 만들지 않는다

`NumberFormat`은 `abstract class`다. `new NumberFormat()`은 컴파일 오류가 나고, **팩토리 메서드**로 객체를 얻는다. 실제로 돌아오는 객체는 대부분 하위 클래스인 `DecimalFormat`이다.

|메서드|용도|`1234.5` 출력 예 (`Locale.US`)|
|---|---|---|
|`getInstance()` / `getNumberInstance()`|일반 숫자|`1,234.5`|
|`getIntegerInstance()`|정수 (소수점 아래 반올림)|`1,234`|
|`getCurrencyInstance()`|통화|`$1,234.50`|
|`getPercentInstance()`|백분율 (100을 곱한다)|`123,450%`|

모든 메서드는 Locale을 받는 버전이 따로 있다. 인자를 빼면 **JVM의 기본 Locale**을 쓴다. 그래서 실행하는 컴퓨터마다 결과가 달라질 수 있고, 출력 형식이 정해진 문제에서는 Locale을 꼭 넘긴다.

```java
NumberFormat nf = NumberFormat.getCurrencyInstance(Locale.US);
String s = nf.format(12324.134);   // "$12,324.13"
```

# Locale

`java.util.Locale`은 **언어 + 나라** 조합이다. 자주 쓰는 조합은 상수로 들어 있다.

|상수|언어_나라|
|---|---|
|`Locale.US`|`en_US`|
|`Locale.CHINA`|`zh_CN`|
|`Locale.FRANCE`|`fr_FR`|
|`Locale.KOREA`|`ko_KR`|
|`Locale.JAPAN`|`ja_JP`|

인도처럼 상수가 없는 나라는 직접 만든다. 첫 인자가 언어 코드(ISO 639), 둘째 인자가 나라 코드(ISO 3166)다.

```java
Locale india = new Locale("en", "IN");     // Java 8
Locale india2 = Locale.of("en", "IN");     // Java 19 이상
```

Java 19부터 `Locale` 생성자는 deprecated가 됐고 `Locale.of(...)`를 권장한다. 컴파일은 되므로 Java 8 환경에서는 생성자를 그대로 쓰면 된다.

`Locale.CHINA`와 `Locale.CHINESE`는 다르다. `CHINESE`는 언어(`zh`)만 있고 나라가 없어서, 통화 형식으로 쓰면 어느 나라 돈인지 정할 수 없다. 통화에는 나라가 들어간 `CHINA`를 쓴다.

# 통화 형식

`getCurrencyInstance(locale)`는 그 나라의 **통화 기호, 기호 위치, 소수 자릿수, 구분 기호**를 모두 적용한다.

```java
double payment = 12324.134;

String us     = NumberFormat.getCurrencyInstance(Locale.US).format(payment);
String china  = NumberFormat.getCurrencyInstance(Locale.CHINA).format(payment);
String france = NumberFormat.getCurrencyInstance(Locale.FRANCE).format(payment);
```

|Locale|천 단위|소수점|기호 위치|
|---|---|---|---|
|`en_US`|`,`|`.`|앞 (`$12,324.13`)|
|`zh_CN`|`,`|`.`|앞 (`￥12,324.13`)|
|`fr_FR`|공백|`,`|뒤 (`12 324,13 €`)|
|`ko_KR`|`,`|`.`|앞, 소수 없음 (`₩12,324`)|

원화는 소수 자릿수가 0이라서 소수점 아래가 사라진다. 소수 자릿수는 Locale이 아니라 **통화(`java.util.Currency`)**가 정한다.

## 프랑스의 공백은 일반 공백이 아니다

프랑스 형식에 보이는 공백은 스페이스(`U+0020`)가 아니라 **줄바꿈 없는 공백(no-break space)**이다. 화면에서는 똑같아 보이지만 `"12 324,13 €".equals(...)`로 직접 쓴 문자열과 비교하면 `false`가 나올 수 있다. 출력 결과를 문자열로 비교할 때는 이 점을 기억한다.

# Java 버전마다 출력이 다르다

Locale 규칙은 JDK 안에 들어 있는 **로케일 데이터**에서 온다. Java 9부터 기본 데이터가 JDK 자체 데이터(`COMPAT`)에서 유니코드 컨소시엄의 **CLDR**로 바뀌었다(JEP 252). 그래서 같은 코드라도 버전에 따라 기호가 다르다.

|Locale|Java 8|Java 9 이상 (CLDR)|
|---|---|---|
|`en_IN`|`Rs.12,324.13`|`₹12,324.13`|
|`zh_CN`|`￥12,324.13` (전각 `U+FFE5`)|`¥12,324.13` (반각 `U+00A5`)|
|`fr_FR`|`12 324,13 €` (`U+00A0`)|`12 324,13 €` (최신 JDK는 구분 공백이 `U+202F`)|

HackerRank의 예시 출력(`Rs.`, `￥`)은 Java 8 기준이다. 최신 JDK로 돌리면 예시와 다르게 나올 수 있다. 이때는 Java 8을 고르거나, 실행 옵션 `-Djava.locale.providers=COMPAT`로 옛 데이터를 쓴다. 단 `COMPAT`은 Java 21에서 제거 예정으로 표시됐고 Java 23에서 빠졌다.

# 반올림은 HALF_EVEN

`NumberFormat`의 기본 반올림 방식은 `RoundingMode.HALF_EVEN`(은행가 반올림)이다. 정확히 반인 경우에 **짝수 쪽**으로 보낸다.

```java
NumberFormat nf = NumberFormat.getInstance(Locale.US);
nf.setMaximumFractionDigits(0);
nf.format(2.5);   // "2"  (짝수 쪽)
nf.format(3.5);   // "4"
```

`12324.134`는 반이 아니므로 그냥 `12324.13`이 된다. 반올림을 바꾸려면 `setRoundingMode(RoundingMode.HALF_UP)`를 쓴다.

double은 `2.675` 같은 값을 정확히 담지 못하고 근삿값으로 저장하므로, 반올림 결과가 예상과 다를 때가 있다. double이 실수를 저장하는 방식은 따로 정리했다.

[[double-precision]]

# 자주 쓰는 설정

|메서드|하는 일|
|---|---|
|`setMinimumFractionDigits(n)`|소수점 아래 최소 n자리 (모자라면 0을 채운다)|
|`setMaximumFractionDigits(n)`|소수점 아래 최대 n자리 (넘치면 반올림)|
|`setGroupingUsed(false)`|천 단위 구분 기호를 끈다|
|`setRoundingMode(mode)`|반올림 방식을 바꾼다|
|`setCurrency(currency)`|통화를 바꾼다 (기호와 소수 자릿수가 바뀐다)|

```java
NumberFormat nf = NumberFormat.getInstance(Locale.US);
nf.setMinimumFractionDigits(2);
nf.setMaximumFractionDigits(2);
nf.format(3.1);      // "3.10"
nf.format(1234567);  // "1,234,567.00"
```

# 문자열을 숫자로: parse

`format`의 반대는 `parse`다. 맨 앞부터 숫자로 읽을 수 없으면 checked 예외인 `ParseException`을 던진다.

```java
NumberFormat nf = NumberFormat.getInstance(Locale.FRANCE);
Number n = nf.parse("1234,5");     // 1234.5 (프랑스는 쉼표가 소수점)
nf.parse("abc");                   // ParseException
```

`parse`는 읽을 수 있는 데까지만 읽고 나머지는 버린다. 그래서 `"1 234,5"`처럼 일반 공백을 넣으면 공백 앞의 `1`만 읽는다.

# String.format과 비교

`String.format("%,.2f", x)`도 천 단위 구분과 소수 자릿수를 맞출 수 있다. 하지만 통화 기호와 기호 위치는 직접 붙여야 한다. 나라별 통화 형식이 필요하면 `NumberFormat`, 자리 맞춤 정도면 `String.format`이 간단하다.

[[java-string-formatting]]

# 주의: 스레드 안전하지 않다

`NumberFormat`(과 `DecimalFormat`)은 내부 상태를 바꿔 가며 동작해서 **여러 스레드가 하나를 같이 쓰면 안 된다**. 스레드마다 새로 만들거나 `ThreadLocal`에 담는다.

# 정리

- `NumberFormat`은 숫자를 Locale에 맞는 문자열로 바꾼다. `abstract class`라서 `getInstance`, `getCurrencyInstance` 같은 팩토리 메서드로 얻는다.
- Locale을 빼면 JVM 기본 Locale을 쓴다. 출력이 정해진 문제에서는 Locale을 꼭 넘긴다.
- 상수가 없는 인도는 `new Locale("en", "IN")`(Java 19 이상은 `Locale.of`)으로 만든다.
- 통화 형식은 기호, 기호 위치, 구분 기호, 소수 자릿수를 함께 바꾼다. 프랑스의 공백은 일반 공백이 아니다.
- Java 9부터 로케일 데이터가 CLDR로 바뀌어 `Rs.`→`₹`, `￥`→`¥`처럼 출력이 달라진다.
- 기본 반올림은 `HALF_EVEN`이다. 스레드 안전하지 않다.

# 영어로 설명하기

> NumberFormat formats numbers according to a Locale, so getCurrencyInstance(Locale.FRANCE) puts the euro sign after the number and uses a space as the grouping separator.

> India has no built-in Locale constant, so I create one with new Locale("en", "IN"), and I keep in mind that Java 9 and later use CLDR data, which prints the rupee sign instead of "Rs.".
