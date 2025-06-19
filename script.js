// NotesNest - AI Study Assistant
// Modern JavaScript implementation with built-in API key and theme support

class StudyMateApp {
    constructor() {
        this.currentTopic = '';
        this.activeTab = 'notes';
        this.isDarkMode = false;
        
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
            themeIcon: document.getElementById('themeIcon')
        };
        
        this.init();
    }
    
    init() {
        this.attachEventListeners();
        this.initializeTheme();
    }
    
    initializeTheme() {
        // Check for saved theme preference or default to light mode
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
    }
    
    setTheme(theme) {
        this.isDarkMode = theme === 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update theme toggle icon
        if (this.isDarkMode) {
            this.elements.themeIcon.className = 'fas fa-moon';
        } else {
            this.elements.themeIcon.className = 'fas fa-sun';
        }
        
        // Save theme preference
        localStorage.setItem('theme', theme);
    }
    
    toggleTheme() {
        const newTheme = this.isDarkMode ? 'light' : 'dark';
        this.setTheme(newTheme);
        this.showNotification(`Switched to ${newTheme} mode`, 'info');
    }
    
    attachEventListeners() {
        // Search functionality
        this.elements.searchBtn.addEventListener('click', () => this.handleSearch());
        this.elements.topicInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });
        
        // Tab switching
        this.elements.tabButtons.forEach(button => {
            button.addEventListener('click', () => this.switchTab(button.dataset.tab));
        });
        
        // Suggestion buttons
        this.elements.suggestionButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.elements.topicInput.value = button.dataset.topic;
                this.handleSearch();
            });
        });
        
        // Theme toggle
        this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
    }
    
    async handleSearch() {
        const topic = this.elements.topicInput.value.trim();
        
        if (!topic) {
            this.showNotification('Please enter a topic to study!', 'warning');
            return;
        }
        
        this.currentTopic = topic;
        this.showResults();
        
        // Generate content for the active tab
        await this.generateContent(this.activeTab, topic);
    }
    
    showResults() {
        this.elements.resultsSection.classList.add('visible');
        this.elements.resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    switchTab(tabName) {
        // Update active tab button
        this.elements.tabButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update active content panel
        document.querySelectorAll('.content-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`${tabName}-panel`).classList.add('active');
        
        this.activeTab = tabName;
        
        // Generate content if topic exists
        if (this.currentTopic) {
            this.generateContent(tabName, this.currentTopic);
        }
    }
    
    async generateContent(tabName, topic) {
        const contentElement = document.getElementById(`${tabName}-content`);
        const loadingElement = document.getElementById(`${tabName}-loading`);
        
        // Show loading state
        this.showLoading(loadingElement);
        contentElement.innerHTML = '';
        
        try {
            let prompt = this.getPromptForTab(tabName, topic);
            const content = await this.makeApiRequest(prompt);
            
            // Hide loading and show content
            this.hideLoading(loadingElement);
            contentElement.innerHTML = this.formatContent(content, tabName);
            
        } catch (error) {
            console.error(`Error generating ${tabName}:`, error);
            this.hideLoading(loadingElement);
            contentElement.innerHTML = this.getErrorMessage(error.message);
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

Format the response clearly with headings, bullet points, and organize the information logically. Make it suitable for exam preparation.`,

            quiz: `Create an interactive quiz with 5 multiple-choice questions about "${topic}". 

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

Please include:
1. **Topic Overview** - Why this topic is important
2. **Key Areas to Focus On** - Most important subtopics
3. **Essential Questions** - 5 most important questions likely to be asked in exams
4. **Study Timeline** - Suggested study schedule and strategy
5. **Common Mistakes** - What students typically get wrong
6. **Additional Resources** - Related topics to explore
7. **Quick Revision Points** - Key points for last-minute review
8. **Exam Tips** - Specific advice for exam success

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
                    formattedQuiz += `<div class="quiz-question">${formattedQuestion}</div>`;
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
    }
    
    hideLoading(element) {
        element.classList.remove('visible');
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StudyMateApp();
});