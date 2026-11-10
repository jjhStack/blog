---
title: "[Node.js] errno -4077 all connections to the npm registry"
date: 2023-11-06 13:23:00 +09:00
error: "npm notice Beginning October 4, 2021, all connections to the npm registry - including for package installation - must use TLS 1.2 or higher."
categories: [Node.js, error]
tags: [Node.js,error,npm]
render_with_liquid: false
---

```bash
npm install mongoose --save
```
몽구스를 설치하려던 도중, 에러가 발생했다.

![error](/assets/img/post/202311/2023-11-06-node-js-error-01.png)

사실 에러가 발생하면 어디서 나는지 창에 다 띄워준다.
> npm notice Beginning October 4, 2021, all connections to the npm registry - including for package installation - must use TLS 1.2 or higher.

번역기에 돌려봐도 되지만 대충 봐도 좀 더 높은 버전을 사용하라는 것 같아 보인다.

정확히는 2021년 10월 4일부터 패키지 설치를 포함하여 npm 웹사이트 및 npm 레지스트리에 대한 모든 연결은 TLS 1.2 이상을 사용해야 한다는 뜻이다.


![error](/assets/img/post/202311/2023-11-06-node-js-error-02.png)

다음처럼 VS에서 컨트롤 클릭을하면 상세 링크로 이동할 수 있다.


![error](/assets/img/post/202311/2023-11-06-node-js-error-03.png)

![error](/assets/img/post/202311/2023-11-06-node-js-error-04.png)

그렇단다.

해결 방법도 해당 페이지에 제공하고 있다.


![error](/assets/img/post/202311/2023-11-06-node-js-error-05.png)

해보자


![error](/assets/img/post/202311/2023-11-06-node-js-error-06.png)
뭔가 추가 됐다는데 이걸로 된 걸까?

다시 몽구스를 깔아보자.

![error](/assets/img/post/202311/2023-11-06-node-js-error-07.png)

해결!



