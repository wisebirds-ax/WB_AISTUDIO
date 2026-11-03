# WISEBIRDS AI STUDIO — 운영 가이드

## 폴더 구조

```
wisebirds/
├─ index.html            01 메인(영상) + 02 모델 리스트
├─ model.html            03 모델 상세 (model.html?id=모델ID)
├─ makeup.html           MAKEUP (준비 중 페이지 — <main> 안만 채우면 됨)
├─ contact.html          CONTACT (준비 중 페이지 — <main> 안만 채우면 됨)
├─ css/style.css         전체 스타일
├─ js/config.js          ★ 운영 설정 (구글 시트 주소, 필터 항목, 영상 경로, SNS)
├─ js/data-loader.js     데이터 불러오기 (수정 불필요)
├─ js/common.js          헤더·TOP 버튼 (수정 불필요)
├─ js/main.js            메인/리스트 동작 (수정 불필요)
├─ js/model.js           상세 동작 (수정 불필요)
├─ data/models.js        ★ 모델 목록 (구글 시트를 쓰지 않을 때)
├─ data/WISEBIRDS_models.xlsx       ★ 구글 시트로 가져올 관리 파일 (드롭다운·작성 안내 포함)
├─ data/models_sheet_template.csv   같은 내용의 CSV 버전
├─ fonts/                A2Z(에이투지체) woff2 — OFL 라이선스, LICENSE.txt 참고
└─ assets/
   ├─ video/             main_pc.mp4 / main_mobile.mp4 (+ 같은 이름 .jpg)
   └─ models/
      └─ jung-eunchae/   모델ID 폴더 하나 = 모델 한 명
         ├─ thumb.jpg    리스트용 썸네일
         ├─ 01.jpg       상세 이미지 (순서대로)
         ├─ 02.jpg
         └─ ...
```

## 모델 데이터 항목

| 열 이름 | 예시 | 설명 |
|---|---|---|
| id | jung-eunchae | 영문 소문자·숫자·하이픈. 이미지 폴더명이자 상세 주소. **한 번 정하면 바꾸지 않기** |
| show | Y | N 으로 바꾸면 삭제하지 않고 숨김 |
| name_en | JUNG EUNCHAE | 리스트·상세 제목. 첫 띄어쓰기에서 두 줄로 나뉨 |
| name_ko | 정은채 | 상세 하단 정보 |
| age / height | 20 / 165 | 상세 하단 정보 (비우면 해당 항목 숨김) |
| hair_color / eyes | BLACK / BLUEGRAY | 상세 하단 정보 |
| hair | LONG | 필터용: LONG · MEDIUM · SHORT |
| body | SLIM | 필터용: SLIM · MEDIUM · CURVY |
| mood | CUTE, CHIC | 필터용, 여러 개는 쉼표로 |
| thumb | thumb.jpg | 리스트 썸네일 파일명 (비우면 thumb.jpg) |
| images | 01.jpg, 02.jpg, 03.jpg | 상세 이미지, 적은 순서대로 가로 나열 |
| instagram / facebook / tiktok | https://... | SHARE 팝업 링크 (비우면 config.js 기본값) |

- 리스트 순서 = 시트(또는 models.js)의 위→아래 순서. 새 모델을 맨 위에 넣으면 맨 앞에 나옵니다.
- 이미지에 전체 주소(https://…)를 적으면 외부 이미지도 쓸 수 있습니다.
- 필터 규칙: 같은 줄(예: MOOD) 안에서 여러 개 선택 → 하나라도 맞으면 표시, 다른 줄끼리는 모두 맞아야 표시. 아무것도 선택 안 하면 전체.

## 모델 추가 / 수정 / 삭제

1. `assets/models/새모델ID/` 폴더를 만들고 `thumb.jpg`, `01.jpg`, `02.jpg` … 를 넣습니다.
2. 데이터에 한 줄 추가
   - 구글 시트 사용 시: 시트에 행 추가 → 저장만 하면 끝 (반영까지 최대 5분)
   - models.js 사용 시: 블록 하나 복사해 값 수정 후 업로드
3. 상세 이미지 추가: 폴더에 `04.jpg` 를 올리고 images 칸에 `, 04.jpg` 추가
4. 삭제: show 를 N 으로 (권장) 또는 행 삭제

### 권장 이미지 규격
- thumb.jpg: 924 × 1348px (비율 462:674), JPG 80%, 300KB 이하
- 상세 01.jpg…: 1044 × 1538px (비율 522:769), JPG 80%, 400KB 이하
- 다른 비율도 깨지지 않고 가운데 기준으로 잘려서 표시됩니다.

## 구글 시트 연결 (선택)

1. 구글 드라이브에 `data/WISEBIRDS_models.xlsx` 업로드 → 우클릭 > 연결 앱 > Google 스프레드시트로 열기 → 파일 > Google 스프레드시트로 저장
   (models 탭: 실제 데이터 / 작성 안내 탭: 운영 매뉴얼. HAIR·BODY·show 칸은 목록에서 선택)
2. 파일 > 공유 > **웹에 게시** → 탭은 반드시 **models** 선택, 형식 **쉼표로 구분된 값(.csv)** → 게시
3. 나온 주소를 `js/config.js` 의 `SHEET_CSV_URL` 에 붙여넣기
4. 시트를 못 읽으면 자동으로 `data/models.js` 를 사용합니다 (백업 역할).

이미지는 구글 드라이브보다 사이트 서버(assets 폴더)에 올리는 것을 권장합니다. 드라이브 이미지 링크는 표시가 막히는 경우가 많습니다.

## 필터 항목 바꾸기
`js/config.js` 의 `FILTERS` 에서 단어를 추가/삭제하면 버튼이 바로 바뀝니다. 시트에 쓰는 단어와 철자를 맞춰주세요.

## 나중에 연결할 것
- MAKEUP / CONTACT: `makeup.html`, `contact.html` 의 `<main>` 안을 채우면 됩니다. 메뉴 링크는 이미 연결되어 있습니다.
- BACK 버튼: 리스트에서 들어온 경우 뒤로가기(스크롤 위치·필터 유지), 공유 링크로 바로 들어온 경우 모델 리스트로 이동합니다.
- SHARE 팝업 디자인: `model.html` 의 `#shareModal` 블록과 `style.css` 의 `.modal` 부분만 교체.
- 메인 영상: `assets/video/README.txt` 참고.

## GitHub Pages 배포

### 최초 1회
1. 회사 GitHub 조직에 새 저장소 생성 (예: `wisebirds-studio`)
2. 이 폴더 안의 파일 전체(`.nojekyll` 포함)를 저장소 최상단에 업로드 → Commit
3. 저장소 **Settings > Pages** → Source: `Deploy from a branch`, Branch: `main` / `/ (root)` → Save
4. 1~3분 뒤 `https://조직명.github.io/저장소명/` 주소로 사이트가 열립니다.
   - 비공개(Private) 저장소로 Pages를 쓰려면 조직이 GitHub Team/Enterprise 요금제여야 합니다. 무료 조직이면 저장소를 Public으로 두세요.
5. 회사 도메인 연결 시: Settings > Pages > Custom domain 에 도메인 입력, 도메인 DNS에 CNAME `조직명.github.io` 추가, Enforce HTTPS 체크.

### 운영 중 (개발 도구 없이 웹에서)
- 새 모델 이미지: 저장소에서 `assets/models/` 로 이동 → **Add file > Upload files** → 업로드 창 위 경로에 `새모델ID/` 를 입력해 폴더를 만들고 이미지 업로드 → Commit
- 모델 정보: 구글 시트만 수정 (GitHub 수정 필요 없음)
- 영상 교체: `assets/video/` 에 같은 파일명으로 업로드 → Commit
- 반영 시간: GitHub 업로드 1~3분, 구글 시트 수정 최대 5분. 바로 안 보이면 브라우저 새로고침(Ctrl+Shift+R).
- 영상 파일은 GitHub 제한상 1개당 100MB 미만이어야 합니다 (권장 20MB 이하).

## 확인
- 바로 열어보기: `index.html` 더블클릭 (models.js 사용 시 동작). 구글 시트 연결 후에는 GitHub Pages 주소에서 확인하세요.
