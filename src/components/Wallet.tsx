import React, { useState, useEffect } from 'react';
import { DollarSign, MapPin, CreditCard, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const LocationMarker: React.FC<{ setPosition: (pos: [number, number]) => void }> = ({ setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

const Wallet: React.FC = () => {
  const [balance, setBalance] = useState(0);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [geofenceRadius, setGeofenceRadius] = useState(100);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [linkedBanks, setLinkedBanks] = useState<any[]>([]);

  useEffect(() => {
    fetchWalletData();
    fetchTransactions();
  }, []);

  const fetchWalletData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/wallet', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch wallet data');
      const data = await response.json();
      setBalance(data.balance);
      setLinkedBanks(data.linkedBanks);
      if (data.geofence) {
        setPosition([data.geofence.lat, data.geofence.lng]);
        setGeofenceRadius(data.geofence.radius);
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/transactions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const data = await response.json();
      setTransactions(data.transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleSetGeofence = async () => {
    if (!position) return;
    try {
      const response = await fetch('http://localhost:5000/api/wallet/geofence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          lat: position[0],
          lng: position[1],
          radius: geofenceRadius,
        }),
      });
      if (!response.ok) throw new Error('Failed to set geofence');
      alert('Geofence set successfully');
    } catch (error) {
      console.error('Error setting geofence:', error);
      alert('Failed to set geofence');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Wallet</h2>
      <div className="bg-blue-100 p-4 rounded-lg mb-4">
        <p className="text-lg flex items-center">
          <DollarSign className="mr-2" size={18} />
          Balance: ${balance.toFixed(2)}
        </p>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Set Geofence</h3>
        <div style={{ height: '300px', width: '100%' }}>
          <MapContainer center={position || [51.505, -0.09]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker setPosition={setPosition} />
            {position && (
              <>
                <Marker position={position} />
                <Circle
                  center={position}
                  radius={geofenceRadius}
                  pathOptions={{ color: 'blue', fillColor: 'blue' }}
                />
              </>
            )}
          </MapContainer>
        </div>
        <div className="mt-2 flex items-center">
          <input
            type="number"
            value={geofenceRadius}
            onChange={(e) => setGeofenceRadius(Number(e.target.value))}
            className="p-2 border rounded mr-2"
            min="1"
          />
          <button
            onClick={handleSetGeofence}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Set Geofence
          </button>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Linked Bank Accounts</h3>
        <div className="space-y-2">
          {linkedBanks.map((bank, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded">
              <div className="flex items-center">
                <CreditCard className="mr-2" size={18} />
                <span>{bank.bankName} - ****{bank.accountNumber.slice(-4)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Recent Transactions</h3>
        <div className="space-y-2">
          {transactions.map((transaction, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded">
              <div className="flex items-center">
                {transaction.type === 'sent' ? (
                  <ArrowUpRight className="mr-2 text-red-500" size={18} />
                ) : (
                  <ArrowDownRight className="mr-2 text-green-500" size={18} />
                )}
                <span>{transaction.type === 'sent' ? 'Sent to' : 'Received from'} {transaction.otherParty}</span>
              </div>
              <span className={transaction.type === 'sent' ? 'text-red-500' : 'text-green-500'}>
                ${transaction.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wallet;