import { Add, Delete, Edit } from '@mui/icons-material'
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fade,
    IconButton,
    MenuItem,
    OutlinedInput,
    Paper,
    Select,
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
import { useSnackbar } from 'notistack'
import { useEffect, useMemo, useState } from 'react'
import useSWRMutation from 'swr/mutation'
import axiosGynInstance from '../../../api/config'
import { useAdministration } from '../../../context/Administration/AdministrationProvider'
import { useGetDoctorsForSelectedAmbulance } from '../../../hooks/useGetDoctorsForSelectedAmbulance'
import { useGetAmbulances } from '../../../hooks/useGetAmbulances'
import { useGetCategories } from '../../../hooks/useGetCategories'
import { Doctor } from '../../../types/Doctor'
import { Ambulance } from '../../../types/Ambulance'
import { Category } from '../../../types'
import ConfirmDialog from '../../common/ConfirmDialog'

type DoctorForm = {
    name: string
    workplace_id: string[]
    categories: string[]
    preferred_service_start: string
}

const emptyForm = (): DoctorForm => ({ name: '', workplace_id: [], categories: [], preferred_service_start: '' })

const createFetcher = async (key: string, { arg }: { arg: DoctorForm }) =>
    (await axiosGynInstance.post(key, arg)).data

const updateFetcher = async (key: string, { arg }: { arg: { id: number } & DoctorForm }) => {
    const { id, ...body } = arg
    return (await axiosGynInstance.put(`${key}/${id}`, body)).data
}

const deleteFetcher = async (key: string, { arg }: { arg: number }) =>
    (await axiosGynInstance.delete(`${key}/${arg}`)).data

const AdministrationEmployees = () => {
    const { selectedWorkspace } = useAdministration()
    const { enqueueSnackbar } = useSnackbar()

    const [addOpen, setAddOpen] = useState(false)
    const [editTarget, setEditTarget] = useState<Doctor | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<Doctor | null>(null)
    const [form, setForm] = useState<DoctorForm>(emptyForm())

    const { trigger: createDoctor, isMutating: isCreating } = useSWRMutation('administration/doctor', createFetcher)
    const { trigger: updateDoctor, isMutating: isUpdating } = useSWRMutation('administration/doctor', updateFetcher)
    const { trigger: deleteDoctor } = useSWRMutation('administration/doctor', deleteFetcher)

    const {
        doctorsForSelectedAmbulance: doctors,
        isLoadingDoctorsForSelectedAmbulance: isLoading,
        api: { getDoctorsForSelectedAmbulance: fetchDoctors },
    } = useGetDoctorsForSelectedAmbulance()

    const { data: ambulances } = useGetAmbulances()
    const { data: categories } = useGetCategories()

    const workplaceMap = useMemo(
        () =>
            (ambulances as Ambulance[] | undefined)?.reduce<Record<string, string>>(
                (acc, a) => ({ ...acc, [String(a.workplace_id)]: a.name }),
                {},
            ) ?? {},
        [ambulances],
    )

    const categoryMap = useMemo(
        () =>
            (categories as Category[] | undefined)?.reduce<Record<string, string>>(
                (acc, c) => ({ ...acc, [String(c.category_id)]: c.name }),
                {},
            ) ?? {},
        [categories],
    )

    const sortedDoctors = useMemo(
        () => [...(doctors ?? [])].sort((a, b) => Number(a.doctor_id) - Number(b.doctor_id)),
        [doctors],
    )

    useEffect(() => {
        fetchDoctors(Number(selectedWorkspace))
    }, [selectedWorkspace])

    const ambulanceOptions = (ambulances as Ambulance[] | undefined) ?? []
    const categoryOptions = (categories as Category[] | undefined) ?? []

    const openAdd = () => {
        setForm({ ...emptyForm(), workplace_id: [String(selectedWorkspace)] })
        setAddOpen(true)
    }

    const openEdit = (doctor: Doctor) => {
        setForm({
            name: doctor.name,
            workplace_id: doctor.workplace_id,
            categories: doctor.categories ?? [],
            preferred_service_start: doctor.preferred_service_start ?? '',
        })
        setEditTarget(doctor)
    }

    const handleAdd = async () => {
        try {
            await createDoctor(form)
            enqueueSnackbar('Zaměstnanec byl přidán.', { variant: 'success' })
            setAddOpen(false)
            fetchDoctors(Number(selectedWorkspace))
        } catch (err: unknown) {
            enqueueSnackbar((err as { message?: string })?.message ?? 'Chyba.', { variant: 'error' })
        }
    }

    const handleEdit = async () => {
        if (!editTarget) return
        try {
            await updateDoctor({ id: editTarget.id, ...form })
            enqueueSnackbar('Zaměstnanec byl upraven.', { variant: 'success' })
            setEditTarget(null)
            fetchDoctors(Number(selectedWorkspace))
        } catch (err: unknown) {
            enqueueSnackbar((err as { message?: string })?.message ?? 'Chyba.', { variant: 'error' })
        }
    }

    const handleDelete = async () => {
        if (!deleteTarget) return
        try {
            await deleteDoctor(deleteTarget.id)
            enqueueSnackbar(`Zaměstnanec "${deleteTarget.name}" byl smazán.`, { variant: 'success' })
            fetchDoctors(Number(selectedWorkspace))
        } catch (err: unknown) {
            enqueueSnackbar((err as { message?: string })?.message ?? 'Chyba.', { variant: 'error' })
        }
    }

    const isFormValid = form.name.trim() && form.workplace_id.length > 0
    const isSubmitting = isCreating || isUpdating

    const DoctorFormFields = (
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '12px !important' }}>
            <TextField
                label="Jméno"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
                fullWidth
            />
            <Box>
                <Typography variant="caption" color="text.secondary">Pracoviště *</Typography>
                <Select
                    multiple
                    fullWidth
                    value={form.workplace_id}
                    onChange={(e) => setForm((f) => ({ ...f, workplace_id: e.target.value as string[] }))}
                    input={<OutlinedInput size="small" />}
                    renderValue={(selected) =>
                        (selected as string[]).map((v) => workplaceMap[v] ?? v).join(', ')
                    }
                >
                    {ambulanceOptions.map((a) => (
                        <MenuItem key={a.workplace_id} value={String(a.workplace_id)}>{a.name}</MenuItem>
                    ))}
                </Select>
            </Box>
            <Box>
                <Typography variant="caption" color="text.secondary">Kategorie</Typography>
                <Select
                    multiple
                    fullWidth
                    value={form.categories}
                    onChange={(e) => setForm((f) => ({ ...f, categories: e.target.value as string[] }))}
                    input={<OutlinedInput size="small" />}
                    renderValue={(selected) =>
                        (selected as string[]).map((v) => categoryMap[v] ?? v).join(', ')
                    }
                >
                    {categoryOptions.map((c) => (
                        <MenuItem key={c.category_id} value={String(c.category_id)}>{c.name}</MenuItem>
                    ))}
                </Select>
            </Box>
            <TextField
                label="Začátek směny (HH:MM)"
                value={form.preferred_service_start}
                onChange={(e) => setForm((f) => ({ ...f, preferred_service_start: e.target.value }))}
                placeholder="08:00"
                fullWidth
            />
        </DialogContent>
    )

    return (
        <Fade in timeout={{ enter: 500 }}>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Zaměstnanci</Typography>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={openAdd}
                        sx={{ background: 'linear-gradient(to right, #6A11CB, #2575FC)' }}
                    >
                        Přidat zaměstnance
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
                                    <TableCell>ID</TableCell>
                                    <TableCell>Jméno</TableCell>
                                    <TableCell>Pracoviště</TableCell>
                                    <TableCell>Kategorie</TableCell>
                                    <TableCell align="right">Akce</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedDoctors.map((doctor) => (
                                    <TableRow key={doctor.id} hover>
                                        <TableCell>{doctor.doctor_id}</TableCell>
                                        <TableCell>{doctor.name}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                                {doctor.workplace_id.map((w) => (
                                                    <Tooltip key={w} title={workplaceMap[w] ?? w}>
                                                        <Chip label={w} size="small" />
                                                    </Tooltip>
                                                ))}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                                {doctor.categories?.length ? (
                                                    doctor.categories.map((c) => (
                                                        <Tooltip key={c} title={categoryMap[c] ?? c}>
                                                            <Chip label={c} size="small" variant="outlined" />
                                                        </Tooltip>
                                                    ))
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary">—</Typography>
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Upravit">
                                                <IconButton onClick={() => openEdit(doctor)}>
                                                    <Edit />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Smazat">
                                                <IconButton color="error" onClick={() => setDeleteTarget(doctor)}>
                                                    <Delete />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {!sortedDoctors.length && (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            <Typography variant="body2" color="text.secondary">
                                                Žádní zaměstnanci nenalezeni
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {/* Add dialog */}
                <Dialog open={addOpen} onClose={() => setAddOpen(false)} fullWidth maxWidth="xs">
                    <DialogTitle>Přidat zaměstnance</DialogTitle>
                    {DoctorFormFields}
                    <DialogActions>
                        <Button onClick={() => setAddOpen(false)}>Zrušit</Button>
                        <Button variant="contained" onClick={handleAdd} disabled={!isFormValid || isSubmitting}>
                            {isCreating ? <CircularProgress size={20} /> : 'Přidat'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Edit dialog */}
                <Dialog open={!!editTarget} onClose={() => setEditTarget(null)} fullWidth maxWidth="xs">
                    <DialogTitle>Upravit zaměstnance</DialogTitle>
                    {DoctorFormFields}
                    <DialogActions>
                        <Button onClick={() => setEditTarget(null)}>Zrušit</Button>
                        <Button variant="contained" onClick={handleEdit} disabled={!isFormValid || isSubmitting}>
                            {isUpdating ? <CircularProgress size={20} /> : 'Uložit'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Delete confirm */}
                <ConfirmDialog
                    open={!!deleteTarget}
                    title="Smazat zaměstnance"
                    description={`Opravdu chcete smazat zaměstnance "${deleteTarget?.name}"?`}
                    onConfirm={handleDelete}
                    onClose={() => setDeleteTarget(null)}
                />
            </Box>
        </Fade>
    )
}

export default AdministrationEmployees
