module.exports = {
    getName: function() {
        return this.name;
    },

    getPoints: function() {
        return this.points;
    },

    addPoints: function(pts) {
        this.points += pts;
    },

    setTeam: function(team) {
        this.team = team;
    },

    getTeam: function() {
        return this.team;
    }
};
