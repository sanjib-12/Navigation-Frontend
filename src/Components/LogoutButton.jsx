import { useAuth } from '../Contexts/AuthContext';
import { Button } from 'antd';

const Logout = () =>{

    const { logout } = useAuth();
    
    return(

<Button
        onClick={logout}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          Index: '10px',
        }}
      >
        Logout
      </Button>
    )

}

export default Logout;