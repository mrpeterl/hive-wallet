import  { React, useState, useEffect } from 'react';
import '../Blog.css';
import { AwesomeButtonProgress } from "react-awesome-button";
import { marked } from 'marked';
import MDEditor from '@uiw/react-md-editor';
import { Container } from "react-bootstrap";
import LoadingOverlay from 'react-loading-overlay';
import "react-mde/lib/styles/css/react-mde-all.css";
import { FaTrashAlt } from 'react-icons/fa';
import { fetchHiveData, processHiveTransaction } from '../../../utils/hiveTx';

export function Comments(props) {

    const [value, setValue] = useState("**Hello world!!!**");

    const [comments, setComments]=useState([{author: '', permlink: '', body: '' }])
    const [loading, setLoading] = useState(false);
    function toggleLoadingSpinner(bool) {
        setLoading(bool);
    }

    function isEven(n) {
        return n % 2 == 0;
    }
    
    async function postComment(next) {
        
        toggleLoadingSpinner(true);
        const userData = JSON.parse(localStorage.getItem('userData'));
        const operations = [
            [
              'comment',
              {
                author: userData.username,
                parent_author: props.author,
                parent_permlink: props.permlink,
                permlink: userData.username + '-' + Date.now(),
                body: value,
                title: '',
                json_metadata: ''
              }
            ]
          ]
        await processHiveTransaction(operations);

        toggleLoadingSpinner(false);
        next();
    }

    async function deleteComment(permlink, next) {
        toggleLoadingSpinner(true);
        const userData = JSON.parse(localStorage.getItem('userData'));
        const operations = [
            [
              'delete_comment',
              {
                author: userData.username,
                permlink: permlink
              }
            ]
          ]

        await processHiveTransaction(operations);

        next();
        setTimeout(() => {getComments(props.author, props.permlink)}, 10000);
    }

    async function getComments(author, id) {
        toggleLoadingSpinner(true);
        
        const operations =  [ author, id ]
        const comments = await fetchHiveData('condenser_api.get_content_replies', operations);

        setComments(state => ({...state, comments: comments.result}));
        toggleLoadingSpinner(false);
    }

    useEffect(() => {
        getComments(props.author, props.permlink);
    }, [])

    return (
        <div>
            <Container className='selector bg-light' style={{ height:'95%', width: '100%'}}>
                
                <LoadingOverlay
                active={loading}
                spinner
                text='Loading your content...'
                > 
                    <h1 className='blogTitle'>Comments</h1>
                    <hr
                        style={{
                            color: 'gray',
                            backgroundColor: 'gray',
                            height: 3
                        }}
                    />
                    
                    <div className="container">
                    <MDEditor
                        id="markdownEditor"
                        value={value}
                        onChange={setValue}
                    />
                    <AwesomeButtonProgress releaseDelay="1000" onPress={(element, next) => { postComment(next);}} style={{marginTop: '2%'}} type="primary">Submit Comment</AwesomeButtonProgress>
                    <hr
                        style={{
                            color: 'gray',
                            backgroundColor: 'gray',
                            height: 3
                        }}
                    />
                    </div>
                    {
                        comments.comments && comments.comments.map((blog, index) => { 
                        return( 
                            <div className='selector' style={isEven(index) ? {backgroundColor: 'lightgray', marginBottom: '2%'} :{ backgroundColor: 'darkgray', marginBottom: '2%'}}>
                                <br></br>
                                <article className='blogPost' dangerouslySetInnerHTML={{__html: marked.parse(blog.body)}}></article>
                                <p style={{display: 'inline-block'}} className='blogPost'>by <b >{blog.author}</b></p> 
                                
                                <AwesomeButtonProgress
                                        visible={blog.author == JSON.parse(localStorage.getItem("userData")).username}
                                        loadingLabel=""
                                        releaseDelay="1000"
                                        resultLabel="✓"
                                        onPress={(element, next) => {
                                        // do a sync/async task then call `next()`
                                        
                                            deleteComment(blog.permlink, next);
                                        }}
                                        size="icon"
                                    >
                                        <FaTrashAlt  size='1.1em'></FaTrashAlt>
                                    </AwesomeButtonProgress>
                            </div>
                        );
                    })
                }
                </LoadingOverlay> 
                <br />
                
            </Container>
            <br />
        </div>
    )
}