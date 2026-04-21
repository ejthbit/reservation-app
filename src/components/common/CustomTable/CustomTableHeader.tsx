import { Print } from '@mui/icons-material'
import { IconButton, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material'

interface HeadCell {
    id: string
    label: string
    disableSorting?: boolean
}

interface CustomTableHeaderProps {
    headCells: HeadCell[]
    order: 'asc' | 'desc'
    orderBy: string
    onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void
    handlePrint: () => void
}

const CustomTableHeader: React.FC<CustomTableHeaderProps> = ({
    headCells,
    order,
    orderBy,
    onRequestSort,
    handlePrint,
}) => {
    const createSortHandler = (property: string) => (event: React.MouseEvent) => {
        onRequestSort(event, property)
    }

    return (
        <TableHead>
            <TableRow>
                {headCells.map(({ id, disableSorting, label }) => (
                    <TableCell
                        key={`${id}-${label}`}
                        padding="normal"
                        sortDirection={orderBy === id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === id}
                            direction={orderBy === id ? order : 'asc'}
                            onClick={(e) => (disableSorting ? e.preventDefault() : createSortHandler(id)(e))}
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
                <TableCell padding="normal">
                    <IconButton onClick={handlePrint}>
                        <Print />
                    </IconButton>
                </TableCell>
            </TableRow>
        </TableHead>
    )
}

export default CustomTableHeader
