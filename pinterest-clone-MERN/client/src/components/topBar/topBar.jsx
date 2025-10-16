import { useNavigate } from 'react-router'
import Image from '../image/image'
import UserButton from '../userButton/userButton'
import './topBar.css'

function TopBar() {

  const navigate = useNavigate()
  const handleSubmit = (e) => {
    e.preventDefault()
    const query = e.target[0].value
    navigate(`/search?search=${query}`)
  }

  return (
    <div className="topBar">
      {/* SEARCH */}
      <form onSubmit={handleSubmit} className='search'>
        <Image path="/general/search.svg" alt="" />
        <input type="text" placeholder='Search' />
      </form>
      {/* USER */}
      <UserButton />
    </div>
  )
}

export default TopBar