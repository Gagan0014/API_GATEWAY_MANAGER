/**
 * Intelligent LLM Router
 * Routes requests to the most appropriate LLM based on:
 * - Prompt complexity
 * - Cost optimization
 * - Model specialization
 * - Availability
 */

const { createProvider } = require('./llm-providers');

class LLMRouter {
  constructor() {
    this.providers = new Map();
    this.requestHistory = [];
    this.costTracking = {};
  }

  registerProvider(name, apiKey, model) {
    const provider = createProvider(name, apiKey, model);
    this.providers.set(name, { provider, model });
    this.costTracking[name] = { totalCost: 0, totalRequests: 0 };
  }

  analyzePromptComplexity(prompt) {
    // Analyze prompt to determine complexity
    const wordCount = prompt.split(/\s+/).length;
    const codePresent = /```|function|class|const|let|var/.test(prompt);
    const multiLine = prompt.split('\n').length > 3;
    const hasQuery = /\?/.test(prompt);

    let complexity = 'simple';
    if (wordCount > 100 || codePresent || (multiLine && hasQuery)) {
      complexity = 'complex';
    } else if (wordCount > 50) {
      complexity = 'medium';
    }

    return { complexity, wordCount, codePresent, multiLine };
  }

  selectProvider(complexity, costOptimized = false) {
    const providers = Array.from(this.providers.keys());

    if (providers.length === 0) {
      throw new Error('No LLM providers registered');
    }

    if (costOptimized) {
      // Select cheapest provider for simple tasks
      let cheapestProvider = providers[0];
      let lowestCost = this.costTracking[providers[0]].totalCost / Math.max(1, this.costTracking[providers[0]].totalRequests);

      for (const provider of providers) {
        const avgCost = this.costTracking[provider].totalCost / Math.max(1, this.costTracking[provider].totalRequests);
        if (avgCost < lowestCost) {
          lowestCost = avgCost;
          cheapestProvider = provider;
        }
      }
      return cheapestProvider;
    } else {
      // Select best provider for complex tasks (OpenAI if available, else first)
      return this.providers.has('openai') ? 'openai' : providers[0];
    }
  }

  async routeRequest(prompt, options = {}) {
    const { complexity } = this.analyzePromptComplexity(prompt);
    const costOptimized = options.costOptimized || false;
    const selectedProvider = this.selectProvider(complexity, costOptimized);

    const { provider, model } = this.providers.get(selectedProvider);
    const result = await provider.generateCompletion(prompt, options);

    // Track cost and usage
    if (result.success) {
      this.costTracking[selectedProvider].totalCost += parseFloat(result.cost);
      this.costTracking[selectedProvider].totalRequests++;

      this.requestHistory.push({
        provider: selectedProvider,
        model: model,
        prompt: prompt.substring(0, 100) + '...',
        promptComplexity: complexity,
        timestamp: new Date(),
        cost: result.cost,
        tokens: result.tokens,
      });
    }

    return {
      ...result,
      routedProvider: selectedProvider,
      costOptimized,
      promptAnalysis: { complexity },
    };
  }

  getCostSummary() {
    let totalCost = 0;
    const breakdown = {};

    for (const [provider, tracking] of Object.entries(this.costTracking)) {
      breakdown[provider] = {
        totalCost: tracking.totalCost.toFixed(6),
        totalRequests: tracking.totalRequests,
        avgCostPerRequest: (tracking.totalCost / Math.max(1, tracking.totalRequests)).toFixed(8),
      };
      totalCost += tracking.totalCost;
    }

    return {
      totalCost: totalCost.toFixed(6),
      breakdown,
      requestHistory: this.requestHistory.slice(-10), // Last 10 requests
    };
  }
}

module.exports = LLMRouter;
