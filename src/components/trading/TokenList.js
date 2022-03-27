import { React, useEffect, useState } from 'react';
import { Container } from "react-bootstrap";
import LoadingOverlay from 'react-loading-overlay';
import { marked } from 'marked';
import { Navigation } from '../navigation/Navigation';
import { fetchTokenList } from '../../utils/hiveEngine';
import tokenIconDefault from './tokenIconDefault.png';

export function TokenList() {
    const [tokens, setTokens] = useState([{_id: '1', issuer: 'hive', symbol: 'HIVE', metadata: '{"url":"https://hive-engine.com","icon":"https://s3.amazonaws.com/steem-engine/images/icon_steem-engine_gradient.svg","desc":"BEE is the native token for the Hive Engine platform"}'}]);
    const [loading, setLoading] = useState(false);

    async function getTokens() {
        const tokensResponse = await fetchTokenList();
        console.log(tokensResponse);
        setTokens(tokensResponse);
        setLoading(false)
    }

    
    useEffect(() => {
        setLoading(true)
        getTokens();
    }, [])

    return(
        <div className="App">
            <span style={{backgroundColor: 'hsla(56, 64%, 67%, 0.863)', display: 'block', minHeight: '100vh'}}>
            <LoadingOverlay
                active={loading}
                spinner
                text='Loading your content...'
            > 
            <Navigation />
            <br></br>
            <Container className='selector bg-dark' style={{ border: '3px solid rgba(255,193,7)', height:'95%', width: '100%'}}>
                <br></br>
                <h1 style={{marginLeft: '2%',textAlign: 'left', color: 'white'}}>All Tokens</h1>
                <br></br>
                {
                    tokens && tokens.map((token, index) => {
                        return (
                        <div style={{display: 'block', textAlign: 'left', marginRight: '3%', marginLeft: '3%', marginBottom: '2.5%'}}> 
                            <div style={{display: 'inline', minWidth: '50px', width: '50px'}}>
                                <img onError={({currentTarget}) => { currentTarget.src = tokenIconDefault}} style={{width: '50px', height: '50px', display: 'inline-block'}} referrerPolicy='no-referrer' src={JSON.parse(token.metadata).icon ? JSON.parse(token.metadata).icon : tokenIconDefault}></img>
                                
                            </div>
                                <p style={{display: 'inline-block', color: 'white', marginLeft: '3%'}}>{token.symbol}</p>
                                <hr
                                    style={{
                                        color: 'gray',
                                        backgroundColor: 'gray',
                                        height: 1
                                    }}
                                />
                        </div>

                        )
                    })
                }
                <br></br>
            </Container>
            <br></br>
            </LoadingOverlay>
            </span>
        </div>
    );
}