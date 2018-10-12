import { connect } from 'react-redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Form, FormControl, InputGroup, Row, Alert } from 'react-bootstrap';
import ListaTweet from '../components/ListaTweet';
import UserList from '../components/UserList';
import UserService from '../services/UserService';
import TweetService from '../services/TweetService';

class Home extends Component {

  static propTypes = {
    usuarioLogado: PropTypes.object
  }

  componentDidMount() {
    UserService.getAllUsers()
      .then(users => this.setState({ users, userFiltered: users }))

    if (this.props.usuarioLogado !== undefined) {
      this.getUserFeed(this.props.usuarioLogado);
    }
  }

  componentDidUpdate(oldProps) {
    if (this.props.usuarioLogado !== oldProps.usuarioLogado) {
      this.getUserFeed(this.props.usuarioLogado);
    }
  }

  getUserFeed = (user) => {
    TweetService.getUserFeed(user)
      .then(tweets => {
        this.setState({ tweets });
      })
  }

  state = {
    currentPost: '',
    alertVisible: false,
    users: [],
    userFiltered: [],
    filtro: '',
    tweets: []
  };

  onChange = (event) => {
    this.setState({ currentPost: event.target.value })
  };

  onPost = () => {

    const { usuarioLogado } = this.props;

    if (!usuarioLogado) {
      this.setState({ alertVisible: true })
      return;
    }

    const content = this.state.currentPost;

    this.setState({ currentPost: '', alertVisible: false }, () => {
      TweetService.newTweet(content)
        .then(() => setTimeout(() => this.getUserFeed(usuarioLogado), 1000));
    })
  };

  onChangeFiltro = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });

    this.filter(value);
  }

  filter = (value) => {
    const newUsers = this.state.users.filter(user =>
      user.userName.toLowerCase().includes(value.toLowerCase()));
    this.setState({
      userFiltered: newUsers
    });
  }

  render() {

    const { currentPost, alertVisible, userFiltered, filtro, tweets } = this.state;

    return (
      <Container style={{ marginTop: 30 }}>
        <input className="form-control" type="text" name="filtro" onChange={this.onChangeFiltro} value={filtro} />
        <UserList users={userFiltered} />
        <Alert variant="danger" defaultShow={alertVisible}>
          Você deve estar logado para postar alguma coisa.
                </Alert>
        <Form>
          <Row>
            <span className="ml-auto">{currentPost.length} / 140</span>
            <InputGroup>
              <FormControl as="textarea" aria-label="With textarea" maxLength={140}
                value={currentPost} onChange={this.onChange} />
            </InputGroup>
          </Row>
          <Row style={{ justifyContent: 'flex-end', marginTop: 10 }}>
            <Button variant="primary" onClick={this.onPost}>Postar</Button>
          </Row>

          <Row>
            <ListaTweet tweets={tweets} />
          </Row>
        </Form>
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    usuarioLogado: state.usuario.usuarioAtual
  }
}

export default connect(mapStateToProps)(Home);
