// src/components/ListItem.js
import React, { useState } from 'react';

function ListItem({ item, onProcess }) {
    const [showButton, setShowButton] = useState(false);

    return (
        <tr
            onMouseEnter={() => setShowButton(true)}
            onMouseLeave={() => setShowButton(false)}
            style={{ backgroundColor: showButton ? '#f0f0f0' : 'transparent' }}
        >
            <td>{item.date}</td>
            <td>{item.name}</td>
            <td>{item.diseaseCode}</td>
            <td>{item.birth}</td>
            <td>{item.price}</td>
            <td>{item.nonPrice}</td>
        </tr>
    );
}

export default ListItem;
