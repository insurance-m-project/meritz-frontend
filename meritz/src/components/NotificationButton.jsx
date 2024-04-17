// src/components/NotificationButton.jsx
import React, { useState } from 'react';
import Web3 from 'web3'; // NodeJs 환경에서만 쓸 수 있는 기능은 제외하고 최소기능만 가져오기

function NotificationButton({ count, data, onToggle }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [dropdownData, setDropdownData] = useState(data);
    // 메타마스크에서 사용하고 있는 계정과 관련된 상태
    const [account, setAccount] = useState(null);
    // 클라이언트와 메타마스크가 통신하기 위한 web3
    const [web3, setWeb3] = useState(null);

    const handleClick = () => {
        setShowDropdown(!showDropdown);
    };

    const handleClose = (index) => {
        const newData = dropdownData.filter((_, i) => i !== index);
        setDropdownData(newData);
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
                    width: '200px', // 글자가 8개 들어갈 수 있는 크기로 설정
                    maxHeight: '420px', // 최대 7개 요소의 높이
                    overflowY: 'auto', // 스크롤 가능
                    listStyleType: 'none',
                    padding: 0,
                    margin: 0
                }}>
                    {dropdownData.map((item, index) => (
                        <li key={index} style={{ padding: '10px 8px', height: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ccc' }}>
                            <span onClick={() => onToggle(item)} style={{ cursor: 'pointer' }}>{item.name}</span>
                            <button onClick={() => handleClose(index)}>✖️</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default NotificationButton;
