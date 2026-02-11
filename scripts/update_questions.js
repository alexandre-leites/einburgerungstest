// update_questions.js

const fs = require('fs');
const path = require('path');

// Configuration
const QUESTIONS_FILE = '../docs/assets/questions.json';
const CORRECTIONS_FILE = 'corrections.json';
const OUTPUT_FILE = '../docs/assets/questions_updated.json'; // We save to a new file to be safe

/**
 * Main function to update the sub_categories
 */
function updateQuestions() {
  try {
    // 1. Resolve paths
    const questionsPath = path.join(__dirname, QUESTIONS_FILE);
    const correctionsPath = path.join(__dirname, CORRECTIONS_FILE);
    const outputPath = path.join(__dirname, OUTPUT_FILE);

    // 2. Check if files exist
    if (!fs.existsSync(questionsPath)) {
      throw new Error(`Input file not found: ${QUESTIONS_FILE}`);
    }
    if (!fs.existsSync(correctionsPath)) {
      throw new Error(`Corrections file not found: ${CORRECTIONS_FILE}`);
    }

    // 3. Read and Parse JSON
    console.log('Reading files...');
    const questionsData = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
    const correctionsData = JSON.parse(fs.readFileSync(correctionsPath, 'utf8'));

    // 4. Create a Map for O(1) lookup speed
    // Mapping _id -> new_sub_category
    const correctionsMap = new Map();
    correctionsData.forEach(item => {
      if (item._id && item.sub_category) {
        correctionsMap.set(item._id, item.sub_category);
      }
    });

    console.log(`Loaded ${correctionsMap.size} corrections.`);

    // 5. Apply updates
    let updateCount = 0;
    
    // We iterate through the original array
    questionsData.forEach(question => {
      if (correctionsMap.has(question._id)) {
        const newCategory = correctionsMap.get(question._id);
        
        // Check if it's actually different to avoid phantom updates
        if (question.sub_category !== newCategory) {
          console.log(`[${question._id}] Changing '${question.sub_category}' -> '${newCategory}'`);
          question.sub_category = newCategory;
          updateCount++;
        }
      }
    });

    // 6. Write the result
    console.log(`\nWriting output to ${OUTPUT_FILE}...`);
    fs.writeFileSync(outputPath, JSON.stringify(questionsData, null, 2), 'utf8');

    console.log(`Done! Successfully updated ${updateCount} questions.`);

  } catch (error) {
    console.error('An error occurred:', error.message);
  }
}

// Run the function
updateQuestions();