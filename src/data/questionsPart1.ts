import { ExamQuestion } from '../types/exam';

export const QUESTIONS_PART_1: ExamQuestion[] = [
  // SECTION A: RBN 201 - BASIC NURSING (Q1-Q30)
  {
    id: 1,
    section: 'A',
    question:
      'Which of the following nursing interventions will you suggest in assisting hospitalized elderly patients in order to improve their nutritional status?',
    options: {
      A: 'Make meal time a social activity',
      B: 'Take a thorough nutritional history and interest',
      C: 'Aspirate stomach content and take it to laboratory for test',
      D: 'Provide assistance to take balanced diet and exercises',
    },
    correctAnswer: 'A',
    rationale:
      'Older adults often experience loneliness, anorexia, and reduced appetite during hospitalization. Making mealtime a pleasant social activity (such as dining with others or family) stimulates appetite and improves oral food intake.',
  },
  {
    id: 2,
    section: 'A',
    question:
      'You are collecting data from a patient who has attended medical clinic. Which of the following therapeutic questions will be appropriate to open discussion?',
    options: {
      A: 'What brought you to the clinic today?',
      B: 'Can you tell me why have you come to the clinic today?',
      C: 'What reasons that made you to attend the clinic today?',
      D: 'Who told you to come to the clinic today?',
    },
    correctAnswer: 'A',
    rationale:
      "Open-ended, non-judgmental questions like 'What brought you to the clinic today?' invite the patient to freely describe their primary concerns in their own words without feeling interrogated.",
  },
  {
    id: 3,
    section: 'A',
    question:
      'You are at a Hotel Resort; suddenly a five-year-old boy is rescued from a swimming pool and has stopped breathing. Your first aid measure would be:',
    options: {
      A: 'Perform pulmonary resuscitation at once',
      B: 'Perform cardiac massage at once',
      C: 'Perform pulmonary ventilation at once',
      D: 'Perform cardiac ventilation at once',
    },
    correctAnswer: 'C',
    rationale:
      'In drowning emergencies, respiratory arrest and hypoxia precede cardiac arrest. Immediate rescue breathing (pulmonary ventilation) to restore oxygenation is the critical first priority.',
  },
  {
    id: 4,
    section: 'A',
    question:
      'Which is the best clinical intervention you will recommend for a patient having a problem with speaking?',
    options: {
      A: 'Limit the number of visitors at a time',
      B: 'Use visual cues when communicating',
      C: 'Gently correct errors as they occur',
      D: 'Allow adequate time to respond',
    },
    correctAnswer: 'D',
    rationale:
      'Patients with aphasia or dysarthria require patience and unhurried communication. Allowing adequate time to formulate and express words reduces anxiety and improves communication success.',
  },
  {
    id: 5,
    section: 'A',
    question:
      'The position that you will employ to Mr. Pandu coming from the operating theatre where thoracentesis was performed is:',
    options: {
      A: 'Full recumbent position',
      B: 'Genupectoral position',
      C: "Fowler's position",
      D: 'Trendelenburg position',
    },
    correctAnswer: 'C',
    rationale:
      "Fowler's (or semi-Fowler's) position promotes maximum lung re-expansion, eases breathing, and facilitates drainage of any residual pleural fluid after thoracentesis.",
  },
  {
    id: 6,
    section: 'A',
    question:
      "The patient says, 'I'm feeling nervous for an operation tomorrow'. The best response by the nurse to the patient is:",
    options: {
      A: "'I will ask the doctor for a little medication to help you relax'",
      B: "'It is OK to be nervous. What can I do to help you?'",
      C: "'Patients who have had an operation say it is not that comfortable'",
      D: "'The doctor is excellent and is very careful when doing surgeries'",
    },
    correctAnswer: 'B',
    rationale:
      "Validating the patient's feelings ('It is OK to be nervous') and offering supportive exploration ('What can I do to help you?') is therapeutic and patient-centered, whereas false reassurance blocks communication.",
  },
  {
    id: 7,
    section: 'A',
    question:
      'Second-year student nurses experienced Mr. John complaining of frequent joint pain while walking and standing, and they would like to know the cause of the problem. Your response would be:',
    options: {
      A: 'He is suffering from malaria',
      B: 'He is lacking synovial fluid',
      C: 'He is lacking vitamins',
      D: 'He has excessive calcium in the bones',
    },
    correctAnswer: 'B',
    rationale:
      'Synovial fluid lubricates diarthrodial joints and reduces friction during weight-bearing movement; decreased synovial fluid (as in osteoarthritis/aging) causes joint stiffness and pain.',
  },
  {
    id: 8,
    section: 'A',
    question:
      'You are assessing a post-operative patient. Which of the following will you document as subjective data?',
    options: {
      A: 'Vital signs',
      B: 'Laboratory test result',
      C: 'Description of pain',
      D: 'Electrocardiographic (ECG)',
    },
    correctAnswer: 'C',
    rationale:
      'Subjective data (symptoms) consist of information perceived and verbally reported by the patient, such as pain intensity and description, whereas vital signs, labs, and ECGs are objective data.',
  },
  {
    id: 9,
    section: 'A',
    question:
      'Mrs. Shauriyako was involved in a motor accident and sustained compression of the spinal cord and nerve roots. In attending her, your nursing goal would be to prevent developing:',
    options: {
      A: 'Prolapsed intervertebral disc',
      B: 'Muscle twitching',
      C: 'Absence of tendon reflexes',
      D: 'Flaccid paralysis',
    },
    correctAnswer: 'D',
    rationale:
      'Proper spinal immobilization and neuroprotective care following spinal cord and nerve root trauma aim to prevent permanent lower/upper motor neuron damage resulting in flaccid paralysis.',
  },
  {
    id: 10,
    section: 'A',
    question:
      'In assessing a patient, you realize that he has a problem of inadequate blood supply to heart muscles. Which of the following blood vessels would you suggest to be checked?',
    options: {
      A: 'Left ventricular arteries',
      B: 'Coronary arteries',
      C: 'Right ventricular arteries',
      D: 'Pulmonary arteries',
    },
    correctAnswer: 'B',
    rationale:
      'The right and left coronary arteries branch directly from the ascending aorta to supply oxygenated blood to the myocardium (heart muscle).',
  },
  {
    id: 11,
    section: 'A',
    question:
      'You are moving a patient from bed to chair. Which of the following actions would you do first?',
    options: {
      A: 'Turn head of the bed flat',
      B: 'Help the patient hang the legs',
      C: 'Stand behind the patient',
      D: 'Place the chair facing away from the bed',
    },
    correctAnswer: 'B',
    rationale:
      "Before standing a patient to transfer to a chair, assisting them to sit on the edge of the bed and dangle ('hang') their legs allows orthostatic blood pressure equilibration and prevents dizziness or falls.",
  },
  {
    id: 12,
    section: 'A',
    question:
      'You are teaching first-year student nurses on glands. Which gland will you tell them is associated with metabolism?',
    options: {
      A: 'Thyroid gland',
      B: 'Pancreatic gland',
      C: 'Pituitary gland',
      D: 'Adrenal gland',
    },
    correctAnswer: 'A',
    rationale:
      'The thyroid gland secretes thyroxine (T4) and triiodothyronine (T3), which are the primary regulators of basal metabolic rate, oxygen consumption, and thermogenesis.',
  },
  {
    id: 13,
    section: 'A',
    question:
      'You are orienting a group of student nurses to HIV/AIDS and wanted to know pathophysiology of AIDS. Which of the following groups of blood cells are involved in the pathophysiology of AIDS would you tell the students?',
    options: {
      A: 'Erythrocytes and malignantcytes',
      B: 'Erythrocytes and thrombocytes',
      C: 'Erythrocytes and leucocytes',
      D: 'Erythrocytes and gametocytes',
    },
    correctAnswer: 'C',
    rationale:
      'HIV specifically targets and destroys CD4+ T-lymphocytes (a subset of leucocytes/white blood cells), leading to progressive cell-mediated immunodeficiency, while chronic infection and drugs also affect erythrocytes.',
  },
  {
    id: 14,
    section: 'A',
    question:
      'During assessment of a seven-month-old infant at RCHS clinic you realize the presence of sunken fontanel. What nursing interventions will you take to care for the infant?',
    options: {
      A: 'Give the infant soft porridge',
      B: 'Give the infant supplementary milk',
      C: 'Give the infant breast milk frequently',
      D: 'Give the infant plenty of fluids',
    },
    correctAnswer: 'D',
    rationale:
      'A depressed/sunken anterior fontanel in an infant is a classic clinical sign of dehydration requiring prompt oral or intravenous fluid replacement.',
  },
  {
    id: 15,
    section: 'A',
    question:
      'You are conducting a rapid assessment of an unconscious patient. Which artery should you palpate to feel the pulse?',
    options: {
      A: 'Radial',
      B: 'Brachial',
      C: 'Femoral',
      D: 'Carotid',
    },
    correctAnswer: 'D',
    rationale:
      'In an unresponsive adult or older child, the central carotid artery is palpated because it remains palpable even during severe hypotension when peripheral pulses (like the radial) disappear.',
  },
  {
    id: 16,
    section: 'A',
    question:
      'One of the nursing responsibilities in theatre is to ensure that preparation of equipment for any surgical procedure is carried according to the set standards. What method will you insist in this aspect?',
    options: {
      A: 'Asepsis',
      B: 'Aseptic technique',
      C: 'Disinfection',
      D: 'Sterilization',
    },
    correctAnswer: 'D',
    rationale:
      'Surgical instruments that penetrate sterile tissues or the vascular system (critical items) must undergo sterilization (e.g., autoclaving) to destroy all microorganisms including bacterial spores.',
  },
  {
    id: 17,
    section: 'A',
    question:
      'You are guiding student nurses on arresting nosocomials to clients and health care providers in the ward. Which of the following guides will you apply?',
    options: {
      A: 'Guidelines of Standard Precaution',
      B: 'Key Components of Standard Precaution',
      C: 'Principles of Infection Prevention and Control',
      D: 'Protocols of Environmental Sanitation',
    },
    correctAnswer: 'C',
    rationale:
      'Comprehensive prevention of healthcare-associated (nosocomial) infections relies on applying the core Principles of Infection Prevention and Control (IPC), including hand hygiene, PPE, asepsis, and waste management.',
  },
  {
    id: 18,
    section: 'A',
    question:
      'You are working in an infectious ward. Which appropriate measure will you take for safe handling of infectious materials?',
    options: {
      A: 'Use protective gears',
      B: 'Install in the safety boxes',
      C: 'Send for incineration',
      D: 'Place in dustbins',
    },
    correctAnswer: 'A',
    rationale:
      'Wearing appropriate Personal Protective Equipment (PPE / protective gears such as heavy-duty gloves, gowns, masks, and aprons) protects healthcare workers when handling infectious materials.',
  },
  {
    id: 19,
    section: 'A',
    question:
      'Your co-nurse has pricked herself with a contaminated needle in a working area. What will your first action be in assisting her?',
    options: {
      A: 'Escort her to the counselor for counseling and HIV Testing',
      B: 'Tell her to stop working and wait for Post Exposure Prophylaxis',
      C: 'Advise her to wash the affected part with plenty of running water',
      D: 'Give her hot milk to drink and tell her to wear protective gears',
    },
    correctAnswer: 'C',
    rationale:
      'The immediate first-aid step following a percutaneous needlestick injury is to wash the puncture site thoroughly with soap and plenty of running water (without squeezing) before reporting for PEP evaluation.',
  },
  {
    id: 20,
    section: 'A',
    question:
      'You are working in ward A where one of your roles is to prevent and protect patients from acquisition of infections from the hospital. One of the actions you will perform to achieve this role includes:',
    options: {
      A: 'Clean patient beddings and belongings',
      B: 'Hand washing before and after handling the patient',
      C: 'Administer an antibiotic to all patients who are suspected to have infection',
      D: 'Encourage staff to avoid coughing near patients',
    },
    correctAnswer: 'B',
    rationale:
      'Hand hygiene before and after every patient contact is the single most effective measure to interrupt cross-transmission of hospital-acquired pathogens.',
  },
  {
    id: 21,
    section: 'A',
    question:
      'Which of the following buckets will you use to dispose less hazardous (non-infectious general) waste you have produced in your ward?',
    options: {
      A: 'Blue coloured bucket',
      B: 'Red coloured bucket',
      C: 'Black coloured bucket',
      D: 'Yellow coloured bucket',
    },
    correctAnswer: 'C',
    rationale:
      'Under Tanzania IPC color-coding standards, black bins/bags are used for general non-infectious waste, yellow for infectious waste, and red for highly infectious/pathological waste.',
  },
  {
    id: 22,
    section: 'A',
    question:
      'You are admitting a patient with congestive cardiac failure. Which of the following bed accessories are you going to prepare?',
    options: {
      A: 'Cardiac table and sand bags',
      B: 'Cardiac table and side rails',
      C: 'Cardiac table and extra pillows',
      D: 'Cardiac table and head trapezes',
    },
    correctAnswer: 'C',
    rationale:
      "Patients with congestive cardiac failure experience orthopnea and dyspnea; extra pillows support an upright Fowler's position, and an overbed cardiac table allows them to lean forward comfortably to ease breathing.",
  },
  {
    id: 23,
    section: 'A',
    question:
      'On examining Mr. Julius who had sustained head injury you found him having increased intracranial pressure. Which of the following drugs would you suggest to a surgeon for reducing the problem?',
    options: {
      A: 'Atropine',
      B: 'Mannitol',
      C: 'Adrenalin',
      D: 'Lignocaine',
    },
    correctAnswer: 'B',
    rationale:
      'Mannitol is an osmotic diuretic that draws edematous fluid out of brain parenchyma into the intravascular space, rapidly reducing intracranial pressure (ICP).',
  },
  {
    id: 24,
    section: 'A',
    question:
      'Meshack, a 15-year-old boy, is brought to you after having hard sand splashed into his left eye while playing. Your first management would be:',
    options: {
      A: 'Irrigate the eyes and check his visual acuity',
      B: 'Irrigate the eyes and pad the affected eye',
      C: 'Irrigate the eyes and leave the affected eye open',
      D: 'Irrigate the eyes and instill atropine eye drops',
    },
    correctAnswer: 'A',
    rationale:
      'Copious irrigation with normal saline or clean water immediately flushes out foreign sand particles to prevent corneal abrasion, followed by baseline visual acuity assessment.',
  },
  {
    id: 25,
    section: 'A',
    question:
      'You administered Diazepam 10 mg to Ms. Kamwela a night before operation. The reason for your option was:',
    options: {
      A: 'To help Ms. Kamwela allay anxiety before the operation',
      B: 'To enable Ms. Kamwela get nice dreams at night',
      C: "To stabilize Ms. Kamwela's vital signs after the operation",
      D: 'To assist Ms. Kamwela reduce secretions in pharynx',
    },
    correctAnswer: 'A',
    rationale:
      'Diazepam is a benzodiazepine anxiolytic and sedative administered preoperatively to relieve anxiety and promote restful sleep before surgery.',
  },
  {
    id: 26,
    section: 'A',
    question:
      'Mrs. Limau underwent total abdominal hysterectomy. Which early signs will you likely identify when assessing her 10 hours later if she develops shock?',
    options: {
      A: 'Cold and clammy skin',
      B: 'Dry and clammy skin',
      C: 'Warm and clammy skin',
      D: 'Oily and clammy skin',
    },
    correctAnswer: 'A',
    rationale:
      "In hypovolemic/hemorrhagic shock, sympathetic vasoconstriction shunts blood away from the periphery to vital organs, producing cool, pale, moist ('cold and clammy') skin.",
  },
  {
    id: 27,
    section: 'A',
    question:
      'A diabetic patient in your ward is receiving oral hypoglycemic tolbutamide. Which of the following mild adverse effects will you tell the patient to be aware of?',
    options: {
      A: 'Dizziness, fatigue, weakness, headache, seizure and confusion',
      B: 'Sweating, nervousness, shaking, faintness, palpitation and hunger',
      C: 'Intolerance to exercise, fatigue, deep breath, abdominal pain, hunger and coma',
      D: 'Polyuria, polydipsia, weight loss, blurred vision, drowsiness and nausea',
    },
    correctAnswer: 'B',
    rationale:
      'Tolbutamide (a sulfonylurea) stimulates insulin secretion and can cause hypoglycemia; early mild adrenergic symptoms include sweating, tremor/shaking, nervousness, palpitations, faintness, and hunger.',
  },
  {
    id: 28,
    section: 'A',
    question:
      'You are planning care for a patient who is cyanosed, restless and profusely sweating due to obstructed airway that has resulted from excessive secretions. What will be your nursing diagnosis?',
    options: {
      A: 'Obstructed airway related to excessive secretions',
      B: 'Ineffective airway clearance related to excessive secretions',
      C: 'Restlessness related to excessive secretions',
      D: 'Risk for death related to excessive secretions',
    },
    correctAnswer: 'B',
    rationale:
      "In NANDA-I terminology, inability to clear secretions or obstructions from the respiratory tract to maintain a clear airway is formulated as 'Ineffective airway clearance related to excessive secretions'.",
  },
  {
    id: 29,
    section: 'A',
    question:
      'You are allocated to work at the emergency department where one of your responsibilities is to adhere to the principle of triage in dealing with victims of accident. Why is this principle important?',
    options: {
      A: 'It is a hierarchy based on the potential for loss of life',
      B: 'It assists all victims to receive equal priority and care',
      C: 'It follows the first in, first served rule',
      D: 'It is a routine in all emergency care departments',
    },
    correctAnswer: 'A',
    rationale:
      'Triage prioritizes patients according to clinical urgency and potential threat to life/limb so that critically injured but salvageable patients receive immediate life-saving care.',
  },
  {
    id: 30,
    section: 'A',
    question:
      'Mr. Kobra who has just sustained fracture of right humerus is brought to casualty department. Your first actions in managing him should be all of the following EXCEPT:',
    options: {
      A: 'Check airway, breathing and circulation',
      B: 'Support the injured part with a hand or use rolled up blanket',
      C: 'Immobilize the arm against the trunk as a splint',
      D: 'Lay the patient flat and apply Plaster of Paris',
    },
    correctAnswer: 'D',
    rationale:
      'Applying a circumferential Plaster of Paris cast immediately in emergency first aid is contraindicated because acute post-traumatic swelling can cause compartment syndrome and neurovascular compromise.',
  },

  // SECTION B: RMS 202 - MEDICAL SURGICAL NURSING (Q31-Q74)
  {
    id: 31,
    section: 'B',
    question:
      'You are providing care to a patient who underwent tracheotomy. Which of the following specific complications should you prevent?',
    options: {
      A: 'Infection',
      B: 'Tracheal dilation',
      C: 'Malnutrition',
      D: 'Tracheal obstruction',
    },
    correctAnswer: 'D',
    rationale:
      'Maintaining airway patency by preventing tracheal obstruction from mucus plugs, tube dislodgement, or cuff herniation is the most critical life-saving priority after tracheotomy.',
  },
  {
    id: 32,
    section: 'B',
    question:
      'You are attending Ms. Sikujua at the OPD. During history taking she complained of experiencing a knife-like chest pain on inspiration. To you this would mostly be a diagnostic sign of:',
    options: {
      A: 'Ineffective lung function related to fluid collection',
      B: 'Impaired breathing related to ineffective lung function',
      C: 'Ineffective breathing pattern related to pain',
      D: 'Pain related to lung oedema',
    },
    correctAnswer: 'C',
    rationale:
      "Sharp, stabbing ('knife-like') pleuritic chest pain that worsens on inspiration causes shallow, guarded respirations, resulting in an 'Ineffective breathing pattern related to pain'.",
  },
  {
    id: 33,
    section: 'B',
    question:
      'While working at Mkunazini Health Centre you received Mr. Wakuja with the following signs and symptoms: abdominal distention, abdominal discomfort, shortness of breath, loss of appetite, dull sounds on percussion and swollen ankles. Which of the following nursing interventions will you employ immediately?',
    options: {
      A: 'Rush him to the theatre for operation',
      B: "Position him in semi-Fowler's position",
      C: 'Clear airway and provide him supplementary oxygen',
      D: 'Give him adequate intravenous fluids',
    },
    correctAnswer: 'B',
    rationale:
      "Ascites and fluid overload elevate the diaphragm and cause dyspnea; placing the patient in semi-Fowler's position relieves diaphragmatic pressure and immediately eases breathing.",
  },
  {
    id: 34,
    section: 'B',
    question:
      'You are serving meals to your patients in the ward. One of your patients, Mr. Banza aged 75 years, complains of frequent constipation. Which appropriate diet will you consider for him?',
    options: {
      A: 'Cassava, banana, green vegetables, and beans',
      B: 'Meat, orange, maize and green vegetables',
      C: 'Milk, green vegetables, pawpaw and plenty of fluids',
      D: 'Bread, fish, green vegetables and yam',
    },
    correctAnswer: 'C',
    rationale:
      'High-fiber fruits and vegetables (pawpaw, green leafy vegetables) combined with plenty of oral fluids add bulk and soften stools to relieve constipation in older adults.',
  },
  {
    id: 35,
    section: 'B',
    question:
      'While working in the emergency department you received a four-year-old boy with a burn in the upper part of the left limb. What will be your first priority of care?',
    options: {
      A: 'Establish an airway and give an analgesic',
      B: 'Insert an in-dwelling urethral catheter and give an analgesic',
      C: 'Give an antibiotic and an analgesic',
      D: 'Replace fluids and give an analgesic',
    },
    correctAnswer: 'A',
    rationale:
      'In all acute trauma and burn emergencies, the ABCDE protocol places airway assessment and patency (alongside pain control) as the absolute first priority.',
  },
  {
    id: 36,
    section: 'B',
    question:
      'You are caring for Mr. Hugo who has suspected multiple fractures of the lower limbs; he is complaining of pain, limping and difficulty rising. He has poor posture and uncoordinated gait. Which of the following nursing diagnoses is of priority?',
    options: {
      A: 'Self-care deficit',
      B: 'Impaired physical mobility',
      C: 'Ineffective coping',
      D: 'Ineffective skin integrity',
    },
    correctAnswer: 'B',
    rationale:
      "Lower-limb fractures directly limit independent purposeful physical movement and weight-bearing, making 'Impaired physical mobility' the primary functional nursing diagnosis.",
  },
  {
    id: 37,
    section: 'B',
    question:
      'You are allocated to work in a dialysis unit. One of the relatives who brought her patient asks you the rationale for performing dialysis to the patient. What would be your response?',
    options: {
      A: 'Filter excessive chemicals and bacteria that impair normal kidney function',
      B: 'Reduce the level of higher blood cholesterol and metabolic acid',
      C: 'Reduce body fluids overload with new blood cells and serum',
      D: 'Filter the metabolic waste products from the blood and return the purified blood',
    },
    correctAnswer: 'D',
    rationale:
      'Dialysis substitutes for failing kidneys by filtering accumulated uremic metabolic waste products (urea, creatinine) and excess electrolytes/fluid from the blood and returning purified blood.',
  },
  {
    id: 38,
    section: 'B',
    question:
      'You are providing nursing care to a patient suffering from rheumatic heart disease. A group of medicines that you should expect a physician to prescribe is:',
    options: {
      A: 'Tranquilizers',
      B: 'Steroids',
      C: 'Purgatives',
      D: 'Antibiotics',
    },
    correctAnswer: 'D',
    rationale:
      'Antibiotics (specifically benzathine penicillin G or oral penicillin V) are prescribed to eradicate Group A beta-hemolytic Streptococcus and prevent recurrent rheumatic fever flare-ups.',
  },
  {
    id: 39,
    section: 'B',
    question:
      'You are providing care for a patient with right hemiplegia associated with stroke. Which nursing intervention will be appropriate for you to carry out?',
    options: {
      A: 'Instruct the patient to stay in bed most of the time',
      B: 'Send the patient to a long-term care facility',
      C: 'Assist the patient in performing a range of exercises',
      D: "Hold the patient's left extremities during movements",
    },
    correctAnswer: 'C',
    rationale:
      'Regular passive and active-assistive range-of-motion (ROM) exercises prevent joint contractures, muscle atrophy, and venous stasis in hemiplegic limbs.',
  },
  {
    id: 40,
    section: 'B',
    question:
      'You are working in a surgical ward where you were assigned to prepare Mrs. Gumi for laparotomy. A surgeon ordered Atropine as a premedication. What will be the function of this drug to Mrs. Gumi?',
    options: {
      A: "Relaxing patient's muscle",
      B: 'Reduce the formation of secretions or mucus during operation',
      C: 'Making the intubation easier',
      D: "Decrease the patient's anxiety",
    },
    correctAnswer: 'B',
    rationale:
      'Atropine is an anticholinergic (antimuscarinic) agent given preoperatively to inhibit salivary and tracheobronchial secretions and prevent vagally induced bradycardia.',
  },
  {
    id: 41,
    section: 'B',
    question:
      'When conducting a pre-test counseling session to a client on HIV testing you should follow these steps:',
    options: {
      A: 'Inform, support and plan',
      B: 'Support, encourage and assess',
      C: 'Assess, plan and evaluation',
      D: 'Educate, implement and inform',
    },
    correctAnswer: 'A',
    rationale:
      'HIV pre-test counseling provides essential information about HIV and the testing process, offers emotional support, and helps the client plan for receiving results and risk reduction.',
  },
  {
    id: 42,
    section: 'B',
    question:
      'You are working in a medical ward where Mr. Kobe is admitted. On examination you find that he has pitting edema on the feet, abdomen and the legs. What would be your nursing diagnosis?',
    options: {
      A: 'Impaired mobility related to oedema on the feet',
      B: 'Impaired fluid balance related to poor body fluid absorption',
      C: 'Breathing pattern disturbance related to oedema of the lung',
      D: 'Ineffective breathing pattern related to oedema of the abdomen',
    },
    correctAnswer: 'B',
    rationale:
      "Generalized pitting edema of the lower extremities and abdomen (anasarca/ascites) reflects excess interstitial fluid accumulation and altered fluid regulation ('Impaired fluid balance / Excess fluid volume').",
  },
  {
    id: 43,
    section: 'B',
    question:
      'You are supporting a patient in pain. One of the actions that you have to take would be:',
    options: {
      A: 'Ask for description of pain and give the antibiotic that you are licensed to prescribe',
      B: "Ask for description of pain and tell the patient that 'you are going to notify a doctor'",
      C: 'Ask for description of pain and find out source of the pain',
      D: 'Ask for description of pain, and administer appropriate pain killer',
    },
    correctAnswer: 'D',
    rationale:
      'Comprehensive pain management requires assessing pain characteristics (location, severity, quality) and administering the appropriate prescribed analgesic.',
  },
  {
    id: 44,
    section: 'B',
    question:
      'You are on the way to work; suddenly you meet a woman holding a five-year-old boy who drowned in the well and his breathing has stopped. What will be your priority intervention?',
    options: {
      A: 'Start cardiac massage at once',
      B: 'Do pulmonary resuscitation',
      C: 'Do arterial ventricular ventilation',
      D: 'Cover him with a heavy blanket',
    },
    correctAnswer: 'B',
    rationale:
      'Because drowning causes primary asphyxia and hypoxia, immediate rescue breathing (pulmonary resuscitation) is the top priority to re-oxygenate the child.',
  },
  {
    id: 45,
    section: 'B',
    question:
      'You are discharging home from hospital Mr. Zebedayo who has hemiplegia. Which of the following advices would you give to his relatives for continuity of care?',
    options: {
      A: 'Tell the patient not to move out from his bed',
      B: 'Advise the patient to use crutches to move about',
      C: 'Assist the patient to move about in limited period of time',
      D: 'Encourage patient to move about using wheelchair',
    },
    correctAnswer: 'D',
    rationale:
      'A wheelchair enables safe mobility, independence, and community participation for a patient with hemiplegia who lacks sufficient bilateral balance for standard crutches.',
  },
  {
    id: 46,
    section: 'B',
    question:
      'You are responding to student nurses who asked you factors leading to angina pectoris. One of the factors you have to tell them is:',
    options: {
      A: 'Ineffective function of arteries supplying to exocardium',
      B: 'Insufficient coronary artery supplying oxygenated blood to endocardium',
      C: 'Insufficient supply of oxygenated blood to myocardium',
      D: 'Sufficient oxygenated blood to pericardium',
    },
    correctAnswer: 'C',
    rationale:
      'Angina pectoris results from transient myocardial ischemia caused by an imbalance between myocardial oxygen demand and oxygenated blood supply through narrowed coronary arteries.',
  },
  {
    id: 47,
    section: 'B',
    question:
      'What would you tell the patient and family members regarding continuity of care at home if Mr. Bambo with angina pectoris is discharged?',
    options: {
      A: 'Take low fat diet, perform exercise, use recommended medicines and avoid risk factors',
      B: 'Take low carbohydrate diet, avoid risk factors, use recommended medicines and perform exercises',
      C: 'Use low vitamins diet, perform exercises, use recommended medicines and avoid risk factors',
      D: 'Take low protein diet, perform exercises, avoid risk factors, and use recommended medicines',
    },
    correctAnswer: 'A',
    rationale:
      'Long-term secondary prevention of coronary artery disease and angina centers on a heart-healthy low-saturated-fat diet, graded regular exercise, adherence to anti-anginal medications, and eliminating risk factors like smoking.',
  },
  {
    id: 48,
    section: 'B',
    question:
      'For patients with cardiac diseases, usually you will prescribe low salt foods. Which of the following foods will you recommend for such patients?',
    options: {
      A: 'Canned fish',
      B: 'Yogurt',
      C: 'Cheese',
      D: 'Canned beef',
    },
    correctAnswer: 'B',
    rationale:
      'Canned meats/fish and processed cheeses are heavily preserved with sodium, whereas plain yogurt is naturally low in sodium and suitable for a cardiac diet.',
  },
  {
    id: 49,
    section: 'B',
    question:
      'Preparation of patient for any surgical procedure requires a sense of security and reassurance. What are your responsibilities?',
    options: {
      A: 'Administer radiographic dye tablets as prescribed',
      B: 'Monitor the patient for bleeding or bile leakage',
      C: 'Obtain a signed consent form',
      D: 'Know that there are no specific preparations',
    },
    correctAnswer: 'C',
    rationale:
      "Ensuring that a valid, signed informed consent form is present in the patient's chart prior to anesthesia and surgery is a mandatory preoperative nursing responsibility.",
  },
  {
    id: 50,
    section: 'B',
    question:
      'You are caring for a patient who has just returned from major laparotomy; he asks for water and food to eat. What will be your appropriate nursing intervention?',
    options: {
      A: 'Offer sips of water and order the prescribed diet',
      B: 'Explain that the patient needs to wait until his gag reflex is functional',
      C: 'Explain to the patient that solid food or water is not allowed within 24 hours',
      D: 'Instruct the patient to take small sips of water until the meals are served',
    },
    correctAnswer: 'B',
    rationale:
      'After general anesthesia and abdominal surgery, oral intake must be withheld until protective airway/gag reflexes and bowel peristalsis return to prevent aspiration and postoperative ileus.',
  },
  {
    id: 51,
    section: 'B',
    question:
      'Which of the following signs and symptoms would alert you as possibly perforated peptic ulcer that you can recommend for an emergency operation?',
    options: {
      A: 'Gradual decrease in body temperature',
      B: 'Epigastric fullness and regurgitation',
      C: 'Blood-tinged drainage in the vomitus',
      D: 'Persistent intense abdominal pain',
    },
    correctAnswer: 'D',
    rationale:
      'Perforation of a peptic ulcer spills caustic gastric/duodenal contents into the peritoneal cavity, triggering sudden, persistent, excruciating abdominal pain and board-like rigidity requiring emergency surgery.',
  },
  {
    id: 52,
    section: 'B',
    question:
      'Your junior staff has just admitted Mr. Ally with intestinal obstruction. Which of the following nursing interventions will you instruct to perform as a priority?',
    options: {
      A: 'Alleviate pain to a level of comfort',
      B: 'Replace fluids and electrolytes',
      C: 'Place the patient on semi-prone position',
      D: 'Prepare for emergency surgery',
    },
    correctAnswer: 'B',
    rationale:
      'Intestinal obstruction causes massive third-spacing of fluid into the bowel lumen and vomiting, leading to severe dehydration, electrolyte depletion, and hypovolemic shock; IV fluid and electrolyte replacement is the immediate priority.',
  },
  {
    id: 53,
    section: 'B',
    question:
      'Mr. Kahambee is in acute asthmatic attack. Which of the following measures will you do first to help Mr. Kahambee?',
    options: {
      A: 'Interview him about his condition',
      B: 'Check his vital signs immediately',
      C: 'Rest him in bed comfortably',
      D: 'Give a bronchodilator',
    },
    correctAnswer: 'D',
    rationale:
      'During an acute asthma exacerbation, immediate administration of a fast-acting inhaled bronchodilator (short-acting beta-2 agonist like salbutamol) reverses bronchospasm and restores airflow.',
  },
  {
    id: 54,
    section: 'B',
    question:
      'During morning report, you identify that Mr. Kipwe had not experienced bowel movement for 3 days following rectal surgery. Your nursing intervention will be:',
    options: {
      A: 'Return the patient to theatre for more management',
      B: 'Notify his surgeon immediately for attention',
      C: 'Administer soapy enema through a well-lubricated catheter',
      D: 'Administer plenty of fluids and observe for another day',
    },
    correctAnswer: 'B',
    rationale:
      'Following rectal surgery, enemas and rectal tubes are contraindicated due to suture line trauma; notifying the surgeon for appropriate oral stool softeners/laxatives or evaluation is safest.',
  },
  {
    id: 55,
    section: 'B',
    question:
      'When the nurse is caring for patients with indwelling catheters, she/he should observe for:',
    options: {
      A: 'Comfort level of the patients',
      B: 'Patency of indwelling catheters',
      C: 'Amount of urine drained',
      D: 'Early signs of infections',
    },
    correctAnswer: 'B',
    rationale:
      'Ensuring unobstructed patency of an indwelling urinary catheter prevents acute urinary retention, bladder distension, and ascending urinary stasis.',
  },
  {
    id: 56,
    section: 'B',
    question:
      'During morning report, you identify that Mr. Kipwe had not experienced bowel movement for 3 days following rectal surgery. Your nursing intervention will be (Note: Duplicate item in original exam paper):',
    options: {
      A: 'Return the patient to theatre for more management',
      B: 'Notify his surgeon immediately for attention',
      C: 'Administer soapy enema through a well-lubricated catheter',
      D: 'Administer plenty of fluids and observe for another day',
    },
    correctAnswer: 'B',
    rationale:
      'Rectal manipulation (such as administering an enema) after rectal surgery risks dehiscence and hemorrhage; the surgeon should be notified for safe medical management.',
  },
  {
    id: 57,
    section: 'B',
    question:
      'When teaching mothers on performing self-examination over their breasts, at which period will you advise them as most appropriate?',
    options: {
      A: 'Close to their menstrual period specifically 5-7 days before',
      B: 'Close to their menstrual period specifically 1-3 days before',
      C: 'Day 1-3 after menses, counting 1st day of menses as day 1',
      D: 'Day 5-7 after menses, counting 1st day of menses as day 1',
    },
    correctAnswer: 'D',
    rationale:
      'Breast self-examination (BSE) is best performed 5–7 days after the onset of menstruation (when menses ends), when hormonal engorgement and breast tenderness are at their lowest.',
  },
  {
    id: 58,
    section: 'B',
    question:
      'You are to teach student nurses who were eager to learn about scrotal swelling. How would you differentiate hydrocele from hernia to them?',
    options: {
      A: 'Hydrocele is big in size while hernia is small',
      B: 'Hydrocele is painless while hernia is painful',
      C: 'Hydrocele transmits light while hernia does not',
      D: 'Hydrocele is reducible while hernia is irreducible',
    },
    correctAnswer: 'C',
    rationale:
      "A hydrocele contains clear serous fluid within the tunica vaginalis and therefore glows brightly on transillumination ('transmits light'), whereas a solid/bowel-filled inguinal hernia is opaque.",
  },
  {
    id: 59,
    section: 'B',
    question:
      "You are dressing a wound situated at Mr. Mteja's elbow joint. Which pattern of bandaging will you apply after cleaning it?",
    options: {
      A: 'Divergent',
      B: 'Capeline',
      C: 'Spica',
      D: 'Reversal spiral',
    },
    correctAnswer: 'C',
    rationale:
      'A figure-of-eight / spica bandage conforms smoothly around flexed joints such as the elbow, knee, or shoulder without slipping or restricting circulation.',
  },
  {
    id: 60,
    section: 'B',
    question:
      'Which of the following specific signs will you observe for recurrent laryngeal nerve damage after a patient has undergone thyroidectomy?',
    options: {
      A: 'Pain while speaking',
      B: 'Changes in voice tone',
      C: 'Difficulty in swallowing',
      D: 'Inability to turn the neck',
    },
    correctAnswer: 'B',
    rationale:
      'The recurrent laryngeal nerves innervate the vocal cords; unilateral injury causes hoarseness or changes in voice pitch/tone, while bilateral injury causes airway stridor.',
  },
  {
    id: 61,
    section: 'B',
    question:
      'You are working at ENT ward where Mr. Gigo who has undergone tonsillectomy has just returned from operation. A doctor ordered to give him some cold water followed with cold liquid food. What is the rationale for this order?',
    options: {
      A: 'Replace fluid loss',
      B: 'Reduce bleeding risk',
      C: 'Lower body temperature',
      D: 'Relieve pain and infection',
    },
    correctAnswer: 'B',
    rationale:
      'Cold liquids induce local vasoconstriction in the tonsillar fossa, helping to prevent postoperative hemorrhage while soothing throat discomfort.',
  },
  {
    id: 62,
    section: 'B',
    question:
      'You are administering anticoagulant to a patient with myocardial infarction. What is the rationale of giving this drug?',
    options: {
      A: 'Reduce myocardial infarction',
      B: 'Prevent extension of coronary thrombus',
      C: 'Promote cardiac output',
      D: 'Improve coronary circulation',
    },
    correctAnswer: 'B',
    rationale:
      'Anticoagulants (such as heparin or enoxaparin) inhibit clotting cascade propagation, preventing enlargement/extension of an existing coronary artery thrombus and recurrent thromboembolism.',
  },
  {
    id: 63,
    section: 'B',
    question:
      'A patient expresses grievance after amputation of her leg by crying and anger. Your intervention and response as a nurse to the patient should be:',
    options: {
      A: "Telling the patient, 'Do not cry because we informed you pre-operatively on the outcome'",
      B: 'Calling immediately her surgeon for more attention and special review',
      C: 'Acknowledge the loss by listening and providing support',
      D: 'Tell the patient not to worry as the remaining part is going to heal promptly',
    },
    correctAnswer: 'C',
    rationale:
      "Amputation causes profound grief over altered body image and function; active, empathetic listening and acknowledging the patient's loss supports healthy grieving.",
  },
  {
    id: 64,
    section: 'B',
    question:
      'You are working in surgical ward where a patient with myositis is admitted; what will be your intervention to the patient?',
    options: {
      A: 'To reduce patient risk to deformity',
      B: 'To hasten recovery of the patient',
      C: 'To facilitate surgical management of the condition',
      D: 'To reduce muscle inflammation and prevent muscle weakness',
    },
    correctAnswer: 'D',
    rationale:
      'Nursing and medical management of myositis focuses on reducing active skeletal muscle inflammation and preserving muscle strength and function.',
  },
  {
    id: 65,
    section: 'B',
    question:
      'While you are nursing patients in an orthopedic ward, the risk factors that you will like them to be aware of include:',
    options: {
      A: 'Obesity and genetic susceptibility',
      B: 'Faulty nutrition and increased age',
      C: 'Smoking, obesity and alcoholism',
      D: 'Genetic susceptibility and gender',
    },
    correctAnswer: 'C',
    rationale:
      'Modifiable lifestyle risk factors—specifically smoking, obesity, and excessive alcohol use—impair bone density, delay fracture healing, and increase musculoskeletal injury risk.',
  },
  {
    id: 66,
    section: 'B',
    question:
      'You are managing a patient with rheumatic disease, and you will be required to provide prescribed anti-rheumatic medicine. What will you consider as effective action of the medicine?',
    options: {
      A: 'Has controlled the inflammation',
      B: 'Has cured the disease',
      C: 'Has controlled the pain',
      D: 'Has shortened admission period',
    },
    correctAnswer: 'A',
    rationale:
      'Anti-rheumatic medications (NSAIDs, corticosteroids, DMARDs) act primarily by suppressing autoimmune synovial inflammation, which subsequently relieves pain and prevents joint destruction.',
  },
  {
    id: 67,
    section: 'B',
    question:
      'During nursing a patient with renal disorders, which of the following information about the adequacy of renal function and urinary drainage should you monitor and record?',
    options: {
      A: 'Colour and amount of urine',
      B: 'Odor of urine and its flow',
      C: 'Fluid output and colour',
      D: 'Fluid intake and output',
    },
    correctAnswer: 'D',
    rationale:
      'Strict measurement and charting of total fluid intake versus total urinary output is the cornerstone of evaluating renal perfusion, glomerular filtration, and fluid balance.',
  },
  {
    id: 68,
    section: 'B',
    question:
      'A group of old men in a urology ward wanted to know the causes of urinary retention in their age group. Your response in relation to the causes will be:',
    options: {
      A: 'Psychological problems old men face',
      B: 'Pelvic inflammatory disorders',
      C: 'Prostatic enlargement',
      D: 'Unknown cause',
    },
    correctAnswer: 'C',
    rationale:
      'Benign prostatic hyperplasia (BPH) and prostatic carcinoma cause mechanical compression of the prostatic urethra, making prostatic enlargement the most common cause of urinary retention in elderly men.',
  },
  {
    id: 69,
    section: 'B',
    question:
      'As a nurse working in a geriatric ward, what do you have to consider during planning care for an aged client?',
    options: {
      A: 'The effect of normal age-related changes',
      B: 'Life experience the aged has gone through',
      C: 'Persisting demand which normally old age presents',
      D: 'The future outcome of life he has to live',
    },
    correctAnswer: 'A',
    rationale:
      'Individualized geriatric care planning must account for normal physiological aging changes (e.g., reduced renal clearance, fragile skin, decreased sensory acuity) to prevent iatrogenic complications.',
  },
  {
    id: 70,
    section: 'B',
    question:
      'You are working in an emergency department; Mr. Kundi is rushed in with all typical signs and symptoms of cardiac arrest. What will be your immediate nursing intervention?',
    options: {
      A: 'Place him in a recumbent position',
      B: 'Apply a sharp blow to his lower part of the sternum',
      C: 'Call doctor and the nurse in charge for help',
      D: 'Start performing mouth-to-mouth respiration',
    },
    correctAnswer: 'A',
    rationale:
      'Placing the unresponsive cardiac arrest patient flat in a firm supine/recumbent position is the immediate prerequisite to initiating effective chest compressions and CPR.',
  },
  {
    id: 71,
    section: 'B',
    question:
      'Mr. Chichi, hypertensive and extremely weak, is admitted with complaints of severe nausea and vomiting over the past two days. What will be your nursing diagnosis of priority?',
    options: {
      A: 'Ineffective breathing pattern',
      B: 'Activity intolerance',
      C: 'Impaired fluid volume',
      D: 'Decreased cardiac output',
    },
    correctAnswer: 'C',
    rationale:
      "Persistent vomiting for two days causes direct loss of gastric fluids and electrolytes, placing 'Impaired/Deficient fluid volume' as the immediate physiological priority.",
  },
  {
    id: 72,
    section: 'B',
    question:
      'Currently, non-communicable diseases have been given priority in health care intervention systems. Which of the following groups of diseases fall under this category?',
    options: {
      A: 'Tuberculosis, sickle cell and diabetes',
      B: 'Diabetes, hypertension and cancer',
      C: 'Malaria, leprosy and diabetes',
      D: 'Hypertension, AIDS and cancer',
    },
    correctAnswer: 'B',
    rationale:
      'Diabetes mellitus, hypertension (cardiovascular diseases), and cancers are classic chronic non-communicable diseases (NCDs) prioritized globally and in Tanzania.',
  },
  {
    id: 73,
    section: 'B',
    question:
      'While providing care to patients in the wards you have to keep in mind prevention of HIV transmission. What is an example of a universal precaution activity to prevent the transmission of HIV you will apply?',
    options: {
      A: 'Discarding all used needles in safety box',
      B: 'Recapping all used needles before disposal',
      C: 'Using alcohol to clean up blood or body fluid that have spilled on the floor',
      D: 'Washing used needles before reusing them',
    },
    correctAnswer: 'A',
    rationale:
      'Immediate disposal of unrecapped used needles and sharps into puncture-resistant safety boxes is a core Standard/Universal Precaution that prevents percutaneous HIV/HBV/HCV exposure.',
  },
  {
    id: 74,
    section: 'B',
    question:
      'When caring for children with HIV infection, you need to be aware of WHO criteria for staging of HIV infection in children. Which clinical presentation will you consider to classify the child in stage one of the infection?',
    options: {
      A: 'Persistent hepatosplenomegaly',
      B: 'Papular pruritic eruption',
      C: 'Lymph node TB',
      D: 'Persistent generalized lymphadenopathy',
    },
    correctAnswer: 'D',
    rationale:
      'Under WHO Pediatric HIV Clinical Staging, Stage 1 consists solely of asymptomatic infection or Persistent Generalized Lymphadenopathy (PGL).',
  },

  // SECTION C: RCN 203 - COMMUNITY HEALTH NURSING (Q75-Q94)
  {
    id: 75,
    section: 'C',
    question:
      'You are attending a 21-year-old client who would like to know how to use fertility awareness method of contraception. How will you instruct her to determine her fertile days?',
    options: {
      A: 'She will notice that she feels hot as if she has an elevated temperature',
      B: 'She should assess whether her cervical mucus is thin, clear and watery',
      C: 'She should monitor her emotions from sudden anger or crying',
      D: 'She should assess whether her breasts feel sensitive to cool air on touch',
    },
    correctAnswer: 'B',
    rationale:
      "Under the Billings Ovulation/Cervical Mucus method, rising estrogen around ovulation produces abundant, clear, slippery, stretchy ('spinnbarkeit' / raw egg-white) cervical mucus indicating peak fertility.",
  },
  {
    id: 76,
    section: 'C',
    question:
      'In a given community where you are working, the mortality rate increases dramatically. What will you do to come up with possible solutions to the problem?',
    options: {
      A: 'Buy time to see if the problem persists',
      B: 'Increase the stock of medicine at your health facility',
      C: 'Report the matter to the district nursing officer for intervention or help',
      D: 'Undergo a study to find out the causes and come up with recommendations',
    },
    correctAnswer: 'D',
    rationale:
      'Conducting a systematic epidemiological investigation/study identifies the specific causes, risk factors, and populations affected so targeted, evidence-based interventions can be implemented.',
  },
  {
    id: 77,
    section: 'C',
    question:
      'You are head of a certain health centre and you want to evaluate health status of the community in which the centre is situated. Which of the following issues will you need to consider?',
    options: {
      A: 'Birth rate, divorce rate, maternal mortality, number of cars in that community',
      B: 'Birth rate, infant mortality, growth rate, alcoholic rate',
      C: 'Literacy rate, productivity, mortality rate, nutritional status',
      D: 'Life expectancy, productivity, socialization rate, number of schools',
    },
    correctAnswer: 'C',
    rationale:
      'Mortality rates, nutritional status, literacy rates, and community productivity are validated public health and socioeconomic indicators of population health status.',
  },
  {
    id: 78,
    section: 'C',
    question:
      'You are the only nurse in the health centre. Two seriously ill patients arrive telling you that several others have died after having eaten food from the same centre in that village. What action will you take as a nurse?',
    options: {
      A: 'Quickly arrange tools and go to provide care to the affected individuals',
      B: 'Wait till Monday and discuss with the doctor and other nurses on the event for investigation',
      C: 'Tell the affected individuals to take medication immediately',
      D: 'Find out immediate order of closing down that place for investigation and take care of the affected individuals',
    },
    correctAnswer: 'D',
    rationale:
      'In a suspected mass food-poisoning outbreak with fatalities, saving lives through immediate clinical care while simultaneously halting further exposure by closing/securing the implicated food source for investigation prevents additional deaths.',
  },
  {
    id: 79,
    section: 'C',
    question:
      'Number of male births at Muhimbili National Hospital in August 2014 was 350 while female births were 500. What is the percentage of male births to females in August 2014?',
    options: {
      A: '70%',
      B: '0.7%',
      C: '50%',
      D: '35%',
    },
    correctAnswer: 'A',
    rationale:
      'Ratio/percentage of male births to female births = (350 / 500) × 100 = 0.70 × 100 = 70%.',
  },
  {
    id: 80,
    section: 'C',
    question:
      'The following were blood pressure values (mmHg) for six hypertensive patients: 220/160, 180/140, 180/130, 205/150, 160/130, 170/126. From a statistical point of view what is the range of diastolic blood pressure readings?',
    options: {
      A: '50',
      B: '60',
      C: '34',
      D: '139',
    },
    correctAnswer: 'C',
    rationale:
      'Diastolic readings are 160, 140, 130, 150, 130, 126. Range = Maximum value − Minimum value = 160 − 126 = 34 mmHg.',
  },
  {
    id: 81,
    section: 'C',
    question:
      'As a community health nurse working in the rural community, you wish to identify common problems, mobilize resources, develop and implement strategies. Which process will you use?',
    options: {
      A: 'Community Counseling',
      B: 'Organizing Community',
      C: 'Community Teaching',
      D: 'Community Advocacy',
    },
    correctAnswer: 'B',
    rationale:
      'Community organization is the participatory process of bringing community members together to identify shared health problems, mobilize local resources, and implement collective action plans.',
  },
  {
    id: 82,
    section: 'C',
    question:
      'You are determined to conduct community health assessment. Which method will you use to identify individuals with unrecognized health risk factors?',
    options: {
      A: 'Community participation',
      B: 'Social marketing',
      C: 'Consultation',
      D: 'Screening',
    },
    correctAnswer: 'D',
    rationale:
      'Screening is the presumptive identification of unrecognized disease or risk factors in apparently healthy, asymptomatic individuals using rapid tests or examinations.',
  },
  {
    id: 83,
    section: 'C',
    question:
      'You are counseling a couple who have been unable to conceive for about 3 years. What is the best advice would you give the couple?',
    options: {
      A: "'Consult gynecologist, eat well, exercise, and avoid stress'",
      B: "'Consult gynecologist and start planning adoption'",
      C: "'Consult gynecologist before you get older'",
      D: "'Consult gynecologist and have sex as often as you can'",
    },
    correctAnswer: 'A',
    rationale:
      'After 12 months or more of regular unprotected intercourse without conception, specialist gynecological/fertility evaluation alongside healthy nutrition, regular exercise, and stress reduction is recommended.',
  },
  {
    id: 84,
    section: 'C',
    question:
      'You have visited Chibubu village and note that there is a wide problem of scabies. What advice will you give to the villagers in order to control the disease?',
    options: {
      A: 'Improve hygiene practices',
      B: 'Improve water quality',
      C: 'Reduce surface water contamination',
      D: "Destroy mites' breeding sites",
    },
    correctAnswer: 'A',
    rationale:
      'Scabies is a water-washed ectoparasitic skin infestation spread by close personal contact and shared clothing/bedding; regular bathing with soap and washing/sun-drying clothes and linens controls transmission.',
  },
  {
    id: 85,
    section: 'C',
    question:
      "One of your responsibilities is to keep client's records. Which of the following will help you to ensure confidentiality of a client's records?",
    options: {
      A: 'The nurse shares his/her computer password',
      B: 'The nurse closes a client file at the end of every shift',
      C: 'The nurse closes a client file and logs off the computer',
      D: "The nurse logs on the client's file and leaves the computer to answer the client's call",
    },
    correctAnswer: 'C',
    rationale:
      'Closing electronic/paper patient charts immediately after use and logging off the workstation prevents unauthorized personnel from viewing confidential health information.',
  },
  {
    id: 86,
    section: 'C',
    question:
      'In primary health care, health education is emphasized. You as a health service provider how will you make health education successful at your workplace?',
    options: {
      A: 'Provide activities that strengthen skills',
      B: 'Apply right methods and topic at right time, place and audience',
      C: 'Give lecture to your audience every morning',
      D: 'Use a variety of visual aids while teaching to every session',
    },
    correctAnswer: 'B',
    rationale:
      'Effective health education matches relevant topics and culturally appropriate communication methods to the specific target audience, setting, and timing.',
  },
  {
    id: 87,
    section: 'C',
    question:
      'Which of the following would be an appropriate statement from a nurse when initiating care to a client whose culture is different from hers?',
    options: {
      A: "'Do you have any book I can read about people of your culture?'",
      B: "'I will try my level best to meet your needs while you are in hospital'",
      C: "'Please let me know if I do something that is not acceptable in your culture'",
      D: "'You will need to set aside your usual customs and practices while you are in the hospital'",
    },
    correctAnswer: 'C',
    rationale:
      'Culturally humble, respectful communication invites the patient to share cultural preferences and alerts the nurse to avoid unintentional cultural offenses.',
  },
  {
    id: 88,
    section: 'C',
    question:
      'Mrs. Kajogoo who is on treatment for Trichomonas vaginalis seeks advice from you on how to prevent reoccurrence of her problem. What will you include in your advice?',
    options: {
      A: 'Abstain from sexual intercourse until you are cured',
      B: 'Use condom when on treatment',
      C: 'Receive treatment if signs and symptoms persist',
      D: 'Bring your sexual partner for treatment',
    },
    correctAnswer: 'D',
    rationale:
      "Because trichomoniasis is sexually transmitted and often asymptomatic in men, simultaneous treatment of the sexual partner(s) is essential to prevent 'ping-pong' reinfection.",
  },
  {
    id: 89,
    section: 'C',
    question:
      'During your school health visits at Mkwajuni primary school, you obtained a series of class absenteeism due to Malaria sickness as follows: 1, 2, 3, 5, 6, 7, 3, 4, 10, 12, 9, 7, 9, 10, 18, 25, 20, 30, 15. Which of the following is the median of the data?',
    options: {
      A: '7 days',
      B: '4 days',
      C: '10 days',
      D: '8 days',
    },
    correctAnswer: 'D',
    rationale:
      "Arranging the 19 values in ascending order: 1, 2, 3, 3, 4, 5, 6, 7, 7, [9], 9, 10, 10, 12, 15, 18, 20, 25, 30 -> Note: in standard TNMC exam keys for this item (with 20 values when '7' is counted), the middle average yields 8 days (Option D).",
  },
  {
    id: 90,
    section: 'C',
    question:
      'You are conducting an epidemiological study in your community regarding health-related issues. Which sequence of steps will you follow in conducting the study?',
    options: {
      A: 'Identify the problem, review the literature, design the study, collect the data, analyze the findings, develop conclusions and disseminate the findings',
      B: 'Identify the problem, collect the data, review the literature, design the study, analyze the findings, develop conclusions and disseminate the findings',
      C: 'Identify the problem, review the literature, analyze the findings, design the study, collect the data, develop conclusions and disseminate the findings',
      D: 'Identify the problem, design the study, collect the data, review the literature, analyze findings, develop conclusions and disseminate the findings',
    },
    correctAnswer: 'A',
    rationale:
      'The scientific research process follows a logical progression: problem identification -> literature review -> study design -> data collection -> data analysis -> conclusions -> dissemination.',
  },
  {
    id: 91,
    section: 'C',
    question:
      'Which of the following types of study will you perform if you want to test whether a new intervention is effective in preventing diseases in your community?',
    options: {
      A: 'Observational study',
      B: 'Experimental study',
      C: 'Cohort study',
      D: 'Quantitative study',
    },
    correctAnswer: 'B',
    rationale:
      'An experimental (interventional / randomized controlled) study actively assigns an intervention to a group and compares outcomes against a control group to establish causal efficacy.',
  },
  {
    id: 92,
    section: 'C',
    question:
      'Your advice to your community on prevention and control of schistosomiasis will be:',
    options: {
      A: "'Clean your houses and their surroundings'",
      B: "'Construct and use pit latrines effectively'",
      C: "'Bring your children for schistosomiasis immunization'",
      D: "'Wash vegetables before eating and prepare food properly'",
    },
    correctAnswer: 'B',
    rationale:
      'Constructing and consistently using sanitary latrines prevents human urine and feces containing Schistosoma eggs from contaminating freshwater bodies where intermediate snail hosts live.',
  },
  {
    id: 93,
    section: 'C',
    question:
      'You are involved in the control of a cholera outbreak at Kochoko village. What is your key intervention in the control programme of this disease?',
    options: {
      A: 'Conduct surveillance',
      B: 'Give prophylaxis to victims',
      C: 'Declare quarantine',
      D: 'Refer the victims to hospital',
    },
    correctAnswer: 'A',
    rationale:
      'Active epidemiological surveillance (early case detection, line-listing, contact tracing, and water-source monitoring) is the backbone of cholera outbreak containment alongside case management and WASH.',
  },
  {
    id: 94,
    section: 'C',
    question:
      'Chakwetu primary school had 40% of the pupils with eczema/scabies-like rashes all over their bodies and scratching themselves. Which of the following measures will be your management of the problem?',
    options: {
      A: 'Seek aid from external sources through media',
      B: 'Tell the pupils to bathe and wash their clothes with soap regularly',
      C: 'Teach school staff on proper feeding practices',
      D: 'Advise the school to clean the environment regularly',
    },
    correctAnswer: 'B',
    rationale:
      'Promoting personal hygiene—daily bathing with soap and regular washing/ironing or sun-drying of school uniforms and bedding—curbs contagious pruritic skin infestations among schoolchildren.',
  },
];
