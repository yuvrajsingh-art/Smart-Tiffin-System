import { FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';

function TransactionList({ transactions }) {
    const dummyTransactions = [
        { id: 1, customer: 'Rahul Sharma', amount: 450, status: 'completed', date: '2024-01-25', time: '10:30 AM' },
        { id: 2, customer: 'Priya Singh', amount: 380, status: 'completed', date: '2024-01-25', time: '11:15 AM' },
        { id: 3, customer: 'Amit Kumar', amount: 520, status: 'pending', date: '2024-01-25', time: '12:00 PM' },
        { id: 4, customer: 'Sneha Patel', amount: 400, status: 'completed', date: '2024-01-25', time: '01:30 PM' },
        { id: 5, customer: 'Vikash Gupta', amount: 350, status: 'failed', date: '2024-01-25', time: '02:45 PM' }
    ];

    const displayTransactions = transactions.length > 0 ? transactions : dummyTransactions;

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <FaCheckCircle className="text-green-600" />;
            case 'pending': return <FaClock className="text-yellow-600" />;
            case 'failed': return <FaTimesCircle className="text-red-600" />;
            default: return <FaClock className="text-gray-600" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'failed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Transactions</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                {displayTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                            {getStatusIcon(transaction.status)}
                            <div>
                                <p className="font-semibold text-gray-800">{transaction.customer}</p>
                                <p className="text-xs text-gray-500">{transaction.date} • {transaction.time}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-gray-800">₹{transaction.amount}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(transaction.status)}`}>
                                {transaction.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TransactionList;
