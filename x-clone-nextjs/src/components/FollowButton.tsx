'client'

const FollowButton = ({
    userId,
    isFollowed,
    username,
}: {
    userId: string;
    isFollowed: boolean;
    username: string;
}) => {
    return (
        <button className="py-2 px-4 bg-white text-black font-bold rounded-full">
            {isFollowed ? "Unfollow" : "Follow"}
        </button>
    )
}

export default FollowButton