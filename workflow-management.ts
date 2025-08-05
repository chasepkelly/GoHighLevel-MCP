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

class WorkflowManager {
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
   * Get all workflows for the location
   */
  async getWorkflows() {
    try {
      console.log('📋 Fetching workflows...');
      const result = await this.workflowTools.executeWorkflowTool('ghl_get_workflows', {
        locationId: config.locationId
      });

      console.log(`✅ Found ${result.workflows.length} workflows:`);
      result.workflows.forEach((workflow: any, index: number) => {
        console.log(`  ${index + 1}. ${workflow.name} (ID: ${workflow.id}, Status: ${workflow.status})`);
      });

      return result.workflows;
    } catch (error) {
      console.error('❌ Error fetching workflows:', error instanceof Error ? error.message : error);
      throw error;
    }
  }

  /**
   * Add a contact to a workflow
   */
  async addContactToWorkflow(contactId: string, workflowId: string, eventStartTime?: string) {
    try {
      console.log(`🔄 Adding contact ${contactId} to workflow ${workflowId}...`);
      
      const result = await this.ghlClient.addContactToWorkflow(contactId, workflowId, eventStartTime);
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to add contact to workflow');
      }

      console.log('✅ Contact successfully added to workflow!');
      return result.data;
    } catch (error) {
      console.error('❌ Error adding contact to workflow:', error instanceof Error ? error.message : error);
      throw error;
    }
  }

  /**
   * Remove a contact from a workflow
   */
  async removeContactFromWorkflow(contactId: string, workflowId: string, eventStartTime?: string) {
    try {
      console.log(`🔄 Removing contact ${contactId} from workflow ${workflowId}...`);
      
      const result = await this.ghlClient.removeContactFromWorkflow(contactId, workflowId, eventStartTime);
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to remove contact from workflow');
      }

      console.log('✅ Contact successfully removed from workflow!');
      return result.data;
    } catch (error) {
      console.error('❌ Error removing contact from workflow:', error instanceof Error ? error.message : error);
      throw error;
    }
  }

  /**
   * Search for contacts by email
   */
  async findContactByEmail(email: string) {
    try {
      console.log(`🔍 Searching for contact with email: ${email}`);
      
      const result = await this.contactTools.executeTool('search_contacts', {
        email: email,
        limit: 1
      });

      if (result.contacts && result.contacts.length > 0) {
        const contact = result.contacts[0];
        console.log(`✅ Found contact: ${contact.firstName} ${contact.lastName} (ID: ${contact.id})`);
        return contact;
      } else {
        console.log('❌ No contact found with that email');
        return null;
      }
    } catch (error) {
      console.error('❌ Error searching for contact:', error instanceof Error ? error.message : error);
      throw error;
    }
  }

  /**
   * Interactive workflow management
   */
  async interactiveWorkflowManagement() {
    try {
      console.log('🚀 Starting Interactive Workflow Management\n');

      // Get all workflows
      const workflows = await this.getWorkflows();
      
      if (workflows.length === 0) {
        console.log('❌ No workflows found. Please create workflows in your GoHighLevel dashboard first.');
        return;
      }

      console.log('\n📝 Available actions:');
      console.log('1. Add contact to workflow');
      console.log('2. Remove contact from workflow');
      console.log('3. Exit');

      // For demo purposes, let's add Jane Doe to the first workflow
      const janeContact = await this.findContactByEmail('jane@example.com');
      
      if (janeContact && workflows.length > 0) {
        console.log('\n🎯 Demo: Adding Jane Doe to the first workflow...');
        await this.addContactToWorkflow(janeContact.id!, workflows[0].id);
        
        console.log('\n🎯 Demo: Removing Jane Doe from the first workflow...');
        await this.removeContactFromWorkflow(janeContact.id!, workflows[0].id);
      }

      console.log('\n✅ Workflow management demo completed!');
    } catch (error) {
      console.error('❌ Error in workflow management:', error instanceof Error ? error.message : error);
    }
  }

  /**
   * Create a simple onboarding workflow sequence
   */
  async createOnboardingSequence(contactEmail: string) {
    try {
      console.log(`🎯 Creating onboarding sequence for: ${contactEmail}`);

      // Find the contact
      const contact = await this.findContactByEmail(contactEmail);
      if (!contact) {
        console.log('❌ Contact not found. Creating contact first...');
        const newContact = await this.contactTools.executeTool('create_contact', {
          firstName: 'Demo',
          lastName: 'User',
          email: contactEmail
        });
        console.log(`✅ Created new contact: ${newContact.id}`);
      }

      // Get workflows
      const workflows = await this.getWorkflows();
      
      if (workflows.length === 0) {
        console.log('❌ No workflows available. Please create workflows in GoHighLevel first.');
        return;
      }

      // Add to first workflow (assuming it's an onboarding workflow)
      const targetWorkflow = workflows[0];
      console.log(`🔄 Adding contact to workflow: ${targetWorkflow.name}`);
      
      await this.addContactToWorkflow(contact?.id || 'new-contact-id', targetWorkflow.id);
      
      console.log('✅ Onboarding sequence initiated!');
    } catch (error) {
      console.error('❌ Error creating onboarding sequence:', error instanceof Error ? error.message : error);
    }
  }
}

// Main execution
async function main() {
  try {
    const workflowManager = new WorkflowManager();
    
    // Run interactive workflow management
    await workflowManager.interactiveWorkflowManagement();
    
    // Optional: Create onboarding sequence for a test email
    // await workflowManager.createOnboardingSequence('test@example.com');
    
  } catch (error) {
    console.error('❌ Failed to initialize workflow manager:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Run the function if this file is executed directly
if (require.main === module) {
  main()
    .then(() => {
      console.log('\n🎉 Workflow management completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Workflow management failed:', error);
      process.exit(1);
    });
}

export { WorkflowManager }; 