import React, { useState } from 'react';
import axios from 'axios';
import '../css/AiToolRunner.css'; 
import BASE_URL from '../api.js';

const AiToolRunner = () => {
    const [prompt, setPrompt] = useState('');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!prompt) {
            alert('Please enter a prompt');
            return;
        }

        try {
            setLoading(true);
            setOutput('');

            const token = localStorage.getItem('token');

            const response = await axios.post(
                `${BASE_URL}/ai/run`,
                {
                    prompt,
                    toolId: '665b8e9c2d5a6e45a1e8b357'  
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setOutput(response.data.output);
        } catch (err) {
            setOutput(`Error: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-container">
            <h2 className="ai-title">Talk to Gemini AI</h2>
            <form onSubmit={handleSubmit} className="ai-form">
                <textarea
                    className="ai-textarea"
                    rows="5"
                    placeholder="Ask anything..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                ></textarea>
                <button type="submit" className="ai-button" disabled={loading}>
                    {loading ? 'Thinking...' : 'Generate Response'}
                </button>
            </form>

            {output && (
                <div className="ai-output">
                    <h5>Gemini's Response:</h5>
                    <p>{output}</p>
                </div>
            )}
        </div>
    );
};

export default AiToolRunner;
