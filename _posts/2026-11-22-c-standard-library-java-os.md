---
title: "[CS] C 표준 라이브러리, 자바, 운영체제는 어떻게 이어져 있을까"
date: 2026-11-22 18:40:00 +01:00
description: "EOF 문서를 읽다가 생긴 질문들. C 표준 라이브러리란 무엇이고, 자바와 운영체제는 C와 어떤 관계인지"
categories: [CS]
tags: [C, Java, OS]
render_with_liquid: false
---

EOF 위키백과 문서를 읽다가 "In the C standard library"라는 표현이 나왔다.
C 표준 라이브러리가 뭔지 찾아보다가 자바와 운영체제까지 질문이 이어져서 한 번에 정리한다.

[[hackerrank-java-end-of-file]]

# C 표준 라이브러리란?

C 언어 표준(ISO C)이 정해 둔 **기본 함수, 매크로, 타입 모음**이다. **libc**라고도 부른다.
C 컴파일러가 있는 환경이라면 어디서나 똑같이 쓸 수 있도록 표준이 보장한다.

## 헤더별 기능

|헤더|하는 일|예시|
|---|---|---|
|`<stdio.h>`|입출력|`printf`, `scanf`, `fopen`, `getchar`, `EOF`|
|`<stdlib.h>`|메모리, 변환, 종료|`malloc`, `free`, `atoi`, `exit`|
|`<string.h>`|문자열/메모리 조작|`strlen`, `strcpy`, `memcpy`|
|`<math.h>`|수학 함수|`sqrt`, `sin`, `pow`|
|`<ctype.h>`|문자 판별|`isdigit`, `toupper`|
|`<time.h>`|시간|`time`, `clock`|

## 명세와 구현은 다르다

표준은 **"이런 함수가 있어야 하고 이렇게 동작해야 한다"는 명세**만 정한다. 실제 코드는 플랫폼마다 따로 있다.

- Linux: glibc, musl
- Windows: MSVCRT, UCRT
- macOS: libSystem

## EOF는 C 표준 라이브러리의 매크로다

- `EOF`는 `<stdio.h>`에 정의된 매크로이고, 보통 값은 `-1`이다. 표준은 "음수인 `int`"라는 것만 정한다.
- `getchar()`, `fgetc()` 같은 입력 함수가 더 읽을 데이터가 없거나 오류가 나면 이 값을 돌려준다.
- EOF는 **파일 안에 실제로 저장된 문자가 아니다.** 함수가 "끝났다"고 알려 주는 **신호값**이다.

```c
#include <stdio.h>

int main(void) {
    int c;                          // char가 아니라 int로 받는다
    while ((c = getchar()) != EOF) {
        putchar(c);
    }
    return 0;
}
```

`c`를 `int`로 받는 이유가 있다. `getchar()`는 0~255 사이의 정상 문자 **또는** `EOF`(-1)를 돌려준다.
`char`로 받으면 바이트 값 255와 EOF를 구분하지 못할 수 있다.

[[https://en.wikipedia.org/wiki/End-of-file]]

# 자바와 C 표준 라이브러리의 관계

**직접 관계는 없지만 밑에서는 연결되어 있다.**

## 각자 표준 라이브러리가 따로 있다

|구분|C|Java|
|---|---|---|
|표준 라이브러리|C 표준 라이브러리 (libc)|Java 클래스 라이브러리 (JDK API)|
|불러오는 방법|`#include <stdio.h>`|`import java.io.*;`|
|출력|`printf()`|`System.out.println()`|
|파일 읽기|`fopen`, `fgetc`|`FileInputStream`, `BufferedReader`|
|메모리|`malloc` / `free` (직접 관리)|`new` + GC (자동 관리)|

자바 코드에서 `printf`나 `malloc`을 직접 부를 수는 없다.

## 하지만 밑에서는 이어져 있다

자바 프로그램이 파일을 읽을 때는 대략 이런 층을 거친다.

```
[ 내 자바 코드 ]          FileInputStream.read()
       ↓
[ Java 표준 라이브러리 ]   java.io 클래스들
       ↓  (native 메서드, JNI)
[ JVM (C/C++로 작성) ]    HotSpot 등
       ↓
[ C 표준 라이브러리 ]      glibc / Windows UCRT
       ↓
[ 운영체제 ]               read() 시스템 콜 / ReadFile
```

- **JVM 자체가 C/C++ 프로그램**이다. 그래서 JVM은 OS의 C 런타임에 의존한다.
- 자바 라이브러리의 파일, 네트워크 기능은 결국 `native` 메서드를 통해 C 코드로 내려간다.
- 자바에서 C 함수를 직접 부르고 싶으면 **JNI**나 **FFM API**(Java 22에서 정식 기능)를 쓴다.

## EOF 관례는 C에서 물려받았다

자바에는 `EOF`라는 상수가 없지만 같은 방식을 쓴다.

```java
int c;                                   // C처럼 int로 받는다
while ((c = System.in.read()) != -1) {   // -1 = 스트림 끝
    System.out.print((char) c);
}
```

- `InputStream.read()`는 0~255 사이의 바이트를 돌려주고, 끝에 닿으면 `-1`을 돌려준다. C의 `getchar()`와 같다.
- 반환 타입이 `byte`가 아니라 `int`인 이유도 C와 같다. 정상 데이터와 "끝" 신호를 구분해야 하기 때문이다.
- 자바만의 방식도 있다. `BufferedReader.readLine()`은 끝에서 `null`을 돌려주고, `Scanner.hasNextLine()`은 `false`를 돌려주고, `DataInputStream`은 `EOFException`을 던진다.

[[java-scanner]]

# 운영체제는 C로만 돌아갈까?

아니다. **주요 OS 커널이 주로 C로 *작성*되었을 뿐이다.**

## CPU는 C를 모른다

```
C / C++ / Rust / 어셈블리 소스코드
        ↓  컴파일러
   기계어 (0과 1의 명령어)
        ↓
       CPU 실행
```

C는 사람이 OS를 **작성할 때** 쓰는 언어다. 컴파일이 끝나면 C든 Rust든 똑같이 기계어가 되고, CPU는 그 기계어만 실행한다.

## 실제 OS들은 여러 언어로 만들어진다

|OS|주 언어|
|---|---|
|Linux 커널|C + 어셈블리, Rust(6.1 버전부터 일부 허용)|
|Windows 커널|C, C++, 어셈블리, 최근 일부 Rust|
|macOS / iOS (XNU)|C, C++(드라이버 프레임워크 IOKit), 어셈블리|
|Android|Linux 커널(C) 위에 Java/Kotlin 프레임워크, 일부 Rust|
|Fuchsia (Google)|C++, Rust|
|Redox OS|거의 전부 Rust|

## C로 안 되는 부분은 어셈블리로 쓴다

CPU를 직접 만져야 하는 작업은 C로 표현할 수 없다.

- 부팅 직후 첫 명령어 실행
- 프로세스 전환(컨텍스트 스위치) 때 레지스터 저장과 복원
- 인터럽트 진입부

## 그래도 C가 많은 이유

- **역사**: C는 1970년대에 **Unix를 만들려고** 탄생한 언어다. C와 OS는 처음부터 함께 발전했다.
- **하드웨어에 가깝다**: 포인터로 메모리를 직접 다룰 수 있고, 런타임이나 GC가 필요 없다.
- **호환성**: 거의 모든 CPU에 C 컴파일러가 있고, OS 사이의 약속(ABI, 시스템 콜 인터페이스)도 사실상 C 방식이 표준이다.

## 요즘은 Rust가 늘고 있다

C는 메모리를 사람이 직접 관리하기 때문에 버퍼 오버플로, use-after-free 같은 보안 버그가 자주 생긴다.
그래서 C만큼 빠르면서 메모리 안전성을 컴파일러가 보장하는 **Rust**를 Linux와 Windows가 조금씩 도입하고 있다.

# 정리

- **C 표준 라이브러리**는 ISO C가 정한 함수와 매크로 모음이다. `EOF`도 그중 하나(`<stdio.h>`)다.
- **자바**는 자기 표준 라이브러리를 쓴다. 다만 JVM이 C/C++로 만들어져 있어 밑에서는 C 런타임 위에서 돌아간다.
- `-1`로 끝을 알리고 `int`로 받는 **EOF 관례**는 자바가 C에서 물려받았다.
- **OS 커널**은 주로 C로 작성되지만 어셈블리, C++, Rust도 함께 쓴다. CPU가 실행하는 건 언어와 상관없는 기계어다.

전체를 층으로 보면 이렇다.

```
Java 코드 → Java 표준 라이브러리 → JVM(C/C++) → C 표준 라이브러리 → OS 커널(C + 어셈블리 + α) → 기계어 → CPU
```

# 영어로 설명하기

> The C standard library is a set of functions and macros defined by the ISO C standard. `EOF` is one of them; it is a negative integer returned by input functions like `getchar()` when there is no more data.

> Java does not use the C standard library directly, but the JVM itself is written in C and C++, so Java programs ultimately run on top of the C runtime and the operating system.

> Most operating system kernels are mainly written in C, along with assembly for low-level tasks, and Rust is increasingly being adopted for memory safety.
