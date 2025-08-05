# GoHighLevel Workflow Builder

This project provides a powerful workflow builder that allows you to design and create automation workflows from scratch using templates and custom configurations.

## 🎯 What I Can Build for You

### ✅ **Complete Workflow Design System**
- **Pre-built templates** for common scenarios
- **Custom workflow creation** from scratch
- **Step-by-step configuration** with timing
- **Validation and testing** tools
- **Export/Import** functionality

### ✅ **4 Ready-to-Use Templates**

1. **New Lead Welcome Sequence** (7 days)
   - Welcome email → Follow-up SMS → Engagement check → Task creation

2. **Appointment Confirmation Sequence** (3 days)
   - Confirmation email → Calendar invite → SMS reminder → Prep instructions

3. **Realtor Outreach Sequence** (14 days)
   - Introduction email → Follow-up emails → Phone call task → Final follow-up

4. **Ghost Campaign Sequence** (30 days)
   - Re-engagement emails → SMS campaigns → Final attempts → Archive

## 🛠️ Workflow Components

### **Step Types Available:**
- **Email** - Send automated emails with templates
- **SMS** - Send text messages with personalization
- **Delay** - Wait for specified time before next step
- **Condition** - Branch based on contact data
- **Tag** - Add/remove tags from contacts
- **Task** - Create tasks for team members
- **Webhook** - Trigger external systems

### **Step Configuration:**
```typescript
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
}
```

## 🚀 How to Create a Workflow from Scratch

### **Method 1: Use a Template**
```typescript
import { WorkflowBuilder } from './workflow-builder';

const builder = new WorkflowBuilder();

// Generate workflow from template
const workflow = builder.generateWorkflowConfig('New Lead Welcome Sequence');

// Customize the workflow
workflow.name = 'My Custom Welcome Sequence';
workflow.steps[0].config.subject = 'Welcome to Our Company!';

// Validate the workflow
const validation = builder.validateWorkflow(workflow);
console.log('Valid:', validation.isValid);
```

### **Method 2: Create Custom Workflow**
```typescript
const customSteps = [
  {
    id: 'step-1',
    type: 'email',
    name: 'Initial Contact',
    description: 'Send first email',
    config: {
      subject: 'Hello {{firstName}}!',
      template: 'custom-template',
      delay: 0
    }
  },
  {
    id: 'step-2',
    type: 'delay',
    name: 'Wait 24 Hours',
    description: 'Wait before follow-up',
    config: { delay: 1440 }, // 24 hours
    delay: 1440
  },
  {
    id: 'step-3',
    type: 'sms',
    name: 'Follow-up SMS',
    description: 'Send SMS follow-up',
    config: {
      message: 'Hi {{firstName}}, following up on our conversation!',
      delay: 0
    }
  }
];

const customWorkflow = builder.createCustomWorkflow(
  'My Custom Sequence',
  'A custom workflow I designed',
  customSteps
);
```

### **Method 3: Import from JSON**
```typescript
const workflowJson = `{
  "name": "Imported Workflow",
  "description": "Workflow imported from JSON",
  "steps": [...]
}`;

const importedWorkflow = builder.importWorkflowConfig(workflowJson);
```

## 📋 Workflow Templates in Detail

### **1. New Lead Welcome Sequence**
**Duration:** 7 days  
**Purpose:** Onboard new leads with immediate engagement

**Steps:**
1. **Welcome Email** (0 min) - Immediate welcome
2. **Follow-up SMS** (60 min) - Personal touch
3. **Engagement Check** (Condition) - Evaluate interest
4. **Schedule Call** (Task) - Create sales task

### **2. Appointment Confirmation Sequence**
**Duration:** 3 days  
**Purpose:** Confirm appointments and reduce no-shows

**Steps:**
1. **Confirmation Email** (0 min) - Immediate confirmation
2. **Calendar Invite** (5 min) - Add to calendar
3. **24-Hour Reminder** (1440 min) - SMS reminder
4. **Preparation Email** (1440 min) - Prep instructions

### **3. Realtor Outreach Sequence**
**Duration:** 14 days  
**Purpose:** Build realtor partnerships

**Steps:**
1. **Introduction Email** (0 min) - Initial contact
2. **Follow-up #1** (4320 min) - 3-day follow-up
3. **Phone Call Task** (Task) - Schedule call
4. **Final Follow-up** (14400 min) - Last attempt

### **4. Ghost Campaign Sequence**
**Duration:** 30 days  
**Purpose:** Re-engage inactive leads

**Steps:**
1. **Ghost Email #1** (0 min) - Re-engagement attempt
2. **Ghost SMS** (4320 min) - SMS campaign
3. **Ghost Email #2** (10080 min) - Second attempt
4. **Final Ghost Email** (20160 min) - Last chance

## 🔧 Advanced Features

### **Conditional Logic**
```typescript
{
  id: 'engagement-check',
  type: 'condition',
  name: 'Check Engagement',
  conditions: [
    {
      field: 'engagement_score',
      operator: 'greater_than',
      value: 0
    }
  ]
}
```

### **Personalization Variables**
- `{{firstName}}` - Contact's first name
- `{{lastName}}` - Contact's last name
- `{{email}}` - Contact's email
- `{{phone}}` - Contact's phone
- `{{companyName}}` - Contact's company
- `{{appointmentDate}}` - Appointment date
- `{{appointmentTime}}` - Appointment time

### **Timing Control**
- **Immediate** (0 minutes)
- **Short delays** (5-60 minutes)
- **Medium delays** (1-24 hours)
- **Long delays** (1-30 days)

## 📊 Workflow Validation

The builder includes comprehensive validation:

```typescript
const validation = builder.validateWorkflow(workflow);

if (validation.isValid) {
  console.log('✅ Workflow is valid!');
} else {
  console.log('❌ Errors:', validation.errors);
}
```

**Validation Checks:**
- ✅ Workflow name is required
- ✅ At least one step is required
- ✅ Each step has required fields
- ✅ Timing is logical
- ✅ Configuration is complete

## 🎬 Demo Usage

### **Run the Demo**
```bash
npx ts-node workflow-builder.ts
```

### **Use in Your Code**
```typescript
import { WorkflowBuilder } from './workflow-builder';

const builder = new WorkflowBuilder();

// Show all templates
builder.showWorkflowTemplates();

// Create a workflow
const workflow = builder.generateWorkflowConfig('New Lead Welcome Sequence');

// Export to JSON
const jsonConfig = builder.exportWorkflowConfig(workflow);
console.log(jsonConfig);
```

## 🔄 Workflow Lifecycle

### **1. Design Phase**
- Choose template or create custom
- Configure steps and timing
- Add personalization
- Set conditions

### **2. Validation Phase**
- Validate workflow configuration
- Check for errors
- Test logic flow

### **3. Implementation Phase**
- Create in GoHighLevel dashboard
- Set up email/SMS templates
- Configure triggers
- Test with sample contacts

### **4. Execution Phase**
- Add contacts to workflow
- Monitor performance
- Track engagement
- Optimize based on results

## 🎯 Next Steps

### **To Create Your First Workflow:**

1. **Choose a template** that matches your needs
2. **Customize the steps** for your business
3. **Create the workflow** in GoHighLevel dashboard
4. **Set up templates** for emails and SMS
5. **Test with a sample contact**
6. **Launch and monitor**

### **Example: Create Welcome Sequence**
```typescript
// 1. Generate workflow
const welcomeWorkflow = builder.generateWorkflowConfig('New Lead Welcome Sequence');

// 2. Customize for your business
welcomeWorkflow.name = 'Real Estate Welcome Sequence';
welcomeWorkflow.steps[0].config.subject = 'Welcome to Our Real Estate Services!';

// 3. Validate
const validation = builder.validateWorkflow(welcomeWorkflow);

// 4. Export configuration
const config = builder.exportWorkflowConfig(welcomeWorkflow);
console.log('Ready to implement:', config);
```

## 🎉 Success!

Your workflow builder is ready to create sophisticated automation sequences! You can now:

✅ **Design workflows from scratch**  
✅ **Use proven templates**  
✅ **Customize for your business**  
✅ **Validate configurations**  
✅ **Export/import workflows**  
✅ **Scale your automation**  

The system provides everything you need to build professional-grade automation workflows for your GoHighLevel setup! 