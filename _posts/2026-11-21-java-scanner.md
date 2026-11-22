---
title: "[Java] Scanner 클래스 정리"
date: 2026-11-21 09:30:00 +01:00
description: "Scanner의 토큰과 줄 개념, 주요 메서드, nextInt() 다음 nextLine() 함정, BufferedReader와의 차이"
categories: [Java]
tags: [Java]
render_with_liquid: false
---

`Scanner`는 함수가 아니라 **클래스**다. `new Scanner(...)`로 객체를 만들고, 그 객체의 **메서드**를 호출해서 쓴다.

# Scanner란?

`java.util` 패키지에 있는 클래스로, 입력을 읽어서 원하는 타입으로 잘라 준다(parsing).
어디서 읽을지는 생성자에 넘기는 입력 소스가 정한다.

```java
import java.util.Scanner;

Scanner sc = new Scanner(System.in);          // 표준 입력(키보드)
Scanner sc2 = new Scanner("10 20 30");        // 문자열
Scanner sc3 = new Scanner(new File("a.txt")); // 파일 (FileNotFoundException 처리 필요)
```

# 토큰(token)과 줄(line)

Scanner를 이해하는 데 가장 중요한 개념이다.

- **토큰**: 공백(스페이스, 탭, 줄바꿈)으로 구분된 덩어리
- **줄**: 줄바꿈(`\n`) 전까지의 전체 문자열

입력이 `Hello world`라면 토큰은 `Hello`, `world` 두 개이고 줄은 `Hello world` 하나다.

# 주요 메서드

## 읽기 메서드

|메서드|읽는 것|반환 타입|
|---|---|---|
|`next()`|토큰 하나|`String`|
|`nextInt()`|토큰 하나를 정수로|`int`|
|`nextLong()`|토큰 하나를 long으로|`long`|
|`nextDouble()`|토큰 하나를 실수로|`double`|
|`nextBoolean()`|토큰 하나를 boolean으로|`boolean`|
|`nextLine()`|줄 전체 (줄바꿈 전까지)|`String`|

## 확인 메서드

읽지 않고 **확인만** 한다. 값을 소비하지 않는다.

|메서드|확인하는 것|
|---|---|
|`hasNext()`|다음 토큰이 있는가|
|`hasNextInt()`|다음 토큰이 정수인가|
|`hasNextDouble()`|다음 토큰이 실수인가|
|`hasNextLine()`|다음 줄이 있는가|

`hasNextX()`는 `nextX()`와 짝으로 쓴다.

- 타입이 안 맞는 값을 `nextInt()`로 읽으면 `InputMismatchException`
- 읽을 게 없는데 읽으면 `NoSuchElementException`

```java
if (sc.hasNextInt()) {
    int n = sc.nextInt();
} else {
    System.out.println("정수가 아닙니다");
}
```

# nextInt() 다음 nextLine() 함정

입력이 아래와 같을 때

```
42
Hello world
```

```java
int n = sc.nextInt();       // 42
String s = sc.nextLine();   // "" ← 빈 문자열
```

`nextInt()`는 `42`만 읽고 그 뒤의 줄바꿈 `\n`은 남겨 둔다.
그래서 `nextLine()`은 남아 있던 `\n`을 만나 빈 줄을 읽고 끝나 버린다.

남은 줄바꿈을 버리는 `nextLine()`을 한 번 더 호출하면 해결된다.

```java
int n = sc.nextInt();
sc.nextLine();              // 남은 \n 버리기
String s = sc.nextLine();   // "Hello world"
```

`nextInt()`, `nextDouble()`, `next()` 같은 토큰 메서드는 모두 같은 문제가 있다.
**토큰 메서드 뒤에 `nextLine()`이 오면 의심하자.**

# 구분자(delimiter) 바꾸기

기본 구분자는 공백이지만 `useDelimiter()`로 바꿀 수 있다.

```java
Scanner sc = new Scanner("apple,banana,cherry");
sc.useDelimiter(",");
while (sc.hasNext()) {
    System.out.println(sc.next());  // apple / banana / cherry
}
```

# close()와 주의점

```java
sc.close();
```

자원을 반납하는 메서드다. 단, `System.in`을 감싼 Scanner를 닫으면 **`System.in` 자체도 닫혀서** 그 뒤로는 입력을 받을 수 없다.
그래서 Scanner는 프로그램에서 **하나만 만들어 계속 쓰는** 게 원칙이다. 메서드마다 `new Scanner(System.in)`을 만들지 않는다.

# Scanner vs BufferedReader

Scanner는 편하지만 내부적으로 정규식을 써서 **느리다**. 입력이 많은 코딩 테스트에서는 시간 초과가 날 수 있어서 `BufferedReader`를 쓴다.

```java
BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
String line;
while ((line = br.readLine()) != null) {   // EOF면 null
    int n = Integer.parseInt(line);
}
```

| |Scanner|BufferedReader|
|---|---|---|
|속도|느림|빠름|
|타입 변환|자동 (`nextInt()` 등)|직접 (`Integer.parseInt()`)|
|EOF 확인|`hasNextLine()`|`readLine() == null`|
|예외 처리|필요 없음|`IOException` 처리 필요|
|쓰임|학습, 작은 입력|대량 입력, 코딩 테스트|

# 영어 키워드

|영어|뜻|
|---|---|
|token / delimiter|토큰 / 구분자|
|parse|문자열을 특정 타입으로 해석하다|
|InputMismatchException|타입이 맞지 않을 때 나는 예외|
|NoSuchElementException|읽을 요소가 없을 때 나는 예외|
|leftover newline|`nextInt()` 뒤에 남는 줄바꿈|
|buffered I/O|버퍼를 사용하는 입출력|

> Scanner is convenient because it parses tokens into types like int or double, but it's slower since it uses regular expressions internally. BufferedReader reads raw lines quickly, so it's better for large inputs, but I have to parse the values myself.
