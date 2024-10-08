const Role = require("../../Role");

module.exports = class Monkey extends Role {
  constructor(player, data) {
    super("Monkey", player, data);

    this.alignment = "Village";
    this.cards = [
      "VillageCore",
      "WinWithFaction",
      "MeetingFaction",
      "BecomeRoleForNight",
    ];
    /*
    this.meetingMods = {
      Copy: {
        actionName: "Monkey See",
      },
      Imitate: {
        actionName: "Monkey Do",
      },
    };
    */
  }
};
