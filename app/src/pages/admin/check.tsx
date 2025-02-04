import React, { useState } from 'react';
import { addLottery } from '../../utils/icp';

const Check: React.FC = () => {
  const [icpPublicKey, setIcpPublicKey] = useState('');

  const handleAddLottery = async () => {
    try {
      await addLottery(
        100,
        'team1',
        'team2',
        'rcj7e-hnxhs-ryy5x-c64vv-ryztu-a6qh5-fejcs-utw4p-6q3oj-7l3o4-sqe',
      );
      console.log('Lottery added successfully');
    } catch (error) {
      console.error('Failed to add lottery:', error);
    }
  };

  return (
    <div>
      <h2>Check Component</h2>
      <button onClick={handleAddLottery}>Add Lottery</button>
    </div>
  );
};

export default Check;
