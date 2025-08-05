import { config as dotenvConfig } from 'dotenv';
import { EmailTools } from './src/tools/email-tools';
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

// Email Template Types
interface EmailTemplate {
  title: string;
  html: string;
  isPlainText?: boolean;
  category: 'welcome' | 'follow-up' | 'appointment' | 'marketing' | 'notification' | 'custom';
  description: string;
  mergeFields: string[];
}

interface EmailSnippet {
  name: string;
  html: string;
  category: 'header' | 'footer' | 'cta' | 'content' | 'social';
  description: string;
}

// Merge Fields Available in GoHighLevel
const MERGE_FIELDS = {
  contact: {
    firstName: '{{Contact.FirstName}}',
    lastName: '{{Contact.LastName}}',
    fullName: '{{Contact.FullName}}',
    email: '{{Contact.Email}}',
    phone: '{{Contact.Phone}}',
    company: '{{Contact.CompanyName}}',
    address: '{{Contact.Address}}',
    city: '{{Contact.City}}',
    state: '{{Contact.State}}',
    country: '{{Contact.Country}}',
    postalCode: '{{Contact.PostalCode}}',
    website: '{{Contact.Website}}',
    tags: '{{Contact.Tags}}',
    source: '{{Contact.Source}}',
    dateAdded: '{{Contact.DateAdded}}'
  },
  location: {
    name: '{{Location.Name}}',
    address: '{{Location.Address}}',
    phone: '{{Location.Phone}}',
    website: '{{Location.Website}}',
    email: '{{Location.Email}}',
    logo: '{{Location.Logo}}'
  },
  appointment: {
    title: '{{Appointment.Title}}',
    date: '{{Appointment.Date}}',
    time: '{{Appointment.Time}}',
    duration: '{{Appointment.Duration}}',
    location: '{{Appointment.Location}}',
    notes: '{{Appointment.Notes}}'
  },
  opportunity: {
    name: '{{Opportunity.Name}}',
    value: '{{Opportunity.Value}}',
    stage: '{{Opportunity.Stage}}',
    pipeline: '{{Opportunity.Pipeline}}'
  }
};

// Pre-built Email Templates
const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    title: 'Welcome Email - New Lead',
    category: 'welcome',
    description: 'Professional welcome email for new leads with clear next steps',
    mergeFields: ['firstName', 'fullName', 'company', 'location.name', 'location.phone'],
    html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to {{Location.Name}}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <div style="text-align: center; margin-bottom: 30px;">
        <img src="{{Location.Logo}}" alt="{{Location.Name}}" style="max-width: 200px; height: auto;">
    </div>
    
    <h1 style="color: #2c3e50; margin-bottom: 20px;">Welcome, {{Contact.FirstName}}!</h1>
    
    <p>Thank you for your interest in {{Location.Name}}. We're excited to have you as part of our community!</p>
    
    <p>Here's what you can expect from us:</p>
    
    <ul style="margin: 20px 0; padding-left: 20px;">
        <li>Personalized service tailored to your needs</li>
        <li>Expert guidance every step of the way</li>
        <li>Ongoing support and communication</li>
    </ul>
    
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0;">
        <h3 style="margin-top: 0; color: #2c3e50;">Next Steps</h3>
        <p>Our team will be reaching out to you within the next 24 hours to discuss your specific needs and answer any questions you may have.</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="tel:{{Location.Phone}}" style="background-color: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Call Us Now</a>
    </div>
    
    <p>If you have any immediate questions, feel free to call us at <strong>{{Location.Phone}}</strong> or reply to this email.</p>
    
    <p>Best regards,<br>
    The {{Location.Name}} Team</p>
    
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
    
    <div style="text-align: center; font-size: 12px; color: #666;">
        <p>{{Location.Name}}<br>
        {{Location.Address}}<br>
        {{Location.Phone}} | {{Location.Website}}</p>
    </div>
</body>
</html>`
  },
  
  {
    title: 'Appointment Confirmation',
    category: 'appointment',
    description: 'Professional appointment confirmation with all details',
    mergeFields: ['firstName', 'appointment.title', 'appointment.date', 'appointment.time', 'appointment.location', 'location.phone'],
    html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Appointment Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <div style="text-align: center; margin-bottom: 30px;">
        <img src="{{Location.Logo}}" alt="{{Location.Name}}" style="max-width: 200px; height: auto;">
    </div>
    
    <h1 style="color: #27ae60; margin-bottom: 20px;">✓ Appointment Confirmed</h1>
    
    <p>Hi {{Contact.FirstName}},</p>
    
    <p>Your appointment has been successfully confirmed. Here are the details:</p>
    
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #27ae60;">
        <h3 style="margin-top: 0; color: #2c3e50;">Appointment Details</h3>
        <p><strong>Service:</strong> {{Appointment.Title}}</p>
        <p><strong>Date:</strong> {{Appointment.Date}}</p>
        <p><strong>Time:</strong> {{Appointment.Time}}</p>
        <p><strong>Location:</strong> {{Appointment.Location}}</p>
    </div>
    
    <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
        <h4 style="margin-top: 0; color: #856404;">Important Reminders</h4>
        <ul style="margin: 10px 0; padding-left: 20px;">
            <li>Please arrive 10 minutes before your scheduled time</li>
            <li>Bring any relevant documents or information</li>
            <li>Call us if you need to reschedule</li>
        </ul>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="tel:{{Location.Phone}}" style="background-color: #27ae60; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin-right: 10px;">Call to Reschedule</a>
        <a href="{{Location.Website}}" style="background-color: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Visit Our Website</a>
    </div>
    
    <p>If you have any questions, please don't hesitate to contact us at <strong>{{Location.Phone}}</strong>.</p>
    
    <p>We look forward to seeing you!</p>
    
    <p>Best regards,<br>
    The {{Location.Name}} Team</p>
    
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
    
    <div style="text-align: center; font-size: 12px; color: #666;">
        <p>{{Location.Name}}<br>
        {{Location.Address}}<br>
        {{Location.Phone}} | {{Location.Website}}</p>
    </div>
</body>
</html>`
  },
  
  {
    title: 'Follow-up Email - 3 Days',
    category: 'follow-up',
    description: 'Follow-up email sent 3 days after initial contact',
    mergeFields: ['firstName', 'company', 'location.name', 'location.phone'],
    html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Following Up - {{Location.Name}}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <div style="text-align: center; margin-bottom: 30px;">
        <img src="{{Location.Logo}}" alt="{{Location.Name}}" style="max-width: 200px; height: auto;">
    </div>
    
    <h1 style="color: #2c3e50; margin-bottom: 20px;">Hi {{Contact.FirstName}},</h1>
    
    <p>I hope this email finds you well! I wanted to follow up on our recent conversation and see if you had any questions about our services.</p>
    
    <p>At {{Location.Name}}, we're committed to providing you with the best possible experience and ensuring all your needs are met.</p>
    
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #2c3e50;">How Can We Help?</h3>
        <p>Whether you need:</p>
        <ul style="margin: 10px 0; padding-left: 20px;">
            <li>More information about our services</li>
            <li>To schedule a consultation</li>
            <li>Answers to specific questions</li>
            <li>To discuss pricing options</li>
        </ul>
        <p>We're here to help!</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="tel:{{Location.Phone}}" style="background-color: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Schedule a Call</a>
    </div>
    
    <p>You can reach me directly at <strong>{{Location.Phone}}</strong> or simply reply to this email. I'm looking forward to hearing from you!</p>
    
    <p>Best regards,<br>
    The {{Location.Name}} Team</p>
    
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
    
    <div style="text-align: center; font-size: 12px; color: #666;">
        <p>{{Location.Name}}<br>
        {{Location.Address}}<br>
        {{Location.Phone}} | {{Location.Website}}</p>
    </div>
</body>
</html>`
  },
  
  {
    title: 'Marketing Newsletter',
    category: 'marketing',
    description: 'Professional marketing newsletter template',
    mergeFields: ['firstName', 'location.name', 'location.website'],
    html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{Location.Name}} - Newsletter</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <div style="text-align: center; margin-bottom: 30px;">
        <img src="{{Location.Logo}}" alt="{{Location.Name}}" style="max-width: 200px; height: auto;">
    </div>
    
    <h1 style="color: #2c3e50; margin-bottom: 20px;">{{Location.Name}} Newsletter</h1>
    
    <p>Hi {{Contact.FirstName}},</p>
    
    <p>Thank you for being part of our community! Here's what's new with us this month:</p>
    
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #2c3e50;">📢 Latest Updates</h3>
        <ul style="margin: 10px 0; padding-left: 20px;">
            <li>New services now available</li>
            <li>Updated pricing packages</li>
            <li>Customer success stories</li>
            <li>Upcoming events and webinars</li>
        </ul>
    </div>
    
    <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #27ae60;">🎉 Special Offer</h3>
        <p>As a valued subscriber, you're eligible for our exclusive discount. Use code <strong>NEWSLETTER20</strong> for 20% off your next service!</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="{{Location.Website}}" style="background-color: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Learn More</a>
    </div>
    
    <p>Stay connected with us on social media for daily updates and tips!</p>
    
    <p>Best regards,<br>
    The {{Location.Name}} Team</p>
    
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
    
    <div style="text-align: center; font-size: 12px; color: #666;">
        <p>{{Location.Name}}<br>
        {{Location.Address}}<br>
        {{Location.Phone}} | {{Location.Website}}</p>
        <p><a href="#" style="color: #666;">Unsubscribe</a> | <a href="#" style="color: #666;">Update Preferences</a></p>
    </div>
</body>
</html>`
  }
];

// Email Snippets Library
const EMAIL_SNIPPETS: EmailSnippet[] = [
  {
    name: 'Professional Header',
    category: 'header',
    description: 'Clean, professional email header with logo and branding',
    html: `
<div style="text-align: center; margin-bottom: 30px; padding: 20px 0; border-bottom: 2px solid #3498db;">
    <img src="{{Location.Logo}}" alt="{{Location.Name}}" style="max-width: 200px; height: auto; margin-bottom: 10px;">
    <h2 style="margin: 0; color: #2c3e50; font-size: 24px;">{{Location.Name}}</h2>
    <p style="margin: 5px 0; color: #7f8c8d; font-size: 14px;">{{Location.Address}}</p>
</div>`
  },
  
  {
    name: 'Call-to-Action Button',
    category: 'cta',
    description: 'Professional CTA button with customizable text and link',
    html: `
<div style="text-align: center; margin: 30px 0;">
    <a href="{{CTA_LINK}}" style="background-color: #3498db; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">{{CTA_TEXT}}</a>
</div>`
  },
  
  {
    name: 'Social Media Footer',
    category: 'social',
    description: 'Social media links and contact information footer',
    html: `
<div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: center;">
    <h4 style="margin-top: 0; color: #2c3e50;">Connect With Us</h4>
    <div style="margin: 15px 0;">
        <a href="#" style="color: #3b5998; text-decoration: none; margin: 0 10px; font-weight: bold;">Facebook</a>
        <a href="#" style="color: #1da1f2; text-decoration: none; margin: 0 10px; font-weight: bold;">Twitter</a>
        <a href="#" style="color: #0077b5; text-decoration: none; margin: 0 10px; font-weight: bold;">LinkedIn</a>
        <a href="#" style="color: #e4405f; text-decoration: none; margin: 0 10px; font-weight: bold;">Instagram</a>
    </div>
    <p style="margin: 10px 0; color: #666;">{{Location.Phone}} | {{Location.Website}}</p>
</div>`
  },
  
  {
    name: 'Testimonial Block',
    category: 'content',
    description: 'Customer testimonial with star rating',
    html: `
<div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f39c12;">
    <div style="margin-bottom: 10px;">
        <span style="color: #f39c12; font-size: 18px;">★★★★★</span>
    </div>
    <p style="font-style: italic; margin: 10px 0; color: #555;">"{{TESTIMONIAL_TEXT}}"</p>
    <p style="margin: 5px 0; font-weight: bold; color: #2c3e50;">- {{CUSTOMER_NAME}}</p>
</div>`
  },
  
  {
    name: 'Professional Footer',
    category: 'footer',
    description: 'Clean, professional email footer with contact info',
    html: `
<hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
<div style="text-align: center; font-size: 12px; color: #666; line-height: 1.4;">
    <p style="margin: 5px 0;"><strong>{{Location.Name}}</strong></p>
    <p style="margin: 5px 0;">{{Location.Address}}</p>
    <p style="margin: 5px 0;">{{Location.Phone}} | <a href="{{Location.Website}}" style="color: #666;">{{Location.Website}}</a></p>
    <p style="margin: 15px 0; font-size: 11px;">
        <a href="#" style="color: #666; margin: 0 10px;">Privacy Policy</a> | 
        <a href="#" style="color: #666; margin: 0 10px;">Terms of Service</a> | 
        <a href="#" style="color: #666; margin: 0 10px;">Unsubscribe</a>
    </p>
</div>`
  }
];

class EmailTemplateBuilder {
  private ghlClient: GHLApiClient;
  private emailTools: EmailTools;

  constructor() {
    // Validate required environment variables
    if (!config.accessToken) {
      throw new Error('GHL_API_KEY environment variable is required');
    }
    if (!config.locationId) {
      throw new Error('GHL_LOCATION_ID environment variable is required');
    }

    this.ghlClient = new GHLApiClient(config);
    this.emailTools = new EmailTools(this.ghlClient);
  }

  /**
   * Get all available merge fields
   */
  getMergeFields(): any {
    return MERGE_FIELDS;
  }

  /**
   * Get all pre-built templates
   */
  getTemplates(): EmailTemplate[] {
    return EMAIL_TEMPLATES;
  }

  /**
   * Get all email snippets
   */
  getSnippets(): EmailSnippet[] {
    return EMAIL_SNIPPETS;
  }

  /**
   * Create a template from a pre-built template
   */
  async createTemplateFromPrebuilt(templateIndex: number): Promise<any> {
    if (templateIndex < 0 || templateIndex >= EMAIL_TEMPLATES.length) {
      throw new Error(`Invalid template index. Must be between 0 and ${EMAIL_TEMPLATES.length - 1}`);
    }

    const template = EMAIL_TEMPLATES[templateIndex];
    
    try {
      const result = await this.emailTools.executeTool('create_email_template', {
        title: template.title,
        html: template.html,
        isPlainText: template.isPlainText || false
      });

      console.log(`✅ Template "${template.title}" created successfully!`);
      console.log(`📧 Category: ${template.category}`);
      console.log(`📝 Description: ${template.description}`);
      console.log(`🔗 Merge Fields: ${template.mergeFields.join(', ')}`);
      
      return result;
    } catch (error) {
      console.error('❌ Error creating template:', error);
      throw error;
    }
  }

  /**
   * Create a custom template
   */
  async createCustomTemplate(title: string, html: string, isPlainText: boolean = false): Promise<any> {
    try {
      const result = await this.emailTools.executeTool('create_email_template', {
        title,
        html,
        isPlainText
      });

      console.log(`✅ Custom template "${title}" created successfully!`);
      return result;
    } catch (error) {
      console.error('❌ Error creating custom template:', error);
      throw error;
    }
  }

  /**
   * Get all existing templates
   */
  async getExistingTemplates(): Promise<any> {
    try {
      const result = await this.emailTools.executeTool('get_email_templates', {
        limit: 50,
        offset: 0
      });

      console.log(`📧 Found ${result.templates?.length || 0} existing templates`);
      return result;
    } catch (error) {
      console.error('❌ Error getting templates:', error);
      throw error;
    }
  }

  /**
   * Create a template with snippets
   */
  async createTemplateWithSnippets(title: string, snippets: string[]): Promise<any> {
    let html = '';
    
    for (const snippetName of snippets) {
      const snippet = EMAIL_SNIPPETS.find(s => s.name === snippetName);
      if (snippet) {
        html += snippet.html + '\n';
      } else {
        console.warn(`⚠️ Snippet "${snippetName}" not found`);
      }
    }

    if (!html.trim()) {
      throw new Error('No valid snippets found');
    }

    return this.createCustomTemplate(title, html);
  }

  /**
   * Show template builder demo
   */
  async runDemo(): Promise<void> {
    console.log('🎨 EMAIL TEMPLATE BUILDER DEMO\n');
    
    // Show available merge fields
    console.log('📋 AVAILABLE MERGE FIELDS:');
    Object.entries(MERGE_FIELDS).forEach(([category, fields]) => {
      console.log(`\n${category.toUpperCase()}:`);
      Object.entries(fields).forEach(([field, mergeField]) => {
        console.log(`  ${field}: ${mergeField}`);
      });
    });

    // Show pre-built templates
    console.log('\n📧 PRE-BUILT TEMPLATES:');
    EMAIL_TEMPLATES.forEach((template, index) => {
      console.log(`\n${index}. ${template.title}`);
      console.log(`   Category: ${template.category}`);
      console.log(`   Description: ${template.description}`);
      console.log(`   Merge Fields: ${template.mergeFields.join(', ')}`);
    });

    // Show snippets
    console.log('\n🧩 EMAIL SNIPPETS:');
    EMAIL_SNIPPETS.forEach((snippet, index) => {
      console.log(`\n${index + 1}. ${snippet.name}`);
      console.log(`   Category: ${snippet.category}`);
      console.log(`   Description: ${snippet.description}`);
    });

    // Get existing templates
    console.log('\n📊 EXISTING TEMPLATES:');
    try {
      const existingTemplates = await this.getExistingTemplates();
      if (existingTemplates.templates && existingTemplates.templates.length > 0) {
        existingTemplates.templates.forEach((template: any, index: number) => {
          console.log(`${index + 1}. ${template.name} (${template.templateType})`);
        });
      } else {
        console.log('No existing templates found.');
      }
    } catch (error) {
      console.log('Could not retrieve existing templates.');
    }

    console.log('\n✨ DEMO COMPLETE!');
    console.log('\nTo create a template, use:');
    console.log('- createTemplateFromPrebuilt(index) - Use a pre-built template');
    console.log('- createCustomTemplate(title, html) - Create a custom template');
    console.log('- createTemplateWithSnippets(title, snippets[]) - Build with snippets');
  }
}

// Run the demo if this file is executed directly
if (require.main === module) {
  const builder = new EmailTemplateBuilder();
  builder.runDemo().catch(console.error);
}

export { EmailTemplateBuilder, MERGE_FIELDS, EMAIL_TEMPLATES, EMAIL_SNIPPETS };
export type { EmailTemplate, EmailSnippet }; 