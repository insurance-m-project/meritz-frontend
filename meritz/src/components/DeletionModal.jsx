// src/components/DeletionModal.js
import React from 'react';

function DeletionModal({ isOpen, message }) {
    if (!isOpen) {
        return null;
    }

    return (
        <div style={modalStyle}>
            <div style={modalContentStyle}>
                <h2>{message}</h2>
            </div>
        </div>
    );
}

const modalStyle = {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '1000'
};

const modalContentStyle = {
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '5px'
};

export default DeletionModal;
