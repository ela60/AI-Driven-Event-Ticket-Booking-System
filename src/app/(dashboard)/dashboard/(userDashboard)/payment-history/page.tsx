import React from 'react';
import PaymentHistoryTable from './history-table';
const fakeHistoryData = [
  {
    id: "1",
    eventName: "Tech Conference 2025",
    eventPrice: "150",
    paymentStatus: "Paid",
    confirmationStatus: "Confirmed",
  },
  {
    id: "2",
    eventName: "Music Festival",
    eventPrice: "100",
    paymentStatus: "Pending",
    confirmationStatus: "Pending",
  },
  {
    id: "3",
    eventName: "Startup Pitch Night",
    eventPrice: "200",
    paymentStatus: "Paid",
    confirmationStatus: "Confirmed",
  },
];

const PaymentHistory = () => {
    return (
      <>
        <PaymentHistoryTable historyData={fakeHistoryData} />
      </>
    );
};

export default PaymentHistory;