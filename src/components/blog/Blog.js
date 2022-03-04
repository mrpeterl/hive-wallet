import { React, useState, useEffect } from 'react';
import './Blog.css';
import {useParams} from 'react-router-dom';
import hive from '@hiveio/hive-js';
import { Container } from "react-bootstrap";
import LoadingOverlay from 'react-loading-overlay';
import { marked } from 'marked';
import { Navigation } from '../navigation/Navigation';

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

    const getBlog = async (author, permlink) => {
        await hive.api.getContent(author, permlink, function(err, result)  {
            console.log(err, result);
            setBlogState(state => ({...state, blog: result, blogDate: new Date(Date.parse(result.created)), blogBody: marked.parse(result.body)}));
            toggleLoadingSpinner(false);
        });
    }
    useEffect(() => {
        toggleLoadingSpinner(true);
        getBlog(author, id);
    }, [])
      
    return ( 
      <div className="App">
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
            </Container>
          </LoadingOverlay>
          <br />
        </span>
      </div>
  )
}