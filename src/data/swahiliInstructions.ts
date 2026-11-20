export interface SwahiliInstructionItem {
  number: string;
  title: string;
  body: string;
}

export const SWAHILI_CORE_INSTRUCTIONS: SwahiliInstructionItem[] = [
  {
    number: '01',
    title: 'Majibu Yamefungwa Wakati Wote wa Mtihani',
    body: 'Unapochagua jibu (A, B, C, au D), mfumo hautaonyesha jibu sahihi papo hapo. Lengo ni kukupa uhalisia wa mtihani wa Baraza la TNMC ili upambane na kupima uelewa wako mwenyewe. Majibu yote sahihi na maelezo ya kitaalamu hufunguka baada ya kuwasilisha mtihani.',
  },
  {
    number: '02',
    title: 'Muda wa Mtihani, Auto-Submit na Tahadhari ya Dakika 35',
    body: 'Mtihani kamili una maswali 189 kwa muda wa dakika 180 (saa 3). Saa ikifika 00:00, mfumo utawasilisha na kusahihisha karatasi yako moja kwa moja. Muda uliobaki ukishuka chini ya dakika 35, dirisha na ukanda wa tahadhari vitatokea vikikuonyesha wastani wa muda unaopaswa kutumia kwa kila swali lililobaki.',
  },
  {
    number: '03',
    title: 'Tumia Clinical Hints na Section Formulas Unapokwama',
    body: 'Kila swali lina kitufe cha Clinical Hint kinachokupa dokezo la kimatibabu la kuongoza fikra zako bila kuvujisha jibu. Kwa maswali ya mahesabu (dozi za dawa, matone ya IV, EDD/Apgar, au kanuni za afya ya jamii), tumia kitufe cha Section Formulas wakati wowote ndani ya mtihani.',
  },
  {
    number: '04',
    title: 'Kuhifadhi Rekodi na Kuendeleza Mtihani Wakati Wowote',
    body: 'Ingia kwa akaunti yako ya Google kabla au wakati wa maandalizi ili rekodi zako na mitihani inayoendelea zihifadhiwe mtandaoni. Ukitoka kwa kubonyeza Save & Exit, unaweza kurudi baadaye na kubonyeza Continue Paper kuendeleza pale ulipoishia bila kupoteza majibu yako.',
  },
  {
    number: '05',
    title: 'Uchambuzi wa Matokeo, Kurudia Makosa na Kupakua PDF',
    body: 'Ukimaliza mtihani, kagua grafu ya ufaulu kwa kila Section (A–F) kuona maeneo dhaifu yanayohitaji marudio kabla ya Desemba. Bonyeza Retake Incorrect kufanya mtihani wa maswali uliyokosea pekee, au pakua faili la PDF lenye alama zako na maelezo ya maswali yote uliyokosea kwa ajili ya kujisomea.',
  },
  {
    number: '06',
    title: 'Mwongozo wa Haraka wa Kibodi na Alama (Flag)',
    body: 'Kwenye kompyuta (Single Question Mode), tumia vitufe A–D au 1–4 kuchagua jibu, mishale ya Kushoto na Kulia kuhamia swali jingine, na kitufe F kuweka alama (Flag) kwenye swali lenye utata ili ulirudie kupitia OMR Grid kabla ya kuwasilisha.',
  },
];

export const SWAHILI_EXAM_CHECKLIST: string[] = [
  'Soma swali kwa umakini hadi mwisho kabla ya kuchagua herufi A, B, C, au D.',
  'Kagua maswali yote kwenye jedwali la namba (Question Sheet) kuhakikisha hujasahau swali lisilo na jibu.',
  'Maswali yote yaliyoachwa wazi bila kuchaguliwa jibu huhesabiwa kama yamekosewa baada ya kuwasilisha.',
  'Ukimaliza au kabla muda haujaisha, bonyeza Submit Paper kisha thibitisha kuwasilisha kwa usahihishaji.',
];
