export type AddictionId = 'sigara' | 'alkol' | 'seker' | 'sosyal' | 'kumar' | 'diger';

export type Milestone = {
  /** Time after quitting, in hours. */
  hours: number;
  when: string;
  text: string;
};

export type Addiction = {
  id: AddictionId;
  label: string;
  mark: string;
  chip: string;
  /** Hero label on the home screen, e.g. "Sigarasız geçen süre". */
  freeLabel: string;
  /** Short status line, e.g. "Sigarasız". */
  freeShort: string;
  /** Name of one unit, used for "İçilmeyen sigara" style stats. */
  unit: string;
  avoidedLabel: string;
  perDayQuestion: string;
  perDayHint: string;
  perDayMax: number;
  perDayDefault: number;
  /** Only cigarettes are bought in packs. */
  usesPack: boolean;
  priceLabel: string;
  priceDefault: number;
  /** Minutes one unit costs, for the "Kazanılan zaman" stat. 0 hides it. */
  minutesPerUnit: number;
  milestones: Milestone[];
  milestoneSource: string | null;
};

const H = 1;
const D = 24;
const W = 24 * 7;
const M = 24 * 30;
const Y = 24 * 365;

const genericMilestones: Milestone[] = [
  { hours: 1 * D, when: '1 gün', text: 'İlk gün tamamlandı. En zor adımlardan biri geride kaldı.' },
  { hours: 3 * D, when: '3 gün', text: 'İlk günlerdeki yoğun istek genellikle azalmaya başlar.' },
  { hours: 1 * W, when: '1 hafta', text: 'Yeni rutinlerin yerleşmeye başlıyor.' },
  { hours: 2 * W, when: '2 hafta', text: 'Tetikleyicilerini tanımaya ve yönetmeye başladın.' },
  { hours: 1 * M, when: '1 ay', text: 'Bir ay boyunca kararını korudun.' },
  { hours: 3 * M, when: '3 ay', text: 'Alışkanlık döngün belirgin şekilde değişti.' },
  { hours: 6 * M, when: '6 ay', text: 'Yarım yıl. Yeni hayatın artık yeni normalin.' },
  { hours: 1 * Y, when: '1 yıl', text: 'Bir tam yıl. Bunu sen başardın.' },
];

export const addictions: Record<AddictionId, Addiction> = {
  sigara: {
    id: 'sigara',
    label: 'Sigara',
    mark: 'Si',
    chip: '#F8ECD9',
    freeLabel: 'Sigarasız geçen süre',
    freeShort: 'Sigarasız',
    unit: 'sigara',
    avoidedLabel: 'İçilmeyen sigara',
    perDayQuestion: 'Günde kaç adet?',
    perDayHint: 'Ortalama bir gün',
    perDayMax: 80,
    perDayDefault: 20,
    usesPack: true,
    priceLabel: 'Bir paketin fiyatı (₺)',
    priceDefault: 100,
    minutesPerUnit: 5,
    milestones: [
      { hours: 20 / 60, when: '20 dakika', text: 'Nabız ve tansiyon düşmeye başlar' },
      { hours: 12 * H, when: '12 saat', text: 'Kandaki karbonmonoksit normale döner' },
      { hours: 2 * D, when: '2 gün', text: 'Tat ve koku alma duyusu güçlenir' },
      { hours: 12 * W, when: '2–12 hafta', text: 'Dolaşım ve akciğer fonksiyonu iyileşir' },
      { hours: 9 * M, when: '1–9 ay', text: 'Öksürük ve nefes darlığı azalır' },
      { hours: 1 * Y, when: '1 yıl', text: 'Kalp hastalığı riski yarıya iner' },
    ],
    milestoneSource: 'Kaynak: Dünya Sağlık Örgütü. Bu bilgiler tıbbi tavsiye yerine geçmez.',
  },
  alkol: {
    id: 'alkol',
    label: 'Alkol',
    mark: 'Al',
    chip: '#E9E3F3',
    freeLabel: 'Alkolsüz geçen süre',
    freeShort: 'Alkolsüz',
    unit: 'içki',
    avoidedLabel: 'İçilmeyen içki',
    perDayQuestion: 'Günde kaç içki?',
    perDayHint: 'Ortalama bir gün',
    perDayMax: 30,
    perDayDefault: 3,
    usesPack: false,
    priceLabel: 'Bir içkinin ortalama fiyatı (₺)',
    priceDefault: 150,
    minutesPerUnit: 20,
    milestones: genericMilestones,
    milestoneSource: null,
  },
  seker: {
    id: 'seker',
    label: 'Şeker',
    mark: 'Şe',
    chip: '#F6E1DC',
    freeLabel: 'Şekersiz geçen süre',
    freeShort: 'Şekersiz',
    unit: 'porsiyon',
    avoidedLabel: 'Yenmeyen porsiyon',
    perDayQuestion: 'Günde kaç porsiyon?',
    perDayHint: 'Tatlı, şekerli içecek, atıştırmalık',
    perDayMax: 20,
    perDayDefault: 3,
    usesPack: false,
    priceLabel: 'Bir porsiyonun ortalama fiyatı (₺)',
    priceDefault: 40,
    minutesPerUnit: 0,
    milestones: genericMilestones,
    milestoneSource: null,
  },
  sosyal: {
    id: 'sosyal',
    label: 'Sosyal medya',
    mark: 'Sm',
    chip: '#DFEAF4',
    freeLabel: 'Sosyal medyasız geçen süre',
    freeShort: 'Sosyal medyasız',
    unit: 'saat',
    avoidedLabel: 'Geri kazanılan saat',
    perDayQuestion: 'Günde kaç saat?',
    perDayHint: 'Ekran süresi ayarlarından bakabilirsin',
    perDayMax: 16,
    perDayDefault: 3,
    usesPack: false,
    priceLabel: 'Uygulama içi harcama, saat başı (₺)',
    priceDefault: 0,
    minutesPerUnit: 60,
    milestones: genericMilestones,
    milestoneSource: null,
  },
  kumar: {
    id: 'kumar',
    label: 'Kumar',
    mark: 'Ku',
    chip: '#E1EFE8',
    freeLabel: 'Kumarsız geçen süre',
    freeShort: 'Kumarsız',
    unit: 'oyun',
    avoidedLabel: 'Oynanmayan oyun',
    perDayQuestion: 'Günde kaç kez oynuyordun?',
    perDayHint: 'Bahis, kupon, oyun',
    perDayMax: 50,
    perDayDefault: 2,
    usesPack: false,
    priceLabel: 'Bir seferde ortalama harcama (₺)',
    priceDefault: 200,
    minutesPerUnit: 30,
    milestones: genericMilestones,
    milestoneSource: null,
  },
  diger: {
    id: 'diger',
    label: 'Diğer',
    mark: '+',
    chip: '#EEF1EE',
    freeLabel: 'Temiz geçen süre',
    freeShort: 'Temiz',
    unit: 'kez',
    avoidedLabel: 'Kaçınılan kez',
    perDayQuestion: 'Günde kaç kez?',
    perDayHint: 'Ortalama bir gün',
    perDayMax: 50,
    perDayDefault: 3,
    usesPack: false,
    priceLabel: 'Bir seferin ortalama maliyeti (₺)',
    priceDefault: 0,
    minutesPerUnit: 15,
    milestones: genericMilestones,
    milestoneSource: null,
  },
};

export const addictionList = Object.values(addictions);

export const reasonOptions = [
  { id: 'saglik', label: 'Sağlığım' },
  { id: 'aile', label: 'Ailem' },
  { id: 'para', label: 'Para biriktirmek' },
  { id: 'spor', label: 'Daha iyi spor' },
  { id: 'ozgurluk', label: 'Özgür hissetmek' },
  { id: 'ornek', label: 'Örnek olmak' },
  { id: 'uyku', label: 'Daha iyi uyku' },
  { id: 'gorunum', label: 'Cilt ve görünüm' },
];

export const triggerOptions = [
  'Stres',
  'Kahve',
  'Alkol',
  'Sosyal ortam',
  'Can sıkıntısı',
  'Yemek sonrası',
  'Yorgunluk',
  'Tartışma',
  'Kutlama',
];

export const moodOptions = [
  { label: 'Çok zor', tint: '#F6E1DC', dot: '#C2452D' },
  { label: 'Zor', tint: '#F8ECD9', dot: '#E3A13B' },
  { label: 'Normal', tint: '#EEF1EE', dot: '#A3B1AA' },
  { label: 'İyi', tint: '#E1EFE8', dot: '#7CC8AB' },
  { label: 'Harika', tint: '#CFE8DC', dot: '#1E6B55' },
];
