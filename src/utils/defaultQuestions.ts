import { TriviaQuestion } from './indexedDB';

export const DEFAULT_TRIVIA_QUESTIONS: TriviaQuestion[] = [
  // ---------------- AGE GROUP: 4-8 years ----------------
  {
    id: 'kids-4-8-1',
    category: 'Life of Jesus',
    ageGroup: '4-8',
    question: 'Where was baby Jesus born?',
    options: ['In a beautiful palace', 'In a stable in Bethlehem', 'On a mountain top', 'Under the sea'],
    correctAnswer: 1,
    explanation: 'Jesus was born in Bethlehem in a stable (manger) under the shining star because there was no room in the inn.'
  },
  {
    id: 'kids-4-8-2',
    category: 'Bible Heroes',
    ageGroup: '4-8',
    question: 'Who defeated the giant Goliath with just a tiny stone and a sling?',
    options: ['Peter', 'Samson', 'Noah', 'David'],
    correctAnswer: 3,
    explanation: 'David was a small shepherd boy who trusted God and defeated the giant Goliath with one stone!'
  },
  {
    id: 'kids-4-8-3',
    category: 'Old Testament',
    ageGroup: '4-8',
    question: 'What animal did Jonah live inside for three whole days?',
    options: ['A big dog', 'A giant fish', 'An elephant', 'A friendly dolphin'],
    correctAnswer: 1,
    explanation: 'A great fish swallowed Jonah after he did not obey God\'s call to go to Nineveh.'
  },
  {
    id: 'kids-4-8-4',
    category: 'Old Testament',
    ageGroup: '4-8',
    question: 'Who built the giant wooden Ark to save all kinds of animals from the flood?',
    options: ['Noah', 'Moses', 'Joseph', 'Paul'],
    correctAnswer: 0,
    explanation: 'God told Noah to build an Ark to keep his family and the animals safe during the great rain.'
  },
  {
    id: 'kids-4-8-5',
    category: 'Life of Jesus',
    ageGroup: '4-8',
    question: 'How many disciples did Jesus choose to follow Him?',
    options: ['5', '12', '100', '3'],
    correctAnswer: 1,
    explanation: 'Jesus called 12 disciples to be His special friends and help him teach the world about God\'s love.'
  },

  // ---------------- AGE GROUP: 9-13 years ----------------
  {
    id: 'kids-9-13-1',
    category: 'New Testament',
    ageGroup: '9-13',
    question: 'What was Saul\'s name changed to after he met Jesus on the road to Damascus?',
    options: ['Silas', 'Peter', 'Paul', 'Barnabas'],
    correctAnswer: 2,
    explanation: 'Acts 9 describes the dramatic conversion of Saul on the road to Damascus, who was then known as Paul, the Apostle to the Gentiles.'
  },
  {
    id: 'kids-9-13-2',
    category: 'Old Testament',
    ageGroup: '9-13',
    question: 'What beautiful coat did Israel (Jacob) give to his favorite son, Joseph?',
    options: ['A shiny gold armor coat', 'A coat of many colors', 'A soft wool cloak', 'A royal blue robe'],
    correctAnswer: 1,
    explanation: 'Jacob loved Joseph more than his other children, so he made Joseph a splendid coat of many colors, triggering jealousy among his brothers.'
  },
  {
    id: 'kids-9-13-3',
    category: 'Bible Heroes',
    ageGroup: '9-13',
    question: 'Which strong man lost his power when his hair was cut while he was sleeping?',
    options: ['Samson', 'Goliath', 'Daniel', 'Moses'],
    correctAnswer: 0,
    explanation: 'Samson dedicated his strength to God under a Nazarite vow; when his hair was cut by Delilah\'s trickery, God\'s special strength left him.'
  },
  {
    id: 'kids-9-13-4',
    category: 'Life of Jesus',
    ageGroup: '9-13',
    question: 'With what food did Jesus miraculously feed five thousand hungry people?',
    options: ['Manna and quail', 'Five loaves of bread and two fish', 'Seven apples and milk', 'Honey and wild locusts'],
    correctAnswer: 1,
    explanation: 'A young boy donated his humble lunch of five barley loaves and two small fish, which Jesus blessed and multiplied to feed the crowds.'
  },
  {
    id: 'kids-9-13-5',
    category: 'Old Testament',
    ageGroup: '9-13',
    question: 'What was the first plague God sent upon Egypt when Pharaoh refused to let Israel go?',
    options: ['The Nile river turned to blood', 'Swarms of frogs', 'A thick darkness', 'Hordes of locusts'],
    correctAnswer: 0,
    explanation: 'The first plague was turning the water of the Nile river into blood, demonstrating God\'s power over the Egyptian gods.'
  },

  // ---------------- AGE GROUP: 14-18 years ----------------
  {
    id: 'teens-14-18-1',
    category: 'New Testament',
    ageGroup: '14-18',
    question: 'Which of the following New Testament Epistles contains the famous "Armor of God" teaching?',
    options: ['Galatians', 'Ephesians', 'Philippians', 'Colossians'],
    correctAnswer: 1,
    explanation: 'Ephesians 6:10-18 outlines the Spiritual Armor of God, including the Shield of Faith and Sword of the Spirit.'
  },
  {
    id: 'teens-14-18-2',
    category: 'Old Testament',
    ageGroup: '14-18',
    question: 'How did God appear to Moses when He first called him to go back and confront Egypt?',
    options: ['In a mighty earthquake', 'Through a roaring lion', 'Within a burning bush that did not burn up', 'In a dream of a golden ladder'],
    correctAnswer: 2,
    explanation: 'In Exodus 3, Moses was shepherd in Midian when God appeared to him in a bush which burned with fire but was not consumed.'
  },
  {
    id: 'teens-14-18-3',
    category: 'Bible Heroes',
    ageGroup: '14-18',
    question: 'What Hebrew name was Daniel given when he was taken captive in Babylon?',
    options: ['Belteshazzar', 'Shadrach', 'Meshach', 'Abednego'],
    correctAnswer: 0,
    explanation: 'Daniel 1:7 tells us that the chief official gave new Babylonian names: Daniel was called Belteshazzar, while Hananiah, Mishael, and Azariah were renamed Shadrach, Meshach, and Abednego.'
  },
  {
    id: 'teens-14-18-4',
    category: 'Life of Jesus',
    ageGroup: '14-18',
    question: 'According to the Gospels, what was the first miracle Jesus performed publically?',
    options: ['Walking on water', 'Healing a blind man', 'Turning water into wine at Cana', 'Raising Lazarus from the dead'],
    correctAnswer: 2,
    explanation: 'John 2 records the wedding feast at Cana, where Jesus turned water into excellent wine, marking the beginning of His public miracles.'
  },
  {
    id: 'teens-14-18-5',
    category: 'New Testament',
    ageGroup: '14-18',
    question: 'Where was John the Apostle exiled when he received the visions recorded in Revelation?',
    options: ['Rome', 'The Island of Patmos', 'Ephesus', 'Damascus'],
    correctAnswer: 1,
    explanation: 'Revelation 1:9 states that John was on the island of Patmos because of the word of God and the testimony of Jesus Christ.'
  },

  // ---------------- AGE GROUP: Adults ----------------
  {
    id: 'adults-1',
    category: 'Old Testament',
    ageGroup: 'Adults',
    question: 'Who was the left-handed judge of Israel who defeated King Eglon of Moab?',
    options: ['Ehud', 'Othniel', 'Gideon', 'Jephthah'],
    correctAnswer: 0,
    explanation: 'Judges 3:12-30 details the life of Ehud, the left-handed judge who delivered Israel from Moabite oppression by making a secret double-edged dagger.'
  },
  {
    id: 'adults-2',
    category: 'New Testament',
    ageGroup: 'Adults',
    question: 'In the King James Version of the Bible, which book directly precedes Thessalonians?',
    options: ['Philippians', 'Colossians', 'Timothy', 'Titus'],
    correctAnswer: 1,
    explanation: 'The order of Pauline epistles in the New Testament is: Galatians, Ephesians, Philippians, Colossians, 1 & 2 Thessalonians.'
  },
  {
    id: 'adults-3',
    category: 'Bible Heroes',
    ageGroup: 'Adults',
    question: 'Which priest and scribe led a second wave of Jewish exiles back to Jerusalem to restore the Law of God?',
    options: ['Nehemiah', 'Ezra', 'Zerubbabel', 'Haggai'],
    correctAnswer: 1,
    explanation: 'Ezra 7 tells the story of Ezra, a teacher well versed in the Law of Moses, who returns with authorization from Artaxerxes to teach and rebuild.'
  },
  {
    id: 'adults-4',
    category: 'Life of Jesus',
    ageGroup: 'Adults',
    question: 'To which Old Testament prophet does Jesus refer when talking about the "sign" of His death and resurrection?',
    options: ['Jonah', 'Isaiah', 'Elijah', 'Daniel'],
    correctAnswer: 0,
    explanation: 'In Matthew 12:40, Jesus says, "For as Jonah was three days and three nights in the belly of a huge fish, so the Son of Man will be three days and three nights in the heart of the earth."'
  },
  {
    id: 'adults-5',
    category: 'Old Testament',
    ageGroup: 'Adults',
    question: 'Who was the father of King David, hailing from the small house of Bethlehem?',
    options: ['Boaz', 'Jesse', 'Obed', 'Solomon'],
    correctAnswer: 1,
    explanation: '1 Samuel 16 tells how Samuel visited Jesse of Bethlehem to select David, the youngest son, to be anointed as Saul\'s successor.'
  }
];
