import { jsPDF } from 'jspdf';
import { EXAM_METADATA, QUESTION_MAP, SECTIONS, getSectionInfo } from '../data/examData';
import { AttemptHistoryEntry, ExamAttemptState, OptionKey } from '../types/exam';
import { formatDuration } from './storage';

export type PdfExportScope = 'missed' | 'all';

export interface PdfExportOptions {
  scope?: PdfExportScope;
  candidateName?: string;
}

const OPTION_KEYS: OptionKey[] = ['A', 'B', 'C', 'D'];

/**
 * Normalizes characters outside standard WinAnsi/Latin-1 so built-in jsPDF
 * fonts render crisp, readable clinical text with zero garbled glyphs.
 */
function sanitizePdfText(input: string): string {
  return input
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\u2192/g, '->')
    .replace(/\u2190/g, '<-')
    .replace(/\u2265/g, '>=')
    .replace(/\u2264/g, '<=')
    .replace(/\u2248/g, '~')
    .replace(/[\u00B5\u03BC]/g, 'u')
    .replace(/\u2022/g, '*')
    .replace(/\u2026/g, '...')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildSafeFilename(title: string, scope: PdfExportScope, timestampMs: number): string {
  const dateStr = new Date(timestampMs).toISOString().slice(0, 10);
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  const suffix = scope === 'missed' ? 'missed-rationales' : 'full-report';
  return `jipime-tnmcle-${slug || 'exam'}-${suffix}-${dateStr}.pdf`;
}

export function exportExamResultsToPdf(
  attempt: ExamAttemptState,
  options: PdfExportOptions = {}
): void {
  const scope: PdfExportScope = options.scope ?? 'missed';
  const candidateName = options.candidateName?.trim() || 'TNMC Candidate';

  const flaggedSet = new Set(attempt.flagged ?? []);
  const hintsSet = new Set(attempt.hintsViewed ?? []);

  const evaluated = attempt.config.questionIds
    .map((qId, idx) => {
      const q = QUESTION_MAP[qId];
      if (!q) return null;
      const userAnswer = attempt.answers[qId];
      const isCorrect = userAnswer === q.correctAnswer;
      const isUnanswered = !userAnswer;
      return {
        index: idx + 1,
        question: q,
        userAnswer,
        isCorrect,
        isUnanswered,
        isFlagged: flaggedSet.has(qId),
        usedHint: hintsSet.has(qId),
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const totalQuestions = evaluated.length;
  const correctCount = evaluated.filter((e) => e.isCorrect).length;
  const unansweredCount = evaluated.filter((e) => e.isUnanswered).length;
  const incorrectCount = totalQuestions - correctCount;
  const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const passed = scorePercent >= attempt.config.passThresholdPercent;

  const submittedAtMs = attempt.submittedAt ?? Date.now();
  const timeSpentSeconds =
    attempt.config.durationSeconds > 0
      ? Math.max(0, attempt.config.durationSeconds - attempt.remainingSeconds)
      : Math.max(0, Math.floor((submittedAtMs - attempt.startedAt) / 1000));

  const sectionStats = SECTIONS.map((sec) => {
    const items = evaluated.filter((e) => e.question.section === sec.id);
    if (items.length === 0) return null;
    const correct = items.filter((e) => e.isCorrect).length;
    const answered = items.filter((e) => !e.isUnanswered).length;
    const pct = Math.round((correct / items.length) * 100);
    return { section: sec, total: items.length, answered, correct, pct };
  }).filter((x): x is NonNullable<typeof x> => x !== null);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 15;
  const contentWidth = pageWidth - margin * 2; // 180mm
  const bottomLimit = pageHeight - 18;

  let y = 15;

  const ensureSpace = (neededHeight: number) => {
    if (y + neededHeight > bottomLimit) {
      doc.addPage();
      y = 18;
    }
  };

  // -------------------------------------------------------------------------
  // 1. Official Header Banner
  // -------------------------------------------------------------------------
  doc.setFillColor(6, 78, 59); // emerald-900
  doc.roundedRect(margin, y, contentWidth, 26, 2.5, 2.5, 'F');

  doc.setTextColor(167, 243, 208); // emerald-200
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(
    sanitizePdfText(`${EXAM_METADATA.council} · Paper ${EXAM_METADATA.paperCode}`),
    margin + 6,
    y + 7
  );

  doc.setTextColor(255, 255, 255);
  doc.setFont('times', 'bold');
  doc.setFontSize(16);
  doc.text('JIPIME TNMCLE PREPARATION TO DECEMBER', margin + 6, y + 14.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(236, 253, 245);
  doc.text(
    sanitizePdfText(`Official Revision Record · ${attempt.config.title}`),
    margin + 6,
    y + 21
  );

  y += 31;

  // Candidate & Outcome Metadata Row
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 16, 2, 2, 'FD');

  const dateFormatted = new Date(submittedAtMs).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('CANDIDATE', margin + 5, y + 5.5);
  doc.text('SUBMITTED', margin + 68, y + 5.5);
  doc.text('OUTCOME', margin + 128, y + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(sanitizePdfText(candidateName).slice(0, 32), margin + 5, y + 11.5);
  doc.setFont('helvetica', 'normal');
  doc.text(sanitizePdfText(dateFormatted), margin + 68, y + 11.5);

  doc.setFont('helvetica', 'bold');
  if (passed) {
    doc.setTextColor(6, 95, 70);
  } else {
    doc.setTextColor(159, 18, 57);
  }
  doc.text(
    `${passed ? 'PASSED' : 'NEEDS REVISION'} (Pass >= ${attempt.config.passThresholdPercent}%)`,
    margin + 128,
    y + 11.5
  );

  y += 22;

  // -------------------------------------------------------------------------
  // 2. Quantitative Score Summary Row (5 boxes)
  // -------------------------------------------------------------------------
  const metrics = [
    {
      label: 'Overall Score',
      value: `${scorePercent}%`,
      highlight: passed ? ([6, 95, 70] as const) : ([159, 18, 57] as const),
    },
    { label: 'Correct', value: `${correctCount}/${totalQuestions}`, highlight: [15, 23, 42] as const },
    {
      label: 'Missed / Skipped',
      value: `${incorrectCount} (${unansweredCount} skip)`,
      highlight: [15, 23, 42] as const,
    },
    { label: 'Hints Used', value: `${hintsSet.size}`, highlight: [15, 23, 42] as const },
    { label: 'Time Spent', value: formatDuration(timeSpentSeconds), highlight: [15, 23, 42] as const },
  ];

  const boxGap = 3;
  const boxWidth = (contentWidth - boxGap * (metrics.length - 1)) / metrics.length;
  metrics.forEach((m, idx) => {
    const bx = margin + idx * (boxWidth + boxGap);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(bx, y, boxWidth, 18, 1.8, 1.8, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(m.label, bx + 3.5, y + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(m.highlight[0], m.highlight[1], m.highlight[2]);
    doc.text(m.value, bx + 3.5, y + 13.5);
  });

  y += 25;

  // -------------------------------------------------------------------------
  // 3. Section Performance Breakdown Table
  // -------------------------------------------------------------------------
  ensureSpace(22 + sectionStats.length * 7.5);
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text('Performance by Nursing Section', margin, y);
  y += 4;

  // Table header
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin, y, contentWidth, 8, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text('Section', margin + 3, y + 5.3);
  doc.text('Questions', margin + 106, y + 5.3, { align: 'right' });
  doc.text('Attempted', margin + 131, y + 5.3, { align: 'right' });
  doc.text('Correct', margin + 154, y + 5.3, { align: 'right' });
  doc.text('Accuracy', margin + contentWidth - 3, y + 5.3, { align: 'right' });
  y += 8;

  sectionStats.forEach(({ section, total, answered, correct, pct }, rowIdx) => {
    ensureSpace(8);
    if (rowIdx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentWidth, 7.5, 'F');
    }
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y + 7.5, margin + contentWidth, y + 7.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(
      sanitizePdfText(`Sec ${section.id}: ${section.code} - ${section.title}`).slice(0, 52),
      margin + 3,
      y + 5.1
    );

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(String(total), margin + 106, y + 5.1, { align: 'right' });
    doc.text(String(answered), margin + 131, y + 5.1, { align: 'right' });
    doc.text(String(correct), margin + 154, y + 5.1, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    if (pct >= attempt.config.passThresholdPercent) {
      doc.setTextColor(6, 95, 70);
    } else {
      doc.setTextColor(159, 18, 57);
    }
    doc.text(`${pct}%`, margin + contentWidth - 3, y + 5.1, { align: 'right' });
    y += 7.5;
  });

  y += 10;

  // -------------------------------------------------------------------------
  // 4. Missed Questions (or All Questions) & Clinical Rationales
  // -------------------------------------------------------------------------
  const itemsToPrint =
    scope === 'missed' ? evaluated.filter((item) => !item.isCorrect) : evaluated;

  ensureSpace(18);
  doc.setFont('times', 'bold');
  doc.setFontSize(13.5);
  doc.setTextColor(15, 23, 42);
  const sectionHeading =
    scope === 'missed'
      ? `Missed & Skipped Questions for Revision (${itemsToPrint.length})`
      : `Complete Marking Scheme & Clinical Rationales (${itemsToPrint.length} Items)`;
  doc.text(sectionHeading, margin, y);
  y += 5;

  if (itemsToPrint.length === 0) {
    ensureSpace(20);
    doc.setFillColor(236, 253, 245);
    doc.setDrawColor(167, 243, 208);
    doc.roundedRect(margin, y, contentWidth, 16, 2, 2, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(6, 95, 70);
    doc.text('100% Mastery Achieved - No Missed Questions', margin + 5, y + 7);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(6, 78, 59);
    doc.text(
      'You answered every question in this paper correctly. Use "Full Paper PDF" anytime to print the complete answer key.',
      margin + 5,
      y + 12.5
    );
    y += 22;
  } else {
    for (const item of itemsToPrint) {
      const sec = getSectionInfo(item.question.section);
      const qStemLines = doc.splitTextToSize(
        sanitizePdfText(item.question.question),
        contentWidth - 8
      ) as string[];

      const optionBlocks = OPTION_KEYS.map((key) => {
        const isCorrectOpt = item.question.correctAnswer === key;
        const isUserOpt = item.userAnswer === key;
        let tag = '';
        if (isCorrectOpt && isUserOpt) tag = '  [Your Choice - Correct]';
        else if (isCorrectOpt) tag = '  [Correct Answer]';
        else if (isUserOpt) tag = '  [Your Choice]';

        const text = sanitizePdfText(`${key}. ${item.question.options[key]}${tag}`);
        const lines = doc.splitTextToSize(text, contentWidth - 12) as string[];
        return { key, isCorrectOpt, isUserOpt, lines };
      });

      const rationaleLines = doc.splitTextToSize(
        sanitizePdfText(`Clinical Rationale: ${item.question.rationale}`),
        contentWidth - 14
      ) as string[];

      // Estimate card height to avoid orphaned headers across page breaks
      const optionLinesCount = optionBlocks.reduce((acc, b) => acc + b.lines.length, 0);
      const estimatedHeight =
        12 +
        qStemLines.length * 4.7 +
        3 +
        optionLinesCount * 4.3 +
        optionBlocks.length * 1.6 +
        rationaleLines.length * 4.3 +
        10;

      // If whole card fits on a page, move to a fresh page when it doesn't fit on current page
      if (estimatedHeight <= bottomLimit - 18) {
        ensureSpace(estimatedHeight);
      } else {
        ensureSpace(32);
      }

      // Question card header bar
      doc.setFillColor(241, 245, 249);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(margin, y, contentWidth, 7.5, 1.5, 1.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      const metaParts = [
        `Item ${item.index} (TNMC Q${item.question.id})`,
        `Section ${sec.id}: ${sec.code}`,
      ];
      if (item.isFlagged) metaParts.push('Flagged');
      if (item.usedHint) metaParts.push('Hint Viewed');
      doc.text(sanitizePdfText(metaParts.join(' · ')), margin + 3.5, y + 5);

      const statusLabel = item.isCorrect
        ? 'CORRECT'
        : item.isUnanswered
          ? 'SKIPPED'
          : 'INCORRECT';
      if (item.isCorrect) doc.setTextColor(6, 95, 70);
      else if (item.isUnanswered) doc.setTextColor(71, 85, 105);
      else doc.setTextColor(159, 18, 57);
      doc.text(statusLabel, margin + contentWidth - 3.5, y + 5, { align: 'right' });

      y += 11.5;

      // Question stem
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      for (const line of qStemLines) {
        ensureSpace(5);
        doc.text(line, margin + 2, y);
        y += 4.7;
      }
      y += 1.5;

      // Options A-D
      doc.setFontSize(9.2);
      for (const opt of optionBlocks) {
        ensureSpace(opt.lines.length * 4.3 + 2);
        if (opt.isCorrectOpt) {
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(6, 95, 70);
        } else if (opt.isUserOpt && !opt.isCorrectOpt) {
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(159, 18, 57);
        } else {
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(51, 65, 85);
        }

        for (const line of opt.lines) {
          doc.text(line, margin + 5, y);
          y += 4.3;
        }
        y += 1.2;
      }

      y += 1;

      // Clinical Rationale callout box
      const rationaleBoxHeight = rationaleLines.length * 4.3 + 6;
      ensureSpace(rationaleBoxHeight + 3);
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(margin + 2, y, contentWidth - 4, rationaleBoxHeight, 1.5, 1.5, 'FD');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);
      let ry = y + 4.8;
      rationaleLines.forEach((line, lineIdx) => {
        if (lineIdx === 0 && line.startsWith('Clinical Rationale:')) {
          const prefix = 'Clinical Rationale:';
          const rest = line.slice(prefix.length);
          doc.setFont('helvetica', 'bold');
          doc.text(prefix, margin + 5.5, ry);
          const prefixWidth = doc.getTextWidth(prefix);
          doc.setFont('helvetica', 'normal');
          doc.text(rest, margin + 5.5 + prefixWidth, ry);
        } else {
          doc.setFont('helvetica', 'normal');
          doc.text(line, margin + 5.5, ry);
        }
        ry += 4.3;
      });

      y += rationaleBoxHeight + 7;
    }
  }

  // -------------------------------------------------------------------------
  // 5. Page Footers Across All Pages
  // -------------------------------------------------------------------------
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 13, margin + contentWidth, pageHeight - 13);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(
      'JIPIME TNMCLE PREPARATION TO DECEMBER · TNMC RN005-2015 Study Record',
      margin,
      pageHeight - 8.5
    );
    doc.text(`Page ${i} of ${totalPages}`, margin + contentWidth, pageHeight - 8.5, {
      align: 'right',
    });
  }

  doc.save(buildSafeFilename(attempt.config.title, scope, submittedAtMs));
}

export function exportHistoryEntryToPdf(
  entry: AttemptHistoryEntry,
  options: PdfExportOptions = {}
): void {
  if (!entry.questionIds || !entry.answers) return;
  const reconstructed: ExamAttemptState = {
    sessionId: entry.sessionId,
    config: {
      mode: entry.mode,
      title: entry.title,
      questionIds: entry.questionIds,
      durationSeconds: entry.timeSpentSeconds,
      shuffleQuestions: false,
      passThresholdPercent: entry.passThresholdPercent ?? 50,
    },
    answers: entry.answers,
    flagged: entry.flagged ?? [],
    hintsViewed: entry.hintsViewed ?? [],
    currentIndex: 0,
    remainingSeconds: 0,
    startedAt: entry.submittedAt - entry.timeSpentSeconds * 1000,
    submittedAt: entry.submittedAt,
    status: 'submitted',
  };
  exportExamResultsToPdf(reconstructed, options);
}
