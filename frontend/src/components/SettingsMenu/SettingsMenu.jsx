import { useEffect, useRef, useState } from "react";

import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import SettingsIcon from '@mui/icons-material/Settings';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";

const fabStyle = {
    position: 'absolute',
    bottom: 12,
    right: 12,
    zIndex: 1500
};

const boxStyle = {
    height: 200, // Ajusta la altura del Drawer
    background: "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))", // Degradado negro a transparente
    padding: 3,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexWrap: 'wrap'

}


const OptionsMenu = ({  scale, setScale, height, setHeight, width, setWidth}) => {

    const [open, setOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("predeterminado");
    const [transparency, setTransparency] = useState(false);
    const [sliderVisible, setSliderVisible] = useState(false);


    const toggleOpen = () => {
        if (!open) {
            setSliderVisible(false);
            setSelectedOption("predeterminado")
        }

        setOpen(!open);

    }

    // cambio del slider
    const handleSliderChange = (event, newValue) => {
        if (selectedOption === "escala") setScale(newValue);
        else if (selectedOption === "alto") setHeight(newValue);
        else if (selectedOption === "ancho") setWidth(newValue);
    };

    const handleSelectOption = (option) => {
        setSelectedOption(option);
        setSliderVisible(true);
    };

    // Función para restablecer valores predeterminados
    const resetValues = () => {
        setScale(1);
        setHeight(1);
        setWidth(1);
        setTransparency(false);
        setSelectedOption('predeterminado')
        setSliderVisible(false);
    };

    return (
        <>
            <SwipeableDrawer
                hideBackdrop
                anchor={"bottom"}
                open={open}
                onClose={toggleOpen}

            /* onOpen={} */

            >
                <Box sx={boxStyle}>
                    {sliderVisible && <>
                        <Typography variant="body1" color="white">
                            Ajustar {selectedOption}
                        </Typography>

                        <Slider
                            defaultValue={1}
                            aria-label="Slider de ajuste"
                            valueLabelDisplay="auto"
                            value={selectedOption === "escala" ? scale : selectedOption === "alto" ? height : width}
                            onChange={handleSliderChange}
                            max={2}
                            min={0.5}
                            step={0.1}
                            sx={{ width: "80%", color: "white" }}
                        />
                    </>}

                    {/* BOTONES */}
                    <ButtonGroup variant="contained" aria-label="Opciones de ajuste" sx={{ gap: 1 }}>
                        <Button onClick={() => handleSelectOption("escala")}>Escala</Button>
                        <Button onClick={() => handleSelectOption("alto")}>Alto</Button>
                        <Button onClick={() => handleSelectOption("ancho")}>Ancho</Button>
                        <Button onClick={resetValues}>Reset</Button>
                    </ButtonGroup>

                    {/* SWITCH TRANSPARENCIA */}
                    <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                        <Typography variant="body2" color="white">
                            Transparencia
                        </Typography>
                        <Switch
                            checked={transparency}
                            onChange={() => setTransparency(!transparency)}

                        />
                    </Box>

                </Box>

            </SwipeableDrawer>

            <Fab color="secondary" aria-label="edit" sx={fabStyle} onClick={toggleOpen}>
                <SettingsIcon fontSize="large" sx={{
                        transition: "transform 0.3s ease-in-out",
                        transform: open ? "rotate(180deg)" : "rotate(0deg)",
                    }} />
            </Fab>
        </>

    )
}

export default OptionsMenu;