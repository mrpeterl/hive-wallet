import { React, useState } from 'react';
import './Blog.css';
import { Navigation } from '../navigation/Navigation';
import { AwesomeButtonProgress } from "react-awesome-button";
import MDEditor from '@uiw/react-md-editor';
import { Form, Container } from "react-bootstrap";
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'
import { processHiveTransaction } from '../../utils/hiveTx';


export function CreateBlog() {

    const [tags, setTags] = useState([ ]);
    const [value, setValue] = useState("**Hello world!!!**");
    const [blogTitleError, setBlogTitleError] = useState(false);
    const [disableButton, setDisableButton] = useState(false);

    async function postBlog(next) {

        const userData = JSON.parse(localStorage.getItem('userData'));
        const permlink = userData.username + '-' + Date.now().toString() + '-' + 'blog';
        console.log(document.getElementById("blogTitle"))


        const blogTitle = document.getElementById('blogTitle').value;
        if(blogTitle == '') {
          setBlogTitleError(true);
          setTimeout(() => {next(false, 'Error'); }, 300);
          setTimeout(() => {setDisableButton(true); }, 1900);
          return;
        }
        const jsonMetadata = {
            tags: tags
        }

        const operations = [
            [
              'comment',
              {
                parent_permlink: userData.username,
                parent_author: '',
                author: userData.username,
                permlink: permlink,
                body: value,
                title: blogTitle,
                json_metadata: JSON.stringify(jsonMetadata)
              }
            ]
          ]
          await processHiveTransaction(operations);

          next();
    }
    return ( 
        <span style={{minHeight: '100vh', backgroundColor: 'hsla(56, 64%, 67%, 0.863)', display: 'block'}}>
            <Navigation />
            <br />
            <Container className='selector bg-light' style={{ paddingLeft: '2%', paddingRight: '2%', height:'95%', width: '100%'}}>
                <h1 className='blogTitle'>{}</h1>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label><h2>Blog Title</h2></Form.Label>
                        <Form.Control  id="blogTitle" onChange={() => {setBlogTitleError(false); setDisableButton(false)}}  isInvalid={blogTitleError} type="text" placeholder="Enter Blog Title" />
                        <Form.Control.Feedback type="invalid" >The field Blog Title is required and must have a value.</Form.Control.Feedback>
                    </Form.Group>
                <hr
                    style={{
                        color: 'gray',
                        backgroundColor: 'gray',
                        height: 3
                    }}
                />
                <MDEditor
                    id="markdownEditor"
                    value={value}
                    onChange={setValue}
                    height={800}
                />
                <br></br>
                <Form.Label><h3>Tags</h3></Form.Label>
                <TagsInput value={tags} onChange={setTags}/>          

                </Form>
                <AwesomeButtonProgress releaseDelay={1500} disabled={disableButton} onPress={(element, next) => { postBlog(next);}} style={{marginTop: '2%', marginBottom: '2%'}} type="primary">Submit Blog</AwesomeButtonProgress>
                <br></br>
            </Container>
          <br />
        </span>
  )
}