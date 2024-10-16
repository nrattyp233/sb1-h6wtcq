import React, { useState } from 'react';
import { CreditCard, Link as LinkIcon } from 'lucide-react';

const LinkBank: React.FC = () => {
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');

  const handleLinkBank = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/wallet/link-bank', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ bankName, accountNumber, routingNumber }),
      });

      if (!response.ok) {
        throw new Error('Failed to link bank account');
      }

      alert('Bank account linked successfully');
      setBankName('');
      setAccountNumber('');
      setRoutingNumber('');
    } catch (error) {
      console.error('Error linking bank account:', error);
      alert('Failed to link bank account. Please try again.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Link Bank Account</h2>
      <form onSubmit={handleLinkBank} className="space-y-4">
        <div>
          <label htmlFor="bankName" className="block mb-1">Bank Name</label>
          <input
            type="text"
            id="bankName"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="accountNumber" className="block mb-1">Account Number</label>
          <input
            type="text"
            id="accountNumber"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="routingNumber" className="block mb-1">Routing Number</label>
          <input
            type="text"
            id="routingNumber"
            value={routingNumber}
            onChange={(e) => setRoutingNumber(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 flex items-center justify-center">
          <LinkIcon className="mr-2" size={18} />
          Link Bank Account
        </button>
      </form>
    </div>
  );
};

export default LinkBank;