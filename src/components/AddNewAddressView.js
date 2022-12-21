import React from "react";
import {useState} from "react"
import { Box } from "@mui/system";
import {
    Button,
    Stack,
    TextField,
    Typography,
  } from "@mui/material";
const AddNewAddressView = (props) => {
    const [newAddress , setNewAddress ] = useState({
     isAddingNewAddress : false,
     value : ""
    })
    const getAddress = (e) => {
      // setNewAddress(prev =>({...prev,value:e.target.value}))
      props.getAddress(e.target.value)
    }   

    return (
        <Box>
            <Stack spacing={2}>
                <TextField
                fullWidth={true}
                multiline={true}
                minRows={5}
                variant="outlined"
                id={props.id}
                value={props.value}
                onChange={getAddress}
                />
                <Box display="flex" justifyContent={"flex-start"}>
                    <Button
                    onClick={props.onAdd}
                    variant="contained"
                    size="small"
                    >ADD</Button>
                    <Button
                    size="small"
                    onClick={props.onCancel}
                    >
                        CANCEL
                    </Button>
                </Box>

            </Stack>
        </Box>
    )
};

export default AddNewAddressView