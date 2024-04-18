// src/components/NotificationButton.jsx
import React, { useState } from 'react';

function NotificationButton({ count, data, onToggle, onDecreaseCount }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [dropdownData, setDropdownData] = useState(data);

    const handleClick = () => {
        setShowDropdown(!showDropdown);
        console.log(data);
        dropdownData.map(item => console.log(item));
    };

    const handleClose = (index) => {
        const newData = dropdownData.filter((_, i) => i !== index);
        setDropdownData(newData);
        onDecreaseCount();
    };

    return (
        <div style={{ position: 'relative', marginTop:'auto'}}>
            <button style={{width:'60px', height:'40px'}} onClick={handleClick}>🔔 {count > 0 ? count : ''}</button>
            {showDropdown && (
                <ul style={{
                    position: 'absolute',
                    right: 0,
                    top: '100%',
                    zIndex: 1000,
                    backgroundColor: 'white',
                    boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
                    width: '270px', // 글자가 8개 들어갈 수 있는 크기로 설정
                    maxHeight: '420px', // 최대 7개 요소의 높이
                    overflowY: 'auto', // 스크롤 가능
                    listStyleType: 'none',
                    padding: 0,
                    margin: 0
                }}>
                    {
                        dropdownData.map((item, index) => (
                        <li key={index} style={{ padding: '10px 8px', height: '50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ccc',borderRadius: "8px" }}>
                            <span style={{fontWeight:"bold"}}>신규 접수 번호 : </span>
                            <p>{item[2]}</p>
                            <button onClick={() => handleClose(index)}>✖️</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default NotificationButton;
