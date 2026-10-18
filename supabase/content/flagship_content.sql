-- ============================================================
-- Saima Perveen English Academy - flagship course content
-- Adds, for "Spoken English Mastery" and "English Grammar Foundations":
--   * 2 extra lessons per module (real teaching notes)
--   * 1 quiz per module (5 questions, 60% pass mark, retakes allowed)
--   * 1 assignment per module
-- Safe to run more than once: anything already added is skipped.
-- Run in: Supabase > SQL Editor > New query > paste all > Run
-- ============================================================
do $outer$
declare
  content jsonb := $json$[
 {
  "slug": "spoken-english-mastery",
  "modules": [
   {
    "position": 1,
    "lessons": [
     {
      "position": 2,
      "title": "Introducing Yourself",
      "notes": "<h3>A simple self-introduction</h3><p>A good introduction is short, clear and friendly. Use one idea per sentence and speak slowly.</p><ul><li><strong>Name:</strong> \"Hello, I'm Ayesha.\"</li><li><strong>Place:</strong> \"I'm from Lahore.\"</li><li><strong>Work or study:</strong> \"I work as a teacher.\" / \"I'm a student.\"</li><li><strong>Interests:</strong> \"I enjoy cooking and reading.\"</li><li><strong>Closing:</strong> \"It's nice to meet you.\"</li></ul><h3>Example</h3><p>\"Hello, I'm Ayesha. I'm from Lahore. I work as a teacher, and I enjoy cooking. Nice to meet you.\"</p><p><strong>Tip:</strong> Smile, make eye contact, and pause briefly between sentences.</p>"
     },
     {
      "position": 3,
      "title": "Greetings and Small Talk",
      "notes": "<h3>Formal and informal greetings</h3><ul><li><strong>Formal:</strong> Good morning, sir. / Good evening, madam. / How do you do?</li><li><strong>Informal:</strong> Hi! / Hey! / How's it going?</li></ul><h3>Answering \"How are you?\"</h3><p>Do not only say \"fine.\" Add a short follow-up so the conversation continues:</p><ul><li>\"I'm fine, thanks. And you?\"</li><li>\"Not bad, thank you. How about you?\"</li></ul><h3>Small talk topics</h3><p>Weather, food, the journey, work or study, and family are safe, friendly topics when you meet someone new.</p><p><strong>Practice:</strong> Say a greeting, answer \"How are you?\", and ask one small-talk question out loud, three times, a little faster each time.</p>"
     }
    ],
    "quiz": {
     "lesson": "Greetings and Small Talk",
     "title": "Week 1 Quiz: Introductions and Greetings",
     "questions": [
      {
       "type": "multiple_choice",
       "text": "Which is the most natural reply to \"How are you?\"",
       "options": [
        {
         "id": "a",
         "text": "I'm fine, thanks. And you?"
        },
        {
         "id": "b",
         "text": "I am fine, thank you very much for asking about my health condition"
        },
        {
         "id": "c",
         "text": "Yes, I am."
        },
        {
         "id": "d",
         "text": "My name is fine."
        }
       ],
       "correct": "a"
      },
      {
       "type": "multiple_choice",
       "text": "Which greeting is the most formal?",
       "options": [
        {
         "id": "a",
         "text": "Hey!"
        },
        {
         "id": "b",
         "text": "Good morning, sir."
        },
        {
         "id": "c",
         "text": "Yo!"
        },
        {
         "id": "d",
         "text": "What's up?"
        }
       ],
       "correct": "b"
      },
      {
       "type": "multiple_choice",
       "text": "What do you say when you meet someone for the first time?",
       "options": [
        {
         "id": "a",
         "text": "Nice to meet you."
        },
        {
         "id": "b",
         "text": "See you later."
        },
        {
         "id": "c",
         "text": "Goodbye."
        },
        {
         "id": "d",
         "text": "Long time no see."
        }
       ],
       "correct": "a"
      },
      {
       "type": "multiple_choice",
       "text": "Complete the sentence: I ___ from Karachi.",
       "options": [
        {
         "id": "a",
         "text": "am"
        },
        {
         "id": "b",
         "text": "is"
        },
        {
         "id": "c",
         "text": "are"
        },
        {
         "id": "d",
         "text": "be"
        }
       ],
       "correct": "a"
      },
      {
       "type": "true_false",
       "text": "\"Long time no see\" is used when you meet someone you have not seen for a long time.",
       "options": [
        {
         "id": "true",
         "text": "True"
        },
        {
         "id": "false",
         "text": "False"
        }
       ],
       "correct": "true"
      }
     ]
    },
    "assignment": {
     "title": "Assignment 1: My Self-Introduction",
     "instructions": "Prepare a self-introduction of 6 to 8 sentences. Include your name, where you are from, what you do (work or study), and two interests.\n\nThen either record it as a 1-minute voice note or video (upload an .mp3 or .mp4 file), or submit the written script (.pdf, .docx or .txt).\n\nSpeak slowly and clearly - accuracy and confidence matter more than speed."
    }
   },
   {
    "position": 2,
    "lessons": [
     {
      "position": 2,
      "title": "Words for Daily Life",
      "notes": "<h3>Learn words in groups</h3><p>Words are easier to remember when you learn them by topic.</p><ul><li><strong>Home:</strong> kitchen, bedroom, door, window, furniture</li><li><strong>Food and shopping:</strong> bakery, pharmacy, price, discount, receipt</li><li><strong>Transport:</strong> bus, rickshaw, station, ticket, traffic</li><li><strong>Time:</strong> morning, afternoon, weekend, schedule, appointment</li></ul><h3>Learn phrases, not single words</h3><p>Say <strong>make tea</strong>, <strong>take a bus</strong>, <strong>do homework</strong>, <strong>make a mistake</strong>. Words that go together are called collocations, and learning them makes your English sound natural.</p>"
     },
     {
      "position": 3,
      "title": "Using New Words in Sentences",
      "notes": "<h3>Hear it, say it, use it</h3><ol><li><strong>Hear it:</strong> listen to the word in a sentence.</li><li><strong>Say it:</strong> repeat it aloud three times.</li><li><strong>Use it:</strong> make your own sentence about your life.</li></ol><h3>Example</h3><p>Word: <strong>appointment</strong>.</p><p>\"I have a doctor's appointment on Friday.\"</p><h3>Review rule</h3><p>Review new words after 1 day, 3 days and 7 days. A short daily review is better than one long session.</p><p><strong>Practice:</strong> choose 5 words from the last lesson and write a true sentence about yourself for each.</p>"
     }
    ],
    "quiz": {
     "lesson": "Using New Words in Sentences",
     "title": "Week 2 Quiz: Everyday Vocabulary",
     "questions": [
      {
       "type": "multiple_choice",
       "text": "Which word means a shop where you buy medicine?",
       "options": [
        {
         "id": "a",
         "text": "Bakery"
        },
        {
         "id": "b",
         "text": "Pharmacy"
        },
        {
         "id": "c",
         "text": "Library"
        },
        {
         "id": "d",
         "text": "Stadium"
        }
       ],
       "correct": "b"
      },
      {
       "type": "multiple_choice",
       "text": "Complete the sentence: I take a ___ to the office every morning.",
       "options": [
        {
         "id": "a",
         "text": "bus"
        },
        {
         "id": "b",
         "text": "bread"
        },
        {
         "id": "c",
         "text": "bed"
        },
        {
         "id": "d",
         "text": "pen"
        }
       ],
       "correct": "a"
      },
      {
       "type": "multiple_choice",
       "text": "Which is the correct collocation?",
       "options": [
        {
         "id": "a",
         "text": "do a mistake"
        },
        {
         "id": "b",
         "text": "make a mistake"
        },
        {
         "id": "c",
         "text": "take a mistake"
        },
        {
         "id": "d",
         "text": "have a mistake"
        }
       ],
       "correct": "b"
      },
      {
       "type": "multiple_choice",
       "text": "What is the opposite of \"expensive\"?",
       "options": [
        {
         "id": "a",
         "text": "cheap"
        },
        {
         "id": "b",
         "text": "heavy"
        },
        {
         "id": "c",
         "text": "late"
        },
        {
         "id": "d",
         "text": "narrow"
        }
       ],
       "correct": "a"
      },
      {
       "type": "true_false",
       "text": "Learning words inside full phrases helps you remember how to use them.",
       "options": [
        {
         "id": "true",
         "text": "True"
        },
        {
         "id": "false",
         "text": "False"
        }
       ],
       "correct": "true"
      }
     ]
    },
    "assignment": {
     "title": "Assignment 2: My Everyday Word List",
     "instructions": "Make a personal word list of 15 everyday words: 5 about home, 5 about food or shopping, and 5 about transport.\n\nFor each word, write one sentence about your own life (for example: \"I buy bread from the bakery near my house.\").\n\nSubmit your list as a .pdf, .docx or .txt file."
    }
   },
   {
    "position": 3,
    "lessons": [
     {
      "position": 2,
      "title": "Present, Past and Future in Speaking",
      "notes": "<h3>Choose the right time</h3><ul><li><strong>Present simple</strong> - habits and facts: \"I drink tea every morning.\" / \"She works in a school.\"</li><li><strong>Past simple</strong> - finished actions: \"Yesterday I went to the market.\"</li><li><strong>Future</strong> - plans and decisions: \"I will call you tomorrow.\" / \"I am going to study tonight.\"</li></ul><h3>Remember</h3><p>With he, she and it, the present simple verb takes -s: <strong>he works</strong>, <strong>she drinks</strong>.</p><p>Many common past verbs are irregular: go - went, eat - ate, see - saw, buy - bought.</p>"
     },
     {
      "position": 3,
      "title": "Fixing Common Spoken Mistakes",
      "notes": "<h3>Mistakes to avoid</h3><ul><li>\"I am agree\" - say <strong>\"I agree.\"</strong></li><li>\"He don't know\" - say <strong>\"He doesn't know.\"</strong></li><li>\"I have 25 years\" - say <strong>\"I am 25 years old.\"</strong></li><li>\"We discussed about it\" - say <strong>\"We discussed it.\"</strong></li><li>\"more better\" - say <strong>\"better.\"</strong></li></ul><h3>How to fix a mistake while speaking</h3><p>If you notice an error, stay calm: \"Sorry, I mean...\" and continue. Self-correction is a sign of a strong speaker, not a weak one.</p>"
     }
    ],
    "quiz": {
     "lesson": "Fixing Common Spoken Mistakes",
     "title": "Week 3 Quiz: Grammar for Speaking",
     "questions": [
      {
       "type": "multiple_choice",
       "text": "Which sentence is correct?",
       "options": [
        {
         "id": "a",
         "text": "I am agree with you."
        },
        {
         "id": "b",
         "text": "I agree with you."
        },
        {
         "id": "c",
         "text": "I agreeing with you."
        },
        {
         "id": "d",
         "text": "I agrees with you."
        }
       ],
       "correct": "b"
      },
      {
       "type": "multiple_choice",
       "text": "Complete: Yesterday I ___ to the market.",
       "options": [
        {
         "id": "a",
         "text": "go"
        },
        {
         "id": "b",
         "text": "goes"
        },
        {
         "id": "c",
         "text": "went"
        },
        {
         "id": "d",
         "text": "going"
        }
       ],
       "correct": "c"
      },
      {
       "type": "multiple_choice",
       "text": "Complete: She ___ tea every morning.",
       "options": [
        {
         "id": "a",
         "text": "drink"
        },
        {
         "id": "b",
         "text": "drinks"
        },
        {
         "id": "c",
         "text": "drinking"
        },
        {
         "id": "d",
         "text": "drank"
        }
       ],
       "correct": "b"
      },
      {
       "type": "multiple_choice",
       "text": "Which sentence correctly gives your age?",
       "options": [
        {
         "id": "a",
         "text": "I have 25 years."
        },
        {
         "id": "b",
         "text": "I am 25 years old."
        },
        {
         "id": "c",
         "text": "I am having 25 years."
        },
        {
         "id": "d",
         "text": "I 25 years old."
        }
       ],
       "correct": "b"
      },
      {
       "type": "true_false",
       "text": "\"We discussed about the plan\" is correct English.",
       "options": [
        {
         "id": "true",
         "text": "True"
        },
        {
         "id": "false",
         "text": "False"
        }
       ],
       "correct": "false"
      }
     ]
    },
    "assignment": {
     "title": "Assignment 3: Past, Present and Future",
     "instructions": "Write three short paragraphs of 4 sentences each:\n1. Your daily routine (present simple).\n2. What you did yesterday (past simple).\n3. What you will do tomorrow (future).\n\nYou may submit it written (.pdf, .docx or .txt) or as a voice recording (.mp3 or .mp4)."
    }
   },
   {
    "position": 4,
    "lessons": [
     {
      "position": 2,
      "title": "Question Words and Question Forms",
      "notes": "<h3>Question words</h3><ul><li><strong>What</strong> - things: What is your name?</li><li><strong>Where</strong> - places: Where do you live?</li><li><strong>When</strong> - time: When does the class start?</li><li><strong>Who</strong> - people: Who is your teacher?</li><li><strong>Why</strong> - reasons: Why are you learning English?</li><li><strong>How</strong> - manner, amount: How many brothers do you have?</li></ul><h3>Word order</h3><p>Question word + do/does/is/are + subject + verb: <strong>Where do you live?</strong> (not \"Where you live?\").</p><p>Yes/no questions start with the helper verb: <strong>Do you like tea?</strong> / <strong>Is she at home?</strong></p>"
     },
     {
      "position": 3,
      "title": "Giving Clear, Complete Answers",
      "notes": "<h3>Short and full answers</h3><p>A one-word answer ends the conversation. A complete answer keeps it going.</p><ul><li>\"Do you like tea?\" - \"Yes.\" (short)</li><li>\"Do you like tea?\" - \"Yes, I do. I usually drink it in the evening.\" (complete)</li></ul><h3>When you do not understand</h3><ul><li>\"Sorry, I didn't catch that. Could you repeat it, please?\"</li><li>\"Could you speak a little slower, please?\"</li><li>\"Do you mean...?\"</li></ul><p><strong>Practice:</strong> ask a family member three questions and answer each with at least two sentences.</p>"
     }
    ],
    "quiz": {
     "lesson": "Giving Clear, Complete Answers",
     "title": "Week 4 Quiz: Asking and Answering Questions",
     "questions": [
      {
       "type": "multiple_choice",
       "text": "Which question is correct?",
       "options": [
        {
         "id": "a",
         "text": "Where you live?"
        },
        {
         "id": "b",
         "text": "Where do you live?"
        },
        {
         "id": "c",
         "text": "Where you do live?"
        },
        {
         "id": "d",
         "text": "Where does you live?"
        }
       ],
       "correct": "b"
      },
      {
       "type": "multiple_choice",
       "text": "You want someone to say something again. What is the polite way?",
       "options": [
        {
         "id": "a",
         "text": "Could you repeat that, please?"
        },
        {
         "id": "b",
         "text": "Say again now."
        },
        {
         "id": "c",
         "text": "What?"
        },
        {
         "id": "d",
         "text": "You are wrong."
        }
       ],
       "correct": "a"
      },
      {
       "type": "multiple_choice",
       "text": "Complete: ___ is your birthday? (asking for the date)",
       "options": [
        {
         "id": "a",
         "text": "Where"
        },
        {
         "id": "b",
         "text": "When"
        },
        {
         "id": "c",
         "text": "Who"
        },
        {
         "id": "d",
         "text": "Why"
        }
       ],
       "correct": "b"
      },
      {
       "type": "multiple_choice",
       "text": "Complete: How ___ brothers do you have?",
       "options": [
        {
         "id": "a",
         "text": "much"
        },
        {
         "id": "b",
         "text": "many"
        },
        {
         "id": "c",
         "text": "long"
        },
        {
         "id": "d",
         "text": "old"
        }
       ],
       "correct": "b"
      },
      {
       "type": "true_false",
       "text": "A good answer can add a small detail, for example: \"Yes, I do. I drink it every evening.\"",
       "options": [
        {
         "id": "true",
         "text": "True"
        },
        {
         "id": "false",
         "text": "False"
        }
       ],
       "correct": "true"
      }
     ]
    },
    "assignment": {
     "title": "Assignment 4: Questions for a New Classmate",
     "instructions": "Imagine you meet a new classmate. Write 8 questions you would ask them (use at least 5 different question words), and write your own answer to each question in 1-2 full sentences.\n\nSubmit as .pdf, .docx or .txt - or record yourself asking and answering (.mp3 or .mp4)."
    }
   },
   {
    "position": 5,
    "lessons": [
     {
      "position": 2,
      "title": "Sounds, Stress and Syllables",
      "notes": "<h3>Word stress</h3><p>Every English word has a strong syllable. Putting stress in the wrong place can make a word hard to understand.</p><ul><li><strong>PHO</strong>-to-graph, pho-<strong>TOG</strong>-ra-phy, pho-to-<strong>GRAPH</strong>-ic</li><li>ba-<strong>NA</strong>-na, <strong>TEA</strong>-cher, com-<strong>PU</strong>-ter</li><li>Noun and verb: a <strong>RE</strong>cord (noun) and to re-<strong>CORD</strong> (verb)</li></ul><h3>Silent letters</h3><p>Some letters are written but not pronounced: <strong>k</strong>nife, <strong>w</strong>rite, com<strong>b</strong>, Wed<strong>n</strong>esday (the d is silent: WENZ-day).</p><p>Tip: use an online dictionary with audio and repeat each new word after the speaker.</p>"
     },
     {
      "position": 3,
      "title": "Speaking Smoothly: Rhythm and Pausing",
      "notes": "<h3>Speak in chunks</h3><p>Fluent speakers do not say one word at a time. They say small groups of words together and pause between ideas.</p><p>Try: \"I usually wake up / at six o'clock / and then I have breakfast.\"</p><h3>Linking</h3><p>Sounds join together when we speak: \"an apple\" sounds like \"a-napple\".</p><h3>Shadowing</h3><ol><li>Choose a short audio clip (30 seconds).</li><li>Listen once without speaking.</li><li>Play it again and repeat immediately after the speaker, copying the rhythm and sounds.</li></ol><p>Speaking fast is not the same as speaking fluently. Clear and steady is better.</p>"
     }
    ],
    "quiz": {
     "lesson": "Speaking Smoothly: Rhythm and Pausing",
     "title": "Week 5 Quiz: Pronunciation and Fluency",
     "questions": [
      {
       "type": "multiple_choice",
       "text": "Which word has a silent \"k\"?",
       "options": [
        {
         "id": "a",
         "text": "kitchen"
        },
        {
         "id": "b",
         "text": "knife"
        },
        {
         "id": "c",
         "text": "kite"
        },
        {
         "id": "d",
         "text": "key"
        }
       ],
       "correct": "b"
      },
      {
       "type": "multiple_choice",
       "text": "Where is the main stress in \"banana\"?",
       "options": [
        {
         "id": "a",
         "text": "BA-na-na"
        },
        {
         "id": "b",
         "text": "ba-NA-na"
        },
        {
         "id": "c",
         "text": "ba-na-NA"
        },
        {
         "id": "d",
         "text": "There is no stress"
        }
       ],
       "correct": "b"
      },
      {
       "type": "multiple_choice",
       "text": "What is \"shadowing\"?",
       "options": [
        {
         "id": "a",
         "text": "Repeating immediately after a speaker, copying rhythm and sounds"
        },
        {
         "id": "b",
         "text": "Speaking in the dark"
        },
        {
         "id": "c",
         "text": "Writing words in a notebook"
        },
        {
         "id": "d",
         "text": "Reading silently"
        }
       ],
       "correct": "a"
      },
      {
       "type": "multiple_choice",
       "text": "Which letter is silent in \"Wednesday\"?",
       "options": [
        {
         "id": "a",
         "text": "W"
        },
        {
         "id": "b",
         "text": "d"
        },
        {
         "id": "c",
         "text": "s"
        },
        {
         "id": "d",
         "text": "y"
        }
       ],
       "correct": "b"
      },
      {
       "type": "true_false",
       "text": "Speaking faster always makes you sound more fluent.",
       "options": [
        {
         "id": "true",
         "text": "True"
        },
        {
         "id": "false",
         "text": "False"
        }
       ],
       "correct": "false"
      }
     ]
    },
    "assignment": {
     "title": "Assignment 5: Read Aloud Recording",
     "instructions": "Record yourself reading the paragraph below at a steady pace, pausing between ideas. Upload the recording (.mp3 or .mp4).\n\n\"Every morning I wake up early and make a cup of tea. After breakfast I walk to the market to buy fresh vegetables. Then I come home, clean the kitchen and prepare lunch for my family. In the evening I like to read a good book.\"\n\nFocus on: clear word stress, pauses between ideas, and a calm, steady speed."
    }
   },
   {
    "position": 6,
    "lessons": [
     {
      "position": 2,
      "title": "At the Shop, Restaurant and Clinic",
      "notes": "<h3>Useful phrases</h3><ul><li><strong>Shop:</strong> \"How much is this?\" / \"Do you have this in a larger size?\" / \"Can I pay by card?\"</li><li><strong>Restaurant:</strong> \"I'd like the chicken rice, please.\" / \"Could we have the bill, please?\"</li><li><strong>Clinic:</strong> \"I have a headache.\" / \"I'd like to make an appointment.\" / \"How often should I take this medicine?\"</li></ul><h3>Be polite</h3><p>\"I'd like...\" and \"Could I have...\" sound more polite than \"Give me...\". Always add \"please\" and \"thank you\".</p>"
     },
     {
      "position": 3,
      "title": "Phone Calls and Making Plans",
      "notes": "<h3>Phone phrases</h3><ul><li>\"Hello, this is Saima speaking.\"</li><li>\"Could I speak to Mr. Ahmed, please?\"</li><li>\"Could you hold on for a moment, please?\"</li><li>\"Could I take a message?\"</li></ul><h3>Making plans</h3><ul><li>\"Shall we meet at five?\"</li><li>\"That works for me.\" / \"Sorry, I'm busy then. How about six?\"</li><li>\"See you there!\"</li></ul><p><strong>Practice:</strong> role-play one phone call and one plan-making conversation with a friend or in front of a mirror.</p>"
     }
    ],
    "quiz": {
     "lesson": "Phone Calls and Making Plans",
     "title": "Week 6 Quiz: Real-Life Conversations",
     "questions": [
      {
       "type": "multiple_choice",
       "text": "What is a polite way to order food?",
       "options": [
        {
         "id": "a",
         "text": "Give me rice."
        },
        {
         "id": "b",
         "text": "I'd like the rice, please."
        },
        {
         "id": "c",
         "text": "Rice now."
        },
        {
         "id": "d",
         "text": "You bring rice."
        }
       ],
       "correct": "b"
      },
      {
       "type": "multiple_choice",
       "text": "Complete the phone phrase: \"Hello, this is Ahmed ___.\"",
       "options": [
        {
         "id": "a",
         "text": "speaking"
        },
        {
         "id": "b",
         "text": "talk"
        },
        {
         "id": "c",
         "text": "say"
        },
        {
         "id": "d",
         "text": "calling to"
        }
       ],
       "correct": "a"
      },
      {
       "type": "multiple_choice",
       "text": "Which sentence suggests a plan politely?",
       "options": [
        {
         "id": "a",
         "text": "Shall we meet at five?"
        },
        {
         "id": "b",
         "text": "You meet at five."
        },
        {
         "id": "c",
         "text": "Meet five."
        },
        {
         "id": "d",
         "text": "We are meet at five."
        }
       ],
       "correct": "a"
      },
      {
       "type": "multiple_choice",
       "text": "What do you say to ask a price?",
       "options": [
        {
         "id": "a",
         "text": "How much is this?"
        },
        {
         "id": "b",
         "text": "What price you?"
        },
        {
         "id": "c",
         "text": "Price?"
        },
        {
         "id": "d",
         "text": "How many is this?"
        }
       ],
       "correct": "a"
      },
      {
       "type": "true_false",
       "text": "\"Could you hold on for a moment, please?\" is a polite phrase to use on the phone.",
       "options": [
        {
         "id": "true",
         "text": "True"
        },
        {
         "id": "false",
         "text": "False"
        }
       ],
       "correct": "true"
      }
     ]
    },
    "assignment": {
     "title": "Assignment 6: Role-Play Dialogue",
     "instructions": "Write a dialogue of at least 10 lines between you and another person in ONE of these situations: buying something in a shop, ordering food in a restaurant, or booking a doctor's appointment by phone.\n\nUse polite phrases from the lessons. Submit the script (.pdf, .docx or .txt), or record both voices yourself (.mp3 or .mp4)."
    }
   },
   {
    "position": 7,
    "lessons": [
     {
      "position": 2,
      "title": "Handling Nerves and Mistakes",
      "notes": "<h3>Why we feel nervous</h3><p>Almost everyone feels nervous when speaking a second language. It does not mean your English is weak.</p><h3>Calm yourself</h3><ul><li>Take two slow, deep breaths before you begin.</li><li>Prepare three key points, not a full script.</li><li>Speak a little slower than you think you need to.</li></ul><h3>When you make a mistake</h3><p>Do not stop or apologise for a long time. Say \"Sorry, I mean...\" and continue. Listeners usually care about your message, not small errors.</p>"
     },
     {
      "position": 3,
      "title": "Speaking for One Minute: The PREP Structure",
      "notes": "<h3>PREP: a simple structure</h3><ol><li><strong>P - Point:</strong> state your main idea.</li><li><strong>R - Reason:</strong> explain why.</li><li><strong>E - Example:</strong> give a real example.</li><li><strong>P - Point:</strong> repeat your main idea to finish.</li></ol><h3>Example: \"Why exercise is important\"</h3><p>\"I believe exercise is important for everyone. It keeps our body strong and our mind calm. For example, when I walk for thirty minutes every evening, I sleep better and feel less stressed. That is why I think everyone should exercise daily.\"</p><p><strong>Practice:</strong> choose any topic and speak for one minute using PREP.</p>"
     }
    ],
    "quiz": {
     "lesson": "Speaking for One Minute: The PREP Structure",
     "title": "Week 7 Quiz: Confidence and Speaking Practice",
     "questions": [
      {
       "type": "multiple_choice",
       "text": "What does PREP stand for in this lesson?",
       "options": [
        {
         "id": "a",
         "text": "Point, Reason, Example, Point"
        },
        {
         "id": "b",
         "text": "Plan, Read, Edit, Print"
        },
        {
         "id": "c",
         "text": "Pause, Repeat, End, Practice"
        },
        {
         "id": "d",
         "text": "Point, Rest, Explain, Present"
        }
       ],
       "correct": "a"
      },
      {
       "type": "multiple_choice",
       "text": "What is the best way to handle a mistake while speaking?",
       "options": [
        {
         "id": "a",
         "text": "Stop and stay silent"
        },
        {
         "id": "b",
         "text": "Calmly correct it and continue"
        },
        {
         "id": "c",
         "text": "Apologise for five minutes"
        },
        {
         "id": "d",
         "text": "Leave the conversation"
        }
       ],
       "correct": "b"
      },
      {
       "type": "multiple_choice",
       "text": "Which helps reduce nervousness before speaking?",
       "options": [
        {
         "id": "a",
         "text": "Slow, deep breaths"
        },
        {
         "id": "b",
         "text": "Skipping all preparation"
        },
        {
         "id": "c",
         "text": "Speaking as fast as possible"
        },
        {
         "id": "d",
         "text": "Avoiding all eye contact"
        }
       ],
       "correct": "a"
      },
      {
       "type": "multiple_choice",
       "text": "In PREP, what is the final \"Point\"?",
       "options": [
        {
         "id": "a",
         "text": "A completely new topic"
        },
        {
         "id": "b",
         "text": "Repeating your main idea to finish clearly"
        },
        {
         "id": "c",
         "text": "A question for the audience"
        },
        {
         "id": "d",
         "text": "An apology"
        }
       ],
       "correct": "b"
      },
      {
       "type": "true_false",
       "text": "Even very fluent speakers make small mistakes when they speak.",
       "options": [
        {
         "id": "true",
         "text": "True"
        },
        {
         "id": "false",
         "text": "False"
        }
       ],
       "correct": "true"
      }
     ]
    },
    "assignment": {
     "title": "Assignment 7: A One-Minute Talk",
     "instructions": "Give a one-minute talk on the topic \"A habit that helped me\" using the PREP structure (Point, Reason, Example, Point).\n\nRecord it (.mp3 or .mp4) or submit the written talk (.pdf, .docx or .txt). Try to speak without reading word for word."
    }
   },
   {
    "position": 8,
    "lessons": [
     {
      "position": 2,
      "title": "How the Final Assessment Works",
      "notes": "<h3>Format (about 3 minutes)</h3><ol><li><strong>Introduce yourself</strong> - about 30 seconds.</li><li><strong>Talk on a topic</strong> - about 1 minute, using the PREP structure.</li><li><strong>Answer follow-up questions</strong> - 3 short questions.</li></ol><h3>What is assessed</h3><ul><li><strong>Clarity:</strong> can the listener understand you?</li><li><strong>Vocabulary:</strong> useful, natural words and phrases.</li><li><strong>Grammar:</strong> correct tenses and sentence forms.</li><li><strong>Fluency:</strong> steady speaking with natural pauses.</li><li><strong>Confidence:</strong> calm voice and eye contact.</li></ul>"
     },
     {
      "position": 3,
      "title": "Final Preparation Checklist",
      "notes": "<h3>Before you record</h3><ul><li>Practise your introduction until it feels natural.</li><li>Prepare two or three topics using PREP (for example: a habit, a place, a person you admire).</li><li>Practise answering simple questions with full sentences.</li><li>Check your recording: quiet room, phone close, no background noise.</li></ul><h3>During the recording</h3><ul><li>Breathe, smile and speak slowly.</li><li>If you make a mistake, say \"Sorry, I mean...\" and continue.</li></ul><p>You have practised all of this over seven weeks. Trust your preparation.</p>"
     }
    ],
    "quiz": {
     "lesson": "Final Preparation Checklist",
     "title": "Week 8 Quiz: Course Review",
     "questions": [
      {
       "type": "multiple_choice",
       "text": "Which is a polite way to start a conversation with someone new?",
       "options": [
        {
         "id": "a",
         "text": "Hello, nice to meet you."
        },
        {
         "id": "b",
         "text": "Who are you?"
        },
        {
         "id": "c",
         "text": "Go away."
        },
        {
         "id": "d",
         "text": "What do you want?"
        }
       ],
       "correct": "a"
      },
      {
       "type": "multiple_choice",
       "text": "Complete: She ___ to school every day.",
       "options": [
        {
         "id": "a",
         "text": "go"
        },
        {
         "id": "b",
         "text": "goes"
        },
        {
         "id": "c",
         "text": "going"
        },
        {
         "id": "d",
         "text": "gone"
        }
       ],
       "correct": "b"
      },
      {
       "type": "multiple_choice",
       "text": "Which question is correct?",
       "options": [
        {
         "id": "a",
         "text": "What time does the class start?"
        },
        {
         "id": "b",
         "text": "What time the class starts?"
        },
        {
         "id": "c",
         "text": "What time class does start?"
        },
        {
         "id": "d",
         "text": "What time start the class?"
        }
       ],
       "correct": "a"
      },
      {
       "type": "multiple_choice",
       "text": "What is a good way to improve pronunciation?",
       "options": [
        {
         "id": "a",
         "text": "Listen and repeat (shadowing)"
        },
        {
         "id": "b",
         "text": "Never speak aloud"
        },
        {
         "id": "c",
         "text": "Only read silently"
        },
        {
         "id": "d",
         "text": "Memorise spellings only"
        }
       ],
       "correct": "a"
      },
      {
       "type": "true_false",
       "text": "Speaking slowly and clearly is better than speaking fast and unclearly.",
       "options": [
        {
         "id": "true",
         "text": "True"
        },
        {
         "id": "false",
         "text": "False"
        }
       ],
       "correct": "true"
      }
     ]
    },
    "assignment": {
     "title": "Final Assignment: Speaking Assessment",
     "instructions": "Record your final speaking assessment (about 3 minutes) in this order:\n1. Introduce yourself (about 30 seconds).\n2. Give a one-minute talk on a topic of your choice using PREP.\n3. Answer these three questions in full sentences: \"What is your biggest goal this year?\", \"Why are you learning English?\", \"What will you do to keep practising after this course?\"\n\nUpload your recording as .mp3 or .mp4."
    }
   }
  ]
 },
 {
  "slug": "english-grammar-foundations",
  "modules": [
   {
    "position": 1,
    "lessons": [
     {
      "position": 2,
      "title": "The Eight Parts of Speech",
      "notes": "<h3>The building blocks of English</h3><ul><li><strong>Noun</strong> - a person, place or thing: teacher, Lahore, book</li><li><strong>Pronoun</strong> - replaces a noun: he, she, they, it</li><li><strong>Verb</strong> - an action or state: run, is, learn</li><li><strong>Adjective</strong> - describes a noun: tall, interesting, red</li><li><strong>Adverb</strong> - describes a verb, adjective or another adverb: quickly, very, well</li><li><strong>Preposition</strong> - shows relationship (place, time): in, on, at, under</li><li><strong>Conjunction</strong> - joins words or sentences: and, but, because</li><li><strong>Interjection</strong> - a sudden feeling: Wow! Oh! Ouch!</li></ul>"
     },
     {
      "position": 3,
      "title": "Spotting Parts of Speech in a Sentence",
      "notes": "<h3>Worked example</h3><p>\"She quickly bought a beautiful dress and left.\"</p><ul><li>She - pronoun</li><li>quickly - adverb</li><li>bought - verb</li><li>a - article (a type of adjective)</li><li>beautiful - adjective</li><li>dress - noun</li><li>and - conjunction</li><li>left - verb</li></ul><h3>How to check</h3><p>The same word can be different parts of speech: \"a <strong>run</strong>\" (noun) and \"to <strong>run</strong>\" (verb). Always look at how the word is used in the sentence.</p>"
     }
    ],
    "quiz": {
     "lesson": "Spotting Parts of Speech in a Sentence",
     "title": "Week 1 Quiz: Parts of Speech",
     "questions": [
      {
       "type": "multiple_choice",
       "text": "In \"The girl sings beautifully\", what part of speech is \"beautifully\"?",
       "options": [
        {
         "id": "a",
         "text": "noun"
        },
        {
         "id": "b",
         "text": "adjective"
        },
        {
         "id": "c",
         "text": "adverb"
        },
        {
         "id": "d",
         "text": "verb"
        }
       ],
       "correct": "c"
      },
      {
       "type": "multiple_choice",
       "text": "Which word is a pronoun?",
       "options": [
        {
         "id": "a",
         "text": "table"
        },
        {
         "id": "b",
         "text": "they"
        },
        {
         "id": "c",
         "text": "run"
        },
        {
         "id": "d",
         "text": "happy"
        }
       ],
       "correct": "b"
      },
      {
       "type": "multiple_choice",
       "text": "\"Wow!\" is a(n) ...",
       "options": [
        {
         "id": "a",
         "text": "interjection"
        },
        {
         "id": "b",
         "text": "conjunction"
        },
        {
         "id": "c",
         "text": "preposition"
        },
        {
         "id": "d",
         "text": "noun"
        }
       ],
       "correct": "a"
      },
      {
       "type": "multiple_choice",
       "text": "In \"He sat on the chair\", \"on\" is a ...",
       "options": [
        {
         "id": "a",
         "text": "verb"
        },
        {
         "id": "b",
         "text": "preposition"
        },
        {
         "id": "c",
         "text": "adjective"
        },
        {
         "id": "d",
         "text": "pronoun"
        }
       ],
       "correct": "b"
      },
      {
       "type": "true_false",
       "text": "An adjective describes a noun.",
       "options": [
        {
         "id": "true",
         "text": "True"
        },
        {
         "id": "false",
         "text": "False"
        }
       ],
       "correct": "true"
      }
     ]
    },
    "assignment": {
     "title": "Assignment 1: Label the Parts of Speech",
     "instructions": "Write 10 sentences of your own. In each sentence, underline and label ONE part of speech, so that across the ten sentences you cover all eight parts of speech (noun, pronoun, verb, adjective, adverb, preposition, conjunction, interjection).\n\nSubmit as .pdf, .docx or .txt."
    }
   },
   {
    "position": 2,
    "lessons": [
     {
      "position": 2,
      "title": "Present, Past and Future Simple",
      "notes": "<h3>Forms and uses</h3><ul><li><strong>Present simple</strong> - habits and facts: I walk. / She walks. (add -s for he, she, it)</li><li><strong>Past simple</strong> - finished actions: I walked. / I went.</li><li><strong>Future simple</strong> - will + verb: I will walk.</li></ul><h3>Regular and irregular verbs</h3><p>Regular verbs add -ed in the past: walk - walked. Irregular verbs change: go - went - gone, eat - ate - eaten, see - saw - seen, write - wrote - written.</p><h3>Negatives and questions</h3><p>Use do/does/did + base verb: She <strong>doesn't</strong> like tea. <strong>Did</strong> you go yesterday?</p>"
     },
     {
      "position": 3,
      "title": "Continuous and Perfect Tenses (Introduction)",
      "notes": "<h3>Present continuous</h3><p>Is/am/are + verb-ing for actions happening now: \"She is writing a letter.\"</p><h3>Present perfect</h3><p>Have/has + past participle. It connects the past to now:</p><ul><li>\"I have lived in Lahore for five years.\" (I still live there.)</li><li>\"I lived in Lahore in 2015.\" (finished - past simple)</li></ul><p>Signal words: <strong>since</strong> (a starting point: since 2020) and <strong>for</strong> (a period: for five years).</p>"
     }
    ],
    "quiz": {
     "lesson": "Continuous and Perfect Tenses (Introduction)",
     "title": "Week 2 Quiz: Tenses",
     "questions": [
      {
       "type": "multiple_choice",
       "text": "What is the past simple of \"go\"?",
       "options": [
        {
         "id": "a",
         "text": "goed"
        },
        {
         "id": "b",
         "text": "went"
        },
        {
         "id": "c",
         "text": "gone"
        },
        {
         "id": "d",
         "text": "goes"
        }
       ],
       "correct": "b"
      },
      {
       "type": "multiple_choice",
       "text": "Complete: She ___ a letter right now.",
       "options": [
        {
         "id": "a",
         "text": "writes"
        },
        {
         "id": "b",
         "text": "is writing"
        },
        {
         "id": "c",
         "text": "wrote"
        },
        {
         "id": "d",
         "text": "has wrote"
        }
       ],
       "correct": "b"
      },
      {
       "type": "multiple_choice",
       "text": "Complete: I ___ here since 2020.",
       "options": [
        {
         "id": "a",
         "text": "live"
        },
        {
         "id": "b",
         "text": "lived"
        },
        {
         "id": "c",
         "text": "have lived"
        },
        {
         "id": "d",
         "text": "will live"
        }
       ],
       "correct": "c"
      },
      {
       "type": "multiple_choice",
       "text": "Which sentence is in the future simple?",
       "options": [
        {
         "id": "a",
         "text": "I will call you tomorrow."
        },
        {
         "id": "b",
         "text": "I called you."
        },
        {
         "id": "c",
         "text": "I am calling you."
        },
        {
         "id": "d",
         "text": "I have called you."
        }
       ],
       "correct": "a"
      },
      {
       "type": "true_false",
       "text": "\"He have a car\" is a correct sentence.",
       "options": [
        {
         "id": "true",
         "text": "True"
        },
        {
         "id": "false",
         "text": "False"
        }
       ],
       "correct": "false"
      }
     ]
    },
    "assignment": {
     "title": "Assignment 2: My Week in Three Tenses",
     "instructions": "Write a paragraph of 8 to 10 sentences about your week: what you did last week (past simple), what you are doing now (present simple or continuous), and what you will do next week (future).\n\nUnderline each verb and write the tense name in brackets after it. Submit as .pdf, .docx or .txt."
    }
   },
   {
    "position": 3,
    "lessons": [
     {
      "position": 2,
      "title": "Subject, Verb and Object",
      "notes": "<h3>The basic sentence pattern</h3><p>Most English sentences follow <strong>Subject + Verb + Object</strong>:</p><ul><li>Sara (subject) reads (verb) books (object).</li></ul><h3>Complete sentences</h3><p>A normal statement needs a subject and a verb. These are <strong>fragments</strong>, not sentences:</p><ul><li>\"Running in the park.\" (no subject)</li><li>\"Because he was late.\" (an incomplete idea)</li></ul><p>Correct versions: \"The boy is running in the park.\" / \"He missed the bus because he was late.\"</p>"
     },
     {
      "position": 3,
      "title": "Simple, Compound and Complex Sentences",
      "notes": "<h3>Three types</h3><ul><li><strong>Simple:</strong> one idea. \"I like tea.\"</li><li><strong>Compound:</strong> two equal ideas joined by and, but, or, so. \"I like tea, but she likes coffee.\"</li><li><strong>Complex:</strong> a main idea plus a dependent idea, joined by because, although, when, if. \"Although it was raining, we played outside.\"</li></ul><h3>Avoid run-on sentences</h3><p>Do not join two sentences with only a comma. Use a full stop, or add a joining word: \"I was tired, so I went to bed.\"</p>"
     }
    ],
    "quiz": {
     "lesson": "Simple, Compound and Complex Sentences",
     "title": "Week 3 Quiz: Sentence Structure",
     "questions": [
      {
       "type": "multiple_choice",
       "text": "Which is a complete sentence?",
       "options": [
        {
         "id": "a",
         "text": "Running in the park."
        },
        {
         "id": "b",
         "text": "The boy runs in the park."
        },
        {
         "id": "c",
         "text": "In the park."
        },
        {
         "id": "d",
         "text": "Because he runs."
        }
       ],
       "correct": "b"
      },
      {
       "type": "multiple_choice",
       "text": "Which word is a coordinating conjunction?",
       "options": [
        {
         "id": "a",
         "text": "although"
        },
        {
         "id": "b",
         "text": "but"
        },
        {
         "id": "c",
         "text": "because"
        },
        {
         "id": "d",
         "text": "when"
        }
       ],
       "correct": "b"
      },
      {
       "type": "multiple_choice",
       "text": "In \"Sara reads books\", what is the subject?",
       "options": [
        {
         "id": "a",
         "text": "reads"
        },
        {
         "id": "b",
         "text": "books"
        },
        {
         "id": "c",
         "text": "Sara"
        },
        {
         "id": "d",
         "text": "There is no subject"
        }
       ],
       "correct": "c"
      },
      {
       "type": "multiple_choice",
       "text": "\"Although it was raining, we played outside.\" is a ...",
       "options": [
        {
         "id": "a",
         "text": "simple sentence"
        },
        {
         "id": "b",
         "text": "complex sentence"
        },
        {
         "id": "c",
         "text": "fragment"
        },
        {
         "id": "d",
         "text": "question"
        }
       ],
       "correct": "b"
      },
      {
       "type": "true_false",
       "text": "A normal statement sentence needs at least a subject and a verb.",
       "options": [
        {
         "id": "true",
         "text": "True"
        },
        {
         "id": "false",
         "text": "False"
        }
       ],
       "correct": "true"
      }
     ]
    },
    "assignment": {
     "title": "Assignment 3: Three Kinds of Sentences",
     "instructions": "Write 9 sentences about your city or town: 3 simple sentences, 3 compound sentences and 3 complex sentences. Write the type in brackets after each sentence.\n\nSubmit as .pdf, .docx or .txt."
    }
   },
   {
    "position": 4,
    "lessons": [
     {
      "position": 2,
      "title": "Ten Mistakes Learners Often Make",
      "notes": "<h3>Common mistakes and corrections</h3><ol><li>\"He don't like tea\" - <strong>He doesn't like tea.</strong></li><li>\"I am agree\" - <strong>I agree.</strong></li><li>\"We discussed about it\" - <strong>We discussed it.</strong></li><li>\"more better\" - <strong>better.</strong></li><li>\"I have 20 years\" - <strong>I am 20 years old.</strong></li><li>\"less people\" - <strong>fewer people</strong> (countable nouns).</li><li>\"good in English\" - <strong>good at English.</strong></li><li>\"an university\" - <strong>a university</strong> (it begins with a \"you\" sound).</li><li>\"many informations\" - <strong>much information</strong> (uncountable).</li><li>\"married with\" - <strong>married to.</strong></li></ol>"
     },
     {
      "position": 3,
      "title": "Articles and Prepositions Quick Guide",
      "notes": "<h3>Articles</h3><ul><li><strong>a</strong> before a consonant sound: a book, a university</li><li><strong>an</strong> before a vowel sound: an apple, an hour</li><li><strong>the</strong> for something specific or already mentioned: \"I saw a dog. The dog was big.\"</li></ul><h3>Prepositions of time and place</h3><ul><li><strong>at</strong> - a point: at 9 o'clock, at the door</li><li><strong>on</strong> - days and surfaces: on Monday, on the table</li><li><strong>in</strong> - months, years, enclosed spaces: in May, in 2024, in the room</li></ul><p>Dependent prepositions are learned with the word: interested <strong>in</strong>, good <strong>at</strong>, afraid <strong>of</strong>.</p>"
     }
    ],
    "quiz": {
     "lesson": "Articles and Prepositions Quick Guide",
     "title": "Week 4 Quiz: Common Mistakes",
     "questions": [
      {
       "type": "multiple_choice",
       "text": "Which sentence is correct?",
       "options": [
        {
         "id": "a",
         "text": "I discussed about the plan."
        },
        {
         "id": "b",
         "text": "I discussed the plan."
        },
        {
         "id": "c",
         "text": "I discussed on the plan."
        },
        {
         "id": "d",
         "text": "I discussed of the plan."
        }
       ],
       "correct": "b"
      },
      {
       "type": "multiple_choice",
       "text": "Complete: She is good ___ maths.",
       "options": [
        {
         "id": "a",
         "text": "in"
        },
        {
         "id": "b",
         "text": "at"
        },
        {
         "id": "c",
         "text": "on"
        },
        {
         "id": "d",
         "text": "for"
        }
       ],
       "correct": "b"
      },
      {
       "type": "multiple_choice",
       "text": "Which sentence is correct?",
       "options": [
        {
         "id": "a",
         "text": "I need many informations."
        },
        {
         "id": "b",
         "text": "I need much information."
        },
        {
         "id": "c",
         "text": "I need many information."
        },
        {
         "id": "d",
         "text": "I need an information."
        }
       ],
       "correct": "b"
      },
      {
       "type": "multiple_choice",
       "text": "Complete: The class starts ___ 9 o'clock.",
       "options": [
        {
         "id": "a",
         "text": "in"
        },
        {
         "id": "b",
         "text": "on"
        },
        {
         "id": "c",
         "text": "at"
        },
        {
         "id": "d",
         "text": "by"
        }
       ],
       "correct": "c"
      },
      {
       "type": "true_false",
       "text": "\"Fewer\" is used with countable nouns, for example \"fewer books\".",
       "options": [
        {
         "id": "true",
         "text": "True"
        },
        {
         "id": "false",
         "text": "False"
        }
       ],
       "correct": "true"
      }
     ]
    },
    "assignment": {
     "title": "Assignment 4: Correct the Mistakes",
     "instructions": "Rewrite each sentence correctly:\n1. He don't like tea.\n2. I am agree with you.\n3. We discussed about the project.\n4. This book is more better than that one.\n5. I have 20 years.\n6. There are less people today.\n7. She is good in English.\n8. I study in an university.\n9. He gave me many informations.\n10. She is married with a doctor.\n\nSubmit your corrected sentences as .pdf, .docx or .txt."
    }
   },
   {
    "position": 5,
    "lessons": [
     {
      "position": 2,
      "title": "Punctuation That Makes Sense",
      "notes": "<h3>The essentials</h3><ul><li><strong>Capital letters:</strong> start of a sentence, names (Ayesha, Pakistan), the word \"I\".</li><li><strong>Full stop (.)</strong> ends a statement. <strong>Question mark (?)</strong> ends a question.</li><li><strong>Comma (,)</strong> separates items in a list (apples, oranges and bananas), and comes after an opening phrase (\"After lunch, we left.\").</li><li><strong>Apostrophe (')</strong> shows a contraction (it's = it is) or possession (Sara's book).</li></ul><h3>It's or its?</h3><p><strong>It's</strong> = it is / it has: \"It's raining.\"<br/><strong>Its</strong> = belonging to it: \"The dog wagged its tail.\"</p>"
     },
     {
      "position": 3,
      "title": "From Sentences to Paragraphs",
      "notes": "<h3>A simple paragraph structure</h3><ol><li><strong>Topic sentence</strong> - the main idea.</li><li><strong>Supporting sentences</strong> - details, reasons, examples (3 to 5).</li><li><strong>Concluding sentence</strong> - finishes the idea.</li></ol><h3>Example</h3><p>\"Walking is a simple way to stay healthy. It costs nothing and needs no special equipment. A short walk after dinner helps digestion and improves sleep. Many people also find that walking reduces stress. For these reasons, I try to walk every day.\"</p><p>Use linking words such as <strong>first, also, however, for example</strong> and <strong>for these reasons</strong> to connect your sentences.</p>"
     }
    ],
    "quiz": {
     "lesson": "From Sentences to Paragraphs",
     "title": "Week 5 Quiz: Punctuation and Writing",
     "questions": [
      {
       "type": "multiple_choice",
       "text": "Which sentence is correct?",
       "options": [
        {
         "id": "a",
         "text": "Its raining today."
        },
        {
         "id": "b",
         "text": "It's raining today."
        },
        {
         "id": "c",
         "text": "Its' raining today."
        },
        {
         "id": "d",
         "text": "It is' raining today."
        }
       ],
       "correct": "b"
      },
      {
       "type": "multiple_choice",
       "text": "Which sentence is punctuated correctly?",
       "options": [
        {
         "id": "a",
         "text": "We bought apples, oranges and bananas."
        },
        {
         "id": "b",
         "text": "We bought apples oranges, and bananas."
        },
        {
         "id": "c",
         "text": "We bought, apples oranges and bananas."
        },
        {
         "id": "d",
         "text": "We bought apples oranges and, bananas."
        }
       ],
       "correct": "a"
      },
      {
       "type": "multiple_choice",
       "text": "What does a topic sentence do?",
       "options": [
        {
         "id": "a",
         "text": "States the main idea of the paragraph"
        },
        {
         "id": "b",
         "text": "Ends the whole essay"
        },
        {
         "id": "c",
         "text": "Lists the references"
        },
        {
         "id": "d",
         "text": "Is always a question"
        }
       ],
       "correct": "a"
      },
      {
       "type": "multiple_choice",
       "text": "Complete: The dog wagged ___ tail.",
       "options": [
        {
         "id": "a",
         "text": "it's"
        },
        {
         "id": "b",
         "text": "its"
        },
        {
         "id": "c",
         "text": "its'"
        },
        {
         "id": "d",
         "text": "it"
        }
       ],
       "correct": "b"
      },
      {
       "type": "true_false",
       "text": "A sentence should begin with a capital letter.",
       "options": [
        {
         "id": "true",
         "text": "True"
        },
        {
         "id": "false",
         "text": "False"
        }
       ],
       "correct": "true"
      }
     ]
    },
    "assignment": {
     "title": "Assignment 5: Write a Paragraph",
     "instructions": "Write one paragraph of 6 to 8 sentences on \"My favourite place\". It must have a topic sentence, at least four supporting sentences and a concluding sentence.\n\nCheck your capital letters, full stops, commas and apostrophes carefully before you submit. Upload as .pdf, .docx or .txt."
    }
   },
   {
    "position": 6,
    "lessons": [
     {
      "position": 2,
      "title": "Review: The Big Ideas",
      "notes": "<h3>What you have learned</h3><ul><li><strong>Week 1 - Parts of speech:</strong> noun, pronoun, verb, adjective, adverb, preposition, conjunction, interjection.</li><li><strong>Week 2 - Tenses:</strong> present, past and future simple; the basics of continuous and perfect.</li><li><strong>Week 3 - Sentence structure:</strong> subject + verb + object; simple, compound and complex sentences; avoiding fragments.</li><li><strong>Week 4 - Common mistakes:</strong> doesn't, agree, discuss, fewer, much information; articles and prepositions.</li><li><strong>Week 5 - Punctuation and writing:</strong> capitals, commas, apostrophes, it's/its, and paragraph structure.</li></ul><p>Before the final quiz, re-read the notes of any week you found difficult.</p>"
     },
     {
      "position": 3,
      "title": "Final Practice Set (Self-Check)",
      "notes": "<h3>Try these, then check the answers</h3><ol><li>They ___ football every Sunday. (play / plays)</li><li>Find the noun: \"The teacher smiled.\"</li><li>Correct it: \"She don't know the answer.\"</li><li>He is interested ___ music. (in / at / on)</li><li>Choose: it's or its? \"The cat licked ___ paw.\"</li></ol><h3>Answers</h3><ol><li>play</li><li>teacher</li><li>She doesn't know the answer.</li><li>in</li><li>its</li></ol><p>If you got 4 or 5 correct, you are ready for the final quiz and assignment.</p>"
     }
    ],
    "quiz": {
     "lesson": "Final Practice Set (Self-Check)",
     "title": "Week 6 Final Quiz: Grammar Review",
     "questions": [
      {
       "type": "multiple_choice",
       "text": "Complete: They ___ football every Sunday.",
       "options": [
        {
         "id": "a",
         "text": "plays"
        },
        {
         "id": "b",
         "text": "play"
        },
        {
         "id": "c",
         "text": "playing"
        },
        {
         "id": "d",
         "text": "played"
        }
       ],
       "correct": "b"
      },
      {
       "type": "multiple_choice",
       "text": "What is the noun in \"The teacher smiled\"?",
       "options": [
        {
         "id": "a",
         "text": "smiled"
        },
        {
         "id": "b",
         "text": "The"
        },
        {
         "id": "c",
         "text": "teacher"
        },
        {
         "id": "d",
         "text": "There is no noun"
        }
       ],
       "correct": "c"
      },
      {
       "type": "multiple_choice",
       "text": "Which sentence is correct?",
       "options": [
        {
         "id": "a",
         "text": "She don't know."
        },
        {
         "id": "b",
         "text": "She doesn't know."
        },
        {
         "id": "c",
         "text": "She not know."
        },
        {
         "id": "d",
         "text": "She doesn't knows."
        }
       ],
       "correct": "b"
      },
      {
       "type": "multiple_choice",
       "text": "Complete: He is interested ___ music.",
       "options": [
        {
         "id": "a",
         "text": "on"
        },
        {
         "id": "b",
         "text": "at"
        },
        {
         "id": "c",
         "text": "in"
        },
        {
         "id": "d",
         "text": "with"
        }
       ],
       "correct": "c"
      },
      {
       "type": "true_false",
       "text": "\"It's\" (with an apostrophe) means \"it is\" or \"it has\".",
       "options": [
        {
         "id": "true",
         "text": "True"
        },
        {
         "id": "false",
         "text": "False"
        }
       ],
       "correct": "true"
      }
     ]
    },
    "assignment": {
     "title": "Final Assignment: A Short Essay",
     "instructions": "Write an essay of about 150 words on \"How I will use English in my life\".\n\nUse at least three different tenses, one compound sentence, one complex sentence and correct punctuation. Underline one example of each of those as you write.\n\nSubmit as .pdf or .docx."
    }
   }
  ]
 }
]$json$::jsonb;
  course_j jsonb;
  module_j jsonb;
  lesson_j jsonb;
  qs jsonb;
  v_course uuid;
  v_module uuid;
  v_lesson uuid;
  v_quiz uuid;
  i int;
begin
  for course_j in select value from jsonb_array_elements(content) loop
    select id into v_course from courses where slug = course_j->>'slug';
    continue when v_course is null;

    for module_j in select value from jsonb_array_elements(course_j->'modules') loop
      select id into v_module from modules
        where course_id = v_course and position = (module_j->>'position')::int;
      continue when v_module is null;

      -- lessons
      for lesson_j in select value from jsonb_array_elements(module_j->'lessons') loop
        if not exists (select 1 from lessons where module_id = v_module and title = lesson_j->>'title') then
          insert into lessons (module_id, title, notes_html, position)
          values (v_module, lesson_j->>'title', lesson_j->>'notes', (lesson_j->>'position')::int);
        end if;
      end loop;

      -- quiz (attached to the module's last new lesson)
      select id into v_lesson from lessons
        where module_id = v_module and title = module_j->'quiz'->>'lesson';
      if v_lesson is not null and not exists (select 1 from quizzes where lesson_id = v_lesson) then
        insert into quizzes (lesson_id, title, passing_percentage, allow_retake)
        values (v_lesson, module_j->'quiz'->>'title', 60, true)
        returning id into v_quiz;

        qs := module_j->'quiz'->'questions';
        for i in 0 .. jsonb_array_length(qs) - 1 loop
          insert into quiz_questions (quiz_id, question_type, question_text, options, correct_option_id, position)
          values (
            v_quiz,
            (qs->i->>'type')::question_type,
            qs->i->>'text',
            qs->i->'options',
            qs->i->>'correct',
            i + 1
          );
        end loop;
      end if;

      -- assignment
      if not exists (select 1 from assignments where module_id = v_module and title = module_j->'assignment'->>'title') then
        insert into assignments (module_id, title, instructions)
        values (v_module, module_j->'assignment'->>'title', module_j->'assignment'->>'instructions');
      end if;
    end loop;
  end loop;
end
$outer$;
