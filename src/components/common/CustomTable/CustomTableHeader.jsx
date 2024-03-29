import { Print } from '@mui/icons-material'
import { IconButton, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material'
import PropTypes from 'prop-types'

const CustomTableHeader = ({ headCells, classes, order, orderBy, onRequestSort, handlePrint }) => {
    const createSortHandler = (property) => (event) => onRequestSort(event, property)

    return (
        <TableHead>
            <TableRow>
                {headCells.map(({ id, disableSorting, label }) => (
                    <TableCell
                        key={`${id}-${label}`}
                        padding="normal"
                        sortDirection={orderBy === id && order}
                    >
                        <TableSortLabel
                            active={orderBy === id}
                            direction={orderBy === id ? order : 'asc'}
                            onClick={(e) => (disableSorting ? e.preventDefault() : createSortHandler(id)())}
                            hideSortIcon={disableSorting}
                        >
                            {label}
                            {orderBy === id && (
                                <span style={{ display: 'none' }}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            )}
                        </TableSortLabel>
                    </TableCell>
                ))}
                <IconButton onClick={handlePrint}>
                    <Print />
                </IconButton>
            </TableRow>
        </TableHead>
    )
}

CustomTableHeader.propTypes = {
    headCells: PropTypes.array,
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
}

export default CustomTableHeader
