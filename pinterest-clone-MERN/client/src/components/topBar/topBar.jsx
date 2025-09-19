import Image from '../image/image'
import UserButton from '../userButton/userButton'
import './topBar.css'

function TopBar() {
  return (
    <div className="topBar">
      {/* SEARCH */}
      <div className='search'>
        <Image path="/general/search.svg" alt="" />
        <input type="text" placeholder='Search' />
      </div>
      {/* USER */}
      <UserButton />
    </div>
  )
}

export default TopBar