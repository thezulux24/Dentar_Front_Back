import { ArrowBack } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const IframePage3: React.FC = () => {
    const navigate = useNavigate();
    return (
        <Box sx={{
            p: 0,
            m: 0,
            width: '100dvw',
            height: '95dvh'
        }}>


            <IconButton
                onClick={() => navigate(-1)}
                style={{
                    position: "absolute",
                    top: 20,
                    left: 20,
                    zIndex: 1000,
                    background: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                    borderRadius: "50px",
                }}
            >
                <ArrowBack />
            </IconButton>
            <iframe
                src="https://dev.dentar.ar.kaleidolab.co/#/protesis"
                width="100%"
                height="100%"
                style={{ border: 'none' }}
                title="Proyecto C"
                allow="camera; microphone; fullscreen; clipboard-read; clipboard-write; web-share"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
                allowFullScreen
            />

        </Box>

    );
};

export default IframePage3;