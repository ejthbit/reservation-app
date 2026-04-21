import { Check } from '@mui/icons-material'
import {
    Fade,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    TableRow,
    styled,
} from '@mui/material'
import { format } from 'date-fns'
import { useState, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import CustomTableHeader from './CustomTableHeader'

interface DataRow {
    start: string
    name: string
    birthdate: string
    email?: string
    phone?: string
    completed?: boolean
}

interface HeadCell {
    id: string
    label: string
    disableSorting?: boolean
}

interface CustomTableProps {
    title?: string
    data: DataRow[]
    orderBy: string
    headCells: HeadCell[]
}

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

const CustomTable: React.FC<CustomTableProps> = ({ title, data, orderBy: initialOrderBy, headCells }) => {
    const [order, setOrder] = useState<'asc' | 'desc'>('asc')
    const [orderBy, setOrderBy] = useState(initialOrderBy)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const calendarRef = useRef<HTMLDivElement>(null)

    const handlePrint = useReactToPrint({
        content: () => calendarRef.current,
    })

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const handleChangePage = (_event: unknown, newPage: number) => setPage(newPage)

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const sortedData = [...data].sort((a, b) => {
        const key = orderBy as keyof DataRow
        const aValue = a[key] ?? '' // Default empty string or fallback value
        const bValue = b[key] ?? ''

        if (aValue < bValue) return order === 'asc' ? -1 : 1
        if (aValue > bValue) return order === 'asc' ? 1 : -1
        return 0
    })
    const displayedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

    return data.length > 0 ? (
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
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={handleRequestSort}
                            />
                            <TableBody>
                                {displayedData.map((row, index) => {
                                    const date = new Date(row.start)
                                    const rowDate = format(date, 'yyyy/MM/dd')
                                    const rowTime = row.start.substring(11, 16) // Extract HH:mm
                                    const labelId = `enhanced-table-checkbox-${index}`
                                    return (
                                        <Fade key={`${rowDate}-${rowTime}`} in timeout={500 * index}>
                                            <TableRow
                                                className={row.completed ? classes.completedTableRow : ''}
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
    ) : null
}

export default CustomTable
