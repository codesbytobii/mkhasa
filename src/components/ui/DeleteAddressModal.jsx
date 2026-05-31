"use client";

// DeleteAddressModal.jsx
"use client";
import React, { useState } from "react";
import axios from "../../utils/axios";
import { Button } from "./Button";
import { toast } from "react-toastify";

export const DeleteAddressModal = ({ userId, addressId, onClose, onDelete }) => {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const res = await axios.post(`/remove/sa/${userId}/${addressId}`);
            toast.success("Address removed successfully.")
            onDelete(addressId); // notify parent to remove from UI
            onClose();
        } catch (err) {
            console.error("Failed to delete address:", err);
        } finally {
            setDeleting(false);
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target.id === "backdrop") onClose();
    };

    return (
        <div
            id="backdrop"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-lg relative">
                <h3 className="text-lg font-bold mb-4">Delete Address</h3>
                <p className="mb-6">Are you sure you want to delete this address? This action cannot be undone.</p>

                <div className="flex justify-end gap-2">
                    <Button type="button" onClick={onClose} className="bg-gray-200">
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleDelete}
                        className={`${deleting ? "bg-gray-500" : "bg-red-600"} text-white`}
                        disabled={deleting}
                    >
                        {deleting ? "Deleting..." : "Delete"}
                    </Button>
                </div>
            </div>
        </div>
    );
};
