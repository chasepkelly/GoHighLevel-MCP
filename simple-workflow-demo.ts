import { config as dotenvConfig } from 'dotenv';
import { WorkflowTools } from './src/tools/workflow-tools';
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

class SimpleWorkflowDemo {
  private ghlClient: GHLApiClient;
  private workflowTools: WorkflowTools;

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
  }

  /**
   * Get all workflows and display them
   */
  async showWorkflows() {
    try {
      console.log('📋 Fetching workflows...');
      const result = await this.workflowTools.executeWorkflowTool('ghl_get_workflows', {
        locationId: config.locationId
      });

      console.log(`\n✅ Found ${result.workflows.length} workflows!`);
      console.log('\n📊 Workflow Statistics:');
      
      // Count workflows by status
      const statusCounts: { [key: string]: number } = {};
      result.workflows.forEach((workflow: any) => {
        statusCounts[workflow.status] = (statusCounts[workflow.status] || 0) + 1;
      });

      Object.entries(statusCounts).forEach(([status, count]) => {
        console.log(`  ${status}: ${count} workflows`);
      });

      // Show some example workflows
      console.log('\n🎯 Example Workflows:');
      const publishedWorkflows = result.workflows.filter((w: any) => w.status === 'published').slice(0, 10);
      publishedWorkflows.forEach((workflow: any, index: number) => {
        console.log(`  ${index + 1}. ${workflow.name} (ID: ${workflow.id})`);
      });

      return result.workflows;
    } catch (error) {
      console.error('❌ Error fetching workflows:', error instanceof Error ? error.message : error);
      throw error;
    }
  }

  /**
   * Demonstrate adding a contact to a workflow
   */
  async demoAddContactToWorkflow(contactId: string, workflowId: string) {
    try {
      console.log(`\n🔄 Demo: Adding contact ${contactId} to workflow ${workflowId}...`);
      
      const result = await this.ghlClient.addContactToWorkflow(contactId, workflowId);
      
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
   * Demonstrate removing a contact from a workflow
   */
  async demoRemoveContactFromWorkflow(contactId: string, workflowId: string) {
    try {
      console.log(`\n🔄 Demo: Removing contact ${contactId} from workflow ${workflowId}...`);
      
      const result = await this.ghlClient.removeContactFromWorkflow(contactId, workflowId);
      
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
   * Show workflow management capabilities
   */
  async demonstrateWorkflowCapabilities() {
    try {
      console.log('🚀 GoHighLevel Workflow Management Demo\n');
      console.log('This demo shows the workflow management capabilities available:\n');

      // Get and display workflows
      const workflows = await this.showWorkflows();

      console.log('\n🔧 Available Workflow Operations:');
      console.log('1. ✅ Get all workflows (working)');
      console.log('2. ✅ Add contacts to workflows (API ready)');
      console.log('3. ✅ Remove contacts from workflows (API ready)');
      console.log('4. ✅ Workflow status tracking (working)');

      console.log('\n📋 Workflow Types Available:');
      const workflowTypes = new Set(workflows.map((w: any) => w.name.split(' ')[0]));
      Array.from(workflowTypes).slice(0, 10).forEach((type, index) => {
        console.log(`  ${index + 1}. ${type} workflows`);
      });

      console.log('\n🎯 Popular Workflow Categories:');
      const categories = [
        'Lead Management',
        'Appointment Scheduling', 
        'Follow-up Sequences',
        'Nurture Campaigns',
        'Realtor Outreach',
        'Ghost Campaigns',
        'DND Management',
        'Pipeline Updates'
      ];

      categories.forEach((category, index) => {
        console.log(`  ${index + 1}. ${category}`);
      });

      console.log('\n💡 How to Use Workflows:');
      console.log('1. Create workflows in GoHighLevel dashboard');
      console.log('2. Use this API to add/remove contacts programmatically');
      console.log('3. Monitor workflow performance and engagement');
      console.log('4. Automate lead nurturing and follow-up sequences');

      // Demo with a sample contact ID (you would use a real contact ID)
      console.log('\n🎬 Demo Operations (with sample data):');
      console.log('• Contact ID: zObN6HDMja4CUVKZjjfQ (Jane Doe)');
      console.log('• Workflow ID: 99f033e2-d446-403e-ae8c-b599cdd33797 (New Lead From Facebook)');
      
      console.log('\n📝 To add Jane Doe to the Facebook Lead workflow:');
      console.log('await demo.demoAddContactToWorkflow("zObN6HDMja4CUVKZjjfQ", "99f033e2-d446-403e-ae8c-b599cdd33797");');

      console.log('\n✅ Workflow management system is ready to use!');

    } catch (error) {
      console.error('❌ Error in workflow demonstration:', error instanceof Error ? error.message : error);
    }
  }
}

// Main execution
async function main() {
  try {
    const demo = new SimpleWorkflowDemo();
    await demo.demonstrateWorkflowCapabilities();
    
  } catch (error) {
    console.error('❌ Failed to initialize workflow demo:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Run the function if this file is executed directly
if (require.main === module) {
  main()
    .then(() => {
      console.log('\n🎉 Workflow demo completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Workflow demo failed:', error);
      process.exit(1);
    });
}

export { SimpleWorkflowDemo }; 