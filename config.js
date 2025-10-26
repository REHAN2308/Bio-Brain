// Configuration for BioBrain AI
// This file loads environment variables for production deployment

const config = {
    // API Key will be injected by Vercel during build
    // Set as environment variable: OPENROUTER_API_KEY
    apiKey: typeof window !== 'undefined' && window.ENV_API_KEY ? window.ENV_API_KEY : '',
    
    appName: 'BioBrain AI',
    appVersion: '1.0.0',
    
    // OpenRouter API configuration
    openRouterModel: 'openai/gpt-3.5-turbo',
    
    // Image generation
    imageAPIUrl: 'https://image.pollinations.ai/prompt',
};

// Export for use in app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
}
