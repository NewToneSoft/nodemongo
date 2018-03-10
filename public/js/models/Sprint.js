const AnsweredQuestionMgr = require('../managers/AnsweredQuestionMgr');
const TeamMgr = require('../managers/TeamMgr');

const MODE = {
	PRACTICE: 1,
	MARATHON: 2
};

module.exports = {

    startCategory: function(team, category) {
        if (this.isRunning()) {
            this.currentCategoryName[team] = category.getName();
            this.flatQuestionArray[team] = category.getQuestions();
            this.loadQuestionFor(team, this.flatQuestionArray[team][0]);
        } else {
            console.log('Sprint not running!');
        }
    },

    isRunning: function() {
        const startTime = this.startDate.getTime();
        const currTime = new Date().getTime();
        const endTime = this.endDate.getTime();

        return startTime < currTime && currTime < endTime;
    },

    checkAnswer: function(team, selectedOption) {
        const currentQuestion = this.getCurrentQuestionFor(team);
        const answeredQuestion = AnsweredQuestionMgr.create(team, currentQuestion, selectedOption, this);

        this.removeQuestion(team, currentQuestion);
        team.addAnsweredQuestion(answeredQuestion);

        // TODO DB

        if(team.finishedCurrentCategory()) {
            TeamMgr.finishCategory(team, currentQuestion.getCategory());
        }

        if (team.finishedCurrentSprint()) {
            // TODO
        } else {
            this.loadQuestionFor(team, this.getNewQuestion(team));
        }
    },

    setAsMarathonMode: function() {
    	this.mode = MODE.MARATHON;
    },

    setAsPracticeMode: function () {
    	this.mode = MODE.PRACTICE;
    },

    isMarathonMode: function() {
    	return this.mode === MODE.MARATHON;
    },

    isPracticeMode: function () {
    	return this.mode === MODE.PRACTICE;
    },

    getTeams: function() {
        return this.teamArray;
    },

    getCategories: function() {
        return this.categoryArray;
    },

    loadQuestionFor: function(team, question) {
        this.currentQuestion[team] = question;
    },

    getCurrentQuestionFor: function(team) {
        return this.currentQuestion[team];
    },

    getCurrentCategoryFor: function(team) {
        let result = null;
        const that = this;

        this.categoryArray.forEach(function(it) {
            if (it.getName() === that.currentCategoryName[team]) {
                result = it;
            }
        });

        return result;
    },

    getCategory: function(categoryName) {
        let result = null;

        this.categoryArray.forEach(function(it) {
            if (it.getName() == categoryName) {
                result = it;
            }
        });

        return result;
    },

    getNewQuestion: function(team) {
        return this.flatQuestionArray[team][0];
    },

    removeQuestion: function(team, question) {
        const index = this.flatQuestionArray[team].indexOf(question);

        if (index > -1) {
            this.flatQuestionArray[team].splice(index, 1);
        }
    }
};
