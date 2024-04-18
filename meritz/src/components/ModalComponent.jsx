import React, { useState } from 'react';
import Modal from 'react-modal';
import { useTable } from 'react-table';

Modal.setAppElement('#root'); // 모달을 바인딩할 root 요소 설정

function ModalComponent({ isOpen, onClose, patientInfo, tableData }) {
    const data = React.useMemo(
        () => tableData,
        [tableData]
    );

    const columns = React.useMemo(
        () => [
            { Header: '항목', accessor: 'category' ,style: { width: '100px' }},
            { Header: '일자', accessor: 'date' ,style: { width: '100px' }},
            { Header: '코드', accessor: 'treatCode' },
            { Header: '명칭', accessor: 'description', style: { width: '250px' } },
            { Header: '금액', accessor: 'amount' },
            { Header: '본인부담금', accessor: 'oop' },
            { Header: '공단부담금', accessor: 'pcc' },
            { Header: '전액 본인 부담', accessor: 'foop' },
            { Header: '비급여', accessor: 'nonReimbursement' },
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data });

    if (!isOpen) return null;
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={{
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    height: 'auto',
                },
            }}
        >
            <h2>진료 정보</h2>
            <div>
                <div style={{marginLeft:"180px"}}>
                    <span style={{marginLeft:"40px", fontSize:"20px", fontWeight:"bold", color:"#600000", width:"50px"}}>성명</span>
                    <span style={{marginLeft:"90px"}}>{patientInfo.name}</span>
                    <span style={{marginLeft:"100px",fontSize:"20px", fontWeight:"bold", color:"#600000"}}>질병 분류 기호</span>
                    <span style={{marginLeft:"90px"}}>{patientInfo.treatmentCode}</span>
                    <span style={{marginLeft:"90px",fontSize:"20px", fontWeight:"bold", color:"#600000"}}>진료 기간</span>
                    <span style={{marginLeft:"50px"}}>{patientInfo.treatmentPeriod}</span>
                </div>
                <br/>
                <div style={{marginLeft:"180px"}}>
                    <span style={{fontSize:"20px", fontWeight:"bold", color:"#600000"}}>주민등록번호</span>
                    <span style={{marginLeft:"20px"}}>{patientInfo.registrationNumber}</span>
                    <span style={{marginLeft:"90px",fontSize:"20px", fontWeight:"bold", color:"#600000"}}>발행번호</span>
                    <span style={{marginLeft:"90px"}}>{patientInfo.issueNumber}</span>
                </div>
                <br/>
            </div>
            <table {...getTableProps()}>
                <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()} style={column.style}>{column.render('Header')}</th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {rows.length > 0 ? rows.map(row => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => (
                                <td {...cell.getCellProps()} style={cell.column.style}>{cell.render('Cell')}</td>
                            ))}
                        </tr>
                    );
                }) : (
                    Array.from({ length: 5 }).map((_, index) => (
                        <tr key={index}>
                            <td colSpan={9}>&nbsp;</td>
                        </tr>
                    ))
                )}
                </tbody>
                <tfoot>
                <tr>
                    <td colSpan={9}>합계:</td>
                </tr>
                </tfoot>
            </table>
            <button onClick={onClose}>닫기</button>
        </Modal>
    );
}

export default ModalComponent;
