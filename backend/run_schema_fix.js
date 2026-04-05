const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const forceSchemaFix = require('./force_schema_fix');
forceSchemaFix().then(() => {
  console.log('Done script.');
  process.exit(0);
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
