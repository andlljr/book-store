import styled from "styled-components";
import { ReactSVG } from "react-svg";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from "../components/Header";

import Back from "../assets/back-icon.svg";
import Button from "../components/Button";
import ButtonDel from "../components/ButtonDel";

import './Input.css'

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

const InputBox = styled.input`
    
`
const ButtonFinish = styled.div`
    display:flex;
    max-width: 100%;
    gap: 2rem;
    padding-bottom: 2rem;x
`

export default function EditSettings() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [telephone, setTelephone] = useState("");
    const [password, setPassword] = useState("");
    const userId = localStorage.getItem("userId");

    const backSettings = () => {
        navigate(`/settings/${userId}`)
    }

    const handleSubmit = () => {
        const editedUserInfo = {
            name,
            email,
            telephone,
            password,
        };

        fetch(`http://ec2-3-238-33-251.compute-1.amazonaws.com:8000/users/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(editedUserInfo),
        })
        .then((response) => {
            if (!response.ok) {
                toast.error("Something went wrong");
            }
            toast.success("Your account info was edited");
        })
        .catch((error) => {
            toast.error(error);
        });
    };

    return (
        <>
            <Header></Header>
            <ButtonContainer>
                <ToastContainer></ToastContainer>
                <ButtonBack onClick={backSettings}>
                    <ReactSVG src={Back}></ReactSVG>
                </ButtonBack>
            </ ButtonContainer>
            <Container>
                <EditContainer>
                    <Title>Configurações</Title>
                    <Info>
                        <InputContainer>
                            <Label>Nome:</Label>
                            <input
                                className="Edit-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </InputContainer>
                        <InputContainer>
                            <Label>Email:</Label>
                            <input
                                className="Edit-input"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </InputContainer>
                        <InputContainer>
                            <Label>Telefone:</Label>
                            <input
                                className="Edit-input"
                                value={telephone}
                                onChange={(e) => setTelephone(e.target.value)}
                            />
                        </InputContainer>
                        <InputContainer>
                            <Label>Password:</Label>
                            <input
                                className="Edit-input"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </InputContainer>
                    </Info>
                </EditContainer>
                <ButtonFinish>
                    <Button onClick={handleSubmit}>Finalizar</Button>
                </ButtonFinish>
            </Container>
        </>
    )
}