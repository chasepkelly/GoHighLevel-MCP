import { config as dotenvConfig } from 'dotenv';
import { WorkflowTools } from './src/tools/workflow-tools';
import { ContactTools } from './src/tools/contact-tools';
import { GHLApiClient } from './src/clients/ghl-api-client';
import { GHLConfig } from './src/types/ghl-types';

// Load environment variables from .env file
dotenvConfig();

// Configuration - using existing .env file variables
const config: GHLConfig = {
  accessToken: process.env.GHL_API_KEY!,
  baseUrl: process.env.GHL_BASE_URL || 'https://services.leadconnectorhq.com',
  version: '2021-07-28',
  locationId: process.env.GHL_LOCATION_ID!
};

// Workflow Step Types
interface WorkflowStep {
  id: string;
  type: 'email' | 'sms' | 'delay' | 'condition' | 'tag' | 'task' | 'webhook';
  name: string;
  description: string;
  config: any;
  delay?: number; // in minutes
  conditions?: WorkflowCondition[];
}

interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: any;
}

interface WorkflowTemplate {
  name: string;
  description: string;
  category: string;
  steps: WorkflowStep[];
  triggers: string[];
  estimatedDuration: string;
}

class WorkflowBuilder {
  private ghlClient: GHLApiClient;
  private workflowTools: WorkflowTools;
  private contactTools: ContactTools;

  constructor() {
    // Validate required environment variables
    if (!config.accessToken) {
      throw new Error('GHL_API_KEY environment variable is required');
    }
    if (!config.locationId) {
      throw new Error('GHL_LOCATION_ID environment variable is required');
    }

    this.ghlClient = new GHLApiClient(config);
    this.workflowTools = new WorkflowTools(this.ghlClient);
    this.contactTools = new ContactTools(this.ghlClient);
  }

  /**
   * Get workflow templates for common scenarios
   */
  getWorkflowTemplates(): WorkflowTemplate[] {
    return [
      {
        name: 'New Lead Welcome Sequence',
        description: 'Automated welcome sequence for new leads',
        category: 'Lead Management',
        estimatedDuration: '7 days',
        triggers: ['New Contact Created', 'Lead Form Submitted'],
        steps: [
          {
            id: 'welcome-email',
            type: 'email',
            name: 'Welcome Email',
            description: 'Send welcome email immediately',
            config: {
              subject: 'Welcome! Thanks for your interest',
              template: 'welcome-email-template',
              delay: 0
            }
          },
          {
            id: 'follow-up-sms',
            type: 'sms',
            name: 'Follow-up SMS',
            description: 'Send follow-up SMS after 1 hour',
            config: {
              message: 'Hi {{firstName}}, thanks for your interest! When would be a good time to chat?',
              delay: 60
            },
            delay: 60
          },
          {
            id: 'check-engagement',
            type: 'condition',
            name: 'Check Engagement',
            description: 'Check if lead has engaged',
            config: {
              field: 'engagement_score',
              operator: 'greater_than',
              value: 0
            },
            conditions: [
              {
                field: 'engagement_score',
                operator: 'greater_than',
                value: 0
              }
            ]
          },
          {
            id: 'schedule-call',
            type: 'task',
            name: 'Schedule Follow-up Call',
            description: 'Create task for sales team',
            config: {
              title: 'Follow up with {{firstName}} {{lastName}}',
              description: 'New lead - schedule initial consultation',
              assignedTo: 'sales_team',
              dueDate: '24 hours'
            }
          }
        ]
      },
      {
        name: 'Appointment Confirmation Sequence',
        description: 'Automated appointment confirmation and reminders',
        category: 'Appointment Management',
        estimatedDuration: '3 days',
        triggers: ['Appointment Booked'],
        steps: [
          {
            id: 'confirmation-email',
            type: 'email',
            name: 'Appointment Confirmation',
            description: 'Send immediate confirmation email',
            config: {
              subject: 'Appointment Confirmed - {{appointmentDate}}',
              template: 'appointment-confirmation-template',
              delay: 0
            }
          },
          {
            id: 'calendar-invite',
            type: 'email',
            name: 'Calendar Invite',
            description: 'Send calendar invite',
            config: {
              subject: 'Calendar Invite: {{appointmentTitle}}',
              template: 'calendar-invite-template',
              delay: 5
            },
            delay: 5
          },
          {
            id: 'reminder-sms',
            type: 'sms',
            name: '24-Hour Reminder',
            description: 'Send SMS reminder 24 hours before',
            config: {
              message: 'Hi {{firstName}}, reminder: your appointment is tomorrow at {{appointmentTime}}. Reply STOP to cancel.',
              delay: 1440 // 24 hours
            },
            delay: 1440
          },
          {
            id: 'prep-email',
            type: 'email',
            name: 'Preparation Email',
            description: 'Send preparation instructions',
            config: {
              subject: 'Preparing for your appointment',
              template: 'appointment-prep-template',
              delay: 1440
            },
            delay: 1440
          }
        ]
      },
      {
        name: 'Realtor Outreach Sequence',
        description: 'Automated realtor partnership outreach',
        category: 'Realtor Management',
        estimatedDuration: '14 days',
        triggers: ['New Realtor Contact', 'Realtor Form Submitted'],
        steps: [
          {
            id: 'intro-email',
            type: 'email',
            name: 'Introduction Email',
            description: 'Send initial introduction',
            config: {
              subject: 'Partnership Opportunity - {{companyName}}',
              template: 'realtor-intro-template',
              delay: 0
            }
          },
          {
            id: 'follow-up-1',
            type: 'email',
            name: 'Follow-up #1',
            description: 'First follow-up after 3 days',
            config: {
              subject: 'Following up - Partnership Opportunity',
              template: 'realtor-followup-1-template',
              delay: 4320 // 3 days
            },
            delay: 4320
          },
          {
            id: 'phone-call-task',
            type: 'task',
            name: 'Schedule Phone Call',
            description: 'Create task for phone call',
            config: {
              title: 'Call {{firstName}} {{lastName}} - Realtor Partnership',
              description: 'Follow up on partnership opportunity',
              assignedTo: 'partnership_team',
              dueDate: '5 days'
            }
          },
          {
            id: 'final-followup',
            type: 'email',
            name: 'Final Follow-up',
            description: 'Final follow-up after 10 days',
            config: {
              subject: 'Last chance - Partnership Opportunity',
              template: 'realtor-final-template',
              delay: 14400 // 10 days
            },
            delay: 14400
          }
        ]
      },
      {
        name: 'Ghost Campaign Sequence',
        description: 'Re-engagement campaign for inactive leads',
        category: 'Lead Re-engagement',
        estimatedDuration: '30 days',
        triggers: ['Lead Inactive for 30 Days', 'No Response'],
        steps: [
          {
            id: 'ghost-email-1',
            type: 'email',
            name: 'Ghost Email #1',
            description: 'First re-engagement email',
            config: {
              subject: 'We miss you! Special offer inside',
              template: 'ghost-email-1-template',
              delay: 0
            }
          },
          {
            id: 'ghost-sms',
            type: 'sms',
            name: 'Ghost SMS',
            description: 'SMS re-engagement after 3 days',
            config: {
              message: 'Hi {{firstName}}! We have a special offer just for you. Reply YES for details!',
              delay: 4320
            },
            delay: 4320
          },
          {
            id: 'ghost-email-2',
            type: 'email',
            name: 'Ghost Email #2',
            description: 'Second re-engagement email',
            config: {
              subject: 'Last chance - Exclusive offer expires soon',
              template: 'ghost-email-2-template',
              delay: 10080 // 7 days
            },
            delay: 10080
          },
          {
            id: 'final-ghost',
            type: 'email',
            name: 'Final Ghost Email',
            description: 'Final attempt to re-engage',
            config: {
              subject: 'Goodbye for now - We\'ll be here when you\'re ready',
              template: 'ghost-final-template',
              delay: 20160 // 14 days
            },
            delay: 20160
          }
        ]
      }
    ];
  }

  /**
   * Display available workflow templates
   */
  showWorkflowTemplates() {
    console.log('🎯 Available Workflow Templates\n');
    
    const templates = this.getWorkflowTemplates();
    templates.forEach((template, index) => {
      console.log(`${index + 1}. ${template.name}`);
      console.log(`   Category: ${template.category}`);
      console.log(`   Duration: ${template.estimatedDuration}`);
      console.log(`   Description: ${template.description}`);
      console.log(`   Triggers: ${template.triggers.join(', ')}`);
      console.log(`   Steps: ${template.steps.length} steps`);
      console.log('');
    });

    return templates;
  }

  /**
   * Generate workflow configuration for a template
   */
  generateWorkflowConfig(templateName: string): any {
    const templates = this.getWorkflowTemplates();
    const template = templates.find(t => t.name === templateName);
    
    if (!template) {
      throw new Error(`Template "${templateName}" not found`);
    }

    return {
      name: template.name,
      description: template.description,
      category: template.category,
      status: 'draft',
      steps: template.steps,
      triggers: template.triggers,
      estimatedDuration: template.estimatedDuration,
      createdAt: new Date().toISOString(),
      locationId: config.locationId
    };
  }

  /**
   * Create a custom workflow from steps
   */
  createCustomWorkflow(name: string, description: string, steps: WorkflowStep[]): any {
    return {
      name,
      description,
      category: 'Custom',
      status: 'draft',
      steps,
      triggers: ['Manual Trigger', 'API Trigger'],
      estimatedDuration: this.calculateWorkflowDuration(steps),
      createdAt: new Date().toISOString(),
      locationId: config.locationId
    };
  }

  /**
   * Calculate estimated duration of a workflow
   */
  private calculateWorkflowDuration(steps: WorkflowStep[]): string {
    const totalMinutes = steps.reduce((total, step) => {
      return total + (step.delay || 0);
    }, 0);

    if (totalMinutes < 60) {
      return `${totalMinutes} minutes`;
    } else if (totalMinutes < 1440) {
      return `${Math.round(totalMinutes / 60)} hours`;
    } else {
      return `${Math.round(totalMinutes / 1440)} days`;
    }
  }

  /**
   * Validate workflow configuration
   */
  validateWorkflow(workflow: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!workflow.name) {
      errors.push('Workflow name is required');
    }

    if (!workflow.steps || workflow.steps.length === 0) {
      errors.push('Workflow must have at least one step');
    }

    workflow.steps?.forEach((step: WorkflowStep, index: number) => {
      if (!step.type) {
        errors.push(`Step ${index + 1}: Type is required`);
      }
      if (!step.name) {
        errors.push(`Step ${index + 1}: Name is required`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Export workflow as JSON configuration
   */
  exportWorkflowConfig(workflow: any): string {
    return JSON.stringify(workflow, null, 2);
  }

  /**
   * Import workflow from JSON configuration
   */
  importWorkflowConfig(configJson: string): any {
    try {
      const workflow = JSON.parse(configJson);
      const validation = this.validateWorkflow(workflow);
      
      if (!validation.isValid) {
        throw new Error(`Invalid workflow configuration: ${validation.errors.join(', ')}`);
      }

      return workflow;
    } catch (error) {
      throw new Error(`Failed to import workflow: ${error instanceof Error ? error.message : 'Invalid JSON'}`);
    }
  }

  /**
   * Demonstrate workflow building capabilities
   */
  async demonstrateWorkflowBuilding() {
    try {
      console.log('🚀 GoHighLevel Workflow Builder Demo\n');
      console.log('This demo shows how to design workflows programmatically:\n');

      // Show available templates
      const templates = this.showWorkflowTemplates();

      // Generate a sample workflow
      console.log('📋 Sample Workflow Configuration:');
      const sampleWorkflow = this.generateWorkflowConfig('New Lead Welcome Sequence');
      console.log(JSON.stringify(sampleWorkflow, null, 2));

      // Validate the workflow
      console.log('\n✅ Workflow Validation:');
      const validation = this.validateWorkflow(sampleWorkflow);
      console.log(`Valid: ${validation.isValid}`);
      if (validation.errors.length > 0) {
        console.log('Errors:', validation.errors);
      }

      console.log('\n💡 Next Steps:');
      console.log('1. Choose a template or create a custom workflow');
      console.log('2. Customize the steps and timing');
      console.log('3. Create the workflow in GoHighLevel dashboard');
      console.log('4. Use the API to add contacts to the workflow');

      console.log('\n✅ Workflow builder is ready to use!');

    } catch (error) {
      console.error('❌ Error in workflow building demo:', error instanceof Error ? error.message : error);
    }
  }
}

// Main execution
async function main() {
  try {
    const builder = new WorkflowBuilder();
    await builder.demonstrateWorkflowBuilding();
    
  } catch (error) {
    console.error('❌ Failed to initialize workflow builder:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Run the function if this file is executed directly
if (require.main === module) {
  main()
    .then(() => {
      console.log('\n🎉 Workflow builder demo completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Workflow builder demo failed:', error);
      process.exit(1);
    });
}

export { WorkflowBuilder };
export type { WorkflowStep, WorkflowTemplate, WorkflowCondition }; 