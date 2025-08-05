# GoHighLevel Email Template Builder

This project provides a powerful email template builder that allows you to create professional email templates and snippets with merge fields, HTML support, and pre-built templates for common scenarios.

## 🎯 What I Can Build for You

### ✅ **Complete Email Template System**
- **4 Pre-built professional templates** for common scenarios
- **5 Reusable email snippets** for building custom templates
- **Full merge field support** for personalization
- **HTML and plain text support**
- **Template management** (create, update, delete)

### ✅ **4 Ready-to-Use Templates**

1. **Welcome Email - New Lead** (Professional welcome with next steps)
2. **Appointment Confirmation** (Complete appointment details with reminders)
3. **Follow-up Email - 3 Days** (Professional follow-up sequence)
4. **Marketing Newsletter** (Newsletter with special offers)

### ✅ **5 Email Snippets**

1. **Professional Header** - Clean header with logo and branding
2. **Call-to-Action Button** - Professional CTA with customizable text
3. **Social Media Footer** - Social links and contact information
4. **Testimonial Block** - Customer testimonials with star ratings
5. **Professional Footer** - Contact info and legal links

## 🚀 Quick Start

### 1. **Run the Demo**
```bash
npx ts-node email-template-builder.ts
```

### 2. **Create a Pre-built Template**
```typescript
import { EmailTemplateBuilder } from './email-template-builder';

const builder = new EmailTemplateBuilder();

// Create welcome email template (index 0)
await builder.createTemplateFromPrebuilt(0);
```

### 3. **Create Custom Template**
```typescript
const customHtml = `
<!DOCTYPE html>
<html>
<body>
    <h1>Hello {{Contact.FirstName}}!</h1>
    <p>Welcome to {{Location.Name}}.</p>
    <p>Call us at {{Location.Phone}}</p>
</body>
</html>`;

await builder.createCustomTemplate('My Custom Template', customHtml);
```

### 4. **Build with Snippets**
```typescript
await builder.createTemplateWithSnippets('My Template', [
    'Professional Header',
    'Call-to-Action Button',
    'Professional Footer'
]);
```

## 📋 Available Merge Fields

### **Contact Information**
- `{{Contact.FirstName}}` - Contact's first name
- `{{Contact.LastName}}` - Contact's last name
- `{{Contact.FullName}}` - Contact's full name
- `{{Contact.Email}}` - Contact's email address
- `{{Contact.Phone}}` - Contact's phone number
- `{{Contact.CompanyName}}` - Contact's company name
- `{{Contact.Address}}` - Contact's address
- `{{Contact.City}}` - Contact's city
- `{{Contact.State}}` - Contact's state
- `{{Contact.Country}}` - Contact's country
- `{{Contact.PostalCode}}` - Contact's postal code
- `{{Contact.Website}}` - Contact's website
- `{{Contact.Tags}}` - Contact's tags
- `{{Contact.Source}}` - Contact's source
- `{{Contact.DateAdded}}` - Date contact was added

### **Location Information**
- `{{Location.Name}}` - Your business name
- `{{Location.Address}}` - Your business address
- `{{Location.Phone}}` - Your business phone
- `{{Location.Website}}` - Your business website
- `{{Location.Email}}` - Your business email
- `{{Location.Logo}}` - Your business logo URL

### **Appointment Information**
- `{{Appointment.Title}}` - Appointment title
- `{{Appointment.Date}}` - Appointment date
- `{{Appointment.Time}}` - Appointment time
- `{{Appointment.Duration}}` - Appointment duration
- `{{Appointment.Location}}` - Appointment location
- `{{Appointment.Notes}}` - Appointment notes

### **Opportunity Information**
- `{{Opportunity.Name}}` - Opportunity name
- `{{Opportunity.Value}}` - Opportunity value
- `{{Opportunity.Stage}}` - Opportunity stage
- `{{Opportunity.Pipeline}}` - Opportunity pipeline

## 📧 Pre-built Templates

### 1. **Welcome Email - New Lead**
- **Category**: Welcome
- **Description**: Professional welcome email for new leads with clear next steps
- **Merge Fields**: firstName, fullName, company, location.name, location.phone
- **Features**: 
  - Professional branding
  - Clear next steps
  - Call-to-action button
  - Contact information

### 2. **Appointment Confirmation**
- **Category**: Appointment
- **Description**: Professional appointment confirmation with all details
- **Merge Fields**: firstName, appointment.title, appointment.date, appointment.time, appointment.location, location.phone
- **Features**:
  - Appointment details box
  - Important reminders
  - Reschedule options
  - Professional styling

### 3. **Follow-up Email - 3 Days**
- **Category**: Follow-up
- **Description**: Follow-up email sent 3 days after initial contact
- **Merge Fields**: firstName, company, location.name, location.phone
- **Features**:
  - Professional tone
  - Service offerings
  - Clear call-to-action
  - Contact options

### 4. **Marketing Newsletter**
- **Category**: Marketing
- **Description**: Professional marketing newsletter template
- **Merge Fields**: firstName, location.name, location.website
- **Features**:
  - Newsletter structure
  - Special offers section
  - Social media integration
  - Unsubscribe options

## 🧩 Email Snippets

### **Header Snippets**
- **Professional Header**: Clean header with logo, business name, and address

### **Content Snippets**
- **Call-to-Action Button**: Professional CTA with customizable text and link
- **Testimonial Block**: Customer testimonials with star ratings

### **Footer Snippets**
- **Social Media Footer**: Social links and contact information
- **Professional Footer**: Contact info, legal links, and unsubscribe options

## 🛠️ Advanced Usage

### **Creating Custom Templates**
```typescript
const builder = new EmailTemplateBuilder();

// Create a custom welcome email
const customWelcomeHtml = `
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
    
    <p>Thank you for choosing {{Location.Name}}. We're excited to work with you!</p>
    
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0;">
        <h3 style="margin-top: 0; color: #2c3e50;">What's Next?</h3>
        <p>Our team will contact you within 24 hours to discuss your needs.</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="tel:{{Location.Phone}}" style="background-color: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Call Us Now</a>
    </div>
    
    <p>Best regards,<br>The {{Location.Name}} Team</p>
</body>
</html>`;

await builder.createCustomTemplate('Custom Welcome Email', customWelcomeHtml);
```

### **Building with Snippets**
```typescript
// Create a template using multiple snippets
await builder.createTemplateWithSnippets('Snippet-Based Template', [
    'Professional Header',
    'Call-to-Action Button',
    'Testimonial Block',
    'Social Media Footer',
    'Professional Footer'
]);
```

### **Managing Existing Templates**
```typescript
// Get all existing templates
const existingTemplates = await builder.getExistingTemplates();
console.log('Existing templates:', existingTemplates.templates);

// Get available merge fields
const mergeFields = builder.getMergeFields();
console.log('Available merge fields:', mergeFields);

// Get pre-built templates
const templates = builder.getTemplates();
console.log('Pre-built templates:', templates);

// Get snippets
const snippets = builder.getSnippets();
console.log('Available snippets:', snippets);
```

## 🎨 Template Design Best Practices

### **1. Mobile Responsive Design**
- Use max-width: 600px for email containers
- Include viewport meta tag
- Use inline CSS for better email client compatibility

### **2. Professional Styling**
- Use web-safe fonts (Arial, Helvetica, sans-serif)
- Maintain consistent color scheme
- Include proper spacing and padding
- Use professional color palette

### **3. Clear Call-to-Actions**
- Use contrasting colors for buttons
- Make buttons large enough to click on mobile
- Include clear, action-oriented text
- Provide multiple contact methods

### **4. Personalization**
- Use merge fields strategically
- Include recipient's name in greeting
- Reference their company or specific needs
- Make content relevant to their situation

### **5. Legal Compliance**
- Include unsubscribe links
- Add privacy policy links
- Include business contact information
- Follow CAN-SPAM guidelines

## 📊 Template Categories

### **Welcome Emails**
- First impression emails
- Onboarding sequences
- Service introductions
- Next steps communication

### **Follow-up Emails**
- Post-meeting follow-ups
- Check-in emails
- Service reminders
- Relationship building

### **Appointment Emails**
- Confirmation emails
- Reminder emails
- Reschedule notifications
- Cancellation confirmations

### **Marketing Emails**
- Newsletters
- Promotional offers
- Event announcements
- Product updates

### **Notification Emails**
- Status updates
- System notifications
- Account changes
- Security alerts

## 🔧 Technical Features

### **HTML Support**
- Full HTML email templates
- Inline CSS for compatibility
- Responsive design
- Professional styling

### **Merge Field Integration**
- Dynamic content insertion
- Contact information
- Location details
- Appointment data
- Opportunity information

### **Template Management**
- Create new templates
- Update existing templates
- Delete templates
- List all templates

### **Snippet System**
- Reusable components
- Modular design
- Easy customization
- Consistent branding

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Environment Variables**
   ```bash
   # Your .env file should contain:
   GHL_API_KEY=your_api_key
   GHL_LOCATION_ID=your_location_id
   GHL_BASE_URL=https://services.leadconnectorhq.com
   ```

3. **Run the Demo**
   ```bash
   npx ts-node email-template-builder.ts
   ```

4. **Create Your First Template**
   ```typescript
   import { EmailTemplateBuilder } from './email-template-builder';
   
   const builder = new EmailTemplateBuilder();
   await builder.createTemplateFromPrebuilt(0); // Welcome email
   ```

## 📈 Benefits

### **Time Savings**
- Pre-built templates save hours of design work
- Reusable snippets for consistent branding
- Quick customization with merge fields

### **Professional Quality**
- Mobile-responsive design
- Email client compatibility
- Professional styling and layout
- Consistent branding

### **Personalization**
- Dynamic content with merge fields
- Contact-specific information
- Location-based customization
- Appointment and opportunity data

### **Scalability**
- Easy template management
- Bulk template creation
- Consistent messaging
- Brand compliance

## 🎯 Use Cases

### **Real Estate**
- New lead welcome emails
- Property updates
- Open house invitations
- Market reports

### **Service Businesses**
- Appointment confirmations
- Service reminders
- Follow-up sequences
- Customer satisfaction surveys

### **E-commerce**
- Order confirmations
- Shipping updates
- Abandoned cart recovery
- Product recommendations

### **Consulting**
- Meeting confirmations
- Proposal follow-ups
- Resource sharing
- Client updates

## 🔍 Troubleshooting

### **Common Issues**

1. **Template Not Creating**
   - Check API key and location ID
   - Verify HTML syntax
   - Ensure merge fields are valid

2. **Merge Fields Not Working**
   - Use exact merge field syntax
   - Check field availability
   - Test with sample data

3. **Styling Issues**
   - Use inline CSS
   - Test in multiple email clients
   - Keep design simple and clean

### **Best Practices**

1. **Always test templates** before sending
2. **Use merge fields sparingly** for better performance
3. **Keep HTML clean** and well-structured
4. **Include fallback content** for missing data
5. **Follow email marketing best practices**

## 📞 Support

For questions or issues with the email template builder:

1. Check the demo output for available options
2. Review merge field documentation
3. Test with sample templates first
4. Verify your GoHighLevel API credentials

---

**Ready to create professional email templates?** Run the demo and start building your email marketing system today! 🚀 