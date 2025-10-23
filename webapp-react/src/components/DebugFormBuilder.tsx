import React from 'react';

const DebugFormBuilder: React.FC = () => {
  return (
    <div className="p-8 bg-white">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        ✅ Debug FormBuilder - Φορτώνει κανονικά!
      </h1>
      <p className="text-lg text-gray-700 mb-4">
        Αυτό το component φορτώνει χωρίς προβλήματα. Αν το βλέπετε, η εφαρμογή λειτουργεί!
      </p>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h3 className="font-semibold text-blue-800 mb-2">Στοιχεία Ελέγχου:</h3>
        <ul className="list-disc list-inside text-blue-700">
          <li>React φορτώνει κανονικά ✅</li>
          <li>TypeScript compilation επιτυχής ✅</li>
          <li>CSS styling λειτουργεί ✅</li>
          <li>Component rendering OK ✅</li>
        </ul>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-100 p-4 rounded text-center">
          <div className="text-2xl mb-2">🟢</div>
          <div className="font-semibold">Εφαρμογή</div>
          <div className="text-sm">Λειτουργεί</div>
        </div>
        <div className="bg-yellow-100 p-4 rounded text-center">
          <div className="text-2xl mb-2">🟡</div>
          <div className="font-semibold">FormBuilder</div>
          <div className="text-sm">Σε εξέλιξη</div>
        </div>
        <div className="bg-blue-100 p-4 rounded text-center">
          <div className="text-2xl mb-2">🔵</div>
          <div className="font-semibold">Status</div>
          <div className="text-sm">Ready</div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold mb-2">Επόμενα Βήματα:</h4>
        <ol className="list-decimal list-inside text-gray-700">
          <li>Έλεγχος αν φορτώνει αυτό το component</li>
          <li>Δοκιμή του WorkingFormBuilder</li>
          <li>Αν χρειαστεί, δοκιμή Form.io ξανά</li>
        </ol>
      </div>
    </div>
  );
};

export default DebugFormBuilder;