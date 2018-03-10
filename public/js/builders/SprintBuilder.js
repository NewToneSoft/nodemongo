const TeamMgr = require('../managers/TeamMgr');
const MemberMgr = require('../managers/MemberMgr');
const SprintMgr = require('../managers/SprintMgr');
const CategoryArrayBuilder = require('../builders/CategoryArrayBuilder');

const diana = MemberMgr.create('Diana da Lua');
const apolo = MemberMgr.create('Apolo do Sol');
const dianaTeam = TeamMgr.create('Diana Team', [diana]);
const apoloTeam = TeamMgr.create('Apolo Team', [apolo]);

const teamArray = [dianaTeam, apoloTeam];
const categoryArray = CategoryArrayBuilder.categoryArray;

const startDate = new Date(2018, 2,  9, 11, 33, 30, 0);
const endDate   = new Date(2018, 2, 15, 11, 33, 30, 0);

const sprint = SprintMgr.create('Awesome Sprint', teamArray, categoryArray, startDate, endDate);

module.exports = {
    sprint
};
