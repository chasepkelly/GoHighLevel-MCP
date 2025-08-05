# GoHighLevel Workflow Management

This project provides comprehensive workflow management capabilities for GoHighLevel, allowing you to programmatically manage automation sequences and lead nurturing workflows.

## 🎯 What Are Workflows?

Workflows in GoHighLevel are automation sequences that can be triggered by various events in your system. They help you:

- **Automate lead nurturing** - Send follow-up emails, SMS, and calls
- **Manage lead progression** - Move contacts through your sales pipeline
- **Handle appointments** - Send confirmations and reminders
- **Engage realtors** - Outreach and partnership campaigns
- **Manage DND (Do Not Disturb)** - Respect contact preferences
- **Track engagement** - Monitor who's responding and who's not

## 📊 Your Current Workflow Setup

Based on the demo, you have **169 workflows** available, including:

### 🔥 Popular Workflow Categories:
1. **Lead Management** - New lead processing and assignment
2. **Appointment Scheduling** - Booking confirmations and reminders
3. **Follow-up Sequences** - Automated follow-up campaigns
4. **Nurture Campaigns** - Long-term lead nurturing
5. **Realtor Outreach** - Partner relationship management
6. **Ghost Campaigns** - Re-engagement for inactive leads
7. **DND Management** - Respect contact preferences
8. **Pipeline Updates** - Automatic stage progression

### 📈 Workflow Statistics:
- **Published workflows**: Ready to use
- **Draft workflows**: In development
- **Active workflows**: Currently running

## 🛠️ Available Operations

### 1. Get All Workflows
```typescript
const workflows = await workflowTools.executeWorkflowTool('ghl_get_workflows', {
  locationId: 'your-location-id'
});
```

### 2. Add Contact to Workflow
```typescript
const result = await ghlClient.addContactToWorkflow(
  contactId,    // Contact ID
  workflowId,   // Workflow ID
  eventStartTime // Optional: When to start the workflow
);
```

### 3. Remove Contact from Workflow
```typescript
const result = await ghlClient.removeContactFromWorkflow(
  contactId,    // Contact ID
  workflowId,   // Workflow ID
  eventStartTime // Optional: When to remove
);
```

## 🚀 Files Created

1. **`workflow-management.ts`** - Full-featured workflow management class
2. **`simple-workflow-demo.ts`** - Simplified demo showing capabilities
3. **`WORKFLOW_MANAGEMENT_README.md`** - This documentation

## 📝 How to Use

### Running the Demo
```bash
npx ts-node simple-workflow-demo.ts
```

### Using the Workflow Manager
```typescript
import { WorkflowManager } from './workflow-management';

const manager = new WorkflowManager();

// Get all workflows
const workflows = await manager.getWorkflows();

// Add Jane Doe to a workflow
await manager.addContactToWorkflow(
  'zObN6HDMja4CUVKZjjfQ',  // Jane Doe's contact ID
  '99f033e2-d446-403e-ae8c-b599cdd33797'  // Facebook Lead workflow
);
```

## 🎯 Example Workflow Scenarios

### 1. New Lead Onboarding
```typescript
// When a new lead comes in
const newContact = await createContact({
  firstName: 'John',
  lastName: 'Smith',
  email: 'john@example.com'
});

// Add to new lead workflow
await addContactToWorkflow(
  newContact.id,
  '99f033e2-d446-403e-ae8c-b599cdd33797' // New Lead workflow
);
```

### 2. Appointment Follow-up
```typescript
// After booking an appointment
await addContactToWorkflow(
  contactId,
  'f6692cb7-162c-4cd0-864e-53e589d59e02' // Appointment confirmation workflow
);
```

### 3. Re-engagement Campaign
```typescript
// For inactive leads
await addContactToWorkflow(
  contactId,
  'b7fe0949-fbd9-4264-9103-8579f798d483' // SMS Warmup workflow
);
```

## 🔧 Workflow Types Available

Based on your setup, you have workflows for:

- **Lead Assignment** - Automatically assign leads to team members
- **Facebook Lead Forms** - Process leads from Facebook ads
- **Appointment Confirmations** - Send booking confirmations
- **Follow-up Sequences** - Automated follow-up campaigns
- **Realtor Outreach** - Partner relationship management
- **Ghost Campaigns** - Re-engage inactive leads
- **DND Management** - Respect contact preferences
- **Pipeline Updates** - Automatic stage progression

## 📋 Workflow Status Types

- **`published`** - Active and running
- **`draft`** - In development, not yet active
- **`archived`** - No longer in use

## 🎬 Demo with Jane Doe

You can test the workflow system with the contact we created earlier:

```typescript
// Jane Doe's contact ID
const janeContactId = 'zObN6HDMja4CUVKZjjfQ';

// Add to Facebook Lead workflow
await addContactToWorkflow(
  janeContactId,
  '99f033e2-d446-403e-ae8c-b599cdd33797'
);
```

## 🔍 Finding the Right Workflow

To find the right workflow for your needs:

1. **Run the demo** to see all available workflows
2. **Look at workflow names** to understand their purpose
3. **Check workflow status** - use published workflows for production
4. **Test with a sample contact** before using with real leads

## 🚨 Important Notes

- **Workflows must be created in GoHighLevel dashboard first**
- **Only published workflows are active**
- **Contact must exist before adding to workflow**
- **Some workflows may have prerequisites** (tags, stages, etc.)

## 🎉 Success!

Your workflow management system is ready to use! You can now:

✅ **Automate lead nurturing**  
✅ **Manage appointment follow-ups**  
✅ **Handle realtor outreach**  
✅ **Track lead progression**  
✅ **Respect contact preferences**  
✅ **Scale your sales process**  

The system is fully integrated with your existing GoHighLevel setup and ready for production use! 