import styled from "styled-components";
import { ReactSVG } from "react-svg";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import logo from "../assets/small-logo.svg";
import profile from "../assets/profile-icon.svg";
import logout from "../assets/logout-icon.svg";

const HeaderBody = styled.div`
    max-width: 100%;
    max-height: 5rem;
    background-color: #F5F5F5;
    border-bottom: 0.5px #000000 solid;
    display: flex;
    justify-content: space-between; 
    align-items: center;
    padding: 0.5rem 2rem 1rem 2rem;
`

const OptionsContent = styled.div`
    display: flex;
    gap: 0.5rem;
    padding-top: 1rem;
`

export default function Header() {
    const navigate = useNavigate();
    
    const handleLogout = () => {
        localStorage.removeItem("userId");
        navigate(`/`);
        toast.success("Logged out");
    };

    const handleProfileClick = () => {  
        const userId = localStorage.getItem("userId");
        if (userId) {
            navigate(`/settings/${userId}`);
        } else {
            toast.error("Something wrong occured");
        }
    };

    return (
        <HeaderBody>
            <ReactSVG src={logo}></ReactSVG>
            <OptionsContent>
                <ReactSVG src={logout} style={{cursor:'pointer'}}  onClick={handleProfileClick}></ReactSVG>
                <ReactSVG src={profile} style={{cursor:'pointer'}} onClick={handleLogout} ></ReactSVG>
            </OptionsContent>
        </ HeaderBody>
    )
}