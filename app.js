// server.js

const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Endpoint to get questions
app.post('/api/questions', async (req, res) => {
  const { skill, level } = req.body;

  if (!skill || !level) {
    return res.status(400).json({ error: 'Skill and level are required.' });
  }

  const skillPath = skill.toLowerCase();
  const levelPath = level.toLowerCase();
  const url = `https://api.github.com/repos/Siraj617/QuestionBank/contents/${skillPath}/${levelPath}/question.json`;

  try {
    console.log(`Fetching questions for skill: ${skill}, level: ${level}`);

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer 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`,
        Accept: 'application/vnd.github.v3.raw',
      },
    });

    if (response.status === 200) {
      let retrievedQuestions = response.data;

      // Decode if needed
      if (typeof retrievedQuestions === 'string') {
        retrievedQuestions = JSON.parse(
          Buffer.from(retrievedQuestions, 'base64').toString('utf-8')
        );
      }

      return res.json({ skill, level, questions: retrievedQuestions });
    } else {
      return res.status(response.status).json({ error: response.statusText });
    }
  } catch (error) {
    console.error('Error retrieving questions:', error);
    return res.status(500).json({ error: 'Failed to retrieve questions.', details: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
