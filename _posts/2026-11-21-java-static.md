---
title: "[Java] static 키워드 정리"
date: 2026-11-21 12:55:00 +01:00
description: "static은 실행 순서가 아니라 '클래스에 속한다'는 뜻이다. static 변수, 메서드, 블록의 차이와 클래스 초기화 시점"
categories: [Java]
tags: [Java]
render_with_liquid: false
---

"static은 함수가 실행되면 제일 먼저 실행된다"는 절반만 맞는 이해다.
`static`은 실행 순서를 정하는 키워드가 아니라 **멤버가 객체가 아니라 클래스에 속한다**는 뜻이다.
먼저 실행되는 것은 static 블록과 static 필드 초기화뿐이고, 이것도 **클래스가 처음 쓰일 때 한 번만** 실행된다.

# static이 붙는 곳

|구분|예|뜻|자동으로 실행되나|
|---|---|---|---|
|static 변수|`static int count;`|클래스에 하나만 있고 모든 객체가 같이 쓴다|아니다. 초기값 대입만 클래스 초기화 때 한다|
|static 메서드|`static int add(int a, int b)`|객체 없이 `클래스명.메서드()`로 부른다|아니다. 호출해야 실행된다|
|static 블록|`static { ... }`|클래스 초기화 때 실행할 코드다|그렇다. 클래스 초기화 때 한 번|
|static 중첩 클래스|`static class Node {}`|바깥 객체 없이 만들 수 있는 안쪽 클래스다|해당 없음|

`main`도 그냥 static 메서드다. JVM이 프로그램 시작점으로 호출해 준다는 점만 다르다.

# 인스턴스 멤버와 비교

```java
class Counter {
    static int total = 0; // 클래스에 하나: 모든 객체가 공유
    int mine = 0;         // 객체마다 하나

    Counter() {
        total++;
        mine++;
    }
}

new Counter();
new Counter();
new Counter();
// Counter.total == 3, 각 객체의 mine == 1
```

static 메서드에는 `this`가 없다. 그래서 static 메서드 안에서는 인스턴스 변수(`mine`)나 인스턴스 메서드를 객체 없이 바로 쓸 수 없다.

# 클래스 초기화는 언제 일어나나

클래스 초기화(static 필드 대입과 static 블록 실행)는 프로그램이 시작될 때 모든 클래스에 일어나는 게 아니다.
**그 클래스가 처음 사용되는 순간에 한 번** 일어난다.

- 객체를 처음 만들 때 (`new A()`)
- static 메서드를 처음 호출할 때 (`A.foo()`, 프로그램 시작 시 `main` 포함)
- static 변수를 처음 읽거나 쓸 때 (`A.x`). 단, `static final int MAX = 10;` 같은 컴파일 타임 상수는 읽어도 초기화가 일어나지 않는다

```java
class A {
    static { System.out.println("A 초기화"); }
    static void hello() { System.out.println("hello"); }
}

public class Main {
    static { System.out.println("Main 초기화"); }

    public static void main(String[] args) {
        System.out.println("main 시작");
        A.hello();
        A.hello();
    }
}
```

```
Main 초기화   ← main을 부르기 위해 Main 클래스를 먼저 초기화
main 시작
A 초기화      ← A를 처음 쓰는 순간, 한 번만
hello
hello         ← 두 번째 호출 때는 static 블록이 다시 실행되지 않는다
```

층으로 그리면 이렇다.

```
프로그램 시작
  └─ JVM: Main 클래스 초기화 (static 필드 → static 블록, 소스 순서대로, 한 번)
  └─ JVM: Main.main() 호출
        └─ A를 처음 사용 → A 클래스 초기화 (한 번)
        └─ A.hello() 실행 (호출할 때마다)
```

HackerRank의 static 초기화 블록 문제에서 입력을 읽는 static 블록이 `main`보다 먼저 실행된 것도 같은 이유다.

[[hackerrank-java-static-initializer-block]]

[[https://docs.oracle.com/javase/tutorial/java/javaOO/classvars.html]]

[[https://docs.oracle.com/javase/specs/jls/se17/html/jls-12.html#jls-12.4.1]]

# 정리

- `static`은 "클래스에 속한다"는 뜻이다. 객체 없이 `클래스명.멤버`로 쓴다.
- static 변수는 클래스에 하나만 있고 모든 객체가 공유한다.
- static 메서드는 자동으로 실행되지 않는다. 호출해야 실행된다. `main`도 JVM이 호출해 주는 static 메서드일 뿐이다.
- 자동으로 실행되는 것은 static 필드 초기화와 static 블록이다. 클래스가 처음 쓰일 때 소스 순서대로 한 번만 실행된다.
- static 메서드에는 `this`가 없어서 인스턴스 멤버를 바로 쓸 수 없다.

# 영어로 설명하기

> The `static` keyword means a member belongs to the class itself, not to any instance. You can use it without creating an object.

> Static initializer blocks run only once, when the class is first initialized. That happens before `main` for the starting class, but other classes are initialized only when they are first used.
