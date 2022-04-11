import React, { useEffect, useState } from 'react';
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { AwesomeButton } from 'react-awesome-button';
import { fetchHiveEngineData, fetchHiveEngineDataForSpecficToken }from '../../utils/hiveEngine';

export default function AdditonalInformationModal(props) {
    const [tokenWithMetrics, setTokenWithMetrics] = useState({_id: '1', issuer: 'hive', name: 'Hive Engine Token', symbol: 'HIVE', description: 'BEE is the native token for the Hive Engine platform', metadata: '{"url":"https://hive-engine.com","icon":"https://s3.amazonaws.com/steem-engine/images/icon_steem-engine_gradient.svg","desc":"BEE is the native token for the Hive Engine platform"}', volume: 0.00, maxSupply: 0.00, circulatingSupply: 0.00, lowestAsk: 0.00, highestBid: 0.00, lastDayPrice: 0.00, priceChangeHive: 0.00, priceChangePercent: '0.00%'})

    async function getMetrics() {
        if(props.selectedToken.symbol){
            const token = await fetchHiveEngineDataForSpecficToken({ symbol: props.selectedToken.symbol });
            const metrics = await fetchHiveEngineData('market', 'metrics', {symbol: props.selectedToken.symbol});
            console.log(props)
            console.log(token)
            console.log(metrics);
            setTokenWithMetrics(state => ({...state,  name: token.name, symbol: token.symbol, metadata: token.metadata, maxSupply: token.maxSupply, circulatingSupply: token.circulatingSupply, description: JSON.parse(token.metadata).desc}))
        }
    }

    useEffect(() => {
        getMetrics()
    }, [props])

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
                Additional Information
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h2>Token</h2>
                <h6>{tokenWithMetrics.name}</h6>
                <br></br>
                
                <h2>Symbol</h2>
                <h6>{tokenWithMetrics.symbol}</h6>
                <br></br>
                
                <h2>Description</h2>
                <h6>{tokenWithMetrics.description}</h6>
                <br></br>

                <h2>Max Supply</h2>
                <h6>{tokenWithMetrics.maxSupply}</h6>
                <br></br>

                
                <h2>Circulating Supply</h2>
                <h6>{tokenWithMetrics.circulatingSupply}</h6>
                <br></br>

            </Modal.Body>
            <Modal.Footer>
            <AwesomeButton className="center mr-auto" size="large" type="secondary" action={props.onHide}>Close</AwesomeButton>
            </Modal.Footer>
        </Modal>
    );
}