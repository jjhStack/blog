---
title: "[Java] 입출력 클래스 비교: Scanner, BufferedReader, println, BufferedWriter"
date: 2026-11-21 09:40:00 +01:00
description: "입력은 Scanner와 BufferedReader, 출력은 System.out, printf, StringBuilder, BufferedWriter, PrintWriter. 쓰는 법과 속도, flush 함정까지 비교"
categories: [Java]
tags: [Java]
render_with_liquid: false
---

Java에서 표준 입력을 읽고 표준 출력에 쓰는 방법은 여러 가지다.
코딩 테스트에서 자주 쓰는 것만 골라 **입력 쪽**과 **출력 쪽**으로 나눠 비교한다.

이 글의 코드와 시간은 모두 JDK 21에서 직접 실행한 결과다. 시간은 내 컴퓨터 기준이라 절대값보다는 **차이의 크기**를 보면 된다.

# 한눈에 보기

|입력 클래스|읽는 단위|속도|주로 쓰는 곳|
|---|---|---|---|
|`Scanner`|토큰, 줄|느림|학습, 입력이 적을 때|
|`BufferedReader`|줄|빠름|입력이 많을 때, 코딩 테스트|

|출력 방법|쓰는 방식|속도|주로 쓰는 곳|
|---|---|---|---|
|`System.out.println`|한 번에 한 줄|많으면 느림|출력이 적을 때|
|`System.out.printf`|서식에 맞춘 문자열|많으면 느림|자릿수, 정렬이 필요할 때|
|`StringBuilder` + 한 번 출력|모아서 한 번|빠름|출력이 많을 때|
|`BufferedWriter`|버퍼에 모아서|빠름|출력이 많을 때|
|`PrintWriter`|버퍼에 모아서 (`printf` 가능)|빠름|많이 출력하면서 서식도 필요할 때|

# 입력: Scanner vs BufferedReader

## Scanner

```java
Scanner sc = new Scanner(System.in);
int n = sc.nextInt();
double d = sc.nextDouble();
String word = sc.next();
String line = sc.nextLine();
```

- 공백으로 나눈 **토큰** 단위로 읽고, `int`, `double` 같은 타입으로 바꿔 준다.
- 예외 처리(`throws`)가 필요 없다.
- 내부에서 정규식으로 토큰을 해석하기 때문에 느리다.
- `nextInt()` 뒤 `nextLine()` 함정, 타입이 안 맞는 토큰, 로케일 문제가 있다.

자세한 내용은 Scanner 글에 정리했다.

[[java-scanner]]

## BufferedReader

```java
BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
int n = Integer.parseInt(br.readLine());          // 한 줄에 숫자 하나

StringTokenizer st = new StringTokenizer(br.readLine());  // 한 줄에 여러 개
int a = Integer.parseInt(st.nextToken());
int b = Integer.parseInt(st.nextToken());
```

- **줄** 단위로 읽고 결과는 항상 `String`이다. 타입 변환은 `Integer.parseInt()` 등으로 직접 한다.
- 한 줄에 값이 여러 개면 `StringTokenizer`나 `split()`으로 직접 나눈다.
- `readLine()`은 `IOException`을 던질 수 있어서 `main`에 `throws IOException`을 붙이거나 `try-catch`로 감싸야 한다.
- 입력이 끝나면(EOF) `readLine()`이 `null`을 돌려준다.

```java
String line;
while ((line = br.readLine()) != null) {
    // 한 줄씩 처리
}
```

## 한 줄을 나눌 때: StringTokenizer vs split

|구분|`StringTokenizer`|`split("\\s+")`|
|---|---|---|
|구분 기준|공백 문자 (스페이스, 탭, 줄바꿈)|정규식|
|연속 공백|알아서 하나로 처리|`\\s+`면 하나로 처리|
|앞쪽 공백|무시|빈 문자열이 생긴다 (`trim()` 필요)|
|속도|빠름|정규식이라 상대적으로 느림|

`split(" ")`처럼 공백 하나로 나누면 빈 문자열이 섞인다. 직접 실행해 보면 다음과 같다.

```java
" 10  20".split(" ");                 // [, 10, , 20]
"10  20\t30" → StringTokenizer        // 10, 20, 30
```

## 속도 비교

정수 100만 개(한 줄에 10개씩)를 읽어서 합을 구했다.

|방법|시간|
|---|---|
|`Scanner.nextInt()`|약 500~570ms|
|`BufferedReader` + `StringTokenizer`|약 85~95ms|

`BufferedReader` 쪽이 5~6배 빨랐다. 입력이 수십 개 정도면 차이를 느낄 수 없고, 수십만 개 이상이면 시간 초과를 가를 수 있다.

## 입력 비교 정리

|구분|Scanner|BufferedReader|
|---|---|---|
|읽는 단위|토큰, 줄|줄|
|타입 변환|자동 (`nextInt()` 등)|직접 (`Integer.parseInt()`)|
|EOF 확인|`hasNext()`, `hasNextLine()`|`readLine() == null`|
|예외 처리|필요 없음|`IOException` 처리 필요|
|속도|느림|빠름|
|`nextInt()` 뒤 `nextLine()` 함정|있음|없음 (항상 줄 단위)|

# 출력: println, printf, StringBuilder, BufferedWriter, PrintWriter

## System.out.println / printf

```java
System.out.println(42);
System.out.printf("%-15s%03d%n", "java", 7);
```

- 가장 간단하다. 따로 닫거나 비울 필요가 없다.
- `System.out`은 `PrintStream`이고, `println`을 부를 때마다 내용을 바로 내보낸다(flush). 그래서 수십만 줄을 출력하면 느리다.
- `printf`의 서식 지정자는 따로 정리했다.

[[java-string-formatting]]

## StringBuilder에 모아서 한 번에 출력

```java
StringBuilder sb = new StringBuilder();
for (int i = 0; i < n; i++) {
    sb.append(i).append('\n');
}
System.out.print(sb);
```

- 문자열을 메모리에 모았다가 마지막에 한 번만 출력한다.
- 추가 클래스나 예외 처리 없이 빠르게 만들 수 있어서 코딩 테스트에서 많이 쓴다.
- 서식이 필요하면 `sb.append(String.format(...))`처럼 쓴다.

## BufferedWriter

```java
BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(System.out));
bw.write(String.valueOf(42));   // write(int)는 숫자가 아니라 문자 코드로 쓴다
bw.newLine();
bw.flush();                     // 꼭 필요
```

- 버퍼에 모았다가 버퍼가 차거나 `flush()`할 때 내보낸다.
- `write()`는 문자열만 받는다고 생각하는 게 안전하다. `bw.write(42)`는 숫자 42가 아니라 문자 코드 42인 `*`를 쓴다.
- `IOException` 처리가 필요하다.

## PrintWriter

```java
PrintWriter pw = new PrintWriter(System.out);
pw.println(42);
pw.printf("%-15s%03d%n", "java", 7);
pw.flush();                     // 꼭 필요
```

- `BufferedWriter`처럼 버퍼를 쓰면서 `println`, `printf`도 쓸 수 있다.
- `IOException`을 던지지 않는다.

## flush()를 빼먹으면 아무것도 안 나온다

`BufferedWriter`와 `PrintWriter`는 `flush()`나 `close()`를 부르지 않으면 버퍼에 남은 내용이 **출력되지 않고 사라진다.** 직접 실행해 보면 다음과 같다.

|코드|출력|
|---|---|
|`PrintWriter`로 `println` 후 끝|(아무것도 안 나옴)|
|`BufferedWriter`로 `write` 후 끝|(아무것도 안 나옴)|
|`BufferedWriter`로 `write` 후 `flush()`|정상 출력|

출력이 통째로 비어 있으면 가장 먼저 `flush()`를 의심한다.

## 속도 비교

0부터 999,999까지 100만 줄을 출력했다.

|방법|시간|
|---|---|
|`System.out.println` 100만 번|약 440ms|
|`StringBuilder`에 모아 한 번 출력|약 50ms|
|`BufferedWriter` + 마지막에 `flush()`|약 60ms|

`println`을 반복하는 것보다 모아서 내보내는 쪽이 7~9배 빨랐다.

## 출력 비교 정리

|구분|`println`/`printf`|`StringBuilder`|`BufferedWriter`|`PrintWriter`|
|---|---|---|---|---|
|버퍼링|줄마다 바로 내보냄|직접 모음|있음|있음|
|`flush()` 필요|아니다|아니다 (마지막에 `print`)|그렇다|그렇다|
|서식(`printf`)|가능|`String.format`으로|`String.format`으로|가능|
|예외 처리|필요 없음|필요 없음|`IOException` 필요|필요 없음|
|속도 (많이 출력할 때)|느림|빠름|빠름|빠름|

# 무엇을 쓸까

|상황|입력|출력|
|---|---|---|
|입출력이 적은 문제, 학습용|`Scanner`|`System.out.println`, `printf`|
|입력이 많은 문제|`BufferedReader` + `StringTokenizer`|-|
|출력이 많은 문제|-|`StringBuilder` 또는 `BufferedWriter`|
|많이 출력하면서 서식도 필요|-|`PrintWriter`|

코딩 테스트용으로 자주 쓰는 조합은 이렇다.

```java
import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringBuilder sb = new StringBuilder();

        int n = Integer.parseInt(br.readLine());
        for (int i = 0; i < n; i++) {
            StringTokenizer st = new StringTokenizer(br.readLine());
            int a = Integer.parseInt(st.nextToken());
            int b = Integer.parseInt(st.nextToken());
            sb.append(a + b).append('\n');
        }

        System.out.print(sb);
    }
}
```

# 정리

- 입력은 `Scanner`(편함, 느림)와 `BufferedReader`(직접 변환, 빠름)로 나뉜다. 입력이 많으면 `BufferedReader`를 쓴다.
- `BufferedReader`는 줄 단위로 `String`을 돌려주고, EOF면 `null`이다. 한 줄의 값은 `StringTokenizer`로 나눈다.
- `System.out.println`은 줄마다 바로 내보내서 많이 출력하면 느리다.
- 많이 출력할 때는 `StringBuilder`에 모으거나 `BufferedWriter`, `PrintWriter`를 쓴다.
- `BufferedWriter`와 `PrintWriter`는 `flush()`를 빼먹으면 출력이 사라진다.
- `BufferedWriter.write(int)`는 숫자가 아니라 문자 코드를 쓴다.

# 영어로 설명하기

> Scanner is convenient because it splits the input into tokens and converts them to types like int, but it is slow. BufferedReader reads whole lines as strings, so I have to parse them myself, but it is much faster for large inputs.

> For output, calling System.out.println many times is slow because it flushes on every line. I collect the output in a StringBuilder or use a BufferedWriter, and I must remember to call flush, or nothing will be printed.
