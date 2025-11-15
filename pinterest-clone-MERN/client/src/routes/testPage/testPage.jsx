// import {
//   useQuery,
// } from '@tanstack/react-query'



// const testPage = () => {

//     const { isPending, error, data } = useQuery({
//     queryKey: ['repoData'],
//     queryFn: () =>
//       fetch('https://api.github.com/repos/TanStack/query').then((res) =>
//         res.json(),
//       ),
//   })

//   if (isPending) return 'Loading...'

//   if (error) return 'An error has occurred: ' + error.message

//   return (
//     <div>
//       <h1>{data.name}</h1>
//       <p>{data.description}</p>
//       <strong>👀 {data.subscribers_count}</strong>{' '}
//       <strong>✨ {data.stargazers_count}</strong>{' '}
//       <strong>🍴 {data.forks_count}</strong>
//     </div>
//   )
// }

// export default testPage



//----------------------------------------------------------------

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import apiRequest from '../../utils/apiRequest';

const addUser = async (data) => {
  const res = await apiRequest.post("/users/auth/register",data);
  return res.data;
};

const getUser = async () => {
  const res = await apiRequest.get("/users/users");
  return res.data;
};


const testPage = () => {
  // Access the client
  const queryClient = useQueryClient()

    // Mutations
  const mutation = useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  // Queries
  const {data, isLoading, isError} = useQuery({ queryKey: ['todos'], queryFn: () => getUser() });
//   console.log('data',data);

if (isLoading) return <p>Loading...</p>;
if (isError) return <p>Error: {isError.message}</p>;

console.log(data); 




  return (
    <div>
      <ul>
        {data.users.map((user) => (
          <li key={user._id}>{user.username}</li>
        ))}
      </ul>

      <button
        onClick={() => {
          mutation.mutate({
            username: 'test3',
            displayName: 'distest1',
            email: 'test1@gmail.com',
            password: '12345678',
          })
        }}
      >
        Add Todo
      </button>
    </div>
  )
}

export default testPage