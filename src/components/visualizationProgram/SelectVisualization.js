import React, { useEffect, useState } from 'react'
import i18n from '@dhis2/d2-i18n'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import { FieldSection } from '../field'
import ItemSelector from './VisualizationSearch/ItemSelector'

const list = [
    {
        id: '1',
        name: 'A1 narrative',
    },
    {
        id: '2',
        name: 'ANC: 1-3 trend lines last 12 months',
    },
    {
        id: '6',
        name: 'ANC: 1st to 3rd visit drop-out rate by orgunit last year',
    },
    {
        id: '3',
        name: 'Commodities: Child health consumption districts last 4 quarters',
    },
    {
        id: '4',
        name: 'dashboard 2',
    },
    {
        id: '5',
        name: 'pie 1',
    },
]

export const SelectVisualization = ({ settings, onChange }) => {
    const handleChange = e => {
        //const vis = list.find(item => item.id === e.selected)
        console.log('on change', { e })
        onChange({
            ...settings,
            visualization: e.id,
            visualizationName: e.name || e.displayName,
        })
        /*onChange({
            ...settings,
            visualization: e.selected,
            visualizationName: vis.name,
        })*/
    }

    const clearSelection = () => {
        onChange({
            ...settings,
            visualizations: '',
            visualizationName: '',
        })
    }

    return (
        <>
            {/*<FieldSection>
                <SingleSelectField
                    dense
                    name="visualization"
                    inputWidth="350px"
                    label={i18n.t('Visualization item')}
                    selected={settings.visualization || ''}
                    onChange={e => handleChange(e)}
                    //loading={loading}
                >
                    {list.map(option => (
                        <SingleSelectOption
                            key={option.value || option.id}
                            label={option.label || option.name}
                            value={option.value || option.id}
                        />
                    ))}
                </SingleSelectField>
            </FieldSection>*/}

            <ItemSelector
                setSelection={handleChange}
                clearSelection={clearSelection}
            />
        </>
    )
}
