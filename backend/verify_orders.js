const sequelize = require('./config/database');
const { createOrder, listOrders, confirmOrder } = require('./controllers/orderController');

async function verifyOrderFlow() {
  console.log("--- STARTING ORDER FLOW VERIFICATION ---");

  try {
    // 1. Mock Request/Response for Order Creation
    const mockUser = { id: 1, name: 'Test Buyer' };
    const mockRes = {
      status: (code) => {
        console.log(`Response Status: ${code}`);
        return mockRes;
      },
      json: (data) => {
        console.log(`Response Data:`, JSON.stringify(data, null, 2));
        return mockRes;
      }
    };

    const mockBody = { deal_id: 1, vendor_id: 2, price: 150000, notes: 'Verification test' };
    
    console.log("1. Testing Order Creation...");
    await createOrder({ user: mockUser, body: mockBody }, mockRes, (err) => console.error(err));

    console.log("\n2. Testing Order Listing...");
    await listOrders({ user: mockUser }, mockRes, (err) => console.error(err));

    console.log("\n3. Testing Order Confirmation (as Vendor)...");
    const mockVendor = { id: 2, name: 'Test Vendor' };
    const mockOrderReq = { user: mockVendor, params: { id: 1 } };
    await confirmOrder(mockOrderReq, mockRes, (err) => console.error(err));

    console.log("\n--- VERIFICATION COMPLETE ---");
  } catch (err) {
    console.error("Verification failed:", err);
  } finally {
    process.exit(0);
  }
}

verifyOrderFlow();
