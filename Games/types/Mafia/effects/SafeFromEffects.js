const Effect = require("../Effect");

module.exports = class SafeFromEffects extends Effect {
  constructor(immunity, lifespan) {
    super("SafeFromEffects");

    this.immunity["poison"] = immunity || 5;
    this.immunity["malicious effect"] = immunity || 5;
    this.immunity["delirium"] = immunity || 5;

    this.lifespan = lifespan ?? 1;
  }
};
