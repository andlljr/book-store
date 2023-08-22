import styled from "styled-components";
import { ReactSVG } from "react-svg";
import { json, useNavigate, useParams } from "react-router-dom";
import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from "../components/Header";

import Back from "../assets/back-icon.svg";
import Button from "../components/Button";

import "./Input.css";

const ButtonContainer = styled.div`
    max-width: 100%;
    padding: 1rem 0rem 1rem 5rem;
`

const ButtonBack = styled.div`
    max-width: 5%;
    cursor: pointer;
`

const Container = styled.div`
    display: flex;
    padding: 0rem 0rem 1rem 8rem;
    max-width: 100%;
    flex-direction: column;
    gap: 20rem;
`

const EditContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width:90%;
    gap: 1rem;
`
const Title = styled.div`
    font-weight: 800;
    color: #080341;
    font-size: 36px;
`
const EditOptions = styled.div`
    display: flex;
    max-width: 100%;
    gap: 5rem;
`

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    width:50%;
`

const Label = styled.label`
    color: #080341;
    margin-bottom: 0.5rem;
    font-size: 20px;
`

const InputBox = styled.input`
    height: 2rem;
    border-radius: 1rem;
    padding: 0.6rem;
    border: none;
    background-color: #DDDDDD;
`

const EditDes = styled.div`
    display: flex;
    flex-direction: column;
`

const ButtonConfirm = styled.div`
    display: flex;
    justify-content: center;    
`

export default function EditTask() {
    const navigate = useNavigate();
    const taskId = useParams();
    const userIdHeader = localStorage.getItem("userId")

    const [title, setTitle] = useState("");
    const [status, setStatus] = useState("");
    const [description, setDescription] = useState("");

    const backHome = () => {
        navigate(`/home/${userIdHeader}`)
    }

    const updateTask = async () => {
        try {
            console.log(taskId);
            const response = await fetch(`http://ec2-3-238-33-251.compute-1.amazonaws.com:8000/tasks/${taskId.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    status,
                    description,
                }),
            });

            if (response.ok) {
                // Handle success, maybe show a success message
                navigate(`/home/${userIdHeader}`);
                toast.success("Task updated");
                
            } else {
                toast.error("Something went wrong");
            }
        } catch (error) {
            // Handle error, show an error message
            toast.error(JSON.stringify(error));
        }
    };

    return (
        <>
        <ToastContainer></ToastContainer>
            <Header></Header>
            <ButtonContainer>
                <ButtonBack onClick={backHome}>
                    <ReactSVG src={Back}></ReactSVG> 
                </ButtonBack>                  
            </ ButtonContainer>
            <Container>
                <EditContainer>
                    <Title>Edite sua tarefa</Title>
                    <EditOptions>
                        <InputContainer>
                            <Label>Titulo:</Label>
                            <input
                                className="InputBox"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </InputContainer>
                        <InputContainer>
                            <Label>Status:</Label>
                            <select className="InputSelect" value={status} onChange={(e) => setStatus(e.target.value)} >
                                <option value="">Select a status</option>
                                <option value="todo">todo</option>
                                <option value="doing">doing</option>
                                <option value="done">done</option>
                            </select>
                        </InputContainer>
                    </EditOptions>
                    <EditDes>
                        <Label>Descrição:</Label>
                        <textarea
                            className="inputText"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </EditDes>
                    <ButtonConfirm>
                        <Button onClick={updateTask}>Finalizar</Button>
                    </ButtonConfirm>
                </EditContainer>
            </Container>
        </>
    )
}