// All the words in the app. Plain English for readers aged 8 to 11.
window.LTC = window.LTC || {};

LTC.moreJokes = [
  ["What is a robot's favourite snack?", "Computer chips!"],
  ["Why did Bit sit on the clock?", "It wanted to be on time!"],
  ["What do you call a robot that takes the long way round?", "R2-Detour!"],
  ["Why was the maths book sad?", "It had too many problems."],
  ["How does a computer get drunk on lemonade?", "It takes too many screenshots!"],
  ["Why did the computer go to the doctor?", "It had a virus!"],
  ["What do you call a sleeping robot?", "A nap-top!"],
  ["Why don't robots ever panic?", "They always keep their cool… with a fan!"],
  ["What did the spider do on the computer?", "It made a website!"],
  ["Why did the mouse go to the computer?", "To find the cheese-board… sorry, keyboard!"],
  ["What is Bit's favourite kind of music?", "Heavy metal!"],
  ["Why was the robot so tired after the holiday?", "It had a hard drive!"],
  ["How do robots eat guacamole?", "With micro-chips!"],
  ["Why did the code break up with the bug?", "It needed some space… bar!"],
  ["What do you call a secret agent pig?", "Ham-es Bond!"],
  ["Why did the zero tell the eight a joke?", "Because the eight had a nice belt!"],
  ["Why did the cipher feel lonely?", "Nobody could understand it!"],
  ["What did the computer say after lunch?", "That was a byte-sized meal!"],
  ["Why did Bit wear sunglasses to school?", "Its screen was too bright!"],
  ["How do you make a robot laugh?", "Tell it a joke it can process!"],
  ["Why did the password go to the gym?", "To get stronger!"],
  ["What's a detective's favourite shape?", "A clue-b!"],
  ["Why did the robot cross the road?", "It was programmed by a chicken!"],
  ["What do you call a computer that sings?", "A Dell-a Fitzgerald!"],
  ["Why do programmers prefer dark mode?", "Because light attracts bugs!"],
  ["Why was the keyboard always tired?", "It had two shifts!"],
  ["What did Bit say to the sad laptop?", "Don't worry, you'll reboot!"],
  ["What is a robot's favourite game?", "Hide and seek… it always finds you with its scanner!"],
  ["Why did the number 7 hide?", "Because 7 8 9!"],
  ["Why did the detective bring a pencil to bed?", "To draw the curtains!"],
  ["What do you call a dinosaur that cracks codes?", "A Thesaurus-Hex!"],
  ["Why did Bit bring a map to the computer?", "To find the hidden folders!"],
  ["How does a robot shave?", "With a laser blade!"],
  ["Why are binary jokes so short?", "They only use 1s and 0s!"],
  ["What did the router say to the phone?", "Let's stay connected!"],
  ["Why did the robot go back to bed?", "It woke up on the wrong side of the motherboard!"],
  ["What do you call a fake noodle?", "An im-pasta! Always check your facts!"],
  ["Why do robots love the beach?", "They like to surf the web!"],
  ["What did the 1 say to the 0?", "Together, we make everything!"],
];

LTC.words = {
  short: ["CODE", "CLUE", "BYTE", "MAZE", "KEY", "SPY", "MAP", "BUG", "BOX", "LOCK", "SAFE", "WIFI", "ZOOM", "STAR", "MOON", "CAKE"],
  medium: ["ROBOT", "PIZZA", "PIXEL", "LASER", "TIGER", "MAGNET", "CASTLE", "PLANET", "SECRET", "PUZZLE", "ROCKET", "GALAXY", "DRAGON", "BANANA", "CIPHER", "BINARY", "SIGNAL", "PIRATE"],
  phrases: ["MEET AT NOON", "BIT LOVES PIZZA", "LOOK UNDER THE MAT", "THE KEY IS BLUE", "CHECK THE CLOCK", "TRUST THE CLUES", "ROBOTS RULE", "CODE IS FUN", "FOLLOW THE MAP", "OPEN THE SAFE", "HIDE THE GOLD", "THE OWL KNOWS"],
};

// Learn: concept pages. Each has a short intro, body paragraphs, an example and a quick question.
LTC.concepts = [
  {
    id: "bits", title: "Bits and binary", tag: "Numbers",
    intro: "Computers only understand two things: ON and OFF. That's all!",
    body: [
      "We write ON as <b>1</b> and OFF as <b>0</b>. One 1 or one 0 is called a <b>bit</b>. Bit the robot is named after it.",
      "With just 1s and 0s, a computer can write any number. This way of counting is called <b>binary</b>.",
      "Each place in a binary number is worth double the place on its right: 1, 2, 4, 8, 16 and so on. Add up the places that have a 1.",
    ],
    example: "<b>1011</b> = 8 + 0 + 2 + 1 = <b>11</b>",
    quiz: { q: "What is 0110 in normal numbers?", a: "6", why: "0 + 4 + 2 + 0 = 6" },
    tool: "binary",
  },
  {
    id: "lettercode", title: "Letters in binary", tag: "Codes",
    intro: "If numbers can be binary, letters can be too.",
    body: [
      "Give every letter a number: A = 1, B = 2, C = 3 … Z = 26.",
      "Then write that number in binary. Five bits are enough for all 26 letters, because 11111 = 31.",
      "Real computers use a bigger code called <b>ASCII</b> or <b>Unicode</b>. It gives a number to every letter, digit, emoji and symbol.",
    ],
    example: "<b>00010 01001 10100</b> = 2, 9, 20 = <b>B I T</b>",
    quiz: { q: "Which letter is 00011?", a: "C", why: "00011 = 2 + 1 = 3, and the 3rd letter is C." },
    tool: "binary",
  },
  {
    id: "caesar", title: "The Caesar cipher", tag: "Codes",
    intro: "One of the oldest secret codes in the world. Julius Caesar used it 2,000 years ago!",
    body: [
      "To lock a message, move every letter forward in the alphabet by the same number of steps. That number is the <b>key</b>, or <b>shift</b>.",
      "To unlock it, move every letter back by the same number.",
      "At the end of the alphabet, go round to the start again: with a shift of 3, X becomes A.",
    ],
    example: "Shift 3: <b>CAT</b> → <b>FDW</b>",
    quiz: { q: "With shift 1, what does IBU mean?", a: "HAT", why: "Move each letter back 1: I→H, B→A, U→T." },
    tool: "caesar",
  },
  {
    id: "pigpen", title: "The pigpen cipher", tag: "Codes",
    intro: "A code made of shapes instead of letters. It looks like little pig pens!",
    body: [
      "Draw two noughts-and-crosses grids and two big X shapes. Write the letters A to Z in the spaces.",
      "The second grid and the second X get a dot in each space.",
      "To write a letter, draw the shape of its space, with the dot if it has one. Freemasons used this code 300 years ago.",
    ],
    example: "Use the key in the Code Lab to see every shape.",
    quiz: { q: "Does the letter K have a dot?", a: "YES", why: "K is in the second grid (J to R), and that grid has dots." },
    tool: "pigpen",
  },
  {
    id: "algorithms", title: "Algorithms", tag: "Thinking",
    intro: "An algorithm is a list of steps that solves a problem.",
    body: [
      "A recipe is an algorithm. So are the instructions for brushing your teeth.",
      "Computers need very exact steps. \"Make a sandwich\" is too vague. \"Take two slices of bread\" is better.",
      "Good algorithms are clear, in the right order, and always finish.",
    ],
    example: "1. Fill the kettle. 2. Switch it on. 3. Wait until it clicks. 4. Pour the water.",
    quiz: { q: "Is \"Do something nice\" a good step for a computer? (yes or no)", a: "NO", why: "It's too vague. A computer needs exact steps." },
  },
  {
    id: "ifelse", title: "IF and ELSE", tag: "Coding",
    intro: "Computers make decisions with IF and ELSE.",
    body: [
      "<b>IF</b> something is true, do one thing. <b>ELSE</b>, do something different.",
      "A game might say: IF the player touches a coin, add 1 point. ELSE, keep running.",
      "You use IF and ELSE every day: IF it is raining, take an umbrella. ELSE, take sunglasses.",
    ],
    example: "IF age ≥ 8 THEN \"You can ride\" ELSE \"Sorry, not yet\"",
    quiz: { q: "IF number > 10 say BIG, ELSE say SMALL. What is said for 7?", a: "SMALL", why: "7 is not bigger than 10, so the ELSE part runs." },
  },
  {
    id: "loops", title: "Loops", tag: "Coding",
    intro: "A loop tells a computer to do something again and again.",
    body: [
      "Instead of writing \"jump\" ten times, you write: REPEAT 10 TIMES: jump.",
      "Some loops run until something happens: WHILE the bath is not full, keep the tap on.",
      "Loops make programs short. Games use one big loop that redraws the screen about 60 times a second.",
    ],
    example: "REPEAT 4 TIMES: walk 10 steps, turn right. (You walked a square!)",
    quiz: { q: "REPEAT 3 TIMES: add 2. You start at 0. What do you get?", a: "6", why: "0 + 2 + 2 + 2 = 6" },
  },
  {
    id: "gates", title: "Logic gates", tag: "Thinking",
    intro: "Tiny switches inside a computer that answer TRUE or FALSE questions.",
    body: [
      "<b>AND</b> gives 1 only if <i>both</i> inputs are 1. Like a door with two locks: you need both keys.",
      "<b>OR</b> gives 1 if <i>at least one</i> input is 1. Like a doorbell at the front and the back.",
      "<b>NOT</b> flips the input: 1 becomes 0, and 0 becomes 1.",
    ],
    example: "1 AND 0 = <b>0</b> · 1 OR 0 = <b>1</b> · NOT 1 = <b>0</b>",
    quiz: { q: "What is 1 AND 1?", a: "1", why: "Both inputs are 1, so AND gives 1." },
  },
  {
    id: "sorting", title: "Sorting", tag: "Thinking",
    intro: "Putting things in order is one of the most common jobs for a computer.",
    body: [
      "<b>Bubble sort</b> compares two neighbours. If they are in the wrong order, swap them. Repeat until no swaps are needed.",
      "Big numbers \"bubble up\" to the end, like bubbles in a drink.",
      "Search engines, music apps and online shops sort millions of things every second.",
    ],
    example: "3 1 2 → 1 3 2 → 1 2 3 ✓",
    quiz: { q: "Sort 4, 9, 2 from small to big. Type them with no spaces.", a: "249", why: "2 is smallest, then 4, then 9." },
  },
  {
    id: "hex", title: "Hexadecimal", tag: "Numbers",
    intro: "A way of counting with 16 digits instead of 10.",
    body: [
      "Hex uses 0 to 9, then A = 10, B = 11, C = 12, D = 13, E = 14 and F = 15.",
      "In a two-digit hex number, the left digit is worth 16 times as much.",
      "Web designers write colours in hex: #FF0000 is bright red.",
    ],
    example: "<b>1A</b> = 16 + 10 = <b>26</b>",
    quiz: { q: "What is hex F in normal numbers?", a: "15", why: "A=10, B=11, C=12, D=13, E=14, F=15." },
  },
  {
    id: "patterns", title: "Patterns and sequences", tag: "Numbers",
    intro: "Spotting patterns is a superpower for coders and detectives.",
    body: [
      "A sequence is a list of numbers that follows a rule.",
      "Ask: does it go up by the same amount? Does it double? Does each number add the two before it?",
      "Once you find the rule, you can work out the next number. Computers use patterns to predict the weather!",
    ],
    example: "2, 4, 8, 16 → rule: double → next is <b>32</b>",
    quiz: { q: "What comes next? 1, 1, 2, 3, 5, …", a: "8", why: "Add the two numbers before: 3 + 5 = 8. This is the Fibonacci sequence." },
  },
  {
    id: "ai", title: "Can computers be wrong?", tag: "AI",
    intro: "Yes! Even clever robots like Bit make mistakes.",
    body: [
      "AI (artificial intelligence) learns from lots of examples. If the examples are wrong, the AI can be wrong too.",
      "AI can sound very sure, even when it's mistaken. So a good detective always checks.",
      "Ask: does this make sense? Can I check it another way? What does a trusted grown-up or book say?",
    ],
    example: "Bit says 2 + 2 = 5. Check: 2 apples + 2 apples = 4 apples. Bit glitched!",
    quiz: { q: "An AI says a spider has 6 legs. Is it right? (yes or no)", a: "NO", why: "Spiders have 8 legs. Insects have 6. Always check!" },
  },
];

// Mini mystery #1 (pilot). Each clue rules out one suspect.
LTC.mysteries = [
  {
    id: "cupcake", title: "The Golden Cupcake", level: "Easy · 3 clues · about 15 minutes",
    img: "case2",
    intro: [
      "It's the day of the school bake sale. The star prize is the <b>Golden Cupcake</b>, with real gold sprinkles. It sits on the top shelf of the trophy cabinet.",
      "At 11 o'clock, the head teacher opens the cabinet. The plate is empty! Only a few crumbs are left.",
      "Leo, Poppy and Bit have four suspects. Crack each clue to cross one out. The last one standing took the cupcake!",
    ],
    suspects: [
      { id: "rex", name: "Rex", role: "The school's robot vacuum", note: "Rolls around the hall all day. Loves crumbs." },
      { id: "ava", name: "Ava", role: "Year 6 baker", note: "Made the second-best cupcakes. Shoe size 4." },
      { id: "crumb", name: "Mr Crumb", role: "Caretaker", note: "Has keys to every cabinet. Shoe size 10." },
      { id: "dunn", name: "Coach Dunn", role: "PE teacher", note: "Always hungry after football. Shoe size 10." },
    ],
    clues: [
      {
        title: "Clue 1: The napkin note",
        story: "Poppy finds a napkin next to the cabinet. Someone wrote on it in a Caesar cipher with <b>shift 1</b>.",
        code: "VTFE B MBEEFS",
        kind: "caesar",
        answer: "USED A LADDER",
        hint: "Move every letter back 1 step: V → U, T → S …",
        reveal: "The thief used a ladder to reach the top shelf. Rex is a robot vacuum. It can't climb a ladder!",
        rules_out: "rex",
      },
      {
        title: "Clue 2: The footprint",
        story: "There is a dusty footprint on the ladder. Bit measures it and shows the shoe size in binary.",
        code: "1010",
        kind: "binary",
        answer: "10",
        hint: "The places are worth 8, 4, 2, 1. Add up the places with a 1.",
        reveal: "The footprint is size 10. Ava wears size 4, so it wasn't her.",
        rules_out: "ava",
      },
      {
        title: "Clue 3: The caretaker's note",
        story: "A note is stuck to the caretaker's cupboard. It's in pigpen! Use the key in the Code Lab.",
        code: "ROOF AT ELEVEN",
        kind: "pigpen",
        answer: "ROOF AT ELEVEN",
        hint: "Open Code Lab → Pigpen to see the key. The first letter is R.",
        reveal: "Mr Crumb was up on the roof at eleven o'clock, fixing a leak. The head teacher saw him there. It wasn't him!",
        rules_out: "crumb",
      },
    ],
    culprit: "dunn",
    solved: "Coach Dunn owns up. He moved the cupcake to keep it safe from Rex the crumb-hungry robot. Then he got hungry after football… and took one tiny bite. Then another. To say sorry, he buys cupcakes for the whole class!",
  },
];

LTC.books = {
  book1: {
    title: "The Little Turing Codebreakers & The Glitching Robot",
    blurb: "A crown vanishes from a locked vault. Robots go wild at the science fair. A skyscraper races towards a midnight blackout. Crack 24 puzzles about binary, ciphers, logic and algorithms to catch the culprits.",
    meta: "Book 1 · Ages 8–11 · Paperback, 100 pages",
  },
};
