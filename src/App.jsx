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
import createStore from './createStore';
import {Provider} from 'react-redux';
import {usuarioLogin, usuarioLogout} from './state/actions/UsuarioActions';

const store = createStore({});

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
        store.dispatch(usuarioLogin(authUser));
      }
      else {
        store.dispatch(usuarioLogout());
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
        <Provider store={store}>
          <React.Fragment>
            <Header />
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/perfil/:id" exact
                render={props => <Perfil {...props} currentUser={currentUser}
                onFollow={this.onFollow}
                />}
              />
              <Route path="/configuracao" exact component={Configuracoes} />
              <Route component={NotFound} />
            </Switch>
          </React.Fragment>
        </Provider>
      </div>
    );
  }
}

export default withRouter(App);
