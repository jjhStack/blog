---
title: "[Spring Error] Failed to configure a DataSource: 'url' attribute is not specified and no embedded datasource could be configured."
date: 2024-03-24 16:42:00 +09:00
error: "Failed to configure a DataSource: 'url' attribute is not specified and no embedded datasource could be configured."
categories: [springboot, error]
tags: [spring,springboot,error]
render_with_liquid: false
---

# 문제

springboot 처음 실행시 에러 발생

![error](/assets/img/post/202403/2024-03-24-speing-error-data-source-01.png)

```java
***************************
APPLICATION FAILED TO START
***************************

Description:

Failed to configure a DataSource: 'url' attribute is not specified and no embedded datasource could be configured.

Reason: Failed to determine a suitable driver class


Action:

Consider the following:
	If you want an embedded database (H2, HSQL or Derby), please put it on the classpath.
	If you have database settings to be loaded from a particular profile you may need to activate it (no profiles are currently active).


Process finished with exit code 0
```

# 원인
Database에 연결할 때 필요한 정보가 없거나 잘못 되었기 때문에 발생하는 에러이다.
처음 Springboot를 만들었을때 정보 수정 없이 바로 실행시키면 이런 에러가 발생한다.

# 해결
application.properties 파일에 DB 연결 정보를 세팅해준다.

```java
spring.datasource.url=jdbc:mysql://localhost:3306/[DB스키마명]
spring.datasource.username=[DB접속Id]
spring.datasource.password=[DB접속Password]
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
```

# 결과

![error](/assets/img/post/202403/2024-03-24-speing-error-data-source-02.png)

Whitelabel Error Page 가 뜨는 것은 컨트롤러고 뭐고 없어서 404페이지가 쓰는 것이다.
