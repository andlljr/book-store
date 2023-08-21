import styled from "styled-components";
import { Props, ReactSVG } from "react-svg";
import { useNavigate } from "react-router-dom";
import edit from "../assets/edit-button.svg";
import del from "../assets/delete-button.svg";

interface CardProps {
    title: string,
    description: string,
    cardId: number,
    onDelete: (cardId: number) => void;
}

const CardSubContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    width:90%;
`

const CardBody = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem 2rem;
    align-items: lef;
    background-color: #F5F5F5;
    width: 90%;
    height: 10rem;
    border-radius: 2rem;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    transition: 0.3s;
    &: hover {
        transition: 0.3s;
        scale: 1.02;
    }
    color: #080341;
    gap: 1rem;
`

const CardHead = styled.div`
    font-size: 20px;
    font-weight: 800;
`

const CardDes = styled.div`
`

const OptionContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    width: 10%;
    height: 10rem;
`

const ButtonSubContainer = styled.div`
    cursor: pointer;
`   

const Card: React.FC<CardProps> = ({title, description, cardId, onDelete}) => {
    const navigate = useNavigate();

    const deleteCard = () => {
        onDelete(cardId); // Call the onDelete callback with the cardId
      };

    const editCard = () => {
        navigate(`/edit-task/${cardId}`)
    }

    return (
        <CardSubContainer>
            <CardBody>
                <CardHead>{title}</CardHead>
                <CardDes>{description}</CardDes>
            </CardBody>
            <OptionContainer>
                <ButtonSubContainer onClick={editCard}>
                    <ReactSVG src={edit}></ReactSVG>
                </ButtonSubContainer>
                <ButtonSubContainer onClick={deleteCard}>
                    <ReactSVG src={del}></ReactSVG>
                </ButtonSubContainer>    
            </OptionContainer>
        </CardSubContainer>
    )
}

export default Card;