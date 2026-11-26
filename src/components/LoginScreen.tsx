import React, { useState } from 'react';
import {
  BookOpen,
  Calculator,
  CheckCircle2,
  Clock,
  FileCheck2,
  Play,
  Plus,
  RotateCcw,
} from 'lucide-react';
import { ExamSessionState, Question, StudentIdentity, SubjectId } from '../types/exam';
import {
  evaluateExam,
  formatTimeHMS,
  isQuestionAnswered,
  loadSavedSession,
  SUBJECT_META,
} from '../utils/scoring';
import { getMathQuestionsForPacket } from '../data/mathPacketGenerator';
import { getBindoDataForPacket } from '../data/bindoPacketsData';

interface LoginScreenProps {
  selectedSubject: SubjectId;
  selectedPacket: number;
  packetNumbers: number[];
  lastIdentity: StudentIdentity | null;
  onSelectSubject: (subject: SubjectId) => void;
  onSelectPacket: (packetNumber: number) => void;
  onGenerateNextPacket: () => void;
  onStartNew: (identity: StudentIdentity) => void;
  onResumeSaved: () => void;
  onViewSavedResult: () => void;
}

function getQuestionsFor(subject: SubjectId, packetNumber: number): Question[] {
  return subject === 'matematika'
    ? getMathQuestionsForPacket(packetNumber)
    : getBindoDataForPacket(packetNumber).questions;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  selectedSubject,
  selectedPacket,
  packetNumbers,
  lastIdentity,
  onSelectSubject,
  onSelectPacket,
  onGenerateNextPacket,
  onStartNew,
  onResumeSaved,
  onViewSavedResult,
}) => {
  const currentSavedSession: ExamSessionState | null = loadSavedSession(
    selectedSubject,
    selectedPacket
  );
  const initialIdentity = currentSavedSession?.identity ?? lastIdentity;

  const [name, setName] = useState(initialIdentity?.name ?? '');
  const [participantNo, setParticipantNo] = useState(initialIdentity?.participantNo ?? '');
  const [school, setSchool] = useState(initialIdentity?.school ?? '');
  const [errorMsg, setErrorMsg] = useState('');

  const meta = SUBJECT_META[selectedSubject];
  const nextPacketNumber = Math.max(...packetNumbers, 1) + 1;

  const currentQuestions = getQuestionsFor(selectedSubject, selectedPacket);
  const currentAnsweredCount = currentSavedSession
    ? currentQuestions.filter((q) => isQuestionAnswered(q, currentSavedSession.answers[q.number]))
        .length
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Mohon tuliskan Nama Lengkap Siswa terlebih dahulu.');
      return;
    }
    if (!school.trim()) {
      setErrorMsg('Mohon tuliskan Asal Sekolah/Madrasah terlebih dahulu.');
      return;
    }
    setErrorMsg('');
    onStartNew({
      name: name.trim(),
      participantNo: participantNo.trim(),
      school: school.trim(),
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
            Simulasi CAT TKA SD/MI
          </div>
          <div className="text-xs sm:text-sm text-slate-500 hidden sm:block whitespace-nowrap shrink-0">
            30 Soal per Paket · 75 Menit · Evaluasi Diagnostik
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
        {/* Hero Heading */}
        <div>
          <p className="text-sm font-semibold text-blue-700 mb-1">
            Portal Simulasi CAT TKA Jenjang SD/MI
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight text-balance">
            Selamat Datang Di Portal Simulasi Tes Kemampuan Akademik
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1.5">
            Pilih mata pelajaran, tentukan paket soal, lengkapi identitas peserta, lalu mulai mengerjakan.
          </p>
        </div>

        {/* Step 1: Pilih Mata Pelajaran */}
        <section className="space-y-3" aria-labelledby="step-subject-heading">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-blue-700">01.</span>
            <h2 id="step-subject-heading" className="text-lg font-bold text-slate-900">
              Pilih Mata Pelajaran
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(['matematika', 'bindo'] as SubjectId[]).map((subj) => {
              const sMeta = SUBJECT_META[subj];
              const isSelected = selectedSubject === subj;
              const Icon = subj === 'matematika' ? Calculator : BookOpen;
              return (
                <button
                  key={subj}
                  type="button"
                  onClick={() => {
                    setErrorMsg('');
                    onSelectSubject(subj);
                  }}
                  aria-pressed={isSelected}
                  className={`text-left p-5 sm:p-6 rounded-2xl border transition-colors cursor-pointer flex items-start gap-4 ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-600 ring-1 ring-blue-600'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div
                    className={`p-3 rounded-xl shrink-0 ${
                      isSelected ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900">
                        {sMeta.shortTitle}
                      </h3>
                      <span
                        className={`text-xs font-semibold shrink-0 ${
                          isSelected ? 'text-blue-700' : 'text-slate-400'
                        }`}
                      >
                        {isSelected ? 'Dipilih' : 'Pilih'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      {sMeta.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Step 2: Pilih Paket Soal & Tombol Generate Paket Baru */}
        <section
          className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 space-y-5"
          aria-labelledby="step-packet-heading"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-bold text-blue-700">02.</span>
                <h2 id="step-packet-heading" className="text-lg font-bold text-slate-900">
                  Pilih Paket Soal ({meta.shortTitle})
                </h2>
              </div>
              <p className="text-sm text-slate-600 mt-0.5">
                Setiap paket berisi 30 soal baru sesuai kisi-kisi. Selesaikan Paket 1 lalu lanjutkan
                ke Paket 2, Paket 3, dan seterusnya.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setErrorMsg('');
                onGenerateNextPacket();
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-blue-700 bg-blue-50 hover:bg-blue-100 text-blue-800 text-sm font-bold transition-colors min-h-[44px] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Generate Paket {nextPacketNumber}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {packetNumbers.map((pktNum) => {
              const sess = loadSavedSession(selectedSubject, pktNum);
              const pktQuestions = getQuestionsFor(selectedSubject, pktNum);
              const isSelected = selectedPacket === pktNum;

              let statusText = 'Belum dikerjakan';
              let statusTone = 'text-slate-600';
              let isDone = false;

              if (sess) {
                if (sess.status === 'submitted') {
                  const res = evaluateExam(pktQuestions, sess, selectedSubject);
                  statusText = `Selesai · Skor ${res.score}/100`;
                  statusTone = 'text-emerald-700 font-semibold';
                  isDone = true;
                } else {
                  const ansCount = pktQuestions.filter((q) =>
                    isQuestionAnswered(q, sess.answers[q.number])
                  ).length;
                  statusText = `Berlangsung · ${ansCount}/30 · Sisa ${formatTimeHMS(
                    sess.remainingSeconds
                  )}`;
                  statusTone = 'text-amber-700 font-semibold';
                }
              }

              return (
                <button
                  key={pktNum}
                  type="button"
                  onClick={() => {
                    setErrorMsg('');
                    onSelectPacket(pktNum);
                  }}
                  aria-pressed={isSelected}
                  className={`text-left p-4 rounded-xl border transition-colors cursor-pointer flex flex-col justify-between gap-2 min-h-[88px] ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-600 ring-1 ring-blue-600'
                      : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-base font-bold text-slate-900 tabular-nums">
                      Paket Soal {pktNum}
                    </span>
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    ) : (
                      <span
                        className={`text-xs font-semibold ${
                          isSelected ? 'text-blue-700' : 'text-slate-500'
                        }`}
                      >
                        {isSelected ? 'Aktif' : 'Pilih'}
                      </span>
                    )}
                  </div>
                  <div className={`text-xs tabular-nums ${statusTone}`}>{statusText}</div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Step 3: Input Identitas & Mulai Mengerjakan */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Summary & Resume Card */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
            <div>
              <div className="text-xs font-semibold text-blue-700 mb-1">
                Ringkasan Paket Terpilih
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                {meta.shortTitle} — Paket {selectedPacket}
              </h2>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">{meta.subtitle}</p>
            </div>

            <div className="border-t border-slate-200 pt-4 grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-slate-500">Jumlah Soal</div>
                <div className="text-lg font-bold text-slate-900 mt-0.5 tabular-nums">
                  30 Butir
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Alokasi Waktu</div>
                <div className="text-lg font-bold text-slate-900 mt-0.5 tabular-nums flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-700" />
                  <span>75 Menit</span>
                </div>
              </div>
            </div>

            {currentSavedSession && (
              <div className="border-t border-slate-200 pt-4 space-y-3">
                <div className="text-xs font-semibold text-slate-500">
                  {currentSavedSession.status === 'in_progress'
                    ? 'Progres Paket Ini Tersimpan'
                    : 'Paket Ini Sudah Diselesaikan'}
                </div>
                <div className="text-sm text-slate-800">
                  <strong>{currentSavedSession.identity.name}</strong> ·{' '}
                  {currentSavedSession.identity.school}
                  <div className="text-xs text-slate-600 mt-1 tabular-nums">
                    Terjawab {currentAnsweredCount}/30 soal · Sisa waktu{' '}
                    {formatTimeHMS(currentSavedSession.remainingSeconds)}
                  </div>
                </div>

                {currentSavedSession.status === 'in_progress' ? (
                  <button
                    type="button"
                    onClick={onResumeSaved}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-sm font-bold transition-colors min-h-[44px] cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Lanjutkan Ujian Paket {selectedPacket}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onViewSavedResult}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold transition-colors min-h-[44px] cursor-pointer"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>Lihat Hasil Paket {selectedPacket}</span>
                  </button>
                )}
              </div>
            )}

            <div className="border-t border-slate-200 pt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Mendukung soal Pilihan Ganda Sederhana, Pilihan Ganda Kompleks (MCMA), dan Pilihan
              Ganda Kompleks Kategori. Progres tersimpan otomatis di perangkat ini.
            </div>
          </div>

          {/* Right: Identity Input Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-sm font-bold text-blue-700">03.</span>
              <h2 className="text-xl font-bold text-slate-900">
                Input Identitas Peserta
              </h2>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              Isi identitas peserta untuk mengerjakan{' '}
              <strong className="text-slate-900">
                {meta.shortTitle} Paket {selectedPacket}
              </strong>
              .
            </p>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label
                  htmlFor="student-name"
                  className="block text-sm font-semibold text-slate-800 mb-2"
                >
                  Nama Lengkap Siswa <span className="text-rose-600">*</span>
                </label>
                <input
                  id="student-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Nadia Putri Pratama"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 min-h-[48px]"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="participant-no"
                  className="block text-sm font-semibold text-slate-800 mb-2"
                >
                  Nomor Peserta <span className="text-slate-400 font-normal">(opsional)</span>
                </label>
                <input
                  id="participant-no"
                  type="text"
                  value={participantNo}
                  onChange={(e) => setParticipantNo(e.target.value)}
                  placeholder="Contoh: 01-045-0012"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-base tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 min-h-[48px]"
                />
              </div>

              <div>
                <label
                  htmlFor="school-name"
                  className="block text-sm font-semibold text-slate-800 mb-2"
                >
                  Asal Sekolah / Madrasah <span className="text-rose-600">*</span>
                </label>
                <input
                  id="school-name"
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="Contoh: SD N 2 Ringinarum"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 min-h-[48px]"
                  required
                />
              </div>

              {errorMsg && (
                <div
                  role="alert"
                  className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium"
                >
                  {errorMsg}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-base font-bold transition-colors min-h-[52px] cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>
                    {currentSavedSession
                      ? `Kerjakan Ulang Paket ${selectedPacket}`
                      : `Mulai Mengerjakan Paket ${selectedPacket}`}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 text-center text-xs sm:text-sm text-slate-500">
          Developed by Arifna Hidayatallah
        </div>
      </footer>
    </div>
  );
};
