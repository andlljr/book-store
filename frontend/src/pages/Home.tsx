import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Card from "../components/Card";
import {Task} from "../../types";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ButtonContainer = styled.div`
    max-width: 100%;
    padding: 1rem 0rem 1rem 5rem;
`;

const CreateButton = styled.div`
    width: 9rem;
    height: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #00A868;
    cursor: pointer;
    border-radius: 1rem;
    color: #FFFFFF;
    font-weight: 700;
`;

const CardContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`;

const Title = styled.div`
    font-weight: 800;
    color: #080341;
    font-size: 40px;
    margin: 2rem 0;
`;

export default function Home() {
    const navigate = useNavigate();
    const userIdHeader = localStorage.getItem("userId");
    
    // Initialize tasks state with an empty array of Task objects
    const [tasks, setTasks] = useState<Task[]>([]);

    const createTask = () => {
        navigate("/create-task");
    };

    useEffect(() => {
        // Fetch tasks from the backend API
        fetch(`http://ec2-3-238-33-251.compute-1.amazonaws.com:8000/users/${userIdHeader}/tasks`)
            .then(response => response.json())
            .then(data => setTasks(data.tasks))
            .catch(error => console.error("Error fetching tasks:", error));
    }, []);

    const handleDelete = async (taskId: number) => {
        try {
            const response = await fetch(`http://ec2-3-238-33-251.compute-1.amazonaws.com:8000/tasks/${taskId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                }
            });
    
            if (response.ok) {
                toast.success("Deleted successfully");
                // Remove the deleted task from the tasks state
                setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
            }
        } catch (error) {
            toast.error(JSON.stringify(error));
        }
    };

    return (
        <>
            <Header />
            <ButtonContainer>
                <CreateButton onClick={createTask}>Criar tarefa</CreateButton>
            </ButtonContainer>
            <CardContainer>
                <ToastContainer></ToastContainer>
                <Title>Todo</Title>
                {tasks
                    .filter(task => task.status === "todo")
                    .map(task => (
                        <Card
                            key={task.id}
                            title={task.title}
                            description={task.description}
                            cardId={task.id}
                            onDelete={handleDelete}
                        />
                    ))}
                <Title>Doing</Title>
                {tasks
                    .filter(task => task.status === "doing")
                    .map(task => (
                        <Card
                            key={task.id}
                            title={task.title}
                            description={task.description}
                            cardId={task.id}
                            onDelete={handleDelete}
                        />
                    ))}
                <Title>Done</Title>
                {tasks
                    .filter(task => task.status === "done")
                    .map(task => (
                        <Card
                            key={task.id}
                            title={task.title}
                            description={task.description}
                            cardId={task.id}
                            onDelete={handleDelete}
                        />
                    ))}
            </CardContainer>
        </>
    );
}
