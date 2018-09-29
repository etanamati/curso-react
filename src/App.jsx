import React, { Component } from 'react';

import './App.css';
import Header from './components/Header';
import Home from './pages/Home';
import Perfil from './pages/Perfil';
import Configuracoes from './pages/Configuracoes'
import NotFound from './pages/NotFound';
import { Route, Switch, withRouter } from 'react-router-dom';
import AuthService from './services/AuthService';
import UserService from './services/UserService';
import TweetService from './services/TweetService';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: undefined,
      tweets: []
    }
  }

  componentDidMount() {
    AuthService.onAuthChange((authUser) => {
      if (authUser) {
        UserService.getUserData(authUser.uid)
          .then((user) => {
            this.setState({ currentUser: user });
            this.getUserFeed(user);
          })
      }
      else {
        this.setState({ currentUser: undefined });
      }
    })
  }

  onLogin = () => {
    AuthService.loginWithGoogle();
  };

  getUserFeed = (user) => {
    TweetService.getUserFeed(user)
      .then(tweets => {
        this.setState({ tweets });
      })
  }

  onPostTweet = ({ content }) => {
    TweetService.newTweet(content)
      .then(() => setTimeout(() => {
        this.getUserFeed(this.state.currentUser);
      }, 1000));
  }

  onLogout = () => {
    AuthService.logout();
  };

  onSaveConfiguracao = (updatedUser) => {
    return new Promise(resolve => {
      this.setState({
        currentUser: { ...updatedUser }
      }, () => {
        resolve();
      })
    })
  };

  onFollow = (user) => {
    UserService.followUser(user)
      .then(() => console.log('Follow'));
  }

  onSaveConfiguracao = (updatedUser) => {
    return UserService.updateUserData(updatedUser)
      .then(() => this.setState({ currentUser: { ...updatedUser } }))
  }

  render() {
    const { currentUser, tweets } = this.state;
    return (
      <div>
        <Header currentUser={currentUser} onLogin={this.onLogin}
          onLogout={this.onLogout} />
        <Switch>
          <Route path="/" exact
            render={props => <Home {...props} tweets={tweets} currentUser={currentUser}
              onTweet={this.onPostTweet}
            />}
          /><Route path="/perfil/:id" exact
            render={props => <Perfil {...props} currentUser={currentUser}
            onFollow={this.onFollow}
            />}
          />
          <Route path="/configuracao" exact
            render={props => <Configuracoes {...props} currentUser={currentUser}
              onSave={this.onSaveConfiguracao} />}
          />
          <Route component={NotFound} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
