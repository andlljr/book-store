    import React, { useState } from "react";
    import styled from "styled-components";
    import { ReactSVG } from "react-svg";
    import { useNavigate } from "react-router-dom";
    import { ToastContainer, toast } from 'react-toastify';
    import 'react-toastify/dist/ReactToastify.css';
    import './Input.css'

    import ButtonHome from "../components/ButtonHome";

    import logo from "../assets/big-logo.svg";

    const LoginBody = styled.div`
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    const LoginContainer = styled.div`
        width: 40rem;
        height: 25rem;
        display: flex;
        flex-direction: column;
        background-color: #00A868;
        align-items: center;
        padding: 2rem;
        border-radius: 2rem;
        justify-content: space-evenly;
    `;

 const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
`

const Label = styled.label`
    color: #080341;
    margin-bottom: 0.5rem;
    font-size: 20px;
`

    export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleLogin = async () => {
        console.log("handleLogin called");
        try {
            // Make API request to backend login route
            const response = await fetch("http://ec2-3-238-33-251.compute-1.amazonaws.com:8000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                const userId = data.user.id;
                localStorage.setItem("userId", userId);
                navigate(`/home/${userId}`);
                toast.success("Login successful");
            } else {
                toast.error("Login failed");
                console.log(email, password)
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

        return (
            <LoginBody>
                <ToastContainer />
                <LoginContainer>
                    <ReactSVG src={logo}></ReactSVG>
                    <InputContainer>
                        <Label>Email:</Label>
                        <input
                            className="Input"
                            title="Email:"
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                        />
                    </InputContainer>
                    <InputContainer>
                        <Label>Password:</Label>
                        <input 
                        className="Input"
                        title="Password:"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        
                    />
                    </InputContainer>
                    <ButtonHome onClick={handleLogin}>Entrar</ButtonHome>
                </LoginContainer>
            </LoginBody>
        );
    }
