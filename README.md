# BAYBE Chat Interface

A minimalistic cyber-goth chat interface with a sleek black, grey, silver, and white aesthetic.

## Features

- **Cyber-goth Design**: Minimalistic interface with dark gradients and metallic accents
- **Real-time Chat**: Interactive chat with typing indicators
- **Responsive**: Works on desktop and mobile devices
- **API Integration**: Connects to OpenAI's GPT models via custom endpoint

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set your OpenAI API key:
```bash
export OPENAI_API_KEY="your-api-key-here"
```

3. Start the server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## Design Elements

- **Colors**: Black (#000000), Grey (#333333, #666666), Silver (#C0C0C0), White (#FFFFFF)
- **Typography**: Courier New monospace font
- **Effects**: Subtle gradients, glows, and animations
- **Layout**: Centered chat box with responsive design

## API Endpoint

The chat interface communicates with the `/baybe` endpoint which forwards messages to OpenAI's API.

## Customization

You can modify the system prompt in `server.js` to change BAYBE's personality and behavior.
