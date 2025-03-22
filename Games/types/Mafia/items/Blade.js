const Item = require("../Item");
const Action = require("../Action");
const Random = require("../../../../lib/Random");

module.exports = class Blade extends Item {
  constructor(meetingName, user, target, charge) {
    super("Blade");
    this.reveal = true;
    this.User = user;
    this.Enemy = target;
    this.meetingName = meetingName;
    this.charge = charge || 0;
     this.targets = ["Attack", "Defend", "Focus", "Charge"];
    if(this.charge == 0){
      this.targets = ["Attack", "Defend", "Focus", "Charge"];
    }
    if(this.charge == 1){
      this.targets = ["Attack+", "Defend+", "Focus+", "Charge"];
    }
    if(this.charge == 2){
      if(this.User.role.alignment == "Village"){
      this.targets = ["Towntell Takedown", "FMPOV I'm Clear Defense", "Tunneling Focus", "FOS"];
      }
      if(this.User.role.alignment == "Mafia"){
      this.targets = ["Mafia Mash", "WIFOM Defense", "Blitz Focus", "Bus"];
      }
      if(this.User.role.alignment == "Cult"){
      this.targets = ["Dark Arts", "Blood Ritual", "Worship", "Convert"];
      }
      if(this.User.role.alignment == "Independent"){
      this.targets = ["Triple Attack", "Entrench", "Adrenaline", "Chance Time"];
      }
      if(this.User.role.name == "Samurai"){
      this.targets = ["Typhoon Slash", "Parry", "Focus Fury", "Final Slash"];
      }
    }

    this.meetings = {
      [meetingName]: {
        actionName: "Battle",
        states: ["Day"],
        flags: [
          "group",
          "voting",
          "anonymous",
          "mustAct",
          "instant",
          "votesInvisible",
          "noUnvote",
          "multiSplit",
          "hideAfterVote",
        ],
        inputType: "custom",
        targets: this.targets,
         action: {
          labels: ["kill"],
          item: this,
          run: function () {
          
          this.actor.data.MoveHasBeenSelected = true;
          this.actor.data.MoveSelected = this.target;
          this.item.drop();
          
          if(this.item.Enemy && this.item.Enemy.alive && this.item.Enemy.data.MoveHasBeenSelected == true){
          let duelists = [this.actor, this.item.Enemy];
          duelists = Random.randomizeArray(duelists);
          //Defend Actions
          for(let player in duelists){
          if(player.data.MoveSelected == "Defend"){
          player.data.Block += Random.randInt((player.def-3),(player.def+5));
          this.game.sendAlert(`${player.name} uses Defend! Their Defense increases for this turn.`);
          }
          if(player.data.MoveSelected == "Defend+"){
          player.data.Block += Random.randInt((player.def),(player.def+7))*3;
          this.game.sendAlert(`${player.name} uses Defend+! Their Defense increases for this turn.`);
          player.data.Charge = 0;
          }
          if(player.data.MoveSelected == "FMPOV I'm Clear Defense"){
          player.data.Block += Random.randInt((player.def),(player.def+7))*4;
          let info = this.game.createInformation(
              "RevealInfo",
              player,
              this.game,
              player,
              null,
              "All"
            );
            info.processInfo();
            info.getInfoRaw();
          this.game.sendAlert(`${player.name} uses FMPOV I'm Clear Defense! Their Defense increases for this turn and their Role is Revealed.`);
          player.data.Charge = 0;
          }
          if(player.data.MoveSelected == "WIFOM Defense"){
          player.data.Block += Random.randInt((player.def),(player.def+7))*4;
          for(let person of this.game.alivePlayers()){
            if(person.faction == "Village"){
              person.giveEffect("Scrambled", -1);
            }
          }
          this.game.sendAlert(`${player.name} uses WIFOM Defense! Their Defense increases for this turn and All Village Aligned players are Scrambled.`);
          player.data.Charge = 0;
          }
          if(player.data.MoveSelected == "Blood Ritual"){
          player.data.blood += 40;
          this.game.sendAlert(`${player.name} uses Blood Ritual! They gain 40% Blood.`);
          player.data.Charge = 0;
          }
          if(player.data.MoveSelected == "Entrench"){
          player.def += 12;
          player.data.Block += Random.randInt((player.def),(player.def+7))*3;
          this.game.sendAlert(`${player.name} uses Entrench! Their Defense increases for this turn and their Defending power is increased.`);
          player.data.Charge = 0;
          }
          if(player.data.MoveSelected == "Parry"){
          player.data.Parry = true;
          player.data.Block += Random.randInt((player.def),(player.def+7))*3;
          this.game.sendAlert(`${player.name} uses Parry! Their Defense increases for this turn.`);
          player.data.Charge = 0;
          }
          }
          //Attack Actions
          for(let player in duelists){
          let otherPlayer;
          if(duelist.indexOf(player) == 0){
            otherPlayer = duelist[1];
          }
          else{
            otherPlayer = duelist[0];
          }
          if(player.data.MoveSelected == "Attack"){
          this.game.sendAlert(`${player.name} uses attack!`);
          let damage = Random.randInt((player.atk),(player.atk+5));
          if(otherPlayer.data.Block > 0){
            if(otherPlayer.data.Block >= damage){
              otherPlayer.data.Block -= damage;
              damage = 0;
            }
            else{
              damage -= otherPlayer.data.Block;
              otherPlayer.data.Block = 0;
            }
          }
          if(damage > 0){
            if(Random.randInt(1,20) <= player.crit){
              damage = damage*2;
            }
            otherPlayer.data.blood -= damage;
            this.game.sendAlert(`${otherPlayer.name} loses ${damage}% blood!`);
            if (otherPlayer.data.blood <= 0) {
            otherPlayer.kill("blood", player);
          }
          }
          else{
          this.game.sendAlert(`${otherPlayer.name} blocks the Attack!`);
          }
          }
          if(player.data.MoveSelected == "Attack+"){
          this.game.sendAlert(`${player.name} uses attack+!`);
          let damage = Random.randInt((player.atk)+3,(player.atk+10));
          if(otherPlayer.data.Block > 0){
            if(otherPlayer.data.Block >= damage){
              otherPlayer.data.Block -= damage;
              damage = 0;
            }
            else{
              damage -= otherPlayer.data.Block;
              otherPlayer.data.Block = 0;
            }
          }
          if(damage > 0){
            if(Random.randInt(1,20) <= player.crit){
              damage = damage*2;
            }
            otherPlayer.data.blood -= damage;
            this.game.sendAlert(`${otherPlayer.name} loses ${damage}% blood!`);
            if (otherPlayer.data.blood <= 0) {
            otherPlayer.kill("blood", player);
          }
          }
          else{
          this.game.sendAlert(`${otherPlayer.name} blocks the Attack!`);
          }
          player.data.Charge = 0;
          }
       
          }
          //Buff Actions
          for(let player in duelists){
          if(player.data.MoveSelected == "Focus"){
          let stats = ["atk", "atk", "def", "def", "crit"];
          let toIncrease = Random.randArrayVal(stats);
          if(toIncrease == "atk"){
          this.game.sendAlert(`${player.name} uses Focus! Their Attacking power is increased.`);
            player.atk += 5;
          }
          if(toIncrease == "def"){
          this.game.sendAlert(`${player.name} uses Focus! Their Defending power is increased.`);
            player.def += 6;
          }
          if(toIncrease == "crit"){
          this.game.sendAlert(`${player.name} uses Focus! Their Crit Chance is increased.`);
            player.crit += 1;
          }
          }
          if(player.data.MoveSelected == "Focus+"){
          let stats = ["atk", "atk", "def", "def", "crit"];
          let toIncrease = Random.randArrayVal(stats);
          if(toIncrease == "atk"){
          this.game.sendAlert(`${player.name} uses Focus+! Their Attacking power is increased.`);
            player.atk += 15;
          }
          if(toIncrease == "def"){
          this.game.sendAlert(`${player.name} uses Focus+! Their Defending power is increased.`);
            player.def += 16;
          }
          if(toIncrease == "crit"){
          this.game.sendAlert(`${player.name} uses Focus+! Their Crit Chance is increased.`);
            player.crit += 2;
          }
          player.data.Charge = 0;
          }
          if(player.data.MoveSelected == "Charge"){
          player.data.Charge += 1
          this.game.sendAlert(`${player.name} uses Charge! Their next Move will be Stronger.`);
          }
          }

            
          }
          

            
          },
         },
      },
    };
  }

  run() {
    if (!this.actor.alive || !this.target.alive) return;

    let turn = 1;

    // While the actor or target is alive
    while (this.actor.data.blood > 0 && this.target.data.blood > 0) {
      this.game.queueAlert(`Turn ${turn}`);
      // Shows HP of Actor
      this.game.queueAlert(`${this.actor.name} HP: ${this.actor.data.blood}`);
      // Shows HP of Target
      this.game.queueAlert(`${this.target.name} HP: ${this.target.data.blood}`);

      // Stores their move selection
      let userVote = this.meeting.votes[actor.id];
      let enemyVote = this.meeting.votes[target.id];

      // If neither the user or target voted then return
      if (!userVote || !enemyVote) {
        return;
      }

      // Custom messages for the battle
      if (turn == 1) {
        this.game.queueAlert(`${this.actor.name} unsheathes katana!`);
        this.game.queueAlert(`${this.target.name} eyes glow red.`);
      }

      let wellDoneSent = false;
      let criticalSent = false;
      let deathSent = false;

      let customMessage = "";
      if (
        this.actor.data.blood <= 50 &&
        this.actor.data.blood >= 30 &&
        !wellDoneSent
      ) {
        customMessage = `You have done well so far... But that was just practice!`;
        this.game.queueAlert(customMessage);
        wellDoneSent = true;
      } else if (
        this.actor.data.blood <= 30 &&
        this.actor.data.blood >= 20 &&
        !criticalSent
      ) {
        customMessage = "No more games, to the death!";
        this.game.queueAlert(customMessage);
        criticalSent = true;
      } else if (this.actor.data.blood <= 0 && !deathSent) {
        customMessage = "I can't fall into the hands of an enemy... So I...";
        this.game.queueAlert(customMessage);
        customMessage = "Fulfill a samurai's final duty...";
        this.game.queueAlert(customMessage);
        deathSent = true;
      }

      // Set a state for deciding if an attack has been made
      let attackMade = false;

      // Decide whose action goes first
      let firstMove = Math.floor(Math.random() * 2);

      // User goes first
      if (firstMove === 0) {
        this.performAction(actor, target, userVote, attackMade);
        //Changes the state for attack made incase a defend happens.
        attackMade = true;
        this.performAction(target, actor, enemyVote, attackMade);
      } else {
        // Target goes first
        this.performAction(target, actor, enemyVote, attackMade);

        //Changes the state for attack made incase a defend happens
        attackMade = true;
        this.performAction(actor, target, userVote, attackMade);
      }
      //Increase the turn after actions have been used
      turn++;
    }
    // If the actor or target died, set the winner
    this.actor.winner =
      actor.data.blood > 0 ? this.actor.name : this.target.name;
    this.game.queueAlert(`${this.actor.winner} has won the duel!`);

    // Remove items (if necessary)
    this.actor.item.drop();
    this.target.item.drop();
  }

  performAction(user, enemy, choice, attackMade) {
    let selection = moves.find((move) => move[choice]);
    if (selection) {
      //If an attack hasn't been made assess the messages for defend
      if (!attackMade && choice == "Defend") {
        let defend = moves.find((move) => move.Defend);
        if (defend) {
          let critFailure = " Unable to defend from crits.";
          defend.Defend.action.run.msg += critFailure;
        }
      }
      selection[choice].action.run.call({ user, enemy });
      this.game.queueAlert(selection[choice].msg);
    }
  }
};

//Shows a list of moves samurai and their opponent can choose
let moves = [
  {
    // Basic attack move, deals 3-10 base damage.
    Attack: {
      actionName: "Attack",
      // Can only be done in the day
      states: ["Day"],
      flags: ["voting", "instant", "noVeg"],
      msg: "",
      action: {
        labels: ["attack"],
        run: function () {
          let damage = Math.floor(Math.random() * 4) + 10;
          this.target.data.blood -= damage;
          msg = `${this.actor.name} uses slash. ${this.target.name} loses ${
            damage * (1 + this.actor.crit) * (1 - this.target.def / 100) +
            this.actor.atk
          } HP!`;
          if (this.target.data.blood <= 0) {
            this.target.kill("blood", this.actor);
          }
        },
      },
    },
  },
  {
    // Basic defense increase move stored as a multiplier
    Defend: {
      actionName: "Defend",
      // Can only be done in the day
      states: ["Day"],
      flags: ["voting", "instant", "noVeg"],
      msg: "",
      action: {
        labels: ["defend"],
        run: function () {
          let damageBlocked = Math.floor(Math.random() * 6) * 10;
          this.actor.def += damageBlocked;
          msg = `${this.actor.name} uses defend! Defense is increased.`;
        },
      },
    },
  },
  {
    // Basic attack boost move stored as a multiplier
    Charge: {
      actionName: "Charge",
      // Can only be done in the day
      states: ["Day"],
      flags: ["voting", "instant", "noVeg"],
      msg: "",
      action: {
        labels: ["charge"],
        run: function () {
          this.actor.crit += 0.25;
          msg = `${this.actor.name} uses charge! Attack power increased.`;
        },
      },
    },
  },
];
