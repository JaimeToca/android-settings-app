import React from 'react'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'

export const Select = ({
    onChange,
    label,
    name,
    value,
    disabled,
    options,
    inputWidth,
}) => (
    <SingleSelectField
        inputWidth={inputWidth}
        key={name}
        label={label}
        selected={value}
        id={name}
        name={name}
        onChange={e => onChange(e, name)}
        disabled={disabled}
    >
        {options.map(option => (
            <SingleSelectOption
                key={option.value || option.id}
                label={option.label || option.name}
                value={option.value || option.id}
            />
        ))}
    </SingleSelectField>
)