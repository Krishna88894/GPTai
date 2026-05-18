import 'dotenv/config';

const geminiResponse = async(message) =>{
     const options ={
        method: "POST",
        headers: {
            "x-goog-api-key": process.env.GEMINI_API_KEY,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contents: [{
                role: "user",
                parts: [{
                    text: message
                }]
            }]
        })
    }

    try{
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent", options);
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
    }
    catch(error){
        console.log(error);
        return null;
    }
}

export default geminiResponse;