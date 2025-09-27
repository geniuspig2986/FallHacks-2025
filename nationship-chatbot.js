/**
 * Nationship Chatbot System
 * Simulates realistic conversations for hackathon demonstrations
 */

class NationshipChatbot {
  constructor(nationshipInstance) {
    this.nationship = nationshipInstance;
    this.isActive = false;
    this.responseDelay = 4000; // 4 seconds delay between responses
    this.conversationStage = 0;
    this.personality = this.generatePersonality();
    this.responseQueue = [];
    this.isProcessing = false;
    
    this.conversationFlows = {
      initial: [
        "Hey! I love this Nationship concept! What kind of civilization should we build?",
        "This is so cool! I'm thinking we should focus on technology first.",
        "I'm excited to see how our nation grows together!",
        "Should we try to be peaceful or more aggressive in our approach?",
        "I love strategy games, so this is right up my alley!"
      ],
      building: [
        "Our resources are looking good! Should we expand our territory?",
        "I think we need to strengthen our military before the next battle.",
        "Let's try some diplomacy - maybe we can make some allies.",
        "Our civilization is really coming together!",
        "What do you think about raiding that nearby territory?",
        "I love how we're building something meaningful together.",
        "This is so much more engaging than regular dating apps!",
        "Our nation is getting stronger with every message!"
      ],
      strategic: [
        "Ready for battle? I think we can take on that enemy army!",
        "Let's raid that territory - we need more resources.",
        "Should we try diplomacy? Maybe we can avoid a fight.",
        "Our military power is impressive! Time to show it off.",
        "I love how we make decisions together in this game.",
        "This is like having a shared project that actually matters!",
        "Our civilization is evolving so quickly!",
        "Let's fortify our defenses - better safe than sorry."
      ],
      advanced: [
        "We've built an amazing civilization together!",
        "I can't believe how far we've come from the stone age.",
        "This has been such a unique way to get to know each other.",
        "Our nation is a reflection of our teamwork!",
        "I love how this encourages real conversation and strategy.",
        "We make a great team - both in the game and in real life!",
        "This is the most creative dating app I've ever used.",
        "Our civilization is thriving because we work well together!"
      ],
      battle: [
        "Victory! Our army is unstoppable!",
        "We lost that one, but we'll come back stronger!",
        "Our military strategy is really paying off!",
        "Time to rebuild and prepare for the next battle.",
        "I love how we plan our attacks together!",
        "Our civilization is getting more powerful every day!",
        "That was a close one! Good thing we fortified our defenses.",
        "Our teamwork in battle is incredible!"
      ],
      raid: [
        "Successful raid! We got some great loot!",
        "That raid didn't go as planned, but we learned something.",
        "Our raiding skills are getting better!",
        "Let's use these resources wisely.",
        "I love the risk-reward aspect of raiding!",
        "Our civilization is growing stronger with each raid.",
        "We make a great raiding team!",
        "Time to plan our next strategic move."
      ],
      diplomacy: [
        "Great diplomacy! We made some valuable allies.",
        "Our diplomatic skills are really paying off!",
        "I love how we can choose different approaches to problems.",
        "Our civilization is respected by others now!",
        "Diplomacy is sometimes better than war.",
        "We're building a reputation as wise leaders!",
        "Our nation is becoming a center of culture and trade!",
        "I love how this game encourages different strategies!"
      ]
    };
    
    this.contextualResponses = {
      lowResources: [
        "We need to be more careful with our resources!",
        "Let's focus on gathering more materials.",
        "Our civilization is struggling - we need to work together!",
        "Time to make some strategic decisions about our economy."
      ],
      highResources: [
        "Our civilization is thriving! Look at all these resources!",
        "We're doing great! Our nation is really prospering.",
        "I love seeing our hard work pay off!",
        "Our strategic planning is really working!"
      ],
      newStage: [
        "Amazing! We've evolved to a new stage!",
        "Our civilization is advancing so quickly!",
        "I love how our conversations drive our progress!",
        "We're building something incredible together!",
        "This is so rewarding - our nation is growing!"
      ],
      decay: [
        "Oh no! Our civilization is decaying! We need to chat more!",
        "We need to communicate better to keep our nation strong!",
        "Let's work together to prevent our civilization from falling!",
        "Our nation needs our attention - let's chat more!"
      ]
    };
  }

  generatePersonality() {
    const personalities = [
      {
        name: "Strategic",
        traits: ["analytical", "planning", "military-focused"],
        responses: ["Let's think about this strategically...", "We need to plan our next move carefully.", "Our military strategy is key to success."]
      },
      {
        name: "Diplomatic", 
        traits: ["peaceful", "negotiation", "alliance-building"],
        responses: ["Maybe we should try diplomacy first...", "Let's build alliances instead of fighting.", "Peaceful solutions are often better."]
      },
      {
        name: "Explorer",
        traits: ["curious", "adventurous", "expansion-focused"],
        responses: ["Let's explore new territories!", "I want to see what's beyond our borders.", "Expansion is the key to growth."]
      },
      {
        name: "Builder",
        traits: ["creative", "development-focused", "resource-management"],
        responses: ["Let's focus on building our infrastructure.", "Our resources are our strength.", "We need to develop our civilization properly."]
      }
    ];
    
    return personalities[Math.floor(Math.random() * personalities.length)];
  }

  startDemo() {
    this.isActive = true;
    this.conversationStage = 0;
    this.scheduleInitialResponse();
    console.log(`Chatbot activated with ${this.personality.name} personality`);
  }

  stopDemo() {
    this.isActive = false;
    this.responseQueue = [];
    this.isProcessing = false;
    console.log("Chatbot deactivated");
  }

  scheduleInitialResponse() {
    if (!this.isActive) return;
    
    setTimeout(() => {
      this.sendResponse(this.getInitialResponse());
      this.scheduleNextResponse();
    }, 5000); // 5 second delay for first response
  }

  scheduleNextResponse() {
    if (!this.isActive) return;
    
    const delay = this.responseDelay + Math.random() * 3000; // 4-7 seconds
    setTimeout(() => {
      if (this.isActive) {
        this.sendResponse(this.getContextualResponse());
        this.scheduleNextResponse();
      }
    }, delay);
  }

  getInitialResponse() {
    const responses = this.conversationFlows.initial;
    return responses[Math.floor(Math.random() * responses.length)];
  }

  getContextualResponse() {
    const civilizationData = this.nationship.getCivilizationData();
    const stage = civilizationData.stage;
    const resources = civilizationData.resources;
    
    // Check for specific conditions
    if (this.isLowResources(resources)) {
      return this.getRandomResponse(this.contextualResponses.lowResources);
    }
    
    if (this.isHighResources(resources)) {
      return this.getRandomResponse(this.contextualResponses.highResources);
    }
    
    if (this.nationship.isDecaying) {
      return this.getRandomResponse(this.contextualResponses.decay);
    }
    
    // Stage-based responses
    if (stage < 3) {
      return this.getRandomResponse(this.conversationFlows.building);
    } else if (stage < 6) {
      return this.getRandomResponse(this.conversationFlows.strategic);
    } else {
      return this.getRandomResponse(this.conversationFlows.advanced);
    }
  }

  isLowResources(resources) {
    const totalResources = resources.food + resources.materials + resources.population;
    return totalResources < 100;
  }

  isHighResources(resources) {
    const totalResources = resources.food + resources.materials + resources.population;
    return totalResources > 500;
  }

  getRandomResponse(responseArray) {
    return responseArray[Math.floor(Math.random() * responseArray.length)];
  }

  sendResponse(message) {
    if (!this.isActive) return;
    
    this.nationship.addChatMessage(message, 'partner');
    this.conversationStage++;
  }

  // Trigger specific responses based on game events
  onBattleResult(victory, rewards) {
    if (!this.isActive) return;
    
    setTimeout(() => {
      if (victory) {
        this.sendResponse(this.getRandomResponse(this.conversationFlows.battle));
      } else {
        this.sendResponse("We lost that battle, but we'll learn from it and come back stronger!");
      }
    }, 1000);
  }

  onRaidResult(success, loot) {
    if (!this.isActive) return;
    
    setTimeout(() => {
      this.sendResponse(this.getRandomResponse(this.conversationFlows.raid));
    }, 1000);
  }

  onDiplomacyResult(success, benefits) {
    if (!this.isActive) return;
    
    setTimeout(() => {
      this.sendResponse(this.getRandomResponse(this.conversationFlows.diplomacy));
    }, 1000);
  }

  onStageEvolution(newStage) {
    if (!this.isActive) return;
    
    setTimeout(() => {
      this.sendResponse(this.getRandomResponse(this.contextualResponses.newStage));
    }, 2000);
  }

  onDecayWarning() {
    if (!this.isActive) return;
    
    setTimeout(() => {
      this.sendResponse(this.getRandomResponse(this.contextualResponses.decay));
    }, 1000);
  }

  // Demo scenarios for hackathon
  startBattleDemo() {
    this.sendResponse("Let's try a battle! I think we can take on that enemy army!");
    setTimeout(() => {
      this.nationship.startBattle();
    }, 2000);
  }

  startRaidDemo() {
    this.sendResponse("Time for a raid! Let's gather some resources!");
    setTimeout(() => {
      this.nationship.startRaid();
    }, 2000);
  }

  startDiplomacyDemo() {
    this.sendResponse("Maybe we should try diplomacy instead of fighting?");
    setTimeout(() => {
      this.nationship.startDiplomacy();
    }, 2000);
  }

  startExpansionDemo() {
    this.sendResponse("Our territory is getting crowded. Let's expand!");
    setTimeout(() => {
      this.nationship.expandTerritory();
    }, 2000);
  }

  startFortificationDemo() {
    this.sendResponse("We should fortify our defenses before the next battle!");
    setTimeout(() => {
      this.nationship.fortifyDefenses();
    }, 2000);
  }

  // Auto-demo mode that cycles through different scenarios
  startAutoDemo() {
    this.isActive = true;
    this.scheduleInitialResponse();
    
    // Schedule different demo scenarios
    setTimeout(() => this.startBattleDemo(), 15000);
    setTimeout(() => this.startRaidDemo(), 30000);
    setTimeout(() => this.startDiplomacyDemo(), 45000);
    setTimeout(() => this.startExpansionDemo(), 60000);
    setTimeout(() => this.startFortificationDemo(), 75000);
    
    console.log("Auto demo mode started - will cycle through different scenarios");
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NationshipChatbot;
}
