"use client";

import React from "react";
import { useState, useEffect } from "react";
import Modal from "./Modal";
import dateStringOffSetCorrection from "@/app/utils/dateOffSetCorrection";
import configuration from "@/app/config";
import Cookies from "js-cookie";

const types = [
  { value: 'A_POSITIVE', label: 'A+' },
  { value: 'A_NEGATIVE', label: 'A-' },
  { value: 'B_POSITIVE', label: 'B+' },
  { value: 'B_NEGATIVE', label: 'B-' },
  { value: 'AB_POSITIVE', label: 'AB+' },
  { value: 'AB_NEGATIVE', label: 'AB-' },
  { value: 'O_POSITIVE', label: 'O+' },
  { value: 'O_NEGATIVE', label: 'O-' },
];

const EventCard = ({ event, onEdit, onDelete, isEditable, isOngoing }) => {
  const { name, eventDate, street, city, state, zip, branchId, eventId } = event;
  const [isModalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState(false);

  const handleEditClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setError("");
  };
  
  const handleSubmit = async (updatedEvent) => {
    const success = await onEdit(updatedEvent);
    if (success) {
      handleCloseModal();
    }
  };

  const handleDonation = async (donationDetails) => {
    try {
      const response = await fetch(`${configuration.BACKEND_URL}/lifeline/donation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`
        },
        body: JSON.stringify(donationDetails),
      });
      if (response.ok) {
        handleCloseModal();
      } else {
        setError(`Unable to submit donation details: ${response.message}`);
      }
    } catch (error) {
      setError('Donation details submission failed');
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [isModalOpen]);

  return (
    <div className="card">
      <div className="card-content">
        <h3 className="card-title">{name}</h3>
        <p className="card-date">
          Date: {dateStringOffSetCorrection(eventDate).toLocaleDateString()}
        </p>
        <p className="card-address">
          {street}, {city}, {state}, {zip}
        </p>
        <div className="card-actions">
          {isEditable && (
            <button className="btn-edit" onClick={handleEditClick}>
              Edit
            </button>
          )}
          {isEditable && (
            <button className="btn-delete" onClick={() => onDelete(eventId)}>
              Delete
            </button>
          )}
          {isOngoing && (
            <button className="btn-ongoing" onClick={handleEditClick}>
              Enter blood donation
            </button>
          )}
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {isEditable && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const updatedEvent = {
                ...event,
                name: e.target.name.value,
                eventDate: e.target.eventDate.value,
                street: e.target.street.value,
                city: e.target.city.value,
                state: e.target.state.value,
                zip: e.target.zip.value,
              };
              handleSubmit(updatedEvent);
            }}
            className="space-y-6 bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto"
          >
            <h3 className="text-lg font-semibold text-gray-800">Edit Event</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                defaultValue={name}
                required
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                name="eventDate"
                defaultValue={dateStringOffSetCorrection(eventDate).toISOString().slice(0, 10)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Street</label>
              <input
                type="text"
                name="street"
                defaultValue={street}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                name="city"
                defaultValue={city}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <input
                type="text"
                name="state"
                defaultValue={state}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Zip</label>
              <input
                type="text"
                name="zip"
                defaultValue={zip}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="text-right">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Save
              </button>
            </div>
          </form>
        )}
        {isOngoing && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const donationDetails = {
                eventId: e.target.eventId.value,
                donationDate: e.target.donationDate.value,
                branchId: e.target.branchId.value,
                donorId: e.target.donorId.value,
                quantity: e.target.quantity.value,
                bloodType: e.target.bloodType.value,
              };
              handleDonation(donationDetails);
            }}
            className="space-y-6 bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto"
          >
            <h3 className="text-lg font-semibold text-gray-800">Edit Event</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Event Id</label>
              <input
                type="text"
                name="eventId"
                defaultValue={eventId}
                required
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Donation Date</label>
              <input
                type="date"
                name="donationDate"
                defaultValue={dateStringOffSetCorrection(eventDate).toISOString().slice(0, 10)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                readOnly
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Blood Bank Id</label>
              <input
                type="text"
                name="branchId"
                defaultValue={branchId}
                required
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Donor Id</label>
              <input
                type="number"
                name="donorId"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                name="quantity"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Blood Type</label>
              <select
                name="bloodType"
                defaultValue={types[0].value}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {types.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}  
              </select>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <div className="text-right">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Save
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default EventCard;
