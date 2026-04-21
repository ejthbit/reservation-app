// src/components/Administration/Pages/AdministrationVacation.tsx
import { Add, Delete, Edit } from '@mui/icons-material'
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fade,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material'
import { MobileDatePicker } from '@mui/x-date-pickers'
import { endOfDay, format, parseISO, startOfDay } from 'date-fns'
import { useSnackbar } from 'notistack'
import { useEffect, useMemo, useState } from 'react'
import { useAdministration } from '../../../context/Administration/AdministrationProvider'
import {
    useGetVacations,
    useCreateVacation,
    useUpdateVacation,
    useDeleteVacation,
} from '../../../context/Administration/AdministrationVacationHooks'
import { useGetBookings } from '../../../context/Administration/AdministrationBookingsHooks'
import { Vacation, VacationPayload } from '../../../types'
import ConfirmDialog from '../../common/ConfirmDialog'

type VacationForm = {
    start: Date | null
    end: Date | null
    note: string
}

const emptyForm = (): VacationForm => ({ start: null, end: null, note: '' })

const AdministrationVacation = () => {
    const { selectedWorkspace } = useAdministration()
    const { enqueueSnackbar } = useSnackbar()

    const [addOpen, setAddOpen] = useState(false)
    const [editTarget, setEditTarget] = useState<Vacation | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<Vacation | null>(null)
    const [form, setForm] = useState<VacationForm>(emptyForm())
    const [bookingsWarning, setBookingsWarning] = useState<number | null>(null)

    const { trigger: getVacations, data: vacations = [], isMutating: isLoading } = useGetVacations()
    const { trigger: createVacation, isMutating: isCreating } = useCreateVacation()
    const { trigger: updateVacationMut, isMutating: isUpdating } = useUpdateVacation()
    const { trigger: deleteVacationMut } = useDeleteVacation()
    const { trigger: getBookings } = useGetBookings()

    const sortedVacations = useMemo(
        () => [...vacations].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()),
        [vacations],
    )

    const fetchAll = () => {
        const now = new Date()
        const from = new Date(now.getFullYear() - 1, 0, 1).toISOString()
        const to = new Date(now.getFullYear() + 1, 11, 31).toISOString()
        getVacations({ from, to, workplace: selectedWorkspace })
    }

    useEffect(() => {
        fetchAll()
    }, [selectedWorkspace])

    const buildPayload = (): VacationPayload | null => {
        if (!form.start || !form.end) return null
        return {
            start: startOfDay(form.start).toISOString(),
            end: endOfDay(form.end).toISOString(),
            workplace: parseInt(selectedWorkspace, 10),
            ...(form.note.trim() && { note: form.note.trim() }),
        }
    }

    const checkBookingsAndProceed = async (action: 'create' | 'edit') => {
        const payload = buildPayload()
        if (!payload) return

        try {
            const bookings = await getBookings({
                from: payload.start,
                to: payload.end,
                workplace: selectedWorkspace,
            })

            if (bookings && bookings.length > 0) {
                setBookingsWarning(bookings.length)
                return
            }

            await executeAction(action, payload)
        } catch (err: unknown) {
            enqueueSnackbar((err as { message?: string })?.message ?? 'Chyba.', { variant: 'error' })
        }
    }

    const executeAction = async (action: 'create' | 'edit', payload: VacationPayload) => {
        try {
            if (action === 'create') {
                await createVacation(payload)
                enqueueSnackbar('Dovolená byla vytvořena.', { variant: 'success' })
                setAddOpen(false)
            } else if (editTarget) {
                await updateVacationMut({ id: editTarget.id, ...payload })
                enqueueSnackbar('Dovolená byla upravena.', { variant: 'success' })
                setEditTarget(null)
            }
            setForm(emptyForm())
            setBookingsWarning(null)
            fetchAll()
        } catch (err: unknown) {
            enqueueSnackbar((err as { message?: string })?.message ?? 'Chyba.', { variant: 'error' })
        }
    }

    const handleConfirmWithWarning = async () => {
        const payload = buildPayload()
        if (!payload) return
        const action = editTarget ? 'edit' : 'create'
        await executeAction(action, payload)
    }

    const handleDelete = async () => {
        if (!deleteTarget) return
        try {
            await deleteVacationMut(deleteTarget.id)
            enqueueSnackbar('Dovolená byla smazána.', { variant: 'success' })
            fetchAll()
        } catch (err: unknown) {
            enqueueSnackbar((err as { message?: string })?.message ?? 'Chyba.', { variant: 'error' })
        }
    }

    const openAdd = () => {
        setForm(emptyForm())
        setBookingsWarning(null)
        setAddOpen(true)
    }

    const openEdit = (vacation: Vacation) => {
        setForm({
            start: parseISO(vacation.start),
            end: parseISO(vacation.end),
            note: vacation.note ?? '',
        })
        setBookingsWarning(null)
        setEditTarget(vacation)
    }

    const closeDialog = () => {
        setAddOpen(false)
        setEditTarget(null)
        setForm(emptyForm())
        setBookingsWarning(null)
    }

    const isFormValid = form.start && form.end && form.start <= form.end
    const isSubmitting = isCreating || isUpdating
    const isDialogOpen = addOpen || !!editTarget

    const VacationFormFields = (
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '12px !important' }}>
            <MobileDatePicker
                label="Od"
                value={form.start}
                maxDate={form.end ?? undefined}
                slots={{ textField: (props) => <TextField variant="standard" {...props} fullWidth /> }}
                onChange={(date) => setForm((f) => ({ ...f, start: date }))}
            />
            <MobileDatePicker
                label="Do"
                value={form.end}
                minDate={form.start ?? undefined}
                slots={{ textField: (props) => <TextField variant="standard" {...props} fullWidth /> }}
                onChange={(date) => setForm((f) => ({ ...f, end: date }))}
            />
            <TextField
                label="Poznámka"
                value={form.note}
                onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                fullWidth
                multiline
                rows={2}
            />
            {bookingsWarning !== null && (
                <Alert severity="warning">
                    V tomto období existuje {bookingsWarning} objednávek. Chcete přesto pokračovat?
                </Alert>
            )}
        </DialogContent>
    )

    return (
        <Fade in timeout={{ enter: 500 }}>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Dovolená</Typography>
                    <Button variant="contained" startIcon={<Add />} onClick={openAdd}>
                        Přidat dovolenou
                    </Button>
                </Box>

                {isLoading ? (
                    <Box display="flex" justifyContent="center" mt={4}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableContainer component={Paper} variant="outlined">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Od</TableCell>
                                    <TableCell>Do</TableCell>
                                    <TableCell>Poznámka</TableCell>
                                    <TableCell>Vytvořil</TableCell>
                                    <TableCell align="right">Akce</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedVacations.map((vacation) => (
                                    <TableRow key={vacation.id} hover>
                                        <TableCell>
                                            {format(parseISO(vacation.start), 'dd.MM.yyyy')}
                                        </TableCell>
                                        <TableCell>{format(parseISO(vacation.end), 'dd.MM.yyyy')}</TableCell>
                                        <TableCell>{vacation.note ?? '—'}</TableCell>
                                        <TableCell>{vacation.created_by}</TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Upravit">
                                                <IconButton onClick={() => openEdit(vacation)}>
                                                    <Edit />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Smazat">
                                                <IconButton
                                                    color="error"
                                                    onClick={() => setDeleteTarget(vacation)}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {!sortedVacations.length && (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            <Typography variant="body2" color="text.secondary">
                                                Žádná dovolená nenalezena
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {/* Add / Edit dialog */}
                <Dialog open={isDialogOpen} onClose={closeDialog} fullWidth maxWidth="xs">
                    <DialogTitle>{editTarget ? 'Upravit dovolenou' : 'Přidat dovolenou'}</DialogTitle>
                    {VacationFormFields}
                    <DialogActions>
                        <Button onClick={closeDialog}>Zrušit</Button>
                        {bookingsWarning !== null ? (
                            <Button
                                variant="contained"
                                color="warning"
                                onClick={handleConfirmWithWarning}
                                disabled={!isFormValid || isSubmitting}
                            >
                                {isSubmitting ? (
                                    <CircularProgress size={20} />
                                ) : editTarget ? (
                                    'Uložit přesto'
                                ) : (
                                    'Vytvořit přesto'
                                )}
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                onClick={() => checkBookingsAndProceed(editTarget ? 'edit' : 'create')}
                                disabled={!isFormValid || isSubmitting}
                            >
                                {isSubmitting ? (
                                    <CircularProgress size={20} />
                                ) : editTarget ? (
                                    'Uložit'
                                ) : (
                                    'Přidat'
                                )}
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>

                {/* Delete confirm */}
                <ConfirmDialog
                    open={!!deleteTarget}
                    title="Smazat dovolenou"
                    description="Opravdu chcete smazat tuto dovolenou?"
                    onConfirm={handleDelete}
                    onClose={() => setDeleteTarget(null)}
                />
            </Box>
        </Fade>
    )
}

export default AdministrationVacation
