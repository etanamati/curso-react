import React, { Component } from 'react';
import {Provider} from 'react-redux';
import AuthService from './services/AuthService';
import Configuracoes from './pages/Configuracoes'
import createStore from './createStore';
import Header from './components/Header';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Perfil from './pages/Perfil';
import { Route, Switch, withRouter } from 'react-router-dom';
import {usuarioLogin, usuarioLogout} from './state/actions/UsuarioActions';

import './App.css';

const store = createStore({});

class App extends Component {
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

  render() {
    return (
      <div>
        <Provider store={store}>
          <React.Fragment>
            <Header />
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/perfil/:id" exact component={Perfil}/>
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
