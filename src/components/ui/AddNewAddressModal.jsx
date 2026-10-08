"use client";

import React, { useMemo, useState } from "react";
import { Button } from "./Button";
import { SearchableSelect } from "../SearchableSelect";
import {
  states,
  getLgasByState,
} from "../../data/nigerianLocations";

const initialFormValues = {
  street1: "",
  street2: "",
  zipCode: "",
  city: "",
  state: "",
  country: "Nigeria",
  phone: "",
};

const ModalInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  type = "text",
  error,
}) => {
  return (
    <div className="w-full">
      <label
        htmlFor={name}
        className="mb-1 block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
        className={`w-full rounded-sm border-none bg-app-ash-1 px-4 py-2 outline-none focus:ring-2 focus:ring-black ${
          error ? "ring-1 ring-red-500" : ""
        }`}
      />

      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

export const AddNewAddressModal = ({ onClose, onAdd }) => {
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const lgaOptions = useMemo(
    () => getLgasByState(formValues.state),
    [formValues.state]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormValues((previousValues) => ({
      ...previousValues,
      [name]: value,
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
    }));

    setSubmitError("");
  };

  const handleStateChange = (selectedState) => {
    setFormValues((previousValues) => ({
      ...previousValues,
      state: selectedState,
      city: "",
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      state: "",
      city: "",
    }));

    setSubmitError("");
  };

  const handleCityChange = (selectedCity) => {
    setFormValues((previousValues) => ({
      ...previousValues,
      city: selectedCity,
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      city: "",
    }));

    setSubmitError("");
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formValues.street1.trim()) {
      nextErrors.street1 = "Street address is required.";
    }

    if (!formValues.zipCode.trim()) {
      nextErrors.zipCode = "ZIP/postal code is required.";
    }

    if (!formValues.state) {
      nextErrors.state = "Please select a state.";
    }

    if (!formValues.city) {
      nextErrors.city = "Please select a city/LGA.";
    }

    if (!formValues.country.trim()) {
      nextErrors.country = "Country is required.";
    }

    if (!formValues.phone.trim()) {
      nextErrors.phone = "Phone number is required.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSaving || !validateForm()) {
      return;
    }

    setIsSaving(true);
    setSubmitError("");

    try {
      await onAdd({
        ...formValues,
        street1: formValues.street1.trim(),
        street2: formValues.street2.trim(),
        zipCode: formValues.zipCode.trim(),
        phone: formValues.phone.trim(),
        country: formValues.country.trim(),
      });
    } catch (error) {
      setSubmitError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to add address. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-address-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSaving) {
          onClose();
        }
      }}
    >
      <div className="max-h-full w-full max-w-lg overflow-y-auto rounded-xl bg-white p-5 shadow-xl sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2
            id="add-address-title"
            className="text-lg font-semibold text-gray-900"
          >
            Add New Address
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Close modal"
            className="rounded p-1 text-2xl leading-none text-gray-500 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <ModalInput
            label="Street Address"
            name="street1"
            value={formValues.street1}
            onChange={handleChange}
            placeholder="Enter your street address"
            required
            error={errors.street1}
          />

          <ModalInput
            label="Additional Address Details"
            name="street2"
            value={formValues.street2}
            onChange={handleChange}
            placeholder="Apartment, suite, landmark (optional)"
          />

          <ModalInput
            label="ZIP / Postal Code"
            name="zipCode"
            value={formValues.zipCode}
            onChange={handleChange}
            placeholder="Enter ZIP or postal code"
            required
            error={errors.zipCode}
          />

          {/* Searchable State dropdown */}
          <div className="w-full">
            <label
              htmlFor="state"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              State <span className="text-red-500">*</span>
            </label>

            <SearchableSelect
              id="state"
              name="state"
              value={formValues.state}
              options={states}
              placeholder="Search or select a state"
              onChange={handleStateChange}
              error={errors.state}
            />
          </div>

          {/* Searchable LGA dropdown, dependent on State */}
          <div className="w-full">
            <label
              htmlFor="city"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              City / Local Government Area{" "}
              <span className="text-red-500">*</span>
            </label>

            <SearchableSelect
              id="city"
              name="city"
              value={formValues.city}
              options={lgaOptions}
              placeholder={
                formValues.state
                  ? "Search or select an LGA"
                  : "Select a state first"
              }
              disabled={!formValues.state}
              onChange={handleCityChange}
              error={errors.city}
            />
          </div>

          <ModalInput
            label="Country"
            name="country"
            value={formValues.country}
            onChange={handleChange}
            placeholder="Enter country"
            required
            error={errors.country}
          />

          <ModalInput
            label="Phone Number"
            name="phone"
            value={formValues.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            type="tel"
            required
            error={errors.phone}
          />

          {submitError && (
            <p
              role="alert"
              className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600"
            >
              {submitError}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 sm:w-auto"
            >
              Cancel
            </Button>

            <Button
                type="button"
                disabled={isSaving}
                onClick={handleSubmit}
                className="w-full rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                {isSaving ? "Saving..." : "Save Address"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewAddressModal;
