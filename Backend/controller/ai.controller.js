import Tool from '../model/Tool.js';
import axios from 'axios';

export const runToolAI = async (req, res) => {
  const { toolId, prompt } = req.body;

  try {
    const tool = await Tool.findById(toolId);
    if (!tool || !tool.apiURL || !tool.apiKey) {
      return res.status(400).json({ message: 'Invalid or incomplete tool configuration' });
    }

    // Check integration type
    const integration = tool.integrationType.toLowerCase();
    let result;

    if (integration === 'gemini') {
      const response = await axios.post(
        `${tool.apiURL}?key=${tool.apiKey}`,
        {
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      result = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
    } else {
      return res.status(400).json({ message: 'Unsupported integration type' });
    }

    res.json({ output: result });

  } catch (err) {
    console.error('Gemini Error:', err.message);
    res.status(500).json({ message: 'AI execution failed', error: err.message });
  }
};
