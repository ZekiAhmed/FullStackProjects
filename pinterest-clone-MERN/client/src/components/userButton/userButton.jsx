import { useState } from 'react';
import './userButton.css'
import Image from '../image/image';
import apiRequest from '../../utils/apiRequest';
import { Link, useNavigate } from 'react-router';
import useAuthStore from '../../utils/authStore';

function UserButton() {
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();

    const { currentUser, removeCurrentUser, profileImage } = useAuthStore();

    console.log('current user',currentUser);

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
        {profileImage === 1 ? 
        (<Image className='avatarImg' path={currentUser.img || "/general/noAvatar.png"} loadProfile="eager" w={100} h={100} alt="" />) :
        (<img className='avatarImg' src={ currentUser.img} alt="" />)}

        {/* <img className='avatarImg' src={ `${import.meta.env.VITE_URL_IK_ENDPOINT}/${currentUser.img}`} alt="" /> */}
        <div onClick={() => setOpen((prev) => !prev)}>
          <Image path="/general/arrow.svg" alt="" className='arrow' />
        </div>
        {open && <div className="userOptions">
            <Link to={`/${currentUser.username}`} className="userOption">Profile</Link>
            <div className="userOption">Setting</div>
            <div className='userOption' onClick={handleLogout}>Logout</div>
        </div>}
    </div>
  ) : (
    <Link to="/auth" className='loginLink'>Login / Singn Up</Link>
  ) 
}

export default UserButton