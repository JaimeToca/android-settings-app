import React, { useEffect, useState } from 'react'
import i18n from '@dhis2/d2-i18n'
import { AddNewSetting } from '../../../components/field'
import DialogVisualization from './DialogVisualization'
import {
    createInitialValues,
    createVisualizationValues,
    getGroupList,
    updateRows,
    validMandatoryFields,
} from './helper'
import { useSystemId } from '../../../utils/useSystemId'

const NewProgramVisualization = ({
    disable,
    visualization,
    handleVisualization,
    groups,
    handleGroups,
}) => {
    const { refetch: refetchId, data: id } = useSystemId()
    const [openDialog, setOpenDialog] = useState(false)
    const [visualizationSettings, setSettings] = useState(
        createInitialValues('')
    )
    const [disableSave, setDisableSave] = useState(true)

    useEffect(() => {
        setDisableSave(validMandatoryFields(visualizationSettings))
    }, [visualizationSettings])

    const handleOpenDialog = () => {
        setOpenDialog(true)
        refetchId()
    }

    const handleClose = () => {
        setOpenDialog(false)
        setSettings(createInitialValues(''))
    }

    const handleSave = () => {
        const currentVisualization = createVisualizationValues(
            visualizationSettings,
            id.system.codes[0]
        )

        const updatedVisualizationList = updateRows(
            currentVisualization,
            visualization
        )

        handleVisualization(updatedVisualizationList)
        handleGroups(getGroupList(updatedVisualizationList))
        handleClose()
    }

    return (
        <>
            <AddNewSetting
                label={i18n.t('Add Program Visualization')}
                onClick={handleOpenDialog}
                disable={disable}
            />

            {openDialog && (
                <DialogVisualization
                    open={openDialog}
                    settings={visualizationSettings}
                    handleChange={setSettings}
                    handleSave={handleSave}
                    handleClose={handleClose}
                    disableSave={disableSave}
                    groups={groups}
                />
            )}
        </>
    )
}

export default NewProgramVisualization