const Card = require("../../Card");

module.exports = class StartWithArmor extends Card {
  constructor(role) {
    super(role);

    this.hideModifier = {
      self: true,
    };

    this.startItems = ["PermaMindRot"];
  }
};
