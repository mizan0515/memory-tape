# 기억의 안쪽으로

[장면 열기](https://mizan0515.github.io/memory-tape/) · [삽입 예제](https://mizan0515.github.io/memory-tape/embed-example.html)

드래그로 자유롭게 회전하고, 스크롤로 카세트에 접근합니다. 아래로 스크롤하면 인물이 있는 처음 장면으로 돌아갑니다. 입력이 없으면 잔잔하게 회전하며, `테이프 안으로`를 누르면 다음 화면으로 연결할 수 있습니다.

## 웹페이지에 넣기

```html
<iframe
  src="https://mizan0515.github.io/memory-tape/"
  title="기억의 안쪽으로"
  style="width:100%;height:100dvh;border:0"
  allow="fullscreen"
></iframe>
```

호스트 페이지의 CSP는 `frame-src https://mizan0515.github.io`를 허용해야 합니다. WebGL2를 지원하는 브라우저가 필요합니다. `?ui=0`으로 조작 버튼을 숨겨 호스트 페이지의 버튼을 사용할 수 있습니다. 실제 장면 준비 전에는 로딩 표시가 나옵니다.

## 전환 연결

```js
const frame = document.querySelector('iframe');
const origin = 'https://mizan0515.github.io';
frame.contentWindow.postMessage({
  channel: 'memory-tape', version: 1, command: 'play', duration: 4.8
}, origin);
window.addEventListener('message', event => {
  if (event.origin !== origin || event.source !== frame.contentWindow ||
      event.data?.channel !== 'memory-tape' || event.data.version !== 1) return;
  if (event.data.event === 'complete') {
    // iframe을 숨기고 내 페이지의 다음 콘텐츠를 표시합니다.
  }
});
```

명령: `play`(duration 2~12초), `reset`, `ambient`(enabled true/false), `status`.
이벤트: `ready`, `start`, `covered`, `complete`, `cancel`, `error`.
먼저 `ready`를 기다린 뒤 명령을 보내세요. 리스너가 늦게 연결되었다면 `status`로 준비 상태를 다시 받을 수 있습니다. iframe은 부모 페이지를 자동 이동시키지 않습니다. `covered`와 `complete`는 현재 같은 완료 프레임에 발생하므로 둘 중 하나만 연결하세요.

외부 실행 서버나 API 호출 없이 포함된 파일만으로 동작합니다. 이 저장소에는 감상과 삽입에 필요한 배포 파일만 들어 있습니다.

## 권리

명조: 워더링 웨이브 시각 자료의 권리는 KURO GAMES에 있습니다. 원본 장면: [공개 플레이 영상 01:43:43](https://www.youtube.com/watch?v=AnTBwaQK9CU&t=6223s). 비공식 팬 시각 실험이며, 게임 시각 자료에 대한 상업 이용권이나 포괄적 재배포권을 부여하지 않습니다. 기술적 삽입 가능성과 원작 자료의 이용 권한은 별개입니다. 포함된 소프트웨어의 고지는 [THIRD_PARTY_NOTICES.txt](THIRD_PARTY_NOTICES.txt)에 있습니다.
