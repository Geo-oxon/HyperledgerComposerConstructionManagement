/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var orderStatus = {
    Created: {code: 1, text: 'Order Created'},
    Bought: {code: 2, text: 'Order Purchased'},
    Cancelled: {code: 3, text: 'Order Cancelled'},
    Ordered: {code: 4, text: 'Order Submitted to Provider'},
    ShipRequest: {code: 5, text: 'Shipping Requested'},
    Delivered: {code: 6, text: 'Order Delivered'},
    Delivering: {code: 15, text: 'Order being Delivering'},
    Backordered: {code: 7, text: 'Order Backordered'},
    Dispute: {code: 8, text: 'Order Disputed'},
    Resolve: {code: 9, text: 'Order Dispute Resolved'},
    PayRequest: {code: 10, text: 'Payment Requested'},
    Authorize: {code: 11, text: 'Payment Approved'},
    Paid: {code: 14, text: 'Payment Processed'},
    Refund: {code: 12, text: 'Order Refund Requested'},
    Refunded: {code: 13, text: 'Order Refunded'},
    SuccessTestAndInstallation: {code: 16, text: 'Test and Installtion Successfully'},
    FailTestAndInstallation: {code: 17, text: 'Test and Installtion Failed'},
  ShipRequestBackOrder: {code: 18, text: 'Ship Request Back Order'},
  DeliveredConfirmation: {code: 19, text: 'Delivered Confirmation'},
    TestFailed: {code: 20, text: 'Test Failed'},
    TestPassed: {code: 21, text: 'Test Passed'},
    Installed: {code: 22, text: 'Component Installed'},
    NotInstalled: {code: 23, text: 'Component Has not Installed'},
    OrderCompleted: {code: 24, text: 'Order Completed'}
};

/**
 * Create Order transaction processor function.
 * @param {org.example.basic.CreateOrder} inputInfor - the order to be processed
 * @transaction
 */
async function CreateOrder(inputInfor) {
  if(inputInfor.order.status !== JSON.stringify(orderStatus.OrderCompleted)){
  inputInfor.order.commercialManager = inputInfor.commercialManager;
  inputInfor.order.supplier = inputInfor.supplier;
  inputInfor.order.createdDate = new Date().toISOString();
    inputInfor.order.status = JSON.stringify(orderStatus.Created);
    let assetRegistry = await getAssetRegistry('org.example.basic.Order');
    await assetRegistry.update(inputInfor.order);
    let factory = getFactory();
    let basicEvent = factory.newEvent('org.example.basic', 'BasicEvent');
    emit(basicEvent);
  }
}

/**
 * Buy Order transaction processor function.
 * @param {org.example.basic.Buy} inputInfor - the order to be processed
 * @transaction
 */

async function Buy(inputInfor) {
  if (inputInfor.order.status === JSON.stringify(orderStatus.Created)) {
      inputInfor.order.commercialManager = inputInfor.commercialManager;
        inputInfor.order.supplier = inputInfor.supplier;
        inputInfor.order.boughtDate = new Date().toISOString();
        inputInfor.order.status = JSON.stringify(orderStatus.Bought);
      let assetRegistry = await getAssetRegistry('org.example.basic.Order');
      await assetRegistry.update(inputInfor.order);         
    }
}

/**
 * Request Shipping transaction processor function.
 * @param {org.example.basic.RequestShipping} inputInfor - the order to be processed
 * @transaction
 */
async function RequestShipping(inputInfor) {
  if (inputInfor.order.status === JSON.stringify(orderStatus.Created) || inputInfor.order.status === JSON.stringify(orderStatus.Bought)) {
    inputInfor.order.siteForeMan = inputInfor.siteForeMan;
    inputInfor.order.supplier = inputInfor.supplier;
    inputInfor.order.ShippingCompanyName = inputInfor.ShippingCompanyName;
    inputInfor.order.status = JSON.stringify(orderStatus.ShipRequest);
    let assetRegistry = await getAssetRegistry('org.example.basic.Order');
    await assetRegistry.update(inputInfor.order);
  }
}

/**
 * Request Shipping transaction processor function.
 * @param {org.example.basic.RequestShippingBackOrder} inputInfor - the order to be processed
 * @transaction
 */
async function RequestShippingBackOrder(inputInfor) {
  if (inputInfor.order.status ===JSON.stringify(orderStatus.FailTestAndInstallation)) {
    inputInfor.order.siteForeMan = inputInfor.siteForeMan;
    inputInfor.order.supplier = inputInfor.supplier;
    inputInfor.order.status = JSON.stringify(orderStatus.ShipRequestBackOrder);
    let assetRegistry = await getAssetRegistry('org.example.basic.Order');
    await assetRegistry.update(inputInfor.order);
  }
}

/**
 * Request Shipping transaction processor function.
 * @param {org.example.basic.Delivering} inputInfor - the order to be processed
 * @transaction
 */
async function Delivering (inputInfor) {
  if (inputInfor.order.status === JSON.stringify(orderStatus.ShipRequestBackOrder) || inputInfor.order.status === JSON.stringify(orderStatus.ShipRequest) ) {
    inputInfor.order.shipper = inputInfor.shipper;
    inputInfor.order.status = JSON.stringify(orderStatus.Delivering);
    let assetRegistry = await getAssetRegistry('org.example.basic.Order');
    await assetRegistry.update(inputInfor.order);
  }
}

/**
 * Request Shipping transaction processor function.
 * @param {org.example.basic.Deliver} inputInfor - the order to be processed
 * @transaction
 */
async function Deliver (inputInfor) {
  if (inputInfor.order.status === JSON.stringify(orderStatus.Delivering)) {
    inputInfor.order.status = JSON.stringify(orderStatus.Delivered);
    let assetRegistry = await getAssetRegistry('org.example.basic.Order');
    await assetRegistry.update(inputInfor.order);
  }
}

/**
 * Request Shipping transaction processor function.
 * @param {org.example.basic.DeliverConfirmation} inputInfor - the order to be processed
 * @transaction
 */
async function DeliverConfirmation (inputInfor) {
  if(inputInfor.order.status !== JSON.stringify(orderStatus.OrderCompleted)){
    inputInfor.order.status = JSON.stringify(orderStatus.DeliveredConfirmation);
    let assetRegistry = await getAssetRegistry('org.example.basic.Order');
    await assetRegistry.update(inputInfor.order);
  }
}

/**
 * Request Shipping transaction processor function.
 * @param {org.example.basic.RequestPayment} inputInfor - the order to be processed
 * @transaction
 */
async function RequestPayment (inputInfor) {
  if (inputInfor.order.status === JSON.stringify(orderStatus.Bought) || inputInfor.order.status === JSON.stringify(orderStatus.Delivering) || inputInfor.order.status === JSON.stringify(orderStatus.Delivered) || inputInfor.order.status === JSON.stringify(orderStatus.ShipRequest)) {
    inputInfor.order.supplierBankAccount = inputInfor.supplierBankAccount;
    let assetRegistry = await getAssetRegistry('org.example.basic.Order');
    await assetRegistry.update(inputInfor.order);   
  }
}

/**
 * Request Shipping transaction processor function.
 * @param {org.example.basic.MakePayment} inputInfor - the order to be processed
 * @transaction
 */
async function MakePayment (inputInfor) {
  if (inputInfor.order.status === JSON.stringify(orderStatus.DeliveredConfirmation)) {
    inputInfor.order.paymentTransactionNumber = inputInfor.paymentTransactionNumber;
    inputInfor.order.buyerBankAccount = inputInfor.buyerBankAccount;
    inputInfor.order.status = JSON.stringify(orderStatus.Paid);
    let assetRegistry = await getAssetRegistry('org.example.basic.Order');
    await assetRegistry.update(inputInfor.order);
  }
}

/**
 * Request Shipping transaction processor function.
 * @param {org.example.basic.TestFailed} inputInfor - the order to be processed
 * @transaction
 */
async function TestFailed (inputInfor) {
  if(inputInfor.order.status !== JSON.stringify(orderStatus.OrderCompleted)) {
    inputInfor.order.testComment = inputInfor.testComment;
    inputInfor.order.installer = inputInfor.installer;
    inputInfor.order.testResult = JSON.stringify(orderStatus.TestFailed);
    let assetRegistry = await getAssetRegistry('org.example.basic.Order');
    await assetRegistry.update(inputInfor.order);  
  }
}

/**
 * Request Shipping transaction processor function.
 * @param {org.example.basic.TestPassed} inputInfor - the order to be processed
 * @transaction
 */
async function TestPassed (inputInfor) {
  if(inputInfor.order.status !== JSON.stringify(orderStatus.OrderCompleted)) {
    inputInfor.order.installer = inputInfor.installer;
    inputInfor.order.testResult = JSON.stringify(orderStatus.TestPassed);
    let assetRegistry = await getAssetRegistry('org.example.basic.Order');
    await assetRegistry.update(inputInfor.order);   
  }
}

/**
 * Request Shipping transaction processor function.
 * @param {org.example.basic.Installed} inputInfor - the order to be processed
 * @transaction
 */
async function Installed (inputInfor) {
  if(inputInfor.order.status !== JSON.stringify(orderStatus.OrderCompleted)) {
    inputInfor.order.clerkOfWork = inputInfor.clerkOfWork;
    inputInfor.order.installationResult = JSON.stringify(orderStatus.Installed);
    inputInfor.order.installationComment = inputInfor.installationComment;
    let assetRegistry = await getAssetRegistry('org.example.basic.Order');
    await assetRegistry.update(inputInfor.order);   
  }
}

/**
 * Request Shipping transaction processor function.
 * @param {org.example.basic.NotInstalled} inputInfor - the order to be processed
 * @transaction
 */
async function NotInstalled (inputInfor) {
  if(inputInfor.order.status !== JSON.stringify(orderStatus.OrderCompleted)) {
    inputInfor.order.clerkOfWork = inputInfor.clerkOfWork;
    inputInfor.order.installationResult = JSON.stringify(orderStatus.NotInstalled);
    inputInfor.order.installationComment = inputInfor.installationComment;
    let assetRegistry = await getAssetRegistry('org.example.basic.Order');
    await assetRegistry.update(inputInfor.order);  
  }
}

/**
 * Request Shipping transaction processor function.
 * @param {org.example.basic.TestAndInstallationConfirmation} inputInfor - the order to be processed
 * @transaction
 */
async function TestAndInstallationConfirmation (inputInfor) {
  if (inputInfor.order.installationResult === JSON.stringify(orderStatus.NotInstalled) || inputInfor.order.testResult === JSON.stringify(orderStatus.TestFailed)) {
    inputInfor.order.status = JSON.stringify(orderStatus.FailTestAndInstallation);    
  } else {
    inputInfor.order.status = JSON.stringify(orderStatus.SuccessTestAndInstallation);
  }
  let assetRegistry = await getAssetRegistry('org.example.basic.Order');
  await assetRegistry.update(inputInfor.order); 
}

/**
 * Request Shipping transaction processor function.
 * @param {org.example.basic.RequestRefund} inputInfor - the order to be processed
 * @transaction
 */
async function RequestRefund (inputInfor) {
  if (inputInfor.order.status === JSON.stringify(orderStatus.FailTestAndInstallation)) {
    inputInfor.order.status = JSON.stringify(orderStatus.Refund)
    let assetRegistry = await getAssetRegistry('org.example.basic.Order');
    await assetRegistry.update(inputInfor.order); 
  }
}

/**
 * Request Shipping transaction processor function.
 * @param {org.example.basic.Refund} inputInfor - the order to be processed
 * @transaction
 */
async function Refund (inputInfor) {
  if (inputInfor.order.status === JSON.stringify(orderStatus.Refund)) {
    inputInfor.order.refundTransactionNumber = inputInfor.refundTransactionNumber;
    inputInfor.order.status = JSON.stringify(orderStatus.Refunded);
    let assetRegistry = await getAssetRegistry('org.example.basic.Order');
    await assetRegistry.update(inputInfor.order);    
  }
}

/**
 * Request Shipping transaction processor function.
 * @param {org.example.basic.OrderCompleted} inputInfor - the order to be processed
 * @transaction
 */
async function OrderCompleted (inputInfor) {
  if (inputInfor.order.status === JSON.stringify(orderStatus.Refunded) || inputInfor.order.status === JSON.stringify(orderStatus.SuccessTestAndInstallation)) {
    inputInfor.order.status = JSON.stringify(orderStatus.OrderCompleted);
    let assetRegistry = await getAssetRegistry('org.example.basic.Order');
    await assetRegistry.update(inputInfor.order); 
  }
}