import { React, useEffect, useState } from 'react';
import LoadingOverlay from 'react-loading-overlay';
import { Container, Row, Col, Card } from "react-bootstrap";
import { Navigation } from '../navigation/Navigation';
import { fetchHiveEngineData }from '../../utils/hiveEngine';

export default function NftGallery() {

    const [loading, setLoading] = useState(false);
    const [dCropsNFTs, setDCropsNFTs] = useState([{_id: '1', properties: { name: 'Watermelon', nft: '', primary: '', secondary: ''}, account: 'hive'}])
    const [fishMasterNFTs, setFishMasterNFTs] = useState([{_id: '1', properties: { name: 'Watermelon', nft: '', primary: '', secondary: ''}, account: 'hive'}])
    const [risingStarNFTs, setRisingStarNFTs] = useState([{_id: '1', properties: { name: 'Watermelon', nft: '', primary: '', secondary: ''}, account: 'hive'}])

    async function getNFTs() {

        const dCropsNfts = await fetchHiveEngineData('nft', 'DCROPSinstances', {account: JSON.parse(localStorage.getItem('userData')).username});
        await setDCropsNFTs(dCropsNfts);
        
        const fishMasterNfts = await fetchHiveEngineData('nft', 'FISHinstances', {account: JSON.parse(localStorage.getItem('userData')).username});
        await setFishMasterNFTs(fishMasterNfts);

        const risingStarNfts = await fetchHiveEngineData('nft', 'STARinstances', {account: JSON.parse(localStorage.getItem('userData')).username});
        await setRisingStarNFTs(risingStarNfts);

        setLoading(false);    
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
              <h2 style={{textAlign: 'left',  paddingTop: '2vh', paddingLeft: '4%'}}>DCrops</h2>
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
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            <br/>
              <hr
                  style={{
                      color: 'gray',
                      backgroundColor: 'gray',
                      height: 3
                  }}
              />
            <h2 style={{textAlign: 'left',  paddingTop: '2vh', paddingLeft: '4%'}}>Game of Life</h2>
              <Row xs={1} md={3} className="g-4">
              {Array.from(fishMasterNFTs).map((nft, idx) => (
                <Col style={{textAlign: 'left',  paddingTop: '2vh', paddingLeft: '4%', paddingRight: '4%'}}>
                  <Card >
                    <Card.Body>
                      <Card.Title><h3>{nft.properties.card}</h3></Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            <br/>
              <hr
                  style={{
                      color: 'gray',
                      backgroundColor: 'gray',
                      height: 3
                  }}
              />
            <h2 style={{textAlign: 'left',  paddingTop: '2vh', paddingLeft: '4%'}}>Rising Star</h2>
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
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            <br></br>
            </Container>
          <br />
          </LoadingOverlay>
        </span>
  )
}