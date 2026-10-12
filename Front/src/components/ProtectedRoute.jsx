import {Navigate,useLocation} from 'react-router-dom';
import {useAuth} from '../context/useAuth';
export default function ProtectedRoute({tipo,children}) {
  const {usuario,carregando}=useAuth();
  const loc=useLocation();
  if(carregando)return <main className="container" style={{padding:'3rem'}}><p>Validando sua sessão...</p></main>;
  if(!usuario)return <Navigate to="/login" state={{from:loc.pathname}} replace/>;
  if(usuario.tipo_usuario!==tipo)return <Navigate to={usuario.tipo_usuario==='CLIENTE'?'/cliente':'/transportadora'} replace/>;
  return children;
}
