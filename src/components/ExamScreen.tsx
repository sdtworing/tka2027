import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flag,
  Send,
} from 'lucide-react';
import { ExamSessionState, Passage, Question, StudentAnswer } from '../types/exam';
import { formatTimeHMS, isQuestionAnswered, SUBJECT_META } from '../utils/scoring';
import { MathText } from './MathText';
import { MathIllustration } from './MathIllustrations';
import { BindoIllustration } from './BindoIllustrations';

interface ExamScreenProps {
  session: ExamSessionState;
  questions: Question[];
  passages: Record<string, Passage>;
  onUpdateAnswer: (questionNumber: number, answer: StudentAnswer) => void;
  onToggleDoubtful: (questionNumber: number) => void;
  onChangeIndex: (newIndex: number) => void;
  onTickTimer: () => void;
  onSubmitExam: () => void;
}

export const ExamScreen: React.FC<ExamScreenProps> = ({
  session,
  questions,
  passages,
  onUpdateAnswer,
  onToggleDoubtful,
  onChangeIndex,
  onTickTimer,
  onSubmitExam,
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => {
      onTickTimer();
    }, 1000);
    return () => window.clearInterval(id);
  }, [onTickTimer]);

  const currentQuestion = questions[session.currentIndex];
  const meta = SUBJECT_META[session.subject];
  const isBindo = session.subject === 'bindo';
  const passage = currentQuestion.passageId ? passages[currentQuestion.passageId] : undefined;

  const currentAnswer = session.answers[currentQuestion.number];
  const isCurrentDoubtful = Boolean(session.doubtful[currentQuestion.number]);

  const answeredCount = questions.filter((q) =>
    isQuestionAnswered(q, session.answers[q.number])
  ).length;
  const doubtfulCount = questions.filter((q) => Boolean(session.doubtful[q.number])).length;
  const unansweredCount = questions.length - answeredCount;

  const isLowTime = session.remainingSeconds <= 300;

  const typeLabel =
    currentQuestion.type === 'pg'
      ? 'Pilihan Ganda'
      : currentQuestion.type === 'mcma'
      ? 'Pilihan Ganda Kompleks (MCMA)'
      : 'Pilihan Ganda Kompleks (Kategori)';

  const handlePgSelect = (optionId: string) => {
    onUpdateAnswer(currentQuestion.number, optionId);
  };

  const handleMcmaToggle = (optionId: string) => {
    const prev = Array.isArray(currentAnswer) ? currentAnswer : [];
    const exists = prev.includes(optionId);
    const next = exists ? prev.filter((id) => id !== optionId) : [...prev, optionId];
    onUpdateAnswer(currentQuestion.number, next);
  };

  const handleKategoriSelect = (statementId: string, value: number) => {
    const prev =
      currentAnswer && typeof currentAnswer === 'object' && !Array.isArray(currentAnswer)
        ? currentAnswer
        : {};
    onUpdateAnswer(currentQuestion.number, { ...prev, [statementId]: value });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* CAT Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate">
              {meta.title} — Paket {session.packetNumber}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 truncate">
              {session.identity.name} · {session.identity.school}
              {session.identity.participantNo ? ` · No. ${session.identity.participantNo}` : ''}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm sm:text-base font-mono font-bold tabular-nums ${
                isLowTime
                  ? 'bg-rose-50 border-rose-300 text-rose-700'
                  : 'bg-slate-100 border-slate-200 text-slate-900'
              }`}
              aria-live="polite"
            >
              <Clock className="w-4 h-4 shrink-0" />
              <span>{formatTimeHMS(session.remainingSeconds)}</span>
            </div>

            <button
              type="button"
              onClick={() => setShowConfirmModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold transition-colors min-h-[44px] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Selesai Ujian</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Panel: Passage Split-View (Bahasa Indonesia) */}
          {isBindo && passage && (
            <aside className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6.5rem)] lg:overflow-y-auto">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-2">
                <BookOpen className="w-4 h-4 shrink-0" />
                <span>Wacana Bacaan · {passage.genre}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 leading-snug">
                {passage.title}
              </h2>

              {passage.announcementMeta && (
                <div className="mb-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 space-y-1">
                  <div className="font-bold text-slate-900">
                    {passage.announcementMeta.header}
                  </div>
                  <div>Tanggal: {passage.announcementMeta.date}</div>
                  <div>Kepada: {passage.announcementMeta.to}</div>
                </div>
              )}

              <div className="space-y-4 text-[15.5px] sm:text-base text-slate-800 leading-[1.75]">
                {passage.paragraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>

              {passage.isProcedureList && passage.steps && (
                <ol className="mt-4 space-y-3 pl-5 list-decimal text-[15.5px] sm:text-base text-slate-800 leading-[1.75]">
                  {passage.steps.map((step, idx) => (
                    <li key={idx} className="pl-1">
                      {step}
                    </li>
                  ))}
                </ol>
              )}
            </aside>
          )}

          {/* Middle/Main Panel: Active Question */}
          <section
            className={`${
              isBindo ? 'lg:col-span-4' : 'lg:col-span-8'
            } bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 flex flex-col`}
          >
            <div className="border-b border-slate-200 pb-4 mb-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1.5">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tabular-nums">
                  Soal Nomor {currentQuestion.number}
                </h2>
                <span className="text-xs font-medium text-slate-500 tabular-nums">
                  Paket {session.packetNumber} · {currentQuestion.number} dari {questions.length}
                </span>
              </div>
              <div className="text-xs sm:text-sm text-slate-600">
                <span className="font-semibold text-blue-700">{currentQuestion.domain}</span>
                <span aria-hidden="true"> · </span>
                <span>{currentQuestion.subtopic}</span>
                <span aria-hidden="true"> · </span>
                <span className="font-medium text-slate-800">{typeLabel}</span>
              </div>
            </div>

            {currentQuestion.svgId && (
              <div className="mb-5 p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-200">
                {currentQuestion.subject === 'matematika' ? (
                  <MathIllustration id={currentQuestion.svgId} data={currentQuestion.svgData} />
                ) : (
                  <BindoIllustration id={currentQuestion.svgId} data={currentQuestion.svgData} />
                )}
              </div>
            )}

            {currentQuestion.stimulusText && (
              <div className="mb-5 p-4 rounded-xl bg-slate-50 border border-slate-200 text-base text-slate-800 leading-relaxed">
                <MathText text={currentQuestion.stimulusText} />
              </div>
            )}

            {currentQuestion.stimulusTable && (
              <div className="mb-5 overflow-x-auto">
                {currentQuestion.stimulusTable.caption && (
                  <div className="text-sm font-bold text-slate-900 mb-2">
                    {currentQuestion.stimulusTable.caption}
                  </div>
                )}
                <table className="w-full border-collapse border border-slate-300 text-sm sm:text-base tabular-nums">
                  <thead>
                    <tr className="bg-slate-100">
                      {currentQuestion.stimulusTable.headers.map((h, i) => (
                        <th
                          key={i}
                          className="border border-slate-300 px-3 py-2 text-left font-bold text-slate-900"
                        >
                          <MathText text={h} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentQuestion.stimulusTable.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="bg-white">
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className="border border-slate-300 px-3 py-2 text-slate-800"
                          >
                            <MathText text={cell} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="text-base sm:text-[17px] text-slate-900 leading-[1.7] mb-6">
              <MathText text={currentQuestion.prompt} />
            </div>

            {currentQuestion.type === 'pg' && currentQuestion.options && (
              <div className="space-y-3" role="radiogroup" aria-label="Pilihan jawaban">
                {currentQuestion.options.map((opt) => {
                  const selected = currentAnswer === opt.id;
                  return (
                    <label
                      key={opt.id}
                      className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-colors min-h-[52px] ${
                        selected
                          ? 'bg-blue-50 border-blue-600 text-slate-900'
                          : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${currentQuestion.number}`}
                        value={opt.id}
                        checked={selected}
                        onChange={() => handlePgSelect(opt.id)}
                        className="mt-1 h-5 w-5 text-blue-700 border-slate-400 focus:ring-blue-600 shrink-0 cursor-pointer"
                      />
                      <span className="font-bold text-slate-900 shrink-0 mt-0.5">
                        {opt.id}.
                      </span>
                      <span className="text-base leading-relaxed flex-1">
                        <MathText text={opt.text} />
                      </span>
                    </label>
                  );
                })}
              </div>
            )}

            {currentQuestion.type === 'mcma' && currentQuestion.options && (
              <div className="space-y-3">
                <div className="text-xs font-semibold text-blue-800 mb-1">
                  Petunjuk: Centang lebih dari satu jawaban yang benar.
                </div>
                {currentQuestion.options.map((opt) => {
                  const selectedArr = Array.isArray(currentAnswer) ? currentAnswer : [];
                  const checked = selectedArr.includes(opt.id);
                  return (
                    <label
                      key={opt.id}
                      className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-colors min-h-[52px] ${
                        checked
                          ? 'bg-blue-50 border-blue-600 text-slate-900'
                          : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleMcmaToggle(opt.id)}
                        className="mt-1 h-5 w-5 rounded text-blue-700 border-slate-400 focus:ring-blue-600 shrink-0 cursor-pointer"
                      />
                      <span className="font-bold text-slate-900 shrink-0 mt-0.5">
                        {opt.id}.
                      </span>
                      <span className="text-base leading-relaxed flex-1">
                        <MathText text={opt.text} />
                      </span>
                    </label>
                  );
                })}
              </div>
            )}

            {currentQuestion.type === 'kategori' && currentQuestion.statements && (
              <div className="overflow-x-auto">
                <div className="text-xs font-semibold text-blue-800 mb-2">
                  Petunjuk: Pilih satu kategori pada setiap baris pernyataan.
                </div>
                <table className="w-full border-collapse border border-slate-300 text-sm sm:text-base">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-300 px-3.5 py-3 text-left font-bold text-slate-900">
                        Pernyataan
                      </th>
                      {(currentQuestion.kategoriLabels ?? ['Benar', 'Salah']).map((lbl) => (
                        <th
                          key={lbl}
                          className="border border-slate-300 px-3 py-3 text-center font-bold text-slate-900 w-24 sm:w-28"
                        >
                          {lbl}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentQuestion.statements.map((st) => {
                      const ansObj =
                        currentAnswer &&
                        typeof currentAnswer === 'object' &&
                        !Array.isArray(currentAnswer)
                          ? currentAnswer
                          : {};
                      const selectedVal = ansObj[st.id];
                      return (
                        <tr key={st.id} className="bg-white">
                          <td className="border border-slate-300 px-3.5 py-3 text-slate-800 leading-relaxed">
                            <MathText text={st.text} />
                          </td>
                          {[0, 1].map((val) => (
                            <td
                              key={val}
                              className="border border-slate-300 px-2 py-3 text-center align-middle"
                            >
                              <label className="inline-flex items-center justify-center w-11 h-11 rounded-lg hover:bg-blue-50 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`kat-${currentQuestion.number}-${st.id}`}
                                  checked={selectedVal === val}
                                  onChange={() => handleKategoriSelect(st.id, val)}
                                  className="h-5 w-5 text-blue-700 border-slate-400 focus:ring-blue-600 cursor-pointer"
                                  aria-label={`${st.text} - ${
                                    (currentQuestion.kategoriLabels ?? ['Benar', 'Salah'])[val]
                                  }`}
                                />
                              </label>
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-8 pt-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                disabled={session.currentIndex === 0}
                onClick={() => onChangeIndex(session.currentIndex - 1)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-semibold text-slate-800 min-h-[44px] whitespace-nowrap cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Soal Sebelumnya</span>
              </button>

              <label
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold cursor-pointer min-h-[44px] whitespace-nowrap select-none transition-colors ${
                  isCurrentDoubtful
                    ? 'bg-amber-100 border-amber-400 text-amber-950'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isCurrentDoubtful}
                  onChange={() => onToggleDoubtful(currentQuestion.number)}
                  className="h-4 w-4 rounded text-amber-600 border-slate-400 focus:ring-amber-500 cursor-pointer"
                />
                <Flag className="w-4 h-4" />
                <span>Ragu-ragu</span>
              </label>

              {session.currentIndex < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => onChangeIndex(session.currentIndex + 1)}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold min-h-[44px] whitespace-nowrap cursor-pointer"
                >
                  <span>Soal Berikutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(true)}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold min-h-[44px] whitespace-nowrap cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Selesai Ujian</span>
                </button>
              )}
            </div>
          </section>

          {/* Right Panel: 1-30 Navigation Grid */}
          <aside
            className={`${
              isBindo ? 'lg:col-span-3' : 'lg:col-span-4'
            } bg-white border border-slate-200 rounded-2xl p-5 lg:sticky lg:top-20`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900">Navigasi Soal</h3>
              <span className="text-xs font-semibold text-slate-600 tabular-nums">
                {answeredCount}/30 dijawab
              </span>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-2 mb-5">
              {questions.map((q, idx) => {
                const isActive = idx === session.currentIndex;
                const answered = isQuestionAnswered(q, session.answers[q.number]);
                const doubtful = Boolean(session.doubtful[q.number]);

                let colorCls =
                  'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200';
                let statusDesc = 'Belum dijawab';

                if (isActive) {
                  colorCls =
                    'bg-blue-700 text-white border-blue-800 ring-2 ring-blue-300';
                  statusDesc = 'Sedang dibuka';
                } else if (doubtful) {
                  colorCls =
                    'bg-amber-400 text-slate-950 border-amber-500 hover:bg-amber-500';
                  statusDesc = 'Ragu-ragu';
                } else if (answered) {
                  colorCls =
                    'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700';
                  statusDesc = 'Sudah dijawab';
                }

                return (
                  <button
                    key={q.number}
                    type="button"
                    onClick={() => onChangeIndex(idx)}
                    aria-label={`Soal nomor ${q.number}, ${statusDesc}`}
                    className={`h-11 rounded-lg border text-sm font-bold tabular-nums transition-colors cursor-pointer flex items-center justify-center ${colorCls}`}
                  >
                    {q.number}
                  </button>
                );
              })}
            </div>

            <div className="border-t border-slate-200 pt-4 grid grid-cols-2 gap-2.5 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-blue-700 border border-blue-800 shrink-0" />
                <span>Sedang dibuka</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-emerald-600 border border-emerald-700 shrink-0" />
                <span>Sudah dijawab</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-amber-400 border border-amber-500 shrink-0" />
                <span>Ragu-ragu</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-slate-100 border border-slate-300 shrink-0" />
                <span>Belum dijawab</span>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {showConfirmModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-submit-title"
        >
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h2 id="confirm-submit-title" className="text-lg font-bold text-slate-900">
                  Konfirmasi Selesai Ujian
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Periksa kembali ringkasan pengerjaan Paket {session.packetNumber} sebelum dikumpulkan.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-sm mb-6 tabular-nums">
              <div className="flex justify-between">
                <span className="text-slate-600">Soal sudah dijawab</span>
                <strong className="text-emerald-700">{answeredCount} soal</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Belum dijawab</span>
                <strong className="text-rose-700">{unansweredCount} soal</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Ditandai ragu-ragu</span>
                <strong className="text-amber-700">{doubtfulCount} soal</strong>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-800 min-h-[44px] cursor-pointer"
              >
                Kembali Mengerjakan
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmModal(false);
                  onSubmitExam();
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold min-h-[44px] cursor-pointer"
              >
                Ya, Kumpulkan Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3 text-center text-xs sm:text-sm text-slate-500">
          Developed by Arifna Hidayatallah
        </div>
      </footer>
    </div>
  );
};
