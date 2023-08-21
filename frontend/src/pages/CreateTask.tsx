import React, { useState } from "react";
import styled from "styled-components";
import { ReactSVG } from "react-svg";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from "../components/Header";
import Back from "../assets/back-icon.svg";
import Button from "../components/Button";

import "./Input.css";

// ... your styled components and other imports ...


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
const CreateOptions = styled.div`
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

const CreateDes = styled.div`
    display: flex;
    flex-direction: column;
`

const ButtonConfirm = styled.div`
    display: flex;
    justify-content: center;    
`

export default function CreateTask() {
    const userId = localStorage.getItem("userId");
    const navigate = useNavigate();

    const [title, setTitle] = useState(""); // State for task title
    const [status, setStatus] = useState(""); // State for task status
    const [description, setDescription] = useState(""); // State for task description

    const backHome = () => {
        navigate(`/home/${userId}`);
    };

    const handleStatusChange = (e: any) => {
        console.log(e.target.value);
        setStatus(e.target.value);
    };

    const createTask = async () => {
        const editedTask = {
            user_id: userId,
            title,
            status,
            description
        };

        try {
            console.log(editedTask);
            const response = await fetch("http://localhost:8000/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editedTask),
            });

            if (!response.ok) {
                toast.error("Something went wrong");
            } else {
                toast.success("Task created successfully");
            }
        } catch (error) {
            toast.error("An error occurred while creating the task");
        }
    };

    return (
        <>
            <Header></Header>
            <ButtonContainer>
                <ToastContainer />
                <ButtonBack onClick={backHome}>
                    <ReactSVG src={Back}></ReactSVG>
                </ButtonBack>
            </ButtonContainer>
            <Container>
                <EditContainer>
                    <Title>Crie sua tarefa</Title>
                    <CreateOptions>
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
                            <select className="InputSelect" value={status} onChange={handleStatusChange}>
                                <option value="">Select a status</option>
                                <option value="todo">todo</option>
                                <option value="doing">doing</option>
                                <option value="done">done</option>
                            </select>
                        </InputContainer>
                    </CreateOptions>
                    <CreateDes>
                        <Label>Descrição:</Label>
                        <textarea
                            className="inputText"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </CreateDes>
                    <ButtonConfirm>
                        <Button onClick={createTask}>Finalizar</Button>
                    </ButtonConfirm>
                </EditContainer>
            </Container>
        </>
    );
}