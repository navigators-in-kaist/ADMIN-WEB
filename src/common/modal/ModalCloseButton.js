import React from 'react';
import { RxCross1 } from "react-icons/rx";
import styled from "styled-components";

const IconButton = styled.button`
  border: none;
  background: none;
  
  &:focus {
    outline: none;
  }
`;

const ModalCloseButton = ({ title, setIsOpen }) => {
    return (
        <div
            style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row'
            }}
        >
            <div>
                <p>
                    {title}
                </p>
            </div>
            <div
                style={{
                    marginLeft: 'auto'
                }}
            >
                <div
                    style={{
                        width: '100%',
                        textAlign: 'right'
                    }}
                >
                    <IconButton
                        onClick={() => setIsOpen(false)}
                    >
                        <RxCross1
                            size={"20"}
                            color={"#757575"}
                        />
                    </IconButton>
                </div>
            </div>
        </div>
    );
};

export default ModalCloseButton;