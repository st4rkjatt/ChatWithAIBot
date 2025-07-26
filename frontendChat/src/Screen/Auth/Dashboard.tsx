import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom"
// import Selects from "../Selects";
import SidebarForUsers from "../../Components/SidebarForUsers";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../reduxToolkit/Store";
import { getAllUsers } from "../../reduxToolkit/Reducers/Auth.tsx/UsersSlice";
import RightSideMessage from "../../Components/RightSideMessage";
import { ToastContainer } from "react-toastify";
import VoiceChat from "../../Components/VoiceChat";
import MicListener from "../../Components/MicListener";
import Dp from "../../Components/Dp";
import CircleAnimation from "../../Components/CircleAnimation";

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [user, setUser] = useState({})
  const result = useSelector((state: any) => state.usersReducers)
  const allUsers = useRef<Map<string, string>>(new Map());
  // console.log(result, 'result')
  const userDetails: any = localStorage.getItem('user');
  // console.log(userDetails, 'userDetails')
  const userName = JSON.parse(userDetails)?.userName
  const avatarImage = JSON.parse(userDetails)?.avatarImage


  useEffect(() => {
    dispatch(getAllUsers())
  }, [])

  const handleClickOnUser = (data: any) => {
    setUser(data)
  }
  // console.log(result.result, 'result.result')

  useEffect(() => {
    if (result && result.result) {
      for (let userDetails of result.result) {
        if (!allUsers.current.has(userDetails.userName.trim())) {
          allUsers.current.set(userDetails.userName.trim(), userDetails._id)
        }
      }
    }
  }, [result.result])

  // return <CircleAnimation />
  return (
    <>
      <ToastContainer />
      <div className="">
        <div className="min-w-full  rounded lg:grid lg:grid-cols-3  ">
          <div className="border-r border-gray-300 sm:col-span-1 relative">
            <VoiceChat allUsers={allUsers.current} />
            {/* <MicListener /> */}

            <div className="pt-3 px-3 border-gray-400 mb-2 grid grid-cols-6 border-b-2">
              <div className="relative pb-3  flex items-center">
                <Link to="/profile">
                  <Dp name={userName} />
                </Link>
                <span className=" w-3 h-3 bg-blue-600 rounded-full absolute left-[35px] top-1"></span>

              </div>
              <div className="col-span-4">
                <span className="block ml-2 font-bold text-gray-600">{userName}</span>
              </div>

            </div>
            <SidebarForUsers data={result && result.result} handleClickOnUser={handleClickOnUser} />
          </div>
          <RightSideMessage user={user} />

        </div>
      </div>
    </>
  );
};

export default Dashboard;
