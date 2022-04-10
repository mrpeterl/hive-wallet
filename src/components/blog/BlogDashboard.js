import { React, useMemo, useState, useEffect } from 'react';
import {useParams, useLocation} from 'react-router-dom';
import { Pagination, Container} from "react-bootstrap";
import "react-awesome-button/dist/styles.css";
import './BlogDashboard.css'
import BlogCards from './BlogCards';
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
        <Container className='selector bg-dark' style={{ border: '3px solid rgba(255,193,7)', height:'95%', width: '100%'}}>
            <br></br>
            <h1 style={{marginLeft: '2%',textAlign: 'left', color: 'white'}}>{searchType != 'search' ? searchType.charAt(0).toUpperCase() + searchType.substring(1) + ' Blogs' : 'Search Results for: ' +  query.get('query')}</h1>
            <BlogCards blogs={blogs}></BlogCards>
            {
                BlogPagination()
            }
        </Container>
        <br></br>
    </span>
    );

}