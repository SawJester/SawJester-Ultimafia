const Effect = require("../Effect");

module.exports = class SafeFromEffects extends Effect {
  constructor(protector, immunity, lifespan) {
    super("SafeFromEffects");

    this.protector = protector;
    this.immunity["poison"] = immunity || 5;
    this.immunity["malicious effect"] = immunity || 5;
    this.immunity["delirium"] = immunity || 5;

    this.lifespan = lifespan ?? 1;
  }
};
