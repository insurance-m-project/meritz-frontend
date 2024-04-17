// src/components/DataList.jsx
import React from 'react';
import ListItem from './ListItem';

function DataList({data, onProcess}) {
    return (
        <div className="table-container">
            <table style={{width: '100%', borderCollapse: 'collapse', height:'100%'}}>
                <thead>
                <tr>
                    <th>진료 기간</th>
                    <th>성명</th>
                    <th>진료 분류 기호</th>
                    <th>생년월일</th>
                    <th>금액</th>
                    <th>비급여액</th>
                </tr>
                </thead>
                <tbody>
                {
                    data.length > 0 ? (
                        data.map((item, index) => (
                            <ListItem key={index} item={item} onProcess={() => onProcess(item)}/>
                        ))
                    ) : (
                        <tr style={{backgroundColor:'#f0f0f0'}}>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default DataList;
