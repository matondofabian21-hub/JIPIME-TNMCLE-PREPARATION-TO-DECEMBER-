import { SectionId } from '../types/exam';

export interface FormulaItem {
  title: string;
  formula: string;
  whenToApply: string;
}

export const SECTION_FORMULAS: Record<SectionId, FormulaItem[]> = {
  A: [
    {
      title: 'NANDA-I Nursing Diagnosis Formula',
      formula: 'Diagnostic Label + "related to" [Etiology / Cause] + "as evidenced by" [Cues]',
      whenToApply:
        'Use when selecting the accurate 2-part or 3-part nursing diagnosis (e.g., airway clearance vs. symptoms like restlessness).',
    },
    {
      title: 'Emergency ABCDE & Drowning Priority',
      formula: 'Airway (Patency) → Breathing (Pulmonary Ventilation) → Circulation (Compressions)',
      whenToApply:
        'In drowning or respiratory arrest, restore oxygenation via rescue ventilation before other interventions.',
    },
    {
      title: 'Tanzania IPC Waste Segregation',
      formula: 'Black = Non-infectious general · Yellow = Infectious · Red = Highly infectious / Pathological',
      whenToApply:
        'Applies to ward waste disposal questions and safe handling of clinical materials.',
    },
    {
      title: 'Intracranial & Transfer Safety Rules',
      formula: 'Post-Thoracentesis → Fowler’s | Bed-to-Chair → Dangle legs first | Needle Prick → Wash with running water',
      whenToApply:
        'Use when sequencing immediate bedside nursing actions and post-procedure positioning.',
    },
  ],
  B: [
    {
      title: 'Parkland Burn Resuscitation Formula',
      formula: 'Total 24h Fluid (mL) = 4 mL × Body Weight (kg) × %TBSA Burn (50% in first 8h, 50% in next 16h)',
      whenToApply:
        'Applies to burn fluid resuscitation calculations; always secure Airway + Analgesia first in acute burns.',
    },
    {
      title: 'IV Infusion Drip Rate Formula',
      formula: 'Drops / min = [Total Volume (mL) × Drop Factor (gtt/mL)] ÷ Time (minutes)',
      whenToApply:
        'Used for calculating intravenous fluid replacement in intestinal obstruction, shock, and surgical care.',
    },
    {
      title: 'Mean Arterial Pressure & Cerebral Perfusion',
      formula: 'MAP = [SBP + 2(DBP)] ÷ 3   |   CPP = MAP − ICP',
      whenToApply:
        'Applies to hemodynamic shock monitoring, head injury ICP management (Mannitol), and cardiac perfusion.',
    },
    {
      title: 'Surgical & Acute Medical Priorities',
      formula: 'Post-Laparotomy Oral Intake = Wait for Gag Reflex | Acute Asthma = Short-acting Bronchodilator First',
      whenToApply:
        'Guides priority nursing actions in perioperative care, rectal surgery, and acute respiratory distress.',
    },
  ],
  C: [
    {
      title: 'Proportion / Birth Percentage Formula',
      formula: 'Percentage (%) = (Part ÷ Comparison Base) × 100',
      whenToApply:
        'Applies directly to ratio/percentage questions (e.g., percentage of male births to female births).',
    },
    {
      title: 'Statistical Range Formula',
      formula: 'Range = Maximum Value − Minimum Value',
      whenToApply:
        'Extract only the required reading (e.g., diastolic DBP values after the slash), then subtract lowest from highest.',
    },
    {
      title: 'Median of Ungrouped Data',
      formula: 'Sort ascending → Odd n: value at (n + 1) ÷ 2 | Even n: average of n/2 and (n/2 + 1) values',
      whenToApply:
        'Always arrange epidemiological observations (e.g., school absenteeism days) in ascending order before locating the middle.',
    },
    {
      title: 'Epidemiological Research Sequence',
      formula: 'Identify Problem → Literature Review → Study Design → Data Collection → Analysis → Conclusions → Disseminate',
      whenToApply:
        'Use for community health study design questions and differentiating observational vs. experimental trials.',
    },
  ],
  D: [
    {
      title: "Naegele's Rule for Expected Date of Delivery (EDD)",
      formula: 'EDD = First Day of LNMP + 7 days − 3 months (+ 1 year), adjusted for cycle length & regularity',
      whenToApply:
        'Requires LNMP date, cycle length, and regularity of menstrual cycle to calculate EDD accurately.',
    },
    {
      title: 'Normal Full-Term Newborn Benchmarks',
      formula: 'Weight ≥ 2.5 kg (2.5–4.0 kg) · Length ≈ 50 cm · Head Circumference ≈ 34 cm · RR 30–60 / min',
      whenToApply:
        'Use when teaching primigravida mothers normal term infant parameters or assessing newborn respiratory status.',
    },
    {
      title: 'Active Management of 3rd Stage of Labor (AMTSL)',
      formula: '1. Oxytocin (within 1 min) → 2. Controlled Cord Traction (Push uterus UP, pull cord DOWN) → 3. Uterine Massage',
      whenToApply:
        'Prevents uterine inversion and primary postpartum hemorrhage (PPH); clamp/cut cord after pulsations stop.',
    },
    {
      title: 'Severe Pre-Eclampsia & Obstetric Referral Rule',
      formula: 'Antihypertensive (Aldomet) + Anticonvulsant (MgSO₄ loading dose) → Urgent Hospital Referral',
      whenToApply:
        'MgSO₄ prevents eclamptic seizures; refer all third-trimester vaginal bleeding or suspected molar pregnancies from dispensary level.',
    },
  ],
  E: [
    {
      title: 'Suicide Lethality Assessment Triad',
      formula: 'Prior High-Lethality Attempt + Recent Major Loss + Current Lethal Means Access = Very High Imminent Risk',
      whenToApply:
        'Evaluates suicidal risk severity (e.g., patient with prior attempt, bereavement, and stored pesticides).',
    },
    {
      title: 'Delirium vs. Dementia Differentiation',
      formula: 'Delirium = Acute rapid onset + fluctuating consciousness | Dementia = Insidious gradual onset + clear early sensorium',
      whenToApply:
        'Core organic psychiatric assessment distinction for nursing students and clinical triage.',
    },
    {
      title: 'Antipsychotic Receptor & Side-Effect Rule',
      formula: 'D2 Blockade (Haloperidol / Chlorpromazine) → Targets Positive Symptoms (Hallucinations/Delusions) → Watch for EPS',
      whenToApply:
        'Typical antipsychotics treat positive psychotic symptoms and cause Extrapyramidal Symptoms (acute dystonia, akathisia).',
    },
    {
      title: 'Therapeutic De-escalation & Safety Rule',
      formula: 'Safety First (Command Hallucinations) + Calm Clear Statements + Validate Feelings (Never Argue or Threaten)',
      whenToApply:
        'Applies to aggressive, manic, catatonic, paranoid, and severely anxious psychiatric patients.',
    },
  ],
  F: [
    {
      title: 'Donabedian Quality Assurance Triad',
      formula: 'Healthcare Quality = Structure (Resources/Facilities) + Process (Care Delivery) + Outcome (Patient Results)',
      whenToApply:
        'Standard framework for evaluating daily nursing care quality in a clinical ward.',
    },
    {
      title: 'Nonhuman Resource Supply Chain Cycle',
      formula: 'Ordering → Receiving → Storing → Issuing → Controlling',
      whenToApply:
        'Follows logical procurement-to-inventory-control sequence for hospital supplies and equipment.',
    },
    {
      title: 'Hospital Budget Classification Formula',
      formula: 'Capital Budget = Buildings/Ambulance/Fixed Assets · Operational = Daily Supplies · Personnel = Salaries/Staffing',
      whenToApply:
        'Select Capital Budget for long-term construction or major equipment acquisitions.',
    },
    {
      title: 'Strategic Planning Hierarchy',
      formula: 'Goal / Objective (Broad improvement) → Activity (Concrete actionable task) → Indicator (Measurable count)',
      whenToApply:
        'Distinguishes concrete operational activities (e.g., purchasing kits) from indicators or broad objectives.',
    },
  ],
};
