"use client";

import React from "react";

const types = {
  A_POSITIVE: "A+",
  A_NEGATIVE: "A-",
  B_POSITIVE: "B+",
  B_NEGATIVE: "B-",
  AB_POSITIVE: "AB+",
  AB_NEGATIVE: "AB-",
  O_POSITIVE: "O+",
  O_NEGATIVE: "O-",
};

const OrderCard = ({ order, onApprove, onDeny, isActionable }) => {
  const { orderId, branchId, hospitalId, bloodType, quantity, status } = order;

  return (
    <div className="card">
      <div className="card-content">
        <h3 className="card-title">Order ID: {orderId}</h3>
        <p className="card-info">Branch ID: {branchId}</p>
        <p className="card-info">Hospital ID: {hospitalId}</p>
        <p className="card-info">Blood Type: {types[bloodType]}</p>
        <p className="card-info">Quantity: {quantity}</p>
        <p className="card-info">Status: {status}</p>
        {isActionable && (
          <div className="card-actions">
            {status === "PENDING" && (
              <>
                <button
                  className="btn-approve"
                  onClick={() => onApprove(orderId)}
                >
                  Approve
                </button>
                <button className="btn-deny" onClick={() => onDeny(orderId)}>
                  Deny
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
