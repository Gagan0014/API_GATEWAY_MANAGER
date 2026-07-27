/**
 * LLM Provider Adapters for Multi-LLM Support
 * Supports: OpenAI, Hugging Face, Cohere
 */

const axios = require('axios');
const crypto = require('crypto');

class LLMProvider {
  constructor(apiKey, model) {
    this.apiKey = apiKey;
    this.model = model;
    this.requestCount = 0;
    this.totalTokensUsed = 0;
    this.totalCost = 0;
  }

  async generateCompletion(prompt, options = {}) {
    throw new Error('generateCompletion must be implemented');
  }

  calculateTokens(text) {
    // Rough estimation: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  }
}

// OpenAI Provider
class OpenAIProvider extends LLMProvider {
  async generateCompletion(prompt, options = {}) {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: this.model || 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: options.temperature || 0.7,
          max_tokens: options.max_tokens || 500,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const usage = response.data.usage;
      this.totalTokensUsed += usage.total_tokens;
      this.totalCost += (usage.total_tokens * 0.000002); // Rough pricing
      this.requestCount++;

      return {
        success: true,
        provider: 'OpenAI',
        model: this.model,
        response: response.data.choices[0].message.content,
        tokens: usage.total_tokens,
        cost: (usage.total_tokens * 0.000002).toFixed(6),
      };
    } catch (error) {
      return {
        success: false,
        provider: 'OpenAI',
        error: error.message,
      };
    }
  }
}

// Hugging Face Provider
class HuggingFaceProvider extends LLMProvider {
  async generateCompletion(prompt, options = {}) {
    try {
      const response = await axios.post(
        `https://api-inference.huggingface.co/models/${this.model}`,
        { inputs: prompt },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const tokens = this.calculateTokens(prompt) + this.calculateTokens(response.data[0].generated_text);
      this.totalTokensUsed += tokens;
      this.totalCost += (tokens * 0.0000005); // Rough pricing
      this.requestCount++;

      return {
        success: true,
        provider: 'HuggingFace',
        model: this.model,
        response: response.data[0].generated_text,
        tokens: tokens,
        cost: (tokens * 0.0000005).toFixed(6),
      };
    } catch (error) {
      return {
        success: false,
        provider: 'HuggingFace',
        error: error.message,
      };
    }
  }
}

// Cohere Provider
class CohereProvider extends LLMProvider {
  async generateCompletion(prompt, options = {}) {
    try {
      const response = await axios.post(
        'https://api.cohere.ai/v1/generate',
        {
          prompt: prompt,
          model: this.model || 'command',
          max_tokens: options.max_tokens || 500,
          temperature: options.temperature || 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const tokens = this.calculateTokens(prompt) + this.calculateTokens(response.data.generations[0].text);
      this.totalTokensUsed += tokens;
      this.totalCost += (tokens * 0.000003); // Rough pricing
      this.requestCount++;

      return {
        success: true,
        provider: 'Cohere',
        model: this.model,
        response: response.data.generations[0].text,
        tokens: tokens,
        cost: (tokens * 0.000003).toFixed(6),
      };
    } catch (error) {
      return {
        success: false,
        provider: 'Cohere',
        error: error.message,
      };
    }
  }
}

// Provider Factory
function createProvider(provider, apiKey, model) {
  switch (provider.toLowerCase()) {
    case 'openai':
      return new OpenAIProvider(apiKey, model);
    case 'huggingface':
      return new HuggingFaceProvider(apiKey, model);
    case 'cohere':
      return new CohereProvider(apiKey, model);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

module.exports = {
  LLMProvider,
  OpenAIProvider,
  HuggingFaceProvider,
  CohereProvider,
  createProvider,
};
