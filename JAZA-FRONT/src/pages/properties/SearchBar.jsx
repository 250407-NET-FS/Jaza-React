import { useState } from "react";
import { api } from "../services/api";
import { Autocomplete, TextField } from "@mui/material";

const SearchBar = () => {
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const [open, setOpen] = useState(false);

    const fetchData = async (value) => {
        setLoading(true);
        try {
            await api.get(`properties/search/${value}`)
            .then(res => res.data)
            .then(data => setOptions(data));
        }
        catch (error) {
            console.log(error.status)
        }
        finally {
            setLoading(false);
        }
    };

    // handleChange callback requires the event argument even if unused
    const handleChange = (event, value) => {
        if (value.length < 3) {
            if (open) {
                setOpen(false);
            }
            return;
        }
        const timer = setTimeout(() => {
            setOpen(true)
            fetchData(value)
        }, 500); // 500ms timeout to prevent constant requests
    }

    const handleKeyDown = async (event) => {
        console.log(value);
        if (event.key !== 'Enter' || value.length < 3) {
            return;
        }
        console.log("here!");
        try {
            // unfinished final query that should redirect to property page with results
        } 
        catch (error) {
            setError(error.message);
        } 
        finally {
            setLoading(false);
        }
    }

    return (
        <Autocomplete 
            open={open}
            loading={loading}
            options={options}
            forcePopupIcon={false}
            filterOptions={(option) => option} // Override default filterOptions behavior as recommended by MUI
            getOptionLabel={(option) => option.streetAddress}
            onInputChange={handleChange}
            onClose={() => setOpen(false)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    fullWidth
                    variant="outlined"
                    placeholder="Enter an address"
                    onKeyDown={handleKeyDown} // Listen for Enter key
                    sx={{
                        backgroundColor: 'white',
                        borderRadius: 1,
                    }}
                />
            )}
        />
    )                                                                                                    
}

export default SearchBar