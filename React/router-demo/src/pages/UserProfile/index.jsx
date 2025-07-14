import {
  useEffect
} from 'react'
import { useParams } from 'react-router-dom'

const UserProfile = () => {
  const { id } = useParams();
  useEffect(() => {
    // console.log(id);
    console.log(window.location);
  }, [id]);
  return <>UserProfile{id}</>;
};

export default UserProfile;
