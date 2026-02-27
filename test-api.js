const apiKey = process.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    console.error("API key not found in .env file!");
    process.exit(1);
}

async function testApi() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Hello, testing from India with a new API key!" }] }]
            })
        });

        if (!response.ok) {
            console.log(`HTTP Error Status: ${response.status}`);
            try {
                const errorData = await response.json();
                console.log("Error details:", JSON.stringify(errorData, null, 2));
            } catch (e) {
                console.log("Could not parse error response");
            }
            return;
        }

        const data = await response.json();
        console.log("Success! API Key is working. Response:");
        console.log(data.candidates?.[0]?.content?.parts?.[0]?.text);
    } catch (error) {
        console.error("Network or fetch error:", error);
    }
}

testApi();
