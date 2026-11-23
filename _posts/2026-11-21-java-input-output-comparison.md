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

### readLine()은 숫자를 문자열로 "변환"하지 않는다

표준 입력으로 들어오는 것은 처음부터 **문자**다. `100`을 입력하면 프로그램에는 `'1'`, `'0'`, `'0'`, 줄바꿈이 들어온다. `int` 100은 어디에도 없다.
`readLine()`은 이 문자들을 줄바꿈 전까지 모아서 `String`으로 돌려줄 뿐이고, 내용이 숫자인지는 검사하지 않는다.

|입력|`readLine()` 결과|예외|
|---|---|---|
|`100`|`"100"`|없음|
|`abc`|`"abc"`|없음|
|(빈 줄)|`""`|없음|
|입력 끝(EOF)|`null`|없음|

`IOException`은 스트림 자체를 읽다가 문제가 생겼을 때(스트림이 닫혔을 때 등)만 난다. 입력 내용이 이상하다고 나는 예외가 아니다.
숫자가 아닌 문자열 때문에 나는 예외는 `Integer.parseInt()`가 던지는 `NumberFormatException`이다.

```java
String s = br.readLine();     // "abc" → 그대로 "abc", 예외 없음
int n = Integer.parseInt(s);  // 여기서 NumberFormatException
```

`NumberFormatException`은 `IOException`의 하위 클래스가 아니다. 그래서 `catch (IOException e)`로는 잡히지 않는다.

### read()는 문자 하나를 읽고 int로 돌려준다

`readLine()`이 한 줄을 읽는다면 `read()`는 **문자 하나**를 읽는다. 반환 타입이 `char`가 아니라 `int`라는 점이 중요하다.

|구분|`read()`|`readLine()`|
|---|---|---|
|읽는 단위|문자 1개|줄 1개(줄바꿈 전까지)|
|반환 타입|`int`|`String`|
|돌려주는 값|문자의 코드 값(0~65535)|줄의 내용(줄바꿈 문자는 빠짐)|
|입력 끝(EOF)|`-1`|`null`|
|줄바꿈|`'\n'`(10)도 문자 하나로 읽음|줄의 끝으로 보고 버림|

반환 타입이 `int`인 이유는 EOF를 표시하기 위해서다. `char`는 0~65535만 담을 수 있어서 "더 읽을 문자가 없다"는 값을 따로 표현할 수 없다. 그래서 문자 코드는 0 이상으로, EOF는 `-1`로 돌려준다.

입력이 `100`일 때 `read()`를 세 번 부르면 숫자 100이 아니라 각 문자의 코드 값이 나온다.

```java
int c1 = br.read(); // 49  ('1')
int c2 = br.read(); // 48  ('0')
int c3 = br.read(); // 48  ('0')
int c4 = br.read(); // 10  ('\n'), 입력 끝이면 -1
```

문자로 쓰려면 `char`로 캐스팅하고, 숫자 한 자리로 쓰려면 `'0'`을 뺀다.

```java
char ch = (char) c1;  // '1'
int digit = c1 - '0'; // 1
```

EOF까지 한 글자씩 읽는 패턴은 다음과 같다.

```java
int c;
while ((c = br.read()) != -1) {
    System.out.print((char) c);
}
```

여러 글자를 한 번에 배열로 받는 `read(char[] buf, int off, int len)`도 있다. 이 메서드는 실제로 읽은 문자 개수를 돌려주고, EOF면 `-1`을 돌려준다.

`System.in.read()`도 있지만 이것은 `InputStream`의 메서드라서 **문자가 아니라 바이트**(0~255)를 읽는다. 한글처럼 여러 바이트로 된 문자는 한 번에 읽히지 않는다. `BufferedReader`는 `InputStreamReader`가 바이트를 문자로 바꿔 주므로 `read()` 한 번에 문자 하나를 읽는다.

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
- `readLine()`은 숫자를 변환하거나 검사하지 않는다. 숫자가 아니라서 나는 예외는 `parseInt`의 `NumberFormatException`이다.
- `BufferedReader.read()`는 문자 하나의 코드 값을 `int`로 돌려주고, EOF면 `-1`이다. 입력 `100`을 읽으면 `49`, `48`, `48`이 나온다.
- `System.out.println`은 줄마다 바로 내보내서 많이 출력하면 느리다.
- 많이 출력할 때는 `StringBuilder`에 모으거나 `BufferedWriter`, `PrintWriter`를 쓴다.
- `BufferedWriter`와 `PrintWriter`는 `flush()`를 빼먹으면 출력이 사라진다.
- `BufferedWriter.write(int)`는 숫자가 아니라 문자 코드를 쓴다.

# 영어로 설명하기

> Scanner is convenient because it splits the input into tokens and converts them to types like int, but it is slow. BufferedReader reads whole lines as strings, so I have to parse them myself, but it is much faster for large inputs.

> `BufferedReader.read()` reads a single character and returns its code as an `int`, or `-1` at the end of the stream. It returns an `int` instead of a `char` so that it can use `-1` to mean "no more input".

> For output, calling System.out.println many times is slow because it flushes on every line. I collect the output in a StringBuilder or use a BufferedWriter, and I must remember to call flush, or nothing will be printed.
