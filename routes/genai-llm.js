/**
 * GenAI LLM Routes
 * Endpoints for AI-powered text generation with multi-provider support
 */

const express = require('express');
const router = express.Router();
const LLMRouter = require('../genai/llm-router');
// const { verifyToken } = require('../middleware/auth'); // Assuming auth middleware exists

let llmRouter = null;

// Initialize LLM Router middleware
function initializeLLMRouter() {
  if (!llmRouter) {
    llmRouter = new LLMRouter();
    
    // Register providers from environment variables
    if (process.env.OPENAI_API_KEY) {
      llmRouter.registerProvider('openai', process.env.OPENAI_API_KEY, process.env.OPENAI_MODEL || 'gpt-3.5-turbo');
    }
    if (process.env.HUGGINGFACE_API_KEY) {
      llmRouter.registerProvider('huggingface', process.env.HUGGINGFACE_API_KEY, process.env.HUGGINGFACE_MODEL || 'gpt2');
    }
    if (process.env.COHERE_API_KEY) {
      llmRouter.registerProvider('cohere', process.env.COHERE_API_KEY, process.env.COHERE_MODEL || 'command');
    }
  }
  return llmRouter;
}

// POST /api/genai/generate
// Generate text using any available LLM provider
router.post('/generate', async (req, res) => {
  try {
    const { prompt, provider, costOptimized, options } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const router = initializeLLMRouter();

    if (provider && !router.providers.has(provider)) {
      return res.status(400).json({ error: `Provider '${provider}' not available` });
    }

    const result = await router.routeRequest(prompt, {
      costOptimized: costOptimized || false,
      ...options,
    });

    res.json({
      success: result.success,
      data: result,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      error: 'Generation failed',
      details: error.message,
    });
  }
});

// GET /api/genai/providers
// Get list of available LLM providers
router.get('/providers', (req, res) => {
  try {
    const router = initializeLLMRouter();
    const providers = Array.from(router.providers.keys());

    res.json({
      available: providers,
      count: providers.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/genai/cost-summary
// Get cost tracking summary
router.get('/cost-summary', (req, res) => {
  try {
    const router = initializeLLMRouter();
    const summary = router.getCostSummary();

    res.json({
      costTracking: summary,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/genai/batch
// Batch process multiple prompts
router.post('/batch', async (req, res) => {
  try {
    const { prompts, costOptimized } = req.body;

    if (!Array.isArray(prompts) || prompts.length === 0) {
      return res.status(400).json({ error: 'Prompts array is required' });
    }

    const router = initializeLLMRouter();
    const results = [];
    let totalCost = 0;

    for (const prompt of prompts) {
      const result = await router.routeRequest(prompt, { costOptimized });
      results.push(result);
      if (result.cost) totalCost += parseFloat(result.cost);
    }

    res.json({
      batchSize: prompts.length,
      results,
      totalCost: totalCost.toFixed(6),
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      error: 'Batch processing failed',
      details: error.message,
    });
  }
});

module.exports = router;
