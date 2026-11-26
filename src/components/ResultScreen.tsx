import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Printer,
  XCircle,
} from 'lucide-react';
import {
  EvaluationResult,
  Passage,
  Question,
  StudentAnswer,
  StudentIdentity,
  SubjectId,
} from '../types/exam';
import { formatDurationText, SUBJECT_META } from '../utils/scoring';
import { printReportA4 } from '../utils/reportExport';
import { MathText } from './MathText';
import { MathIllustration } from './MathIllustrations';
import { BindoIllustration } from './BindoIllustrations';

interface ResultScreenProps {
  subject: SubjectId;
  packetNumber: number;
  identity: StudentIdentity;
  result: EvaluationResult;
  passages: Record<string, Passage>;
  onBackHome: () => void;
  onStartNextPacket: (nextPacketNumber: number) => void;
}

type ReviewFilter = 'all' | 'correct' | 'wrong';

function renderStudentAnswerNode(q: Question, ans: StudentAnswer | undefined): React.ReactNode {
  if (ans === undefined || ans === null) {
    return <span className="italic text-slate-500">Tidak dijawab</span>;
  }

  if (q.type === 'pg' && typeof ans === 'string') {
    const opt = q.options?.find((o) => o.id === ans);
    return opt ? (
      <span>
        <strong>{opt.id}.</strong> <MathText text={opt.text} />
      </span>
    ) : (
      <span>{ans}</span>
    );
  }

  if (q.type === 'mcma' && Array.isArray(ans)) {
    if (ans.length === 0) return <span className="italic text-slate-500">Tidak dijawab</span>;
    return (
      <div className="space-y-1">
        {[...ans].sort().map((id) => {
          const opt = q.options?.find((o) => o.id === id);
          return (
            <div key={id}>
              <strong>{id}.</strong> {opt ? <MathText text={opt.text} /> : id}
            </div>
          );
        })}
      </div>
    );
  }

  if (q.type === 'kategori' && typeof ans === 'object' && !Array.isArray(ans) && q.statements) {
    const labels = q.kategoriLabels ?? ['Benar', 'Salah'];
    return (
      <div className="space-y-1">
        {q.statements.map((st, idx) => {
          const v = ans[st.id];
          const lbl = v === 0 || v === 1 ? labels[v] : 'Belum dipilih';
          return (
            <div key={st.id}>
              Pernyataan {idx + 1}: <strong>{lbl}</strong>
            </div>
          );
        })}
      </div>
    );
  }

  return <span className="italic text-slate-500">Tidak dijawab</span>;
}

function renderKeyAnswerNode(q: Question): React.ReactNode {
  if (q.type === 'pg' && q.correctOption) {
    const opt = q.options?.find((o) => o.id === q.correctOption);
    return opt ? (
      <span>
        <strong>{opt.id}.</strong> <MathText text={opt.text} />
      </span>
    ) : (
      <span>{q.correctOption}</span>
    );
  }

  if (q.type === 'mcma' && q.correctOptions) {
    return (
      <div className="space-y-1">
        {[...q.correctOptions].sort().map((id) => {
          const opt = q.options?.find((o) => o.id === id);
          return (
            <div key={id}>
              <strong>{id}.</strong> {opt ? <MathText text={opt.text} /> : id}
            </div>
          );
        })}
      </div>
    );
  }

  if (q.type === 'kategori' && q.statements) {
    const labels = q.kategoriLabels ?? ['Benar', 'Salah'];
    return (
      <div className="space-y-1">
        {q.statements.map((st, idx) => (
          <div key={st.id}>
            Pernyataan {idx + 1}: <strong>{labels[st.correctValue]}</strong>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  subject,
  packetNumber,
  identity,
  result,
  passages,
  onBackHome,
  onStartNextPacket,
}) => {
  const [filter, setFilter] = useState<ReviewFilter>('all');
  const meta = SUBJECT_META[subject];

  const counts = useMemo(
    () => ({
      all: result.evaluations.length,
      correct: result.correctCount,
      wrong: result.wrongCount,
    }),
    [result]
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col print:bg-white">
      <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={onBackHome}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-800 min-h-[40px] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Halaman Utama</span>
            </button>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate">
              Hasil {meta.shortTitle} · Paket {packetNumber}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => printReportA4(subject, packetNumber, identity, result, passages)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-900 text-sm font-semibold min-h-[44px] whitespace-nowrap cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Hasil</span>
            </button>

            <button
              type="button"
              onClick={() => onStartNextPacket(packetNumber + 1)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold min-h-[44px] whitespace-nowrap cursor-pointer"
            >
              <span>Kerjakan Paket {packetNumber + 1}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 print:max-w-none print:px-0 print:py-2 print:space-y-4">
        <div className="hidden print:block border-b-2 border-slate-900 pb-3 mb-2">
          <h1 className="text-xl font-bold text-slate-900">
            Laporan Hasil {meta.title} — Paket {packetNumber}
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">{meta.subtitle}</p>
        </div>

        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 print-break-inside-avoid print:p-4 print:rounded-lg print:border-slate-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-6 mb-6">
            <div>
              <p className="text-xs font-semibold text-blue-700 mb-1">
                Laporan Hasil Simulasi CAT TKA SD/MI · Paket {packetNumber}
              </p>
              <h2 className="text-2xl font-bold text-slate-900">{identity.name}</h2>
              <p className="text-sm text-slate-600 mt-1">
                {identity.school}
                {identity.participantNo ? ` · Nomor Peserta: ${identity.participantNo}` : ''}
                {' · '}Waktu pengerjaan: {formatDurationText(result.durationUsedSeconds)}
              </p>
            </div>

            <div className="flex items-baseline gap-2 shrink-0">
              <span className="text-sm font-semibold text-slate-500">Skor Akhir</span>
              <span className="text-4xl sm:text-5xl font-extrabold text-blue-700 tabular-nums">
                {result.score}
              </span>
              <span className="text-lg font-semibold text-slate-400">/ 100</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 tabular-nums">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs font-medium text-slate-500">Total Soal</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                {result.totalQuestions}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="text-xs font-medium text-emerald-800">Jawaban Benar</div>
              <div className="text-2xl font-bold text-emerald-700 mt-1">
                {result.correctCount}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
              <div className="text-xs font-medium text-rose-800">Jawaban Salah</div>
              <div className="text-2xl font-bold text-rose-700 mt-1">
                {result.wrongCount}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs font-medium text-slate-500">Tidak Dijawab</div>
              <div className="text-2xl font-bold text-slate-700 mt-1">
                {result.unansweredCount}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 print-break-inside-avoid print:p-4 print:rounded-lg print:border-slate-300">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">
            Analisis Diagnostik Penguasaan Domain
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            Persentase ketuntasan berdasarkan kompetensi pada kisi-kisi {meta.shortTitle} Paket {packetNumber}.
          </p>

          <div className="space-y-5">
            {result.domainStats.map((stat) => {
              const barColor =
                stat.percentage >= 80
                  ? 'bg-emerald-600'
                  : stat.percentage >= 60
                  ? 'bg-blue-600'
                  : 'bg-amber-500';
              const masteryLabel =
                stat.percentage >= 80
                  ? 'Sangat Baik'
                  : stat.percentage >= 60
                  ? 'Cukup Baik'
                  : 'Perlu Penguatan';

              return (
                <div key={stat.domain} className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm sm:text-base">
                    <span className="font-bold text-slate-900">{stat.domain}</span>
                    <span className="text-slate-700 tabular-nums">
                      <strong>{stat.correct}</strong> dari {stat.total} benar ({stat.percentage}%) ·{' '}
                      <span className="font-semibold text-slate-900">{masteryLabel}</span>
                    </span>
                  </div>
                  <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className={`h-full ${barColor} transition-all`}
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Kunci Jawaban &amp; Pembahasan Lengkap
              </h2>
              <p className="text-sm text-slate-600">
                Menampilkan jawaban peserta, kunci jawaban benar, dan langkah penyelesaian.
              </p>
            </div>

            <div
              className="no-print inline-flex p-1 bg-slate-200/80 rounded-xl border border-slate-200 self-start"
              role="tablist"
              aria-label="Filter Pembahasan Soal"
            >
              <button
                type="button"
                role="tab"
                aria-selected={filter === 'all'}
                onClick={() => setFilter('all')}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  filter === 'all'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua ({counts.all})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={filter === 'correct'}
                onClick={() => setFilter('correct')}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  filter === 'correct'
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Benar ({counts.correct})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={filter === 'wrong'}
                onClick={() => setFilter('wrong')}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  filter === 'wrong'
                    ? 'bg-white text-rose-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Salah ({counts.wrong})
              </button>
            </div>
          </div>

          <div className="space-y-5">
            {result.evaluations.map((ev) => {
              const { question, studentAnswer, isCorrect, isAnswered } = ev;
              const isVisible =
                filter === 'all' ||
                (filter === 'correct' && isCorrect) ||
                (filter === 'wrong' && !isCorrect);

              const passage = question.passageId ? passages[question.passageId] : undefined;

              return (
                <article
                  key={question.number}
                  className={`${
                    isVisible ? 'block' : 'hidden print:block'
                  } bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 print-break-inside-avoid print:p-4 print:rounded-lg print:border-slate-300`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3.5 mb-4">
                    <div>
                      <span className="text-base font-bold text-slate-900 tabular-nums">
                        Soal Nomor {question.number}
                      </span>
                      <span className="text-xs sm:text-sm text-slate-500">
                        {' · '}
                        {question.domain} · {question.subtopic}
                      </span>
                    </div>

                    <div
                      className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold ${
                        isCorrect ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>Benar</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 shrink-0" />
                          <span>{isAnswered ? 'Salah' : 'Tidak Dijawab'}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {passage && (
                    <div className="mb-3 text-xs font-medium text-slate-600">
                      Wacana: <strong className="text-slate-800">{passage.title}</strong> ({passage.genre})
                    </div>
                  )}

                  {question.svgId && (
                    <div
                      data-report-svg={`${question.svgId}-q${question.number}`}
                      className="mb-4 p-3 rounded-xl bg-slate-50 border border-slate-200"
                    >
                      {question.subject === 'matematika' ? (
                        <MathIllustration id={question.svgId} data={question.svgData} />
                      ) : (
                        <BindoIllustration id={question.svgId} data={question.svgData} />
                      )}
                    </div>
                  )}

                  {question.stimulusText && (
                    <div className="mb-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm sm:text-base text-slate-800 leading-relaxed">
                      <MathText text={question.stimulusText} />
                    </div>
                  )}

                  {question.stimulusTable && (
                    <div className="mb-4 overflow-x-auto">
                      <table className="w-full border-collapse border border-slate-300 text-sm tabular-nums">
                        <thead>
                          <tr className="bg-slate-100">
                            {question.stimulusTable.headers.map((h, i) => (
                              <th
                                key={i}
                                className="border border-slate-300 px-3 py-1.5 text-left font-bold"
                              >
                                <MathText text={h} />
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {question.stimulusTable.rows.map((row, rIdx) => (
                            <tr key={rIdx}>
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="border border-slate-300 px-3 py-1.5">
                                  <MathText text={cell} />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="text-base text-slate-900 leading-relaxed mb-4">
                    <MathText text={question.prompt} />
                  </div>

                  {question.type === 'kategori' && question.statements && (
                    <ul className="mb-4 space-y-1.5 text-sm text-slate-700 list-disc pl-5">
                      {question.statements.map((st, idx) => (
                        <li key={st.id}>
                          <strong>Pernyataan {idx + 1}:</strong> <MathText text={st.text} />
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-4 text-sm">
                    <div
                      className={`p-3.5 rounded-xl border ${
                        isCorrect
                          ? 'bg-emerald-50/60 border-emerald-200'
                          : 'bg-rose-50/60 border-rose-200'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-600 mb-1">
                        Jawaban Peserta
                      </div>
                      <div className="text-slate-900 leading-relaxed">
                        {renderStudentAnswerNode(question, studentAnswer)}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl border bg-emerald-50 border-emerald-200">
                      <div className="text-xs font-bold text-emerald-900 mb-1">
                        Kunci Jawaban Benar
                      </div>
                      <div className="text-slate-900 leading-relaxed">
                        {renderKeyAnswerNode(question)}
                      </div>
                    </div>
                  </div>

                  {question.quoteEvidence && (
                    <div className="mb-3 p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-sm text-slate-800 leading-relaxed">
                      <strong className="text-blue-900">Bukti Kutipan Teks:</strong>{' '}
                      {question.quoteEvidence}
                    </div>
                  )}

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 leading-relaxed">
                    <div className="font-bold text-slate-900 mb-1">Pembahasan:</div>
                    <MathText text={question.explanation} />
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white print:bg-transparent print:border-slate-300 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 text-center text-xs sm:text-sm text-slate-500">
          Developed by Arifna Hidayatallah
        </div>
      </footer>
    </div>
  );
};
