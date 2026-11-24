---
title: "[CS] double-precision(배정밀도) 부동소수점이란"
date: 2025-01-01 10:00:00 +01:00
description: "double이 64비트를 부호·지수·가수로 나눠 쓰는 방법, 유효숫자 15~17자리의 의미, 0.1 + 0.2가 0.3이 아닌 이유, 특수값과 Java에서의 주의점"
categories: [CS]
tags: [Java]
render_with_liquid: false
---

**double-precision floating-point format**(배정밀도 부동소수점 형식)은 실수를 **64비트**에 담는 방법이다. 국제 표준 **IEEE 754**에서는 이 형식을 **binary64**라고 부른다. Java, C의 `double`과 JavaScript의 `number`가 모두 이 형식이다.

[[https://en.wikipedia.org/wiki/Double-precision_floating-point_format]]

# 부동소수점이란

**부동(浮動)소수점**은 "떠다니는 소수점"이라는 뜻이다. 숫자를 **유효숫자 × 밑^지수** 꼴로 저장하고, 지수를 바꿔서 소수점 위치를 옮긴다. 과학적 표기법과 같은 생각이다.

```
  123.45   = 1.2345 × 10^2
  0.000123 = 1.23   × 10^-4
```

컴퓨터는 밑으로 10이 아니라 **2**를 쓴다. 그래서 같은 64비트로 아주 큰 수(약 10^308)부터 아주 작은 수(약 10^-308)까지 담을 수 있다. 대신 **유효숫자 자릿수는 정해져 있어서** 모든 실수를 정확히 담지는 못한다.

# "double"이라는 이름

32비트를 쓰는 **single precision**(단정밀도, `float`)보다 **두 배의 비트**를 쓴다는 뜻이다. 비트가 늘어나 표현 범위와 정밀도가 모두 커진다.

|구분|single (`float`)|double (`double`)|
|---|---|---|
|전체 비트|32|64|
|부호|1|1|
|지수|8|11|
|가수(fraction)|23|52|
|십진 유효숫자|약 6~9자리|약 15~17자리|
|가장 큰 값|약 3.4 × 10^38|약 1.8 × 10^308|

# 64비트를 나누는 방법

```
 63  62 ........ 52  51 .............................. 0
[부호][  지수 11비트  ][          가수 52비트           ]
  s         e                        f
```

- **부호(sign) 1비트**: 0이면 양수, 1이면 음수다.
- **지수(exponent) 11비트**: 2를 몇 번 곱할지 정한다. 음수 지수도 담아야 해서 실제 지수에 **1023(bias)**을 더한 값을 저장한다.
- **가수(fraction, mantissa) 52비트**: 유효숫자의 소수 부분이다.

일반적인 수의 값은 다음과 같다.

```
값 = (-1)^s × 1.f(2진수) × 2^(e - 1023)
```

앞자리 `1.`은 항상 1이라서 저장하지 않는다(**숨은 비트**, hidden bit). 그래서 52비트만 저장하지만 실제 정밀도는 **53비트**다.

## 유효숫자 15~17자리의 의미

53비트 정밀도는 십진수로 약 15.95자리다. 두 가지로 나눠 기억하면 된다.

- 십진수 **15자리**까지는 double에 넣었다가 다시 꺼내도 같은 숫자로 돌아온다.
- double 하나를 다른 double과 헷갈리지 않게 적으려면 **17자리**가 필요하다.

# 0.1 + 0.2가 0.3이 아닌 이유

```java
System.out.println(0.1 + 0.2);         // 0.30000000000000004
System.out.println(0.1 + 0.2 == 0.3);  // false
```

십진수 0.1은 2진수로 바꾸면 끝없이 반복된다.

```
0.1(10진수) = 0.0001100110011001100110011...(2진수, 0011 반복)
```

52비트에서 잘라 반올림하니 double에 들어간 값은 0.1이 아니라 **0.1에 가장 가까운 2진 소수**다. `BigDecimal`로 실제 저장된 값을 보면 알 수 있다.

```java
System.out.println(new BigDecimal(0.1));
// 0.1000000000000000055511151231257827021181583404541015625
```

0.1과 0.2가 각각 조금씩 어긋나 있고, 더하면서 오차가 드러난다. 버그가 아니라 2진 부동소수점이 원래 이렇게 동작한다.

# 특수값

지수 비트가 모두 0이거나 모두 1이면 특별한 뜻이 된다.

|값|만드는 예|설명|
|---|---|---|
|`+0.0`, `-0.0`|`-1.0 * 0`|0에도 부호가 있다. `0.0 == -0.0`은 `true`다|
|`Infinity`|`1.0 / 0`|넘치거나 0으로 나눈 결과다. 예외가 나지 않는다|
|`NaN`|`0.0 / 0`|Not a Number. 정의되지 않은 결과다|
|subnormal|아주 작은 수|숨은 비트 없이 0 근처를 촘촘하게 채운다|

`NaN`은 자기 자신과도 같지 않다. 그래서 `==`가 아니라 `Double.isNaN()`으로 확인한다.

```java
double x = 0.0 / 0;
System.out.println(x == x);           // false
System.out.println(Double.isNaN(x));  // true
```

정수 나눗셈 `1 / 0`은 `ArithmeticException`이 나지만, 실수 나눗셈 `1.0 / 0`은 `Infinity`가 된다.

# Java에서 주의할 점

## 실수 리터럴은 기본이 double

`3.14`처럼 쓰면 `double`이다. `float`로 쓰려면 `f`를 붙인다.

```java
double d = 3.14;
float f = 3.14f;   // f가 없으면 컴파일 에러 (double → float 손실)
```

`%f` 같은 출력 형식은 따로 정리해 두었다.

[[java-string-formatting]]

## Double.MIN_VALUE는 가장 작은 음수가 아니다

|상수|값|뜻|
|---|---|---|
|`Double.MAX_VALUE`|약 1.8 × 10^308|가장 큰 양수|
|`Double.MIN_NORMAL`|약 2.2 × 10^-308|가장 작은 **정규** 양수|
|`Double.MIN_VALUE`|약 4.9 × 10^-324|**0보다 큰** 가장 작은 양수 (subnormal)|

가장 작은 음수는 `-Double.MAX_VALUE`다. 이름 때문에 자주 헷갈린다.

## 정수는 2^53까지만 정확하다

53비트 정밀도라서 2^53(9,007,199,254,740,992)을 넘는 정수는 건너뛰며 저장된다.

```java
double big = 9007199254740992.0;      // 2^53
System.out.println(big + 1 == big);   // true, 1을 더해도 그대로다
```

JavaScript의 `Number.MAX_SAFE_INTEGER`가 2^53 - 1인 이유도 같다. 큰 ID나 금액은 `long`으로 다룬다.

## 비교는 오차를 두고 한다

```java
double a = 0.1 + 0.2;
System.out.println(Math.abs(a - 0.3) < 1e-9);   // true
```

## 돈 계산은 BigDecimal

오차가 허용되지 않는 금액은 `BigDecimal`을 쓴다. 이때 **문자열로 만들어야** 한다. `new BigDecimal(0.1)`은 이미 어긋난 double 값을 그대로 가져온다.

```java
new BigDecimal("0.1").add(new BigDecimal("0.2"));   // 0.3
new BigDecimal(0.1);                                 // 0.10000000000000000555...
BigDecimal.valueOf(0.1);                             // 0.1 (Double.toString을 거친다)
```

# 정리

- double-precision은 IEEE 754 **binary64** 형식이다. 64비트를 **부호 1 + 지수 11 + 가수 52**로 나눈다.
- 숨은 비트 덕분에 정밀도는 **53비트**, 십진수로 약 **15~17자리**다.
- 범위는 약 ±1.8 × 10^308로 넓지만, 0.1처럼 2진수로 끝나지 않는 수는 **근삿값**으로 저장된다.
- 그래서 `0.1 + 0.2 != 0.3`이다. 실수는 `==` 대신 오차 범위로 비교한다.
- `Infinity`, `NaN`, `-0.0` 같은 특수값이 있다. `NaN`은 `Double.isNaN()`으로 확인한다.
- `Double.MIN_VALUE`는 가장 작은 **양수**다. 정수는 2^53까지만 정확하다.
- 돈 계산은 `BigDecimal("문자열")`을 쓴다.

# 영어로 설명하기

> A double is a 64-bit IEEE 754 floating-point number: one sign bit, eleven exponent bits, and fifty-two fraction bits, which gives about 15 to 17 significant decimal digits.

> Since 0.1 cannot be represented exactly in binary, 0.1 + 0.2 is not exactly 0.3, so I compare doubles with a small tolerance and use BigDecimal for money.
