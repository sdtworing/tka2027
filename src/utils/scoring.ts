import {
  DomainStat,
  EvaluationResult,
  ExamSessionState,
  Question,
  QuestionEvaluation,
  StudentAnswer,
  StudentIdentity,
  SubjectId,
} from '../types/exam';

export const EXAM_DURATION_SECONDS = 75 * 60; // 75 menit (01:15:00)

const PACKETS_REGISTRY_KEY = 'cat_tka_packets_registry_v1';
const LAST_IDENTITY_KEY = 'cat_tka_last_identity_v1';

export function getStorageKey(subject: SubjectId, packetNumber: number): string {
  return subject === 'matematika'
    ? `cat_tka_matematika_sd_p${packetNumber}`
    : `cat_tka_bindo_sd_p${packetNumber}`;
}

export const SUBJECT_META: Record<
  SubjectId,
  {
    title: string;
    shortTitle: string;
    subtitle: string;
    domains: string[];
  }
> = {
  matematika: {
    title: 'Simulasi CAT TKA Matematika SD/MI',
    shortTitle: 'Matematika SD/MI',
    subtitle: 'Bilangan · Geometri dan Pengukuran · Data dan Ketidakpastian',
    domains: ['Bilangan', 'Geometri dan Pengukuran', 'Data dan Ketidakpastian'],
  },
  bindo: {
    title: 'Simulasi CAT TKA Bahasa Indonesia SD/MI',
    shortTitle: 'Bahasa Indonesia SD/MI',
    subtitle: 'Pemahaman Tekstual · Pemahaman Inferensial · Evaluasi dan Apresiasi',
    domains: ['Pemahaman Tekstual', 'Pemahaman Inferensial', 'Evaluasi dan Apresiasi'],
  },
};

export function isQuestionAnswered(question: Question, answer: StudentAnswer | undefined): boolean {
  if (answer === undefined || answer === null) return false;
  if (question.type === 'pg') {
    return typeof answer === 'string' && answer.length > 0;
  }
  if (question.type === 'mcma') {
    return Array.isArray(answer) && answer.length > 0;
  }
  if (question.type === 'kategori') {
    if (typeof answer !== 'object' || Array.isArray(answer)) return false;
    const totalStatements = question.statements?.length ?? 0;
    return totalStatements > 0 && Object.keys(answer).length === totalStatements;
  }
  return false;
}

export function isQuestionCorrect(question: Question, answer: StudentAnswer | undefined): boolean {
  if (!isQuestionAnswered(question, answer)) return false;

  if (question.type === 'pg') {
    return answer === question.correctOption;
  }

  if (question.type === 'mcma') {
    if (!Array.isArray(answer) || !question.correctOptions) return false;
    const studentSorted = [...answer].sort();
    const keySorted = [...question.correctOptions].sort();
    if (studentSorted.length !== keySorted.length) return false;
    return studentSorted.every((val, idx) => val === keySorted[idx]);
  }

  if (question.type === 'kategori') {
    if (typeof answer !== 'object' || Array.isArray(answer) || !question.statements) return false;
    return question.statements.every((st) => answer[st.id] === st.correctValue);
  }

  return false;
}

export function evaluateExam(
  questions: Question[],
  session: ExamSessionState,
  subject: SubjectId
): EvaluationResult {
  let correctCount = 0;
  let unansweredCount = 0;

  const evaluations: QuestionEvaluation[] = questions.map((question) => {
    const studentAnswer = session.answers[question.number];
    const answered = isQuestionAnswered(question, studentAnswer);
    const correct = answered ? isQuestionCorrect(question, studentAnswer) : false;

    if (!answered) {
      unansweredCount += 1;
    } else if (correct) {
      correctCount += 1;
    }

    return {
      question,
      studentAnswer,
      isAnswered: answered,
      isCorrect: correct,
    };
  });

  const wrongCount = questions.length - correctCount;
  const score = Math.round((correctCount / questions.length) * 100);
  const durationUsedSeconds = Math.max(0, EXAM_DURATION_SECONDS - session.remainingSeconds);

  const domains = SUBJECT_META[subject].domains;
  const domainStats: DomainStat[] = domains.map((domain) => {
    const items = evaluations.filter((ev) => ev.question.domain === domain);
    const domainCorrect = items.filter((ev) => ev.isCorrect).length;
    const total = items.length;
    const percentage = total > 0 ? Math.round((domainCorrect / total) * 100) : 0;
    return {
      domain,
      total,
      correct: domainCorrect,
      percentage,
    };
  });

  return {
    score,
    correctCount,
    wrongCount,
    unansweredCount,
    totalQuestions: questions.length,
    durationUsedSeconds,
    domainStats,
    evaluations,
  };
}

export function formatTimeHMS(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
}

export function formatDurationText(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  if (m === 0) return `${s} detik`;
  return `${m} menit ${s} detik`;
}

export function loadSavedSession(subject: SubjectId, packetNumber: number): ExamSessionState | null {
  try {
    const raw = localStorage.getItem(getStorageKey(subject, packetNumber));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ExamSessionState;
    if (!parsed || parsed.subject !== subject || !parsed.identity?.name) return null;
    return {
      ...parsed,
      packetNumber: parsed.packetNumber ?? packetNumber,
    };
  } catch {
    return null;
  }
}

export function saveSession(session: ExamSessionState): void {
  try {
    localStorage.setItem(
      getStorageKey(session.subject, session.packetNumber),
      JSON.stringify(session)
    );
  } catch {
    // Ignore quota errors
  }
}

export function loadPacketNumbers(subject: SubjectId): number[] {
  try {
    const raw = localStorage.getItem(PACKETS_REGISTRY_KEY);
    if (!raw) return [1];
    const parsed = JSON.parse(raw) as Partial<Record<SubjectId, number[]>>;
    const list = parsed[subject];
    if (!Array.isArray(list) || list.length === 0) return [1];
    const uniqueSorted = Array.from(new Set([1, ...list])).sort((a, b) => a - b);
    return uniqueSorted;
  } catch {
    return [1];
  }
}

export function savePacketNumbers(subject: SubjectId, packets: number[]): number[] {
  const uniqueSorted = Array.from(new Set([1, ...packets])).sort((a, b) => a - b);
  try {
    const raw = localStorage.getItem(PACKETS_REGISTRY_KEY);
    const parsed: Partial<Record<SubjectId, number[]>> = raw ? JSON.parse(raw) : {};
    parsed[subject] = uniqueSorted;
    localStorage.setItem(PACKETS_REGISTRY_KEY, JSON.stringify(parsed));
  } catch {
    // Ignore storage errors
  }
  return uniqueSorted;
}

export function loadLastIdentity(): StudentIdentity | null {
  try {
    const raw = localStorage.getItem(LAST_IDENTITY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StudentIdentity;
    if (!parsed?.name) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveLastIdentity(identity: StudentIdentity): void {
  try {
    localStorage.setItem(LAST_IDENTITY_KEY, JSON.stringify(identity));
  } catch {
    // Ignore storage errors
  }
}
