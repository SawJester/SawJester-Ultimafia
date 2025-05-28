const Item = require("../Item");
const Random = require("../../../../lib/Random");
const Action = require("../Action");
const { PRIORITY_INVESTIGATIVE_DEFAULT } = require("../const/Priority");

module.exports = class RoleSharing extends Item {
  constructor(lifespan, roleShare, alignmentShare, privateShare, publicShare) {
    super("RoleSharing");

    //this.magicCult = options?.magicCult;
    //this.broken = options?.broken;
    this.canRoleShare = roleShare;
    this.canAlignmentShare = alignmentShare;
    this.canPrivateReveal = privateShare;
    this.canPublicReveal = privateShare;
    this.cannotBeStolen = true;
    this.cannotBeSnooped = true;
    this.lifespan = lifespan || Infinity;

    this.shareTypes = ["None"];

    if (this.canRoleShare == true) {
      this.shareTypes.push("Role Share");
    }
    if (this.canAlignmentShare == true) {
      this.shareTypes.push("Alignment Share");
    }
    if (this.canPrivateReveal == true) {
      this.shareTypes.push("Private Reveal");
    }
    if (this.canPublicReveal == true) {
      this.shareTypes.push("Public Reveal");
    }

    this.meetings = {
      "Choose Share Method": {
        states: ["Day"],
        flags: ["voting"],
        inputType: "custom",
        targets: this.shareTypes,
      },
      "Share With Target": {
        states: ["Day"],
        flags: ["voting"],
        item: this,
      },
    };

    this.listeners = {
      state: function (stateInfo) {
        this.hasSharedWith = [];
        //var currentFungusList = this.shareTypes.filter((h));

        //this.meetings["Choose Share Method"].targets = currentFungusList;
      },
      vote: function (vote) {
        if (
          vote.meeting.name === "Choose Share Method" &&
          vote.voter === this.holder
        ) {
          this.currentShareMethod = vote.target;
        } else if (
          vote.meeting.name === "Share With Target" &&
          vote.voter === this.holder &&
          vote.target
        ) {
          let targetPlayer = this.game
            .alivePlayers()
            .filter((p) => p.id == vote.target);
          if (targetPlayer.length > 0) {
            targetPlayer = targetPlayer[0];
          } else {
            return;
          }
          if (
            this.currentShareMethod == null ||
            this.currentShareMethod == "None"
          )
            return;

          if (this.hasSharedWith.includes(targetPlayer)) return;
          if (this.holder.hasEffect("CannotRoleShare")) return;
          this.hasSharedWith.push(targetPlayer);
          if (
            this.currentShareMethod == "Role Share" ||
            this.currentShareMethod == "Alignment Share"
          ) {
            var action = new Action({
              actor: this.holder,
              target: targetPlayer,
              game: this.game,
              item: this,
              labels: ["hidden"],
              run: function () {
                this.target.queueAlert(
                  `${this.actor.name} wants to ${this.item.currentShareMethod}.`
                );
                this.actor.queueAlert(
                  `You offer to ${this.item.currentShareMethod} with ${this.target.name}.`
                );
              },
            });
            this.game.instantAction(action);

            let ShareWith = targetPlayer.holdItem(
              "RoleShareAccept",
              this.holder,
              this.currentShareMethod,
              targetPlayer
            );
            this.game.instantMeeting(ShareWith.meetings, [targetPlayer]);
          } else if (this.currentShareMethod == "Private Reveal") {
            //this.holder.role.revealToPlayer(targetPlayer);
            var action = new Action({
              actor: this.holder,
              target: targetPlayer,
              game: this.game,
              item: this,
              labels: ["hidden"],
              run: function () {
                this.target.queueAlert(
                  `${this.actor.name} ${this.item.currentShareMethod}s to you.`
                );
                this.actor.queueAlert(
                  `You ${this.item.currentShareMethod} to ${this.target.name}.`
                );
                this.actor.role.revealToPlayer(targetPlayer);
              },
            });
            this.game.instantAction(action);
          } else if (this.currentShareMethod == "Public Reveal") {
            //this.holder.role.revealToAll();
            var action = new Action({
              actor: this.holder,
              target: targetPlayer,
              game: this.game,
              item: this,
              labels: ["hidden"],
              run: function () {
                this.game.queueAlert(
                  `${this.actor.name} ${this.item.currentShareMethod}s to everyone.`
                );
                this.actor.role.revealToAll();
              },
            });
            this.game.instantAction(action);
          }
        }
      },
    };
  }

  hold(player) {
    super.hold(player);
    //this.data.currentShareMethod = null;
  }
};
