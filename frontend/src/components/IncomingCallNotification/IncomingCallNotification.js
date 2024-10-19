import React from "react";
import { Button } from "../Button/Button.js";

const IncomingCallNotification = ({ onAnswer, onDecline }) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white py-8 rounded-lg shadow-xl max-w-sm w-80 text-center">
        <h3 className="text-xl font-semibold mb-6">Incoming Call</h3>
        <div className="flex justify-center space-x-4">
          <Button
            onClick={onAnswer}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Answer
          </Button>
          <Button
            onClick={onDecline}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Decline
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallNotification;
