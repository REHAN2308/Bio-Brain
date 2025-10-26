# 🧬 BioBrain AI - Intelligent Biology Tutor for Class 11 Students

![BioBrain AI](https://img.shields.io/badge/BioBrain-AI-10b981?style=for-the-badge)
![Mobile First](https://img.shields.io/badge/Mobile-First-34d399?style=for-the-badge)
![Biology](https://img.shields.io/badge/Subject-Biology-14b8a6?style=for-the-badge)

BioBrain AI is a modern, mobile-optimized web application designed specifically for Class 11 biology students. It provides accurate, academically rigorous biology explanations powered by AI, with interactive diagrams and a student-friendly interface.

## ✨ Features

### 🎯 Core Functionality
- **AI-Powered Chat**: Get accurate biology answers using OpenRouter's Smart Model API
- **Strict System Prompting**: Controlled responses ensure academic accuracy and prevent hallucinations
- **Related Questions**: Automatically generates 3-5 follow-up questions to deepen understanding
- **Diagram Generation**: Generate biology diagrams and labeled images with one click
- **Chat History**: Sidebar panel to revisit previous conversations
- **Offline Support**: Save answers and diagrams for offline review

### 🎨 Design
- **Biology-Themed UI**: Clean green and white color scheme with organic shapes
- **Mobile-First**: Fully optimized for Android and iOS devices
- **Touch-Friendly**: Large buttons and intuitive gestures
- **Responsive**: Works seamlessly on phones, tablets, and desktops
- **Modern Interface**: Smooth animations and professional design

### 📚 Educational Features
- **Class 11 Focused**: Content tailored for high school biology curriculum
- **Structured Explanations**: Clear formatting with headings, bullet points, and examples
- **Example Prompts**: Pre-loaded questions to get started quickly
- **Academic Accuracy**: Strict system prompting ensures reliable information

## 🚀 Quick Start

### Option 1: Use Live Demo (Easiest)
Visit the live app at: **[biobrain-ai.vercel.app](https://biobrain-ai.vercel.app)** (update with your actual URL after deployment)

- No setup required!
- Default API key is built-in
- Start asking biology questions immediately

### Option 2: Run Locally

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- (Optional) Your own OpenRouter API key from [openrouter.ai](https://openrouter.ai)

### Installation

1. **Clone or download** this repository:
   ```bash
   git clone https://github.com/yourusername/biobrain.git
   cd biobrain
   ```

2. **Open the app**:
   - Simply open `index.html` in your web browser
   - Or use a local server:
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx http-server
     ```

3. **Get your API key** (Optional):
   - The app comes with a default API key built-in
   - It works immediately - no setup required!
   - Optionally, get your own key for unlimited usage:
     - Visit [OpenRouter.ai](https://openrouter.ai)
     - Sign up for a free account
     - Copy your API key

4. **Configure the app** (Optional):
   - The app works immediately with the default key
   - To use your own key:
     - Click the settings icon (⚙️) in the top-right
     - Paste your OpenRouter API key
     - Check "Save custom API key locally"
     - Click "Save"
   - To use the default key:
     - Leave the API key field empty
     - Click "Save"

5. **Start learning**:
   - Try one of the example prompts
   - Or ask your own biology questions!

## 📱 Usage Guide

### Asking Questions

1. **Type your question** in the input field at the bottom
2. **Press Send** or hit Enter
3. **View the answer** with structured, easy-to-understand explanations

### Example Questions

- "Describe the photosynthesis process in detail"
- "Show me a diagram of the human heart"
- "What is Amoeba? Explain its structure"
- "Explain the structure and function of DNA"
- "What are the stages of mitosis?"
- "Describe the respiratory system in humans"

### Generating Diagrams

1. **After receiving an answer**, click the "Generate Diagram" button
2. **Wait a moment** while the AI creates a labeled diagram
3. **Download or share** the diagram using the action buttons

### Using Related Questions

- After each answer, BioBrain suggests 3-5 related questions
- Click any question to explore that topic
- Build comprehensive knowledge step-by-step

### Managing History

- Click the **menu icon** (☰) to open the sidebar
- **View past conversations** and click to reload them
- **Start a new chat** with the "New Chat" button
- **Clear history** if needed (this cannot be undone)

### Saving Content

- Click **"Save"** on any answer to store it for offline review
- **Download diagrams** to your device
- **Share diagrams** with classmates (on supported devices)

## 🔧 Technical Details

### Technologies Used

- **Frontend**: Pure HTML5, CSS3, and JavaScript (no frameworks needed)
- **API**: OpenRouter AI API (gpt-3.5-turbo model)
- **Default API Key**: Built-in for immediate use
- **Image Generation**: Pollinations.ai (free, no API key required)
- **Storage**: localStorage for offline data persistence
- **Service Worker**: For offline support and caching
- **Deployment**: Optimized for Vercel (see DEPLOYMENT.md)

### File Structure

```
biobrain/
├── index.html          # Main HTML structure
├── styles.css          # All styling (mobile-first)
├── app.js             # Application logic with default API key
├── sw.js              # Service worker for offline support
├── vercel.json        # Vercel deployment configuration
├── .env               # Environment variables (for local dev)
├── .env.production    # Production environment variables
├── DEPLOYMENT.md      # Vercel deployment guide
└── README.md          # This file
```

### API Key System

BioBrain AI uses a **dual API key system**:

1. **Default API Key**
   - Built into the application
   - Shared among all users
   - Works immediately - no setup required
   - Perfect for demos and quick testing

2. **Custom API Key (Optional)**
   - Users can provide their own OpenRouter API key
   - Stored locally in browser
   - Provides unlimited usage with user's quota
   - Privacy-focused - only stored on user's device

### API Integration

The app uses OpenRouter's API with a carefully crafted system prompt:

```javascript
"You are BioBrain AI, an expert biology tutor for Class 11 students..."
```

This ensures:
- Accurate, curriculum-aligned answers
- Appropriate language level for students
- Structured, educational responses
- No hallucinations or incorrect information

### Privacy & Security

- **API Key**: Stored locally in your browser (base64 encoded)
- **Chat History**: Saved only on your device
- **No Server**: All data stays on your device
- **No Tracking**: No analytics or third-party tracking

## 🎓 For Students

### Best Practices

1. **Ask Specific Questions**: The more specific your question, the better the answer
2. **Follow Up**: Use related questions to explore topics deeply
3. **Generate Diagrams**: Visual learning helps retention
4. **Save Important Content**: Build your own study library
5. **Review Regularly**: Revisit saved answers before exams

### Study Tips

- Use BioBrain to **clarify** concepts from class
- Generate diagrams to **visualize** complex processes
- Follow related questions to **connect** different topics
- Save key explanations for **quick review**

## 📱 Mobile Optimization

BioBrain is specifically designed for mobile devices:

- **Touch Gestures**: Swipe, tap, and scroll naturally
- **Readable Text**: Large, clear fonts
- **Efficient Layout**: Maximizes screen space
- **Fast Loading**: Lightweight and optimized
- **Offline Mode**: Works without internet after first load

## 🔒 Data & Privacy

- **Local Storage**: All data stored on your device
- **No Account Required**: Use immediately, no sign-up
- **Secure API Calls**: Direct HTTPS connections
- **Your Control**: Delete history anytime

## 🐛 Troubleshooting

### "No API Key" Error
- Click settings (⚙️) and enter your OpenRouter API key
- Make sure you've copied the entire key
- Check "Save API key locally" to remember it

### Slow Responses
- Check your internet connection
- The free API tier may have rate limits
- Try again in a few moments

### Diagrams Not Loading
- Some diagram requests may take longer
- Ensure you have a stable internet connection
- Try regenerating if it fails

### Can't See Chat History
- Check if your browser allows localStorage
- Try using a different browser
- Clear cache and reload if needed

## 🚀 Future Enhancements

Potential features for future versions:

- [ ] Voice input for questions
- [ ] Flashcard generation from topics
- [ ] Quiz mode for self-testing
- [ ] Bookmarks and tags for organization
- [ ] PDF export of conversations
- [ ] Dark mode for night studying
- [ ] Multi-language support
- [ ] Collaborative study groups

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on mobile devices
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **OpenRouter**: For providing accessible AI APIs
- **Pollinations.ai**: For free image generation
- **Class 11 Students**: The inspiration for this project

## 📞 Support

Having issues or questions?

- Open an issue on GitHub
- Check the troubleshooting section above
- Review OpenRouter's documentation

## 🎯 Project Goals

BioBrain AI was created to:

1. **Democratize Education**: Provide free AI tutoring to all students
2. **Support Mobile Learning**: Make studying possible anywhere, anytime
3. **Ensure Accuracy**: Deliver reliable, curriculum-aligned information
4. **Enhance Understanding**: Use visuals and follow-ups for deep learning
5. **Build Confidence**: Help students master Class 11 biology

---

**Made with ❤️ for Biology Students**

*Learn better. Study smarter. Understand deeper.*

🧬 **BioBrain AI** - Your intelligent biology companion
