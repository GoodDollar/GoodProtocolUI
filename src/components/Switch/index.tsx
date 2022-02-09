import React, { useCallback } from 'react'
import { StyledSwitch } from './styled'

type SwitchProps = Omit<React.HTMLAttributes<HTMLInputElement>, 'onChange'> & {
    onChange: (value: boolean) => void
    checked: boolean
}

export default function Switch({ onChange, defaultChecked, checked, ...rest }: SwitchProps): JSX.Element {
    const onSwitchChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange(e.target.checked)
        },
        [onChange]
    )
    return (
        <StyledSwitch checked={checked}>
            <div className='area' />
            <input
                type='checkbox'
                onChange={onSwitchChange}
                defaultChecked={defaultChecked}
                checked={checked}
                {...rest}
            />
            <div className='toggle' />
        </StyledSwitch>
    )
}
