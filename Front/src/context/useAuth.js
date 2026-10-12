import {useContext} from 'react';
import {Context} from './auth-context';
export function useAuth(){const ctx=useContext(Context);if(!ctx)throw new Error('AuthProvider ausente');return ctx;}
