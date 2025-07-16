import OpenAI from 'openai';
import { AIResponse, VoiceCommand } from '../shared/types/common.types';

interface OpenAIConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
}

class AIService {
  private openai: OpenAI;
  private config: OpenAIConfig;

  constructor() {
    this.config = {
      apiKey: process.env.OPENAI_API_KEY || '',
      model: 'gpt-3.5-turbo',
      maxTokens: 200
    };
    
    this.openai = new OpenAI({
      apiKey: this.config.apiKey
    });
  }

  async processVoiceCommand(voiceText: string): Promise<VoiceCommand | null> {
    try {
      const systemPrompt = `You are a voice command parser for a chat app. 
      Parse voice commands and return JSON with:
      - action: (send, read, show, call, search)
      - recipient: person's name (if applicable)
      - message: message content (if applicable)
      - confidence: 0-1 score
      
      Examples:
      "Send message to John saying hello" -> {"action": "send", "recipient": "John", "message": "hello", "confidence": 0.9}
      "Read my messages" -> {"action": "read", "confidence": 0.8}`;

      const response = await this.openai.chat.completions.create({
        model: this.config.model,
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: voiceText
          }
        ],
        max_tokens: this.config.maxTokens,
        temperature: 0.3
      });

      const content = response.choices[0]?.message?.content;
      if (!content) return null;

      const parsed = JSON.parse(content) as VoiceCommand;
      parsed.rawTranscript = voiceText;
      
      return parsed;
    } catch (error) {
      console.error('AI processing error:', error);
      return null;
    }
  }

  async generateResponse(
    context: string, 
    userMessage: string
  ): Promise<AIResponse> {
    try {
      const response = await this.openai.chat.completions.create({
        model: this.config.model,
        messages: [
          {
            role: "system",
            content: `You are a helpful AI assistant integrated into a chat app. 
            Context: ${context}
            Provide concise, helpful responses.`
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      });

      const content = response.choices[0]?.message?.content;
      
      return {
        success: true,
        data: content,
        confidence: 0.9
      };
    } catch (error) {
      console.error('AI response generation error:', error);
      return {
        success: false,
        error: 'Failed to generate AI response'
      };
    }
  }
}

export default AIService;