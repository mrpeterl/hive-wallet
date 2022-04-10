
import { VscCommentDiscussion } from 'react-icons/vsc';
import { BiUpvote } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import RemoveMarkdown from 'remove-markdown';
import "react-awesome-button/dist/styles.css";

export default function BlogCards(blogs) {
    return (
        
        blogs.blogs && blogs.blogs.map((blog, index) => {

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
                                <small className="text-muted">by {blog.author ? <p className='text-muted' onClick={() => window.location.href=`/profile/${blog.author}`}>{blog.author}</p> : 'Author'}</small>
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
                                <p className='blogData'>{blog.active_votes.length}</p> 
                                <BiUpvote size={'2.5em'}></BiUpvote>
                            </span>
                        </div>
                        </div>
                    </div>
                </div>
            )
        })
    ) 
}