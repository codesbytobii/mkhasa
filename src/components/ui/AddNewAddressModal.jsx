"use client";

// AddNewAddressModal.jsx
"use client";
import React, { useState } from "react";
import axios from "../../utils/axios";
import { Button } from "./Button";
import { states } from "../../app-pages/checkout";
import toast from "react-hot-toast";

// Simple controlled input component
const ModalInput = ({ name, value, onChange, placeholder }) => (
    <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="bg-app-ash-1 rounded-sm py-2 px-4 outline-none w-full"
    />
);

export const AddNewAddressModal = ({ userId, onClose, onAdd }) => {
    const [formValues, setFormValues] = useState({
        street1: "",
        street2: "",
        zipCode: "",
        city: "",
        state: "",
        country: "Nigeria",
        phone: "",
    });

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    // Submit handler
    const handleSubmit = async (e) => {
        setSaving(true);

        // Simple validation
        const newErrors = {};
        if (!formValues.street1) newErrors.street1 = "Street 1 is required";
        if (!formValues.zipCode) newErrors.zipCode = "Zip Code is required";
        if (!formValues.city) newErrors.city = "City is required";
        if (!formValues.state) newErrors.state = "State is required";
        if (!formValues.country) newErrors.country = "Country is required";
        if (!formValues.phone) newErrors.phone = "Phone is required";

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            setSaving(false);
            return;
        }

        try {
            const res = await axios.post(`/add/sa/${userId}`, formValues);
            console.log(res.data)
            toast.success("Address added successfully.")
            onAdd(res.data.addresses);
            onClose();
        } catch (err) {
            console.error("Failed to add address:", err);
        } finally {
            setSaving(false);
        }
    };

    // Close modal when clicking backdrop
    const handleBackdropClick = (e) => {
        if (e.target.id === "backdrop") onClose();
    };

    return (
        <div
            id="backdrop"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-xl max-w-xl w-[90vw] p-6 shadow-lg relative">
                <h3 className="text-lg font-bold mb-4">Add New Address</h3>
                <div className="grid gap-3">
                    <ModalInput
                        placeholder="Street 1"
                        name="street1"
                        value={formValues.street1}
                        onChange={handleChange}
                    />
                    {errors.street1 && <p className="text-red-500 text-sm">{errors.street1}</p>}

                    <ModalInput
                        placeholder="Street 2"
                        name="street2"
                        value={formValues.street2}
                        onChange={handleChange}
                    />

                    <ModalInput
                        placeholder="Zip Code"
                        name="zipCode"
                        value={formValues.zipCode}
                        onChange={handleChange}
                    />
                    {errors.zipCode && <p className="text-red-500 text-sm">{errors.zipCode}</p>}

                    <ModalInput
                        placeholder="City"
                        name="city"
                        value={formValues.city}
                        onChange={handleChange}
                    />
                    {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}

                    <select
                        name="state"
                        value={formValues.state}
                        onChange={handleChange}
                        className="bg-app-ash-1 rounded-sm py-1 px-2 outline-none"
                    >
                        <option value="">Select State</option>
                        {states.map(({ name, value }, i) => (
                            <option key={i} value={value} className="bg-app-ash-1 w-full">
                                {name}
                            </option>
                        ))}
                    </select>
                    {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}

                    <ModalInput
                        placeholder="Country"
                        name="country"
                        value={formValues.country}
                        onChange={handleChange}
                    />
                    {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}

                    <ModalInput
                        placeholder="Phone"
                        name="phone"
                        value={formValues.phone}
                        onChange={handleChange}
                    />
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

                    <div className="flex justify-end gap-2 mt-4">
                        <Button type="button" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button disabled={saving} type="submit" onClick={handleSubmit} className="bg-black text-white">
                            {saving ? "Saving..." : "Save Address"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
