// src/components/Modal.jsx
import React from 'react';

function Modal({ item, onClose }) {
    return (
        <div style={{ position: 'fixed', top: '20%', left: '30%', backgroundColor: 'white', padding: '20px' }}>
            <p>이름: {item.name}</p>
            <p>질병코드: {item.diseaseCode}</p>
            <p>접수일자: {item.registrationDate}</p>
            <p>계좌정보: {item.accountInfo}</p>
            <button onClick={onClose}>확인</button>
        </div>
    );
}

export default Modal;
