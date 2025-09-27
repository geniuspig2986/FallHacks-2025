/**
 * Nationship Civilization System
 * A comprehensive civilization management system for dating apps
 * Integrates chat activity with civilization progression, battles, and raids
 */

class NationshipCivilization {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = {
      apiHost: options.apiHost || 'http://localhost:8080',
      matchId: options.matchId || null,
      userId: options.userId || null,
      enableChatbot: options.enableChatbot || false,
      ...options
    };

    this.stages = [
      {
        name: "Tribal Beginnings",
        description: "Your people are primitive tribes, communicating through basic sounds and gestures. Survival depends on cooperation and mutual understanding.",
        features: [
          "• Basic communication through sounds",
          "• Simple stone tools and weapons", 
          "• Small family groups and tribes",
          "• Nomadic lifestyle and hunting"
        ],
        messagesRequired: 0,
        emoji: "🦕",
        militaryPower: 10,
        resources: { food: 50, materials: 30, population: 20 }
      },
      {
        name: "Stone Age Settlements",
        description: "Your civilization has developed agriculture and permanent settlements. Basic warfare and defense systems emerge.",
        features: [
          "• Advanced stone tools and weapons",
          "• Early agriculture and farming",
          "• Permanent settlements and villages",
          "• Basic military organization"
        ],
        messagesRequired: 50,
        emoji: "🪨",
        militaryPower: 25,
        resources: { food: 100, materials: 60, population: 50 }
      },
      {
        name: "Bronze Age Kingdoms",
        description: "Metallurgy revolutionizes your civilization. Bronze weapons and armor create powerful armies and complex trade networks.",
        features: [
          "• Bronze tools, weapons, and armor",
          "• Trade networks and diplomacy",
          "• Written language and laws",
          "• Professional armies and fortifications"
        ],
        messagesRequired: 100,
        emoji: "⚔️",
        militaryPower: 50,
        resources: { food: 200, materials: 120, population: 100 }
      },
      {
        name: "Iron Age Empires",
        description: "Iron working creates superior weapons and tools. Large empires form with sophisticated military strategies and conquest.",
        features: [
          "• Iron weapons and siege engines",
          "• Large cities and fortresses",
          "• Advanced military tactics",
          "• Empire building and expansion"
        ],
        messagesRequired: 200,
        emoji: "🏰",
        militaryPower: 100,
        resources: { food: 400, materials: 250, population: 200 }
      },
      {
        name: "Classical Civilizations",
        description: "Your civilization reaches a golden age of culture, philosophy, and military might. Great generals and strategists emerge.",
        features: [
          "• Philosophy, science, and strategy",
          "• Monumental architecture and cities",
          "• Complex government and military systems",
          "• Cultural and military achievements"
        ],
        messagesRequired: 350,
        emoji: "🏛️",
        militaryPower: 200,
        resources: { food: 800, materials: 500, population: 400 }
      },
      {
        name: "Medieval Realms",
        description: "Feudal systems create powerful kingdoms with knights, castles, and complex military hierarchies.",
        features: [
          "• Feudal systems and knight orders",
          "• Advanced agriculture and trade",
          "• Gothic architecture and castles",
          "• Professional armies and mercenaries"
        ],
        messagesRequired: 500,
        emoji: "⚔️",
        militaryPower: 400,
        resources: { food: 1600, materials: 1000, population: 800 }
      },
      {
        name: "Renaissance Powers",
        description: "A period of great military innovation and cultural awakening. Gunpowder and new tactics revolutionize warfare.",
        features: [
          "• Gunpowder weapons and cannons",
          "• Artistic and military masterpieces",
          "• Exploration and naval warfare",
          "• Humanistic philosophy and strategy"
        ],
        messagesRequired: 700,
        emoji: "🎨",
        militaryPower: 800,
        resources: { food: 3200, materials: 2000, population: 1600 }
      },
      {
        name: "Industrial Nations",
        description: "The industrial revolution transforms warfare with mass production, railroads, and modern military technology.",
        features: [
          "• Steam power and machinery",
          "• Mass production of weapons",
          "• Urbanization and logistics",
          "• Modern transportation and communication"
        ],
        messagesRequired: 1000,
        emoji: "🏭",
        militaryPower: 1600,
        resources: { food: 6400, materials: 4000, population: 3200 }
      },
      {
        name: "Modern Superpowers",
        description: "Advanced technology, global communication, and sophisticated military systems create modern superpowers.",
        features: [
          "• Advanced technology and weapons",
          "• Global communication networks",
          "• Democratic governance and alliances",
          "• Space exploration and defense"
        ],
        messagesRequired: 1500,
        emoji: "🚀",
        militaryPower: 3200,
        resources: { food: 12800, materials: 8000, population: 6400 }
      },
      {
        name: "Transcendent Civilization",
        description: "Your civilization has achieved perfect harmony and technological mastery, transcending traditional warfare through wisdom and cooperation.",
        features: [
          "• Advanced AI and robotics",
          "• Space colonization and defense",
          "• Perfect harmony and cooperation",
          "• Transcendent wisdom and peace"
        ],
        messagesRequired: 2000,
        emoji: "🌟",
        militaryPower: 6400,
        resources: { food: 25600, materials: 16000, population: 12800 }
      }
    ];

    this.currentStage = 0;
    this.totalMessages = 0;
    this.chatMinutes = 0;
    this.lastMessageTime = Date.now();
    this.messageHistory = [];
    this.participants = [];
    this.resources = { food: 50, materials: 30, population: 20 };
    this.militaryPower = 10;
    this.defenseLevel = 1;
    this.territory = { x: 0, y: 0, size: 1 };
    this.battleHistory = [];
    this.raids = [];
    this.autoChatInterval = null;
    this.decayTimer = null;
    this.isDecaying = false;
    this.civilizationName = "New Nation";
    this.chatbot = null;

    this.initializeElements();
    this.bindEvents();
    this.startDecayTimer();
    this.updateDisplay();
    
    // Initialize chatbot if enabled
    if (this.options.enableChatbot) {
      this.initializeChatbot();
    }
  }

  initializeElements() {
    // Create the main civilization container
    this.container.innerHTML = `
      <div class="nationship-container">
        <div class="civilization-main">
          <div class="civilization-header">
            <h2 class="civilization-title">${this.civilizationName}</h2>
            <div class="stage-indicator" id="stageIndicator">Stage: Tribal Beginnings</div>
          </div>
          
          <div class="civilization-content">
            <div class="map-section">
              <div class="map-container" id="mapContainer">
                <div class="territory" id="territory"></div>
                <div class="map-controls">
                  <button class="btn btn-primary" id="expandTerritory">Expand Territory</button>
                  <button class="btn btn-secondary" id="fortifyDefenses">Fortify Defenses</button>
                </div>
              </div>
            </div>
            
            <div class="civilization-stats">
              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-value" id="totalMessages">0</div>
                  <div class="stat-label">Messages</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value" id="militaryPower">10</div>
                  <div class="stat-label">Military Power</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value" id="defenseLevel">1</div>
                  <div class="stat-label">Defense Level</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value" id="territorySize">1</div>
                  <div class="stat-label">Territory Size</div>
                </div>
              </div>
              
              <div class="resources-section">
                <h3>Resources</h3>
                <div class="resource-bar">
                  <span>Food: <span id="foodAmount">50</span></span>
                  <div class="resource-fill" id="foodBar"></div>
                </div>
                <div class="resource-bar">
                  <span>Materials: <span id="materialsAmount">30</span></span>
                  <div class="resource-fill" id="materialsBar"></div>
                </div>
                <div class="resource-bar">
                  <span>Population: <span id="populationAmount">20</span></span>
                  <div class="resource-fill" id="populationBar"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="civilization-actions">
            <button class="btn btn-primary" id="battleButton">Battle Enemy</button>
            <button class="btn btn-secondary" id="raidButton">Raid Territory</button>
            <button class="btn btn-secondary" id="diplomacyButton">Diplomacy</button>
            <button class="btn btn-secondary" id="autoChatButton">Auto Chat</button>
            <button class="btn btn-secondary" id="demoModeButton">Demo Mode</button>
            <button class="btn btn-secondary" id="stopDemoButton" style="display: none;">Stop Demo</button>
          </div>
          
          <div class="progress-section">
            <div class="progress-title">Civilization Progress</div>
            <div class="progress-bar">
              <div class="progress-fill" id="progressFill"></div>
            </div>
            <div class="progress-text" id="progressText">Start chatting to begin your civilization's journey!</div>
          </div>
        </div>
        
        <div class="chat-sidebar">
          <div class="chat-header">
            <h3>Nationship Chat</h3>
            <div class="chat-status" id="chatStatus">Ready to chat</div>
          </div>
          <div class="chat-log" id="chatLog"></div>
          <div class="chat-input-section">
            <textarea id="chatInput" placeholder="Send a message to strengthen your nation..."></textarea>
            <button class="btn btn-primary" id="sendMessage">Send</button>
          </div>
        </div>
      </div>
      
      <div class="evolution-animation" id="evolutionAnimation">
        <div class="evolution-content">
          <div class="evolution-emoji" id="evolutionEmoji">🦕 → 🪨</div>
          <div class="evolution-text">Civilization Evolved!</div>
        </div>
      </div>
      
      <div class="notification" id="notification"></div>
      
      <div class="battle-modal" id="battleModal">
        <div class="battle-content">
          <h3>Battle in Progress</h3>
          <div class="battle-log" id="battleLog"></div>
          <div class="battle-result" id="battleResult"></div>
          <button class="btn btn-primary" id="closeBattle">Close</button>
        </div>
      </div>
    `;

    // Cache element references
    this.elements = {
      stageIndicator: document.getElementById('stageIndicator'),
      evolutionAnimation: document.getElementById('evolutionAnimation'),
      progressFill: document.getElementById('progressFill'),
      progressText: document.getElementById('progressText'),
      totalMessages: document.getElementById('totalMessages'),
      militaryPower: document.getElementById('militaryPower'),
      defenseLevel: document.getElementById('defenseLevel'),
      territorySize: document.getElementById('territorySize'),
      foodAmount: document.getElementById('foodAmount'),
      materialsAmount: document.getElementById('materialsAmount'),
      populationAmount: document.getElementById('populationAmount'),
      foodBar: document.getElementById('foodBar'),
      materialsBar: document.getElementById('materialsBar'),
      populationBar: document.getElementById('populationBar'),
      chatLog: document.getElementById('chatLog'),
      chatInput: document.getElementById('chatInput'),
      chatStatus: document.getElementById('chatStatus'),
      sendMessage: document.getElementById('sendMessage'),
      battleButton: document.getElementById('battleButton'),
      raidButton: document.getElementById('raidButton'),
      diplomacyButton: document.getElementById('diplomacyButton'),
      autoChatButton: document.getElementById('autoChatButton'),
      demoModeButton: document.getElementById('demoModeButton'),
      stopDemoButton: document.getElementById('stopDemoButton'),
      expandTerritory: document.getElementById('expandTerritory'),
      fortifyDefenses: document.getElementById('fortifyDefenses'),
      territory: document.getElementById('territory'),
      battleModal: document.getElementById('battleModal'),
      battleLog: document.getElementById('battleLog'),
      battleResult: document.getElementById('battleResult'),
      closeBattle: document.getElementById('closeBattle'),
      notification: document.getElementById('notification')
    };
  }

  bindEvents() {
    this.elements.sendMessage.addEventListener('click', () => this.sendMessage());
    this.elements.chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
    this.elements.battleButton.addEventListener('click', () => this.startBattle());
    this.elements.raidButton.addEventListener('click', () => this.startRaid());
    this.elements.diplomacyButton.addEventListener('click', () => this.startDiplomacy());
    this.elements.autoChatButton.addEventListener('click', () => this.toggleAutoChat());
    this.elements.demoModeButton.addEventListener('click', () => this.toggleDemoMode());
    this.elements.stopDemoButton.addEventListener('click', () => this.stopDemoMode());
    this.elements.expandTerritory.addEventListener('click', () => this.expandTerritory());
    this.elements.fortifyDefenses.addEventListener('click', () => this.fortifyDefenses());
    this.elements.closeBattle.addEventListener('click', () => this.closeBattle());
  }

  sendMessage() {
    const message = this.elements.chatInput.value.trim();
    if (!message) return;

    this.addMessage(message, 'user');
    this.elements.chatInput.value = '';
    this.updateProgress();
    this.checkForEvolution();
    this.updateDecayTimer();
  }

  addMessage(content, sender = 'user') {
    this.totalMessages++;
    this.chatMinutes += Math.random() * 2 + 0.5;
    this.lastMessageTime = Date.now();
    
    const message = {
      content,
      sender,
      timestamp: new Date().toLocaleTimeString(),
      id: Date.now()
    };
    
    this.messageHistory.push(message);
    
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${sender}`;
    messageElement.innerHTML = `
      <div class="message-time">${message.timestamp}</div>
      <div class="message-content">${message.content}</div>
    `;
    
    this.elements.chatLog.appendChild(messageElement);
    this.elements.chatLog.scrollTop = this.elements.chatLog.scrollHeight;
    
    // Check for one-sided conversation
    this.checkConversationBalance();
  }

  checkConversationBalance() {
    const recentMessages = this.messageHistory.slice(-10);
    const userMessages = recentMessages.filter(m => m.sender === 'user').length;
    const partnerMessages = recentMessages.filter(m => m.sender === 'partner').length;
    
    if (recentMessages.length >= 10) {
      const ratio = Math.max(userMessages, partnerMessages) / Math.min(userMessages, partnerMessages);
      if (ratio > 3) {
        this.triggerDecay('One-sided conversation detected! Your civilization is weakening due to lack of mutual engagement.');
      }
    }
  }

  startDecayTimer() {
    this.decayTimer = setInterval(() => {
      const timeSinceLastMessage = Date.now() - this.lastMessageTime;
      const decayThreshold = 5 * 60 * 1000; // 5 minutes
      
      if (timeSinceLastMessage > decayThreshold && !this.isDecaying) {
        this.triggerDecay('Your civilization is decaying due to lack of communication!');
      }
    }, 30000); // Check every 30 seconds
  }

  triggerDecay(message) {
    this.isDecaying = true;
    this.elements.chatStatus.textContent = message;
    this.elements.chatStatus.style.color = '#b84c4c';
    
    // Reduce resources and military power
    this.resources.food = Math.max(0, this.resources.food - 10);
    this.resources.materials = Math.max(0, this.resources.materials - 5);
    this.militaryPower = Math.max(1, this.militaryPower - 2);
    
    // Check for civilization collapse
    if (this.resources.food <= 0 || this.resources.population <= 0) {
      this.collapseCivilization();
    }
    
    this.updateDisplay();
  }

  updateDecayTimer() {
    this.isDecaying = false;
    this.elements.chatStatus.textContent = 'Civilization thriving!';
    this.elements.chatStatus.style.color = '#7dcd85';
  }

  collapseCivilization() {
    this.showNotification('Your civilization has collapsed! Insufficient resources and communication led to the fall of your nation. Start over to rebuild!', 'error');
    this.resetCivilization();
  }

  startBattle() {
    const enemyPower = Math.floor(this.militaryPower * (0.8 + Math.random() * 0.4));
    const battleResult = this.simulateBattle(enemyPower);
    
    this.elements.battleModal.style.display = 'flex';
    this.elements.battleLog.innerHTML = '';
    this.elements.battleResult.innerHTML = '';
    
    this.animateBattle(enemyPower, battleResult);
  }

  simulateBattle(enemyPower) {
    const playerPower = this.militaryPower;
    const totalPower = playerPower + enemyPower;
    const playerChance = playerPower / totalPower;
    
    const isVictory = Math.random() < playerChance;
    const damage = Math.floor(Math.random() * 20) + 10;
    
    if (isVictory) {
      this.resources.food += damage * 2;
      this.resources.materials += damage;
      this.militaryPower += Math.floor(damage / 5);
      return { victory: true, damage, rewards: { food: damage * 2, materials: damage } };
    } else {
      this.resources.food = Math.max(0, this.resources.food - damage);
      this.resources.population = Math.max(0, this.resources.population - Math.floor(damage / 2));
      this.militaryPower = Math.max(1, this.militaryPower - Math.floor(damage / 10));
      return { victory: false, damage, losses: { food: damage, population: Math.floor(damage / 2) } };
    }
  }

  animateBattle(enemyPower, result) {
    const battleLog = this.elements.battleLog;
    const battleResult = this.elements.battleResult;
    
    const messages = [
      `Enemy army approaches with ${enemyPower} military power!`,
      `Your army of ${this.militaryPower} prepares for battle...`,
      'The battle rages on...',
      'Swords clash and arrows fly!',
      result.victory ? 'Victory is yours!' : 'Your army is defeated!'
    ];
    
    let messageIndex = 0;
    const showNextMessage = () => {
      if (messageIndex < messages.length) {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = messages[messageIndex];
        messageDiv.className = 'battle-message';
        battleLog.appendChild(messageDiv);
        messageIndex++;
        setTimeout(showNextMessage, 1000);
      } else {
        this.showBattleResult(result);
      }
    };
    
    showNextMessage();
  }

  showBattleResult(result) {
    const battleResult = this.elements.battleResult;
    
    if (result.victory) {
      battleResult.innerHTML = `
        <div class="battle-victory">
          <h4>Victory! 🏆</h4>
          <p>Your army defeated the enemy!</p>
          <p>Gained: ${result.rewards.food} food, ${result.rewards.materials} materials</p>
        </div>
      `;
    } else {
      battleResult.innerHTML = `
        <div class="battle-defeat">
          <h4>Defeat! 💀</h4>
          <p>Your army was defeated!</p>
          <p>Lost: ${result.losses.food} food, ${result.losses.population} population</p>
        </div>
      `;
    }
    
    this.updateDisplay();
  }

  startRaid() {
    if (this.resources.materials < 50) {
      alert('Not enough materials to conduct a raid!');
      return;
    }
    
    this.resources.materials -= 50;
    const raidSuccess = Math.random() < 0.7;
    
    if (raidSuccess) {
      const loot = Math.floor(Math.random() * 100) + 50;
      this.resources.food += loot;
      this.resources.materials += Math.floor(loot / 2);
      alert(`Raid successful! Gained ${loot} food and ${Math.floor(loot / 2)} materials!`);
    } else {
      const losses = Math.floor(Math.random() * 20) + 10;
      this.resources.population = Math.max(0, this.resources.population - losses);
      alert(`Raid failed! Lost ${losses} population in the attempt.`);
    }
    
    this.updateDisplay();
  }

  startDiplomacy() {
    const diplomacyOptions = [
      'Trade Agreement (+50 materials, -30 food)',
      'Peace Treaty (+100 food, +50 materials)',
      'Military Alliance (+25 military power)',
      'Cultural Exchange (+20 population)'
    ];
    
    const choice = Math.floor(Math.random() * diplomacyOptions.length);
    const option = diplomacyOptions[choice];
    
    switch (choice) {
      case 0:
        this.resources.materials += 50;
        this.resources.food = Math.max(0, this.resources.food - 30);
        break;
      case 1:
        this.resources.food += 100;
        this.resources.materials += 50;
        break;
      case 2:
        this.militaryPower += 25;
        break;
      case 3:
        this.resources.population += 20;
        break;
    }
    
    alert(`Diplomacy successful! ${option}`);
    this.updateDisplay();
  }

  expandTerritory() {
    if (this.resources.materials < 100) {
      this.showNotification('Not enough materials to expand territory!', 'error');
      return;
    }
    
    this.resources.materials -= 100;
    this.territory.size++;
    this.resources.population += 10;
    this.resources.food += 50;
    
    this.showNotification('Territory expanded! Gained 10 population and 50 food!', 'success');
    this.updateDisplay();
  }

  fortifyDefenses() {
    if (this.resources.materials < 75) {
      this.showNotification('Not enough materials to fortify defenses!', 'error');
      return;
    }
    
    this.resources.materials -= 75;
    this.defenseLevel++;
    this.militaryPower += 15;
    
    this.showNotification('Defenses fortified! Military power increased by 15!', 'success');
    this.updateDisplay();
  }

  checkForEvolution() {
    const currentStageData = this.stages[this.currentStage];
    const nextStageData = this.stages[this.currentStage + 1];
    
    if (nextStageData && this.totalMessages >= nextStageData.messagesRequired) {
      this.evolveToNextStage();
    }
  }

  evolveToNextStage() {
    this.currentStage++;
    const currentStage = this.stages[this.currentStage - 1];
    const nextStage = this.stages[this.currentStage];
    
    // Update resources and military power based on new stage
    this.resources = { ...nextStage.resources };
    this.militaryPower = nextStage.militaryPower;
    
    this.showEvolutionAnimation(currentStage, nextStage);
    this.updateDisplay();
  }

  showEvolutionAnimation(currentStage, nextStage) {
    this.elements.evolutionAnimation.querySelector('#evolutionEmoji').textContent = 
      `${currentStage.emoji} → ${nextStage.emoji}`;
    this.elements.evolutionAnimation.classList.add('show');
    
    setTimeout(() => {
      this.elements.evolutionAnimation.classList.remove('show');
    }, 3000);
  }

  updateProgress() {
    const currentStageData = this.stages[this.currentStage];
    const nextStageData = this.stages[this.currentStage + 1];
    
    if (nextStageData) {
      const progress = Math.min(
        (this.totalMessages - currentStageData.messagesRequired) / 
        (nextStageData.messagesRequired - currentStageData.messagesRequired) * 100,
        100
      );
      this.elements.progressFill.style.width = `${progress}%`;
    } else {
      this.elements.progressFill.style.width = '100%';
    }
  }

  updateDisplay() {
    const currentStageData = this.stages[this.currentStage];
    const nextStageData = this.stages[this.currentStage + 1];
    
    // Update stage indicator
    this.elements.stageIndicator.textContent = `Stage: ${currentStageData.name}`;
    
    // Update stats
    this.elements.totalMessages.textContent = this.totalMessages;
    this.elements.militaryPower.textContent = this.militaryPower;
    this.elements.defenseLevel.textContent = this.defenseLevel;
    this.elements.territorySize.textContent = this.territory.size;
    
    // Update resources
    this.elements.foodAmount.textContent = this.resources.food;
    this.elements.materialsAmount.textContent = this.resources.materials;
    this.elements.populationAmount.textContent = this.resources.population;
    
    // Update resource bars
    const maxResources = 1000;
    this.elements.foodBar.style.width = `${Math.min((this.resources.food / maxResources) * 100, 100)}%`;
    this.elements.materialsBar.style.width = `${Math.min((this.resources.materials / maxResources) * 100, 100)}%`;
    this.elements.populationBar.style.width = `${Math.min((this.resources.population / maxResources) * 100, 100)}%`;
    
    // Update territory visual
    this.elements.territory.style.width = `${20 + this.territory.size * 10}px`;
    this.elements.territory.style.height = `${20 + this.territory.size * 10}px`;
    
    // Update progress
    this.updateProgress();
    
    // Update progress text
    if (nextStageData) {
      this.elements.progressText.textContent = 
        `Progress to ${nextStageData.name}: ${this.totalMessages}/${nextStageData.messagesRequired} messages`;
    } else {
      this.elements.progressText.textContent = "Maximum civilization level reached! 🌟";
    }
  }

  toggleAutoChat() {
    if (this.autoChatInterval) {
      clearInterval(this.autoChatInterval);
      this.autoChatInterval = null;
      this.elements.autoChatButton.textContent = 'Auto Chat';
      this.elements.autoChatButton.classList.remove('btn-primary');
      this.elements.autoChatButton.classList.add('btn-secondary');
    } else {
      const autoMessages = [
        "Let's build something amazing together!",
        "I love how our civilization is growing!",
        "What should we focus on next?",
        "This is so much fun!",
        "Our nation is getting stronger!",
        "I'm excited about our progress!",
        "We make a great team!",
        "Let's keep building together!",
        "Our civilization is thriving!",
        "I love this concept!"
      ];
      
      this.autoChatInterval = setInterval(() => {
        const message = autoMessages[Math.floor(Math.random() * autoMessages.length)];
        this.addMessage(message, 'partner');
      }, 8000);
      
      this.elements.autoChatButton.textContent = 'Stop Auto Chat';
      this.elements.autoChatButton.classList.remove('btn-secondary');
      this.elements.autoChatButton.classList.add('btn-primary');
    }
  }

  closeBattle() {
    this.elements.battleModal.style.display = 'none';
  }

  showNotification(message, type = 'info') {
    this.elements.notification.textContent = message;
    this.elements.notification.className = `notification ${type} show`;
    setTimeout(() => {
      this.elements.notification.classList.remove('show');
    }, 3000);
  }

  resetCivilization() {
    this.currentStage = 0;
    this.totalMessages = 0;
    this.chatMinutes = 0;
    this.resources = { food: 50, materials: 30, population: 20 };
    this.militaryPower = 10;
    this.defenseLevel = 1;
    this.territory = { x: 0, y: 0, size: 1 };
    this.messageHistory = [];
    this.isDecaying = false;
    
    if (this.autoChatInterval) {
      clearInterval(this.autoChatInterval);
      this.autoChatInterval = null;
      this.elements.autoChatButton.textContent = 'Auto Chat';
      this.elements.autoChatButton.classList.remove('btn-primary');
      this.elements.autoChatButton.classList.add('btn-secondary');
    }
    
    this.elements.chatLog.innerHTML = `
      <div class="chat-message system">
        <div class="message-time">System</div>
        <div class="message-content">Civilization reset! Start fresh and build your nation from the beginning.</div>
      </div>
    `;
    
    this.updateDisplay();
  }

  // Chatbot integration methods
  initializeChatbot() {
    if (typeof NationshipChatbot !== 'undefined') {
      this.chatbot = new NationshipChatbot(this);
      console.log('Chatbot initialized for demo mode');
    } else {
      console.warn('NationshipChatbot not available - demo mode disabled');
    }
  }

  toggleDemoMode() {
    if (this.chatbot) {
      this.chatbot.startAutoDemo();
      this.elements.demoModeButton.style.display = 'none';
      this.elements.stopDemoButton.style.display = 'inline-block';
      this.elements.autoChatButton.disabled = true;
      console.log('Demo mode activated');
    }
  }

  stopDemoMode() {
    if (this.chatbot) {
      this.chatbot.stopDemo();
      this.elements.demoModeButton.style.display = 'inline-block';
      this.elements.stopDemoButton.style.display = 'none';
      this.elements.autoChatButton.disabled = false;
      console.log('Demo mode deactivated');
    }
  }

  // Override battle methods to notify chatbot
  startBattle() {
    const enemyPower = Math.floor(this.militaryPower * (0.8 + Math.random() * 0.4));
    const battleResult = this.simulateBattle(enemyPower);
    
    this.elements.battleModal.style.display = 'flex';
    this.elements.battleLog.innerHTML = '';
    this.elements.battleResult.innerHTML = '';
    
    this.animateBattle(enemyPower, battleResult);
    
    // Notify chatbot of battle result
    if (this.chatbot) {
      this.chatbot.onBattleResult(battleResult.victory, battleResult.rewards);
    }
  }

  startRaid() {
    if (this.resources.materials < 50) {
      this.showNotification('Not enough materials to conduct a raid!', 'error');
      return;
    }
    
    this.resources.materials -= 50;
    const raidSuccess = Math.random() < 0.7;
    
    if (raidSuccess) {
      const loot = Math.floor(Math.random() * 100) + 50;
      this.resources.food += loot;
      this.resources.materials += Math.floor(loot / 2);
      this.showNotification(`Raid successful! Gained ${loot} food and ${Math.floor(loot / 2)} materials!`, 'success');
    } else {
      const losses = Math.floor(Math.random() * 20) + 10;
      this.resources.population = Math.max(0, this.resources.population - losses);
      this.showNotification(`Raid failed! Lost ${losses} population in the attempt.`, 'error');
    }
    
    this.updateDisplay();
    
    // Notify chatbot of raid result
    if (this.chatbot) {
      this.chatbot.onRaidResult(raidSuccess, loot);
    }
  }

  startDiplomacy() {
    const diplomacyOptions = [
      'Trade Agreement (+50 materials, -30 food)',
      'Peace Treaty (+100 food, +50 materials)',
      'Military Alliance (+25 military power)',
      'Cultural Exchange (+20 population)'
    ];
    
    const choice = Math.floor(Math.random() * diplomacyOptions.length);
    const option = diplomacyOptions[choice];
    
    switch (choice) {
      case 0:
        this.resources.materials += 50;
        this.resources.food = Math.max(0, this.resources.food - 30);
        break;
      case 1:
        this.resources.food += 100;
        this.resources.materials += 50;
        break;
      case 2:
        this.militaryPower += 25;
        break;
      case 3:
        this.resources.population += 20;
        break;
    }
    
    this.showNotification(`Diplomacy successful! ${option}`, 'success');
    this.updateDisplay();
    
    // Notify chatbot of diplomacy result
    if (this.chatbot) {
      this.chatbot.onDiplomacyResult(true, option);
    }
  }

  // Override evolution method to notify chatbot
  evolveToNextStage() {
    this.currentStage++;
    const currentStage = this.stages[this.currentStage - 1];
    const nextStage = this.stages[this.currentStage];
    
    // Update resources and military power based on new stage
    this.resources = { ...nextStage.resources };
    this.militaryPower = nextStage.militaryPower;
    
    this.showEvolutionAnimation(currentStage, nextStage);
    this.updateDisplay();
    
    // Notify chatbot of stage evolution
    if (this.chatbot) {
      this.chatbot.onStageEvolution(this.currentStage);
    }
  }

  // Override decay method to notify chatbot
  triggerDecay(message) {
    this.isDecaying = true;
    this.elements.chatStatus.textContent = message;
    this.elements.chatStatus.style.color = '#b84c4c';
    
    // Reduce resources and military power
    this.resources.food = Math.max(0, this.resources.food - 10);
    this.resources.materials = Math.max(0, this.resources.materials - 5);
    this.militaryPower = Math.max(1, this.militaryPower - 2);
    
    // Check for civilization collapse
    if (this.resources.food <= 0 || this.resources.population <= 0) {
      this.collapseCivilization();
    }
    
    this.updateDisplay();
    
    // Notify chatbot of decay
    if (this.chatbot) {
      this.chatbot.onDecayWarning();
    }
  }

  // Public API methods
  addChatMessage(message, sender = 'user') {
    this.addMessage(message, sender);
  }

  getCivilizationData() {
    return {
      stage: this.currentStage,
      stageName: this.stages[this.currentStage].name,
      totalMessages: this.totalMessages,
      resources: this.resources,
      militaryPower: this.militaryPower,
      defenseLevel: this.defenseLevel,
      territorySize: this.territory.size
    };
  }

  setCivilizationName(name) {
    this.civilizationName = name;
    this.container.querySelector('.civilization-title').textContent = name;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NationshipCivilization;
}
