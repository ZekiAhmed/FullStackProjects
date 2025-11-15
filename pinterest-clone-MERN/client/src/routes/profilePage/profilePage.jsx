import { useEffect, useState } from 'react';
import Image from '../../components/image/image'
import './profilePage.css'
import Gallery from '../../components/gallery/gallery';
import Boards from '../../components/boards/boards';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiRequest from '../../utils/apiRequest';
import { useNavigate, useParams } from 'react-router';
import FollowButton from './FollowButton';
import useAuthStore from '../../utils/authStore';




function ProfilePage() {
    const [type, setType] = useState("saved");

    const [file, setFile] = useState(null);
    // const [uploading, setUploading] = useState(false);
    // const [previewImg, setPreviewImg] = useState({
    //     url: "",
    //     width: 0,
    //     height: 0,
    // });
    const navigate = useNavigate();

    const { updateCurrentUser, currentUser, updateProfileImage, setProfileImage  } = useAuthStore();

    const queryClient = useQueryClient();

    const {username} = useParams()

    const addProfileImage = async (formData) => {
        const res = await apiRequest.post(`/users/${username}`, formData);
        return res.data;
    };

    const getProfileImage = async () => {
    const res = await apiRequest.get(`/users/${username}`);
    return res.data;
    };

    useEffect(() => {
        if (!currentUser) {
        navigate("/auth");
        }
    }, [navigate, currentUser]);

    // useEffect(() => {
    //             // When a file is selected create an object URL to show an immediate preview
    //             // and measure its dimensions. Revoke the URL on cleanup to avoid leaks.
    //             if (file) {
    //                 const objectUrl = URL.createObjectURL(file);
    //                 const img = new Image();
    //                 img.src = objectUrl;
    //                 img.onload = () => {
    //                     setPreviewImg({
    //                         url: objectUrl,
    //                         width: img.width,
    //                         height: img.height,
    //                     });
    //                 };

    //                 return () => {
    //                     // revoke the object URL when file changes or component unmounts
    //                     URL.revokeObjectURL(objectUrl);
    //                 };
    //             } else {
    //                 // clear preview when no file selected
    //                 setPreviewImg({ url: "", width: 0, height: 0 });
    //             }

    // }, [file]);

    // Mutation to upload profile image. Use FormData and post to server endpoint `/users/:username`.
    const mutation = useMutation({
        mutationFn: addProfileImage,
        // onSuccess: (data) => {
            // console.log('Updating current user with data:', data);
            // queryClient.invalidateQueries({ queryKey: ["profile", username] });
            // // queryClient.refetchQueries({ queryKey: ["profile", username] }); 
            // updateCurrentUser(data);

            // Update the query cache directly
            // console.log('catch1',queryClient.getQueryData(["profile", username]));
            // console.log('data',data);

            // queryClient.setQueryData(["profile", username], data);

            // console.log('catch2',queryClient.getQueryData(["profile", username]));

            // queryClient.invalidateQueries({ queryKey: ["profile", username] });



            // queryClient.setQueryData(["profile", username], (oldData) => ({
            //     ...oldData,
            //     ...data,
            // }));

            // Optional: update global current user state
            // updateCurrentUser(data);
        // },
        onMutate:  () => {
            // Cancel any outgoing refetches
            // (so they don't overwrite our optimistic update)
            
            queryClient.cancelQueries({ queryKey: ['profile', username] })
            
            // Snapshot the previous value
            const previousTodos1 = queryClient.getQueryData(['profile', username])
            console.log("previousTodos1",previousTodos1)
            const previousTodos = {...previousTodos1, img: URL.createObjectURL(file), username: "zeki"}
            console.log("previousTodos",previousTodos)

            
            // Optimistically update to the new value
            const prevresult = queryClient.setQueryData(['profile', username], (old) => ({...old, ...previousTodos}))
            console.log("prevresult",prevresult)

            setProfileImage(2);
            updateCurrentUser(previousTodos)
            
            // Return a result with the snapshotted value
            return { previousTodos }
        },
        onError: (onMutateResult) => {
            queryClient.setQueryData(['profile', username], onMutateResult.previousTodos)
        },
        // Always refetch after error or success:
        onSettled: (newTodo) => {
            setProfileImage(1);
            queryClient.invalidateQueries({ queryKey: ['profile', username] }),
            updateCurrentUser(newTodo)
        }
    });



    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        // setUploading(true);

        // Prepare form data with the selected file (key expected by server: 'media')
        const formData = new FormData();
        formData.append("media", selectedFile);

        try {
            // Use mutateAsync so we can await the response and log it if needed
            const res = await mutation.mutateAsync(formData);
            console.log("File uploaded:", res);

        } catch (err) {
            console.error("Upload failed:", err);
            // onSettled will clear uploading flag
        }
    };




    const { isPending, error, data } = useQuery({
        queryKey: ["profile", username],
        // queryFn: () => apiRequest.get(`/users/${username}`).then((res) => res.data),
        queryFn:() =>  getProfileImage(),
        enabled: !!username,
    });

    
    if (isPending) return "Loading...";

    if (error) return "An error has occurred: " + error.message;

    if (!data) return "User not found!";

    console.log("dadta now",data)
    console.log("mutation",mutation)




  

    return (
        <div className="profilePage">
            <>
                <div className="profileImgLabel">
                    
                        {/* <div className="profileImgPreview">
                            <img 
                                // src={ `https://ik.imagekit.io/6g6o7mn8z/${data.img}`} 
                                src={ `${import.meta.env.VITE_URL_IK_ENDPOINT}/${data.img}`} 
                                alt="Preview"
                            />
                        </div> */}
                    
                        <div className="profileImgPreview profileImg">
                            {mutation.isPending ? 
                                (
                                // <div className="profileImgPreview">
                                    <img 
                                        src={data.img} 
                                        alt="Preview"
                                        loading='eager'
                                    />
                                // </div>
                                ):
                                (
                                // <div className="profileImg">
                                    <Image 
                                        w={100}
                                        h={100} 
                                        className="profileImg"
                                        path={data.img || "/general/noAvatar.png"}
                                        loadProfile="eager"
                                        alt=""/>
                                // </div>
                            )}
                        </div>
                        
                    
                    {!mutation.isPending && <label htmlFor="file" >
                        <div className="editIconProfile">
                            <Image path="/general/edit.svg" alt="" />
                        </div>
                    </label>}

                </div>
                <input
                type="file"
                id="file"
                hidden
                onChange={handleFileChange}
              />
            </>
            
             <h1 className="profileName">{data.username}</h1>
            <span className="profileUsername">@{data.username}</span>
            <div className="followCounts">
                {data.followerCount} followers · {data.followingCount} followings
            </div>
            <div className="profileInteractions">
                <Image path="/general/share.svg" alt="" />
                <div className="profileButtons">
                    <button>Message</button>
                    <FollowButton isFollowing={data.isFollowing} username={data.username}/>
                </div>
                <Image path="/general/more.svg" alt="" />
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