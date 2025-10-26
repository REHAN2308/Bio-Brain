// ==========================================
// BioBrain AI - Main Application Logic
// ==========================================

class BioBrainApp {
    constructor() {
        // Default API key loaded from environment variable (Vercel) or empty
        // In production, this will be set via Vercel Environment Variables
        this.defaultApiKey = '';
        this.apiKey = '';
        this.useDefaultKey = true;
        this.currentChatId = null;
        this.chatHistory = [];
        this.conversations = [];
        
        // System prompt for controlled responses
        this.systemPrompt = `You are BioBrain AI, an expert biology tutor for Class 11 students. Your role is to provide accurate, well-structured, and academically rigorous explanations of biological concepts.

CRITICAL INSTRUCTIONS:
1. ALWAYS provide accurate, factual information based on standard Class 11 biology curriculum
2. Structure your answers with clear headings, bullet points, and numbered lists
3. Use simple language suitable for high school students
4. Include relevant examples and real-world applications
5. If you're unsure about something, say so - never make up information
6. Keep answers concise but comprehensive (200-400 words typically)
7. End with a brief summary or key takeaway when appropriate
8. For diagram requests, describe what the diagram should show in detail

ANSWER FORMAT:
- Start with a brief definition or overview
- Break down complex concepts into digestible parts
- Use analogies when helpful
- Highlight key terms
- Provide step-by-step explanations for processes

TOPICS TO COVER (Class 11 Biology):
- Cell biology, biomolecules, plant physiology, human physiology
- Photosynthesis, respiration, transport systems
- Body systems (digestive, respiratory, circulatory, excretory, nervous, endocrine)
- Structural organization in plants and animals

Remember: Accuracy and educational value are paramount. You're helping students learn, not just answer questions.`;

        this.init();
    }

    init() {
        this.loadApiKey();
        this.loadConversations();
        this.setupEventListeners();
        this.updateApiStatus();
    }

    // ==========================================
    // Event Listeners Setup
    // ==========================================

    setupEventListeners() {
        // Menu and sidebar
        document.getElementById('menuBtn').addEventListener('click', () => this.toggleSidebar());
        document.getElementById('closeSidebar').addEventListener('click', () => this.toggleSidebar());
        
        // Settings
        document.getElementById('settingsBtn').addEventListener('click', () => this.openSettings());
        document.getElementById('closeSettingsModal').addEventListener('click', () => this.closeSettings());
        document.getElementById('cancelSettings').addEventListener('click', () => this.closeSettings());
        document.getElementById('saveSettings').addEventListener('click', () => this.saveSettings());
        
        // Chat actions
        document.getElementById('newChatBtn').addEventListener('click', () => this.startNewChat());
        document.getElementById('clearHistoryBtn').addEventListener('click', () => this.clearHistory());
        
        // Input handling
        const userInput = document.getElementById('userInput');
        const sendBtn = document.getElementById('sendBtn');
        
        userInput.addEventListener('input', (e) => this.handleInput(e));
        userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        sendBtn.addEventListener('click', () => this.sendMessage());
        
        // Example prompts
        document.querySelectorAll('.example-prompt').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const prompt = e.currentTarget.dataset.prompt;
                document.getElementById('userInput').value = prompt;
                this.sendMessage();
            });
        });

        // Close modal on outside click
        document.getElementById('settingsModal').addEventListener('click', (e) => {
            if (e.target.id === 'settingsModal') {
                this.closeSettings();
            }
        });
    }

    // ==========================================
    // API Key Management
    // ==========================================

    loadApiKey() {
        try {
            const stored = localStorage.getItem('biobrain_api_key');
            const useDefault = localStorage.getItem('biobrain_use_default_key');
            
            if (useDefault === 'true' || !stored) {
                // Use default API key
                this.useDefaultKey = true;
                this.apiKey = this.defaultApiKey;
            } else {
                // Use custom API key
                this.useDefaultKey = false;
                this.apiKey = atob(stored); // Simple encoding (not true encryption)
            }
        } catch (error) {
            console.error('Error loading API key:', error);
            // Fallback to default key
            this.useDefaultKey = true;
            this.apiKey = this.defaultApiKey;
        }
    }

    saveApiKey(key, shouldSave) {
        if (!key || key.trim() === '') {
            // Use default key
            this.useDefaultKey = true;
            this.apiKey = this.defaultApiKey;
            localStorage.setItem('biobrain_use_default_key', 'true');
            localStorage.removeItem('biobrain_api_key');
        } else {
            // Use custom key
            this.useDefaultKey = false;
            this.apiKey = key;
            localStorage.setItem('biobrain_use_default_key', 'false');
            
            if (shouldSave) {
                try {
                    localStorage.setItem('biobrain_api_key', btoa(key));
                } catch (error) {
                    console.error('Error saving API key:', error);
                }
            } else {
                localStorage.removeItem('biobrain_api_key');
            }
        }
        this.updateApiStatus();
    }

    updateApiStatus() {
        const statusEl = document.getElementById('apiStatus');
        const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
        
        if (isProduction) {
            // In production, API key is handled by serverless function
            statusEl.innerHTML = '<span class="status-dot"></span> Secure Connection';
            statusEl.classList.remove('error');
        } else if (this.apiKey) {
            // Local development with API key
            if (this.useDefaultKey) {
                statusEl.innerHTML = '<span class="status-dot"></span> Using Default Key';
            } else {
                statusEl.innerHTML = '<span class="status-dot"></span> Using Custom Key';
            }
            statusEl.classList.remove('error');
        } else {
            // Local development without API key
            statusEl.innerHTML = '<span class="status-dot"></span> Add API Key in Settings';
            statusEl.classList.add('error');
        }
    }

    // ==========================================
    // UI Management
    // ==========================================

    toggleSidebar() {
        document.getElementById('sidebar').classList.toggle('open');
    }

    openSettings() {
        document.getElementById('settingsModal').classList.add('open');
        const apiKeyInput = document.getElementById('apiKeyInput');
        
        // Show current custom key (not default)
        if (!this.useDefaultKey && this.apiKey !== this.defaultApiKey) {
            apiKeyInput.value = this.apiKey;
        } else {
            apiKeyInput.value = '';
        }
        
        apiKeyInput.placeholder = 'Leave empty to use default key';
        document.getElementById('saveApiKey').checked = !!localStorage.getItem('biobrain_api_key');
    }

    closeSettings() {
        document.getElementById('settingsModal').classList.remove('open');
    }

    saveSettings() {
        const apiKey = document.getElementById('apiKeyInput').value.trim();
        const shouldSave = document.getElementById('saveApiKey').checked;
        
        // Save the key (empty string will use default)
        this.saveApiKey(apiKey, shouldSave);
        this.closeSettings();
        
        if (apiKey === '' || !apiKey) {
            this.showToast('Using default API key');
        } else {
            this.showToast('Custom API key saved successfully');
        }
    }

    showToast(message) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        toastMessage.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    handleInput(e) {
        const input = e.target;
        const charCount = document.getElementById('charCount');
        charCount.textContent = `${input.value.length}/500`;
        
        // Auto-resize textarea
        input.style.height = 'auto';
        input.style.height = input.scrollHeight + 'px';
    }

    hideWelcomeScreen() {
        document.getElementById('welcomeScreen').classList.add('hidden');
        document.getElementById('chatMessages').classList.add('active');
    }

    // ==========================================
    // Chat Functionality
    // ==========================================

    async sendMessage() {
        const input = document.getElementById('userInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Check if we need API key (only in local development)
        const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
        if (!isProduction && !this.apiKey) {
            this.showToast('Please add your API key in Settings for local development');
            this.openSettings();
            return;
        }
        
        // Hide welcome screen
        this.hideWelcomeScreen();
        
        // Create new chat if needed
        if (!this.currentChatId) {
            this.currentChatId = Date.now().toString();
            this.chatHistory = [];
        }
        
        // Add user message
        this.addMessage('user', message);
        this.chatHistory.push({ role: 'user', content: message });
        
        // Clear input
        input.value = '';
        input.style.height = 'auto';
        document.getElementById('charCount').textContent = '0/500';
        
        // Show loading
        const loadingId = this.showLoading();
        
        try {
            // Call OpenRouter API
            const response = await this.callOpenRouter(this.chatHistory);
            this.removeLoading(loadingId);
            
            // Add assistant message
            this.addMessage('assistant', response);
            this.chatHistory.push({ role: 'assistant', content: response });
            
            // Save conversation
            this.saveConversation();
            
            // Generate related questions
            await this.generateRelatedQuestions(message, response);
            
        } catch (error) {
            this.removeLoading(loadingId);
            this.addMessage('assistant', `Sorry, I encountered an error: ${error.message}. Please check your API key and try again.`);
            console.error('Error:', error);
        }
    }

    addMessage(role, content) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageEl = document.createElement('div');
        messageEl.className = `message ${role}`;
        
        const time = new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        const avatar = role === 'user' ? 'You' : '🧬';
        
        messageEl.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <div class="message-bubble">${this.formatMessage(content)}</div>
                <div class="message-time">${time}</div>
                ${role === 'assistant' ? this.getMessageActions() : ''}
            </div>
        `;
        
        messagesContainer.appendChild(messageEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Setup action buttons
        if (role === 'assistant') {
            this.setupMessageActions(messageEl, content);
        }
        
        return messageEl;
    }

    formatMessage(content) {
        // Convert markdown-like formatting
        let formatted = content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n\n/g, '<br><br>')
            .replace(/\n/g, '<br>');
        
        return formatted;
    }

    getMessageActions() {
        return `
            <div class="message-actions">
                <button class="action-btn primary diagram-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    Show Diagram
                </button>
                <button class="action-btn save-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                        <polyline points="17 21 17 13 7 13 7 21"></polyline>
                        <polyline points="7 3 7 8 15 8"></polyline>
                    </svg>
                    Save
                </button>
            </div>
        `;
    }

    setupMessageActions(messageEl, content) {
        const diagramBtn = messageEl.querySelector('.diagram-btn');
        const saveBtn = messageEl.querySelector('.save-btn');
        
        if (diagramBtn) {
            diagramBtn.addEventListener('click', async () => {
                await this.generateDiagram(messageEl, content);
            });
        }
        
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveAnswer(content);
            });
        }
    }

    showLoading() {
        const messagesContainer = document.getElementById('chatMessages');
        const loadingEl = document.createElement('div');
        const loadingId = `loading-${Date.now()}`;
        loadingEl.id = loadingId;
        loadingEl.className = 'message assistant';
        
        loadingEl.innerHTML = `
            <div class="message-avatar">🧬</div>
            <div class="message-content">
                <div class="loading-indicator">
                    <div class="loading-dots">
                        <div class="loading-dot"></div>
                        <div class="loading-dot"></div>
                        <div class="loading-dot"></div>
                    </div>
                    <span class="loading-text">Thinking...</span>
                </div>
            </div>
        `;
        
        messagesContainer.appendChild(loadingEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        return loadingId;
    }

    removeLoading(loadingId) {
        const loadingEl = document.getElementById(loadingId);
        if (loadingEl) {
            loadingEl.remove();
        }
    }

    // ==========================================
    // OpenRouter API Integration
    // ==========================================

    async callOpenRouter(messages) {
        // Check if running on Vercel (production) or localhost
        const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
        
        if (isProduction) {
            // Use serverless function in production (keeps API key secure)
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [
                        { role: 'system', content: this.systemPrompt },
                        ...messages
                    ],
                    model: 'openai/gpt-3.5-turbo'
                })
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.error || 'API request failed');
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } else {
            // Use direct API call in development (requires API key in settings)
            if (!this.apiKey) {
                throw new Error('Please add your API key in Settings for local development');
            }
            
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': window.location.href,
                    'X-Title': 'BioBrain AI'
                },
                body: JSON.stringify({
                    model: 'openai/gpt-3.5-turbo',
                    messages: [
                        { role: 'system', content: this.systemPrompt },
                        ...messages
                    ],
                    temperature: 0.7,
                    max_tokens: 1000
                })
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.error?.message || `API request failed: ${response.statusText}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;
        }
    }

    // ==========================================
    // Related Questions Generation
    // ==========================================

    async generateRelatedQuestions(userQuestion, answer) {
        try {
            const prompt = `Based on this biology question and answer for a Class 11 student, generate exactly 4 related follow-up questions that would help deepen their understanding. 

Question: ${userQuestion}
Answer: ${answer}

Generate 4 questions that are:
1. More specific or detailed aspects of the topic
2. Related concepts that build on this knowledge
3. Practical applications or examples
4. Connections to other biology topics

Return ONLY the 4 questions, one per line, without numbering or bullets.`;

            const response = await this.callOpenRouter([
                { role: 'user', content: prompt }
            ]);

            const questions = response.split('\n')
                .map(q => q.trim())
                .filter(q => q.length > 0 && !q.match(/^\d+[.)]/))
                .slice(0, 4);

            if (questions.length > 0) {
                this.addRelatedQuestions(questions);
            }
        } catch (error) {
            console.error('Error generating related questions:', error);
        }
    }

    addRelatedQuestions(questions) {
        const messagesContainer = document.getElementById('chatMessages');
        const relatedEl = document.createElement('div');
        relatedEl.className = 'message assistant';
        
        const questionsHtml = questions.map(q => 
            `<button class="related-question-btn">${q}</button>`
        ).join('');
        
        relatedEl.innerHTML = `
            <div class="message-avatar">🧬</div>
            <div class="message-content">
                <div class="related-questions">
                    <h4>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                        Related Questions
                    </h4>
                    ${questionsHtml}
                </div>
            </div>
        `;
        
        messagesContainer.appendChild(relatedEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Setup click handlers
        relatedEl.querySelectorAll('.related-question-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('userInput').value = btn.textContent;
                this.sendMessage();
            });
        });
    }

    // ==========================================
    // Diagram Generation
    // ==========================================

    async generateDiagram(messageEl, context) {
        const diagramBtn = messageEl.querySelector('.diagram-btn');
        const messageContent = messageEl.querySelector('.message-content');
        
        // Check if diagram already exists
        const existingDiagram = messageContent.querySelector('.diagram-container');
        if (existingDiagram) {
            // Diagram already shown, just scroll to it
            existingDiagram.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            return;
        }
        
        const originalText = diagramBtn.innerHTML;
        
        diagramBtn.disabled = true;
        diagramBtn.innerHTML = `
            <div class="loading-dots">
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
            </div>
            Loading...
        `;
        
        try {
            // Extract key terms for diagram
            const prompt = await this.extractDiagramPrompt(context);
            
            // Use Pollinations.ai with enhanced parameters for better quality
            const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=768&nologo=true&enhance=true&model=flux`;
            
            // Create diagram container
            const diagramContainer = document.createElement('div');
            diagramContainer.className = 'diagram-container';
            diagramContainer.innerHTML = `
                <img src="${imageUrl}" alt="Biology Diagram" loading="lazy">
                <div class="diagram-actions">
                    <button class="action-btn download-diagram">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Download
                    </button>
                    <button class="action-btn share-diagram">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="18" cy="5" r="3"></circle>
                            <circle cx="6" cy="12" r="3"></circle>
                            <circle cx="18" cy="19" r="3"></circle>
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                        </svg>
                        Share
                    </button>
                </div>
            `;
            
            // Insert after message actions
            messageContent.appendChild(diagramContainer);
            
            // Setup diagram actions
            this.setupDiagramActions(diagramContainer, imageUrl);
            
            // Update button text to "Hide Diagram"
            diagramBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                Diagram Shown
            `;
            diagramBtn.disabled = false;
            
            // Scroll to diagram
            diagramContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            this.showToast('Diagram loaded successfully!');
            
        } catch (error) {
            console.error('Error generating diagram:', error);
            diagramBtn.innerHTML = originalText;
            diagramBtn.disabled = false;
            this.showToast('Failed to load diagram');
        }
    }

    async extractDiagramPrompt(context) {
        // Create a highly detailed biology-focused diagram prompt
        const shortContext = context.substring(0, 250);
        return `High resolution scientific diagram of ${shortContext}. Professional medical/biology textbook illustration, clearly labeled parts with arrows and text, anatomically accurate, detailed cross-section view, clean white background, educational poster style, sharp lines, vivid colors for different structures, professional scientific illustration quality`;
    }

    setupDiagramActions(container, imageUrl) {
        const downloadBtn = container.querySelector('.download-diagram');
        const shareBtn = container.querySelector('.share-diagram');
        
        downloadBtn.addEventListener('click', async () => {
            try {
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `biobrain-diagram-${Date.now()}.png`;
                a.click();
                window.URL.revokeObjectURL(url);
                this.showToast('Diagram downloaded!');
            } catch (error) {
                console.error('Download error:', error);
                this.showToast('Failed to download diagram');
            }
        });
        
        shareBtn.addEventListener('click', async () => {
            if (navigator.share) {
                try {
                    const response = await fetch(imageUrl);
                    const blob = await response.blob();
                    const file = new File([blob], 'diagram.png', { type: 'image/png' });
                    await navigator.share({
                        title: 'BioBrain AI Diagram',
                        text: 'Check out this biology diagram!',
                        files: [file]
                    });
                } catch (error) {
                    console.error('Share error:', error);
                }
            } else {
                // Fallback: copy link
                navigator.clipboard.writeText(imageUrl);
                this.showToast('Link copied to clipboard!');
            }
        });
    }

    // ==========================================
    // Data Persistence
    // ==========================================

    saveAnswer(content) {
        try {
            const saved = JSON.parse(localStorage.getItem('biobrain_saved') || '[]');
            saved.push({
                content,
                timestamp: Date.now(),
                date: new Date().toLocaleString()
            });
            localStorage.setItem('biobrain_saved', JSON.stringify(saved));
            this.showToast('Answer saved for offline review!');
        } catch (error) {
            console.error('Error saving answer:', error);
            this.showToast('Failed to save answer');
        }
    }

    saveConversation() {
        try {
            const conversation = {
                id: this.currentChatId,
                title: this.chatHistory[0]?.content.substring(0, 50) + '...' || 'New Chat',
                messages: this.chatHistory,
                timestamp: Date.now(),
                date: new Date().toLocaleString()
            };
            
            const conversations = JSON.parse(localStorage.getItem('biobrain_conversations') || '[]');
            const existingIndex = conversations.findIndex(c => c.id === this.currentChatId);
            
            if (existingIndex >= 0) {
                conversations[existingIndex] = conversation;
            } else {
                conversations.unshift(conversation);
            }
            
            // Keep only last 50 conversations
            if (conversations.length > 50) {
                conversations.length = 50;
            }
            
            localStorage.setItem('biobrain_conversations', JSON.stringify(conversations));
            this.updateHistoryUI();
            
        } catch (error) {
            console.error('Error saving conversation:', error);
        }
    }

    loadConversations() {
        try {
            this.conversations = JSON.parse(localStorage.getItem('biobrain_conversations') || '[]');
            this.updateHistoryUI();
        } catch (error) {
            console.error('Error loading conversations:', error);
            this.conversations = [];
        }
    }

    updateHistoryUI() {
        const historyList = document.getElementById('historyList');
        
        if (this.conversations.length === 0) {
            historyList.innerHTML = '<div class="history-empty">No chat history yet. Start a conversation!</div>';
            return;
        }
        
        historyList.innerHTML = this.conversations.map(conv => `
            <div class="history-item" data-id="${conv.id}">
                <div class="history-item-title">${conv.title}</div>
                <div class="history-item-date">${conv.date}</div>
            </div>
        `).join('');
        
        // Setup click handlers
        historyList.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = item.dataset.id;
                this.loadConversation(id);
                this.toggleSidebar();
            });
        });
    }

    loadConversation(id) {
        const conversation = this.conversations.find(c => c.id === id);
        if (!conversation) return;
        
        this.currentChatId = id;
        this.chatHistory = conversation.messages;
        
        // Clear and rebuild chat
        const messagesContainer = document.getElementById('chatMessages');
        messagesContainer.innerHTML = '';
        this.hideWelcomeScreen();
        
        this.chatHistory.forEach(msg => {
            this.addMessage(msg.role, msg.content);
        });
    }

    startNewChat() {
        this.currentChatId = null;
        this.chatHistory = [];
        document.getElementById('chatMessages').innerHTML = '';
        document.getElementById('welcomeScreen').classList.remove('hidden');
        document.getElementById('chatMessages').classList.remove('active');
        this.toggleSidebar();
        this.showToast('Started new chat');
    }

    clearHistory() {
        if (!confirm('Are you sure you want to clear all chat history? This cannot be undone.')) {
            return;
        }
        
        localStorage.removeItem('biobrain_conversations');
        this.conversations = [];
        this.updateHistoryUI();
        this.startNewChat();
        this.showToast('Chat history cleared');
    }
}

// ==========================================
// Initialize App
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    window.bioBrainApp = new BioBrainApp();
});

// Service Worker Registration (for offline support)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed'));
    });
}
