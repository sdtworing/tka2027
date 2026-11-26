import { useCallback, useEffect, useMemo, useState } from 'react';
import { getBindoDataForPacket } from './data/bindoPacketsData';
import { getMathQuestionsForPacket } from './data/mathPacketGenerator';
import { ExamScreen } from './components/ExamScreen';
import { LoginScreen } from './components/LoginScreen';
import { ResultScreen } from './components/ResultScreen';
import {
  ExamSessionState,
  Passage,
  Question,
  StudentAnswer,
  StudentIdentity,
  SubjectId,
} from './types/exam';
import {
  evaluateExam,
  EXAM_DURATION_SECONDS,
  loadLastIdentity,
  loadPacketNumbers,
  loadSavedSession,
  saveLastIdentity,
  savePacketNumbers,
  saveSession,
} from './utils/scoring';

type ScreenView = 'login' | 'exam' | 'result';

export default function App() {
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>('matematika');
  const [packetNumbers, setPacketNumbers] = useState<number[]>(() =>
    loadPacketNumbers('matematika')
  );
  const [selectedPacket, setSelectedPacket] = useState<number>(1);
  const [lastIdentity, setLastIdentity] = useState<StudentIdentity | null>(() =>
    loadLastIdentity()
  );
  const [view, setView] = useState<ScreenView>('login');
  const [activeSession, setActiveSession] = useState<ExamSessionState | null>(null);

  const activeSubject = activeSession?.subject ?? selectedSubject;
  const activePacketNum = activeSession?.packetNumber ?? selectedPacket;

  const { questions, passages } = useMemo<{
    questions: Question[];
    passages: Record<string, Passage>;
  }>(() => {
    if (activeSubject === 'matematika') {
      return {
        questions: getMathQuestionsForPacket(activePacketNum),
        passages: {},
      };
    }
    return getBindoDataForPacket(activePacketNum);
  }, [activeSubject, activePacketNum]);

  const handleSelectSubject = useCallback((subject: SubjectId) => {
    const packets = loadPacketNumbers(subject);
    setSelectedSubject(subject);
    setPacketNumbers(packets);
    setSelectedPacket(packets[0] ?? 1);
  }, []);

  const handleSelectPacket = useCallback((packetNumber: number) => {
    setSelectedPacket(packetNumber);
  }, []);

  const handleGenerateNextPacket = useCallback(() => {
    setPacketNumbers((prev) => {
      const nextNum = Math.max(...prev, 1) + 1;
      const updated = savePacketNumbers(selectedSubject, [...prev, nextNum]);
      setSelectedPacket(nextNum);
      return updated;
    });
  }, [selectedSubject]);

  useEffect(() => {
    if (activeSession) {
      saveSession(activeSession);
    }
  }, [activeSession]);

  const handleStartNew = useCallback(
    (identity: StudentIdentity) => {
      saveLastIdentity(identity);
      setLastIdentity(identity);
      const updatedPackets = savePacketNumbers(selectedSubject, [
        ...packetNumbers,
        selectedPacket,
      ]);
      setPacketNumbers(updatedPackets);

      const fresh: ExamSessionState = {
        subject: selectedSubject,
        packetNumber: selectedPacket,
        identity,
        answers: {},
        doubtful: {},
        currentIndex: 0,
        remainingSeconds: EXAM_DURATION_SECONDS,
        status: 'in_progress',
        startedAt: Date.now(),
      };
      saveSession(fresh);
      setActiveSession(fresh);
      setView('exam');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [selectedSubject, selectedPacket, packetNumbers]
  );

  const handleResumeSaved = useCallback(() => {
    const existing = loadSavedSession(selectedSubject, selectedPacket);
    if (!existing) return;
    if (existing.remainingSeconds <= 0) {
      const submitted: ExamSessionState = {
        ...existing,
        remainingSeconds: 0,
        status: 'submitted',
        submittedAt: Date.now(),
      };
      setActiveSession(submitted);
      setView('result');
      return;
    }
    setActiveSession(existing);
    setView('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedSubject, selectedPacket]);

  const handleViewSavedResult = useCallback(() => {
    const existing = loadSavedSession(selectedSubject, selectedPacket);
    if (!existing) return;
    setActiveSession(existing);
    setView('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedSubject, selectedPacket]);

  const handleUpdateAnswer = useCallback((questionNumber: number, answer: StudentAnswer) => {
    setActiveSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        answers: {
          ...prev.answers,
          [questionNumber]: answer,
        },
      };
    });
  }, []);

  const handleToggleDoubtful = useCallback((questionNumber: number) => {
    setActiveSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        doubtful: {
          ...prev.doubtful,
          [questionNumber]: !prev.doubtful[questionNumber],
        },
      };
    });
  }, []);

  const handleChangeIndex = useCallback((newIndex: number) => {
    setActiveSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        currentIndex: newIndex,
      };
    });
  }, []);

  const handleSubmitExam = useCallback(() => {
    setActiveSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        status: 'submitted',
        submittedAt: Date.now(),
      };
    });
    setView('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleTickTimer = useCallback(() => {
    setActiveSession((prev) => {
      if (!prev || prev.status !== 'in_progress') return prev;
      const nextSeconds = prev.remainingSeconds - 1;
      if (nextSeconds <= 0) {
        return {
          ...prev,
          remainingSeconds: 0,
          status: 'submitted',
          submittedAt: Date.now(),
        };
      }
      return {
        ...prev,
        remainingSeconds: nextSeconds,
      };
    });
  }, []);

  useEffect(() => {
    if (view === 'exam' && activeSession?.status === 'submitted') {
      setView('result');
    }
  }, [view, activeSession?.status]);

  const handleBackHome = useCallback(() => {
    const subject = activeSession?.subject ?? selectedSubject;
    setSelectedSubject(subject);
    setPacketNumbers(loadPacketNumbers(subject));
    setSelectedPacket(activeSession?.packetNumber ?? selectedPacket);
    setActiveSession(null);
    setView('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeSession, selectedSubject, selectedPacket]);

  const handleStartNextPacketFromResult = useCallback(
    (nextPacketNum: number) => {
      const subject = activeSession?.subject ?? selectedSubject;
      const identity = activeSession?.identity ?? lastIdentity;
      const updatedPackets = savePacketNumbers(subject, [
        ...loadPacketNumbers(subject),
        nextPacketNum,
      ]);
      setSelectedSubject(subject);
      setPacketNumbers(updatedPackets);
      setSelectedPacket(nextPacketNum);

      // If next packet already has an in-progress or submitted session, let user resume/review or start fresh
      const existing = loadSavedSession(subject, nextPacketNum);
      if (existing) {
        setActiveSession(existing);
        setView(existing.status === 'submitted' ? 'result' : 'exam');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      if (identity) {
        const fresh: ExamSessionState = {
          subject,
          packetNumber: nextPacketNum,
          identity,
          answers: {},
          doubtful: {},
          currentIndex: 0,
          remainingSeconds: EXAM_DURATION_SECONDS,
          status: 'in_progress',
          startedAt: Date.now(),
        };
        saveSession(fresh);
        setActiveSession(fresh);
        setView('exam');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      setActiveSession(null);
      setView('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [activeSession, selectedSubject, lastIdentity]
  );

  const evaluationResult = useMemo(() => {
    if (!activeSession || view !== 'result') return null;
    return evaluateExam(questions, activeSession, activeSession.subject);
  }, [activeSession, view, questions]);

  if (view === 'exam' && activeSession) {
    return (
      <ExamScreen
        session={activeSession}
        questions={questions}
        passages={passages}
        onUpdateAnswer={handleUpdateAnswer}
        onToggleDoubtful={handleToggleDoubtful}
        onChangeIndex={handleChangeIndex}
        onTickTimer={handleTickTimer}
        onSubmitExam={handleSubmitExam}
      />
    );
  }

  if (view === 'result' && activeSession && evaluationResult) {
    return (
      <ResultScreen
        subject={activeSession.subject}
        packetNumber={activeSession.packetNumber}
        identity={activeSession.identity}
        result={evaluationResult}
        passages={passages}
        onBackHome={handleBackHome}
        onStartNextPacket={handleStartNextPacketFromResult}
      />
    );
  }

  return (
    <LoginScreen
      selectedSubject={selectedSubject}
      selectedPacket={selectedPacket}
      packetNumbers={packetNumbers}
      lastIdentity={lastIdentity}
      onSelectSubject={handleSelectSubject}
      onSelectPacket={handleSelectPacket}
      onGenerateNextPacket={handleGenerateNextPacket}
      onStartNew={handleStartNew}
      onResumeSaved={handleResumeSaved}
      onViewSavedResult={handleViewSavedResult}
    />
  );
}
