import UserService from '../../services/UserService';
import * as Types from '../types/UsuarioTypes';

const usuarioLogin = (usuario) => {
  return UserService.getUserData(usuario.uid)
    .then((usuarioAtualizado) => {
      return {
        type: Types.USUARIO_LOGIN,
        payload: usuarioAtualizado
      }
    });
}

const usuarioLogout = () => {
  return {
    type: Types.USUARIO_LOGOUT
  }
}

const updateUsuario = (usuario) => {
  return UserService.updateUserData(usuario)
    .then(() => {
      return {
        type: Types.USUARIO_UPDATE,
        payload: usuario
      }
    });
}

export {
  usuarioLogin,
  usuarioLogout,
  updateUsuario
}