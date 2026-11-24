---
title: "[Java] String 자주 쓰는 메서드 정리"
date: 2026-11-24 10:00:00 +01:00
description: "String의 불변성과 equals, 길이·글자 꺼내기·찾기·자르기·비교(compareTo)·대소문자·공백 제거·바꾸기·나누기·합치기·반복, 첫 글자만 대문자로 바꾸기, split과 replace의 함정, StringBuilder"
categories: [Java]
tags: [Java, String]
render_with_liquid: false
---

`java.lang.String`은 글자들의 나열을 담는 클래스다. `import` 없이 바로 쓸 수 있고, 메서드가 많다. 이 글은 **자주 쓰는 메서드**를 용도별로 묶어 정리한다. 모든 메서드 목록은 공식 문서에 있다.

[[https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/String.html]]

이 메서드들을 실제로 쓰는 문제 풀이는 아래 글에 있다.

[[hackerrank-java-strings-introduction]]

# 먼저 알아야 할 두 가지

## String은 불변(immutable)이다

`String` 객체는 한 번 만들면 내용이 바뀌지 않는다. `toUpperCase()`, `replace()`, `trim()` 같은 메서드는 원래 문자열을 고치지 않고 **새 문자열을 돌려준다**. 결과를 변수에 담지 않으면 아무 일도 일어나지 않은 것과 같다.

```java
String s = "hello";
s.toUpperCase();          // 결과를 버렸다. s는 여전히 "hello"
s = s.toUpperCase();      // s는 "HELLO"
```

## 내용 비교는 equals, ==는 쓰지 않는다

`==`는 **같은 객체인지**를 비교한다. 내용이 같아도 다른 객체면 `false`가 나올 수 있다.

```java
String a = "java";
String b = new String("java");
a == b;          // false (다른 객체)
a.equals(b);     // true  (내용이 같다)
```

`"java"`처럼 쓴 리터럴은 JVM이 한 객체를 재사용해서(String pool) `==`가 우연히 `true`일 때가 있다. 그래서 테스트에서는 맞는 것처럼 보이다가 입력값에서 틀린다. 문자열 내용은 항상 `equals`로 비교한다.

`null`일 수 있는 변수는 상수를 앞에 둔다. `"yes".equals(input)`은 `input`이 `null`이어도 예외 없이 `false`다.

# 한눈에 보기

|용도|메서드|예 (`s = "Hello"`)|결과|
|---|---|---|---|
|길이|`length()`|`s.length()`|`5`|
|비었는지|`isEmpty()`, `isBlank()`|`"  ".isBlank()`|`true`|
|글자 하나|`charAt(i)`|`s.charAt(1)`|`'e'`|
|위치 찾기|`indexOf`, `lastIndexOf`|`s.indexOf("l")`|`2`|
|포함 여부|`contains`, `startsWith`, `endsWith`|`s.startsWith("He")`|`true`|
|자르기|`substring`|`s.substring(1, 3)`|`"el"`|
|같은지|`equals`, `equalsIgnoreCase`|`s.equalsIgnoreCase("hello")`|`true`|
|사전순|`compareTo`, `compareToIgnoreCase`|`s.compareTo("Help")`|`-4`|
|대소문자|`toUpperCase`, `toLowerCase`|`s.toUpperCase()`|`"HELLO"`|
|양끝 공백|`trim`, `strip`|`" hi ".strip()`|`"hi"`|
|바꾸기|`replace`, `replaceAll`|`s.replace("l", "L")`|`"HeLLo"`|
|나누기|`split`|`"a,b".split(",")`|`["a", "b"]`|
|합치기|`String.join`, `+`, `concat`|`String.join("-", "a", "b")`|`"a-b"`|
|반복|`repeat`|`"ab".repeat(3)`|`"ababab"`|
|배열로|`toCharArray`|`"hi".toCharArray()`|`['h', 'i']`|
|다른 타입에서|`String.valueOf`|`String.valueOf(12)`|`"12"`|
|형식|`String.format`, `formatted`|`String.format("%03d", 7)`|`"007"`|

`isBlank`, `strip`, `repeat`, `lines`는 Java 11부터, `formatted`는 Java 15부터 있다. Java 8 환경에서는 쓸 수 없다.

# 길이와 빈 문자열

```java
"Hello".length();    // 5
"".isEmpty();        // true  (길이 0)
"  ".isEmpty();      // false (공백도 글자다)
"  ".isBlank();      // true  (공백뿐이면 true, Java 11+)
```

배열은 `arr.length`(필드), 문자열은 `s.length()`(메서드), 리스트는 `list.size()`다. 셋이 다 달라서 자주 헷갈린다.

# 글자 꺼내기

인덱스는 **0부터** 시작한다. 마지막 글자는 `length() - 1`이다. 범위를 벗어나면 `StringIndexOutOfBoundsException`이 난다.

```java
String s = "Hello";
s.charAt(0);                  // 'H'
s.charAt(s.length() - 1);     // 'o'
s.charAt(5);                  // StringIndexOutOfBoundsException

for (char c : s.toCharArray()) {   // 한 글자씩 돌기
    System.out.print(c);
}
```

`charAt`은 `String`이 아니라 `char`를 돌려준다. `char`는 숫자처럼 계산되므로 `'a' + 1`은 `98`, `(char) ('a' + 1)`은 `'b'`다. 글자를 숫자로 바꿀 때는 `c - '0'`을 쓴다(`'7' - '0'`은 `7`).

# 찾기

```java
String s = "banana";
s.indexOf("an");         // 1  (처음 나온 위치)
s.indexOf("an", 2);      // 3  (2번부터 찾기)
s.lastIndexOf("an");     // 3  (마지막으로 나온 위치)
s.indexOf("x");          // -1 (없으면 -1)

s.contains("nan");       // true
s.startsWith("ba");      // true
s.endsWith("na");        // true
```

`indexOf`는 없을 때 예외가 아니라 `-1`을 돌려준다. 결과를 `substring`에 바로 넘기면 `-1` 때문에 예외가 날 수 있으니 먼저 확인한다.

# 자르기: substring

`substring(begin, end)`는 `begin`부터 `end` **바로 앞까지** 자른다. `end`를 빼면 끝까지다.

```java
String s = "Hello";
s.substring(1, 3);   // "el"   (1, 2번 글자)
s.substring(1);      // "ello"
s.substring(0, 0);   // ""
```

자른 길이는 `end - begin`이다. 끝을 포함하지 않는다는 점만 기억하면 된다.

# 비교

## equals와 equalsIgnoreCase

```java
"Java".equals("java");             // false
"Java".equalsIgnoreCase("java");   // true
```

## compareTo: 사전순 비교

`String`은 숫자처럼 `>`, `<`로 비교할 수 없다. 컴파일 오류가 난다. 사전순 비교는 `a.compareTo(b)`로 하고 결과의 **부호**를 본다.

|결과|뜻|
|---|---|
|음수|`a`가 사전에서 `b`보다 **앞**|
|0|두 문자열이 같다|
|양수|`a`가 사전에서 `b`보다 **뒤** (사전적으로 더 크다)|

앞에서부터 한 글자씩 비교하다가 **처음으로 다른 글자**가 나오면 두 글자의 유니코드 값 차이를 돌려준다. 한쪽이 다른 쪽의 앞부분과 같으면(접두사이면) **길이 차이**를 돌려준다.

```java
"hello".compareTo("java");   // 'h'(104) - 'j'(106) = -2
"java".compareTo("hello");   //  2
"app".compareTo("apple");    //  3 - 5 = -2
```

`Comparable`의 약속은 **부호**만 보장한다. 다른 타입의 `compareTo`는 `-1`, `0`, `1`만 돌려주기도 하므로 코드에서는 `> 0`, `< 0`으로만 판단한다.

길이 비교는 사전순 비교가 아니다. `"z"`는 한 글자지만 사전에서 `"apple"`보다 뒤다.

## 대문자가 소문자보다 앞이다

`compareTo`는 유니코드 값으로 비교한다. 대문자 `A`~`Z`(65~90)가 소문자 `a`~`z`(97~122)보다 작아서 `"Zoo"`가 `"apple"`보다 앞이다. 대소문자를 무시하려면 `compareToIgnoreCase`를 쓴다.

```java
"Zoo".compareTo("apple");             // -7
"Zoo".compareToIgnoreCase("apple");   // 양수
```

# 대소문자 바꾸기

```java
"Hello".toUpperCase();   // "HELLO"
"Hello".toLowerCase();   // "hello"
```

인자 없는 `toUpperCase()`는 JVM 기본 Locale의 규칙을 쓴다. 터키어 Locale에서는 `"i".toUpperCase()`가 `"I"`가 아니라 점이 있는 `"İ"`가 된다. 언어와 상관없는 키나 명령어를 바꿀 때는 `toUpperCase(Locale.ROOT)`로 고정한다. Locale이 결과를 바꾸는 다른 예는 아래 글에 있다.

[[java-numberformat]]

## 첫 글자만 대문자로 바꾸기

표준 라이브러리에는 첫 글자만 바꾸는 메서드가 없다. 첫 글자와 나머지를 나눠서 첫 글자만 바꾼 뒤 다시 붙인다.

```java
String s = "hello";
String cap = s.substring(0, 1).toUpperCase() + s.substring(1);   // "Hello"
```

|코드|결과|
|---|---|
|`s.substring(0, 1)`|`"h"`|
|`.toUpperCase()`|`"H"`|
|`s.substring(1)`|`"ello"`|
|`+`|`"Hello"`|

`char`로 다루는 방법도 있다. `char + String`은 문자열이 되지만 `char + char`는 숫자 덧셈이 되니 주의한다.

```java
String cap2 = Character.toUpperCase(s.charAt(0)) + s.substring(1);   // "Hello"
```

빈 문자열에 `substring(0, 1)`이나 `charAt(0)`을 쓰면 예외가 나므로, 입력이 비어 있을 수 있으면 먼저 확인한다.

```java
static String capitalize(String s) {
    if (s == null || s.isEmpty()) return s;
    return s.substring(0, 1).toUpperCase() + s.substring(1);
}
```

Apache Commons Lang 라이브러리에는 같은 일을 하는 `StringUtils.capitalize`가 있다.

# 양끝 공백 지우기: trim과 strip

```java
"  hi  ".trim();            // "hi"
"  hi  ".strip();           // "hi"   (Java 11+)
"  hi  ".stripLeading();    // "hi  "
"  hi  ".stripTrailing();   // "  hi"
```

**가운데 공백은 지우지 않는다.** `" a b ".trim()`은 `"a b"`다.

|구분|`trim()`|`strip()`|
|---|---|---|
|지우는 글자|코드 값이 `U+0020` 이하인 글자|유니코드에서 공백으로 정한 글자 전부|
|전각 공백 `U+3000`|못 지운다|지운다|

새로 쓰는 코드에서는 `strip()`이 더 정확하다.

# 바꾸기: replace와 replaceAll

```java
"banana".replace("a", "o");        // "bonono"  (전부 바꾼다)
"banana".replace('a', 'o');        // "bonono"
"a1b22c".replaceAll("[0-9]", "");  // "abc"     (정규식)
"a1b22c".replaceFirst("[0-9]", "");// "ab22c"   (처음 하나만, 정규식)
```

|메서드|첫 인자|바꾸는 개수|
|---|---|---|
|`replace`|글자 그대로|**전부**|
|`replaceAll`|정규식|전부|
|`replaceFirst`|정규식|처음 하나|

이름 때문에 `replace`가 하나만 바꾸고 `replaceAll`이 전부 바꾼다고 오해하기 쉽다. 둘 다 전부 바꾼다. 차이는 **정규식을 쓰는지**다. `replaceAll(".", "")`은 점이 아니라 **모든 글자**를 지운다(`.`은 정규식에서 아무 글자). 점 하나를 지우려면 `replace(".", "")`를 쓴다.

# 나누기: split

`split`은 문자열을 구분자로 나눠 `String[]`을 돌려준다. 인자는 **정규식**이다.

```java
"a,b,c".split(",");          // ["a", "b", "c"]
"a  b c".split(" ");         // ["a", "", "b", "c"]  공백 두 개 사이의 빈 문자열
"a  b c".split("\\s+");      // ["a", "b", "c"]      공백 여러 개를 하나로
"1.2.3".split("\\.");        // ["1", "2", "3"]
"1.2.3".split(".");          // []  모든 글자가 구분자가 된다
```

정규식에서 특별한 뜻이 있는 `. | * + ? ( ) [ ] { } \ ^ $`는 앞에 `\\`를 붙인다. `"a|b".split("|")`도 기대와 다르게 한 글자씩 나뉜다.

끝에 생기는 빈 문자열은 버려진다. 남기려면 두 번째 인자에 음수를 준다.

```java
"a,b,,".split(",");          // ["a", "b"]
"a,b,,".split(",", -1);      // ["a", "b", "", ""]
" a b".split(" ");           // ["", "a", "b"]  앞의 빈 문자열은 남는다
```

앞의 빈 문자열을 피하려면 `strip()`을 먼저 한다.

# 합치기

```java
"Hello" + " " + "Java";               // "Hello Java"
"Hello".concat(" Java");              // "Hello Java"
String.join(", ", "a", "b", "c");     // "a, b, c"
String.join("-", List.of("x", "y"));  // "x-y"
```

`+`는 숫자와 섞이면 순서대로 계산된다. `1 + 2 + "a"`는 `"3a"`, `"a" + 1 + 2`는 `"a12"`다.

## 반복문 안에서는 StringBuilder

`String`이 불변이라 반복문에서 `+=`를 쓰면 매번 새 문자열을 만든다. 많이 이어 붙일 때는 `StringBuilder`를 쓴다.

```java
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 5; i++) {
    sb.append(i).append(' ');
}
String result = sb.toString();        // "0 1 2 3 4 "

new StringBuilder("abc").reverse().toString();   // "cba"
```

`String`에는 `reverse()`가 없다. 문자열을 뒤집을 때도 `StringBuilder`를 쓴다.

# 반복: repeat

```java
"ab".repeat(3);    // "ababab"  (Java 11+)
"-".repeat(10);    // "----------"
```

# 다른 타입과 바꾸기

```java
String.valueOf(123);        // "123"
String.valueOf(3.14);       // "3.14"
String.valueOf(true);       // "true"
String.valueOf(new char[]{'h', 'i'});   // "hi"

Integer.parseInt("123");    // 123 (String → int)
```

int와 String을 오가는 방법은 아래 글에 따로 정리했다.

[[java-int-to-string]]

# 형식 맞추기: format

```java
String.format("%s is %d years old", "Kim", 20);   // "Kim is 20 years old"
String.format("%.2f", 3.14159);                    // "3.14"
"%05d".formatted(42);                              // "00042" (Java 15+)
```

형식 지정자는 아래 글에 정리했다.

[[java-string-formatting]]

# 그 밖에 알아 두면 좋은 메서드

|메서드|하는 일|예|
|---|---|---|
|`matches(regex)`|전체가 정규식과 맞는지|`"123".matches("\\d+")` → `true`|
|`chars()`|글자를 `IntStream`으로|`"aab".chars().filter(c -> c == 'a').count()` → `2`|
|`lines()`|줄 단위 `Stream` (Java 11+)|`"a\nb".lines().count()` → `2`|
|`indent(n)`|각 줄 앞에 공백 n개 (Java 12+)|`"a".indent(2)` → `"  a\n"`|
|`intern()`|String pool의 객체를 돌려줌|거의 쓸 일이 없다|

# 정리

- `String`은 불변이다. 메서드는 새 문자열을 돌려주므로 결과를 변수에 담는다.
- 내용 비교는 `equals`다. `==`는 같은 객체인지 본다.
- 인덱스는 0부터, `substring(b, e)`는 `e` 바로 앞까지다. `indexOf`는 없으면 `-1`이다.
- 사전순 비교는 `compareTo`의 **부호**로 한다. 대문자가 소문자보다 앞이다.
- 첫 글자만 대문자: `s.substring(0, 1).toUpperCase() + s.substring(1)`.
- `trim`/`strip`은 양끝만 지운다. 새 코드에서는 `strip`이 더 정확하다.
- `replace`도 전부 바꾼다. `replaceAll`과의 차이는 정규식이다. `split`의 인자도 정규식이라 `.`, `|`는 `\\`를 붙인다.
- 반복해서 이어 붙이거나 뒤집을 때는 `StringBuilder`를 쓴다.
- `isBlank`, `strip`, `repeat`, `lines`는 Java 11부터 있다.

# 영어로 설명하기

> Strings in Java are immutable, so methods like toUpperCase and replace return a new string instead of changing the original, and I compare their contents with equals rather than the double-equals operator.

> I use compareTo for lexicographic order, substring and indexOf to cut and search, and split, which takes a regular expression, so I escape a dot as a double backslash followed by a dot.
