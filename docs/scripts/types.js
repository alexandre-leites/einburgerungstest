/**
 * Shared JSDoc typedefs used across the app. This file intentionally
 * contains no runtime code — it exists so the TypeScript checker
 * (`tsc --noEmit` via jsconfig.json) can reason about the shapes of
 * question data, dictionary entries, sessions and stats records.
 *
 * @typedef {"de" | "en" | "pt"} Lang
 *
 * @typedef {Object} QuestionText
 * @property {string} text
 * @property {string} [text_en]
 * @property {string} [text_pt]
 * @property {string | null} [image]
 *
 * @typedef {Object} Question
 * @property {string}   _id             Unique identifier (e.g. "frage-1").
 * @property {string}   category        Either "GERMANY" or a Bundesland name.
 * @property {QuestionText} question
 * @property {string[]} options         Exactly 4 DE answer options.
 * @property {string[]} [options_en]
 * @property {string[]} [options_pt]
 * @property {number}   answerIndex     Integer in [0, 3].
 * @property {string | null} [sub_category]  One of APP.subCategoryKeys.
 *
 * @typedef {Object} DictionaryLangEntry
 * @property {string}   description
 * @property {string[]} [phrases]
 *
 * @typedef {Object} DictionaryEntry
 * @property {DictionaryLangEntry} [de]
 * @property {DictionaryLangEntry} [en]
 * @property {DictionaryLangEntry} [pt]
 * @property {string[]} [forms]
 *
 * @typedef {Object.<string, DictionaryEntry | Object.<string, string>>} RawDictionary
 * Keys are lemmas. Reserved key "aliases" maps inflected forms -> lemma.
 *
 * @typedef {Object} QuestionStat
 * @property {number} correct
 * @property {number} wrong
 * @property {number} skipped
 * @property {string | null} [lastAnsweredAt]
 * @property {string | null} [lastSkippedAt]
 *
 * @typedef {Object.<string, QuestionStat>} StatsMap
 *
 * @typedef {Object} TestSession
 * @property {number}   version
 * @property {"test"}   mode
 * @property {string}   state
 * @property {string[]} questionIds
 * @property {number}   index
 * @property {Object.<string, number>} answers     qid -> chosenIndex
 * @property {Object.<string, boolean>} skipped    qid -> true
 * @property {number | null} endTimeMs
 * @property {boolean}  finished
 *
 * @typedef {Object} TrainingSession
 * @property {number}   version
 * @property {"train"}  mode
 * @property {Object.<string, number>} credits    qid -> remaining credits
 * @property {Object.<string, {shown:number, correct:number, wrong:number, nextEligibleAt:number}>} perQuestion
 * @property {string | null} currentId
 * @property {{chosenIndex:number, isCorrect:boolean, at:string} | null} currentAttempt
 * @property {number}  answeredCount
 *
 * @typedef {Object} MemorizationSession
 * @property {number}    version
 * @property {"memorization"} mode
 * @property {"ordered" | "random"} orderMode
 * @property {string[]}  orderIds
 * @property {number}    index
 * @property {Object.<string, boolean>} [checked]
 *
 * @typedef {Object} MyDictEntry
 * @property {string} word
 * @property {string} addedAt  ISO timestamp
 *
 * @typedef {Object.<string, MyDictEntry>} MyDict
 */
// eslint-disable-next-line no-unused-expressions
void 0;
