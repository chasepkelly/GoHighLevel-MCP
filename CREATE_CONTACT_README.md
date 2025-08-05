# Create Contact Scripts

This directory contains scripts to create a contact named "Jane Doe" with email "jane@example.com" in GoHighLevel.

## Files Created

1. `create-jane-doe-contact.js` - JavaScript version
2. `create-jane-doe-contact.ts` - TypeScript version

## Prerequisites

The scripts use the existing `.env` file in the project root. Make sure your `.env` file contains:

```
GHL_API_KEY=your_go_high_level_api_key
GHL_LOCATION_ID=your_location_id
GHL_BASE_URL=https://services.leadconnectorhq.com
NODE_ENV=development
```

## How to Get Your Credentials

1. **API Key**: 
   - Log into your GoHighLevel account
   - Go to Settings > API Keys
   - Generate a new API key or use an existing one

2. **Location ID**:
   - In GoHighLevel, go to Settings > Locations
   - Find your location and copy the Location ID

## Running the Scripts

### JavaScript Version
```bash
node create-jane-doe-contact.js
```

### TypeScript Version
```bash
# First compile TypeScript
npx tsc create-jane-doe-contact.ts

# Then run the compiled JavaScript
node create-jane-doe-contact.js
```

Or run directly with ts-node:
```bash
npx ts-node create-jane-doe-contact.ts
```

## Expected Output

If successful, you should see output like:
```
Creating contact with parameters: { firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com' }
Contact created successfully!
Contact ID: abc123def456
Contact details: {
  name: 'Jane Doe',
  email: 'jane@example.com',
  dateAdded: '2024-01-15T10:30:00.000Z'
}
Contact creation completed successfully!
```

## Error Handling

The scripts include error handling for:
- Missing environment variables
- API authentication errors
- Network connectivity issues
- Invalid contact data

## Integration with MCP Tools

These scripts use the existing MCP (Model Context Protocol) tools in the project:
- `ContactTools` class from `src/tools/contact-tools.ts`
- `GHLApiClient` class from `src/clients/ghl-api-client.ts`
- Type definitions from `src/types/ghl-types.ts`

The contact creation uses the `create_contact` tool which accepts the following parameters:
- `firstName` (optional): Contact's first name
- `lastName` (optional): Contact's last name  
- `email` (required): Contact's email address
- `phone` (optional): Contact's phone number
- `tags` (optional): Array of tags to assign
- `source` (optional): Source of the contact

## Cleanup

After testing, you can delete the created contact using the GoHighLevel dashboard or by using the `delete_contact` tool with the returned contact ID. 