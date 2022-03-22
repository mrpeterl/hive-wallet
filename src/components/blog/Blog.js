import { React, useState, useEffect } from 'react';
import './Blog.css';
import {useParams} from 'react-router-dom';
import { Container } from "react-bootstrap";
import LoadingOverlay from 'react-loading-overlay';
import { marked } from 'marked';
import { Navigation } from '../navigation/Navigation';
import { Comments } from './comments/Comments';
import { processHiveTransaction, fetchHiveData } from '../../utils/hiveTx';
import { RiArrowUpCircleFill, RiArrowUpCircleLine, RiArrowDownCircleLine, RiArrowDownCircleFill} from 'react-icons/ri';

export function Blog() {
    marked.setOptions({
      pedantic: true
    })

    function toggleLoadingSpinner(bool) {
        setLoading(bool);
    }
    const { author, id } = useParams();
    const [blogState, setBlogState]=useState({blog: {'key': 1, 'title': 'Blog Title', 'author': 'author'}, blogDate: new Date(), blogBody: ''});
    const [loading, setLoading] = useState(false);
    const [userVote, setUserVote] = useState('empty');

   async function handleUserVote(vote) {        
      const userData = JSON.parse(localStorage.getItem('userData'));
     
      const operations = [
          [
            'vote',
            {
              voter: userData.username,
              author: blogState.blog.author,
              permlink: blogState.blog.permlink,
              weight: userVote != 'empty' ? 0 : vote == 'upvote' ? 10000 : -10000
            }
          ]
        ]
      const voteTransaction = await processHiveTransaction(operations);
      if(voteTransaction.error == undefined) {
        setUserVote(userVote != 'empty' ? 'empty' : vote);
      }
    }

    function didUserVote(votes) {
      const userData = JSON.parse(localStorage.getItem('userData'));
      votes.forEach(vote => {
        if(vote.voter == userData.username) {
          console.log(vote)
          vote.percent > 0 ? setUserVote('upvote') : 
          vote.percent < 0 ? setUserVote('downvote') : 
          console.log(userVote)
        }
      });
    }

    const getBlog = async (author, permlink) => {

      const operations =  [ author, permlink ];
      const blog = await fetchHiveData('condenser_api.get_content', operations);
      const votes = await fetchHiveData('condenser_api.get_active_votes', operations);
      didUserVote(votes.result);
      setBlogState(state => ({...state, blog: blog.result, blogDate: new Date(Date.parse(blog.result.created)), blogBody: marked.parse(blog.result.body)}));
      toggleLoadingSpinner(false);
    }

    useEffect(() => {
        toggleLoadingSpinner(true);
        getBlog(author, id);
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
              <h1 className='blogTitle'>{blogState.blog.title}</h1>
              <h5 className='blogAuthor'>by {blogState.blog.author}  | {blogState.blogDate.toDateString() + ' ' + blogState.blogDate.getHours() + ':' + (blogState.blogDate.getMinutes() == '0' ? '00' : blogState.blogDate.getMinutes())}</h5>
              <hr
                  style={{
                      color: 'gray',
                      backgroundColor: 'gray',
                      height: 3
                  }}
              />
              <article className='blogPost' dangerouslySetInnerHTML={{__html: blogState.blogBody}}></article>
              <hr
                  style={{
                      color: 'gray',
                      backgroundColor: 'gray',
                      height: 3
                  }}
              />
              <h5 style={{display: 'inline-block', paddingRight: '2%', paddingBottom: '1%'}} className='blogAuthor'>{blogState.blog.net_votes} votes</h5> 
              {
                userVote != 'upvote' && <RiArrowUpCircleLine style={{display: 'inline-block', cursor: 'pointer', marginRight: '2%'}} size={'2.75em'} onClick={() => {handleUserVote('upvote')}}></RiArrowUpCircleLine>
              }
              {
                userVote == 'upvote' && <RiArrowUpCircleFill style={{display: 'inline-block', cursor: 'pointer', marginRight: '2%'}} size={'2.75em'} onClick={() => {handleUserVote('upvote')}}></RiArrowUpCircleFill> 
              }
              {
                userVote != 'downvote' && <RiArrowDownCircleLine style={{display: 'inline-block', cursor: 'pointer', marginRight: '2%'}} size={'2.75em'} onClick={() => {handleUserVote('downvote')}}></RiArrowDownCircleLine>
              }
              {
                userVote == 'downvote' && <RiArrowDownCircleFill style={{display: 'inline-block', cursor: 'pointer', marginRight: '2%'}} size={'2.75em'} onClick={() => {handleUserVote('downvote')}}></RiArrowDownCircleFill> 
              }
            </Container>
          <br />
          <Comments author={author} permlink={id}></Comments>
          </LoadingOverlay>
        </span>
  )
}