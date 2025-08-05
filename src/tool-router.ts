/**
 * Smart Tool Router for GoHighLevel MCP Server
 * Dynamically selects relevant tools based on user intent
 * Ensures we stay under OpenAI's 128 tool limit
 */

// Define a more flexible tool type that matches what we actually use
export interface ToolDefinition {
  name: string;
  description?: string;
  inputSchema: {
    type: string;
    properties?: any;
    required?: string[];
  };
  [key: string]: any;
}

export interface ToolCategory {
  name: string;
  keywords: string[];
  toolPatterns: string[];
  maxTools?: number;
}

export class ToolRouter {
  private toolCategories: ToolCategory[] = [
    {
      name: 'contact_management',
      keywords: ['contact', 'person', 'people', 'customer', 'client', 'lead', 'user'],
      toolPatterns: ['contact', 'duplicate', 'follower'],
      maxTools: 40
    },
    {
      name: 'communication',
      keywords: ['message', 'email', 'sms', 'chat', 'conversation', 'send', 'reply', 'communicate'],
      toolPatterns: ['conversation', 'message', 'email', 'sms'],
      maxTools: 30
    },
    {
      name: 'sales',
      keywords: ['opportunity', 'deal', 'pipeline', 'sale', 'revenue', 'close', 'won', 'lost'],
      toolPatterns: ['opportunity', 'pipeline'],
      maxTools: 20
    },
    {
      name: 'calendar',
      keywords: ['appointment', 'calendar', 'schedule', 'meeting', 'event', 'availability', 'book'],
      toolPatterns: ['calendar', 'appointment', 'slot', 'availability'],
      maxTools: 40
    },
    {
      name: 'marketing',
      keywords: ['campaign', 'workflow', 'automation', 'trigger', 'action', 'marketing'],
      toolPatterns: ['campaign', 'workflow', 'trigger'],
      maxTools: 20
    },
    {
      name: 'content',
      keywords: ['blog', 'post', 'article', 'content', 'media', 'image', 'video'],
      toolPatterns: ['blog', 'media', 'post'],
      maxTools: 20
    },
    {
      name: 'commerce',
      keywords: ['product', 'price', 'store', 'payment', 'invoice', 'order', 'subscription'],
      toolPatterns: ['product', 'price', 'store', 'payment', 'invoice', 'order'],
      maxTools: 30
    },
    {
      name: 'location',
      keywords: ['location', 'business', 'company', 'settings', 'configuration'],
      toolPatterns: ['location'],
      maxTools: 25
    },
    {
      name: 'analytics',
      keywords: ['report', 'analytics', 'stats', 'metrics', 'data', 'survey', 'feedback'],
      toolPatterns: ['survey', 'report', 'stats'],
      maxTools: 15
    },
    {
      name: 'social',
      keywords: ['social', 'facebook', 'instagram', 'google', 'review', 'post'],
      toolPatterns: ['social', 'oauth', 'facebook', 'instagram', 'google'],
      maxTools: 20
    }
  ];

  /**
   * Detect intent from user message and context
   */
  detectIntent(message: string, context?: any): string[] {
    const lowerMessage = message.toLowerCase();
    const detectedCategories: string[] = [];
    
    // Check each category for keyword matches
    for (const category of this.toolCategories) {
      const keywordMatches = category.keywords.filter(keyword => 
        lowerMessage.includes(keyword)
      ).length;
      
      if (keywordMatches > 0) {
        detectedCategories.push(category.name);
      }
    }
    
    // If no specific intent detected, return general categories
    if (detectedCategories.length === 0) {
      // Default to most common operations
      return ['contact_management', 'communication', 'location'];
    }
    
    return detectedCategories;
  }

  /**
   * Filter tools based on detected intents
   */
  filterToolsByIntent(allTools: ToolDefinition[], intents: string[], maxTools: number = 120): ToolDefinition[] {
    const selectedTools: ToolDefinition[] = [];
    const toolsPerCategory = Math.floor(maxTools / intents.length);
    
    for (const intent of intents) {
      const category = this.toolCategories.find(cat => cat.name === intent);
      if (!category) continue;
      
      // Find tools matching this category
      const categoryTools = allTools.filter(tool => {
        const toolName = tool.name.toLowerCase();
        return category.toolPatterns.some(pattern => toolName.includes(pattern));
      });
      
      // Add tools up to the limit for this category
      const limit = Math.min(
        category.maxTools || toolsPerCategory,
        toolsPerCategory
      );
      
      selectedTools.push(...categoryTools.slice(0, limit));
    }
    
    // If we still have room, add some general tools
    if (selectedTools.length < maxTools) {
      const generalTools = this.getGeneralTools(allTools);
      const remainingSlots = maxTools - selectedTools.length;
      
      for (const tool of generalTools) {
        if (!selectedTools.some(t => t.name === tool.name) && selectedTools.length < maxTools) {
          selectedTools.push(tool);
        }
      }
    }
    
    return selectedTools.slice(0, maxTools);
  }

  /**
   * Get general tools that are always useful
   */
  private getGeneralTools(allTools: ToolDefinition[]): ToolDefinition[] {
    const generalToolNames = [
      'get_location',
      'search_contacts',
      'get_contact',
      'create_contact',
      'update_contact',
      'get_conversation',
      'create_conversation',
      'send_message',
      'get_opportunity',
      'create_opportunity',
      'get_calendar_appointments',
      'create_calendar_appointment'
    ];
    
    return allTools.filter(tool => generalToolNames.includes(tool.name));
  }

  /**
   * Smart tool selection with context
   */
  selectTools(
    allTools: ToolDefinition[], 
    userMessage: string, 
    previousMessages?: any[],
    maxTools: number = 120
  ): {
    tools: ToolDefinition[];
    detectedIntents: string[];
    toolCount: number;
  } {
    // Build context from previous messages if available
    let fullContext = userMessage;
    if (previousMessages && previousMessages.length > 0) {
      const recentMessages = previousMessages.slice(-3); // Last 3 messages
      fullContext = recentMessages
        .map(m => m.content || '')
        .join(' ') + ' ' + userMessage;
    }
    
    // Detect intents
    const intents = this.detectIntent(fullContext);
    
    // Filter tools based on intents
    const selectedTools = this.filterToolsByIntent(allTools, intents, maxTools);
    
    return {
      tools: selectedTools,
      detectedIntents: intents,
      toolCount: selectedTools.length
    };
  }

  /**
   * Get tool categories for a specific tool
   */
  getToolCategories(toolName: string): string[] {
    const categories: string[] = [];
    const lowerToolName = toolName.toLowerCase();
    
    for (const category of this.toolCategories) {
      if (category.toolPatterns.some(pattern => lowerToolName.includes(pattern))) {
        categories.push(category.name);
      }
    }
    
    return categories;
  }
}