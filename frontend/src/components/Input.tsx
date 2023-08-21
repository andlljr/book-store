import React from "react";
import styled from "styled-components";

interface InputProps {
    title: string,
    typeInput: string;
}

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
`

const Label = styled.label`
    color: #080341;
    margin-bottom: 0.5rem;
    font-size: 20px;
`

const InputBox = styled.input`
    width: 30rem;
    height: 2rem;
    border-radius: 1rem;
    padding: 0.6rem;
    border: none;
    background-color: #FFFFFF;
`

const Input: React.FC<InputProps> = ({title, typeInput}) => {
    return (
        <InputContainer>
            <Label>{title}</Label>
            <InputBox type={typeInput}></InputBox>
        </InputContainer>
    )
};

export default Input;