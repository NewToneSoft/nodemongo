module.exports = {
    getName: function() {
        return this.name;
    },

    addQuestion: function(question) {
        this.questionArray.push(question);
        question.setCategory(this);
    },

    getQuestions: function() {
        return this.questionArray;
    }
};
