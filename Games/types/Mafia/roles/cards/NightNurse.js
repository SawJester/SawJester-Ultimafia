const Card = require("../../Card");
const Action = require("../../Action");
const {
  PRIORITY_EFFECT_REMOVER_DEFAULT,
  PRIORITY_EFFECT_REMOVER_EARLY,
  PRIORITY_CANCEL_ROLEBLOCK_ACTIONS,
} = require("../../const/Priority");

module.exports = class NightNurse extends Card {
  constructor(role) {
    super(role);

    this.meetings = {
      Nurse: {
        actionName: "Sponge Bath",
        states: ["Night"],
        flags: ["voting"],
        action: {
          labels: ["cleanse"],
          priority: PRIORITY_CANCEL_ROLEBLOCK_ACTIONS + 1,
          run: function () {
            this.cleanse(1);
            this.role.PlayerToCleanse = this.target;
          },
        },
      },
    };

    this.listeners = {
      state: function (stateInfo) {
        if (!this.hasAbility(["Effect"])) {
          return;
        }

        if (!stateInfo.name.match(/Night/)) {
          return;
        }

        var action2 = new Action({
          actor: this.player,
          game: this.player.game,
          role: this,
          priority: PRIORITY_EFFECT_REMOVER_EARLY,
          labels: ["cleanse"],
          run: function () {
            if (this.role.PlayerToCleanse != null) {
              this.cleanse(1, this.role.PlayerToCleanse);
            }
          },
        });

        var action = new Action({
          actor: this.player,
          game: this.player.game,
          role: this,
          priority: PRIORITY_EFFECT_REMOVER_DEFAULT,
          labels: ["cleanse"],
          run: function () {
            if (this.role.PlayerToCleanse != null) {
              this.cleanse(1, this.role.PlayerToCleanse);
            }
            this.role.PlayerToCleanse = null;
          },
        });

        this.game.queueAction(action);
        this.game.queueAction(action2);
      },
    };
  }
};
