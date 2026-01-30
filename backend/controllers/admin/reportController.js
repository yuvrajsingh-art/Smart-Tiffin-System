const PDFDocument = require('pdfkit');
const json2csv = require('json2csv'); // Robust import
const Transaction = require('../../models/transaction.model');
const Order = require('../../models/order.model');

/**
 * Generate Invoice PDF
 * Downloads a PDF invoice for a specific transaction
 */
exports.generateInvoicePDF = async (req, res) => {
    try {
        const { id } = req.params; // Transaction ID (Invoice ID)

        // Find transaction (simulated lookup from ID string pattern if needed, or direct DB ID)
        // Assuming ID passed is the MongoDB _id matching the Invoice ID suffix
        // If frontend passes "INV-123456", we might need logic to find it. 
        // For simplicity, we assume frontend passes the Transaction _id.

        let query = {};
        if (id.length > 10 && !id.startsWith('INV')) {
            query._id = id;
        } else {
            // Handle "INV-X" format if passed, or just fail for now assuming explicit ID
            return res.status(400).json({ success: false, message: "Invalid ID format" });
        }

        // Populate orderId and then the customer inside that order
        const transaction = await Transaction.findOne(query).populate({
            path: 'orderId',
            populate: { path: 'customer', select: 'fullName email address' }
        });

        if (!transaction) {
            return res.status(404).json({ success: false, message: "Invoice not found" });
        }

        const customer = transaction.orderId?.customer;
        const customerName = customer?.fullName || 'Guest User';
        const customerEmail = customer?.email || '';

        // Create PDF
        const doc = new PDFDocument({ margin: 50 });

        // Set Headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Invoice-${transaction._id}.pdf`);

        doc.pipe(res);

        // -- Header --
        doc.fillColor('#444444')
            .fontSize(20)
            .text('Smart Tiffin System', 110, 57)
            .fontSize(10)
            .text('123 Food Street, Indore, MP', 200, 65, { align: 'right' })
            .text('support@smarttiffin.com', 200, 80, { align: 'right' })
            .moveDown();

        // -- Invoice Info --
        doc.fillColor('#000000')
            .fontSize(20)
            .text('INVOICE', 50, 160);

        doc.fontSize(10)
            .text(`Invoice Number: INV-${transaction._id.toString().slice(-6).toUpperCase()}`, 50, 200)
            .text(`Invoice Date: ${new Date(transaction.createdAt).toLocaleDateString()}`, 50, 215)
            .text(`Balance Due: ₹0.00`, 50, 130, { align: 'right' });

        // -- Bill To --
        doc.text('Bill To:', 300, 200)
            .font('Helvetica-Bold')
            .text(customerName, 300, 215)
            .font('Helvetica')
            .text(customerEmail, 300, 230)
            .moveDown();

        // -- Table --
        const tableTop = 270;
        doc.font('Helvetica-Bold');
        doc.text('Item Description', 50, tableTop)
            .text('Amount', 400, tableTop, { width: 90, align: 'right' });

        doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

        doc.font('Helvetica');
        const position = tableTop + 30;
        doc.text(transaction.description || 'Tiffin Service Subscription', 50, position)
            .text(`₹${transaction.amount}`, 400, position, { width: 90, align: 'right' });

        doc.moveTo(50, position + 20).lineTo(550, position + 20).stroke();

        // -- Total --
        doc.font('Helvetica-Bold')
            .text('Total:', 350, position + 40, { align: 'right' })
            .text(`₹${transaction.amount}`, 400, position + 40, { width: 90, align: 'right' });

        // -- Footer --
        doc.fontSize(10)
            .text(
                'Payment is complete. Thank you for your business.',
                50,
                700,
                { align: 'center', width: 500 }
            );

        doc.end();

    } catch (error) {
        console.error("PDF Generation Error:", error);
        res.status(500).json({ success: false, message: "PDF Generation Failed" });
    }
};

/**
 * Export Sales CSV
 * Downloads a CSV file of sales data
 */
exports.exportSalesCSV = async (req, res) => {
    try {
        const orders = await Order.find({ status: { $ne: 'Cancelled' } })
            .populate('customer', 'fullName')
            .populate('provider', 'businessName')
            .sort({ createdAt: -1 });

        console.log(`[Export] Found ${orders.length} orders`);

        const fields = ['OrderID', 'Customer', 'Kitchen', 'Amount', 'Date', 'Status', 'PlanType'];

        const data = orders.map(o => ({
            OrderID: o._id?.toString() || 'N/A',
            Customer: o.customer?.fullName || 'Unknown',
            Kitchen: o.provider?.businessName || 'System',
            Amount: o.grandTotal || 0,
            Date: new Date(o.createdAt).toLocaleDateString(),
            Status: o.status,
            PlanType: o.order_type || 'One-time'
        }));

        if (data.length === 0) {
            return res.status(200).send("OrderID,Customer,Kitchen,Amount,Date,Status,PlanType\n");
        }

        try {
            // json2csv v6 handle
            const Parser = json2csv.Parser || require('json2csv').Parser;
            const parser = new Parser({ fields });
            const csv = parser.parse(data);

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=sales_report.csv');
            res.status(200).send(csv);
        } catch (parserError) {
            console.error("CSV Parser Error:", parserError);
            res.status(500).json({ success: false, message: "CSV Formatting Failed: " + parserError.message });
        }

    } catch (error) {
        console.error("CSV Export Main Error:", error);
        res.status(500).json({ success: false, message: "CSV Export Failed: " + error.message });
    }
};

/**
 * Export Customers CSV
 * Downloads a CSV file of all customers
 */
exports.exportCustomersCSV = async (req, res) => {
    try {
        const customers = await User.find({ role: 'customer' })
            .sort({ createdAt: -1 });

        console.log(`[Export] Found ${customers.length} customers`);

        const fields = ['CustomerID', 'FullName', 'Email', 'Mobile', 'Status', 'WalletBalance', 'Joins'];

        const data = customers.map(c => ({
            CustomerID: c._id?.toString() || 'N/A',
            FullName: c.fullName || 'Unknown',
            Email: c.email || 'N/A',
            Mobile: c.mobile || 'N/A',
            Status: c.status || 'active',
            WalletBalance: c.walletBalance || 0,
            Joins: new Date(c.createdAt).toLocaleDateString()
        }));

        if (data.length === 0) {
            return res.status(200).send("CustomerID,FullName,Email,Mobile,Status,WalletBalance,Joins\n");
        }

        try {
            const Parser = json2csv.Parser || require('json2csv').Parser;
            const parser = new Parser({ fields });
            const csv = parser.parse(data);

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=customers_report.csv');
            res.status(200).send(csv);
        } catch (parserError) {
            console.error("CSV Parser Error:", parserError);
            res.status(500).json({ success: false, message: "CSV Formatting Failed: " + parserError.message });
        }

    } catch (error) {
        console.error("CSV Customer Export Error:", error);
        res.status(500).json({ success: false, message: "Customer Export Failed: " + error.message });
    }
};
