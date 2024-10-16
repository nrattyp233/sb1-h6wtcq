import React, { useState, useEffect } from 'react';
import { MapPin, Send, Clock, DollarSign, Shield } from 'lucide-react';
import { MapContainer, TileLayer, Circle, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// ... (keep existing LocationMarker component)

const SendMoney: React.FC = () => {
  // ... (keep existing state variables)
  const [fee, setFee] = useState(0);

  // ... (keep existing useEffect and fetchWalletBalance function)

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!position) {
      alert("Unable to get your location. Please enable location services and try again.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/transactions/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          receiverId: recipient,
          amount: parseFloat(amount),
          proximityLimit: proximityRadius,
          timeLimit: parseInt(timeLimit),
          useWallet,
          useGeofence,
          senderLocation: { lat: position[0], lng: position[1] }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to initiate transaction');
      }

      const data = await response.json();
      setVerificationCode(data.verificationCode);
      setFee(data.fee);
      alert(`Transaction initiated. Share this verification code with the recipient: ${data.verificationCode}`);
    } catch (error) {
      console.error('Error initiating transaction:', error);
      alert('Failed to initiate transaction. Please try again.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Send Money</h2>
      <form onSubmit={handleSend} className="space-y-4">
        {/* ... (keep existing form fields) */}
        <div>
          <p className="text-sm text-gray-600">
            A 3% fee will be added to the transaction amount.
          </p>
        </div>
        {/* ... (keep existing button and map) */}
      </form>
      {verificationCode && (
        <div className="mt-4 p-4 bg-green-100 rounded-lg">
          <p className="text-green-800 font-semibold flex items-center">
            <Shield className="mr-2" size={18} />
            Verification Code: {verificationCode}
          </p>
          <p className="mt-2 text-sm text-green-700">Share this code with the recipient to complete the transaction.</p>
          <p className="mt-2 text-sm text-green-700">Transaction fee: ${fee.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default SendMoney;