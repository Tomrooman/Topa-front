import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

type PropsType = {
    label: string;
    selectedItem: string;
    menuItems: { name: string, value: string }[];
    handleOnChange: (event: SelectChangeEvent) => void;
}

const SelectComponent = ({ label, selectedItem, menuItems, handleOnChange }: PropsType) => {
    return (
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id={label}>{label}</InputLabel>
            <Select
                labelId={label}
                value={selectedItem}
                label={label}
                onChange={handleOnChange}
            >
                {
                    menuItems.map((item, index) => (
                        <MenuItem key={index} value={item.value}>{item.name}</MenuItem>
                    ))
                }
            </Select>
        </FormControl>
    );
}

export default SelectComponent;