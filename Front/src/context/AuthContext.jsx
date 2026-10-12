import {useCallback,useEffect,useMemo,useState} from 'react';
import {Context} from './auth-context';
import {api} from '../utils/api';
export function AuthProvider({children}) {
  const [usuario,setUsuario]=useState(null);
  const [carregando,setCarregando]=useState(true);
  const recarregar=useCallback(async()=>{
    try{const data=await api('/auth/me');setUsuario(data.usuario);}
    catch{setUsuario(null);}finally{setCarregando(false);}
  },[]);
  useEffect(()=>{
    let active=true;
    api('/auth/me').then(data=>{if(active)setUsuario(data.usuario);}).catch(()=>{if(active)setUsuario(null);}).finally(()=>{if(active)setCarregando(false);});
    return ()=>{active=false;};
  },[]);
  const entrar=useCallback(async(email,senha)=>{
    const data=await api('/auth/login',{method:'POST',body:{email,senha}});
    setUsuario(data.usuario);
    return data.usuario;
  },[]);
  const sair=useCallback(async()=>{
    try{await api('/auth/logout',{method:'POST'});}finally{setUsuario(null);}
  },[]);
  const value=useMemo(()=>({usuario,carregando,entrar,sair,recarregar}),[usuario,carregando,entrar,sair,recarregar]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
