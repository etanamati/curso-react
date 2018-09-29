import React, { Component } from 'react';
import { Button, Container, Row } from 'react-bootstrap';
import ListaTweet from '../components/ListaTweet';
import Loading from '../components/Loading';
import UserService from '../services/UserService';
import TweetService from '../services/TweetService';

class Perfil extends Component {
  componentDidMount() {
    const { id } = this.props.match.params;

    this.setState({ loading: true }, () => {
      UserService.getUserData(id)
        .then(user => {
          this.setState({ user });
          return user})
        .then(user => TweetService.getUserTweets(user))
        .then(tweets => this.setState({tweets, loading: false}));
    });
  }
  state = {
    tweets: [],
    user: {}
  };

  onFollow = (user) => {
    UserService.followUser(user)
      .then(() => console.log('Follow'));
  }

  render() {
    const { user, tweets, loading } = this.state;
    const {currentUser, onFollow}= this.props;
    if (loading){
      return (
        <div className="lds-container">
          <Loading />
        </div>
      )
    }
    const shouldShowFollowButton = currentUser !== undefined && currentUser.uid !== user.uid;

    return (
      <Container>
        <Row className="profile-section">
          <img src={user.photoURL} alt="foto do perfil do usuário"
            className="profile-photo" />
          <div className="profile-data">
            <span>{user.displayName}</span>
            <span>{`@${user.userName}`}</span>
          </div>
          {(shouldShowFollowButton) &&
            <div className="ml-auto">
              <Button onClick={() => onFollow(user)}>Seguir</Button>
            </div>
          }
        </Row>
        <Row>
          <ListaTweet tweets={tweets} />
        </Row>
      </Container>
    );
  }
}

export default Perfil;