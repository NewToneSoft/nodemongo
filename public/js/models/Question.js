module.exports = {

    getText: function() {
        return this.text;
    },

    getCorrectOption: function() {
        return this.correctOption;
    },

    getOptions: function()  {
        this.optionArray;
    },

    checkSelectedOption: function(selectedOption) {
        return selectedOption === this.correctOption;
    },

    setCategory: function(category) {
        if (!this.category) {
            this.category = category;
        }
    },

    getCategory: function() {
        return this.category;
    },

    getLevel: function() {
        return this.level;
    },

    getPoints: function() {
    	return this.level;
    },

    printText: function() {
        console.log(`${this.text} || answer: ${this.correctOption} || level: ${this.level}`);
    },

    presentToUser: function() {
        console.log(this.getText() + ' Correct option: ' + this.correctOption);
        //        this.optionArray.forEach(function(option) {
        //            console.log(option);
        //        });
    }

};
