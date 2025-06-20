// NotesNest - Enhanced AI Study Assistant with Advanced Animations
// Modern JavaScript implementation with built-in API key, theme support, and image text extraction

class StudyMateApp {
    constructor() {
        this.currentTopic = '';
        this.activeTab = 'notes';
        this.isDarkMode = false;
        this.currentFile = null;
        this.extractedText = '';
        this.isInitialized = false;
        
        // API Configuration - Built-in API key
        this.apiKey = 'AIzaSyANNPi-4NIf32dtFmQC1cg_HoOArebKOFg';
        this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
        
        // DOM Elements
        this.elements = {
            topicInput: document.getElementById('topicInput'),
            searchBtn: document.getElementById('searchBtn'),
            resultsSection: document.getElementById('resultsSection'),
            tabButtons: document.querySelectorAll('.tab-btn'),
            suggestionButtons: document.querySelectorAll('.suggestion-btn'),
            themeToggle: document.getElementById('themeToggle'),
            themeIcon: document.getElementById('themeIcon'),
            loadingOverlay: document.getElementById('loadingOverlay'),
            scrollToTop: document.getElementById('scrollToTop'),
            // File upload elements
            uploadBtn: document.getElementById('uploadBtn'),
            fileInput: document.getElementById('fileInput'),
            filePreview: document.getElementById('filePreview'),
            fileName: document.getElementById('fileName'),
            fileSize: document.getElementById('fileSize'),
            fileIcon: document.getElementById('fileIcon'),
            removeFile: document.getElementById('removeFile'),
            imagePreview: document.getElementById('imagePreview'),
            previewImage: document.getElementById('previewImage'),
            // OCR elements
            ocrStatus: document.getElementById('ocrStatus'),
            ocrText: document.getElementById('ocrText'),
            ocrProgressFill: document.getElementById('ocrProgressFill'),
            ocrProgressPercent: document.getElementById('ocrProgressPercent'),
            // Voice elements
            micBtn: document.getElementById('micBtn'),
            micIcon: document.getElementById('micIcon'),
            voiceStatus: document.getElementById('voiceStatus'),
            stopVoice: document.getElementById('stopVoice')
        };
        
        this.init();
        this.showLoadingScreen();
    }
    
    async showLoadingScreen() {
        // Show loading screen for 2 seconds
        await this.sleep(2000);
        this.elements.loadingOverlay.classList.add('hidden');
        
        // Initialize animations after loading
        await this.sleep(500);
        this.initializeAnimations();
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    init() {
        this.attachEventListeners();
        this.initializeTheme();
        this.initializeVoiceRecognition();
        this.initializeScrollEffects();
        this.initializeIntersectionObserver();
    }
    
    initializeAnimations() {
        // Animate stats counters
        this.animateCounters();
        
        // Add stagger animation to suggestion buttons
        this.staggerAnimation('.suggestion-btn', 0.1);
        
        // Add hover effects to various elements
        this.addHoverEffects();
        
        this.isInitialized = true;
    }
    
    animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000; // 2 seconds
            const start = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function for smooth animation
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = Math.round(target * easeOutQuart);
                
                counter.textContent = current;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            
            requestAnimationFrame(animate);
        });
    }
    
    staggerAnimation(selector, delay) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            element.style.animationDelay = `${index * delay}s`;
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * delay * 1000);
        });
    }
    
    addHoverEffects() {
        // Add ripple effect to buttons
        const buttons = document.querySelectorAll('button, .suggestion-btn');
        buttons.forEach(button => {
            button.addEventListener('click', this.createRippleEffect.bind(this));
        });
    }
    
    createRippleEffect(event) {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 1;
        `;
        
        // Add ripple animation keyframes if not exists
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple {
                    0% {
                        transform: scale(0);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    initializeScrollEffects() {
        let ticking = false;
        
        const updateScrollEffects = () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            // Parallax effect for floating shapes
            const shapes = document.querySelectorAll('.shape');
            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 0.2;
                shape.style.transform = `translateY(${scrolled * speed}px)`;
            });
            
            // Show/hide scroll to top button
            if (scrolled > 300) {
                this.elements.scrollToTop.classList.add('visible');
            } else {
                this.elements.scrollToTop.classList.remove('visible');
            }
            
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        });
        
        // Scroll to top functionality
        this.elements.scrollToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    initializeIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const elementsToObserve = document.querySelectorAll('.search-container, .content-panel, .footer');
        elementsToObserve.forEach(el => observer.observe(el));
    }
    
    initializeTheme() {
        // Check for saved theme preference or default to light mode
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
    }
    
    setTheme(theme) {
        this.isDarkMode = theme === 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update theme toggle icon with animation
        const newIcon = this.isDarkMode ? 'fas fa-moon' : 'fas fa-sun';
        
        // Animate icon change
        this.elements.themeIcon.style.transform = 'scale(0) rotate(180deg)';
        setTimeout(() => {
            this.elements.themeIcon.className = newIcon;
            this.elements.themeIcon.style.transform = 'scale(1) rotate(0deg)';
        }, 150);
        
        // Update body class for theme-specific animations
        document.body.classList.toggle('dark-theme', this.isDarkMode);
        
        // Save theme preference
        localStorage.setItem('theme', theme);
    }
    
    toggleTheme() {
        const newTheme = this.isDarkMode ? 'light' : 'dark';
        this.setTheme(newTheme);
        this.showNotification(`Switched to ${newTheme} mode`, 'info');
        
        // Add theme transition effect
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }
    
    initializeVoiceRecognition() {
        // Voice Recognition (Web Speech API)
        if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
            const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.lang = "en-US";
            this.recognition.continuous = false;
            this.recognition.interimResults = false;

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.animateTextInput(transcript);
                this.stopVoiceRecognition();
                this.showNotification('Voice input captured successfully!', 'success');
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.stopVoiceRecognition();
                this.showNotification('Voice recognition failed. Please try again.', 'error');
            };

            this.recognition.onend = () => {
                this.stopVoiceRecognition();
            };
        } else {
            this.elements.micBtn.disabled = true;
            this.elements.micBtn.title = "Voice recognition not supported in this browser";
            console.log("Voice recognition not supported in this browser.");
        }
    }
    
    animateTextInput(text) {
        const input = this.elements.topicInput;
        const currentText = input.value;
        const newText = currentText ? `${currentText} ${text}` : text;
        
        // Animate typing effect
        let i = currentText.length;
        const typeInterval = setInterval(() => {
            if (i <= newText.length) {
                input.value = newText.substring(0, i);
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, 50);
    }
    
    startVoiceRecognition() {
        try {
            this.recognition.start();
            this.elements.voiceStatus.style.display = "flex";
            this.elements.micIcon.classList.remove("fa-microphone");
            this.elements.micIcon.classList.add("fa-microphone-slash");
            this.elements.micBtn.classList.add("recording");
            
            // Animate voice status appearance
            this.elements.voiceStatus.style.transform = 'translateY(-20px)';
            this.elements.voiceStatus.style.opacity = '0';
            setTimeout(() => {
                this.elements.voiceStatus.style.transition = 'all 0.3s ease';
                this.elements.voiceStatus.style.transform = 'translateY(0)';
                this.elements.voiceStatus.style.opacity = '1';
            }, 10);
            
        } catch (error) {
            console.error('Error starting voice recognition:', error);
            this.showNotification('Failed to start voice recognition', 'error');
        }
    }
    
    stopVoiceRecognition() {
        if (this.recognition) {
            this.recognition.stop();
        }
        
        // Animate voice status disappearance
        this.elements.voiceStatus.style.transform = 'translateY(-20px)';
        this.elements.voiceStatus.style.opacity = '0';
        setTimeout(() => {
            this.elements.voiceStatus.style.display = "none";
            this.elements.voiceStatus.style.transition = '';
        }, 300);
        
        this.elements.micIcon.classList.remove("fa-microphone-slash");
        this.elements.micIcon.classList.add("fa-microphone");
        this.elements.micBtn.classList.remove("recording");
    }
    
    attachEventListeners() {
        // Search functionality
        this.elements.searchBtn.addEventListener('click', () => this.handleSearch());
        this.elements.topicInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });
        
        // Add input animation
        this.elements.topicInput.addEventListener('focus', () => {
            this.elements.topicInput.parentElement.style.transform = 'scale(1.02)';
        });
        
        this.elements.topicInput.addEventListener('blur', () => {
            this.elements.topicInput.parentElement.style.transform = 'scale(1)';
        });
        
        // Tab switching with animation
        this.elements.tabButtons.forEach(button => {
            button.addEventListener('click', () => this.switchTab(button.dataset.tab));
        });
        
        // Suggestion buttons with stagger effect
        this.elements.suggestionButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                this.elements.topicInput.value = button.dataset.topic;
                this.handleSearch();
            });
            
            // Add hover effect
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px) scale(1.05)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0) scale(1)';
            });
        });
        
        // Theme toggle
        this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // File upload functionality
        this.elements.uploadBtn.addEventListener('click', () => {
            this.elements.fileInput.click();
        });
        
        this.elements.fileInput.addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files[0]);
        });
        
        this.elements.removeFile.addEventListener('click', () => {
            this.removeFile();
        });
        
        // Voice recognition
        this.elements.micBtn.addEventListener('click', () => {
            if (this.elements.micBtn.classList.contains('recording')) {
                this.stopVoiceRecognition();
            } else {
                this.startVoiceRecognition();
            }
        });
        
        this.elements.stopVoice.addEventListener('click', () => {
            this.stopVoiceRecognition();
        });
        
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'k':
                        e.preventDefault();
                        this.elements.topicInput.focus();
                        break;
                    case 'd':
                        e.preventDefault();
                        this.toggleTheme();
                        break;
                }
            }
        });
    }
    
    async handleFileUpload(file) {
        if (!file) return;
        
        this.currentFile = file;
        this.extractedText = '';
        
        // Animate file preview appearance
        this.animateFilePreview(file);
        
        // Process image with OCR if it's an image file
        const isImage = file.type.startsWith('image/');
        if (isImage) {
            this.showImagePreview(file);
            await this.processImageWithOCR(file);
        } else {
            this.showNotification('File uploaded. Note: OCR is only available for images.', 'info');
        }
    }
    
    animateFilePreview(file) {
        // Display file info with animation
        this.elements.fileName.textContent = file.name;
        this.elements.fileSize.textContent = (file.size / 1024).toFixed(2) + " KB";
        
        // Set appropriate file icon
        const isImage = file.type.startsWith('image/');
        const isPDF = file.type === 'application/pdf';
        const isDocument = file.type.includes('document') || file.type.includes('text');
        
        if (isImage) {
            this.elements.fileIcon.className = 'fas fa-image file-icon';
        } else if (isPDF) {
            this.elements.fileIcon.className = 'fas fa-file-pdf file-icon';
        } else if (isDocument) {
            this.elements.fileIcon.className = 'fas fa-file-alt file-icon';
        } else {
            this.elements.fileIcon.className = 'fas fa-file file-icon';
        }
        
        // Animate preview appearance
        this.elements.filePreview.style.display = "flex";
        this.elements.filePreview.style.transform = 'translateY(-20px)';
        this.elements.filePreview.style.opacity = '0';
        
        setTimeout(() => {
            this.elements.filePreview.style.transition = 'all 0.3s ease';
            this.elements.filePreview.style.transform = 'translateY(0)';
            this.elements.filePreview.style.opacity = '1';
        }, 10);
    }
    
    showImagePreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.elements.previewImage.src = e.target.result;
            this.elements.imagePreview.style.display = "block";
            
            // Animate image appearance
            this.elements.previewImage.style.transform = 'scale(0)';
            this.elements.previewImage.style.opacity = '0';
            
            setTimeout(() => {
                this.elements.previewImage.style.transition = 'all 0.5s ease';
                this.elements.previewImage.style.transform = 'scale(1)';
                this.elements.previewImage.style.opacity = '1';
            }, 100);
        };
        reader.readAsDataURL(file);
    }
    
    async processImageWithOCR(file) {
        try {
            // Show OCR processing status with animation
            this.showOCRStatus();
            
            // Create Tesseract worker
            const worker = await Tesseract.createWorker('eng', 1, {
                logger: m => {
                    if (m.status === 'recognizing text') {
                        const progress = Math.round(m.progress * 100);
                        this.updateOCRProgress(progress);
                        this.elements.ocrText.textContent = `Extracting text... ${progress}%`;
                    }
                }
            });
            
            this.elements.ocrText.textContent = "Processing image...";
            
            // Perform OCR
            const { data: { text } } = await worker.recognize(file);
            
            // Clean up worker
            await worker.terminate();
            
            // Store extracted text
            this.extractedText = text.trim();
            
            // Hide OCR status with animation
            this.hideOCRStatus();
            
            if (this.extractedText) {
                // Show extracted text in input field with animation
                const currentInput = this.elements.topicInput.value.trim();
                const newText = currentInput ? `${currentInput} ${this.extractedText}` : this.extractedText;
                this.animateTextInput(newText);
                
                this.showNotification(`Text extracted successfully! Found ${this.extractedText.length} characters.`, 'success');
            } else {
                this.showNotification('No text found in the image. Please try with a clearer image.', 'warning');
            }
            
        } catch (error) {
            console.error('OCR Error:', error);
            this.hideOCRStatus();
            this.showNotification('Failed to extract text from image. Please try again.', 'error');
        }
    }
    
    showOCRStatus() {
        this.elements.ocrStatus.style.display = "block";
        this.elements.ocrStatus.style.transform = 'translateY(-20px)';
        this.elements.ocrStatus.style.opacity = '0';
        
        setTimeout(() => {
            this.elements.ocrStatus.style.transition = 'all 0.3s ease';
            this.elements.ocrStatus.style.transform = 'translateY(0)';
            this.elements.ocrStatus.style.opacity = '1';
        }, 10);
        
        this.updateOCRProgress(0);
    }
    
    hideOCRStatus() {
        this.elements.ocrStatus.style.transform = 'translateY(-20px)';
        this.elements.ocrStatus.style.opacity = '0';
        
        setTimeout(() => {
            this.elements.ocrStatus.style.display = "none";
            this.elements.ocrStatus.style.transition = '';
        }, 300);
    }
    
    updateOCRProgress(progress) {
        // Animate progress bar
        this.elements.ocrProgressFill.style.width = `${progress}%`;
        
        // Animate percentage with counting effect
        const currentPercent = parseInt(this.elements.ocrProgressPercent.textContent) || 0;
        const targetPercent = progress;
        const duration = 300;
        const start = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progressRatio = Math.min(elapsed / duration, 1);
            const currentValue = Math.round(currentPercent + (targetPercent - currentPercent) * progressRatio);
            
            this.elements.ocrProgressPercent.textContent = `${currentValue}%`;
            
            if (progressRatio < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    removeFile() {
        // Animate file preview removal
        this.elements.filePreview.style.transform = 'translateY(-20px)';
        this.elements.filePreview.style.opacity = '0';
        
        setTimeout(() => {
            this.currentFile = null;
            this.extractedText = '';
            this.elements.fileInput.value = "";
            this.elements.filePreview.style.display = "none";
            this.elements.imagePreview.style.display = "none";
            this.elements.ocrStatus.style.display = "none";
            this.elements.filePreview.style.transition = '';
            this.showNotification('File removed', 'info');
        }, 300);
    }
    
    async handleSearch() {
        const topic = this.elements.topicInput.value.trim();
        
        if (!topic && !this.extractedText) {
            this.showNotification('Please enter a topic, use voice input, or upload an image with text!', 'warning');
            this.elements.topicInput.focus();
            // Add shake animation to input
            this.elements.topicInput.style.animation = 'shake 0.5s ease';
            setTimeout(() => {
                this.elements.topicInput.style.animation = '';
            }, 500);
            return;
        }
        
        // Combine manual input with extracted text
        const combinedTopic = topic || this.extractedText;
        
        this.currentTopic = combinedTopic;
        this.showResults();
        
        // Generate content for the active tab
        await this.generateContent(this.activeTab, combinedTopic);
    }
    
    showResults() {
        this.elements.resultsSection.classList.add('visible');
        
        // Animate results section appearance
        this.elements.resultsSection.style.transform = 'translateY(30px)';
        this.elements.resultsSection.style.opacity = '0';
        
        setTimeout(() => {
            this.elements.resultsSection.style.transition = 'all 0.8s ease';
            this.elements.resultsSection.style.transform = 'translateY(0)';
            this.elements.resultsSection.style.opacity = '1';
        }, 100);
        
        // Smooth scroll to results
        this.elements.resultsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    switchTab(tabName) {
        // Update active tab button with animation
        this.elements.tabButtons.forEach(btn => {
            btn.classList.remove('active');
            const indicator = btn.querySelector('.tab-indicator');
            if (indicator) {
                indicator.style.transform = 'scaleX(0)';
            }
        });
        
        const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
        activeBtn.classList.add('active');
        const activeIndicator = activeBtn.querySelector('.tab-indicator');
        if (activeIndicator) {
            activeIndicator.style.transform = 'scaleX(1)';
        }
        
        // Update active content panel with slide animation
        const panels = document.querySelectorAll('.content-panel');
        panels.forEach(panel => {
            if (panel.classList.contains('active')) {
                panel.style.transform = 'translateX(-20px)';
                panel.style.opacity = '0';
                setTimeout(() => {
                    panel.classList.remove('active');
                }, 150);
            }
        });
        
        setTimeout(() => {
            const newPanel = document.getElementById(`${tabName}-panel`);
            newPanel.classList.add('active');
            newPanel.style.transform = 'translateX(20px)';
            newPanel.style.opacity = '0';
            
            setTimeout(() => {
                newPanel.style.transition = 'all 0.3s ease';
                newPanel.style.transform = 'translateX(0)';
                newPanel.style.opacity = '1';
            }, 10);
        }, 150);
        
        this.activeTab = tabName;
        
        // Generate content if topic exists
        if (this.currentTopic) {
            this.generateContent(tabName, this.currentTopic);
        }
    }
    
    async generateContent(tabName, topic) {
        const contentElement = document.getElementById(`${tabName}-content`);
        const loadingElement = document.getElementById(`${tabName}-loading`);
        
        // Show loading state with animation
        this.showLoading(loadingElement);
        contentElement.innerHTML = '';
        
        // Animate search button
        this.animateSearchButton(true);
        
        try {
            let prompt = this.getPromptForTab(tabName, topic);
            
            // Add context if text was extracted from image
            if (this.extractedText) {
                prompt += `\n\nNote: The following text was extracted from an uploaded image and should be considered as the primary study material:\n"${this.extractedText}"`;
            }
            
            const content = await this.makeApiRequest(prompt);
            
            // Hide loading and show content with animation
            this.hideLoading(loadingElement);
            await this.animateContentDisplay(contentElement, content, tabName);
            
        } catch (error) {
            console.error(`Error generating ${tabName}:`, error);
            this.hideLoading(loadingElement);
            contentElement.innerHTML = this.getErrorMessage(error.message);
            this.animateErrorMessage(contentElement);
        } finally {
            // Reset search button
            this.animateSearchButton(false);
        }
    }
    
    animateSearchButton(isLoading) {
        if (isLoading) {
            this.elements.searchBtn.disabled = true;
            this.elements.searchBtn.innerHTML = '<span class="btn-text">Generating...</span><i class="fas fa-spinner fa-spin"></i>';
            this.elements.searchBtn.style.transform = 'scale(0.95)';
        } else {
            this.elements.searchBtn.disabled = false;
            this.elements.searchBtn.innerHTML = '<span class="btn-text">Generate Study Materials</span><i class="fas fa-magic"></i>';
            this.elements.searchBtn.style.transform = 'scale(1)';
        }
    }
    
    async animateContentDisplay(contentElement, content, tabName) {
        const formattedContent = this.formatContent(content, tabName);
        contentElement.innerHTML = formattedContent;
        
        // Animate content appearance
        contentElement.style.opacity = '0';
        contentElement.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            contentElement.style.transition = 'all 0.6s ease';
            contentElement.style.opacity = '1';
            contentElement.style.transform = 'translateY(0)';
        }, 100);
        
        // Animate individual elements within content
        const elements = contentElement.querySelectorAll('h2, h3, p, ul, li, .quiz-question');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.4s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 100 + (index * 50));
        });
    }
    
    animateErrorMessage(contentElement) {
        const errorElement = contentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.style.animation = 'shake 0.5s ease';
        }
    }
    
    getPromptForTab(tabName, topic) {
        const prompts = {
            notes: `Create comprehensive study notes and important formulas for the topic: "${topic}". 

Please include:
1. Brief overview and key concepts
2. Important formulas (if applicable) 
3. Key definitions and terminology
4. Important points to remember
5. Common applications or examples
6. Quick facts and summary
give all these in simple and easy terms and also in points so that it will be more easier to learn. Make it suitable for exam preparation.`,

            quiz: `Create an interactive quiz with 10 multiple-choice questions about "${topic}". 

For each question:
1. Provide a clear, specific question
2. Give 4 answer options (A, B, C, D)
3. Indicate the correct answer
4. Provide a brief explanation for why the correct answer is right

Format each question clearly with:
**Question X:** [Question text]
A) [Option A]
B) [Option B] 
C) [Option C]
D) [Option D]

**Correct Answer:** [Letter] - [Explanation]

Make the questions progressively challenging and cover different aspects of the topic.`,

            report: `Create a comprehensive study report for the topic: "${topic}". 
and make it short and simple for the user to understand
Please include:
1. **Topic Overview** - Why this topic is important
2. **Key Areas to Focus On** - Most important subtopics
3. **Essential Questions** - 5 most important questions likely to be asked in exams
4. **Study Timeline** - Suggested study schedule and strategy in days
5. **Common Mistakes** - What students typically get wrong
6. **Additional Resources** - Related topics to explore
7. **Quick Revision Points** - Key points for last-minute review
8. **Exam Tips** - Specific advice for exam success
9. **Conclusion** - At last all the important keywords or the topic in highlighted way

Make it detailed, practical, and helpful for exam preparation. Use clear headings and bullet points.`
        };
        
        return prompts[tabName] || prompts.notes;
    }
    
    async makeApiRequest(prompt) {
        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 8192,
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", 
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        };
        
        const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text;
        } else if (data.error) {
            throw new Error(data.error.message || 'API returned an error');
        } else {
            throw new Error('Invalid response format from API');
        }
    }
    
    formatContent(content, tabName) {
        if (tabName === 'quiz') {
            return this.formatQuizContent(content);
        }
        
        // Convert markdown-like formatting to HTML
        let formatted = content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^# (.*$)/gm, '<h2>$1</h2>')
            .replace(/^\* (.*$)/gm, '<li>$1</li>')
            .replace(/^- (.*$)/gm, '<li>$1</li>')
            .replace(/^(\d+)\. (.*$)/gm, '<li>$2</li>');
        
        // Wrap consecutive list items in ul tags
        formatted = formatted.replace(/(<li>.*?<\/li>\s*)+/gm, '<ul>$&</ul>');
        
        // Add paragraphs for content that isn't already in tags
        const lines = formatted.split('\n');
        let result = '';
        let inList = false;
        
        for (let line of lines) {
            line = line.trim();
            if (!line) continue;
            
            if (line.startsWith('<h') || line.startsWith('<ul') || line.startsWith('</ul>')) {
                result += line + '\n';
                inList = line.startsWith('<ul') || (inList && !line.startsWith('</ul>'));
            } else if (!line.startsWith('<') && !inList) {
                result += `<p>${line}</p>\n`;
            } else {
                result += line + '\n';
            }
        }
        
        return result;
    }
    
    formatQuizContent(content) {
        // Split content into questions
        const questions = content.split(/(?=\*\*Question \d+:|\d+\.)/);
        let formattedQuiz = '';
        
        questions.forEach((question, index) => {
            const trimmedQuestion = question.trim();
            if (trimmedQuestion && trimmedQuestion.length > 10) {
                const formattedQuestion = this.formatSingleQuestion(trimmedQuestion);
                if (formattedQuestion) {
                    formattedQuiz += `<div class="quiz-question" style="animation-delay: ${index * 0.2}s">${formattedQuestion}</div>`;
                }
            }
        });
        
        return formattedQuiz || `<div class="quiz-question">${this.formatContent(content, 'notes')}</div>`;
    }
    
    formatSingleQuestion(questionText) {
        // Format individual quiz question
        let formatted = questionText
            .replace(/\*\*(Question \d+:.*?)\*\*/g, '<h3>$1</h3>')
            .replace(/\*\*(Correct Answer:.*?)\*\*/g, '<div class="correct-answer"><strong>$1</strong></div>')
            .replace(/^([A-D])\) (.*$)/gm, '<div class="quiz-option">$1) $2</div>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        return formatted;
    }
    
    getErrorMessage(errorMsg) {
        return `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Oops! Something went wrong</h3>
                <p>${errorMsg}</p>
                <p>Please try again or check your internet connection.</p>
            </div>
        `;
    }
    
    showLoading(element) {
        element.classList.add('visible');
        // Add loading animation
        element.style.transform = 'scale(0.9)';
        element.style.opacity = '0';
        setTimeout(() => {
            element.style.transition = 'all 0.3s ease';
            element.style.transform = 'scale(1)';
            element.style.opacity = '1';
        }, 10);
    }
    
    hideLoading(element) {
        element.style.transform = 'scale(0.9)';
        element.style.opacity = '0';
        setTimeout(() => {
            element.classList.remove('visible');
            element.style.transition = '';
        }, 300);
    }
    
    showNotification(message, type = 'info') {
        // Create notification element with enhanced animations
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in with bounce effect
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto-remove after 4 seconds with fade out
        setTimeout(() => {
            notification.style.transform = 'translateX(100%) scale(0.8)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
}

// Add CSS for shake animation
const shakeCSS = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;

// Add the shake CSS to the document
const style = document.createElement('style');
style.textContent = shakeCSS;
document.head.appendChild(style);

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StudyMateApp();
});

// Add service worker for better performance (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}