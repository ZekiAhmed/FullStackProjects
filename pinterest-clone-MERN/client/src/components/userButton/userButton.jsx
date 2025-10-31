import { useState } from 'react';
import './userButton.css'
import Image from '../image/image';
import apiRequest from '../../utils/apiRequest';
import { Link, useNavigate } from 'react-router';
import useAuthStore from '../../store/authStore';

function UserButton() {
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();

    const { currentUser, removeCurrentUser } = useAuthStore();

    console.log(currentUser);

    const handleLogout = async () => {
      try {
        await apiRequest.post("/users/auth/logout", {});
        removeCurrentUser();
        navigate("/auth");
      } catch (err) {
        console.log(err);
      }
    };

  return currentUser ? (
    <div className='userButton'>
        <Image path="/general/noAvatar.png" alt="" />
        <div onClick={() => setOpen((prev) => !prev)}>
          <Image path="/general/arrow.svg" alt="" className='arrow' />
        </div>
        {open && <div className="userOptions">
            <div className="userOption">Profile</div>
            <div className="userOption">Setting</div>
            <div className='userOption' onClick={handleLogout}>Logout</div>
        </div>}
    </div>
  ) : (
    <Link to="/auth" className='loginLink'>Login / Singn Up</Link>
  ) 
}

export default UserButton