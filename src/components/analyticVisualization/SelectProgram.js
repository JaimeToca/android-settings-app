import React, { useEffect, useState } from 'react'
import i18n from '@dhis2/d2-i18n'
import PropTypes from '@dhis2/prop-types'
import { VisualizationSelectField } from '../field'
import { useReadProgramQuery } from '../../pages/Analytics/Program/ProgramVisualizationQueries'

export const SelectProgram = ({ settings, onChange }) => {
    const { programList, loading } = useReadProgramQuery()
    const [options, setOptions] = useState([])

    useEffect(() => {
        if (programList) {
            setOptions(programList)
        }
    }, [programList])

    const handleChange = e => {
        const name = options.find(program => program.id === e.selected)
        onChange({
            ...settings,
            program: e.selected,
            programName: name.name,
        })
    }

    return (
        <VisualizationSelectField
            name="program"
            label={i18n.t('Program')}
            selected={settings.program || ''}
            onChange={handleChange}
            loading={loading}
            options={options}
        />
    )
}

SelectProgram.propTypes = {
    settings: PropTypes.object,
    onChange: PropTypes.func,
}