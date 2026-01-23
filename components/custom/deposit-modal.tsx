import React from 'react';

interface DepositModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDeposit: (amount: number) => void;
    currentBalance: number;
}

export const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, onDeposit, currentBalance }) => {
    const [amount, setAmount] = React.useState('');

    if (!isOpen) return null;

    const quickAmounts = [25, 50, 100, 250, 500, 1000];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
                <h3 className="text-2xl font-bold mb-2">Deposit Funds</h3>
                <p className="text-gray-600 mb-6">Add money to your MyBET account</p>

                <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-4 rounded-lg mb-6">
                    <p className="text-sm opacity-90 mb-1">Current Balance</p>
                    <p className="text-3xl font-bold">${currentBalance.toFixed(2)}</p>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2 font-semibold">Deposit Amount</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl font-semibold">$</span>
                        <input
                            type="number"
                            min="10"
                            step="10"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="50.00"
                            className="w-full border-2 border-gray-300 rounded-lg pl-8 pr-4 py-3 text-lg font-semibold text-black focus:border-blue-600 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-6">
                    {quickAmounts.map((q) => (
                        <button
                            key={q}
                            onClick={() => setAmount(q.toString())}
                            className="bg-gray-100 hover:bg-gray-200 py-2 rounded-lg font-semibold text-gray-700 transition-colors"
                        >
                            ${q}
                        </button>
                    ))}
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 mb-2 font-semibold">Payment Method</label>
                    <select className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-black focus:border-blue-600 focus:outline-none">
                        <option>Credit/Debit Card</option>
                        <option>PayPal</option>
                        <option>Bank Transfer</option>
                        <option>Mobile Money</option>
                    </select>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onDeposit(Number(amount))}
                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};
