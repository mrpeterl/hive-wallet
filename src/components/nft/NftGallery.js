import { React, useEffect, useState } from 'react';
import LoadingOverlay from 'react-loading-overlay';
import { Container, Row, Col, Card } from "react-bootstrap";
import { Navigation } from '../navigation/Navigation';
import { fetchHiveEngineData }from '../../utils/hiveEngine';
import { AwesomeButton } from 'react-awesome-button';
import { BiTransfer } from 'react-icons/bi';
import TransferNftModal from './TransferNftModal';

export default function NftGallery() {

    const [loading, setLoading] = useState(false);
    const [dCropsNFTs, setDCropsNFTs] = useState([{_id: '1', properties: { name: 'Watermelon', nft: '', primary: '', secondary: ''}, account: 'hive'}])
    const [fishMasterNFTs, setFishMasterNFTs] = useState([{_id: '1', properties: { name: 'Watermelon', nft: '', primary: '', secondary: ''}, account: 'hive'}])
    const [risingStarNFTs, setRisingStarNFTs] = useState([{_id: '1', properties: { name: 'Watermelon', nft: '', primary: '', secondary: ''}, account: 'hive'}])
    const [selectednft, setSelectedNFT] = useState({id: '1', symbol: 'TEST', name: 'Name'})
    const [transferModalShow, setTransferModalShow] = useState(false);

    async function getNFTs() {

        const dCropsNfts = await fetchHiveEngineData('nft', 'DCROPSinstances', {account: JSON.parse(localStorage.getItem('userData')).username});
        await setDCropsNFTs(dCropsNfts);
        
        const fishMasterNfts = await fetchHiveEngineData('nft', 'FISHinstances', {account: JSON.parse(localStorage.getItem('userData')).username});
        await setFishMasterNFTs(fishMasterNfts);

        const risingStarNfts = await fetchHiveEngineData('nft', 'STARinstances', {account: JSON.parse(localStorage.getItem('userData')).username});
        await setRisingStarNFTs(risingStarNfts);


        setLoading(false);    
    }

    async function initiateTransfer(id, symbol, name) {
        setSelectedNFT({id: id, symbol: symbol, name: name});
        setTransferModalShow(true);
    }

    useEffect(() => {
        setLoading(true);
        getNFTs();
    }, [])


    return ( 
        <span style={{backgroundColor: 'hsla(56, 64%, 67%, 0.863)', display: 'block', minHeight: '100vh'}}>
          <LoadingOverlay
            active={loading}
            spinner
            text='Loading your content...'
            > 
            <Navigation />
            <br />
            <Container className='selector bg-light' style={{ height:'95%', width: '100%'}}>
              <h1 style={{textAlign: 'left',  paddingTop: '2vh', paddingLeft: '4%'}}>NFT Gallery</h1>

              <hr
                  style={{
                      color: 'gray',
                      backgroundColor: 'gray',
                      height: 3
                  }}
              />
              {(dCropsNFTs.length > 0) && <h2 style={{textAlign: 'left',  paddingTop: '2vh', paddingLeft: '4%'}}>DCrops</h2>}
              <Row xs={1} md={3} className="g-4">
              {Array.from(dCropsNFTs).map((nft, idx) => (
                <Col style={{textAlign: 'left',  paddingTop: '2vh', paddingLeft: '4%', paddingRight: '4%'}}>
                  <Card >
                    <Card.Body>
                      <Card.Title><h3>{nft.properties.name}</h3></Card.Title>
                      <Card.Text>
                        {
                            nft.properties.nft && <div style={{marginTop: '5%'}}><h4>Edition</h4><h5>{JSON.parse(nft.properties.nft).edition}</h5></div>
                        }
                        {
                            nft.properties.nft && <div style={{marginTop: '5%'}}><h4>Rarity</h4><h5>{JSON.parse(nft.properties.nft).rarity}</h5></div>
                        }
                      </Card.Text>
                      <br></br>
                      <AwesomeButton  action={() => initiateTransfer(nft._id, 'DCROPS', nft.properties.name)} size='large'><BiTransfer /> Transfer</AwesomeButton>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            <br/>
            {(dCropsNFTs.length > 0) && <hr
                  style={{
                      color: 'gray',
                      backgroundColor: 'gray',
                      height: 3
                  }}
              />}
            {(fishMasterNFTs.length > 0) && <h2 style={{textAlign: 'left',  paddingTop: '2vh', paddingLeft: '4%'}}>Fishmasters</h2>}
              <Row xs={1} md={3} className="g-4">
              {Array.from(fishMasterNFTs).map((nft, idx) => (
                <Col style={{textAlign: 'left',  paddingTop: '2vh', paddingLeft: '4%', paddingRight: '4%'}}>
                  <Card >
                    <Card.Body>
                      <Card.Title><h3>{nft.properties.card}</h3></Card.Title>
                      <br></br>
                      <AwesomeButton  action={() => initiateTransfer(nft._id, 'FISH', nft.properties.name)} size='large'><BiTransfer /> Transfer</AwesomeButton>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            <br/>
            {(fishMasterNFTs.length > 0) && <hr
                  style={{
                      color: 'gray',
                      backgroundColor: 'gray',
                      height: 3
                  }}
              />}
            {(risingStarNFTs.length > 0) && <h2 style={{textAlign: 'left',  paddingTop: '2vh', paddingLeft: '4%'}}>Rising Star</h2>}
              <Row xs={1} md={3} className="g-4">
              {Array.from(risingStarNFTs).map((nft, idx) => (
                <Col style={{textAlign: 'left',  paddingTop: '2vh', paddingLeft: '4%', paddingRight: '4%'}}>
                  <Card >
                    <Card.Body>
                      <Card.Title><h3>{nft.properties.type}</h3></Card.Title>
                        {
                            nft.properties && <div style={{marginTop: '5%'}}><h4>Class</h4><h5>{nft.properties.class}</h5></div>
                        }
                        {
                            nft.properties && <div style={{marginTop: '5%'}}><h4>Stats</h4><h5>{nft.properties.stats}</h5></div>
                        }                   
                        <br></br>
                        <AwesomeButton  action={() => initiateTransfer(nft._id, 'STAR', nft.properties.name)} size='large'><BiTransfer /> Transfer</AwesomeButton>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            <br></br>               
            <TransferNftModal selectednft={selectednft} show={transferModalShow} onHide={() => setTransferModalShow(false)} />

            </Container>
          <br />
          </LoadingOverlay>
        </span>
  )
}