import { ExamQuestion, SectionId, SectionInfo } from '../types/exam';
import { QUESTIONS_PART_1 } from './questionsPart1';
import { QUESTIONS_PART_2 } from './questionsPart2';

export const EXAM_METADATA = {
  council: 'Tanzania Nursing and Midwifery Council (TNMC)',
  examTitle: 'Licensure Examination for Registered Nurses',
  paperCode: 'RN005-2015',
  totalQuestions: 189,
  recommendedFullDurationMinutes: 180,
  passThresholdPercent: 50,
  note: 'Questions 1–189 reflect the complete 28-page TNMCLE RN005-2015 exam paper.',
};

export const SECTIONS: SectionInfo[] = [
  {
    id: 'A',
    code: 'RBN 201',
    title: 'Basic Nursing',
    questionRange: [1, 30],
    description: 'Foundational nursing care, infection prevention, therapeutic communication, and emergency first aid.',
  },
  {
    id: 'B',
    code: 'RMS 202',
    title: 'Medical Surgical Nursing',
    questionRange: [31, 74],
    description: 'Perioperative management, acute medical-surgical conditions, cardiology, orthopedics, and HIV care.',
  },
  {
    id: 'C',
    code: 'RCN 203',
    title: 'Community Health Nursing',
    questionRange: [75, 94],
    description: 'Epidemiology, biostatistics, disease outbreak surveillance, health education, and primary health care.',
  },
  {
    id: 'D',
    code: 'RMC 204',
    title: 'Midwifery and Child Health',
    questionRange: [95, 138],
    description: 'Antenatal care, labor & delivery, obstetric emergencies, neonatology, immunization, and RCH services.',
  },
  {
    id: 'E',
    code: 'RMN 205',
    title: 'Mental Health Nursing',
    questionRange: [139, 182],
    description: 'Psychiatric emergencies, therapeutic communication, psychopharmacology, and community mental health.',
  },
  {
    id: 'F',
    code: 'RLM 206',
    title: 'Leadership and Management',
    questionRange: [183, 189],
    description: 'Health budgeting, quality assurance, supportive supervision, supply chain, and HR management.',
  },
];

export const ALL_QUESTIONS: ExamQuestion[] = [...QUESTIONS_PART_1, ...QUESTIONS_PART_2];

export const QUESTION_MAP: Record<number, ExamQuestion> = ALL_QUESTIONS.reduce(
  (acc, q) => {
    acc[q.id] = q;
    return acc;
  },
  {} as Record<number, ExamQuestion>
);

export function getSectionInfo(sectionId: SectionId): SectionInfo {
  return SECTIONS.find((s) => s.id === sectionId) ?? SECTIONS[0];
}

export function getQuestionsBySection(sectionId: SectionId): ExamQuestion[] {
  return ALL_QUESTIONS.filter((q) => q.section === sectionId);
}
