import styled from "styled-components";
import { ReactSVG } from "react-svg";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from "../components/Header";

import Back from "../assets/back-icon.svg";
import Button from "../components/Button";
import ButtonDel from "../components/ButtonDel";


const ButtonContainer = styled.div`
    display:flex;
    max-width: 100%;
    padding: 1rem 0rem 1rem 5rem;
    gap: 2rem;
`

const ButtonBack = styled.div`
    max-width: 5%;
    cursor: pointer;
`

const Container = styled.div`
    display: flex;
    padding: 0 8rem;
    max-width: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
`

const EditContainer = styled.div`
    display: flex;
    flex-direction: column;
    width:100%;
    align-items: center;
`
const Title = styled.div`
    font-weight: 800;
    color: #080341;
    font-size: 36px;
`

const Info = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%
`

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: left;
    width: 100%
`
const Label = styled.label`
    color: #080341;
    margin-bottom: 0.5rem;
    font-size: 20px;
`

const InputBox = styled.div`
    display: flex;
    width: 100%;
    height: 2rem;
    border-radius: 1rem;
    padding: 0.6rem;
    border: none;
    background-color: #DDDDDD;
    align-items:center;
`
const ButtonFinish = styled.div`
    display:flex;
    max-width: 100%;
    gap: 2rem;
    padding-bottom: 2rem;x
`

export default function Settings() {
    const userIdHeader = localStorage.getItem("userId");
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        telephone: "",
    });
    const navigate = useNavigate();

    const editAccount = () => {
        navigate(`/edit-settings/${userIdHeader}`);
    } 

    const deleteAllTask = async() => {
        try {
            const response = await fetch(`http://localhost:8000/tasks/user/${userIdHeader}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                }
            });
        }
        catch(error){
            console.log(error);
        }
    }

    const deleteAccount = async () => {
        try {
            deleteAllTask();
            const response = await fetch(`http://localhost:8000/users/${userIdHeader}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if(response.ok) {
                localStorage.removeItem("userId");
                navigate("/");
            }
        }
        catch(error){
            toast.error(JSON.stringify(error));
        }
    }

    useEffect(() => {
        async function fetchUserData() {
            try {
                const response = await fetch(`http://localhost:8000/users/${userIdHeader}`);
                
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data.user); // Assuming user data is nested under "user" key
                } else {
                    toast.error("Something went wrong");
                }
            } catch (error) {
                toast.error("Error");
            }
        }
        
        fetchUserData();
    }, [userIdHeader]);
    
    const backHome = () => {
        navigate(`/home/${userIdHeader}`)
    }

    return (
        <>
            <Header></Header>
            <ButtonContainer>
                <ToastContainer />
                <ButtonBack onClick={backHome}>
                    <ReactSVG src={Back}></ReactSVG> 
                </ButtonBack>                  
            </ ButtonContainer>
            <Container>
                <EditContainer>
                    <Title>Configurações</Title>
                    <Info>
                    <InputContainer>
                            <Label>Nome:</Label>
                            <InputBox>{userData.name}</InputBox>
                        </InputContainer>
                        <InputContainer>
                            <Label>Email:</Label>
                            <InputBox>{userData.email}</InputBox>
                        </InputContainer>
                        <InputContainer>
                            <Label>Telefone:</Label>
                            <InputBox>{userData.telephone}</InputBox>
                        </InputContainer>
                    </Info>
                </EditContainer>
                <ButtonFinish>
                    <Button onClick={editAccount}>Editar</Button>
                    <ButtonDel onClick={deleteAccount}>Excluir</ButtonDel>
                </ButtonFinish>
            </Container>
        </>
    )
}