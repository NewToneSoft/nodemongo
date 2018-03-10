const QuestionMgr = require('../managers/QuestionMgr');
const CategoryMgr = require('../managers/CategoryMgr');
const optionArray = [
    'Option 1',
    'Option 2',
    'Option 3',
    'Option 4',
    'Option 5',
];

const questionArr = [
    'Is this the real life?',
    'Is this just fantasy?',
    'Will you do the fandango?',
    'Will you let me go?',
    'So you think you can stone me and spit in my eye?',
    'So you think you can love me and leave me to die?',
];


const categoryArray = [];

for (let cat = 0; cat < 7; cat++) {
    const category = CategoryMgr.create(`Category ${cat}`);

    for (let qst = 0; qst < 6; qst = qst+1) {
        const level = Math.floor(Math.random() * 3);
        const correctOption = Math.floor(Math.random() * 4);
        const question = QuestionMgr.create(questionArr[qst], optionArray, correctOption, level);
        category.addQuestion(question);
    }
    categoryArray.push(category);
}

module.exports = {
    categoryArray
};
