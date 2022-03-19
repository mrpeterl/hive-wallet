import { React, useMemo, useState, useEffect } from 'react';
import {useParams, useLocation} from 'react-router-dom';
import { Link } from 'react-router-dom';
import RemoveMarkdown from 'remove-markdown';
import { Pagination, Container} from "react-bootstrap";
import { VscCommentDiscussion } from 'react-icons/vsc';
import { BiUpvote } from 'react-icons/bi';
import "react-awesome-button/dist/styles.css";
import './BlogDashboard.css'
import { fetchHiveData } from '../../utils/hiveTx';

export function BlogDashboard({handleLoading}) {
    
    function toggleLoadingSpinner(bool) {
        handleLoading(bool);
    }

    function useQuery() {
        const { search } = useLocation();
    
        return useMemo(() => new URLSearchParams(search), [search]);
    }

    const [blogs, setBlogs]=useState([{'key': 1, 'json_metadata': {}, 'children': 0, 'active_votes':[]}, {'key': 2, 'json_metadata': {}, 'children': 0, 'active_votes':[]},{'key': 3, 'json_metadata': {}, 'children': 0, 'active_votes':[]},{'key': 4, 'json_metadata': {}, 'children': 0, 'active_votes':[]},{'key': 5, 'json_metadata': {}, 'children': 0, 'active_votes':[]},{'key': 6, 'json_metadata': {}, 'children': 0, 'active_votes':[]}]);
    const { searchType } = useParams();
    let query = useQuery();

    function BlogPagination() {
        const changePage = (page) => {
            setActive(page);
            getBlogs(page);
        };
        useEffect(() => {
            console.log(active);
        }, [active])
        let items = [];
        for (let number = 1; number <= 8; number++) {
            items.push(
            <Pagination.Item onClick={() => {changePage(number)}}  key={number} active={number === active}>
                {number}
            </Pagination.Item>
            );
        }

        return (
            <div >
            <Pagination style={{ display: "flex", justifyContent: "center" }} size="lg">{items}</Pagination>
            <br />

            </div>
        );
    }

    const [active, setActive] = useState(2);

    const getBlogs = async (page) => {
        toggleLoadingSpinner(true);
        setActive(page);
        if(searchType == 'trending') {
            const operations = {limit: 8*page};
            const blogs = await fetchHiveData('condenser_api.get_discussions_by_trending', operations);
            setBlogs(blogs.result.slice(page == 1 ? 0 : (page -1)*8), (page * 8) -1);
            toggleLoadingSpinner(false);
        }
        if(searchType == 'hot') {
            const operations = {limit: 8*page};
            const blogs = await fetchHiveData('condenser_api.get_discussions_by_hot', operations);
            setBlogs(blogs.result.slice(page == 1 ? 0 : (page -1)*8), (page * 8) -1);
            toggleLoadingSpinner(false);
        }
        if(searchType == 'search') {
            const operations = {limit: 8*page, tag: query.get('query')};
            const blogs = await fetchHiveData('condenser_api.get_discussions_by_created', operations);
            console.log(blogs)
            setBlogs(blogs.result.slice(page == 1 ? 0 : (page -1)*8), (page * 8) -1);
            toggleLoadingSpinner(false);
        }
    }
    useEffect(() => {
        getBlogs(1);
    }, [])


    return(
        <span style={{backgroundColor: 'hsla(56, 64%, 67%, 0.863)', display: 'block', minHeight: '100vh'}}>
        <br />
        <Container className='selector bg-dark' style={{ height:'95%', width: '100%'}}>
            <br></br>
            <h1 style={{marginLeft: '2%',textAlign: 'left', color: 'white'}}>{searchType != 'search' ? searchType.charAt(0).toUpperCase() + searchType.substring(1) + ' Blogs' : 'Search Results for: ' +  query.get('query')}</h1>
        {
        blogs && blogs.map((blog, index) => {

            const blogThumbail = () => {
                try {
                    if(JSON.parse(blog.json_metadata).hasOwnProperty('image')) {
                        return JSON.parse(blog.json_metadata).image[0];
                    }
                }catch(err){
                    console.log(err);
                }
            }

        return( 
            <div key={blog.permlink} style={{paddingBottom: '0.5%', paddingTop: index == 0 ? '2%' : '0.5%'}}>
            <div className="card mb-3" style={{marginLeft: 'auto', marginRight: 'auto', width: '98%'}}>
                <div className="row no-gutters">
                <div className="col-md-4">
                    <div className="crop">
                     <img src={blogThumbail()} alt="Blog Thumbnail" />
                    </div>
                
                </div>
                <div className="col-md-6">
                    <div className="card-body">
                    <Link to={`/blog/${blog.author}/${blog.permlink}`}><h5 className="card-title" style={{color: 'black'}}>{blog.title ? blog.title : 'Blog Title'}</h5></Link>
                    <p className="card-text">
                        <small className="text-muted">by {blog.author ? blog.author : 'Author'}</small>
                    </p>
                    <p className="card-text">
                        {blog.body ? RemoveMarkdown(blog.body).substring(0, 310) : 'Blog Description'}...
                    </p>
                    </div>
                </div>
                <div className="col-md-2 comments">
                    <p className='blogData'>{blog.children}</p>
                    <VscCommentDiscussion size={'2.5em'}></VscCommentDiscussion>
                    <hr
                        style={{
                            color: 'gray',
                            backgroundColor: 'gray',
                            height: 1
                        }}
                    />
                    <span style={{display: 'inline-block'}}> 
                       
                    <p className='blogData'>{blog.active_votes.length}</p> <BiUpvote size={'2.5em'}></BiUpvote>
                    </span>
                </div>
                </div>
            </div>
            </div>
        )})}
        {BlogPagination()}
        </Container>
        <br></br>
    </span>
    );

}