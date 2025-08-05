require('dotenv').config();
const { ContactTools } = require('./src/tools/contact-tools');
const { GHLApiClient } = require('./src/clients/ghl-api-client');

// Configuration - using existing .env file variables
const config = {
  accessToken: process.env.GHL_API_KEY,
  baseUrl: process.env.GHL_BASE_URL || 'https://services.leadconnectorhq.com',
  version: '2021-07-28',
  locationId: process.env.GHL_LOCATION_ID
};

async function createJaneDoeContact() {
  try {
    // Initialize the GHL API client
    const ghlClient = new GHLApiClient(config);
    
    // Initialize contact tools
    const contactTools = new ContactTools(ghlClient);
    
    // Create contact parameters
    const contactParams = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com'
    };
    
    console.log('Creating contact with parameters:', contactParams);
    
    // Execute the create_contact tool
    const result = await contactTools.executeTool('create_contact', contactParams);
    
    console.log('Contact created successfully!');
    console.log('Contact ID:', result.id);
    console.log('Contact details:', {
      name: `${result.firstName} ${result.lastName}`,
      email: result.email,
      dateAdded: result.dateAdded
    });
    
    return result;
  } catch (error) {
    console.error('Error creating contact:', error.message);
    throw error;
  }
}

// Run the function if this file is executed directly
if (require.main === module) {
  createJaneDoeContact()
    .then(() => {
      console.log('Contact creation completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed to create contact:', error);
      process.exit(1);
    });
}

module.exports = { createJaneDoeContact }; 