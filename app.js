// DefectAI Pro Application JavaScript

class DefectAIApp {
  constructor() {
    this.sampleAnalyses = [
      {
        id: 1,
        timestamp: "2025-09-29T10:30:00Z",
        defectType: "Surface Scratch",
        confidence: 94,
        action: "Approved",
        processingTime: "2.3s",
        customerEmail: "customer1@email.com"
      },
      {
        id: 2,
        timestamp: "2025-09-29T09:15:00Z", 
        defectType: "Crack Detected",
        confidence: 98,
        action: "Approved",
        processingTime: "1.8s",
        customerEmail: "customer2@email.com"
      },
      {
        id: 3,
        timestamp: "2025-09-29T08:45:00Z",
        defectType: "No Defect Found",
        confidence: 89,
        action: "Denied",
        processingTime: "2.1s",
        customerEmail: "customer3@email.com"
      }
    ];

    this.metrics = {
      totalProcessed: 1247,
      accuracyRate: 94.2,
      avgProcessingTime: 2.1,
      costSavings: 78.5,
      customerSatisfaction: 91.3
    };

    this.defectTypes = [
      "Surface Scratch",
      "Crack Detected", 
      "Discoloration",
      "Missing Component",
      "Dent/Deformation",
      "No Defect Found"
    ];

    this.currentAnalysis = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.populateDashboard();
    this.initFileUpload();
  }

  setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
    });

    // File input change
    document.getElementById('fileInput').addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        this.handleFileSelect(e.target.files[0]);
      }
    });

    // Remove image button
    document.getElementById('removeImage').addEventListener('click', () => {
      this.resetUpload();
    });

    // Action buttons
    document.getElementById('analyzeAnother').addEventListener('click', () => {
      this.resetUpload();
    });

    document.getElementById('viewDashboard').addEventListener('click', () => {
      this.switchTab('dashboard');
    });
  }

  initFileUpload() {
    const uploadArea = document.getElementById('uploadArea');

    // Drag and drop events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      uploadArea.addEventListener(eventName, this.preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      uploadArea.addEventListener(eventName, () => {
        uploadArea.classList.add('dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      uploadArea.addEventListener(eventName, () => {
        uploadArea.classList.remove('dragover');
      }, false);
    });

    uploadArea.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      if (files.length > 0 && files[0].type.startsWith('image/')) {
        this.handleFileSelect(files[0]);
      }
    });

    // Click to upload
    uploadArea.addEventListener('click', () => {
      document.getElementById('fileInput').click();
    });
  }

  preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
  }

  handleFileSelect(file) {
    // Validate file
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WebP)');
      return;
    }
    
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('File size too large. Please select an image under 10MB.');
      return;
    }

    // Show image preview
    const preview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImage');
    const uploadArea = document.getElementById('uploadArea');

    const reader = new FileReader();
    reader.onload = (e) => {
      previewImg.src = e.target.result;
      preview.classList.remove('hidden');
      uploadArea.classList.add('hidden');
      
      // Start analysis after a short delay
      setTimeout(() => this.startAnalysis(), 1000);
    };
    reader.readAsDataURL(file);
  }

  async startAnalysis() {
    const processingSection = document.getElementById('processingSection');
    const resultsSection = document.getElementById('resultsSection');
    
    // Hide results and show processing
    resultsSection.classList.add('hidden');
    processingSection.classList.remove('hidden');

    // Reset all processing elements
    document.getElementById('progressFill').style.width = '0%';
    document.querySelectorAll('.step').forEach(step => {
      step.classList.remove('processing', 'completed');
      step.querySelector('.step-status').textContent = '⏳';
    });

    // Generate analysis result first
    this.currentAnalysis = this.generateAnalysisResult();

    // Processing steps with realistic timing
    const steps = [
      { id: 'step1', text: 'Analyzing image quality...', duration: 800 },
      { id: 'step2', text: 'Running AI defect detection...', duration: 1200 },
      { id: 'step3', text: 'Evaluating quality metrics...', duration: 600 },
      { id: 'step4', text: 'Generating recommendation...', duration: 400 }
    ];

    let totalProgress = 0;
    const progressPerStep = 100 / steps.length;

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      
      // Mark current step as processing
      const stepElement = document.getElementById(step.id);
      stepElement.classList.add('processing');
      document.getElementById('processingText').textContent = step.text;
      
      // Update progress
      totalProgress += progressPerStep;
      document.getElementById('progressFill').style.width = `${totalProgress}%`;
      
      // Wait for step duration
      await this.sleep(step.duration);
      
      // Mark step as completed
      stepElement.classList.remove('processing');
      stepElement.classList.add('completed');
      stepElement.querySelector('.step-status').textContent = '✅';
    }

    // Final processing text
    document.getElementById('processingText').textContent = 'Analysis complete!';
    
    // Wait a bit then show results
    await this.sleep(800);
    this.showResults();
  }

  showResults() {
    console.log('Showing results:', this.currentAnalysis); // Debug log
    
    const processingSection = document.getElementById('processingSection');
    const resultsSection = document.getElementById('resultsSection');
    
    // Ensure we have analysis results
    if (!this.currentAnalysis) {
      console.error('No analysis results available');
      this.currentAnalysis = this.generateAnalysisResult();
    }
    
    // Hide processing and show results
    processingSection.classList.add('hidden');
    resultsSection.classList.remove('hidden');
    
    // Populate results with error checking
    const defectTypeEl = document.getElementById('defectType');
    const confidenceScoreEl = document.getElementById('confidenceScore');
    const processingTimeEl = document.getElementById('processingTime');
    const recommendationEl = document.getElementById('recommendation');
    const statusElement = document.getElementById('resultStatus');
    
    if (defectTypeEl) defectTypeEl.textContent = this.currentAnalysis.defectType;
    if (confidenceScoreEl) confidenceScoreEl.textContent = `${this.currentAnalysis.confidence}%`;
    if (processingTimeEl) processingTimeEl.textContent = this.currentAnalysis.processingTime;
    if (recommendationEl) recommendationEl.textContent = this.currentAnalysis.action;
    
    // Set status styling
    if (statusElement) {
      statusElement.textContent = this.currentAnalysis.action;
      statusElement.className = `result-status ${this.currentAnalysis.action.toLowerCase()}`;
    }
    
    // Add to sample data for dashboard
    const newAnalysis = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...this.currentAnalysis,
      customerEmail: `customer${Math.floor(Math.random() * 1000)}@email.com`
    };
    
    this.sampleAnalyses.unshift(newAnalysis);
    if (this.sampleAnalyses.length > 10) {
      this.sampleAnalyses.pop();
    }
    
    // Update metrics
    this.metrics.totalProcessed += 1;
    
    // Refresh dashboard
    this.populateDashboard();
    
    console.log('Results displayed successfully'); // Debug log
  }

  generateAnalysisResult() {
    const defectType = this.defectTypes[Math.floor(Math.random() * this.defectTypes.length)];
    const isDefectFound = defectType !== "No Defect Found";
    
    // More realistic confidence scores
    const confidence = isDefectFound 
      ? Math.floor(Math.random() * 15) + 85  // 85-99% for defects
      : Math.floor(Math.random() * 20) + 80; // 80-99% for no defects
    
    // Action based on defect type and confidence
    let action;
    if (defectType === "No Defect Found") {
      action = confidence > 85 ? "Denied" : "Escalate";
    } else if (defectType === "Surface Scratch" && confidence > 90) {
      action = "Approved";
    } else if (defectType === "Crack Detected" && confidence > 88) {
      action = "Approved";
    } else if (confidence > 92) {
      action = "Approved";
    } else if (confidence < 85) {
      action = "Escalate";
    } else {
      action = Math.random() > 0.7 ? "Approved" : "Escalate";
    }
    
    const processingTime = `${(Math.random() * 2 + 1).toFixed(1)}s`;
    
    return {
      defectType,
      confidence,
      action,
      processingTime
    };
  }

  populateDashboard() {
    // Update metrics
    const totalProcessedEl = document.getElementById('totalProcessed');
    const accuracyRateEl = document.getElementById('accuracyRate');
    const avgProcessingTimeEl = document.getElementById('avgProcessingTime');
    const costSavingsEl = document.getElementById('costSavings');
    
    if (totalProcessedEl) totalProcessedEl.textContent = this.metrics.totalProcessed.toLocaleString();
    if (accuracyRateEl) accuracyRateEl.textContent = `${this.metrics.accuracyRate}%`;
    if (avgProcessingTimeEl) avgProcessingTimeEl.textContent = `${this.metrics.avgProcessingTime}s`;
    if (costSavingsEl) costSavingsEl.textContent = `${this.metrics.costSavings}%`;
    
    // Populate submissions table
    const tableBody = document.getElementById('submissionsTable');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    this.sampleAnalyses.forEach(analysis => {
      const row = document.createElement('div');
      row.className = 'table-row';
      
      const timestamp = new Date(analysis.timestamp).toLocaleString();
      const actionClass = analysis.action.toLowerCase();
      
      row.innerHTML = `
        <div>${timestamp}</div>
        <div>${analysis.defectType}</div>
        <div>${analysis.confidence}%</div>
        <div><span class="submission-action ${actionClass}">${analysis.action}</span></div>
        <div>${analysis.processingTime}</div>
      `;
      
      tableBody.appendChild(row);
    });
  }

  resetUpload() {
    // Hide all sections except upload
    document.getElementById('imagePreview').classList.add('hidden');
    document.getElementById('processingSection').classList.add('hidden');
    document.getElementById('resultsSection').classList.add('hidden');
    document.getElementById('uploadArea').classList.remove('hidden');
    
    // Reset file input
    document.getElementById('fileInput').value = '';
    
    // Clear preview image
    document.getElementById('previewImage').src = '';
    
    // Clear current analysis
    this.currentAnalysis = null;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new DefectAIApp();
});

// Add some additional interactive enhancements
document.addEventListener('DOMContentLoaded', () => {
  // Smooth scrolling for better UX
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add loading state to buttons
  document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function() {
      // Skip if it's a tab or special button
      if (this.classList.contains('nav-tab') || 
          this.id === 'analyzeAnother' || 
          this.id === 'viewDashboard' ||
          this.id === 'removeImage') {
        return;
      }
      
      const originalText = this.textContent;
      this.textContent = 'Processing...';
      this.disabled = true;
      
      setTimeout(() => {
        this.textContent = originalText;
        this.disabled = false;
      }, 1500);
    });
  });

  // Add hover effects for metric cards
  document.querySelectorAll('.metric-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-4px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Add keyboard navigation for tabs
  document.addEventListener('keydown', (e) => {
    const tabs = document.querySelectorAll('.nav-tab');
    const activeTab = document.querySelector('.nav-tab.active');
    const currentIndex = Array.from(tabs).indexOf(activeTab);
    
    if (e.key === 'ArrowLeft' && currentIndex > 0) {
      tabs[currentIndex - 1].click();
      tabs[currentIndex - 1].focus();
    } else if (e.key === 'ArrowRight' && currentIndex < tabs.length - 1) {
      tabs[currentIndex + 1].click();
      tabs[currentIndex + 1].focus();
    }
  });

  // Add copy functionality for results
  document.addEventListener('click', (e) => {
    if (e.target.closest('.result-card')) {
      const card = e.target.closest('.result-card');
      const value = card.querySelector('p').textContent;
      
      if (navigator.clipboard) {
        navigator.clipboard.writeText(value).then(() => {
          // Show temporary feedback
          const originalBg = card.style.backgroundColor;
          card.style.backgroundColor = 'var(--color-bg-3)';
          card.style.transition = 'background-color 0.3s ease';
          
          setTimeout(() => {
            card.style.backgroundColor = originalBg;
          }, 1000);
        });
      }
    }
  });
});