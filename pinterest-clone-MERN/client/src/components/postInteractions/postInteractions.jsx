import Image from '../image/image'
import './postInteractions.css'

function PostInteractions() {
    return (
        <div className="postInteractions">
            <div className="interactionIcons">
                <Image path="/general/share.svg" alt="" />
                <Image path="/general/more.svg" alt="" />
            </div>
            <button>Save</button>
        </div>
    )
}

export default PostInteractions