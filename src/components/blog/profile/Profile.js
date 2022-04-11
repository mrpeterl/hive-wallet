import { React, useState, useEffect } from 'react';
import {useParams} from 'react-router-dom';
import './Profile.css';
import '../BlogDashboard.css'
import { Col, Container, Image, Modal, Row } from "react-bootstrap";
import LoadingOverlay from 'react-loading-overlay';
import { Navigation } from '../../navigation/Navigation';
import { fetchHiveData, processHiveTransaction } from '../../../utils/hiveTx';
import BlogCards from '../BlogCards';
import { reduceRight } from '@hiveio/hive-js/lib/broadcast/operations';
import { AwesomeButton } from 'react-awesome-button';

export function Profile() {

    const { username } = useParams();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({name: '', posting_json_metadata: ''});
    const [userFollowCounts, setUserFollowCounts] = useState({});
    const [userImage, setUserImage] = useState('https://www.clipartkey.com/mpngs/m/100-1006688_headshot-silhouette-placeholder-image-person-free.png');
    const [userBlogs, setUserBlogs]= useState([{'key': 1, 'json_metadata': {}, 'children': 0, 'active_votes':[]}, {'key': 2, 'json_metadata': {}, 'children': 0, 'active_votes':[]},{'key': 3, 'json_metadata': {}, 'children': 0, 'active_votes':[]},{'key': 4, 'json_metadata': {}, 'children': 0, 'active_votes':[]},{'key': 5, 'json_metadata': {}, 'children': 0, 'active_votes':[]},{'key': 6, 'json_metadata': {}, 'children': 0, 'active_votes':[]}]);
    const [isActiveUser, setIsActiveUser]= useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [followModalSelection, setFollowModalSelection] = useState('Followers');
    const [users, setUsers] = useState([{follower: '', following: ''}]);


    async function getUser() {
        const operations = [[username]];
        const user = await fetchHiveData('condenser_api.get_accounts', operations);
        const followCounts = await fetchHiveData('condenser_api.get_follow_count', operations[0]);
        console.log(user.result[0]);     
        console.log(followCounts.result);
        setUser(user.result[0]);
        setUserFollowCounts(followCounts.result);
        setUserImage(JSON.parse(user.result[0].posting_json_metadata).profile.profile_image);
        setIsActiveUser(user.result[0].name == JSON.parse(localStorage.getItem('userData')).username);
    }

    async function getUserBlogs() {
        const operations = {sort: 'blog', account: username};
        const userBlogs = await fetchHiveData('bridge.get_account_posts', operations);
        console.log(userBlogs)
        setUserBlogs(userBlogs.result);
        toggleLoadingSpinner(false)
    }

    async function getUsers(type) { 
        setFollowModalSelection(type); 
        const api = type == 'Following' ? 'condenser_api.get_following' : 'condenser_api.get_followers';
        const operations = [username];

        const users = await fetchHiveData(api, operations);
        setUsers(users.result);

        users.result.map((x, index) => {
            if(x.follower == JSON.parse(localStorage.getItem('userData')).username) { console.log('hit');setIsFollowing(true) } 
        })
    }

    async function followUnfollowUser(type) {
        const operations = [
            [
                'custom_json', 
                {
                    required_auths: [],
                    required_posting_auths: [JSON.parse(localStorage.getItem('userData')).username],
                    id: 'follow',
                    json: JSON.stringify(['follow', {
                        follower: JSON.parse(localStorage.getItem('userData')).username,
                        following: username,
                        what: type == 'follow' ? ['blog'] : []
                    }])
                }
            ]
        ]

        console.log(operations);
        const followResponse = await processHiveTransaction(operations);
        console.log(followResponse)
        setIsFollowing(type == 'follow' ? true : false);
    }

    function toggleLoadingSpinner(bool) {
        setLoading(bool);
    }

    function UserProfileModal(props) {
        console.log(props)

        async function UpdateProfileDetails() {
            const displayName = document.getElementById('userDisplayNameInput').value;
            const location = document.getElementById('userLocationInput').value;
            const website = document.getElementById('userWebsiteInput').value;
            const profilePicture = document.getElementById('userProfilePictureInput').value;

            const jsonMetadata = "{\"profile\":{\"location\":\"" + location + "\",\"version\":2,\"profile_image\":\"" + profilePicture + "\",\"name\":\"" + displayName + "\",\"website\":\"" + website + "\"}}";
            const operations = [
                [
                    'account_update2',
                    {
                        account: JSON.parse(localStorage.getItem('userData')).username,
                        extensions: [],
                        json_metadata: "",
                        posting_json_metadata: JSON.stringify({
                            profile: {
                                version: 2,
                                name: displayName,
                                location: location,
                                profile_image: profilePicture,
                                website: website
                            }
                        })
                    }
                ]
            ];

           await processHiveTransaction(operations);
        }

        return (
            <Modal
              {...props}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                  Edit Profile Details
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" >
                                <Form.Label>Display Name</Form.Label>
                                <Form.Control id="userDisplayNameInput" type="text" placeholder="Display Name" defaultValue={userDisplayName} />
                            </Form.Group>
                            
                            <Form.Group className="mb-3" >
                                <Form.Label>Website</Form.Label>
                                <Form.Control id="userWebsiteInput"  type="text" placeholder="Display Name" defaultValue={userWebsite} />
                            </Form.Group>
                            
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Location</Form.Label>
                                <Form.Control id="userLocationInput" type="text" placeholder="Location" defaultValue={userLocation} />
                            </Form.Group>
                        </Col>
                        <Form.Group  className="mb-3">
                            <Form.Label>Profile Picture</Form.Label>
                            <Form.Control id="userProfilePictureInput"  type="text" placeholder="Profile Picture" defaultValue={userImage} />
                        </Form.Group>
                    </Row>
                </Form>
                <br />              
                <AwesomeButton  id="profile-form-btn" className="left mr-auto" size="large" type="primary" action={UpdateProfileDetails}>Save</AwesomeButton>
              </Modal.Body>
              
              </Modal>
          );
    }

    function FollowerModal(props) {
        console.log(props)

        return (
            <Modal
              {...props}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                  {props.type}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {   
                    users && users.map((user, index) => {
                        return(<h4>{props.type == 'Following' ? user.following : user.follower}</h4>);
                    })
                }
              </Modal.Body>

              </Modal>
          );
    }

    useEffect(() => {
        toggleLoadingSpinner(true);
        getUser();
        getUserBlogs(user);
        getUsers('Followers');
    }, [])

    return(
        <span style={{backgroundColor: 'hsla(56, 64%, 67%, 0.863)', display: 'block', minHeight: '100vh'}}>
        <LoadingOverlay
          active={loading}
          spinner
          text='Loading your content...'
          > 
          <Navigation />
          <br />
          <Container className='selector profileHeader' style={{height:'95%', width: '100%'}}>     
            <Row>          
                <Col>
                    <h1 style={{textAlign:'center', marginTop: '20%'}}></h1>
                </Col>
                <Col>          
                    <div style={{textAlign: 'center'}}>
                        <div style={{display: 'inline-block'}}>
                            <h1 className='userTitle' >{user.name}</h1>        
                            <Image src={userImage} roundedCircle='true' style={{ border: '5px solid black', marginTop:'2%', marginLeft: '5%', display:'inline', height:'10em', width: '10em'}}></Image>
                                
                            <div  style={{clear: 'both', width: '110%'}}>
                                <h3 style={{float: 'left', cursor: 'pointer'}} onClick={() => {getUsers('Followers'); setModalShow(true)}} className='followCounter'><u>{userFollowCounts.follower_count} Followers</u> </h3>
                                <h3 style={{marginLeft: '4.5%', marginRight: '3%', float: 'left'}} className='followCounter'>  |  </h3>
                                <h3 style={{float: 'right', cursor: 'pointer'}} onClick={() => {getUsers('Following'); setModalShow(true)}} className='followCounter'> <u>{userFollowCounts.following_count} Following</u></h3>
                            </div>
                            </div>
                    </div>
                    <br />
                </Col>
                <Col style={{textAlign:'center', marginTop: '8%', display: 'block'}}>
                    { 
                      !isFollowing && !isActiveUser && <AwesomeButton style={{marginBottom: '5%', marginRight: '10%'}} onPress={() => {followUnfollowUser('follow')}} disabled={isFollowing} size='large' type='primary'>Follow</AwesomeButton>
                    }
                    { 
                      isFollowing && !isActiveUser && <AwesomeButton style={{marginBottom: '5%', marginRight: '10%'}} onPress={() => {followUnfollowUser('unfollow');}} disabled={!isFollowing} size='large' type='secondary'>Unfollow</AwesomeButton> 
                    }
                </Col>
           </Row>

          </Container>
          <br></br>
          <Container className='selector bg-dark' style={{ border: '3px solid rgba(255,193,7)', height:'95%', width: '100%'}}> 
            <br></br>
            <h1 style={{marginLeft: '2%',textAlign: 'left', color: 'white'}}>{isActiveUser ? 'My ' : '' } Most Recent Blogs</h1>
            <BlogCards blogs={userBlogs}></BlogCards>
          </Container>
          <FollowerModal type={followModalSelection} show={modalShow} onHide={() => {setModalShow(false); setUsers([{}])}} />

          <br></br>
          </LoadingOverlay>
        </span>
    );
}