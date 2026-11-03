/* =========================================================
   WISEBIRDS AI STUDIO — 사이트 설정 파일
   운영 중 바꿀 일이 있는 값은 전부 이 파일에 모여 있습니다.
   ========================================================= */
window.SITE_CONFIG = {

  /* 1) 모델 데이터 출처
     ─ 비워두면('')  data/models.js 파일을 사용합니다.
     ─ 구글 시트 주소를 넣으면 시트 내용이 우선 적용됩니다.
       (시트 > 파일 > 공유 > 웹에 게시 > 'CSV' 로 게시한 주소)
       예: 'https://docs.google.com/spreadsheets/d/e/XXXX/pub?gid=0&single=true&output=csv'  */
  SHEET_CSV_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQeIctvjE5H00vMwwmVHGol1ve_8cWXFyr5ZIjzmoeehkekgZmII0rYYUwC-jp43wmmIaYhbavr5m75/pub?gid=901689558&single=true&output=csv',

  /* 2) 모델 이미지 기본 폴더 — 시트에 파일명만 적으면 이 경로 + 모델ID 폴더에서 찾습니다.
       예) assets/models/jung-eunchae/01.jpg */
  MODEL_IMAGE_BASE: 'assets/models/',

  /* 3) 메인 영상 — PC(가로 16:9) / 모바일(세로 9:16) 각각 지정 */
  VIDEO: {
    pc:            'assets/video/main_pc.mp4',
    pcPoster:      'assets/video/main_pc.jpg',
    mobile:        'assets/video/main_mobile.mp4',
    mobilePoster:  'assets/video/main_mobile.jpg',
    mobileBreakpoint: 768          // 이 폭(px) 이하에서 모바일 영상 사용
  },

  /* 4) 필터 항목 — 버튼을 추가/삭제하려면 여기만 고치면 됩니다.
       key 는 시트의 열 이름(hair / body / mood)과 같아야 합니다. */
  FILTERS: [
    { key: 'hair', label: 'HAIR', options: ['LONG', 'MEDIUM', 'SHORT'] },
    { key: 'body', label: 'BODY', options: ['SLIM', 'MEDIUM', 'CURVY'] },
    { key: 'mood', label: 'MOOD', options: ['CUTE', 'LIVELY', 'PURE', 'FEMININE', 'SEXY', 'CHIC', 'BOYISH'] }
  ],

  /* 5) SHARE 팝업 기본 링크 — 모델별 SNS가 시트에 없으면 이 주소를 사용합니다. */
  SNS: {
    instagram: 'https://www.instagram.com/',
    facebook:  'https://www.facebook.com/',
    tiktok:    'https://www.tiktok.com/'
  }
};
