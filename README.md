# Professional AI Developer Portfolio

A modern, interactive, and visually stunning personal portfolio website designed for an AI developer. This project showcases advanced AI integrations, a premium Apple-inspired glassmorphism aesthetic, and seamless responsiveness across devices.

## Features

- **Apple-Inspired Glassmorphism Design**: Sleek, modern UI with a premium look, featuring smooth transitions and micro-animations.
- **Dark & Light Mode**: Seamless toggling between beautiful dark and light themes.
- **Voice AI Assistant**: Interactive voice capabilities to guide users through the portfolio.
- **GitHub-Powered Case Studies**: Dynamic modals fetching and displaying project details directly from GitHub.
- **AI-Driven Skill Recommendations**: Intelligent suggestions based on the viewer's interests or industry trends.
- **Resume Analyzer**: A structured JSON-based tool that parses and presents resume details interactively.
- **Responsive Layout**: Fully optimized for mobile, tablet, and desktop views.

## Tech Stack

- **Frontend**: HTML5, Vanilla CSS3 (Glassmorphism & animations), JavaScript (Vanilla JS for dynamic features)
- **Backend**: Node.js (Handles API requests and contact form submissions)
- **Deployment**: Serverless deployment via Vercel (`vercel.json` included)

## Project Structure

```
portfolio/
├── frontend/
│   ├── index.html   # Main application view
│   ├── styles.css   # Styling (Glassmorphism, Dark/Light modes)
│   └── script.js    # Client-side logic & AI feature integrations
├── backend/
│   └── server.js    # Node.js backend for forms and API processing
└── vercel.json      # Vercel deployment configuration
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.
- A GitHub account for Vercel deployment (optional, but recommended).

### Local Run

1. Clone or download the repository.
2. Navigate to the `backend` directory and install dependencies if any.
   ```bash
   cd portfolio/backend
   npm install
   ```
3. Start the backend server.
   ```bash
   node server.js
   ```
4. Open `frontend/index.html` in your favorite browser (or use a local server like Live Server) to view the portfolio.

### Deployment

This project is configured for easy serverless deployment on [Vercel](https://vercel.com/). 
Simply connect your GitHub repository to Vercel, and the provided `vercel.json` will handle the routing and setup automatically.

## License

This project is intended for personal portfolio use. Feel free to use it as inspiration!
