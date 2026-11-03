// Sample feed until the community backend exists. Replace with API data later.

export type Post = {
  id: string;
  name: string;
  initials: string;
  color: string;
  group: string;
  ago: string;
  streak: string;
  likes: number;
  comments: number;
  text: string;
};

export const communityGroups = ['Tümü', 'Sigara', 'Alkol', 'Sosyal medya', 'Şeker', 'Kumar'];

export const communityPosts: Post[] = [
  {
    id: 'p1',
    name: 'Deniz',
    initials: 'D',
    color: '#F3D9A6',
    group: 'Sigara',
    ago: '2 sa',
    streak: '45. gün',
    likes: 38,
    comments: 6,
    text: 'Bugün merdivenleri nefes nefese kalmadan çıktım. Küçük bir şey gibi ama benim için çok büyük.',
  },
  {
    id: 'p2',
    name: 'Mert',
    initials: 'M',
    color: '#DFEAF4',
    group: 'Alkol',
    ago: '5 sa',
    streak: '3. gün',
    likes: 21,
    comments: 9,
    text: 'Hafta sonu düğün var ve korkuyorum. Sosyal ortamlarda nasıl başa çıkıyorsunuz?',
  },
  {
    id: 'p3',
    name: 'Elif',
    initials: 'E',
    color: '#F2C6BB',
    group: 'Sigara',
    ago: 'Dün',
    streak: '1 yıl',
    likes: 112,
    comments: 24,
    text: 'Bir yıl oldu. İlk hafta her gece SOS butonuna bastım. Devam edin, geçiyor.',
  },
  {
    id: 'p4',
    name: 'Can',
    initials: 'C',
    color: '#CFE8DC',
    group: 'Sosyal medya',
    ago: 'Dün',
    streak: '12. gün',
    likes: 17,
    comments: 3,
    text: 'Telefonu yatak odasına sokmamak her şeyi değiştirdi. Uykum çok daha iyi.',
  },
  {
    id: 'p5',
    name: 'Selin',
    initials: 'S',
    color: '#E9E3F3',
    group: 'Şeker',
    ago: '2 gün',
    streak: '21. gün',
    likes: 29,
    comments: 5,
    text: 'Akşam tatlı krizleri için yanıma meyve ve bitki çayı koyuyorum. İşe yarıyor.',
  },
];

export const supportLines = [
  { number: '171', title: 'ALO 171', subtitle: 'Sigara bırakma hattı' },
  { number: '115', title: 'YEDAM 115', subtitle: 'Yeşilay danışma' },
];
