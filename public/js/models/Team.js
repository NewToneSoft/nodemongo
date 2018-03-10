module.exports = {

    getName: function() {
        return this.name;
    },

    setLeader: function(member)  {
        this.memberArray.forEach(function(it) {
            if (it.id === member.id) {
                this.leader = member;
            }
        });
    },

    getLeader: function() {
        return this.leader;
    },

    getMembers: function() {
        return this.memberArray;
    },

    getCurrentSprint: function() {
        return this.currentSprint;
    },

    addAnsweredQuestion: function(answeredQuestion) {
        this.answeredQuestions.push(answeredQuestion);
    },

    answerCurrentQuestion: function(selectedOption) {
        this.getCurrentSprint().checkAnswer(this, selectedOption);
    },

    getAnsweredQuestions: function() {
        return this.answeredQuestions;
    },

    getFinishedCategoriesNames: function() {
        return this.finishedCategoriesNames;
    },

    finishCategory: function(category) {
        this.finishedCategoriesNames.push(category.getName());
    },

    finishedCurrentSprint: function() {
        const numberOfCategoriesInSprint = this.currentSprint.getCategories().length;
        return this.getFinishedCategoriesNames().length >= numberOfCategoriesInSprint;
    },

    finishedCurrentCategory: function() {
        const numberOfQuestionsInCurretnCategory = this.currentSprint.getCurrentCategoryFor(this).getQuestions().length;
        return this.answeredQuestions.length === numberOfQuestionsInCurretnCategory;
    },

    getPoints: function() {
        let sum = 0;

        this.answeredQuestions.forEach(function(it) {
            sum += it.getPoints();
        });

        return sum;
    }
};
