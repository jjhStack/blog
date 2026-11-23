---
title: "[Java] int를 String으로 바꾸는 방법"
date: 2026-11-23 10:30:00 +01:00
description: "String.valueOf, Integer.toString, 빈 문자열 더하기의 차이와 반대 방향인 Integer.parseInt"
categories: [Java]
tags: [Java]
render_with_liquid: false
---

`int`를 `String`으로 바꾸는 방법은 크게 세 가지다. 이 내용은 아래 문제를 풀다가 정리했다.

[[hackerrank-java-int-to-string]]

# 세 가지 방법

```java
int n = 100;

String a = String.valueOf(n);   // "100"
String b = Integer.toString(n); // "100"
String c = "" + n;              // "100"
```

|구분|`String.valueOf(n)`|`Integer.toString(n)`|`"" + n`|
|---|---|---|---|
|어디의 메서드인가|`String` 클래스의 static 메서드|`Integer` 클래스의 static 메서드|메서드가 아니라 `+` 연산|
|받는 타입|`int`, `long`, `double`, `char`, `Object` 등 여러 오버로드|`int`|아무 타입|
|`null` 객체를 넘기면|`valueOf(Object)`는 `"null"`을 돌려줌|`int`라서 해당 없음|`"null"`이 됨|
|의도가 드러나는가|드러남|드러남|"문자열로 바꾼다"는 의도가 덜 보임|

## String.valueOf(int)

`String.valueOf(int)`는 내부에서 `Integer.toString(int)`를 호출한다. 그래서 `int`에 대해서는 두 방법의 결과가 같다.
`String.valueOf`는 타입별로 오버로드되어 있어서 `double`, `boolean`, 객체 등 무엇이든 같은 이름으로 바꿀 수 있다는 장점이 있다.

## Integer.toString(int)

`Integer` 클래스에 있는 static 메서드다. 진법을 지정하는 버전도 있다.

```java
Integer.toString(255);     // "255"
Integer.toString(255, 2);  // "11111111"
Integer.toString(255, 16); // "ff"
```

## "" + n

`+`의 한쪽이 `String`이면 다른 쪽도 문자열로 바뀌어 이어 붙는다(문자열 연결). 짧게 쓸 수 있지만, 변환이 목적이라는 것이 코드에 드러나지 않는다.

# 반대 방향: String을 int로

```java
int x = Integer.parseInt("100");      // 100 (int)
Integer y = Integer.valueOf("100");   // 100 (Integer 객체)
Integer.parseInt("abc");              // NumberFormatException
```

`parseInt`는 숫자가 아닌 문자열을 받으면 `NumberFormatException`을 던진다. 이 예외는 unchecked 예외라서 `try-catch`를 강제하지 않는다.

# 정리

- `int` → `String`: `String.valueOf(n)`, `Integer.toString(n)`, `"" + n`.
- `String.valueOf(int)`는 내부적으로 `Integer.toString(int)`를 호출하므로 결과가 같다.
- 의도를 드러내려면 `String.valueOf`나 `Integer.toString`을 쓴다.
- `String` → `int`: `Integer.parseInt(s)`. 숫자가 아니면 `NumberFormatException`이 난다.

# 영어로 설명하기

> To convert an `int` to a `String` in Java, you can use `String.valueOf(n)`, `Integer.toString(n)`, or string concatenation like `"" + n`. For an `int`, `String.valueOf` simply calls `Integer.toString`, so the result is the same.

> To go the other way, use `Integer.parseInt(s)`. It throws a `NumberFormatException` if the string is not a valid number.
