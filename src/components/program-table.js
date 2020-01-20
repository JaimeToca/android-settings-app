import React from 'react'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import InputBase from '@material-ui/core/InputBase'

import i18n from '@dhis2/d2-i18n'
import dataTableStyles from '../styles/DataTable.module.css'

class ProgramTable extends React.Component {
    constructor(props) {
        super(props)
        this.programTable = props
    }

    render() {
        return (
            <Table className={dataTableStyles.dataTable}>
                <TableHead>
                    <TableRow>
                        <TableCell
                            className={
                                dataTableStyles.dataTable__headers__header
                            }
                        >
                            {' '}
                        </TableCell>
                        <TableCell
                            className={
                                dataTableStyles.dataTable__headers__header
                            }
                            align="right"
                        >
                            {i18n.t('Download')}
                        </TableCell>
                        <TableCell
                            className={
                                dataTableStyles.dataTable__headers__header
                            }
                            align="right"
                        >
                            {i18n.t('DB trimming')}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody className="data-table__rows">
                    {this.props.data.map(row => (
                        <TableRow key={row.option}>
                            <TableCell
                                component="th"
                                scope="row"
                                className={
                                    dataTableStyles.dataTable__rows__row__column
                                }
                            >
                                {row.option}
                            </TableCell>
                            <TableCell
                                align="right"
                                className={
                                    dataTableStyles.dataTable__rows__row__column
                                }
                            >
                                {Array.isArray(row.download) === true ? (
                                    <Select
                                        key={row.keyDownload}
                                        value={
                                            this.props.states[row.keyDownload]
                                        }
                                        onChange={this.props.onChange}
                                        id={row.keyDownload}
                                        name={row.keyDownload}
                                    >
                                        {row.download.map(option => (
                                            <MenuItem
                                                value={option.value}
                                                key={option.value}
                                                name={option.value}
                                            >
                                                <em> {option.label} </em>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                ) : (
                                    <InputBase
                                        id={row.keyDownload}
                                        name={row.keyDownload}
                                        type="number"
                                        inputProps={{
                                            'aria-label': 'naked',
                                            min: 0,
                                            step: 10,
                                            max: row.maxValue,
                                        }}
                                        value={
                                            this.props.states[row.keyDownload]
                                        }
                                        onChange={this.props.onChange}
                                    />
                                )}
                            </TableCell>
                            <TableCell
                                align="right"
                                className={
                                    dataTableStyles.dataTable__rows__row__column
                                }
                            >
                                {Array.isArray(row.DBTrimming) === true ? (
                                    <Select
                                        key={row.keyDBTrimming}
                                        value={
                                            this.props.states[row.keyDBTrimming]
                                        }
                                        onChange={this.props.onChange}
                                        id={row.keyDBTrimming}
                                        name={row.keyDBTrimming}
                                    >
                                        {row.DBTrimming.map(option => (
                                            <MenuItem
                                                value={option.value}
                                                key={option.value}
                                                name={option.value}
                                            >
                                                <em> {option.label} </em>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                ) : (
                                    <InputBase
                                        id={row.keyDBTrimming}
                                        name={row.keyDBTrimming}
                                        type="number"
                                        inputProps={{
                                            'aria-label': 'naked',
                                            min: 0,
                                            step: 10,
                                            max: row.maxValue,
                                        }}
                                        value={
                                            this.props.states[row.keyDBTrimming]
                                        }
                                        onChange={this.props.onChange}
                                    />
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        )
    }
}

export default ProgramTable
