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
        'ggnrl-hx36i-23hbl-m62bs-cvqef-a56bi-u4iy4-jb2i2-6wpxb-gyjph-mqe',
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
