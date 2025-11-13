import { useEffect, useState } from 'react';
import IKmage from '../../components/image/image'
import './profilePage.css'
import Gallery from '../../components/gallery/gallery';
import Boards from '../../components/boards/boards';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiRequest from '../../utils/apiRequest';
import { useParams } from 'react-router';
import FollowButton from './FollowButton';
import useAuthStore from '../../utils/authStore';


// const addProfileImage = async (formData) => {
//   const res = await apiRequest.post(`/users/${username}`, formData);
//   return res.data;
// };

function ProfilePage() {
    const [type, setType] = useState("saved");
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [previewImg, setPreviewImg] = useState({
        url: "",
        width: 0,
        height: 0,
    });
    const { updateCurrentUser } = useAuthStore();

    const queryClient = useQueryClient();

    const {username} = useParams()

    useEffect(() => {
                // When a file is selected create an object URL to show an immediate preview
                // and measure its dimensions. Revoke the URL on cleanup to avoid leaks.
                if (file) {
                    const objectUrl = URL.createObjectURL(file);
                    const img = new Image();
                    img.src = objectUrl;
                    img.onload = () => {
                        setPreviewImg({
                            url: objectUrl,
                            width: img.width,
                            height: img.height,
                        });
                    };

                    return () => {
                        // revoke the object URL when file changes or component unmounts
                        URL.revokeObjectURL(objectUrl);
                    };
                } else {
                    // clear preview when no file selected
                    setPreviewImg({ url: "", width: 0, height: 0 });
                }

    }, [file]);

    // Mutation to upload profile image. Use FormData and post to server endpoint `/users/:username`.
    const mutation = useMutation({
        mutationFn: (formData) => apiRequest.post(`/users/${username}`, formData).then(res => res.data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            console.log('Updating current user with data:', data);
            updateCurrentUser(data);
        },
        onError: (err) => {
            console.error('Profile image upload failed', err);
        },
        onSettled: () => {
            // Ensure uploading state is cleared after mutation finishes
            setUploading(false);
        }
    });

    const { isPending, error, data } = useQuery({
        queryKey: ["profile", username],
        queryFn: () => apiRequest.get(`/users/${username}`).then((res) => res.data),
    });

    // if (data ) {
    //     // If viewing own profile, update currentUser in auth store with latest data
    //     updateCurrentUser(data);
    // }

    if (isPending) return "Loading...";

    if (error) return "An error has occurred: " + error.message;

    if (!data) return "User not found!";

    console.log(data)

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setUploading(true);

        // Prepare form data with the selected file (key expected by server: 'media')
        const formData = new FormData();
        formData.append("media", selectedFile);

        try {
            // Use mutateAsync so we can await the response and log it if needed
            const res = await mutation.mutateAsync(formData);
            console.log("File uploaded:", res?.data);

        } catch (err) {
            console.error("Upload failed:", err);
            // onSettled will clear uploading flag
        }
    };
  

    return (
        <div className="profilePage">
            <>
                <div className="profileImgLabel">
                    {previewImg.url ? (
                        <div className="profileImgPreview">
                            <img 
                                src={ previewImg.url }
                                alt="Preview"
                            />
                        </div>
                    ) : (
                        <div className="profileImg">
                             <IKmage 
                                w={100}
                                h={100} 
                                className="profileImg"
                                path={ data.img || "/general/noAvatar.png" }
                                alt=""/>
                        </div>
                    )}
                    <label htmlFor="file" >
                        <div className="editIconProfile">
                            <IKmage path="/general/edit.svg" alt="" />
                        </div>
                    </label>
                </div>
                <input
                type="file"
                id="file"
                hidden
                onChange={handleFileChange}
              />
            </>
            
             <h1 className="profileName">{data.displayName}</h1>
            <span className="profileUsername">@{data.username}</span>
            <div className="followCounts">
                {data.followerCount} followers · {data.followingCount} followings
            </div>
            <div className="profileInteractions">
                <IKmage path="/general/share.svg" alt="" />
                <div className="profileButtons">
                    <button>Message</button>
                    <FollowButton isFollowing={data.isFollowing} username={data.username}/>
                </div>
                <IKmage path="/general/more.svg" alt="" />
            </div>
            <div className="profileOptions">
                <span
                onClick={() => setType("created")}
                className={type === "created" ? "active" : ""}
                >
                Created
                </span>
                <span
                onClick={() => setType("saved")}
                className={type === "saved" ? "active" : ""}
                >
                Boards
                </span>
            </div>
            {type === "created" ? (
                <Gallery userId={data._id}/>
            ) : (
                <Boards userId={data._id}/>
            )}
        </div>
    )
}

export default ProfilePage