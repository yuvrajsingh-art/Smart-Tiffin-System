/**
 * =============================================================================
 * REPORT CONTROLLER
 * =============================================================================
 * Handles report generation and export functionality:
 * - Invoice PDF generation
 * - Sales CSV export
 * - Customers CSV export
 * =============================================================================
 */

const PDFDocument = require('pdfkit');
const json2csv = require('json2csv');
const Transaction = require('../../models/transaction.model');
const Order = require('../../models/order.model');
const User = require('../../models/user.model');
const { isValidObjectId } = require('../../utils/validationHelper');
const { formatDate } = require('../../utils/dateHelper');
const { sendError } = require('../../utils/responseHelper');

// =============================================================================
// INVOICE PDF GENERATION
// =============================================================================

/**
 * Generate and download invoice PDF
 * @route GET /api/admin/finance/invoice/:id/download
 * @param {String} id - Transaction ID
 */
exports.generateInvoicePDF = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID format
        if (!isValidObjectId(id)) {
            return sendError(res, 400, "Invalid invoice ID format");
        }

        // Find transaction with populated order and customer
        const transaction = await Transaction.findById(id).populate({
            path: 'orderId',
            populate: { path: 'customer', select: 'fullName email address' }
        });

        if (!transaction) {
            return sendError(res, 404, "Invoice not found");
        }

        const customer = transaction.orderId?.customer;
        const customerName = customer?.fullName || 'Guest User';
        const customerEmail = customer?.email || '';

        // Create PDF document
        const doc = new PDFDocument({ margin: 50 });

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Invoice-${transaction._id}.pdf`);

        doc.pipe(res);

        // Header section
        doc.fillColor('#444444')
            .fontSize(20)
            .text('Smart Tiffin System', 110, 57)
            .fontSize(10)
            .text('123 Food Street, Indore, MP', 200, 65, { align: 'right' })
            .text('support@smarttiffin.com', 200, 80, { align: 'right' })
            .moveDown();

        // Invoice info section
        doc.fillColor('#000000')
            .fontSize(20)
            .text('INVOICE', 50, 160);

        const invoiceNumber = `INV-${transaction._id.toString().slice(-6).toUpperCase()}`;
        const invoiceDate = formatDate(transaction.createdAt);

        doc.fontSize(10)
            .text(`Invoice Number: ${invoiceNumber}`, 50, 200)
            .text(`Invoice Date: ${invoiceDate}`, 50, 215)
            .text(`Balance Due: ₹0.00`, 50, 130, { align: 'right' });

        // Bill to section
        doc.text('Bill To:', 300, 200)
            .font('Helvetica-Bold')
            .text(customerName, 300, 215)
            .font('Helvetica')
            .text(customerEmail, 300, 230)
            .moveDown();

        // Table section
        const tableTop = 270;
        doc.font('Helvetica-Bold');
        doc.text('Item Description', 50, tableTop)
            .text('Amount', 400, tableTop, { width: 90, align: 'right' });

        doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

        doc.font('Helvetica');
        const position = tableTop + 30;
        const itemDescription = transaction.description || 'Tiffin Service Subscription';
        doc.text(itemDescription, 50, position)
            .text(`₹${transaction.amount}`, 400, position, { width: 90, align: 'right' });

        doc.moveTo(50, position + 20).lineTo(550, position + 20).stroke();

        // Total section
        doc.font('Helvetica-Bold')
            .text('Total:', 350, position + 40, { align: 'right' })
            .text(`₹${transaction.amount}`, 400, position + 40, { width: 90, align: 'right' });

        // Footer section
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
        return sendError(res, 500, "PDF generation failed", error);
    }
};

// =============================================================================
// CSV EXPORTS
// =============================================================================

/**
 * Export sales data as CSV
 * @route GET /api/admin/reports/sales/download
 */
exports.exportSalesCSV = async (req, res) => {
    try {
        // Fetch orders (excluding cancelled)
        const orders = await Order.find({ status: { $ne: 'Cancelled' } })
            .populate('customer', 'fullName')
            .populate('provider', 'businessName')
            .sort({ createdAt: -1 });

        console.log(`[Export] Found ${orders.length} orders`);

        // Define CSV fields
        const fields = ['OrderID', 'Customer', 'Kitchen', 'Amount', 'Date', 'Status', 'PlanType'];

        // Map orders to CSV data
        const data = orders.map(order => ({
            OrderID: order._id?.toString() || 'N/A',
            Customer: order.customer?.fullName || 'Unknown',
            Kitchen: order.provider?.businessName || 'System',
            Amount: order.grandTotal || 0,
            Date: formatDate(order.createdAt),
            Status: order.status,
            PlanType: order.order_type || 'One-time'
        }));

        // Handle empty data
        if (data.length === 0) {
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=sales_report.csv');
            return res.status(200).send("OrderID,Customer,Kitchen,Amount,Date,Status,PlanType\n");
        }

        // Generate CSV
        try {
            const Parser = json2csv.Parser || require('json2csv').Parser;
            const parser = new Parser({ fields });
            const csv = parser.parse(data);

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=sales_report.csv');
            return res.status(200).send(csv);
        } catch (parserError) {
            console.error("CSV Parser Error:", parserError);
            return sendError(res, 500, `CSV formatting failed: ${parserError.message}`);
        }

    } catch (error) {
        console.error("CSV Export Error:", error);
        return sendError(res, 500, "CSV export failed", error);
    }
};

/**
 * Export customers data as CSV
 * @route GET /api/admin/reports/customers/download
 */
exports.exportCustomersCSV = async (req, res) => {
    try {
        // Fetch all customers
        const customers = await User.find({ role: 'customer' })
            .sort({ createdAt: -1 });

        console.log(`[Export] Found ${customers.length} customers`);

        // Define CSV fields
        const fields = ['CustomerID', 'FullName', 'Email', 'Mobile', 'Status', 'WalletBalance', 'Joins'];

        // Map customers to CSV data
        const data = customers.map(customer => ({
            CustomerID: customer._id?.toString() || 'N/A',
            FullName: customer.fullName || 'Unknown',
            Email: customer.email || 'N/A',
            Mobile: customer.mobile || 'N/A',
            Status: customer.status || 'active',
            WalletBalance: customer.walletBalance || 0,
            Joins: formatDate(customer.createdAt)
        }));

        // Handle empty data
        if (data.length === 0) {
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=customers_report.csv');
            return res.status(200).send("CustomerID,FullName,Email,Mobile,Status,WalletBalance,Joins\n");
        }

        // Generate CSV
        try {
            const Parser = json2csv.Parser || require('json2csv').Parser;
            const parser = new Parser({ fields });
            const csv = parser.parse(data);

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=customers_report.csv');
            return res.status(200).send(csv);
        } catch (parserError) {
            console.error("CSV Parser Error:", parserError);
            return sendError(res, 500, `CSV formatting failed: ${parserError.message}`);
        }

    } catch (error) {
        console.error("CSV Customer Export Error:", error);
        return sendError(res, 500, "Customer export failed", error);
    }
};
