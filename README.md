# Memory Tape

명조 3장 5막의 장면에서 카세트를 따라 들어가는 비공식 팬 시각 연구. 원작 mizan0515의 대상·장면과 CVA의 카메라·전환·이미지 재생 원리를 사용하는 실제 예시입니다.

[실제 예시](https://mizan0515.github.io/memory-tape/) · [삽입 예제](https://mizan0515.github.io/memory-tape/embed-example.html)

## 실행·수정

전체 저장소를 받은 뒤 Python 3로 정적 서버를 실행합니다.

```sh
python -m http.server 8877 --bind 127.0.0.1
```

http://127.0.0.1:8877/ 에서 엽니다. Three.js0.180.0과 Spark2.4.0은 공식 버전 URL을 쓰므로 인터넷 연결이 필요합니다. 계정·백엔드·별도 빌드는 없습니다.

아래로 스크롤해 접근하고 위로 올려 되감습니다. 실시간3D에서는 드래그 회전·두 손가락 확대를, 이미지 경로에서는 한 손가락 세로 쓸기를 사용합니다. ‘제작 노트 읽기’는 현재 시점에서 본문으로 전환하며 Esc는 본문으로 돌아옵니다. ‘기억 장면 다시 보기’로 재진입합니다. OS 움직임 줄이기에서는 본문으로 시작하고 선택해서 장면을 열 수 있습니다.

`memory.html/css`는 글·레이아웃, `memory-cinematic/`은 타이포그래피·Read/Watch·마스크·글로우·입력 인계, `memory-scene/`은 GPU/이미지 재생과 카메라를 담당합니다. 자산은 `memory-scene/assets.json`, 두 이미지 시퀀스와 `media/memory-tape/<sha256>/<filename>`이 연결됩니다. JSON에는 파일명·크기·SHA256과 프레임별 자세·윤곽이 있습니다.

## Principles

1. 카세트 점을 제거한 Gaussian 공간에 보완한 rigid GLB를 처음부터 유지합니다. 이중 테이프나 원근 불일치를 효과로 감추지 않습니다.
2. 카메라·입력의 상태 소유자는 하나입니다. 같은 진행으로 되감으면 같은 자세가 됩니다. 거리는 로그 보간으로 접근합니다.
3. 실제 투영 윤곽이 마스크와 빛의 기준입니다. 바깥 halo와 내부 cutout을 분리해 표면을 지우지 않습니다.
4. 카메라 도착·문장 표시·입력 반환·장식 종료는 다른 시계입니다. 본문이 보인 뒤 장식 때문에 조작을 붙잡지 않습니다.
5. 소프트웨어 환경은 같은 GPU 캡처를 AVIF/Canvas2D로 재생합니다. 효과는 실제 표시 프레임 metadata를 따릅니다. 압축 캐시는64MiB/2fetch, bitmap은4장/1decoder로 분리합니다.

## 데이터·한계

최신 자산844개: 카세트 점을 제거한 SPZ1개, 보완 GLB1개, 1440p AVIF421개,1080p AVIF421개. 내용 해시 경로를 사용합니다. 루트 scene.spz·cassette.glb도 최신 대응물로 교체했습니다.

접근181장+궤도240장/16초이며 궤도는15개의 고유 이미지/초입니다. RAF60Hz를60fps 소스로 표현하지 않습니다. AVIF Q50은 손실 WebP Q90에서 만든 파생물입니다. 코덱의 quality 숫자는 같은 척도가 아닙니다. 이미지 경로에는 자유 시점 회전이 없습니다.

후면·두께는 제공 모델을 보완한 시각적 근사입니다. 실제 게임 모델이나 새로운 Gaussian 학습 결과가 아닙니다. 명조 시각 자료 © KURO GAMES. 소프트웨어 고지는 THIRD_PARTY_NOTICES.txt, 자산 출처는 memory-scene/SOURCE-ATTRIBUTION.txt를 따릅니다.

## 상세 제작 기록

[웹 제작 포트폴리오](memory.html#reconstruction)는 실제 입력 이미지에서 SHARP Gaussian·초기 TripoSR mesh·후속 제공 모델 보완·카메라·현재 윤곽 마스크·halo·GPU 캡처·Canvas2D 재생·읽기 조작권의 개선까지 보여 줍니다. [공통 원리](docs/CINEMATIC_PRINCIPLES.md), [전체 사례](docs/MEMORY_TAPE_CASE_STUDY.md), [DESIGN.md 작성 템플릿](docs/DESIGN_TEMPLATE.md)을 함께 제공합니다. 초기 생성·후속 정련·이번 채택은 별도 단계이며 기록된 추론을 이번에 재실행한 것으로 소개하지 않습니다.
