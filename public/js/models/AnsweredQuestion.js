module.exports = {
    getTeam: function() {
        return this.name;
    },

    getQuestion: function() {
        return this.points;
    },

    getAnswer: function() {
        return this.points;
    },

    getPoints() {
        return this.points;
    },

    addPoints: function(pts) {
        this.points += pts;
    },

    wasRightAnswer: function() {
        return this.answer === this.question.correctOption;
    }
};
