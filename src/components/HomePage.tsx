import * as React from 'react';
import { useContext } from 'react';
import PokedexDataGrid from "./PokedexDataGrid";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { useTheme } from '@mui/material/styles';
import { ColorModeContext } from '../contexts/ColorModeContext';


const HomePage = () => {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);

    return (
        <div>
            <h1>Welcome to Pokedex!</h1>
            <FormGroup>
                <FormControlLabel 
                    control={<Switch checked={theme.palette.mode === 'dark'} 
                    onChange={colorMode.toggleColorMode} />} 
                    label="Dark Mode"/>
            </FormGroup>     
            <PokedexDataGrid/>
        </div>
    );
};

export default HomePage;