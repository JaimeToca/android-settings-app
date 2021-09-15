import React, { useEffect, useState } from 'react'
import i18n from '@dhis2/d2-i18n'
import { useDataMutation, useDataQuery } from '@dhis2/app-runtime'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import Page from '../../../components/page/Page'
import {
    saveAnalyticsKeyMutation,
    useReadAnalyticsDataStore,
} from '../analyticsDatastoreQuery'
import { authorityQuery } from '../../../modules/apiLoadFirstSetup'
import FooterStripButtons from '../../../components/footerStripButton/FooterStripButtons'
import ProgramAnalyticsList from './ProgramAnalyticsList'
import VisualizationsInfo from '../../../components/noticeAlert/VisualizationsInfo'

const ProgramAnalytics = () => {
    const { tei, home, programs, dataSet, load } = useReadAnalyticsDataStore()
    const { data: hasAuthority } = useDataQuery(authorityQuery)
    const [programsAnalytics, setProgramAnalytics] = useState([])
    const [initialValues, setInitialValues] = useState()
    const [disableSave, setDisableSave] = useState(true)
    const [disable, setDisable] = useState(false)

    const [mutate, { error, data }] = useDataMutation(saveAnalyticsKeyMutation)

    useEffect(() => {
        hasAuthority && setDisable(!hasAuthority.authority)
    }, [hasAuthority])

    useEffect(() => {
        if (programs) {
            setProgramAnalytics(programs)
            //setInitialValues(programs)
        }
    }, [programs])

    /*useEffect(() => {
        if (programsAnalytics) {
            //set
        }
    }, [programsAnalytics])*/

    const saveSettings = async () => {
        const settingsToSave = {
            tei,
            dhisVisualizations: {
                home,
                program: '',
                dataSet,
            },
        }
        await mutate({ settingsToSave })
    }

    const resetSettings = () => {
        setProgramAnalytics([])
    }

    return (
        <Page
            title={i18n.t('Program')}
            desc={i18n.t('Manage visualizations for program.')}
            loading={load}
            unsavedChanges={!disableSave}
        >
            {programsAnalytics && (
                <>
                    {isEmpty(programsAnalytics) && (
                        <VisualizationsInfo type="Programs" />
                    )}

                    <ProgramAnalyticsList
                        disable={disable}
                        visualizations={programsAnalytics}
                        handleVisualizations={setProgramAnalytics}
                    />

                    <FooterStripButtons
                        onSave={saveSettings}
                        onReset={resetSettings}
                        saveButtonDisabled={disableSave}
                        errorRequest={error}
                        requestResult={data}
                        handleDisableSave={setDisableSave}
                        disableAll={disable}
                    />
                </>
            )}
        </Page>
    )
}

export default ProgramAnalytics
