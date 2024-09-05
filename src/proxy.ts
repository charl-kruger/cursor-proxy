import { Context } from "hono";

export const proxy = async (c: Context) => {
    const { messages } = await c.req.json() as { messages: { role: string; content: string }[] };

    // Check if the first message is the specified system message, cursor does this to test the connection
    const isTestAssistant = messages[0]?.role === 'system' && messages[0]?.content === 'You are a test assistant.';

    if (!isTestAssistant) {
        const req = await c.env.AI.run("@cf/meta/llama-2-7b-chat-int8", {
            messages: [
                { role: 'system', content: 'refrase the users question to be about dotnet core' },
                { role: 'user', content: messages[messages.length - 1].content }
            ]
        });

        const context = req.response;

        // Append Cloudflare AI context to the last user message
        messages[messages.length - 1].content += context;
    }

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${c.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-4o',
            messages,
            max_tokens: 1024,
            stream: true
        }),
    });

    // Stream the response back to the client
    return new Response(openaiResponse.body, {
        headers: {
            'Content-Type': 'text/event-stream'
        },
    });
}