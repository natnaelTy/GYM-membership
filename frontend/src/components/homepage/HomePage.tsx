import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchUser } from "../../store/UserSlice";

export default function HomePage() {
  
    const dispatch = useDispatch<AppDispatch>();
    const {loading, error, user} = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(fetchUser());
  },[dispatch]);  

  if(loading){
    return <p>Loading..</p>
  }
  if(error){
    return <p>Error: {error}</p>
  }
  console.log(user)
  return (
    <ul>
        {user.length > 0 ? user.map((index, users) => (
            <li key={users.id}>{users.full_name}</li>
        )) : <p>No user found</p>}
    </ul>
  )
}

