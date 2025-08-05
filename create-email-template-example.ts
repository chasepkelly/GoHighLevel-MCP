import { config as dotenvConfig } from 'dotenv';
import { EmailTemplateBuilder } from './email-template-builder';

// Load environment variables from .env file
dotenvConfig();

async function createEmailTemplateExample() {
  try {
    console.log('🎨 CREATING EMAIL TEMPLATE EXAMPLE\n');
    
    const builder = new EmailTemplateBuilder();
    
    // Example 1: Create a pre-built welcome email template
    console.log('📧 Creating Welcome Email Template...');
    await builder.createTemplateFromPrebuilt(0);
    
    console.log('\n✅ Welcome email template created successfully!');
    console.log('\n📋 Template Details:');
    console.log('- Name: Welcome Email - New Lead');
    console.log('- Category: Welcome');
    console.log('- Merge Fields: firstName, fullName, company, location.name, location.phone');
    console.log('- Features: Professional branding, clear next steps, call-to-action button');
    
    console.log('\n🎯 This template includes:');
    console.log('• Professional HTML structure');
    console.log('• Mobile-responsive design');
    console.log('• Dynamic merge fields for personalization');
    console.log('• Call-to-action buttons');
    console.log('• Contact information');
    console.log('• Professional styling');
    
    console.log('\n📧 The template is now available in your GoHighLevel account!');
    console.log('You can use it in workflows, campaigns, or send it directly to contacts.');
    
  } catch (error) {
    console.error('❌ Error creating email template:', error);
  }
}

// Run the example
createEmailTemplateExample().catch(console.error); 