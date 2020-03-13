import React from 'react'

import { CircularLoader } from '@dhis2/ui-core'
import api from '../utils/api'

import {
    Program,
    SpecificProgram,
    ProgramSettingsDefault,
    maxValues,
} from '../constants/program-settings'
import { NAMESPACE, PROGRAM_SETTINGS } from '../constants/data-store'

import GlobalSpecificSettings from '../pages/global-specific-settings'
import { getInstance } from 'd2'

const programData = Program
const specificProgramData = SpecificProgram
const {
    settingDownload,
    settingDBTrimming,
    teiDownload,
    teiDBTrimming,
    enrollmentDownload,
    enrollmentDBTrimming,
    enrollmentDateDownload,
    enrollmentDateDBTrimming,
    updateDownload,
    updateDBTrimming,
    eventsDownload,
    eventsDBTrimming,
    eventDateDownload,
    eventDateDBTrimming,
} = ProgramSettingsDefault

class ProgramSettings extends React.Component {
    constructor(props) {
        super(props)

        this.nameSpace = undefined
        this.keyName = undefined
        this.programNamesList = []
        this.globalSettings = {}
        this.specificSettings = {}
        this.updateGlobal = false
        this.specificSettingsRows = []
        this.programList = []
        this.programListComplete = []
        this.programToChange = undefined
        this.argsRow = undefined
        this.programName = undefined
    }

    state = {
        settingDownload,
        settingDBTrimming,
        teiDownload,
        teiDBTrimming,
        enrollmentDownload,
        enrollmentDBTrimming,
        enrollmentDateDownload,
        enrollmentDateDBTrimming,
        updateDownload,
        updateDBTrimming,
        eventsDownload,
        eventsDBTrimming,
        eventDateDownload,
        eventDateDBTrimming,
        specificSetting: {
            openDialog: false,
            name: '',
            settingDownload: '',
            settingDBTrimming: '',
            teiDownload: '',
            teiDBTrimming: '',
            enrollmentDownload: '',
            enrollmentDBTrimming: '',
            enrollmentDateDownload: '',
            enrollmentDateDBTrimming: '',
            updateDownload: '',
            updateDBTrimming: '',
            eventsDownload: '',
            eventsDBTrimming: '',
            eventDateDownload: '',
            eventDateDBTrimming: '',
        },
        loading: true,
        isUpdated: false,
        deleteDialog: {
            open: false,
        },
    }

    tableActions = {
        edit: (...args) => {
            this.programToChange = args[0].name
            const argsData = args[0]
            const settings = this.populateObject('FULL_SPECIFIC', argsData)
            this.setState({
                specificSetting: {
                    ...settings,
                    name: argsData.id,
                    openDialog: true,
                },
            })
            this.getItemList()
            this.updateGlobal = false
        },
        delete: (...args) => {
            this.argsRow = args[0]
            this.programName = args[0].name

            this.setState({
                deleteDialog: {
                    open: true,
                },
                isUpdated: true,
            })
            this.updateGlobal = false
        },
    }

    chooseSetting = (name, value) => {
        switch (name) {
            case 'teiDownload':
                value = Math.min(maxValues.teiDownload, parseInt(value))
                break
            case 'teiDBTrimming':
                value = Math.min(maxValues.teiDBTrimming, parseInt(value))
                break
            case 'eventsDownload':
                value = Math.min(maxValues.eventsDownload, parseInt(value))
                break
            case 'eventsDBTrimming':
                value = Math.min(maxValues.eventsDBTrimming, parseInt(value))
                break
            default:
                break
        }
        return value
    }

    handleChange = e => {
        e.preventDefault()
        this.setState({
            ...this.state,
            [e.target.name]: this.chooseSetting(e.target.name, e.target.value),
        })
        this.updateGlobal = true
    }

    handleChangeDialog = e => {
        e.preventDefault()
        this.setState({
            ...this.state,
            specificSetting: {
                ...this.state.specificSetting,
                [e.target.name]: this.chooseSetting(
                    e.target.name,
                    e.target.value
                ),
            },
        })
        this.updateGlobal = false
    }

    saveDataApi = (settingType, data) => {
        if (this.keyName === PROGRAM_SETTINGS) {
            if (Object.keys(this[settingType]).length) {
                data[settingType] = this[settingType]
            }

            api.updateValue(NAMESPACE, PROGRAM_SETTINGS, data).then(res => res)
        } else {
            api.getKeys(NAMESPACE).then(
                api
                    .createValue(NAMESPACE, PROGRAM_SETTINGS, data)
                    .then(data => data)
            )
        }
    }

    submitData = () => {
        if (!this.updateGlobal) {
            return true
        }
        const settings = this.populateObject('GLOBAL', this.state)
        const globalSettings = {
            ...settings,
            lastUpdated: new Date().toJSON(),
        }

        this.globalSettings = globalSettings

        const programSettingData = {
            globalSettings: {
                ...this.globalSettings,
            },
        }

        this.saveDataApi('specificSettings', programSettingData)
    }

    getItemList = () => {
        if (this.programNamesList.length > 0) {
            const programListComplete = this.programListComplete
            const programUsedlist = this.programNamesList

            const programNameFilter = programListComplete.filter(
                item => !programUsedlist.includes(item.id)
            )
            this.programList = programNameFilter
        }
    }

    handleClickOpen = () => {
        this.getItemList()
        this.setState({
            specificSetting: {
                ...this.state.specificSetting,
                openDialog: true,
            },
        })

        this.updateGlobal = false
    }

    handleClose = () => {
        this.programToChange = undefined
        const settings = this.populateObject('DEFAULT') //'FULL_SPECIFIC',SpecificSettingsDefault

        this.setState({
            specificSetting: {
                ...settings,
                openDialog: false,
                name: '',
            },
        })

        this.updateGlobal = false
    }

    populateObject = (programType, settingsList) => {
        let object
        switch (programType) {
            case 'WITH_REGISTRATION':
                object = {
                    settingDownload: settingsList.settingDownload,
                    teiDownload: settingsList.teiDownload,
                    enrollmentDownload: settingsList.enrollmentDownload,
                    enrollmentDateDownload: settingsList.enrollmentDateDownload,
                    updateDownload: settingsList.updateDownload,
                }
                break
            case 'WITHOUT_REGISTRATION':
                object = {
                    settingDownload: settingsList.settingDownload,
                    eventsDownload: settingsList.eventsDownload,
                    eventDateDownload: settingsList.eventDateDownload,
                }
                break
            case 'GLOBAL':
                object = {
                    settingDownload: settingsList.settingDownload,
                    teiDownload: settingsList.teiDownload,
                    enrollmentDownload: settingsList.enrollmentDownload,
                    enrollmentDateDownload: settingsList.enrollmentDateDownload,
                    updateDownload: settingsList.updateDownload,
                    eventsDownload: settingsList.eventsDownload,
                    eventDateDownload: settingsList.eventDateDownload,
                }
                break
            case 'GLOBAL_SPECIAL':
                object = {
                    settingDownload: settingsList.settingDownload,
                    teiDownload: settingsList.teiDownload,
                    updateDownload: settingsList.updateDownload,
                    eventsDownload: settingsList.eventsDownload,
                    eventDateDownload: settingsList.eventDateDownload,
                }
                break
            case 'DEFAULT':
                object = {
                    settingDownload,
                    teiDownload,
                    enrollmentDownload,
                    enrollmentDateDownload,
                    updateDownload,
                    eventsDownload,
                    eventDateDownload,
                }
                break
            case 'FULL_SPECIFIC':
                object = {
                    settingDownload: settingsList.settingDownload,
                    teiDownload: settingsList.teiDownload,
                    enrollmentDownload: settingsList.enrollmentDownload,
                    enrollmentDateDownload: settingsList.enrollmentDateDownload,
                    updateDownload: settingsList.updateDownload,
                    eventsDownload: settingsList.eventsDownload,
                    eventDateDownload: settingsList.eventDateDownload,
                }
                break
            default:
                break
        }
        return object
    }

    handleSubmitDialog = async () => {
        var specificProgramNameKey = this.state.specificSetting.name
        var objData = this.specificSettings

        const programNameFilter = this.programListComplete.filter(
            option => option.id === specificProgramNameKey
        )

        if (programNameFilter.length > 0) {
            const programObject = this.populateObject(
                'FULL_SPECIFIC',
                this.state.specificSetting
            )
            objData[specificProgramNameKey] = {
                ...programObject,
                id: specificProgramNameKey,
                lastUpdated: new Date().toJSON(),
                name: programNameFilter[0].name,
            }

            const sumarySettings =
                (this.state.specificSetting.teiDownload === undefined
                    ? 0
                    : this.state.specificSetting.teiDownload) +
                ' TEI/ ' +
                (this.state.specificSetting.eventsDownload === undefined
                    ? 0
                    : this.state.specificSetting.eventsDownload) +
                ' events per OU'

            const newProgramRow = {
                ...objData[specificProgramNameKey],
                sumarySettings,
            }

            this.specificSettings = objData

            const programData = {
                specificSettings: objData,
            }

            if (this.programToChange !== undefined) {
                this.specificSettingsRows = this.specificSettingsRows.filter(
                    row => row.id !== newProgramRow.id
                )
                this.specificSettingsRows.push(newProgramRow)

                const nameList = this.programNamesList
                const newNameList = nameList.filter(
                    name => name !== this.state.specificSetting.name
                )

                this.programNamesList = newNameList
            } else {
                this.specificSettingsRows.push(newProgramRow)
            }

            this.programNamesList.push(this.state.specificSetting.name)

            this.saveDataApi('globalSettings', programData)
        }
        this.handleClose()
    }

    handleReset = () => {
        const settings = this.populateObject('DEFAULT')
        this.setState({
            ...settings,
        })

        this.updateGlobal = true
    }

    handleCloseDelete = () => {
        const data = this.argsRow
        const oldList = this.specificSettings
        const rowList = this.specificSettingsRows
        const programNamesUsed = this.programNamesList

        const programListNew = programNamesUsed.filter(
            program => program !== data.id
        )
        this.programNamesList = programListNew

        const newList = {}
        let newRowList = []

        for (const key in oldList) {
            if (key !== data.id) {
                const program = this.specificSettings[key]
                newList[key] = program
            }
        }

        newRowList = rowList.filter(row => row.id !== data.id)

        this.specificSettingsRows = newRowList
        this.specificSettings = newList

        this.setState({
            isUpdated: true,
            deleteDialog: {
                open: false,
            },
        })

        this.updateGlobal = true
    }

    handleCancelDialog = () => {
        this.argsRow = undefined
        this.programName = undefined
        this.setState({
            isUpdated: true,
            deleteDialog: {
                open: false,
            },
        })
        this.updateGlobal = false
    }

    async componentDidMount() {
        await api
            .getNamespaces()
            .then(res => {
                const nameSpace = res.filter(name => name === NAMESPACE)
                nameSpace.length === 0
                    ? (this.nameSpace = undefined)
                    : (this.nameSpace = nameSpace[0])
                this.nameSpace !== undefined
                    ? this.setState({ isUpdated: true })
                    : this.setState({ isUpdated: false })
                if (this.nameSpace === NAMESPACE) {
                    api.getKeys(this.nameSpace).then(res => {
                        const keyName = res.filter(
                            name => name === PROGRAM_SETTINGS
                        )
                        keyName.length === 0
                            ? (this.keyName = undefined)
                            : (this.keyName = keyName[0])
                        if (this.keyName !== undefined) {
                            api.getValue(this.nameSpace, this.keyName).then(
                                res => {
                                    if (res.value.specificSettings) {
                                        this.specificSettings =
                                            res.value.specificSettings
                                        this.programNamesList = Object.keys(
                                            this.specificSettings
                                        )

                                        for (const key in this
                                            .specificSettings) {
                                            if (
                                                this.specificSettings.hasOwnProperty(
                                                    key
                                                )
                                            ) {
                                                const program = this
                                                    .specificSettings[key]
                                                const sumarySettings =
                                                    (program.teiDownload ===
                                                    undefined
                                                        ? 0
                                                        : program.teiDownload) +
                                                    ' TEI/ ' +
                                                    (program.eventsDownload ===
                                                    undefined
                                                        ? 0
                                                        : program.eventsDownload) +
                                                    ' events per OU'

                                                const newProgramRow = {
                                                    ...program,
                                                    sumarySettings,
                                                }
                                                this.specificSettingsRows.push(
                                                    newProgramRow
                                                )
                                            }
                                        }
                                        this.setState({
                                            loading: false,
                                        })
                                    }

                                    if (res.value.globalSettings) {
                                        this.setState({
                                            ...res.value.globalSettings,
                                            isUpdated: true,
                                            loading: false,
                                        })
                                        this.globalSettings =
                                            res.value.globalSettings
                                    }
                                }
                            )
                        } else {
                            const settings = this.populateObject('DEFAULT')
                            this.globalSettings = {
                                ...settings,
                            }

                            const data = {
                                globalSettings: {
                                    ...this.globalSettings,
                                },
                            }

                            this.saveDataApi('specificSettings', data)

                            this.nameSpace = NAMESPACE
                            this.keyName = PROGRAM_SETTINGS

                            this.setState({
                                isUpdated: true,
                                loading: false,
                            })
                        }
                    })
                } else if (this.nameSpace === undefined) {
                    api.createNamespace(NAMESPACE, PROGRAM_SETTINGS).catch(e =>
                        console.error(e)
                    )
                }
            })
            .catch(e => {
                this.setState({
                    isUpdated: false,
                    loading: false,
                })
            })

        getInstance().then(d2 => {
            d2.models.program
                .list({
                    paging: false,
                    level: 1,
                    fields: 'id,name',
                    filter: 'access.data.write:eq:true',
                })
                .then(collection => {
                    const programList = collection.toArray()
                    this.programList = programList
                    this.programListComplete = programList
                })
        })
    }

    componentDidUpdate() {
        this.submitData()
    }

    render() {
        if (this.state.loading === true) {
            return <CircularLoader small />
        }

        return (
            <GlobalSpecificSettings
                tableNameProperty="Program Name"
                componentSubtitleSingular="Program"
                componentSubtitlePlural="Programs"
                programTableData={programData}
                states={this.state}
                handleTableChange={this.handleChange}
                specificSettings={this.programNamesList}
                specificSettingList={this.specificSettingsRows}
                programTableActions={this.tableActions}
                addSpecificSetting={this.handleClickOpen}
                deleteDialogDelete={this.handleCloseDelete}
                closeDialogDelete={this.handleCancelDialog}
                typeNameDialogDelete="program"
                dialogDeleteName={this.programName}
                handleResetGlobalSettings={this.handleReset}
                specificSettingDialogClose={this.handleClose}
                specificSettingDataTitle={this.programToChange}
                specificSettingOptions={this.programList}
                specificSettingHandleChange={this.handleChangeDialog}
                specificSettingData={specificProgramData}
                specificSettingHandleSubmit={this.handleSubmitDialog}
                specificSetting={this.state.specificSetting}
            />
        )
    }
}

export default ProgramSettings
