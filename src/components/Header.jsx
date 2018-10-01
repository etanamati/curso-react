import {connect} from 'react-redux';
import React from 'react';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import { Navbar, Nav, Button} from 'react-bootstrap';
import { NavLink} from 'react-router-dom';
import {usuarioLogin, usuarioLogout} from '../state/actions/UsuarioActions';

const Header = (props) => {
    const {usuarioLogado, usuarioLogin, usuarioLogout} = props;
    const logado = usuarioLogado !== undefined;
    return (
        <Navbar bg="primary" variant="dark">
           <NavLink to="/" className="navbar-brand">Twitter</NavLink>
            <Nav className="ml-auto">
                {
                    logado ? (
                        <div>
                            <Button variant="light" style={{marginRight: 10}}><NavLink to="/configuracao">Configurações</NavLink></Button>
                            <Button variant="light" style={{marginRight: 10}}><NavLink to={`/perfil/${usuarioLogado.uid}`}>Meu perfil</NavLink></Button>
                            <Button variant="danger" onClick={usuarioLogout}>Sair</Button>
                        </div>
                    ) :
                    (
                        <Button variant="success" onClick={usuarioLogin}>Login</Button>
                    )
                }
            </Nav>
        </Navbar>
    )
};

Header.propTypes = {
    usuarioLogado: PropTypes.object,
    usuarioLogin: PropTypes.func.isRequired,
    usuarioLogout: PropTypes.func.isRequired
}

const mapStateToProps = store => ({
  usuarioLogado: store.usuario.usuarioAtual
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({ usuarioLogin, usuarioLogout }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Header);
