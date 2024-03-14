import { Chip, TextField } from '@mui/material';
import { WidgetProps, GenericObjectType } from '@rjsf/utils';
import { useState, FocusEvent } from 'react';

export const TagsChipInput = function (props: WidgetProps) {
    const { autofocus, disabled, formContext, id, hideLabel, onBlur, onChange, onFocus, readonly, value } = props;
    const [list, setList] = useState<string[]>(value?value:[]);
    const [label, setLabel] = useState('');
    const { readonlyAsDisabled = true } = formContext as GenericObjectType;

    const handleChange = event => {
        setLabel(event.target.value);
        
    };
    const handleBlur = ({ target }: FocusEvent<HTMLInputElement>) => onBlur(id, target.value);
    const handleFocus = ({ target }: FocusEvent<HTMLInputElement>) => onFocus(id, target.value);
  
    const handleKeyDown = event => {
        if (event.key === 'Enter') {
            handleAdd();
        }
    };

    const handleAdd = () => {
        const newList = list.concat(label);
        setList(newList);
        onChange(newList);
        setLabel('');
    };

    return (
        <div>
            <TextField fullWidth variant="outlined" type="text"
                value={label}
                disabled={disabled || (readonlyAsDisabled && readonly)}
                id={id}
                name={id}
                onBlur={!readonly ? handleBlur : undefined}
                onFocus={!readonly ? handleFocus : undefined}
                label="Labels"
                onChange={handleChange}
                onKeyDown={handleKeyDown}/>

            
            <div class="chip">
                {list.map((item, index) => {
                    return (
                        <Chip
                            label={item}
                            key={item}
                            onDelete={() => {
                                setList(list.filter((label, i) => i != index));
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};
