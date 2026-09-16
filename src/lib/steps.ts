export interface StepDef {
  num: string;
  short: string;
  title: string;
  desc: string;
  fieldLabel: string;
  placeholder: string;
  tip: string;
}

export const STEPS: StepDef[] = [
  {
    num: "1",
    short: "사건 기록",
    title: "사건 기록",
    desc: "언제, 어디서, 누구와, 어떻게 일어난 일인지 객관적으로 서술하기",
    fieldLabel: "무슨 일이 있었나요?",
    placeholder: "예: 오늘 오후 3시, 팀 회의에서…",
    tip: "해석을 빼고 사실만 적어보세요. 시간, 장소, 사람, 순서.",
  },
  {
    num: "2",
    short: "감정 적기",
    title: "내 감정 솔직하게 적어보기",
    desc: "다양한 감정 어휘를 활용해 마음속 감정을 억누르지 않고 세밀하게 표현하기",
    fieldLabel: "어떤 감정이 들었나요?",
    placeholder: "답답하고, 조금 억울했고…",
    tip: "'좋다 / 싫다'로 끝내지 말고 어휘를 3개 이상 써보세요.",
  },
  {
    num: "3",
    short: "감정 수용",
    title: "감정 인정하고 다독여주기",
    desc: "판단이나 비판 없이 전적으로 '네 말이 맞아, 그럴 수 있어'라며 수용해 주기",
    fieldLabel: "나에게 해주고 싶은 말",
    placeholder: "그럴 수 있어. 그 상황이면 누구나…",
    tip: "감정이 북받쳐오르면 울어도 괜찮습니다. 평가는 잠시 접어두세요.",
  },
  {
    num: "4",
    short: "왜? 질문",
    title: "왜? 라고 질문 던져보기",
    desc: "이 감정이 폭발하거나 찾아온 진짜 근본적인 이유 탐색하기",
    fieldLabel: "왜 그런 감정이 들었을까요?",
    placeholder: "왜 하필 그 말에 반응했을까? 왜…",
    tip: "'왜'를 최소 세 번 이어 물어보면 더 깊은 이유가 나옵니다.",
  },
  {
    num: "5",
    short: "대응 매뉴얼",
    title: "스스로 답하며 대응 매뉴얼 만들기",
    desc: "관점을 전환해보고 다음번에 비슷한 상황이 왔을 때의 나만의 행동 가이드 세우기",
    fieldLabel: "다음엔 이렇게 해보기",
    placeholder: "비슷한 상황이 오면 먼저 …",
    tip: "짧고 실행 가능한 문장으로. 조건과 행동을 함께 적으세요.",
  },
];

export const WORDS = ["답답함", "불안", "억울함", "평온", "감사", "뿌듯함", "서운함", "설렘"];

export const CHECKINS: { label: string; emoji: string }[] = [
  { label: "최고", emoji: "😊" },
  { label: "평범", emoji: "😐" },
  { label: "우울", emoji: "😢" },
  { label: "화남", emoji: "😡" },
  { label: "평온", emoji: "🌿" },
];
