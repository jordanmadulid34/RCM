// TODO: source and add full bios for remaining presidents incrementally — each bio page on rotaryclubmakati.org/past-presidents/[slug] is long-form; fetch and add a few at a time rather than all at once.

export interface PresidentBioSection {
  title: string;
  content: string[];
}

export interface PresidentBio {
  intro: string[];
  sections?: PresidentBioSection[];
  closing?: string[];
}

export interface PastPresident {
  id: string;
  year: string;
  name: string;
  decadeGroup: '1966–1979' | '1980s' | '1990s' | '2000s' | '2010s' | '2020s';
  isCurrent?: boolean;
  isActive?: boolean;
  activeRole?: string;
  photoUrl?: string;
  bio?: PresidentBio;
  termHighlights?: string[];
}

export const RCM_PRESIDENTS: PastPresident[] = [
  {
    "id": "p-1",
    "year": "1966-1967",
    "name": "Armando \"Mando\" Picciotto",
    "decadeGroup": "1966–1979",
    "photoUrl": "https://static.wixstatic.com/media/b2fb7d_1d7092831f7f4520bb092ff5f34234cb~mv2.jpg",
    "activeRole": "Charter President",
    "bio": {
      "intro": [
        "This said that the presidency of any Rotary Club is a full-time job that requires much from the person. This is doubly true of RC Makati, the presidency of which demands undivided attention and often, 24-hour days. It can be tiring. And challenging. Which is why anyone elected president commits to one year and one year alone of full service to the Club — 12 months and no more. That rule has rung true for all of its presidents. Except one.",
        "Charter president Armando \"Mando\" Picciotto stands out in club history as the only president who served for two terms, running for 15 months-plus: the first year, from March 12, 1966, when the club received its charter, to June 30, 1966, the last day of that Rotary year, 1965-1966; and then for a full-year term from July 1, 1966 to June 30, 1967. He also has the distinction of being the only president to have served under two governors of District 380 — Jose Barredo and Rodolfo Nisce.",
        "As charter president, Mando set the direction and laid the foundation for the Club's service programs and strategy. The Club would engage in projects with far-reaching and long-term ends that bring the greatest benefit to as many individuals or communities as can be reached. To ensure sustainability, the Club would partner with government agencies, business corporations and private organizations with human and material resources, proven expertise in a given field, and a shared passion for or interest in a given program or cause.",
        "The Club's first major project met all these criteria. In addition, it impacted a significant public — Makati's business community and gated residential villages — and served notice of the Club's arrival on the civic action scene.",
        "It was an ambitious undertaking for a fledgling club that had yet to grow wings: a postal station at the Makati Commercial Center (now Ayala Center). The MCC post office was a timely response to a felt need to speed up the flow of communication and keep it in step with the town's business center that was growing at a dizzying pace. Noting the delay in mail arrivals owing to the routing of letters and parcels from the airport to the central post office in Manila before their delivery to addressees in Makati, the new club designed a new route that allowed air mail to be delivered from the airport straight to Makati, bypassing the central PO.",
        "The project stood on three legs: the Bureau of Posts, which approved the project and provided the staff that manned the station; Ayala Corporation, which provided the space for the station; and the Club, which provided the transportation for mail pick-up and delivery, built PO boxes that it rented out to institutional and individual subscribers, and oversaw operations. Its effects were immediate, and met with praise. It was, from the standpoints of public service and public image, a master stroke that merited the issuance of a commemorative stamp on its first anniversary.",
        "The Club's maiden year also marked the start of a long line of projects in the education sector. Joining hands with S.C. Johnson & Sons, it secured a donation of a 10-wheeler truck, outfitted it with bookshelves, and filled them with donated books for a mobile library that rolled through remote towns and barrios in neighboring provinces where books were in short supply, there to be devoured by students and teachers hungry for the knowledge derived from books and thankful for the joy that books alone bring."
      ]
    }
  },
  {
    "id": "p-2",
    "year": "1967-1968",
    "name": "Jose Luis \"Louie\" P. Faustino",
    "decadeGroup": "1966–1979",
    "photoUrl": "https://static.wixstatic.com/media/941b16_d31ea73ed88442b689e5c40c8c1051cc~mv2.jpg",
    "bio": {
      "intro": [
        "Building on the foundations laid on the Club's maiden year, Pres. Luis 'Louie' Faustino expanded the operations of the MCC postal station, doubling the number of post office boxes in response to requests. PO box rental provided the fledgling club with the income it needed for Club operations and project implementation.",
        "The postal facility also gave the Club a public image boost. As the first post office branch in the Philippines, it attracted media attention. It was featured in the Philippine Herald, a major broadsheet, in its 21 June 1968 issue. It also merited space in the December 1968 issue of The Rotarian, the official magazine of Rotary International. As early as then, RC Makati was making waves as a club to watch.",
        "It was on this year that the Club set in motion a wide-ranging program in vocational service designed to uplift lives through skills training, job placement assistance and entrepreneurship.",
        "Its initial salvo in this department was a multi-faceted livelihood and training program for the residents of Barrio Pinagkaisahan, one of the smaller barrios (now called barangay) of Makati. With Bert Montinola as chairman, the Club partnered with the Philippine Rural Reconstruction Movement (PRRM) for a project that offered classes in dressmaking, embroidery, bamboo craft and mushroom culture. With the skills they acquired, the participants embarked on ventures that generated income for their families, thus decreasing their dependence on government dole-outs and building their self esteem.",
        "The year also saw the initiation of a waitering class for jobless out-of-school youth in Barrio Pio del Pilar, also in Makati. Under this project chaired by Bec Panlilio, trainees learned the basics of waiting on tables, serving food and drinks, and attending to the needs of customers, skills that equipped them for jobs in hotels and restaurants. The project ushered in a wave of training programs in waitering in later years.",
        "The sixties were a golden period for Philippine agriculture with the development of the much celebrated 'miracle rice,' a variety that yielded bumper harvests not seen before. As Filipino farmers basked in their fortune, their counterparts in Indonesia were suffering from poor yields. In response to a request from Indonesia, RC Makati shipped a donation of 40 sacks of the so-called 'miracle rice' to Indonesia for planting by Indonesian farmers. The donation helped the farmers recover their losses and get back on their feet, thus saving their country's ailing rice industry."
      ]
    }
  },
  {
    "id": "p-3",
    "year": "1968-1969",
    "name": "Roger \"Roger\" K. Davis",
    "decadeGroup": "1966–1979",
    "photoUrl": "https://static.wixstatic.com/media/941b16_c7df1864fe674410a7420705f41dda76~mv2.jpg"
  },
  {
    "id": "p-4",
    "year": "1969-1970",
    "name": "Farid \"Fred\" S. K. Nassr",
    "decadeGroup": "1966–1979",
    "photoUrl": "https://static.wixstatic.com/media/941b16_78fa81ff3cf14f089be2b013d010c7f0~mv2.jpeg"
  },
  {
    "id": "p-5",
    "year": "1970-1971",
    "name": "Ford \"Ford\" M. Tussing",
    "decadeGroup": "1966–1979",
    "photoUrl": "https://static.wixstatic.com/media/941b16_904e3b22683149448586b4e9b60ee90c~mv2.jpeg"
  },
  {
    "id": "p-6",
    "year": "1971-1972",
    "name": "Luis Ma. \"Louie\" Guerrero",
    "decadeGroup": "1966–1979",
    "photoUrl": "https://static.wixstatic.com/media/941b16_1fce1ce2eeba4b79be48aaab43142331~mv2.jpeg"
  },
  {
    "id": "p-7",
    "year": "1972-1973",
    "name": "Rafael \"Paing\" Hechanova",
    "decadeGroup": "1966–1979",
    "photoUrl": "https://static.wixstatic.com/media/941b16_db6acad0a7f64a7b963394462f390aff~mv2.jpeg",
    "bio": {
      "intro": [
        "The three-level Makati Rotary Foundation Arcade rose from a blueprint designed, pro bono, by Paing Hechanova, who had put in his share of the team effort by donating his services as building architect. Completed in record time, the arcade flung open its doors in 1973 when the architect served as club president, a case of perfect timing.",
        "Per design, the ground floor was occupied by retail establishments, including a fast-food store and a jewelry shop, the second level was rented out to shops and offices, while the top floor was home to a dance studio and a multi-tasking secretariat that handled the affairs of the club, foundation and arcade.",
        "The inauguration of the building ushered in a period of plenty that put the Club in an excellent position to set off its mission of service with renewed vigor, secure in the certainty of the resources it needs to see its every plan through.",
        "Pres. Paing's term was host to a number of significant projects.",
        "The current nutrition project that provides supplemental feeding to undernourished children, finds its roots in the mothercraft project, which provided free meals to undernourished children in the various barrios of Makati. Initiated by member Dr. Mike Celdran and pushed through by President Paing during his term, the project included mothers' classes that had women attend demonstrations on the planning and preparation of inexpensive but nutritious dishes and talks on such topics as nutrition, child spacing, responsible parenthood, and basic health care, among others.",
        "His advocacy of Rotary's Four Way Test led Pres. Paing to organize a nationwide essay writing contest on The Test that hit two birds with the same stone — animated the usually boring Four Way Test Committee and sprung it to action and led the youth and their elders to a better understanding and appreciation of the Four Way Test and its four-pronged message.",
        "To promote healthy employer-employee relations and give due recognition to a group of unsung heroes in the workplace, the Club organized a Secretary's Day at which members' secretaries occupied center stage as guests of honor. With a mind to get the Club to pitch its share in Rotary's campaign for growth through extension, Pres. Paing worked for the establishment of the Rotary Club of Makati North, the Club's second daughter in seven years, which still exists today after 44 years.",
        "And to cap a year of achievement, he presided over the formal launch of the National Awards for Community Service (NACS), the recognition program that had been conceptualized and prepared for in the previous two years and which has moved outstanding provincial community service projects to national prominence. Since then, through the years, the Rotary Club of Makati has been giving due recognition and awards to individuals and institutions that enhanced various communities in the nation, thus elevating its reputation to national cognizance. The program is enjoying another run under the personal supervision of its architect as part of the celebration of the Club's 50th anniversary year."
      ]
    }
  },
  {
    "id": "p-8",
    "year": "1973-1974",
    "name": "Juan \"Puno\" N. R. Peña",
    "decadeGroup": "1966–1979",
    "photoUrl": "https://static.wixstatic.com/media/941b16_34b511237b164482922df2ea97a9a1da~mv2.jpeg"
  },
  {
    "id": "p-9",
    "year": "1974-1975",
    "name": "Silvestre \"Beteng\" M. Punzalan",
    "decadeGroup": "1966–1979",
    "photoUrl": "https://static.wixstatic.com/media/941b16_2ae7b14505de41afb8b89e1eb6a57201~mv2.jpeg"
  },
  {
    "id": "p-10",
    "year": "1975-1976",
    "name": "Arthur \"Art\" G. Misner Jr.",
    "decadeGroup": "1966–1979",
    "photoUrl": "https://static.wixstatic.com/media/941b16_74493e1060114af98e656d068093dedd~mv2.jpeg"
  },
  {
    "id": "p-11",
    "year": "1976-1977",
    "name": "Roberto \"Bert\" J. Montinola",
    "decadeGroup": "1966–1979",
    "photoUrl": "https://static.wixstatic.com/media/941b16_3cdd2efcfc4b4427a29f49c821d16f94~mv2.jpeg"
  },
  {
    "id": "p-12",
    "year": "1977-1978",
    "name": "Edgar \"Hadji\" Kalaw",
    "decadeGroup": "1966–1979",
    "photoUrl": "https://static.wixstatic.com/media/b2fb7d_03c0509dfd654e31af2bb9f1e47abd9b~mv2.jpg"
  },
  {
    "id": "p-13",
    "year": "1978-1979",
    "name": "William \"Bill\" Beck",
    "decadeGroup": "1966–1979",
    "photoUrl": "https://static.wixstatic.com/media/941b16_45edab3c070c46daa6d26722b1d7161e~mv2.jpeg"
  },
  {
    "id": "p-14",
    "year": "1979-1980",
    "name": "Efren \"Efren\" Sales",
    "decadeGroup": "1980s",
    "photoUrl": "https://static.wixstatic.com/media/941b16_1b12bd5d58d043d883c6c6ee062b9639~mv2.jpeg"
  },
  {
    "id": "p-15",
    "year": "1980-1981",
    "name": "Froilan \"Froily\" T. Aragon",
    "decadeGroup": "1980s",
    "photoUrl": "https://static.wixstatic.com/media/941b16_467129ee10254fb6afd300f394bcb3bf~mv2.jpeg"
  },
  {
    "id": "p-16",
    "year": "1981-1982",
    "name": "Ronald \"Ronnie\" L. Velayo",
    "decadeGroup": "1980s",
    "photoUrl": "https://static.wixstatic.com/media/941b16_ee0b78b6351a48e4b8c9de71bbc656b6~mv2.jpeg"
  },
  {
    "id": "p-17",
    "year": "1982-1983",
    "name": "Nicolas \"Nick\" O. Katigbak",
    "decadeGroup": "1980s",
    "photoUrl": "https://static.wixstatic.com/media/941b16_ef6e0c28f2944b4aa35a736add40edac~mv2.jpeg"
  },
  {
    "id": "p-18",
    "year": "1983-1984",
    "name": "Giorgio \"George\" A. Bongulielmi",
    "decadeGroup": "1980s",
    "photoUrl": "https://static.wixstatic.com/media/941b16_0fc7b3dd33eb454db37e800e7b48d638~mv2.jpeg"
  },
  {
    "id": "p-19",
    "year": "1984-1985",
    "name": "Cesar \"Cesar\" V. Campos",
    "decadeGroup": "1980s",
    "photoUrl": "https://static.wixstatic.com/media/941b16_bce6da1ac3f449da8fb8c270b89f983b~mv2.jpeg"
  },
  {
    "id": "p-20",
    "year": "1985-1986",
    "name": "Leocadio \"Cady\" J. Dominguez",
    "decadeGroup": "1980s",
    "photoUrl": "https://static.wixstatic.com/media/941b16_4d9d6ce3f14344be8623fe3c240d817d~mv2.jpeg"
  },
  {
    "id": "p-21",
    "year": "1986-1987",
    "name": "Carlos \"Charlie\" S. Rufino",
    "decadeGroup": "1980s",
    "photoUrl": "https://static.wixstatic.com/media/941b16_7c3e62b5a21540fca98d217b87e859ed~mv2.jpeg",
    "bio": {
      "intro": [
        "Three major decisions were made by Carlos 'Charlie' Rufino during his watch as president.",
        "With the dissolution of MRDC, the Club fast tracked the formation of the new foundation to get a new school up and running with as minimal a disruption as possible to the pupils' school routine. The Development Center for the Handicapped Foundation was envisioned to manage and operate a new special school, which was aptly named Stepping Stone Learning Center.",
        "To place the school on solid footing for its first few steps, the foundation hired a US-educated special education specialist to run the school as principal. With finance and management now a shared responsibility among eight Rotary clubs, Stepping Stone was on its way to discharging its mission of molding the young minds of the special-needs students. Financial requirements were eased with the provision by the Club of rent-free space for classes, on top of providing scholarship to three pupils from in-need families.",
        "The second major move was the mainstreaming of the Club-run feeding centers by placing them under the care of the Makati City Government and of various parishes in Makati.",
        "The third was the kick-off for a health initiative that would be a recurrent area of concern for the Club for years to come. The project was a TB Elimination Project funded by a matching grant of US$162,000 from The Rotary Foundation, with support from AKAPKA Foundation, the Department of Social Welfare and Development, and Direct Relief International. The project covered two sites in the province of Cavite: Carmona and Dasmariñas, where informal settler families from Manila had been relocated. With Social Welfare Sec. Mita Pardo de Tavera as spearhead, DSWD conducted a training program for nurses and volunteer health workers in testing for TB, dispensing medication to patients, and prevention of contagion to other members of the family.",
        "To improve the Club's quick response capability in the face of typhoons and other natural disasters, the Club converted a donated container van into a mobile relief center that could be deployed posthaste to deliver food, water, clothes, medicine and other items to places not accessible to small vehicles.",
        "The year marked the setting up in Brgy. San Isidro of a Rotary Village Corps (later renamed Rotary Community Corps) whose initial project was a cooperative store. San Isidro was one of three barangays where the Club put up a soap-making project and helped the women market their products to clients including the Makati City Hall.",
        "Pres. Charlie, making capital of his business and social connections, solicited donations of used bed sheets and towels from hotels in Makati and gave them away to inmates of the Bilibid Prisons in Muntinlupa."
      ]
    }
  },
  {
    "id": "p-22",
    "year": "1987-1988",
    "name": "Renato \"Rene\" L. Paras",
    "decadeGroup": "1980s",
    "photoUrl": "https://static.wixstatic.com/media/b2fb7d_b1ca19fe74934a1c972df710fb964401~mv2.jpg"
  },
  {
    "id": "p-23",
    "year": "1987-1988",
    "name": "Alfredo \"Fred\" B. Parungao",
    "decadeGroup": "1980s",
    // NOTE: this image file is named "rcm-paras.jpeg" on the club's own site — possibly a mix-up with Renato Paras's photo, since these two presidents shared the 1987-1988 term. Used as-is per source-data quirk.
    "photoUrl": "https://static.wixstatic.com/media/941b16_3368ef7ebae5442da13a7c0a4a6d871e~mv2.jpeg",
    "isActive": true,
    "activeRole": "Comptroller & Board Officer",
    "bio": {
      "intro": [
        "For the first time in the Club's 22-year history, the Club had two presidents in the same Rotary year and responsibility for running the club was shared in equal parts by the two presidents — Renato 'Rene' Paras in the first semester, July-December 1987, and Alfredo 'Fred' Parungao in the second, January-June 1988. The happenstance came about with the resignation of Pres. Rene to assume a European posting with Procter & Gamble, prompting an automatic assumption of the presidency by Vice President Fred.",
        "Two major projects were put in place during the year: the creation of a School for Street Children, which sought to get abused, abandoned, and neglected children off the streets and back to their homes, to their parents and siblings with whom they belonged. The project included a component meant to provide the waifs with basic education and values orientation. The Club joined hands with the Dept. of Social Welfare and other government and private groups, and committed resources for project implementation.",
        "The year also saw the Club starting a new health project — Save-an-Eye. Spurred by reports of the growing number of needy people with failing eyesight who, due to lack of money, were unable to seek medical help, the Save An Eye Project provided eye check-ups and surgery to indigent cataract patients, with a club member, Dr. Vic Caparas, an ophthalmologist, performing the operations for free. The project was able to restore the sight of a good number of needy patients.",
        "Another project in the health sector involved the provision of funds to the 'Jaipur Foot Program,' under which the Club donated artificial legs to needy amputees. The project name, 'Jaipur,' referred to a town in India where the prosthetic limbs were manufactured. The Club also demonstrated its strong advocacy for the cause of children with special needs by carrying on with its support of the Stepping Stone Learning Center.",
        "Concern for the welfare of soldiers wounded in the series of coup attempts against the government of Pres. Corazon Aquino spurred the Club to put up the Assistance-to-Veterans Project under which it donated wall fans and medicine to the V. Luna Hospital, where the wounded soldiers were confined. The Club's Emergency Action group also sent relief goods to the victims of a typhoon in Samar.",
        "In international service, the Club initiated Brother Club ties with RC Lipa in Batangas."
      ]
    }
  },
  {
    "id": "p-24",
    "year": "1988-1989",
    "name": "Jesus \"Gigi\" M. Zulueta, Jr.",
    "decadeGroup": "1980s",
    "photoUrl": "https://static.wixstatic.com/media/941b16_aca14ba8ab704513bd76b90c94a9e4b3~mv2.jpg"
  },
  {
    "id": "p-25",
    "year": "1989-1990",
    "name": "Reynaldo \"Rey\" A. Adriano",
    "decadeGroup": "1990s",
    "photoUrl": "https://static.wixstatic.com/media/941b16_f7e2e8cdda0b42f9a5319a5515682f8a~mv2.jpeg"
  },
  {
    "id": "p-26",
    "year": "1990-1991",
    "name": "Teodoro \"Ted\" C. Borlongan",
    "decadeGroup": "1990s",
    "photoUrl": "https://static.wixstatic.com/media/941b16_4eefa526c3cb4c6b8dd60c09a3005617~mv2.jpeg"
  },
  {
    "id": "p-27",
    "year": "1991-1992",
    "name": "Fidel \"Fidel\" M. Alfonso",
    "decadeGroup": "1990s",
    "photoUrl": "https://static.wixstatic.com/media/941b16_fc530761e67749e9b9b2cdfca72fcd3b~mv2.jpeg"
  },
  {
    "id": "p-28",
    "year": "1992-1993",
    "name": "Armand \"Jun\" F. Braun, Jr.",
    "decadeGroup": "1990s",
    "photoUrl": "https://static.wixstatic.com/media/941b16_22448fa3eeff49f1bcc4b22e80613ef1~mv2.jpeg"
  },
  {
    "id": "p-29",
    "year": "1993-1994",
    "name": "Jose \"Joe\" S. Alejandro",
    "decadeGroup": "1990s",
    "photoUrl": "https://static.wixstatic.com/media/941b16_7a2d9da9794646a7a11ae768a4d439c3~mv2.jpeg"
  },
  {
    "id": "p-30",
    "year": "1994-1995",
    "name": "Juan Carlos \"Carlos\" del Rosario",
    "decadeGroup": "1990s",
    "photoUrl": "https://static.wixstatic.com/media/941b16_abcfb47e1e364dd1b27fe227784fe0cc~mv2.jpeg"
  },
  {
    "id": "p-31",
    "year": "1995-1996",
    "name": "Evergisto \"Ever\" Macatulad",
    "decadeGroup": "1990s",
    "photoUrl": "https://static.wixstatic.com/media/941b16_3acba49a57ae4ce9bf49276d92ac8011~mv2.jpeg"
  },
  {
    "id": "p-32",
    "year": "1996-1997",
    "name": "Ricardo \"Ric\" G. Librea",
    "decadeGroup": "1990s",
    "photoUrl": "https://static.wixstatic.com/media/941b16_44fc543cd9d1423c8e3a66b89f22bae4~mv2.jpeg"
  },
  {
    "id": "p-33",
    "year": "1997-1998",
    "name": "Isidro \"Sid\" G. Garcia",
    "decadeGroup": "1990s",
    "photoUrl": "https://static.wixstatic.com/media/941b16_c037514b718d4b049ae08c3260b82607~mv2.jpeg",
    "isActive": true,
    "activeRole": "PDG & Board Adviser"
  },
  {
    "id": "p-34",
    "year": "1998-1999",
    "name": "J. Antonio \"Tony\" M. Quila",
    "decadeGroup": "1990s",
    "photoUrl": "https://static.wixstatic.com/media/941b16_70146c74ab9a4926b4cb28be01d40701~mv2.jpeg",
    "isActive": true,
    "activeRole": "PDG & Board Adviser"
  },
  {
    "id": "p-35",
    "year": "1999-2000",
    "name": "Cristino \"Tito\" Panlilio",
    "decadeGroup": "1990s",
    "photoUrl": "https://static.wixstatic.com/media/941b16_578b8c028bee418480bbc3dcb6a5f87b~mv2.jpeg"
  },
  {
    "id": "p-36",
    "year": "2000-2001",
    "name": "Roland \"Roland\" U. Young",
    "decadeGroup": "2000s",
    "photoUrl": "https://static.wixstatic.com/media/941b16_1f2a2cd5b0f447ada7ef0b3b02ba2820~mv2.jpeg"
  },
  {
    "id": "p-37",
    "year": "2001-2002",
    "name": "Juan \"Jonny\" J. Carlos, Jr.",
    "decadeGroup": "2000s",
    "photoUrl": "https://static.wixstatic.com/media/941b16_5c64876a330340a0bc9130a74c25c8e8~mv2.jpeg"
  },
  {
    "id": "p-38",
    "year": "2002-2003",
    "name": "Robert \"Robert\" F. Kuan",
    "decadeGroup": "2000s",
    "bio": {
      "intro": [
        "International Service took center stage during Pres. Robert 'Robert' Kuan's watch. Through his personal efforts, the Club expanded its circle of fellowship on the national level with the addition of nine brother clubs — RC Intramuros in Manila, RC Metro San Fernando and RC Baguio North in Northern Luzon, RC Bay, RC Lucena South, and RC Gumaca in Southern Luzon, RC Brooke's Point in Palawan, and RC Tagbilaran and RC Boracay in the Visayas. He also established a connection to China by forging a pact with RC Shanghai.",
        "A significant move Pres. Robert took was the revival of long-lost ties with the Rotary Club of Taoyuan-Taiwan. Started in 1981-1982, 21 years earlier, the alliance somehow lost fire along the way, causing the two clubs to lose contact for many years. After the reunion, which took place at the zone institute held in Manila that year, relations between the two clubs have steadily grown closer, made stronger by an annual exchange of visits on important occasions and deep personal friendships among members.",
        "The Club also organized a new club — the Rotary Club of Makati-Poblacion, its 6th daughter club. On Pres. Robert's invitation, philanthropist Angelo King made a substantial contribution to The Rotary Foundation that boosted the Club's total giving and swelled its Paul Harris Fellows roster by an unprecedented, and likely unbreakable, 250. The $250,000 gift automatically qualified Angelo King for membership in the elite Arch Klumph Society of TRF major donors."
      ]
    }
  },
  {
    "id": "p-39",
    "year": "2003-2004",
    "name": "Rene \"Rene\" B. Benitez",
    "decadeGroup": "2000s",
    "photoUrl": "https://static.wixstatic.com/media/941b16_eb038f7898594cf288b37052aaecaa44~mv2.png"
  },
  {
    "id": "p-40",
    "year": "2003-2004",
    "name": "Wellington \"Willie\" Soong",
    "decadeGroup": "2000s",
    "photoUrl": "https://static.wixstatic.com/media/941b16_3927106e5b5b4e258bc5a4a3b224c57a~mv2.jpeg"
  },
  {
    "id": "p-41",
    "year": "2004-2005",
    "name": "Federico \"Freddie\" Borromeo",
    "decadeGroup": "2000s",
    "photoUrl": "https://static.wixstatic.com/media/941b16_ca8e79efafca42aaada649036bf7564f~mv2.jpeg"
  },
  {
    "id": "p-42",
    "year": "2005-2006",
    "name": "Jesus \"Sonny\" Tambunting",
    "decadeGroup": "2000s",
    "photoUrl": "https://static.wixstatic.com/media/941b16_f7c77f759092413daa8e79fb6a8be088~mv2.jpeg"
  },
  {
    "id": "p-43",
    "year": "2006-2007",
    "name": "Conrado \"Conrad\" Marty",
    "decadeGroup": "2000s",
    "photoUrl": "https://static.wixstatic.com/media/941b16_b978685d909442c895dc9bda871a6476~mv2.jpeg"
  },
  {
    "id": "p-44",
    "year": "2007-2008",
    "name": "Jose A.R. \"Pepito\" Bengzon",
    "decadeGroup": "2000s",
    "photoUrl": "https://static.wixstatic.com/media/941b16_cd3276e18b794b5b942e86a090789315~mv2.jpeg",
    "isActive": true,
    "activeRole": "PDG & Board Adviser"
  },
  {
    "id": "p-45",
    "year": "2008-2009",
    "name": "Larry \"Larry\" Boyer",
    "decadeGroup": "2000s",
    "photoUrl": "https://static.wixstatic.com/media/941b16_a8a5bbf5bddd4cd2ae57dd956bcde666~mv2.jpeg"
  },
  {
    "id": "p-46",
    "year": "2009-2010",
    "name": "Felix \"Felix\" Amparo",
    "decadeGroup": "2000s",
    "photoUrl": "https://static.wixstatic.com/media/941b16_8dd25cdb890449b58e329b95dd6b63a4~mv2.jpeg"
  },
  {
    "id": "p-47",
    "year": "2010-2011",
    "name": "Filadelfo \"Jun\" S. Rojas Jr.",
    "decadeGroup": "2010s",
    "photoUrl": "https://static.wixstatic.com/media/941b16_c233a3128c364f0ca1efb354c997cfe5~mv2.jpeg",
    "isActive": true,
    "activeRole": "Active Past President"
  },
  {
    "id": "p-48",
    "year": "2011-2012",
    "name": "Renato \"Rene\" Limjoco",
    "decadeGroup": "2010s",
    "photoUrl": "https://static.wixstatic.com/media/941b16_a008ba9a72d44f1ba5a76d43f9512de4~mv2.jpeg",
    "isActive": true,
    "activeRole": "Active Past President"
  },
  {
    "id": "p-49",
    "year": "2012-2013",
    "name": "Reuben \"Ruben\" M. Valerio",
    "decadeGroup": "2010s",
    "photoUrl": "https://static.wixstatic.com/media/941b16_a3bf8ba4caae400983a0b10c70fad4ab~mv2.jpeg",
    "isActive": true,
    "activeRole": "Active Past President"
  },
  {
    "id": "p-50",
    "year": "2013-2014",
    "name": "Carlos Miguel \"Carlo\" Rufino",
    "decadeGroup": "2010s",
    "photoUrl": "https://static.wixstatic.com/media/941b16_5b8f2340a94948238ace001440a96090~mv2.jpeg",
    "isActive": true,
    "activeRole": "Board Adviser"
  },
  {
    "id": "p-51",
    "year": "2014-2015",
    "name": "Reginald Alberto \"Reggie\" B. Nolido",
    "decadeGroup": "2010s",
    "photoUrl": "https://static.wixstatic.com/media/941b16_157a9e4d4f684d23a28c620f93ef6a16~mv2.jpeg",
    "isActive": true,
    "activeRole": "District Governor & Adviser"
  },
  {
    "id": "p-52",
    "year": "2015-2016",
    "name": "Eduardo \"Eddie\" H. Yap",
    "decadeGroup": "2010s",
    "photoUrl": "https://static.wixstatic.com/media/941b16_8b9de335a5d8477caf39f0b282d79400~mv2.jpeg",
    "isActive": true,
    "activeRole": "Active Past President",
    "bio": {
      "intro": [
        "There are a number of milestone years in the Club's history but none bigger and more anticipated than the 50th anniversary of its birth. By an uncanny turn, the man chosen to lead the Club on this 'golden' year—Eddie Yap—has direct connections to its illustrious past: he had been president of RC Pasay, Makati's mother club, in the mid-80s; he was also a one-time member of RC Makati West, the first of the Club's eight 'daughter' clubs.",
        "Pres. Eddie came to the presidency with a mind brimming with ideas and a heart eager to get things moving, done, and done well. He did so even as he hewed to the cherished traditions of the Club, sought counsel from the elders and support from fellow members, and drew everyone to the table to partake of and contribute to the menu of projects and activities on the year's agenda.",
        "His term gets high marks in terms of compliance with the RI Strategic Plan for 2013-2016, goals that clubs are tasked to hew closely to."
      ],
      "sections": [
        {
          "title": "Support and Strengthen the Club",
          "content": [
            "Serious about getting every member of the Club to the contributors' table, he devised a clustering scheme that covered everybody on the roster. The clusters were each assigned a month to take charge of the weekly programs, to drum up attendance and recruit new members, with the month's comparative results published in the newsletter, Kaunlaran.",
            "The cluster scheme bore fruit with the record attendance of members and Anns at the induction ball, and the induction of eleven new members, resulting in a net gain of six after the loss of five, including two deceased.",
            "The grand anniversary fete at the new Shangri-la at the Fort on March 12, 2016 was a certified social coup — a dance concert billed as 'Spirit of '67, Spirit of 50' and a staging of The Nutcracker ballet at the Cultural Center of the Philippines raised enough funds to cover a gala dinner for some 500 members and guests and a Vienna Spring Concert performed by the Philippine Philharmonic Orchestra.",
            "One of the goals for the 50th year was to enlist 50 Paul Harris Fellows, one for every year of the Club's existence — the response resulted in the enlistment of 100 PHFs, double the target, a feat that shattered all records. At the district conference at Sofitel Plaza, RC Makati was recognized as No. 1 in total TRF giving, with contributions surpassing those of all other listed clubs combined."
          ]
        },
        {
          "title": "Focus on and Increase Humanitarian Projects",
          "content": [
            "Two milestone projects took center stage — a fresh run of the long-running National Awards for Community Service (NACS), and a brand-new Air Quality Monitoring System with three stations equipped to read and evaluate air quality data in real time.",
            "The Medical Missions Committee offered free surgery at the Philippine General Hospital to over 50 patients suffering from breast cancer, goiter and gall stones. Over 900 children afflicted with primary complex were given the prescribed 6-month medical treatment under the 'End TB Now' program. Five modules of the supplemental feeding program nursed some 150 undernourished children back to health.",
            "A global grant of $94,560 made possible the delivery on March 16, 2016 of fiberglass boats to 168 Leyte fishermen who had lost their livelihoods to Yolanda in 2013.",
            "The Books Across the Seas project (BATS) kept alive its 28-year tradition, with 15,442,217 books and other reading materials distributed to some 65,000 schools since 1988."
          ]
        },
        {
          "title": "Enhance Public Image and Awareness",
          "content": [
            "This year saw the Club's stock rise to new heights with an exclusive arrangement with the Philippine Daily Inquirer for weekly press releases on significant projects and activities. The year-long publicity on the top national broadsheet brought RC Makati to national prominence and raised awareness of Rotary as the world's top humanitarian organization.",
            "President Eddie Yap was interviewed on ABS-CBN's morning show, Umagang Kay Ganda, soon after the installation of an air quality monitoring unit along Ayala Avenue. The Club was featured twice in the Philippine Rotary Magazine in 2016 — on the occasion of its 50th anniversary in March, and again in April."
          ]
        }
      ],
      "closing": [
        "Fifty glorious years of humanitarian service measured in dreams fulfilled, lives made better and decent communities carved out of slums, and joyful fellowship affirmed by strangers turned into acquaintances, acquaintances into friends, friends into family."
      ]
    }
  },
  {
    "id": "p-53",
    "year": "2016-2017",
    "name": "David \"David\" Ackerman",
    "decadeGroup": "2010s",
    "photoUrl": "https://static.wixstatic.com/media/941b16_e587876b763247b8a2fd5da9df1f141a~mv2.jpg",
    "isActive": true,
    "activeRole": "Active Past President"
  },
  {
    "id": "p-54",
    "year": "2017-2018",
    "name": "Conrado \"Jun Jun\" M. Dayrit III",
    "decadeGroup": "2010s",
    "photoUrl": "https://static.wixstatic.com/media/941b16_fa8707221b9145e0baf4e3143e7c4b55~mv2.jpg",
    "isActive": true,
    "activeRole": "Active Past President"
  },
  {
    "id": "p-55",
    "year": "2018-2019",
    "name": "Alfredo \"Fred\" E. Pascual",
    "decadeGroup": "2010s",
    "photoUrl": "https://static.wixstatic.com/media/941b16_fc6a51b1ccea425a9c59b29a2ac1c3bb~mv2.jpg",
    "isActive": true,
    "activeRole": "Active Past President"
  },
  {
    "id": "p-56",
    "year": "2019-2020",
    "name": "Vicente \"Bimbo\" T. Mills Jr.",
    "decadeGroup": "2010s",
    "photoUrl": "https://static.wixstatic.com/media/941b16_0a91ba063cfc482d9cd7b39e7f12702b~mv2.jpg",
    "isActive": true,
    "activeRole": "Board Adviser"
  },
  {
    "id": "p-57",
    "year": "2020-2021",
    "name": "Peter \"Peter\" M. Manzano",
    "decadeGroup": "2020s",
    "photoUrl": "https://static.wixstatic.com/media/941b16_5ab82a1590b341d4ad4597ad6dbf5159~mv2.jpg",
    "isActive": true,
    "activeRole": "Active Past President"
  },
  {
    "id": "p-58",
    "year": "2021-2022",
    "name": "Luis Angel \"Louie\" G. Aseoche",
    "decadeGroup": "2020s",
    "photoUrl": "https://static.wixstatic.com/media/941b16_781c10798d62471891515b1ecf1de5f1~mv2.jpg",
    "isActive": true,
    "activeRole": "District Secretary & Adviser"
  },
  {
    "id": "p-59",
    "year": "2022-2023",
    "name": "Michael \"Michael\" L. Escaler",
    "decadeGroup": "2020s",
    "photoUrl": "https://static.wixstatic.com/media/941b16_959cbdc74cc24c86968308958e14949a~mv2.jpg",
    "isActive": true,
    "activeRole": "Active Past President"
  },
  {
    "id": "p-60",
    "year": "2023-2024",
    "name": "Senen \"Bing\" L. Matoto",
    "decadeGroup": "2020s",
    "photoUrl": "https://static.wixstatic.com/media/941b16_4851784eed2d40a6bea3025d094b8501~mv2.jpg",
    "isActive": true,
    "activeRole": "Board Adviser"
  },
  {
    "id": "p-61",
    "year": "2024-2025",
    "name": "Keith A.D. Harrison",
    "decadeGroup": "2020s",
    "photoUrl": "https://static.wixstatic.com/media/b2fb7d_a10f3c5ae87d4c4ebb03d0663002a87d~mv2.jpg",
    "isActive": true,
    "activeRole": "Immediate Past President & Director"
  },
  {
    "id": "p-62",
    "year": "2025-2026",
    "name": "Eduardo \"Eddie\" H. Galvez",
    "decadeGroup": "2020s",
    "isCurrent": true,
    "photoUrl": "https://static.wixstatic.com/media/b2fb7d_a5fbefa18cbc48c49181378297460c8c~mv2.jpg",
    "isActive": true,
    "activeRole": "President",
    "termHighlights": [
      "Served as President for term year 2025-2026",
      "Now holds the title of Immediate Past President (IPP)",
      "Chaired the national judging panel for PHYLA (Paing Hechanova Youth Leadership Awards), the club's flagship youth leadership awards program, alongside PP Raissa Hechanova Posadas",
      "Authored the President's Message in Kaunlaran Issue No. 26, the Club's 60th Charter Anniversary bulletin issue",
      "Presided over the Club's 61st Induction Ball at The Peninsula Manila (July 17, 2026), where he formally turned over leadership to incoming President Chris Ferareza, including the traditional exchange of the President's Pin, Rotary International banners, and the ceremonial gavel"
    ]
  }
];
