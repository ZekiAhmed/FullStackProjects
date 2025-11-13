import { useMutation, useQueryClient } from '@tanstack/react-query';
import Image from '../image/image'
import { format } from 'timeago.js'
import apiRequest from '../../utils/apiRequest'
import useAuthStore from '../../utils/authStore';

const deleteComment = async (id) => {
  const res = await apiRequest.delete(`/comments/${id}`);
  console.log('comment deleted',res.data)
  return res.data;
};

const Comment = ({comment,postId}) => {
  const { currentUser } = useAuthStore();

  let commentOwner = false;
  if(currentUser && comment.user._id === currentUser._id){
    commentOwner = true;
  }

  const queryClient = useQueryClient();

  const mutation = useMutation({
      mutationFn: ({ id}) => deleteComment(id),
      onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      },
  });

  

  return (
    <div className="comment">
        <Image path={comment.user.img || "/general/noAvatar.png"} alt="" />
        <div className="commentContent">
            <span className="commentUsername">{comment.user.displayName}</span>
            <p className='commentText'>{comment.description}</p>
            <span className='commentTime'>{format(comment.createdAt)}</span>
        </div>
        {commentOwner && (<div 
          disabled={mutation.isPending}
          onClick={() => mutation.mutate({ id: comment._id})}
          className='commentDelete'
        >
          Delete
        </div>)}
    </div>
  )
}

export default Comment