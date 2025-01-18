import React from 'react';

const Test = () => {
  return (
    <div style={{padding: '16px'}} className="bg-blue-500 text-white p-4">
      <h1 className="text-2xl font-bold">Test Component</h1>
      <p className="mt-2">If you can see this with blue background and white text, Tailwind is working!</p>
      
      {/* Additional test elements */}
      <button className="mt-4 bg-white text-blue-500 px-4 py-2 rounded-lg">
        Test Button
      </button>
      
      <div className="mt-4 flex space-x-4">
        <div className="bg-red-500 p-4 rounded-lg">Red Box</div>
        <div className="bg-green-500 p-4 rounded-lg">Green Box</div>
        <div className="bg-yellow-500 p-4 rounded-lg">Yellow Box</div>
      </div>
    </div>
  );
};

export default Test;