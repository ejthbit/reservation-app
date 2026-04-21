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
    Switch,
} from '@mui/material'
import { format } from 'date-fns'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { useAnnouncements } from '../../../hooks'
import { useUser } from '../../../context/User/UserProvider'
import { Announcement } from '../../../types/Announcement'
import { getDateWithCorrectOffset } from '../../../utils'
import ConfirmDialog from '../../common/ConfirmDialog'

type AnnouncementForm = {
    name: string
    description: string
}

const emptyForm = (): AnnouncementForm => ({ name: '', description: '' })

const AdministrationNews = () => {
    const { email } = useUser()
    const { enqueueSnackbar } = useSnackbar()
    const {
        announcements,
        isFetchingAnnouncements,
        createAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
    } = useAnnouncements()

    const [addOpen, setAddOpen] = useState(false)
    const [editTarget, setEditTarget] = useState<Announcement | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null)
    const [form, setForm] = useState<AnnouncementForm>(emptyForm())

    const openAdd = () => {
        setForm(emptyForm())
        setAddOpen(true)
    }

    const openEdit = (announcement: Announcement) => {
        setForm({
            name: announcement.name,
            description: announcement.description ?? '',
        })
        setEditTarget(announcement)
    }

    const closeDialog = () => {
        setAddOpen(false)
        setEditTarget(null)
        setForm(emptyForm())
    }

    const handleAdd = async () => {
        await createAnnouncement(
            { name: form.name, description: form.description, author: email ?? '', enabled: false },
            () => setAddOpen(false),
        )
    }

    const handleEdit = async () => {
        if (!editTarget) return
        await updateAnnouncement(
            {
                ...editTarget,
                name: form.name,
                description: form.description,
                author: email ?? '',
            },
            () => setEditTarget(null),
        )
    }

    const handleDelete = async () => {
        if (!deleteTarget?.id) return
        await deleteAnnouncement(deleteTarget.id)
        setDeleteTarget(null)
    }

    const handleToggleEnabled = async (announcement: Announcement) => {
        await updateAnnouncement({ ...announcement, enabled: !announcement.enabled, author: email ?? '' })
    }

    const isFormValid = form.name.trim().length > 0 && form.description.trim().length > 0
    const isDialogOpen = addOpen || !!editTarget

    const FormFields = (
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '12px !important' }}>
            <TextField
                label="Název"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
                fullWidth
            />
            <TextField
                label="Text"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                required
                fullWidth
                multiline
                rows={4}
            />
        </DialogContent>
    )

    return (
        <Fade in timeout={{ enter: 500 }}>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Oznámení</Typography>
                    <Button variant="contained" startIcon={<Add />} onClick={openAdd}>
                        Přidat oznámení
                    </Button>
                </Box>

                {isFetchingAnnouncements ? (
                    <Box display="flex" justifyContent="center" mt={4}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableContainer component={Paper} variant="outlined">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Název</TableCell>
                                    <TableCell>Text</TableCell>
                                    <TableCell>Autor</TableCell>
                                    <TableCell>Vytvořeno</TableCell>
                                    <TableCell>Stav</TableCell>
                                    <TableCell align="right">Akce</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {announcements?.map((announcement) => (
                                    <TableRow key={announcement.id} hover>
                                        <TableCell>{announcement.name}</TableCell>
                                        <TableCell
                                            sx={{
                                                maxWidth: 300,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {announcement.description ?? '—'}
                                        </TableCell>
                                        <TableCell>{announcement.author ?? '—'}</TableCell>
                                        <TableCell>
                                            {announcement.created_at
                                                ? format(
                                                      getDateWithCorrectOffset(announcement.created_at),
                                                      'dd.MM.yyyy',
                                                  )
                                                : '—'}
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip title={announcement.enabled ? 'Vypnout' : 'Zapnout'}>
                                                <Switch
                                                    size="small"
                                                    checked={announcement.enabled}
                                                    onChange={() => handleToggleEnabled(announcement)}
                                                />
                                            </Tooltip>
                                            <Chip
                                                label={announcement.enabled ? 'Aktivní' : 'Neaktivní'}
                                                size="small"
                                                color={announcement.enabled ? 'success' : 'default'}
                                                variant="outlined"
                                                sx={{ ml: 1 }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Upravit">
                                                <IconButton onClick={() => openEdit(announcement)}>
                                                    <Edit />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Smazat">
                                                <IconButton
                                                    color="error"
                                                    onClick={() => setDeleteTarget(announcement)}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {!announcements?.length && (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            <Typography variant="body2" color="text.secondary">
                                                Žádná oznámení nenalezena
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                <Dialog open={isDialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
                    <DialogTitle>{editTarget ? 'Upravit oznámení' : 'Přidat oznámení'}</DialogTitle>
                    {FormFields}
                    <DialogActions>
                        <Button onClick={closeDialog}>Zrušit</Button>
                        <Button
                            variant="contained"
                            onClick={editTarget ? handleEdit : handleAdd}
                            disabled={!isFormValid}
                        >
                            {editTarget ? 'Uložit' : 'Přidat'}
                        </Button>
                    </DialogActions>
                </Dialog>

                <ConfirmDialog
                    open={!!deleteTarget}
                    title="Smazat oznámení"
                    description={`Opravdu chcete smazat oznámení "${deleteTarget?.name}"?`}
                    onConfirm={handleDelete}
                    onClose={() => setDeleteTarget(null)}
                />
            </Box>
        </Fade>
    )
}

export default AdministrationNews
