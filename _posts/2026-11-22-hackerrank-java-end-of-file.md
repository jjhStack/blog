---
title: "[HackerRank] End-of-file"
date: 2026-11-22 17:35:00 +01:00
description: "줄 수를 모르는 입력을 EOF까지 읽고 줄 번호를 붙여 출력하기. 두 번 틀리면서 배운 것"
categories: [HackerRank, Java]
tags: [java, hackerrank, 알고리즘, 코딩테스트, eof, end-of-file, 표준입력, stdin, system.in, scanner, hasnextline, nextline, while, 반복문, args, 명령줄 인자, off-by-one, nosuchelementexception]
render_with_liquid: false
---

# 문제

[HackerRank - Java End-of-file](https://www.hackerrank.com/challenges/java-end-of-file/problem)

몇 줄인지 모르는 입력을 **EOF(End Of File)**, 즉 더 읽을 데이터가 없을 때까지 읽고, 각 줄 앞에 줄 번호와 공백 하나를 붙여 출력하는 문제다.
각 줄은 비어 있지 않은 문자열이다.

입력

```
Hello world
I am a file
Read me until end-of-file.
```

출력

```
1 Hello world
2 I am a file
3 Read me until end-of-file.
```

입력은 `Scanner`로 읽는다. EOF 개념과 Scanner 메서드는 아래에 따로 정리해 두었다.

[[https://en.wikipedia.org/wiki/End-of-file]]

[[java-scanner]]

# 첫 번째 시도

```java
Scanner sc = new Scanner(System.in);
String txt = sc.nextLine();
for (int i = 0; i < args.length; i++) {
    System.out.println(txt);
    txt = sc.nextLine();
}
```

아무것도 출력되지 않았다.

## 원인 1. args는 입력 줄 수가 아니다

`args`는 **명령줄 인자(command-line arguments)**다. 프로그램을 실행할 때 붙여 주는 값이다.

```bash
java Solution hello world   # args = ["hello", "world"]
java Solution               # args = [] → args.length == 0
```

stdin으로 들어오는 입력과는 관계가 없다. HackerRank는 인자 없이 실행하니까 `args.length`는 0이고 반복문이 한 번도 돌지 않는다.

- `args`: 실행 시점에 주어지는 값
- `System.in`: 실행 중에 흘러 들어오는 데이터 스트림

## 원인 2. 개수를 모르면 for가 아니라 while

입력이 몇 줄인지 모르니까 정해진 횟수만큼 도는 `for`가 아니라, 조건이 참인 동안 도는 `while`을 써야 한다.
조건으로는 `hasNextLine()`을 쓴다. 읽을 줄이 남아 있으면 `true`, EOF면 `false`를 돌려준다.

# 두 번째 시도

```java
Scanner sc = new Scanner(System.in);
String txt = sc.nextLine();
int i = 1;
while (sc.hasNextLine()) {
    System.out.printf("%d %s%n", i, txt);
    txt = sc.nextLine();
    i++;
}
```

이번엔 출력은 나오는데 **마지막 줄이 빠졌다.**

```
1 Hello world
2 I am a file
```

## 원인. 확인하는 줄과 출력하는 줄이 어긋났다

손으로 한 회차씩 따라가 보면 바로 보인다.

|시점|txt|hasNextLine()|출력|
|---|---|---|---|
|반복문 전|"Hello world"|-|-|
|1회차|"Hello world" → "I am a file"|true|1 Hello world|
|2회차|"I am a file" → "Read me until..."|true|2 I am a file|
|3회차 확인|"Read me until..."|**false**|반복 종료|

3번째 줄은 이미 `txt`에 읽어 두었는데, 그다음 줄이 없으니 `hasNextLine()`이 `false`가 되면서 출력 없이 끝난다.

`hasNextLine()`은 **앞으로 읽을 줄이 있는지** 묻는 메서드다. 그런데 이 코드는 그 결과로 **이미 읽어 둔 줄을 출력할지** 정하고 있다. 확인 대상과 처리 대상이 한 줄씩 밀려 있는 **off-by-one error**다.

숨은 문제도 하나 더 있다. 입력이 아예 비어 있으면 반복문 전의 `sc.nextLine()`에서 바로 `NoSuchElementException`이 난다. 확인 없이 읽었기 때문이다.

# 해결

읽기를 반복문 안으로 옮겨서 **확인 → 읽기 → 처리**를 한 회차 안에서 끝낸다.

```java
import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int lineNumber = 1;

        while (sc.hasNextLine()) {          // 1. 확인
            String line = sc.nextLine();    // 2. 읽기
            System.out.printf("%d %s%n", lineNumber, line); // 3. 처리
            lineNumber++;
        }

        sc.close();
    }
}
```

확인한 줄과 출력하는 줄이 항상 같고, 빈 입력이면 반복문에 들어가지도 않아서 안전하다.

# 정리

- `args`는 명령줄 인자다. 표준 입력은 `System.in`으로 읽는다.
- 입력 개수를 모르면 `while`과 `hasNextLine()`으로 EOF까지 읽는다.
- `hasNextLine()`은 **다음에 읽을 것**에 대한 확인이다. 확인과 읽기는 바로 붙여 쓰고, 반복문 밖에서 미리 읽지 않는다.
- 반복문은 **첫 회차와 마지막 회차**를 손으로 따라가 보면 off-by-one 버그를 잡기 쉽다.
- 직접 실행해서 테스트할 때 EOF는 Mac/Linux에서 <kbd>Ctrl</kbd> + <kbd>D</kbd>, Windows에서 <kbd>Ctrl</kbd> + <kbd>Z</kbd> 후 <kbd>Enter</kbd>로 보낸다.

# 영어로 설명하기

> Since the number of input lines is unknown, I used a while loop with `hasNextLine()` as the condition, so the program stops reading when it reaches EOF.

> I traced the loop manually and found an off-by-one error: the last line was read but never printed, because the condition checked for the next line instead of the current one.
