---
title: "[Node.js]code ECONNRESET"
date: 2023-11-06 13:42:00 +09:00
error: "npm ERR! code ECONNRESET"
categories: [Node.js, error]
tags: [Node.js,error,npm]
render_with_liquid: false
---

# 문제

npx create-react-app을 통해 리액트 프로젝트 설치 중 에러 발생

![error](/assets/img/post/202311/2023-11-06-node-js-code-ECONNRESET-01.png)

```bash
Installing packages. This might take a couple of minutes. 
Installing react, react-dom, and react-scripts with cra-template...

npm ERR! code ECONNRESET
npm ERR! syscall read
npm ERR! errno ECONNRESET
npm ERR! network Invalid response body while trying to fetch https://registry.npmjs.org/@babel%2Fpreset-env: read ECONNRESET
npm ERR! network This is a problem related to network connectivity.
npm ERR! network In most cases you are behind a proxy or have bad network settings.
npm ERR! network
npm ERR! network If you are behind a proxy, please make sure that the
npm ERR! network 'proxy' config is set properly.  See: 'npm help config'  
npm ERR! A complete log of this run can be found in: C:\Users\hncis\AppData\Local\npm-cache\_logs\2023-11-03T01_14_36_234Z-debug-0.log  Aborting installation.   
npm install --no-audit --save --save-exact --loglevel error react react-dom react-scripts cra-template has failed.
```

# 원인
이전에 nvm을 통해 node.js의 버전을 최신 버전으로 업그레이드 했는데, 그 결과 node.js는 최신인데 npm이 최신 버전이 아니어서 발생한 에러.

# 해결
npm을 최신버전으로 업데이트

```bash
npm i -g npm@latest 
```

# 결과

```bash
npx create-react-app frontend2 
```

![error](/assets/img/post/202311/2023-11-06-node-js-code-ECONNRESET-02.png)

에러 하나 없이 정상 빌드 된다!
