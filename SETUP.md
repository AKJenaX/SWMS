# Waste Management System Setup

## AI Assistant Configuration

The AI Assistant feature requires an OpenAI API key to function. Follow these steps to set it up:

### 1. Get an OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to the API section
4. Create a new API key
5. Copy the API key (it starts with `sk-`)

### 2. Configure the Backend

1. Navigate to the `backend` directory
2. Create a `.env` file with the following content:
   ```
   OPENAI_API_KEY=your_actual_api_key_here
   ```
3. Replace `your_actual_api_key_here` with your actual OpenAI API key

### 3. Restart the Backend Server

After setting up the API key, restart the backend server:

```bash
cd backend
npm start
```

### 4. Test the AI Assistant

1. Open the frontend application
2. Click the AI Assistant button (⚡) in the bottom-right corner
3. Try asking a question like "What can you help me with?"

## Troubleshooting

- **"AI Assistant is not configured"**: Make sure you've created the `.env` file in the backend directory with a valid OpenAI API key
- **"Error contacting AI service"**: Check that the backend server is running on port 3000
- **API Key Issues**: Ensure your OpenAI API key is valid and has sufficient credits

## Security Note

Never commit the `.env` file to version control. The `.env` file is already included in `.gitignore` to prevent accidental commits.
