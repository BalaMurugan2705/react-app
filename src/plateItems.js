/* Light-weight list of dishes shown in the 3D "assemble" scene.
   Order = the order they land on the leaf. Kept separate from plate3d.js so
   the UI can use the names without pulling in three.js. */
export const PLATE_ITEMS = [
  { id: 'rice',     ta: 'சோறு',          en: 'Rice',          kinds: ['veg', 'nonveg'] },
  { id: 'sambar',   ta: 'சாம்பார்',      en: 'Sambar',        kinds: ['veg'] },
  { id: 'kuzhambu', ta: 'காரக்குழம்பு',  en: 'Kara kuzhambu', kinds: ['veg'] },
  { id: 'poriyal',  ta: 'பொரியல்',       en: 'Poriyal',       kinds: ['veg'] },
  { id: 'kootu',    ta: 'கூட்டு',        en: 'Kootu',         kinds: ['veg'] },
  { id: 'chicken',  ta: 'சிக்கன் கிரேவி', en: 'Chicken gravy', kinds: ['nonveg'] },
  { id: 'fishcurry', ta: 'மீன் குழம்பு', en: 'Fish curry',    kinds: ['nonveg'] },
  { id: 'fishfry',  ta: 'மீன் வறுவல்',   en: 'Fish fry',      kinds: ['nonveg'] },
  { id: 'rasam',    ta: 'ரசம்',          en: 'Rasam',         kinds: ['veg', 'nonveg'] },
  { id: 'moru',     ta: 'மோர்',          en: 'Buttermilk',    kinds: ['veg', 'nonveg'] },
  { id: 'appalam',  ta: 'அப்பளம்',       en: 'Appalam',       kinds: ['veg', 'nonveg'] },
  { id: 'pickle',   ta: 'ஊறுகாய்',       en: 'Pickle',        kinds: ['veg', 'nonveg'] },
];

export const itemsFor = (mode) => PLATE_ITEMS.filter((i) => i.kinds.includes(mode));
