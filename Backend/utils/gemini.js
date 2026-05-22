import 'dotenv/config';

const geminiResponse = async (message) => {
    // If API key is not configured, log a warning and return null
    if (!process.env.GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY is missing — skipping external call");
        return null;
    }

    // Ensure `fetch` is available in Node environments that don't provide it.
    if (typeof fetch === 'undefined') {
        try {
            const nodeFetch = await import('node-fetch');
            // node-fetch exports default
            global.fetch = nodeFetch.default;
        } catch (e) {
            console.warn('node-fetch is not installed; install it with `npm i node-fetch` if needed');
        }
    }

    const options = {
        method: 'POST',
        headers: {
            'x-goog-api-key': process.env.GEMINI_API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{
                role: 'user',
                parts: [{ text: message }]
            }]
        })
    };

    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', options);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error?.message || `Gemini request failed with status ${response.status}`);
        }
        return data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
    } catch (error) {
        console.error('Gemini request error:', error?.message || error);
        // propagate error so callers can handle, but don't crash the process here
        throw error;
    }
};

export default geminiResponse;