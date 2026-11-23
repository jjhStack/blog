---
title: "[HackerRank] Java Int to String"
date: 2026-11-22 10:00:00 +01:00
description: "int를 String으로 바꾸는 문제. 변환 없이 Good job만 출력한 풀이의 컴파일 오류와 의도 문제, String.valueOf로 다시 풀기"
categories: [HackerRank, Java]
tags: [Java, 알고리즘, HackerRank]
render_with_liquid: false
---

# 문제

[HackerRank - Java Int to String](https://www.hackerrank.com/challenges/java-int-to-string/problem)

정수 `n`을 입력받아 문자열로 바꾼다. 바꾼 문자열이 맞으면 `Good job`, 틀리면 `Wrong answer`가 출력된다.

|입력|출력|
|---|---|
|`100`|`Good job`|

처음 에디터에는 빈 `main`만 있었다. 입력, 변환, 출력을 모두 직접 써야 한다.

```java
import java.io.*;
import java.util.*;

public class Solution {

    public static void main(String[] args) {
        /* Enter your code here. Read input from STDIN. Print output to STDOUT. Your class should be named Solution. */
    }
}
```

# 내 풀이

```java
import java.io.*;
import java.util.*;

public class Solution {

    public static void main(String[] args) {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        try {
            String st = br.readLine();
            System.out.println("Good job");
        } catch(e) {
            System.out.println("Wrong answer");
        } finally {
            br.close();
        }
    }
}
```

문제는 세 가지다. 앞의 두 개는 컴파일 오류라서 실행조차 되지 않는다.

## 1. catch에 예외 타입이 없다

Java의 `catch`는 `catch (타입 변수)` 형식이어야 한다. JavaScript처럼 `catch (e)`로 쓰면 컴파일 오류가 난다.

```java
catch (e) { ... }            // 컴파일 오류
catch (IOException e) { ... } // 올바른 형식
```

`readLine()`이 던질 수 있는 예외가 `IOException`이므로 그 타입을 적는다.

## 2. finally의 br.close()도 IOException을 던진다

`close()`도 `IOException`을 던질 수 있는 메서드다. `finally` 블록은 바로 위 `try`의 `catch`가 감싸 주지 않기 때문에, `main`에 `throws IOException`이 없으면 "처리되지 않은 예외" 컴파일 오류가 난다.

해결 방법은 둘 중 하나다.

```java
// (1) main에 throws를 붙인다
public static void main(String[] args) throws IOException { ... }

// (2) try-with-resources로 쓴다. 블록이 끝나면 close()가 자동으로 호출된다
try (BufferedReader br = new BufferedReader(new InputStreamReader(System.in))) {
    String st = br.readLine();
} catch (IOException e) {
    ...
}
```

`BufferedReader`가 왜 `IOException` 처리를 요구하는지는 아래 글에 정리했다.

[[java-input-output-comparison]]

## 3. 변환을 하지 않고 정답 문구를 직접 출력했다

컴파일 오류를 고쳐도 이 코드는 문제를 푼 것이 아니다.

- `readLine()`은 처음부터 `String`을 돌려준다. `int`를 `String`으로 바꾸는 과정이 없다.
- 입력이 무엇이든 `Good job`을 그대로 출력한다.
- `catch`는 **입출력 오류**가 났을 때 실행된다. 답이 틀렸을 때 실행되는 것이 아니므로 `Wrong answer`를 여기서 출력하는 것은 의미가 맞지 않는다.

## 고쳐서 다시 냈더니 통과했다

컴파일 오류 두 개만 고쳐서 다시 제출했다.

```java
try {
    BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
    String st = br.readLine();
    System.out.println("Good job");
} catch (IOException e) {
    System.out.println("Wrong answer");
}
```

- `catch (IOException e)`로 예외 타입을 적었다.
- `finally { br.close(); }`를 지웠다. 표준 입력은 프로그램이 끝나면 정리되므로 닫지 않아도 결과에 영향이 없다.

이 코드는 통과한다. 하지만 **변환을 해서 통과한 것이 아니다.** HackerRank는 코드가 무엇을 했는지 보지 않고, 표준 출력이 예상 출력과 같은지만 비교한다. 예상 출력은 모든 테스트에서 `Good job`이고, 이 코드는 입력과 상관없이 항상 `Good job`을 출력하므로 모든 테스트를 통과한다.

|구분|채점이 확인하는 것|이 코드가 한 것|
|---|---|---|
|출력|`Good job` 한 줄인가|항상 `Good job`을 출력함|
|int → String 변환|확인하지 않음|하지 않음|

출력 문구를 직접 친 것은 static 초기화 블록 문제에서 `java.lang.Exception: ...`를 직접 친 것과 같은 실수다.

[[hackerrank-java-static-initializer-block]]

## readLine()이 int를 String으로 바꿔 주는 것 아닌가?

처음에는 `br.readLine()`이 입력된 int를 String으로 바꿔서 읽어 주고, 변환에 실패하면 `catch`로 넘어간다고 생각했다. 둘 다 아니다.

- **바꿀 int가 없다.** 표준 입력은 처음부터 문자다. `100`을 입력하면 `'1'`, `'0'`, `'0'`이라는 문자가 들어오고, `readLine()`은 그 문자들을 모아 `"100"`을 돌려줄 뿐이다. int에서 String으로 가는 변환은 일어나지 않는다.
- **내용을 검사하지 않는다.** `abc`를 입력해도 `"abc"`를 그대로 돌려주고 예외는 나지 않는다.
- **`IOException`은 입력 내용 때문에 나지 않는다.** 스트림을 읽는 것 자체가 실패할 때만 난다. HackerRank의 테스트 입력으로는 이런 일이 생기지 않으므로 이 `catch`는 한 번도 실행되지 않는다.

```java
String st = br.readLine();       // "100" 또는 "abc", 예외 없음
int n = Integer.parseInt(st);    // "abc"라면 여기서 NumberFormatException
String s = String.valueOf(n);    // 문제가 요구하는 int → String 변환은 이 줄
```

이 문제는 String을 int로 읽고(`parseInt`) 다시 String으로 바꾸는(`valueOf`) 방향이다. `readLine()` 한 줄로는 두 단계 중 어느 것도 하지 않는다.

`readLine()`의 동작과 예외는 아래 글에 더 정리했다.

[[java-input-output-comparison]]

# 문제의 의도

에디터가 비어 있으니 채점 코드도 직접 써야 한다. 문제 설명대로 하면 순서는 다음과 같다.

1. 입력을 **정수**로 읽는다.
2. 그 정수를 **문자열로 바꾼다.** 이 단계가 문제의 핵심이다.
3. 바꾼 문자열이 원래 정수를 제대로 나타내면 `Good job`, 아니면 `Wrong answer`를 출력한다.

|구분|내 풀이|의도한 풀이|
|---|---|---|
|입력|`readLine()`으로 처음부터 문자열을 읽음|`nextInt()`로 `int`를 읽음|
|변환|없음|`String.valueOf(n)`으로 `int`를 `String`으로 바꿈|
|`Good job` 출력|조건 없이 출력|변환 결과를 확인한 뒤 출력|
|`Wrong answer` 출력|`IOException`이 날 때|변환 결과가 틀릴 때|

# 다시 푼 풀이

```java
import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        in.close();

        String s = String.valueOf(n);

        if (n == Integer.parseInt(s)) {
            System.out.println("Good job");
        } else {
            System.out.println("Wrong answer.");
        }
    }
}
```

`Integer.parseInt(s)`로 문자열을 다시 정수로 바꿔서 원래 값 `n`과 비교한다. 변환이 맞으면 같은 값이 나온다.

`String.valueOf(n)` 대신 `Integer.toString(n)`이나 `"" + n`을 써도 같은 결과를 낸다. 세 방법의 차이는 아래 글에 정리했다.

[[java-int-to-string]]

# 정리

- Java의 `catch`에는 반드시 예외 타입을 쓴다(`catch (IOException e)`).
- `finally`에서 부르는 `close()`도 checked 예외를 던지므로 `throws`나 try-with-resources로 처리한다.
- `catch`는 예외가 났을 때 실행되는 곳이지, 오답일 때 실행되는 곳이 아니다.
- `readLine()`은 입력된 문자를 그대로 `String`으로 돌려줄 뿐이고 int → String 변환이나 숫자 검사를 하지 않는다. 숫자가 아니라서 나는 예외는 `parseInt`의 `NumberFormatException`이다.
- HackerRank는 표준 출력만 비교한다. 정답 문구를 직접 출력해도 통과하지만, 그것은 문제를 푼 것이 아니다.
- 에디터가 비어 있으면 문제 설명의 순서(정수 입력 → 문자열 변환 → 확인 후 출력)를 그대로 코드로 옮긴다.

