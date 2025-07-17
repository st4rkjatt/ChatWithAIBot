const axios = require("axios");
const OpenAI = require('openai')
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

module.exports.tts = async (req, res, next) => {
  try {

    let { text } = req.body;

    if (typeof text !== 'string') {
      text = JSON.stringify(text)
    }
    console.log(typeof text, text, 'text')
    if (!text) {
      return res.status(400).json({ error: "Missing 'text' in request body" });
    }


    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are a voice-controlled assistant And Your Name is Stark. You must do one of the following:

1. If the user gives a **normal chat input** (like "How are you?" or "What's the weather?"), return:
{
  "intent": "chat",
  "response": "<response>"
}

2. If the user gives a **command** like:
- "Send message to [Recipient]: [Message1]; [Message2]"

Then return structured JSON like:

For sending messages:
{
  "intent": "send_message",
  "recipient": "aman",
  "messages": ["Hello", "Did you reach safely?"],
  "response": "message sent to aman"
}

For checking messages:
{
  "intent": "check_message",
  "recipient": "Riya"
}



3. **Check Messages / Media**

Examples and output:

a) "Show last message from Riya"
{
  "intent": "check_message",
  "recipient": "Riya",
  "type": "text",
  "limit": 1
}

b) "Show last 5 messages from John"
{
  "intent": "check_message",
  "recipient": "John",
  "type": "text",
  "limit": 5
}

c) "Show last image from Ankit"
{
  "intent": "check_message",
  "recipient": "Ankit",
  "type": "image",
  "limit": 1
}

d) "Show last 3 videos from Aman"
{
  "intent": "check_message",
  "recipient": "Aman",
  "type": "video",
  "limit": 3
}





 
4. Sometimes you may receive like ** Last messages found** :
{
  "message": "Last messages found",
  "status": true,
  "result": [
    {
      "_id": "...",
      "senderId": "...",
      "receiverId": "...",
      "message": "Rahul is coming.",
      ...
    }
  ]
}

In that case, extract the 'message' field from the first object inside 'result', and respond like:

{
  "intent": "chat",
  "response": "The last message was Rahul is coming."
}




5. when ever you will get message like **Close the model or close the popup** so return:

{
  "intent": "close_modal",
  "response": "Modal is closed."
}

Only respond in JSON. Detect and act smartly.
`
        },
        {
          role: "user",
          content: text // ← your user's voice transcription
        }
      ]
    });
    console.log(completion, 'completion')

    const post = completion?.choices[0]?.message?.content ?? '';
    return res.status(200).json({ success: true, result: post });
  } catch (error) {
    // console.log(error, 'error')
    console.log(error.error, 'error')
    return error.error
  }
};
