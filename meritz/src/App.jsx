// src/components/App.js
import React, {useEffect,useState} from 'react';
import DataList from './components/DataList';
import NotificationButton from './components/NotificationButton';
import Modal from './components/Modal';
import useWeb3 from './hooks/useWeb3';
import MRContract from './contracts/MedicalRecord.json';
import './styles.css'; // 상대 경로에 따라 변경

function App() {
    const [data, setData] = useState([
        {date:'2023-12-22',name: "홍길동", diseaseCode: "J09", birth: "1997.01.01", price: "35,000", nonPrice:"20,000"},
        {date:'2023-12-22',name: "박개똥", diseaseCode: "J09", birth: "1997.01.01", price: "35,000", nonPrice:"20,000"},
    ]);
    const [eventCount, setEventCount] = useState(0);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [web3, account] = useWeb3();

    const [deployed, setDeployed] = useState(null);

    useEffect(() => {
        (async () => {
            if (!account) return <h1>메타마스크를 연결해주세요.</h1>;
            if (deployed) return;

            // networkId 가져오기
            const networkId = await web3.eth.net.getId();
            const CA = MRContract.networks[networkId].address;

            const abi = MRContract.abi;

            // Contract를 호출할 때 필요한 값들을 인자값으로 전달
            // 인자값 2개 , (abi, CA)
            const Deployed = new web3.eth.Contract(abi, CA); // 배포한 컨트랙트 정보 가져오기

            const resultData = await Deployed.methods.getMedicalRecord('receipt123').call();
            console.log(resultData['0']);
            // 이벤트 구독
            // 백그라운드에서 돌아가는 코드.
            /**
             * eth.subscribe() 인자값 2개
             * 1. 'logs' 이벤트 구독
             * 2. 어느 컨트랙트 안에 있는 로그를 가져올 것인가. (해당 컨트랙트 안에 있는 로그만 추적)
             */
            // subscribe() : 구독하겠다.
            // on() : 받겠다.
            // 'logs' 이벤트가 발동할 때마다 on()에 있는 콜백함수 발동
            web3.eth.subscribe('logs', { address: CA }).on('data', (log) => {

                // decodeLog() 인자값
                // 1. 받아온 데이터를 어떤 형태로 파싱할 것인지
                //    type은 Solidity 쪽에서 선언한 타입 작성 (받는 쪽에서는 string으로 파싱)
                //    name은 이름을 지정해주는 것 (받을 이름)
                // 2. 파싱할 데이터
                console.log(log.data);
                const params = [{ type: 'uint256', name: 'count' }];
                const value = web3.eth.abi.decodeLog(params,log.data); // 반환값 Object
                console.log(value);
                // emit 한 데이터가 여러개라면 반환값의 형태는 배열 안의 Object
                // 여러 데이터가 있을 경우 인덱스 혹은 지정한 name으로 구분

            });
            // data : '0x0000000000000000000000000000000000000000000000000000000000000002'
            // uint256 공간 안에 count 상태변수 값만큼 넣어놓은 것

            setDeployed(Deployed);
        })();
    }, []);

    const handleProcess = (item) => {
        console.log('Processing:', item);
        setEventCount(eventCount + 1);
    };

    const toggleModal = (item) => {
        setSelectedItem(item);
        setShowModal(!showModal);
    };

    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <div className="total-container">
                <div className="inner-container">
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
                        <span>
                            <span style={{fontSize:'60px',fontWeight:'900',color:'red'}}>Meritz</span>
                            <span style={{fontSize:'40px',fontWeight:'900',color:'black'}}>메리츠화재</span>
                        </span>
                        <button onClick={() => setData([...data, {
                            date:'2023-12-22',name: "새로운 환자", diseaseCode: "J09", birth: "1997.01.01", price: "35,000", nonPrice:"20,000"
                        }])} style={{marginLeft:'auto', marginRight:'10px',marginTop:'auto', width:'60px',height:'40px'}}>조회
                        </button>
                        <NotificationButton count={eventCount} data={data} onToggle={toggleModal}/>
                    </div>
                    <DataList data={data} onProcess={handleProcess}/>
                    {showModal && <Modal item={selectedItem} onClose={() => setShowModal(false)}/>}
                </div>
            </div>
        </div>
    );
}

export default App;
