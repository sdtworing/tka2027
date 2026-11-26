import {
  EvaluationResult,
  Passage,
  Question,
  StudentAnswer,
  StudentIdentity,
  SubjectId,
} from '../types/exam';
import { escapeHtml, renderMathTextToHtml } from '../components/MathText';
import { formatDurationText, SUBJECT_META } from './scoring';

function formatStudentAnswerHtml(q: Question, ans: StudentAnswer | undefined): string {
  if (ans === undefined || ans === null) return '<em style="color:#64748b">Tidak dijawab</em>';

  if (q.type === 'pg' && typeof ans === 'string') {
    const opt = q.options?.find((o) => o.id === ans);
    return opt
      ? `<strong>${escapeHtml(opt.id)}.</strong> ${renderMathTextToHtml(opt.text)}`
      : escapeHtml(ans);
  }

  if (q.type === 'mcma' && Array.isArray(ans)) {
    if (ans.length === 0) return '<em style="color:#64748b">Tidak dijawab</em>';
    const sorted = [...ans].sort();
    return sorted
      .map((id) => {
        const opt = q.options?.find((o) => o.id === id);
        return opt
          ? `<div style="margin-bottom:2px"><strong>${escapeHtml(opt.id)}.</strong> ${renderMathTextToHtml(opt.text)}</div>`
          : escapeHtml(id);
      })
      .join('');
  }

  if (q.type === 'kategori' && typeof ans === 'object' && !Array.isArray(ans) && q.statements) {
    const labels = q.kategoriLabels ?? ['Benar', 'Salah'];
    return q.statements
      .map((st, idx) => {
        const val = ans[st.id];
        const label = val === 0 || val === 1 ? labels[val] : 'Belum dipilih';
        return `<div style="margin-bottom:2px">Pernyataan ${idx + 1}: <strong>${escapeHtml(label)}</strong></div>`;
      })
      .join('');
  }

  return '<em style="color:#64748b">Tidak dijawab</em>';
}

function formatKeyAnswerHtml(q: Question): string {
  if (q.type === 'pg' && q.correctOption) {
    const opt = q.options?.find((o) => o.id === q.correctOption);
    return opt
      ? `<strong>${escapeHtml(opt.id)}.</strong> ${renderMathTextToHtml(opt.text)}`
      : escapeHtml(q.correctOption);
  }

  if (q.type === 'mcma' && q.correctOptions) {
    return [...q.correctOptions]
      .sort()
      .map((id) => {
        const opt = q.options?.find((o) => o.id === id);
        return opt
          ? `<div style="margin-bottom:2px"><strong>${escapeHtml(opt.id)}.</strong> ${renderMathTextToHtml(opt.text)}</div>`
          : escapeHtml(id);
      })
      .join('');
  }

  if (q.type === 'kategori' && q.statements) {
    const labels = q.kategoriLabels ?? ['Benar', 'Salah'];
    return q.statements
      .map(
        (st, idx) =>
          `<div style="margin-bottom:2px">Pernyataan ${idx + 1}: <strong>${escapeHtml(
            labels[st.correctValue]
          )}</strong></div>`
      )
      .join('');
  }

  return '';
}

function getLiveSvgHtml(questionNumber: number, svgId?: string): string {
  if (!svgId) return '';
  const container =
    document.querySelector(`[data-report-svg="${svgId}-q${questionNumber}"]`) ??
    document.querySelector(`[data-report-svg="${svgId}"]`);
  if (!container) return '';
  return `<div class="svg-box">${container.innerHTML}</div>`;
}

function getTypeLabel(type: Question['type']): string {
  if (type === 'pg') return 'Pilihan Ganda';
  if (type === 'mcma') return 'PG Kompleks (MCMA)';
  return 'PG Kompleks (Kategori)';
}

export function buildPrintReportHtml(
  subject: SubjectId,
  packetNumber: number,
  identity: StudentIdentity,
  result: EvaluationResult,
  passages: Record<string, Passage>
): string {
  const meta = SUBJECT_META[subject];
  const dateStr = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const domainRowsHtml = result.domainStats
    .map((d) => {
      const barColor =
        d.percentage >= 80 ? '#059669' : d.percentage >= 60 ? '#1d4ed8' : '#d97706';
      return `
      <div class="domain-row">
        <div class="domain-head">
          <span><strong>${escapeHtml(d.domain)}</strong></span>
          <span>${d.correct} / ${d.total} benar (${d.percentage}%)</span>
        </div>
        <div class="bar-track">
          <div class="bar-fill" style="width:${d.percentage}%;background:${barColor}"></div>
        </div>
      </div>`;
    })
    .join('');

  const questionsHtml = result.evaluations
    .map((ev) => {
      const { question, studentAnswer, isCorrect, isAnswered } = ev;
      const statusText = isCorrect ? 'BENAR' : isAnswered ? 'SALAH' : 'TIDAK DIJAWAB';
      const statusClass = isCorrect ? 'status-ok' : 'status-bad';
      const passage = question.passageId ? passages[question.passageId] : undefined;

      const passageHtml = passage
        ? `<div class="passage-box">
            <div class="passage-title">Wacana: ${escapeHtml(passage.title)} (${escapeHtml(passage.genre)})</div>
            ${passage.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}
            ${
              passage.steps
                ? `<ol>${passage.steps.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ol>`
                : ''
            }
          </div>`
        : '';

      const tableHtml = question.stimulusTable
        ? `<div class="table-wrap">
            ${question.stimulusTable.caption ? `<div class="table-caption">${escapeHtml(question.stimulusTable.caption)}</div>` : ''}
            <table>
              <thead><tr>${question.stimulusTable.headers.map((h) => `<th>${escapeHtml(h)}</th>`).join('')}</tr></thead>
              <tbody>${question.stimulusTable.rows.map((r) => `<tr>${r.map((c) => `<td>${renderMathTextToHtml(c)}</td>`).join('')}</tr>`).join('')}</tbody>
            </table>
          </div>`
        : '';

      const kategoriStHtml =
        question.type === 'kategori' && question.statements
          ? `<ul class="st-list">${question.statements.map((s, i) => `<li><strong>Pernyataan ${i + 1}:</strong> ${renderMathTextToHtml(s.text)}</li>`).join('')}</ul>`
          : '';

      return `
      <article class="q-card">
        <div class="q-header">
          <div>
            <strong>Soal Nomor ${question.number}</strong>
            <span class="q-meta"> · ${escapeHtml(question.domain)} · ${escapeHtml(question.subtopic)} · ${getTypeLabel(question.type)}</span>
          </div>
          <span class="q-status ${statusClass}">${statusText}</span>
        </div>
        ${passageHtml}
        ${getLiveSvgHtml(question.number, question.svgId)}
        ${question.stimulusText ? `<div class="stimulus-text">${renderMathTextToHtml(question.stimulusText)}</div>` : ''}
        ${tableHtml}
        <div class="q-prompt">${renderMathTextToHtml(question.prompt)}</div>
        ${kategoriStHtml}
        <div class="ans-grid">
          <div class="ans-box">
            <div class="ans-label">Jawaban Peserta</div>
            <div>${formatStudentAnswerHtml(question, studentAnswer)}</div>
          </div>
          <div class="ans-box ans-key">
            <div class="ans-label">Kunci Jawaban Benar</div>
            <div>${formatKeyAnswerHtml(question)}</div>
          </div>
        </div>
        ${
          question.quoteEvidence
            ? `<div class="evidence-box"><strong>Bukti Kutipan Teks:</strong> ${escapeHtml(question.quoteEvidence)}</div>`
            : ''
        }
        <div class="exp-box">
          <strong>Pembahasan:</strong><br />
          ${renderMathTextToHtml(question.explanation)}
        </div>
      </article>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>Laporan Hasil ${escapeHtml(meta.title)} Paket ${packetNumber} - ${escapeHtml(identity.name)}</title>
  <style>
    @page { size: A4 portrait; margin: 14mm 14mm 16mm; }
    * { box-sizing: border-box; }
    body {
      font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 0;
      line-height: 1.5;
      font-size: 11pt;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .container { max-width: 182mm; margin: 0 auto; padding: 6mm 0; }
    .header {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 10px;
      margin-bottom: 14px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 16px;
    }
    .header h1 { margin: 0 0 3px; font-size: 15pt; color: #0f172a; }
    .header p { margin: 0; color: #475569; font-size: 9.5pt; }
    .identity-table { width: 100%; border-collapse: collapse; margin-bottom: 14px; font-size: 10pt; }
    .identity-table td { padding: 6px 10px; border: 1px solid #cbd5e1; }
    .identity-table td:first-child { width: 165px; background: #f8fafc; font-weight: 600; color: #334155; }
    .score-hero { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 16px; }
    .stat-box { border: 1px solid #cbd5e1; border-radius: 6px; padding: 9px 11px; background: #f8fafc; }
    .stat-label { font-size: 8.5pt; color: #475569; margin-bottom: 3px; }
    .stat-val { font-size: 15pt; font-weight: 700; }
    .section-block { break-inside: avoid; page-break-inside: avoid; margin-bottom: 14px; }
    .section-title {
      font-size: 12pt;
      font-weight: 700;
      margin: 16px 0 10px;
      border-bottom: 1.5px solid #cbd5e1;
      padding-bottom: 4px;
      break-after: avoid;
      page-break-after: avoid;
    }
    .domain-row { margin-bottom: 9px; }
    .domain-head { display: flex; justify-content: space-between; font-size: 10pt; margin-bottom: 4px; }
    .bar-track { height: 9px; background: #e2e8f0; border-radius: 4px; overflow: hidden; border: 1px solid #cbd5e1; }
    .bar-fill { height: 100%; }
    .q-card {
      border: 1px solid #cbd5e1;
      border-radius: 7px;
      padding: 11px 13px;
      margin-bottom: 11px;
      break-inside: avoid;
      page-break-inside: avoid;
      background: #ffffff;
    }
    .q-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 5px;
      margin-bottom: 8px;
    }
    .q-meta { font-size: 9pt; color: #475569; }
    .q-status { font-size: 8.5pt; font-weight: 700; padding: 2px 8px; border-radius: 4px; white-space: nowrap; }
    .status-ok { background: #dcfce7; color: #166534; border: 1px solid #86efac; }
    .status-bad { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
    .passage-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 5px;
      padding: 7px 9px;
      margin-bottom: 8px;
      font-size: 9.5pt;
    }
    .passage-title { font-weight: 700; margin-bottom: 3px; color: #1e293b; }
    .passage-box p { margin: 3px 0; }
    .passage-box ol { margin: 4px 0 2px; padding-left: 18px; }
    .svg-box { margin: 6px 0 8px; text-align: center; }
    .svg-box svg { max-width: 280px; max-height: 185px; height: auto; }
    .stimulus-text { background: #f8fafc; padding: 7px 9px; border: 1px solid #e2e8f0; border-radius: 5px; margin-bottom: 7px; font-size: 10pt; }
    .table-wrap { margin: 7px 0; }
    .table-caption { font-weight: 600; font-size: 9.5pt; margin-bottom: 4px; }
    table { border-collapse: collapse; width: 100%; font-size: 9.5pt; }
    th, td { border: 1px solid #cbd5e1; padding: 4px 8px; text-align: left; }
    th { background: #f1f5f9; font-weight: 700; }
    .q-prompt { margin-bottom: 7px; font-size: 10.5pt; }
    .st-list { margin: 4px 0 8px; padding-left: 18px; font-size: 9.5pt; }
    .ans-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 7px; }
    .ans-box { border: 1px solid #cbd5e1; border-radius: 5px; padding: 7px 9px; background: #f8fafc; font-size: 9.5pt; }
    .ans-key { background: #f0fdf4; border-color: #bbf7d0; }
    .ans-label { font-size: 8.5pt; font-weight: 700; color: #475569; margin-bottom: 3px; }
    .evidence-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 5px; padding: 6px 9px; font-size: 9.5pt; margin-bottom: 6px; }
    .exp-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 5px; padding: 7px 9px; font-size: 9.5pt; }
    .math-frac { display: inline-flex; flex-direction: column; align-items: center; vertical-align: middle; margin: 0 2px; line-height: 1.05; font-size: 0.92em; font-weight: 600; }
    .math-frac-num { padding: 0 3px 1px; border-bottom: 1.5px solid #0f172a; text-align: center; }
    .math-frac-den { padding: 1px 3px 0; text-align: center; }
    .math-mixed { display: inline-flex; align-items: center; vertical-align: middle; gap: 2px; }
    .print-footer {
      margin-top: 18px;
      padding-top: 8px;
      border-top: 1px solid #cbd5e1;
      text-align: center;
      font-size: 9pt;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="section-block">
      <div class="header">
        <div>
          <h1>Laporan Hasil ${escapeHtml(meta.title)} — Paket ${packetNumber}</h1>
          <p>${escapeHtml(meta.subtitle)}</p>
        </div>
        <div style="text-align:right;font-size:9.5pt;color:#475569;white-space:nowrap;">
          <div>Dicetak: ${escapeHtml(dateStr)}</div>
        </div>
      </div>

      <table class="identity-table">
        <tr><td>Nama Peserta</td><td><strong>${escapeHtml(identity.name)}</strong></td></tr>
        <tr><td>Nomor Peserta</td><td>${escapeHtml(identity.participantNo || '-')}</td></tr>
        <tr><td>Asal Sekolah / Madrasah</td><td>${escapeHtml(identity.school)}</td></tr>
        <tr><td>Paket Soal</td><td>Paket ${packetNumber}</td></tr>
        <tr><td>Waktu Pengerjaan</td><td>${escapeHtml(formatDurationText(result.durationUsedSeconds))} (dari 75 menit)</td></tr>
      </table>

      <div class="score-hero">
        <div class="stat-box">
          <div class="stat-label">Skor Akhir</div>
          <div class="stat-val" style="color:#1d4ed8">${result.score} / 100</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Jawaban Benar</div>
          <div class="stat-val" style="color:#059669">${result.correctCount} soal</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Jawaban Salah</div>
          <div class="stat-val" style="color:#dc2626">${result.wrongCount} soal</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Tidak Dijawab</div>
          <div class="stat-val" style="color:#475569">${result.unansweredCount} soal</div>
        </div>
      </div>

      <div class="section-title">Analisis Diagnostik per Domain</div>
      ${domainRowsHtml}
    </div>

    <div class="section-title">Kunci Jawaban &amp; Pembahasan Lengkap (30 Soal)</div>
    ${questionsHtml}

    <div class="print-footer">Developed by Arifna Hidayatallah</div>
  </div>
  <script>
    window.addEventListener('load', function() {
      setTimeout(function() { window.print(); }, 250);
    });
  </script>
</body>
</html>`;
}

export function printReportA4(
  subject: SubjectId,
  packetNumber: number,
  identity: StudentIdentity,
  result: EvaluationResult,
  passages: Record<string, Passage>
): void {
  const html = buildPrintReportHtml(subject, packetNumber, identity, result, passages);
  try {
    const printWin = window.open('', '_blank', 'width=940,height=720');
    if (printWin && !printWin.closed) {
      printWin.document.open();
      printWin.document.write(html);
      printWin.document.close();
      return;
    }
  } catch {
    // Popup blocked in sandboxed iframe; fall through to direct print
  }
  window.print();
}
