# Link Storage

스마트 링크 보관함 애플리케이션으로, 백엔드는 Spring Boot, 프론트엔드는 React(Vite)로 구성되어 있습니다. URL만 입력하면 AI가 자동으로 제목과 카테고리를 추천하여 저장해 줍니다.

## Backend

* Java 17 / Spring Boot 3
* 주요 Endpoint
  * `POST /api/links/ai-save` – URL을 전달하면 페이지를 크롤링하여 제목/썸네일을 추출하고, LLM을 이용해 카테고리를 추천합니다.
  * `GET /api/links?categoryId=` – 저장된 링크를 전체 또는 특정 카테고리로 필터링하여 조회합니다.
  * `PATCH /api/links/{id}/memo` – 개별 링크의 메모만 수정합니다.
  * `PATCH /api/links/{id}/category` – 이미 저장된 링크의 카테고리를 변경합니다.
  * `DELETE /api/links/{id}` – 링크를 삭제합니다.
  * `GET /api/categories` – 사용자 정의 카테고리 목록을 조회합니다.
  * `POST /api/categories` / `PUT /api/categories/{id}` / `DELETE /api/categories/{id}` – 카테고리를 생성·수정·삭제합니다. 링크가 연결된 카테고리는 삭제할 수 없습니다.
* H2 인메모리 데이터베이스를 사용하며, `application.yml`에서 LLM API 연동 정보를 설정할 수 있습니다. LLM 설정이 비어 있으면 간단한 휴리스틱으로 카테고리를 분류합니다.
* 초기 실행 시 `Study`, `News`, `YouTube` 카테고리가 자동으로 생성되며, 필요 시 자유롭게 수정하거나 새로 만들 수 있습니다.

## Frontend

* React 18 + Vite 기반 SPA
* URL 입력창과 "AI로 저장하기" 버튼 제공
* 저장 완료 시 필터 조건에 맞춰 카드형 링크 목록에 반영
* 썸네일, 제목, 카테고리 뱃지와 드롭다운, 메모 인라인 수정, 삭제 기능 제공
* 사용자 정의 카테고리 생성/수정/삭제와 카테고리별 링크 필터링 UI 제공
* 개발 서버(`npm run dev`)는 `/api` 요청을 `http://localhost:8080`으로 프록시합니다.

## 실행 방법

### Backend
```bash
cd backend
mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

백엔드와 프론트엔드를 동시에 실행하면 브라우저에서 `http://localhost:5173`으로 접속하여 애플리케이션을 확인할 수 있습니다.
