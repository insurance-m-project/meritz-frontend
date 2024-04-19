// src/components/App.js
import React, {useEffect, useState} from 'react';
import NotificationButton from './components/NotificationButton';
import ModalComponent from './components/ModalComponent';
import useWeb3 from './hooks/useWeb3';
import MRContract from './contracts/MedicalRecord.json';
import './styles.css';

function App() {
    const [data, setData] = useState([]);
    const [tempData, setTempData] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // 검색어를 저장할 상태

    const [web3, account] = useWeb3();
    const [eventCount, setEventCount] = useState(() => {
        const savedNoteData = localStorage.getItem('noteData');
        return savedNoteData ? JSON.parse(savedNoteData).length : 0;
    });

    const [selectedItem, setSelectedItem] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [deployed, setDeployed] = useState(null);

    const [hoverIndex, setHoverIndex] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [patientInfo, setPatientInfo] = useState(null);

    const [noteData, setNoteData] = useState(() => {
        // 로컬 스토리지에서 노트 데이터 불러오기
        const savedNoteData = localStorage.getItem('noteData');
        return savedNoteData ? JSON.parse(savedNoteData) : [];
    });

    useEffect(() => {
        // noteData가 변경될 때 로컬 스토리지에 저장
        localStorage.setItem('noteData', JSON.stringify(noteData));
        console.log("저장! : ", localStorage.getItem('noteData'));
    }, [noteData]);
    //
    // function formatNumber(number) {
    //     return new Intl.NumberFormat().format(number);
    // }

    const handleRowClick = (item) => {
        setSelectedItem(item);
        setPatientInfo({
                name: item['0'],
                treatmentCode: item['2'],
                treatmentPeriod: item['3'],
                registrationNumber: item['1'],
                issueNumber: item['4']
        })

        var temp =[];
        for(var i = 0;i < item['9'].length;i++) {
            temp.push({
                category:item['9'][i]['0'],
                date:item['9'][i]['1'],
                treatCode:item['9'][i]['2'],
                description:item['9'][i]['3'],
                amount:(item['9'][i]['4']),
                oop:(item['9'][i]['5']),
                pcc:(item['9'][i]['6']),
                foop:(item['9'][i]['7']),
                nonReimbursement:(item['9'][i]['8']),
            });
        }
        setTableData(temp);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        console.log(web3 + " : " + account);
        if (!account || deployed || !web3) return;

        async function setupSubscription() {
            const networkId = await web3.eth.net.getId();
            const CA = MRContract.networks[networkId].address;
            const abi = MRContract.abi;
            const Deployed = new web3.eth.Contract(abi, CA);

            setDeployed(Deployed); // 한 번만 설정하도록 조정

            web3.setProvider(new web3.providers.WebsocketProvider('ws://localhost:8503'));
            const resultData = await Deployed.methods.getMedicalRecord('receipt123').call();
            console.log(resultData);

            web3.eth.subscribe('logs', {address: CA})
                .on('data', (log) => {
                    console.log("Event triggered!");
                    setEventCount(prevEventCount => prevEventCount + 1);
                    console.log(log);

                    // 이벤트의 ABI 정의
                    const eventAbi = [{
                        type: 'string',
                        name: 'name'
                    }, {
                        type: 'string',
                        name: 'RRN'
                    }, {
                        type: 'string',
                        name: 'KCD'
                    }, {
                        type: 'string',
                        name: 'date'
                    }, {
                        type: 'string',
                        name: 'receiptNumber'
                    }, {
                        type: 'uint256',
                        name: 'totalOop'
                    }, {
                        type: 'uint256',
                        name: 'totalPcc'
                    }, {
                        type: 'uint256',
                        name: 'totalFoop'
                    }, {
                        type: 'uint256',
                        name: 'nonReimbursement'
                    }];

                    try {
                        // 로그 디코딩
                        const decodedLog = web3.eth.abi.decodeLog(eventAbi, log.data, log.topics.slice(1));
                        setNoteData([...noteData,decodedLog['4']]);
                    } catch (decodingError) {
                        console.error('Error decoding log', decodingError);
                    }
                })
                .on('error', console.error); // 에러 핸들링 추가
        }

        setupSubscription();

        console.log("밖 : " + eventCount);

        readData();
    }, [account, deployed, web3]);

    const toggleModal = (item) => {
        setSelectedItem(item);
        setShowModal(!showModal);
    };

    const readData = async () => {
        const networkId = await web3.eth.net.getId();
        const CA = MRContract.networks[networkId].address;
        const abi = MRContract.abi;
        const Deployed = new web3.eth.Contract(abi, CA); // 배포한 컨트랙트 정보 가져오기
        const resultData = await Deployed.methods.getMedicalRecords().call();

        setData(resultData);
        setTempData(resultData);
    }

    const decreaseCount = (item) => {
        setEventCount(prevCount => prevCount - 1);
        setNoteData(item);
    };


    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value); // 입력 필드의 변화를 검색어 상태에 저장
    };

    const handleSearch = () => {
        // 검색 실행 로직: tempData에서 searchTerm을 사용하여 필터링
        const filteredData = tempData.filter(item =>
            item['0'].toLowerCase().includes(searchTerm.toLowerCase()) ||
            item['1'].toLowerCase().includes(searchTerm.toLowerCase())
        );
        setData(filteredData);
    };

    function formatNumber(number) {
        return new Intl.NumberFormat().format(number);
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <div className="total-container">
                <div className="inner-container">
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
                        <img src={`${process.env.PUBLIC_URL}/img.png`} alt="Description of the image" style={{width:"400px", height:"60px"}}/>
                        <input
                            type="text"
                            placeholder="Search by name or RRN"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            style={{
                                marginLeft:'auto',
                                marginRight: '1px',
                                marginTop:'20px',
                                height: '40px',
                                fontSize: '16px'
                            }}
                        />
                        <button onClick={handleSearch} style={{
                            position:'relative',
                            marginLeft: '1px',
                            marginRight: 'auto',
                            marginTop: 'auto',
                            width: '60px',
                            height: '45px',
                        }}>
                            검색
                        </button>
                        <NotificationButton count={eventCount} data={noteData} onToggle={toggleModal} onDecreaseCount={decreaseCount}/>
                    </div>
                    <div className="table-container">
                        <table style={{width: '100%', borderCollapse: 'collapse', height: '100%'}}>
                            <thead >
                            <tr>
                                <th>진료 기간</th>
                                <th>성명</th>
                                <th>진료 분류 기호</th>
                                <th>주민등록번호</th>
                                <th>금액</th>
                                <th>비급여액</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                data.length > 0 ? (
                                    [...data].reverse().map((item, index) => (
                                        <tr
                                            key={index}
                                            style={{
                                                backgroundColor: hoverIndex === index ? '#f0f0f0' : 'transparent',
                                                borderBottom:"black"
                                        }}
                                            onMouseEnter={() => setHoverIndex(index)}
                                            onMouseLeave={() => setHoverIndex(null)}
                                            onClick={() => handleRowClick(item)}
                                        >
                                            <td>{item[3]}</td>
                                            <td>{item[0]}</td>
                                            <td>{item[2]}</td>
                                            <td>{item[1]}</td>
                                            <td>
                                                {formatNumber(parseInt(item[8]) + parseInt(item[7]) + parseInt(item[5]) + parseInt(item[6]))}
                                            </td>
                                            <td>{formatNumber(item[8])}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr style={{backgroundColor: '#f0f0f0'}}>
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
                    <div>
                        <ModalComponent
                            isOpen={isModalOpen}
                            onClose={handleClose}
                            patientInfo={patientInfo}
                            tableData={tableData}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
