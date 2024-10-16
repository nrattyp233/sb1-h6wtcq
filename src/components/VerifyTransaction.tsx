import React, { useState, useEffect } from 'react';
import { Check, MapPin, AlertTriangle } from 'lucide-react';
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

const VerifyTransaction: React.FC = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [transactionDetails, setTransactionDetails] = useState<any>(null);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [proximityStatus, setProximityStatus] = useState<'within' | 'outside' | null>(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setPosition([position.coords.latitude, position.coords.longitude]);
      });
    }
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!position) {
      alert("Unable to get your location. Please enable location services and try again.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/transactions/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          verificationCode,
          receiverLocation: { lat: position[0], lng: position[1] }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      setTransactionDetails(data.transaction);
      setVerificationStatus('success');
      setProximityStatus(data.proximityStatus);
    } catch (error) {
      console.error('Error verifying transaction:', error);
      setVerificationStatus('error');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Verify Transaction</h2>
      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <label htmlFor="verificationCode" className="block mb-1">Verification Code</label>
          <input
            type="text"
            id="verificationCode"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Your Location</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <MapContainer center={position || [51.505, -0.09]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker setPosition={setPosition} />
              {position && <Marker position={position} />}
              {transactionDetails && transactionDetails.senderLocation && (
                <Circle
                  center={[transactionDetails.senderLocation.lat, transactionDetails.senderLocation.lng]}
                  radius={transactionDetails.proximityLimit}
                  pathOptions={{ color: 'blue', fillColor: 'blue' }}
                />
              )}
            </MapContainer>
          </div>
        </div>
        <button type="submit" className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 flex items-center justify-center">
          <Check className="mr-2" size={18} />
          Verify Transaction
        </button>
      </form>
      {verificationStatus === 'success' && transactionDetails && (
        <div className="mt-4 p-4 bg-green-100 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-green-800">Transaction Verified Successfully</h3>
          <p>Amount: ${transactionDetails.amount}</p>
          <p>Sender: {transactionDetails.sender}</p>
          <p>Status: {transactionDetails.status}</p>
          <p>Proximity: {proximityStatus === 'within' ? 'Within range' : 'Outside range'}</p>
        </div>
      )}
      {verificationStatus === 'error' && (
        <div className="mt-4 p-4 bg-red-100 rounded-lg">
          <p className="text-red-800 font-semibold flex items-center">
            <AlertTriangle className="mr-2" size={18} />
            Verification failed. Please check the code and try again.
          </p>
        </div>
      )}
    </div>
  );
};

export default VerifyTransaction;