import { Link } from 'react-router'
import './galleryItem.css'
import Image from '../image/image'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiRequest from '../../utils/apiRequest';

const interact = async (id, type) => {
  const res = await apiRequest.post(`/pins/interact/${id}`, { type });

  return res.data;
};

function GalleryItem({item}) {
    const optimizedHeight = (372 * item.height) / item.width

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ id, type }) => interact(id, type),
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["interactionCheckGallery", item._id] });
        },
    });

    const { isPending, error, data } = useQuery({
        queryKey: ["interactionCheckGallery", item._id],
        queryFn: () =>
        apiRequest
            .get(`/pins/interaction-check/${item._id}`)
            .then((res) => res.data),
    });

    if (isPending || error) return;

    return (
        <div className='galleryItem' style={{ gridRowEnd: `span ${Math.ceil(item.height / 100)}` }}>
            {/* <img src={item.media} alt="" /> */}
            <Image path={item.media} alt="" w={372} h={optimizedHeight}/>
            <Link to={`/pin/${item._id}`} className="overlay" />
            <button
                disabled={mutation.isPending}
                onClick={() => mutation.mutate({ id: item._id, type: "save" })}
                className="saveButton"
            >
                {data.isSaved ? "Saved" : "Save"}
            </button>
            <div className="overlayIcons">
                <button>
                    <Image path="/general/share.svg" alt="" />
                </button>
                <button>
                    <Image path="/general/more.svg" alt="" />
                </button>
            </div>
        </div>
    )
}

export default GalleryItem