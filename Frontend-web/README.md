<h2 align="center">  🥔 멋쟁이 감자 - 코딩일기 (CodingDiary) </h2>

<h3 align="center">  📖 프로젝트 소개 <br/> </h3>
<h4 align="center"> 감자 이모지로 하루를 기록하는 개발자 일기장 🌱 </h4>

<p align="center">
  <i>"일상의 작지만 소중한 기록이 쌓여, 감자처럼 든든한 성장의 밑거름이 됩니다.
  <br>감정은 순간이지만, 감자는 영원합니다! 🥔"</i>
</p>

**멋쟁이 감자**는 하루의 개발 경험과 감정을 감자 이모지로 기록하고 공유할 수 있는 감성 기반 기록 서비스입니다. 코딩 여정에서 느낀 즐거움, 좌절, 성취감을 기록하고 돌아보며 자신만의 성장 스토리를 만들어 보세요. 소셜 로그인부터 감정 기록, 캘린더 뷰, 친구 기능까지 - 나만의 개발 성장기를 감자로 저장하고 공유할 수 있습니다.

## 🚀 주요 기능

### ✅ 간편한 소셜 로그인
- **다양한 플랫폼 지원**: Kakao, Naver, Google 계정으로 빠르게 시작하세요.
- **편리한 계정 관리**: 별도의 회원가입 절차 없이 바로 감자 여정을 시작하세요.

### 📝 감정과 함께 쓰는 마크다운 일기
- **풍부한 표현력**: 마크다운 문법을 지원하여 코드 블록, 링크 등 다양한 형식으로 일기 작성
- **감자 이모지 선택**: 28가지 감자 이모지로 그날의 감정을 생생하게 표현
- **날짜별 자동 정리**: 작성한 일기가 자동으로 캘린더에 기록되어 한눈에 확인 가능

### 🗓️ 감자 캘린더
- **감성 시각화**: 내가 선택한 감자 이모지가 달력에 표시되어 감정 흐름을 한눈에 파악
- **날짜별 필터링**: 특정 날짜를 선택하여 해당 일자의 일기만 모아보기
- **다크 모드 지원**: 눈의 피로를 줄이는 다크 모드로 밤에도 편안하게 기록

### 👫 친구와 함께하는 감자 여정
- **쉬운 친구 추가**: QR 코드 스캔이나 ID 검색으로 간편하게 친구 추가
- **감자 캘린더 공유**: 친구의 감자 캘린더를 확인하고 서로의 성장을 응원
- **소통의 장**: 일기별 좋아요와 댓글로 서로에게 힘이 되는 피드백 주고받기

### 📊 감자 통계로 보는 나의 성장
- **감정 분석**: 월별 사용한 감자 이모지 분포를 파이 차트로 확인
- **기록 패턴**: 월별 일기 작성 횟수를 그래프로 시각화
- **성장 트래킹**: 시간에 따른 감정 변화 추이를 분석하여 자기 성찰의 기회 제공

### 🔔 스마트 알림 시스템
- **실시간 알림**: 친구 요청, 댓글, 좋아요 등 중요한 활동 알림
- **알림 관리**: 읽음/안읽음 표시로 효율적인 알림 관리

## 기술 스택 (Tech Stack)

### 프론트엔드
- **언어 및 프레임워크**: React.js, JavaScript (ES6+)
- **상태 관리**: Zustand (스토어 관리)
- **라우팅**: React Router DOM
- **스타일링**: Tailwind CSS
- **HTTP 클라이언트**: Axios
- **UI 컴포넌트**:
  - Lucide React (아이콘)
  - React Icons
  - Toast UI Editor (텍스트 에디터)
  - Recharts (차트 라이브러리)
- **기타 라이브러리**:
  - react-helmet-async (메타 태그 관리)
  - ColorThief (이미지 색상 추출)

### 백엔드 연동
- **인증**: OAuth 2.0 (카카오, 네이버, 구글)
- **데이터 페치**: RESTful API
- **이미지 관리**: CloudFront, S3 연동

### 개발 도구
- **번들러**: Vite
- **형상 관리**: Git
- **코드 품질 관리**: ESLint, Prettier
- **환경 변수 관리**: dotenv

## 배포 링크
[(https://fancypotato.netlify.app/)]

## 팀 소개
- 엄세욱: 프론트엔드 개발 팀장 
- 김은지: 프론트엔드 개발, UI/UX 디자인
- 정봉석: 프론트엔드 개발
- 홍승우: 백엔드 개발 팀장
- 배현우: 백엔드 개발
- 노지민: 백엔드 개발


## 개발 규칙 (Development Guidelines)

### 1. 코딩 컨벤션 (Coding Convention)
- **명명 규칙**: 
  - 컴포넌트: PascalCase (예: `NavigationBar.jsx`)
  - 함수, 변수: camelCase (예: `handleSubmit`, `isLoading`)
  - 상수: UPPER_SNAKE_CASE (예: `BACKEND_URL`)
- **폴더 구조**:
  - `/src`: 소스 코드 최상위 폴더
  - `/src/components`: 재사용 가능한 UI 컴포넌트
  - `/src/pages`: 페이지 컴포넌트
  - `/src/hooks`: 커스텀 훅
  - `/src/store`: Zustand 스토어
  - `/src/service`: API 서비스
  - `/src/utils`: 유틸리티 함수
  - `/src/constants`: 상수 정의
  - `/src/assets`: 이미지, 아이콘 등 정적 리소스
  - `/src/styles`: 글로벌 스타일

### 2. 커밋 규칙 (Commit Convention)

#### 2.1 커밋 메시지 구조
```
타입(스코프): 제목

본문

푸터
```

#### 2.2 커밋 타입
- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅, 세미콜론 누락, 코드 변경이 없는 경우
- `refactor`: 코드 리팩토링
- `test`: 테스트 코드 추가 또는 수정
- `chore`: 빌드 업무 수정, 패키지 매니저 설정 등
- `design`: UI/UX 디자인 변경
- `comment`: 필요한 주석 추가 및 변경
- `rename`: 파일/폴더 이름 변경
- `remove`: 파일 삭제

#### 2.3 커밋 예시
```
feat(diary): 감자 이모지 선택 기능 추가

- 감자 이모지 8종 추가
- 이모지 선택 UI 구현
- 선택한 이모지 저장 기능 구현

Closes #12
```

#### 2.4 커밋 규칙
- 제목은 50자 이내로 작성
- 본문은 선택사항이며, 제목과 본문 사이에 빈 줄 추가
- 제목 첫 글자는 대문자로 시작하지 않음
- 제목 끝에 마침표(.) 사용하지 않음
- 현재 시제를 사용하여 작성 (Fixed → Fix, Added → Add)
- 하나의 커밋에는 하나의 논리적 변경사항만 포함

### 3. 브랜치 규칙 (Branch Strategy)

#### 3.1 브랜치 구조
- `main`: 제품 출시 브랜치
- `develop`: 개발 브랜치, 다음 릴리즈를 위한 코드가 통합되는 브랜치
- `feature/*`: 기능 개발 브랜치
- `bugfix/*`: 버그 수정 브랜치
- `hotfix/*`: 긴급 버그 수정 브랜치 (프로덕션 환경)
- `release/*`: 릴리즈 준비 브랜치

#### 3.2 브랜치 네이밍 규칙
- `feature/[이슈번호]-[기능명]`: 예) feature/12-emoji-selection
- `bugfix/[이슈번호]-[버그내용]`: 예) bugfix/34-calendar-display-error
- `hotfix/[이슈번호]-[버그내용]`: 예) hotfix/56-login-security-issue
- `release/[버전]`: 예) release/v1.0.1

#### 3.3 브랜치 사용 규칙
1. 새 기능 개발 시 `develop` 브랜치에서 `feature/*` 브랜치 생성
2. 기능 개발 완료 후 `develop` 브랜치로 PR 생성
3. 코드 리뷰 후 `develop`에 병합
4. 릴리즈 준비가 완료되면 `release/*` 브랜치 생성
5. 테스트 완료 후 `main`과 `develop`에 병합
6. 프로덕션 환경 버그는 `main`에서 `hotfix/*` 브랜치 생성 후 수정, `main`과 `develop`에 병합

### 4. PR(Pull Request) 규칙

#### 4.1 PR 템플릿
```markdown
## 📝 관련 이슈
- closes #이슈번호

## 🔍 변경 사항
<!-- 변경사항 요약 -->

## 📸 스크린샷
<!-- 시각적 변화가 있는 경우 스크린샷 첨부 -->

## 🔍 테스트 체크리스트
- [ ] 테스트1
- [ ] 테스트2

## 📚 참고 자료
<!-- 참고한 자료가 있다면 여기에 추가 -->
```

#### 4.2 PR 규칙
- PR 제목은 `[타입] 제목` 형식을 따름 (예: `[Feat] 감자 이모지 선택 기능 추가`)
- 반드시 이슈와 연결하여 생성
- 리뷰어를 지정하고 코드 리뷰 후 병합
- PR은 가능한 작게 유지 (하나의 PR에 하나의 기능만 포함)
- 모든 CI 테스트가 통과해야 병합 가능

### 5. Issue 관리 규칙

#### 5.1 이슈 템플릿
```markdown
## 🔍 이슈 설명
<!-- 이슈에 대한 설명을 작성해주세요. -->

## 📝 할 일
- [ ] 작업1
- [ ] 작업2
- [ ] 작업3

## 📚 참고 자료


## 🧩 관련 이슈
<!-- 관련된 이슈가 있다면 여기에 추가해주세요. -->
```

#### 5.2 이슈 라벨
- `feature`: 기능 개발
- `bugfix`: 버그 수정
- `enhancement`: 기존 기능 개선
- `documentation`: 문서 작업
- `design`: UI/UX 디자인 작업
- `test`: 테스트 관련
- `refactor`: 리팩토링
- `high-priority`: 높은 우선순위
- `low-priority`: 낮은 우선순위

#### 5.3 이슈 규칙
- 하나의 이슈는 하나의 기능 또는 버그에 대해 작성
- 이슈 제목은 명확하고 간결하게 작성
- 적절한 라벨을 사용하여 이슈 분류
- 담당자, 마일스톤을 지정하여 트래킹 용이하게 함

### 6. Merge 규칙

#### 6.1 병합 조건
- 최소 1명 이상의 승인(Approve)을 받아야 함
- 모든 CI 테스트가 통과해야 함
- 모든 코드 리뷰 의견이 해결되어야 함
- 코드 품질 체크(정적 분석 도구)를 통과해야 함

#### 6.2 병합 방식
- `develop` 브랜치 병합: `Squash and merge` 방식 사용 (여러 커밋을 하나로 압축)
- `main` 브랜치 병합: `Merge commit` 방식 사용 (이력 보존)
- 브랜치 이름이 명확하도록 Squash 커밋 메시지 작성

#### 6.3 병합 후 정리
- 병합 완료된 브랜치는 삭제
- 병합 시 이슈 자동 종료되도록 키워드 사용 (closes, fixes, resolves 등)
- 병합 후 배포가 필요한 경우 배포 담당자에게 알림

### 7. 코드 리뷰 규칙

#### 7.1 리뷰 시점
- PR 생성 후 24시간 이내에 첫 리뷰 진행
- 리뷰 요청 시 최대한 빠르게 응답

#### 7.2 리뷰 방식
- 긍정적인 피드백과 건설적인 비판 제공
- 코드의 문제점뿐만 아니라 개선 방안도 함께 제시
- 명확하지 않은 부분은 질문 형태로 작성

#### 7.3 리뷰 체크리스트
- 코드가 요구사항을 충족하는가?
- 코드가 가독성이 좋고 유지보수하기 쉬운가?
- 중복 코드가 없고 효율적인가?
- 테스트는 충분한가?
- 명명 규칙과 코딩 스타일을 준수하는가?
- 보안 취약점은 없는가?

### 8. 개발 환경 설정

#### 8.1 필수 도구
- Git hooks 설정 (pre-commit, pre-push)
- ESLint 및 Prettier 설정
- Django 관련 Linter 설정
- 코드 품질 검사 도구 (SonarQube 등)

#### 8.2 환경 설정 파일
- `.editorconfig`: 에디터 설정 통일
- `.eslintrc.js`: ESLint 설정
- `.prettierrc`: Prettier 설정
- `.gitignore`: Git 무시 파일 설정

#### 8.3 개발 환경 통일
모든 팀원은 동일한 개발 환경을 위해 프로젝트 루트의 설정 파일을 사용하고, 필요한
라이브러리 및 도구를 설치해야 합니다.

## 포함 문서

### 1. [사용자 요구사항 정의서](https://www.notion.so/1f9caf5650aa80bd96dcc8d443129543?pvs=4)

### 2. [화면 정의서](https://www.figma.com/design/P2UJYNcY9nlpEPGqF5oKOF/Untitled1?node-id=225-21539&t=ukzA1D7kOnQm6n8k-1)

### 3. [플로우차트](https://www.figma.com/design/P2UJYNcY9nlpEPGqF5oKOF/Untitled1?node-id=225-21539&t=ukzA1D7kOnQm6n8k-1)

### 4. [API 명세서](https://docs.google.com/spreadsheets/d/1TPVanhpBEOxsP9YJ_7vGjBw8hk6eE8Ff28uk38PpqBk/edit?gid=0#gid=0)

### 5. [테이블 명세서](https://officeonline.hancomdocs.com/webhwp/?mode=HWP_EDITOR&docId=eFx2cZvRiGqJEXAVwUqGwWt8x3DNkXoW&lang=ko_KR)

### 6. [ERD](https://www.erdcloud.com/d/gAKrEjuk6ECJdp2RL)
