const Item = require("../Item");
const Action = require("../Action");
const { PRIORITY_EFFECT_GIVER_DEFAULT } = require("../const/Priority");
const { PRIORITY_DAY_DEFAULT } = require("../const/Priority");
const { MEETING_PRIORITY_HOT_SPRINGS } = require("../const/MeetingPriority");

module.exports = class Orange extends Item {
  constructor(reveal) {
    super("Orange");

    this.reveal = reveal;
    this.meetings = {
      "Visit Hot Springs": {
        actionName: "Visit the hot springs tonight?",
        states: ["Day"],
        flags: ["voting"],
        inputType: "boolean",
        action: {
          labels: ["springs", "orange"],
          priority: PRIORITY_DAY_DEFAULT,
          item: this,
          run: function () {
            if (this.target == "Yes") {
              this.actor.role.visitHotSprings = true;
            }
          },
        },
      },
      "Hot Springs": {
        states: ["Night"],
        flags: ["exclusive", "group", "speech", "anonymous"],
        priority: MEETING_PRIORITY_HOT_SPRINGS,
        shouldMeet: function () {
          return this.visitHotSprings;
        },
      },
    };
    this.listeners = {
      actionsNext: function (stateInfo) {
        var stateInfo = this.game.getStateInfo();

        if (stateInfo.name.match(/Night/) && this.holder.role.visitHotSprings) {
          this.drop();
          this.holder.role.visitHotSprings = false;
        }
      },
    };
  }

  eat() {
    if (this.magicCult == true && this.holder.role.alignment != "Cult") {
      let action = new Action({
        actor: this.holder,
        target: this.holder,
        game: this.game,
        labels: [
          "giveEffect",
          "poison",
          "hidden",
          "absolute",
          "uncontrollable",
        ],
        priority: PRIORITY_EFFECT_GIVER_DEFAULT,
        run: function () {
          if (this.dominates()) {
            this.target.queueAlert(
              "You have been poisoned by the Cult's Magic Food!"
            );
            this.target.giveEffect("poison", this.actor);
          }
        },
      });

      action.do();
    }
  }
};
