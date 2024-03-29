import { Check } from '@mui/icons-material'
import { Fade, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import { styled } from '@mui/material/styles'
import { format } from 'date-fns'
import PropTypes from 'prop-types'
import { always, ascend, descend, equals, ifElse, prop, sortWith } from 'ramda'
import { useState } from 'react'
import { compose } from 'redux'
import { isNilOrEmpty } from '../../../utils'
import CustomTableHeader from './CustomTableHeader'
import { useReactToPrint } from 'react-to-print'
import { useRef } from 'react'
const PREFIX = 'CustomTable'

const classes = {
    root: `${PREFIX}-root`,
    paper: `${PREFIX}-paper`,
    table: `${PREFIX}-table`,
    visuallyHidden: `${PREFIX}-visuallyHidden`,
    tableRow: `${PREFIX}-tableRow`,
    completedTableRow: `${PREFIX}-completedTableRow`,
}

const StyledFade = styled(Fade)(({ theme }) => ({
    [`& .${classes.root}`]: {
        width: '100%',
    },

    [`& .${classes.paper}`]: {
        boxShadow: 'none',
        width: '100%',
        marginBottom: theme.spacing(2),
    },

    [`& .${classes.table}`]: {
        minWidth: 750,
    },

    [`& .${classes.visuallyHidden}`]: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },

    [`& .${classes.tableRow}`]: {
        '&.MuiTableCell-root': {
            width: 250,
        },
    },

    [`& .${classes.completedTableRow}`]: {
        opacity: 0.7,
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
}))

const sortDirection = ifElse(equals('desc'), always(descend), always(ascend))
const sortByProperty = (order, orderBy, data) =>
    sortWith([compose(sortDirection(order), prop)(orderBy)], data)

const CustomTable = ({ title, data, orderBy: orderedBy, headCells }) => {
    const [order, setOrder] = useState('asc')
    const [orderBy, setOrderBy] = useState(orderedBy)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const calendarRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => calendarRef.current,
    })

    const handleRequestSort = (e, property) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const handleChangePage = (e, newPage) => setPage(newPage)

    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10))
        setPage(0)
    }

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage)

    return (
        !isNilOrEmpty(data) && (
            <StyledFade in timeout={500}>
                <div className={classes.root}>
                    <Paper className={classes.paper}>
                        {title && (
                            <Typography variant="h6" id="tableTitle" component="div">
                                {title}
                            </Typography>
                        )}
                        <TableContainer ref={calendarRef}>
                            <Table
                                className={classes.table}
                                aria-labelledby="tableTitle"
                                size="medium"
                                aria-label="enhanced table"
                            >
                                <CustomTableHeader
                                    handlePrint={handlePrint}
                                    headCells={headCells}
                                    classes={classes}
                                    order={order}
                                    orderBy={orderBy}
                                    onRequestSort={handleRequestSort}
                                />
                                <TableBody>
                                    {sortByProperty(order, orderBy, data)
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                            const date = new Date(row.start)
                                            const rowDate = format(date, 'yyyy/MM/dd')
                                            const rowTime = row.start.substr(11, 5)
                                            const labelId = `enhanced-table-checkbox-${index}`
                                            return (
                                                <Fade key={`${rowDate}-${rowTime}`} in timeout={500 * index}>
                                                    <TableRow
                                                        className={
                                                            row.completed ? classes.completedTableRow : ''
                                                        }
                                                        hover
                                                        role="checkbox"
                                                        tabIndex={-1}
                                                    >
                                                        <TableCell id={labelId}>{rowDate}</TableCell>
                                                        <TableCell>{rowTime}</TableCell>
                                                        <TableCell>{row.name}</TableCell>
                                                        <TableCell>{row.birthdate}</TableCell>
                                                        <TableCell>{row.email || ''}</TableCell>
                                                        <TableCell>{row.phone || ''}</TableCell>
                                                        <TableCell>
                                                            {row.completed && (
                                                                <Fade in timeout={500}>
                                                                    <Check />
                                                                </Fade>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                </Fade>
                                            )
                                        })}
                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: 53 * emptyRows }}>
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            labelRowsPerPage="Počet záznamů na stránce"
                            component="div"
                            count={data.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            onPageChange={handleChangePage}
                        />
                    </Paper>
                </div>
            </StyledFade>
        )
    )
}

CustomTable.propTypes = {
    data: PropTypes.array,
    orderBy: PropTypes.string,
    title: PropTypes.string,
    headCells: PropTypes.array,
}
export default CustomTable
