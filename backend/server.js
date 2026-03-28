require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { Groq } = require('groq-sdk');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || 'dummy' });

// Middleware
app.use(cors());
app.use(express.json());

// Serve Frontend Static Files
app.use(express.static(path.join(__dirname, '../frontend')));

// Multer Config for Resume Upload
const upload = multer({ storage: multer.memoryStorage() });

// --- API ROUTES ---

// 1. Contact Form
app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'Please provide name, email, and message.' });
    }

    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn("EMAIL_USER or EMAIL_PASS not set. Simulating success response.");
            return res.status(200).json({ success: true, message: 'Thank you for your message! (Simulated - Email missing keys)' });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"${name}" <${process.env.EMAIL_USER}>`,
            replyTo: email,
            to: process.env.EMAIL_USER,
            subject: `Portfolio Contact: ${subject || 'New Message'}`,
            text: `You have received a new message from your portfolio website.\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
            html: `
                <h3>New Contact Message</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <hr>
                <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>
            `
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Thank you for your message! I will get back to you soon.' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Something went wrong sending the email. Please try again later.' });
    }
});

// 2. GitHub Projects
app.get('/api/github', async (req, res) => {
    try {
        const username = 'subodh182';
        const response = await axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=8`, {
            headers: { 'User-Agent': 'Portfolio-App' }
        });

        const projects = response.data.map(repo => ({
            name: repo.name,
            description: repo.description,
            url: repo.html_url,
            homepage: repo.homepage || null, // For Live Demo links
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language || 'Code',
            default_branch: repo.default_branch
        }));

        res.json({ success: true, projects });
    } catch (error) {
        const fallbackProjects = [
            { name: 'AI Chatbot Interface', description: 'Groq powered AI interface.', url: '#', homepage: '#', stars: 25, forks: 4, language: 'Python', default_branch: 'main' },
            { name: 'Portfolio Website V3', description: 'Modern feature-rich portfolio.', url: '#', homepage: '#', stars: 12, forks: 2, language: 'HTML', default_branch: 'main' },
            { name: 'Resume Analyzer', description: 'AI tool to review resumes.', url: '#', homepage: null, stars: 8, forks: 1, language: 'JavaScript', default_branch: 'main' },
            { name: 'Machine Learning Basics', description: 'Jupyter notebooks for ML.', url: '#', homepage: null, stars: 40, forks: 10, language: 'Jupyter Notebook', default_branch: 'main' }
        ];
        res.json({ success: true, projects: fallbackProjects });
    }
});

// 2b. GitHub Readme Fetcher for Case Studies
app.get('/api/github/readme', async (req, res) => {
    try {
        const { repo, branch } = req.query;
        if (!repo) return res.status(400).json({ error: "Repo name required." });
        const username = 'subodh182';
        const url = `https://raw.githubusercontent.com/${username}/${repo}/${branch || 'main'}/README.md`;

        const response = await axios.get(url);
        res.json({ success: true, readme: response.data });
    } catch (error) {
        res.json({ success: false, readme: "Failed to load Readme or Readme does not exist for this repository." });
    }
});

// 3. AI Chatbot + Voice Assistant (Groq API)
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
        return res.json({ response: "AI features are currently disabled. Please configure the GROQ_API_KEY." });
    }

    try {
        const systemPrompt = `You are a helpful portfolio assistant for Subodh Singh, a Computer Science student and aspiring AI/Full Stack Developer.
        He knows Python, JavaScript, HTML, CSS, Node.js, AI Tools, and uses the Groq API.
        Keep your answers concise, professional, and friendly. Answer specifically about his skills, projects, and contact info. If asked via voice (you won't know, but be conversational), keep sentences naturally readable.`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 150,
        });

        res.json({ response: chatCompletion.choices[0]?.message?.content || "I'm not sure how to answer that." });
    } catch (error) {
        console.error("Groq Chat Error:", error);
        res.status(500).json({ response: "Sorry, my AI brain is currently offline." });
    }
});

// 4. AI Resume Analyzer (Structured JSON)
app.post('/api/analyze-resume', upload.single('resume'), async (req, res) => {
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
        return res.status(500).json({ error: "GROQ_API_KEY is not configured on the server." });
    }
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
    }

    try {
        let resumeText = '';
        if (req.file.mimetype === 'application/pdf') {
            const data = await pdfParse(req.file.buffer);
            resumeText = data.text;
        } else {
            resumeText = req.file.buffer.toString('utf8');
        }

        const prompt = `You are an expert tech recruiter and AI Resume Analyzer scoring a candidate. Given the following document text, evaluate it thoroughly.
        First, determine if the document is actually a resume. If it is clearly not a resume (e.g., a bank statement, a receipt, a manual, or completely random text), you MUST return {"isResume": false} and nothing else.
        If it IS a resume, you MUST return ONLY valid JSON with the following exact keys:
        - "isResume" (Boolean, true)
        - "resumeScore" (Integer out of 100)
        - "atsScore" (Integer out of 100 representing parsability/ATS-readiness)
        - "skillsDetected" (Array of 3 to 6 strings)
        - "missingSkills" (Array of 2 to 4 strings that would improve the candidate profile)
        - "suggestions" (Array of 2 to 3 actionable improvement sentences)

        Document Text:\n${resumeText.substring(0, 3000)}`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            temperature: 0.1, // low temp for JSON format stability
            response_format: { type: "json_object" },
        });

        const jsonResult = JSON.parse(chatCompletion.choices[0]?.message?.content || '{}');
        
        if (jsonResult.isResume === false) {
            return res.status(400).json({ error: "FILE NOT VALID: Please upload a valid resume to be analyzed." });
        }
        
        res.json({ analysis: jsonResult });
    } catch (error) {
        console.error("Resume Analyzer Error:", error);
        res.status(500).json({ error: "Failed to parse or analyze the resume." });
    }
});

// 5. AI Skill Recommendation Tool
app.post('/api/recommend-skills', async (req, res) => {
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
        return res.status(500).json({ error: "GROQ_API_KEY is not configured." });
    }

    const { currentSkills } = req.body;
    if (!currentSkills || !Array.isArray(currentSkills)) {
        return res.status(400).json({ error: "Provide an array of current skills." });
    }

    try {
        const prompt = `You are an AI career counselor for developers. The user currently knows: ${currentSkills.join(', ')}.
        Suggest exactly 3 modern, highly valuable tools/frameworks/languages they should learn next to level up.
        You MUST return ONLY valid JSON with the exact key "recommendations" containing an array of objects.
        Each object must have "skill" (string) and "reason" (short string explanation).`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            temperature: 0.6,
            response_format: { type: "json_object" },
        });

        const jsonResult = JSON.parse(chatCompletion.choices[0]?.message?.content || '{"recommendations":[]}');
        res.json({ success: true, recommendations: jsonResult.recommendations });
    } catch (error) {
        console.error("Skill Recommender Error:", error);
        res.status(500).json({ error: "Failed to generate recommendations." });
    }
});

// Vercel Serverless Export or Local Listen
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}
module.exports = app;
