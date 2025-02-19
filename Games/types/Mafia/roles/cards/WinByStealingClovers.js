const Card = require("../../Card");
const Random = require("../../../../../lib/Random");
const { PRIORITY_WIN_CHECK_DEFAULT } = require("../../const/Priority");

module.exports = class WinByStealingClovers extends Card {
  constructor(role) {
    super(role);

    if (this.game.players.length <= 7) {
      role.data.cloverTarget = 1;
    } else if (this.game.players.length <= 11) {
      role.data.cloverTarget = 2;
    } else {
      role.data.cloverTarget = 3;
    }
    this.winCheck = {
      priority: PRIORITY_WIN_CHECK_DEFAULT,
      againOnFinished: true,
      check: function (counts, winners, aliveCount) {
        if (
          !winners.groups[this.name] &&
          this.player.alive &&
          this.player.getItems("Clover").length >= this.data.cloverTarget
        ) {
          winners.addPlayer(this.player, this.name);
        }
      },
    };
    this.listeners = {
      roleAssigned: function (player) {
        if (player !== this.player) {
          return;
        }

        this.player.queueAlert(
          `Before you can escape this accursed town, you must retrieve ${this.data.cloverTarget} four-leaf clovers!`
        );
      },

      start: function () {
        if (this.game.cloversSpawned) {
          return;
        }

        let eligiblePlayers = this.game.players.filter(
          (p) => p.role.name !== "Leprechaun"
        );

        // 3 + numLeprechaun
        let numCloversToSpawn =
          this.data.cloverTarget +
          (this.game.players.length - eligiblePlayers.length);
        // at most game size
        numCloversToSpawn = Math.min(
          numCloversToSpawn,
          this.game.players.length
        );

        if (eligiblePlayers.length < numCloversToSpawn) {
          eligiblePlayers = this.game.players.array();
        }

        eligiblePlayers = Random.randomizeArray(eligiblePlayers);
        for (let i = 0; i < numCloversToSpawn; i++) {
          eligiblePlayers[i].holdItem("Clover");
          eligiblePlayers[i].queueAlert("You possess a four-leaf clover!");
        }
        this.game.cloversSpawned = true;
      },
    };
  }
};
