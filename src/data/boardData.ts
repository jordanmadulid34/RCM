export interface BoardMember {
  id: string;
  name: string;
  title: string;
  photoUrl: string;
  category: 'officers' | 'directors' | 'advisers';
}

export const BOARD_OFFICERS: BoardMember[] = [
  {
    id: 'off-1',
    name: 'Eduardo H. Galvez',
    title: 'President',
    photoUrl: 'https://static.wixstatic.com/media/b2fb7d_a5fbefa18cbc48c49181378297460c8c~mv2.jpg',
    category: 'officers',
  },
  {
    id: 'off-2',
    name: 'PE Howard M. Calleja',
    title: 'President-Elect',
    photoUrl: 'https://static.wixstatic.com/media/941b16_10ab8de2a2f1454fa8f99a175aa70df1~mv2.jpg',
    category: 'officers',
  },
  {
    id: 'off-3',
    name: 'Philip Alexander G. Soliven',
    title: 'Secretary',
    photoUrl: 'https://static.wixstatic.com/media/b2fb7d_73b99c55aee04ad881892a7f9828ff2c~mv2.jpg',
    category: 'officers',
  },
  {
    id: 'off-4',
    name: 'Leopoldo H. de Leon',
    title: 'Treasurer',
    photoUrl: 'https://static.wixstatic.com/media/b2fb7d_dd7d2802f2d24dd5825ee2e8a7136cbf~mv2.jpg',
    category: 'officers',
  },
  {
    id: 'off-5',
    name: 'Cesare Edwin M. Garcia',
    title: 'Assistant Treasurer',
    photoUrl: 'https://static.wixstatic.com/media/b2fb7d_51b3ac457cea4671be74307287af67ec~mv2.jpg',
    category: 'officers',
  },
  {
    id: 'off-6',
    name: 'PP Alfredo B. Parungao',
    title: 'Comptroller',
    photoUrl: 'https://static.wixstatic.com/media/941b16_b6ec9823830b47058f95ccdd3a9ded5f~mv2.jpg',
    category: 'officers',
  },
  {
    id: 'off-7',
    name: 'Regidor Ponferrada',
    title: 'Legal Counsel',
    photoUrl: 'https://static.wixstatic.com/media/b2fb7d_f88134922ce84077bc096892bce7f2ab~mv2.jpg',
    category: 'officers',
  },
];

export const BOARD_DIRECTORS: BoardMember[] = [
  {
    id: 'dir-1',
    name: 'Paolo Antonio Turno',
    title: 'Director',
    photoUrl: 'https://static.wixstatic.com/media/b2fb7d_46e056f5b29342aebc669a21b3635779~mv2.jpg',
    category: 'directors',
  },
  {
    id: 'dir-2',
    name: 'Michael Hsu',
    title: 'Director',
    photoUrl: 'https://static.wixstatic.com/media/b2fb7d_19cd1c59394f40bfa4a4883a18b9fb00~mv2.jpg',
    category: 'directors',
  },
  {
    id: 'dir-3',
    name: 'Carlos Benedict K. Rivilla',
    title: 'Director',
    photoUrl: 'https://static.wixstatic.com/media/b2fb7d_7b3ac378c95c4a9587a9c732912a24e9~mv2.jpg',
    category: 'directors',
  },
  {
    id: 'dir-4',
    name: 'PN Chris Ferareza',
    title: 'Director',
    photoUrl: 'https://static.wixstatic.com/media/b2fb7d_2be709d26fe14074a9a5c0dcc95af952~mv2.jpg',
    category: 'directors',
  },
  {
    id: 'dir-5',
    name: 'Derrick Anthony Tan',
    title: 'Director',
    photoUrl: 'https://static.wixstatic.com/media/b2fb7d_5df3f0ea71d14700a76497ad806a92a2~mv2.png',
    category: 'directors',
  },
  {
    id: 'dir-6',
    name: 'Alejandro Mañalac',
    title: 'Director',
    photoUrl: 'https://static.wixstatic.com/media/b2fb7d_c30227ed390846afb742ab75772c0bc7~mv2.jpg',
    category: 'directors',
  },
  {
    id: 'dir-7',
    name: 'Patrick C. Parungao',
    title: 'Director',
    photoUrl: 'https://static.wixstatic.com/media/b2fb7d_3a7a4467a5f44c64b6accb93ef3d698b~mv2.jpg',
    category: 'directors',
  },
  {
    id: 'dir-8',
    name: 'Roger Collantes',
    title: 'Director',
    photoUrl: 'https://static.wixstatic.com/media/b2fb7d_7ac78c21a6e248ce93268c9d9b81800c~mv2.jpg',
    category: 'directors',
  },
  {
    id: 'dir-9',
    name: 'IPP Keith A.D. Harrison',
    title: 'Director',
    photoUrl: 'https://static.wixstatic.com/media/b2fb7d_685e97f3d0334399a2e2e667fefc8cc5~mv2.jpg',
    category: 'directors',
  },
];

export const BOARD_ADVISERS: BoardMember[] = [
  {
    id: 'adv-1',
    name: 'PDG J. Antonio M. Quila',
    title: 'Adviser',
    photoUrl: 'https://static.wixstatic.com/media/b2fb7d_f3cf69ee88ce4d69affa67aaf0fc6759~mv2.jpg',
    category: 'advisers',
  },
  {
    id: 'adv-2',
    name: 'PDG Isidro G. Garcia',
    title: 'Adviser',
    photoUrl: 'https://static.wixstatic.com/media/b2fb7d_5b203d6de2de4bb3b0243958893bee7b~mv2.png',
    category: 'advisers',
  },
  {
    id: 'adv-3',
    name: 'PDG Jose A.R Bengzon III',
    title: 'Adviser',
    photoUrl: 'https://static.wixstatic.com/media/b2fb7d_6a122953c14f4fe1addb3e2f31629b56~mv2.jpg',
    category: 'advisers',
  },
  {
    id: 'adv-4',
    name: 'Gov. Reggie B. Nolido',
    title: 'Adviser',
    photoUrl: 'https://static.wixstatic.com/media/b2fb7d_a1f7a9f80b804b99abf7f3b0c7a2c983~mv2.jpg',
    category: 'advisers',
  },
  {
    id: 'adv-5',
    name: 'PP Carlos Miguel Rufino',
    title: 'Adviser',
    photoUrl: 'https://static.wixstatic.com/media/b2fb7d_43964614a66a438fba091f1217a547a5~mv2.jpg',
    category: 'advisers',
  },
  {
    id: 'adv-6',
    name: 'PP Vicente T. Mills Jr.',
    title: 'Adviser',
    photoUrl: 'https://static.wixstatic.com/media/941b16_b46c770f89bc4da18b45880f980fb5e5~mv2.jpg',
    category: 'advisers',
  },
  {
    id: 'adv-7',
    name: 'DS/PP Luis Angel G. Aseoche',
    title: 'Adviser',
    photoUrl: 'https://static.wixstatic.com/media/b2fb7d_61e97627edf0455b95565b1c3774f1a1~mv2.jpg',
    category: 'advisers',
  },
  {
    id: 'adv-8',
    name: 'PP Senen L. Matoto',
    title: 'Adviser',
    photoUrl: 'https://static.wixstatic.com/media/941b16_d7c9bcae335c442f97e20d4f4fd747ba~mv2.jpg',
    category: 'advisers',
  },
];
