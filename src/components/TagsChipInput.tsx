import { Chip, TextField } from '@mui/material';
import { WidgetProps, GenericObjectType } from '@rjsf/utils';
import { useState, FocusEvent } from 'react';
import { useTranslate } from 'react-admin';

export const TagsChipInput = function (props: WidgetProps) {
    const { disabled, id, onBlur, onChange, onFocus, readonly, value } = props;
    const [list, setList] = useState<string[]>(value?value:[]);
    const [label, setLabel] = useState('');
    const translate = useTranslate();

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
            {!readonly &&
            (<TextField fullWidth variant="outlined" type="text"
                value={label}
                disabled={disabled }
                id={id}
                name={id}
                onBlur={!readonly ? handleBlur : undefined}
                onFocus={!readonly ? handleFocus : undefined}
                label={translate('resources.common.labels')}
                onChange={handleChange}
                onKeyDown={handleKeyDown}/>)

            }
             { readonly &&   
                        <div><label 
                        style={{
                            display:'block',
                            color:' rgba(0, 0, 0, 0.6)',
                            margin:'0 0 0.2em 0',
                            fontSize:'0.8em'
                        }}

                            >{translate('resources.common.labels')}</label>
                        </div>
             }
            <div class="chip">
                {list.map((item, index) => {
                    return readonly?
                        
                        (
                        <Chip
                            label={item}
                            key={item}
                        />
                        ):
                        (<Chip
                            label={item}
                            key={item}
                            onDelete={() => {
                                setList(list.filter((label, i) => i != index));
                            }}
                        />)
                })}
            </div>
        </div>
    );
};
