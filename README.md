# MTZ 감정 기록 시트 (Momentz)

5단계 감정 정화 프로세스로 감정을 기록하고 돌아보는 감정 일기 웹앱입니다.

## 주요 화면

- **홈** — 1초 퀵 체크인, 감정 인사이트(흐름 차트·자주 쓴 어휘·5단계 완료 효과 분석), 5단계 가이드 아코디언
- **감정 기록** — 사건 기록 → 감정 적기 → 감정 수용 → 왜? 질문 → 대응 매뉴얼, 5단계 스텝퍼 위저드
- **캘린더** — 월별 기록 현황, 날짜별 상세 보기, 이번 달 요약 통계

기록은 브라우저의 `localStorage`에 저장됩니다.

## 개발

```bash
npm install
npm run dev      # 개발 서버
npm run build    # 타입체크 + 프로덕션 빌드
npm run lint      # oxlint
```

## 스택

React + TypeScript + Vite, React Router.
