import OpenAI from 'openai';

async function main() {
  console.log('Testing OpenAI API connection...');
  
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('Error: OPENAI_API_KEY is missing in environment variables.');
    return;
  }
  
  console.log(`API Key found: ${apiKey.substring(0, 10)}...`);

  const openai = new OpenAI({ apiKey });

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Hello, are you working?' }],
    });

    console.log('Success! Response:', response.choices[0].message.content);
  } catch (error) {
    console.error('API Error:', error);
  }
}

main();
