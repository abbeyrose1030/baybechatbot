class BaybeChat {
    constructor() {
        this.messagesContainer = document.getElementById('messages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.isTyping = false;
        this.conversationHistory = [];
        
        this.init();
    }
    
    init() {
        // Event listeners
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Focus on input when page loads
        this.messageInput.focus();
        
        // Add welcome message
        this.addWelcomeMessage();
    }
    
    addWelcomeMessage() {
        const welcomeMessage = this.createMessage('bot', 'oh. you\'re here.');
        this.messagesContainer.appendChild(welcomeMessage);
        this.scrollToBottom();
    }
    
    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isTyping) return;
        
        // Add user message to chat
        this.addMessage('user', message);
        this.messageInput.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Send message to API
            const response = await this.sendToAPI(message);
            this.hideTypingIndicator();
            this.addMessage('bot', response);
        } catch (error) {
            this.hideTypingIndicator();
            this.addMessage('bot', 'Sorry, I encountered an error. Please try again.');
            console.error('Error:', error);
        }
    }
    
    async sendToAPI(message) {
        const response = await fetch('/api/baybe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                message: message,
                history: this.conversationHistory 
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const reply = data.reply || 'No response received.';
        
        // Add to conversation history
        this.conversationHistory.push({ role: 'user', content: message });
        this.conversationHistory.push({ role: 'assistant', content: reply });
        
        // Keep only last 20 messages to avoid token limits
        if (this.conversationHistory.length > 20) {
            this.conversationHistory = this.conversationHistory.slice(-20);
        }
        
        return reply;
    }
    
    addMessage(sender, content) {
        const messageElement = this.createMessage(sender, content);
        this.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
    }
    
    createMessage(sender, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.textContent = content;
        return messageDiv;
    }
    
    showTypingIndicator() {
        this.isTyping = true;
        this.sendButton.disabled = true;
        this.sendButton.style.opacity = '0.5';
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typing-indicator';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'typing-dot';
            typingDiv.appendChild(dot);
        }
        
        this.messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        this.isTyping = false;
        this.sendButton.disabled = false;
        this.sendButton.style.opacity = '1';
        
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BaybeChat();
});

// Add some visual effects
document.addEventListener('DOMContentLoaded', () => {
    // Add subtle glow effect to the chat box
    const chatBox = document.querySelector('.chat-box');
    
    // Create a subtle pulsing effect
    setInterval(() => {
        const glowIntensity = 0.05 + Math.sin(Date.now() * 0.001) * 0.02;
        chatBox.style.boxShadow = `
            0 0 30px rgba(255, 255, 255, ${glowIntensity}),
            inset 0 0 20px rgba(0, 0, 0, 0.5)
        `;
    }, 50);
    
    // Add keyboard sound effect simulation (visual feedback)
    const messageInput = document.getElementById('messageInput');
    messageInput.addEventListener('input', () => {
        // Subtle visual feedback when typing
        messageInput.style.borderColor = '#777777';
        setTimeout(() => {
            messageInput.style.borderColor = '#333333';
        }, 100);
    });
});
