/**
 * Profile Survey Integration for Nationship
 * Handles survey loading, validation, and profile creation
 */

class ProfileSurveyIntegration {
  constructor(containerId, onComplete) {
    this.container = document.getElementById(containerId);
    this.onComplete = onComplete;
    this.loadSurvey();
  }

  loadSurvey() {
    this.container.innerHTML = `
      <div class="progress-bar">
        <div class="progress-fill" id="progressFill" style="width: 0%"></div>
      </div>
      <div class="progress-text" id="progressText">Complete the survey to build your profile</div>

      <form class="survey-form" id="surveyForm">
        <!-- Question 1: Name -->
        <div class="question-group">
          <div class="question-title">What's your name?</div>
          <div class="question-description">Let us know what to call you</div>
          <div class="form-group">
            <input type="text" id="name" name="name" placeholder="Enter your name" required>
          </div>
        </div>

        <!-- Question 2: Favorite Color -->
        <div class="question-group">
          <div class="question-title">What is your favourite colour?</div>
          <div class="question-description">Choose the color that best represents you</div>
          <div class="form-group">
            <label for="favoriteColor">Select your favorite color:</label>
            <input type="color" id="favoriteColor" name="favoriteColor" value="#7dcd85">
          </div>
        </div>

        <!-- Question 3: Favorite Animal -->
        <div class="question-group">
          <div class="question-title">What is your favourite animal?</div>
          <div class="question-description">Pick the animal that resonates with your personality</div>
          <div class="form-group">
            <label for="favoriteAnimal">Your favorite animal:</label>
            <select id="favoriteAnimal" name="favoriteAnimal" required>
              <option value="">Select an animal...</option>
              <option value="lion">Lion - Bold and courageous</option>
              <option value="eagle">Eagle - Visionary and free</option>
              <option value="wolf">Wolf - Loyal and protective</option>
              <option value="dolphin">Dolphin - Intelligent and playful</option>
              <option value="elephant">Elephant - Wise and strong</option>
              <option value="butterfly">Butterfly - Transformative and graceful</option>
              <option value="tiger">Tiger - Powerful and independent</option>
              <option value="owl">Owl - Wise and mysterious</option>
              <option value="other">Other (please specify)</option>
            </select>
            <input type="text" id="otherAnimal" name="otherAnimal" placeholder="Specify your favorite animal" style="display: none;">
          </div>
        </div>

        <!-- Question 4: Three Words -->
        <div class="question-group">
          <div class="question-title">If you could describe yourself with three words, what would they be?</div>
          <div class="question-description">Share three words that best capture your essence</div>
          <div class="form-group">
            <input type="text" id="threeWords" name="threeWords" placeholder="e.g., creative, adventurous, kind" required>
          </div>
        </div>

        <!-- Question 5: Ideal Vacation Spot -->
        <div class="question-group">
          <div class="question-title">Where is your ideal vacation spot?</div>
          <div class="question-description">Describe your dream destination</div>
          <div class="form-group">
            <textarea id="vacationSpot" name="vacationSpot" placeholder="Describe your perfect vacation destination..." required></textarea>
          </div>
        </div>

        <!-- Question 6: Nationalism -->
        <div class="question-group">
          <div class="question-title">Do you have a strong sense of nationalism?</div>
          <div class="question-description">Rate your level of national pride and identity</div>
          <div class="form-group">
            <div class="scale-group">
              <div class="scale-labels">
                <span>Not at all</span>
                <span>Very strong</span>
              </div>
              <input type="range" class="scale-slider" id="nationalism" name="nationalism" min="1" max="5" value="3">
              <div style="text-align: center; font-size: 14px; color: var(--olive-slate);">
                <span id="nationalismValue">3 - Moderate</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Question 7: Right vs Creative -->
        <div class="question-group">
          <div class="question-title">What is more important, doing something you know is right or being creative?</div>
          <div class="question-description">Choose which value you prioritize more</div>
          <div class="form-group">
            <div class="radio-group">
              <div class="radio-option">
                <input type="radio" id="rightChoice" name="rightVsCreative" value="right">
                <label for="rightChoice">Doing something I know is right</label>
              </div>
              <div class="radio-option">
                <input type="radio" id="creativeChoice" name="rightVsCreative" value="creative">
                <label for="creativeChoice">Being creative</label>
              </div>
              <div class="radio-option">
                <input type="radio" id="bothChoice" name="rightVsCreative" value="both">
                <label for="bothChoice">Both are equally important</label>
              </div>
            </div>
          </div>
        </div>

        <!-- Question 8: Welfare Support -->
        <div class="question-group">
          <div class="question-title">Should we allow welfares?</div>
          <div class="question-description">Share your thoughts on social welfare programs</div>
          <div class="form-group">
            <div class="radio-group">
              <div class="radio-option">
                <input type="radio" id="welfareYes" name="welfareSupport" value="yes">
                <label for="welfareYes">Yes, welfare programs are essential</label>
              </div>
              <div class="radio-option">
                <input type="radio" id="welfareNo" name="welfareSupport" value="no">
                <label for="welfareNo">No, welfare creates dependency</label>
              </div>
              <div class="radio-option">
                <input type="radio" id="welfareConditional" name="welfareSupport" value="conditional">
                <label for="welfareConditional">Yes, but with conditions and limits</label>
              </div>
              <div class="radio-option">
                <input type="radio" id="welfareUnsure" name="welfareSupport" value="unsure">
                <label for="welfareUnsure">I'm not sure</label>
              </div>
            </div>
          </div>
        </div>

        <!-- Question 9: Deserving People -->
        <div class="question-group">
          <div class="question-title">Are some people more deserving than others?</div>
          <div class="question-description">Share your perspective on equality and merit</div>
          <div class="form-group">
            <div class="scale-group">
              <div class="scale-labels">
                <span>Everyone is equal</span>
                <span>Some are more deserving</span>
              </div>
              <input type="range" class="scale-slider" id="deserving" name="deserving" min="1" max="5" value="3">
              <div style="text-align: center; font-size: 14px; color: var(--olive-slate);">
                <span id="deservingValue">3 - Balanced view</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Question 10: Political Leanings -->
        <div class="question-group">
          <div class="question-title">Are you left leaning or right leaning?</div>
          <div class="question-description">Indicate your general political orientation</div>
          <div class="form-group">
            <div class="scale-group">
              <div class="scale-labels">
                <span>Left leaning</span>
                <span>Right leaning</span>
              </div>
              <input type="range" class="scale-slider" id="politicalLean" name="politicalLean" min="1" max="5" value="3">
              <div style="text-align: center; font-size: 14px; color: var(--olive-slate);">
                <span id="politicalValue">3 - Centrist</span>
              </div>
            </div>
          </div>
        </div>

        <div class="actions">
          <button type="button" class="btn btn-secondary" id="saveDraft">Save Draft</button>
          <button type="submit" class="btn btn-primary" id="submitSurvey">Complete Profile</button>
        </div>
      </form>
    `;

    this.initializeSurvey();
  }

  initializeSurvey() {
    const form = document.getElementById('surveyForm');
    const otherAnimalInput = document.getElementById('otherAnimal');
    const favoriteAnimalSelect = document.getElementById('favoriteAnimal');

    // Handle animal selection
    favoriteAnimalSelect.addEventListener('change', (e) => {
      if (e.target.value === 'other') {
        otherAnimalInput.style.display = 'block';
        otherAnimalInput.required = true;
      } else {
        otherAnimalInput.style.display = 'none';
        otherAnimalInput.required = false;
      }
    });

    // Handle scale sliders
    const sliders = ['nationalism', 'deserving', 'politicalLean'];
    sliders.forEach(sliderId => {
      const slider = document.getElementById(sliderId);
      const valueDisplay = document.getElementById(sliderId + 'Value');
      
      slider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        this.updateSliderDisplay(sliderId, value, valueDisplay);
      });
    });

    // Handle form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitSurvey();
    });

    // Handle save draft
    document.getElementById('saveDraft').addEventListener('click', () => {
      this.saveDraft();
    });

    // Update progress on form changes
    form.addEventListener('input', () => {
      this.updateProgress();
    });

    // Load draft if exists
    this.loadDraft();
  }

  updateSliderDisplay(sliderId, value, displayElement) {
    const labels = {
      nationalism: ['1 - Not at all', '2 - Slightly', '3 - Moderate', '4 - Strong', '5 - Very strong'],
      deserving: ['1 - Everyone equal', '2 - Mostly equal', '3 - Balanced view', '4 - Some more deserving', '5 - Clearly different'],
      politicalLean: ['1 - Left leaning', '2 - Center-left', '3 - Centrist', '4 - Center-right', '5 - Right leaning']
    };
    
    displayElement.textContent = labels[sliderId][value - 1];
  }

  updateProgress() {
    const form = document.getElementById('surveyForm');
    const formData = new FormData(form);
    const totalQuestions = 10;
    let completedQuestions = 0;

    // Check each question for completion
    const requiredFields = [
      'name', 'favoriteColor', 'favoriteAnimal', 'threeWords', 'vacationSpot',
      'nationalism', 'rightVsCreative', 'welfareSupport', 'deserving', 'politicalLean'
    ];

    requiredFields.forEach(field => {
      const value = formData.get(field);
      if (value && value.trim() !== '') {
        completedQuestions++;
      }
    });

    const progress = (completedQuestions / totalQuestions) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('progressText').textContent = `${completedQuestions}/${totalQuestions} questions completed`;
  }

  saveDraft() {
    const formData = this.collectFormData();
    localStorage.setItem('surveyDraft', JSON.stringify(formData));
    this.showToast('Draft saved successfully!', 'success');
  }

  loadDraft() {
    const draft = localStorage.getItem('surveyDraft');
    if (draft) {
      const data = JSON.parse(draft);
      this.populateForm(data);
      this.showToast('Draft loaded successfully!', 'success');
    }
  }

  populateForm(data) {
    Object.keys(data).forEach(key => {
      const element = document.querySelector(`[name="${key}"]`);
      if (element) {
        if (element.type === 'radio') {
          const radio = document.querySelector(`[name="${key}"][value="${data[key]}"]`);
          if (radio) radio.checked = true;
        } else {
          element.value = data[key];
        }
      }
    });
    this.updateProgress();
  }

  collectFormData() {
    const form = document.getElementById('surveyForm');
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }

    // Handle other animal input
    if (data.favoriteAnimal === 'other' && data.otherAnimal) {
      data.favoriteAnimal = data.otherAnimal;
    }

    return data;
  }

  async submitSurvey() {
    const formData = this.collectFormData();
    
    // Validate required fields
    if (!this.validateSurvey(formData)) {
      return;
    }

    try {
      // Generate a unique user ID for demo purposes
      const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      // Create profile data from survey
      const profileData = {
        userId: userId,
        name: formData.name,
        bio: `${formData.threeWords} | ${formData.vacationSpot}`,
        activities: `${formData.favoriteAnimal} enthusiast, ${formData.favoriteColor} lover`,
        goals: `Find someone who shares my ${formData.rightVsCreative === 'right' ? 'moral' : 'creative'} values`,
        values: `Nationalism: ${formData.nationalism}/5, Welfare: ${formData.welfareSupport}, Political: ${formData.politicalLean}/5`,
        surveyData: formData,
        created: new Date().toISOString()
      };
      
      // Simulate API call delay for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store profile data in localStorage
      localStorage.setItem('nationship_profile', JSON.stringify(profileData));
      
      // Clear draft
      localStorage.removeItem('surveyDraft');
      
      // Call completion callback
      if (this.onComplete) {
        this.onComplete(profileData);
      }
      
    } catch (err) {
      this.showToast('Profile creation failed. Please try again.', 'error');
      console.error('Error creating profile:', err);
    }
  }

  validateSurvey(data) {
    const requiredFields = ['name', 'favoriteAnimal', 'threeWords', 'vacationSpot', 'rightVsCreative', 'welfareSupport'];
    
    for (let field of requiredFields) {
      if (!data[field] || data[field].trim() === '') {
        this.showToast(`Please complete the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} question.`, 'error');
        return false;
      }
    }
    
    return true;
  }

  showToast(message, type = 'info') {
    // Create a simple toast notification
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: ${type === 'success' ? 'rgba(125, 205, 133, 0.95)' : 'rgba(36, 49, 25, 0.95)'};
      color: ${type === 'success' ? 'var(--deep-forest)' : 'white'};
      padding: 12px 24px;
      border-radius: 12px;
      font-size: 14px;
      z-index: 1000;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
      toast.style.opacity = '1';
    }, 100);
    
    // Hide toast
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProfileSurveyIntegration;
}
