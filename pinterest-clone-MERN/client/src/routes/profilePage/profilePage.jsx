import { useEffect, useState } from 'react';
import IKmage from '../../components/image/image'
import './profilePage.css'
import Gallery from '../../components/gallery/gallery';
import Boards from '../../components/boards/boards';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiRequest from '../../utils/apiRequest';
import { useParams } from 'react-router';
import FollowButton from './FollowButton';

function ProfilePage() {
    const [type, setType] = useState("saved");
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [previewImg, setPreviewImg] = useState({
        url: "",
        width: 0,
        height: 0,
    });

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
        mutationFn: (formData) => apiRequest.post(`/users/${username}`, formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile", username] });
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
                    <IKmage 
                    className={`profileImg ${uploading ? "opacity-50" : ""}`}
                    w={100}
                    h={100} 
                    // When previewImg.url (an object URL) exists, pass it as `src` so
                    // the ImageKit component renders the local blob directly.
                    // Otherwise pass the server `path` (data.img) or fallback avatar.
                    {...(previewImg.url
                        ? { src: previewImg.url }
                        : { path: data.img || "/general/noAvatar.png" })}
                    alt=""/>
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