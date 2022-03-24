## React Next Shorts Player

### Video URL 생성
- pages/api/index.tsx
  - vg sr 링크를 생성하여 HEAD 로 호출후 Redirection follow를 하지 않음 
  - Location 헤더의 값이 미디어 파일 URL임
  - 해당 URL의 원하는 위치를 지정 (start, end)
- pages/player/index.tsx
  - 유의 사항 (브라우저 제약 사항)
  - Chrome
    - 미디어 파일의 응답이 206 (Partial Content)인 경우 Loop 동작을 하지 않음
  - 브라우저 공통
    - muted 되지 않은 상태에서 오토플레이가 지원되지 않음
  
