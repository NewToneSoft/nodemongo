const currentSprint = require('./builders/SprintBuilder').sprint;
const team = currentSprint.getTeams()[0];
const category = currentSprint.categoryArray[3];

currentSprint.startCategory(team, category);

do {
    const currentQuestion = currentSprint.getCurrentQuestionFor(team);
    currentQuestion.presentToUser();
    team.answerCurrentQuestion(2);
} while(!team.finishedCurrentCategory());

console.log(`Finished!! You team ended up with ${team.getPoints()} point(s)!`);