import React, {useState} from 'react';
import Modal from 'react-modal';
import {useTable} from 'react-table';

Modal.setAppElement('#root'); // 모달을 바인딩할 root 요소 설정

function ModalComponent({isOpen, onClose, patientInfo, tableData}) {
    const data = React.useMemo(
        () => tableData,
        [tableData]
    );

    const columns = React.useMemo(
        () => [
            {Header: '항목', accessor: 'category', style: {width: '100px'}},
            {Header: '일자', accessor: 'date', style: {width: '100px'}},
            {Header: '코드', accessor: 'treatCode'},
            {Header: '명칭', accessor: 'description', style: {width: '250px'}},
            {Header: '금액', accessor: 'amount'},
            {Header: '본인부담금', accessor: 'oop'},
            {Header: '공단부담금', accessor: 'pcc'},
            {Header: '전액 본인 부담', accessor: 'foop'},
            {Header: '비급여', accessor: 'nonReimbursement'},
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({columns, data});

    // 합계 계산
    const totals = calculateTotals(tableData);

    function formatNumber(number) {
        return new Intl.NumberFormat().format(number);
    }

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
                    padding: '0px',
                    borderRadius: "12px"
                },
            }}
        >
            <div className="modal-header" style={{backgroundColor:'#2A3042', borderRadius: "12px"}}>
                <span style={{color:"white", marginLeft:"10px"}}>진료 상세</span>
                <button onClick={onClose} className="modal-close-button" style={{color:"white"}}>&times;</button>
            </div>
            <div style={{padding:"20px", marginTop:"40px", marginBottom:"40px"}}>
                <table {...getTableProps()}>
                    <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()}
                                    style={{...column.style, border: '1px solid #000', backgroundColor:"#FFBABA", color:"black"}}>{column.render('Header')}</th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                    {rows.length > 0 ? rows.map(row => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell, index) => {
                                    // 5번째 컬럼부터 숫자 포맷 적용
                                    const value = index >= 4 ? formatNumber(cell.value) : cell.render('Cell');
                                    return (
                                        <td {...cell.getCellProps()} style={{
                                            ...cell.column.style,
                                            height: '40px',
                                            minHeight: '40px',
                                            maxHeight: '40px',
                                            overflow: 'hidden',
                                            border: '1px solid #000'
                                        }}>{value}</td>
                                    );
                                })}
                            </tr>
                        );
                    }) : (
                        Array.from({length: 5}).map((_, index) => (
                            <tr key={index}>
                                <td colSpan={9} style={{
                                    height: '40px',
                                    minHeight: '40px',
                                    maxHeight: '40px',
                                    overflow: 'hidden',
                                    border: '1px solid #000'
                                }}>&nbsp;</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                    <tfoot>
                    <tr style={{border: '1px solid #000'}}>
                        <td colSpan="4" style={{border: '1px solid #000'}}>합계:</td>
                        <td style={{border: '1px solid #000'}}>{formatNumber(totals.amount)}</td>
                        <td style={{border: '1px solid #000'}}>{formatNumber(totals.oop)}</td>
                        <td style={{border: '1px solid #000'}}>{formatNumber(totals.pcc)}</td>
                        <td style={{border: '1px solid #000'}}>{formatNumber(totals.foop)}</td>
                        <td style={{border: '1px solid #000'}}>{formatNumber(totals.nonReimbursement)}</td>
                    </tr>
                    </tfoot>
                </table>
            </div>
        </Modal>
    );
}

export default ModalComponent;

function calculateTotals(data) {
    return data.reduce((acc, item) => {
        acc.amount += parseInt(item.amount);
        acc.oop += parseInt(item.oop);
        acc.pcc += parseInt(item.pcc);
        acc.foop += parseInt(item.foop);
        acc.nonReimbursement += parseInt(item.nonReimbursement);
        return acc;
    }, {amount: 0, oop: 0, pcc: 0, foop: 0, nonReimbursement: 0});
}