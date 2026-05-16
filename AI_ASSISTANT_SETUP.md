# AI Assistant Setup Guide

## Overview
The AI Assistant is a floating chat widget that provides intelligent assistance for the Waste Management System. It uses OpenAI's GPT-4o-mini model to answer questions and provide help.

## Prerequisites
- Node.js installed
- OpenAI API key (get one from https://platform.openai.com/api-keys)

## Setup Instructions

### 1. Backend Configuration
1. Navigate to the `backend` directory
2. Create a `.env` file in the backend directory
3. Add your OpenAI API key to the `.env` file:
   ```
   OPENAI_API_KEY=your_actual_api_key_here
   ```

### 2. Install Dependencies
Make sure all dependencies are installed:

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### 3. Start the Application
1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

2. Start the frontend (in a new terminal):
   ```bash
   cd frontend
   npm start
   ```

## Usage

### Accessing the AI Assistant
- Click the floating ⚡ button in the bottom-right corner
- Or press `Ctrl+K` (or `Cmd+K` on Mac) to toggle the assistant

### Features
- **Context-aware**: The assistant knows which page you're on
- **Waste Management Focused**: Optimized for waste management system questions
- **Real-time Chat**: Interactive conversation interface
- **Error Handling**: Graceful error messages for various scenarios

### Example Questions
- "How do I add a new driver?"
- "What data is available on the authority page?"
- "Show me a summary of the vehicle management features"
- "How do I search for bins?"

## Troubleshooting

### Common Issues

1. **"AI Assistant is not configured"**
   - Ensure the `.env` file exists in the backend directory
   - Verify the `OPENAI_API_KEY` is set correctly
   - Restart the backend server after adding the API key

2. **"Network error"**
   - Check if the backend server is running on port 3000
   - Verify the frontend can reach the backend API
   - Check for firewall or proxy issues

3. **"Rate limit exceeded"**
   - Wait a moment before trying again
   - Check your OpenAI API usage limits

4. **"Invalid API key"**
   - Verify the API key is correct
   - Ensure the API key has sufficient credits
   - Check if the API key is active

### API Key Security
- Never commit the `.env` file to version control
- Keep your API key secure and don't share it
- Consider using environment variables in production

## Technical Details

### Backend (Node.js/Express)
- Route: `POST /ai/chat`
- Uses OpenAI's GPT-4o-mini model
- Includes input validation and error handling
- Supports context passing from frontend

### Frontend (React)
- Floating button component with keyboard shortcut
- Real-time chat interface
- Error handling with user-friendly messages
- Context-aware based on current route

### Rate Limits
- OpenAI API has rate limits based on your plan
- The assistant includes timeout handling (30 seconds)
- Responses are limited to 600 tokens to manage costs
