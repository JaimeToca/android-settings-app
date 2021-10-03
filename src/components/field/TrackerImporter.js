import React, { useEffect, useState } from 'react'
import i18n from '@dhis2/d2-i18n'
import { CheckboxField } from './CheckboxField'
import { useApiVersion } from '../../utils/useApiVersion'

const CODE = 'trackerImporterVersion'
const minApiVersion = '2.36.5'

export const defaultTrackerImporterVersion = 'V1'
export const newTrackerVersion = 'V2'

const isValidVersion = apiVersion => apiVersion >= minApiVersion

export const TrackerImporter = ({ value, onChange, ...props }) => {
    const [validVersion, setValidVersion] = useState(false)
    const [tracker, setTracker] = useState(false)
    const { apiVersion } = useApiVersion()

    useEffect(() => {
        if (apiVersion) {
            isValidVersion(apiVersion)
                ? setValidVersion(true)
                : setValidVersion(false)
        }
    }, [apiVersion])

    const handleCheckbox = e => {
        setTracker(e.checked)
        onChange({
            ...value,
            [CODE]: e.checked
                ? newTrackerVersion
                : defaultTrackerImporterVersion,
        })
    }

    return (
        <>
            {validVersion && (
                <CheckboxField
                    name={CODE}
                    label={i18n.t('Use new version of Tracker Importer')}
                    helpText={i18n.t(
                        'Use new tracker endpoints dedicated to importing and querying tracker objects (including tracked entities, enrollments, events, and relationships).'
                    )}
                    checked={tracker}
                    onChange={handleCheckbox}
                    {...props}
                />
            )}
        </>
    )
}