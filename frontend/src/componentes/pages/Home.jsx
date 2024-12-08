import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import {
  Box, Grid, Button, Typography, Paper,
  Table, TableBody, TableCell, TableContainer,
  TableFooter, TablePagination, TableRow, IconButton,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions, TableHead,
} from '@mui/material';
import Navbar from './TelaGeral/Navbar.jsx';
import Sidernav from './TelaGeral/Sidernav.jsx';
import {
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage as LastPageIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import foto from './TelaGeral/assets/gian.png';

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => onPageChange(event, 0);
  const handleBackButtonClick = (event) => onPageChange(event, page - 1);
  const handleNextButtonClick = (event) => onPageChange(event, page + 1);
  const handleLastPageButtonClick = (event) =>
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

const Home = () => {
  const [cliente, setCliente] = useState([]);
  const [formValues, setFormValues] = useState({
    nome: '',
    endereco: '',
    saldo: '',
    contato: '',
  });
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [errors, setErrors] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    listarClientes();
  }, []);

  const listarClientes = async () => {
    try {
      const response = await axios.get('http://localhost:3001/cliente', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCliente(response.data);
    } catch (error) {
      console.error('Erro ao listar clientes:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
  };

  const handleEdit = (id, nome, endereco, saldo, contato) => {
    setEditId(id);
    setFormValues({ nome, endereco, saldo, contato });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await axios.delete(`http://localhost:3001/cliente/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        listarClientes();
      } catch (error) {
        console.error('Erro ao excluir cliente:', error);
        alert('Erro ao excluir o cliente.');
      }
    }
  };

  const handleDialogClose = () => {
    setEditId(null);
    setFormValues({ nome: '', endereco: '', saldo: '', contato: '' });
    setIsDialogOpen(false);
  };

  const handleDialogSubmit = async () => {
    if (!formValues.nome.trim()) {
      setErrors({ nome: 'Campo obrigatório!' });
      return;
    }
    try {
      await axios.put(`http://localhost:3001/cliente/${editId}`, formValues);
      handleDialogClose();
      listarClientes();
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      alert('Erro ao atualizar o cliente.');
    }
  };

  return (
    <div>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Navbar />
        <Box sx={{ display: 'flex', flexGrow: 1 }}>
          <Sidernav />
          {/* Título no canto superior direito */}
          <Typography
            variant="h4"
            fontWeight="bold"
            mt={8}
            sx={{
              alignSelf: 'flex-start',
              mb: 2,
            }}
          >
          Transportes Botezini Ltda.
          </Typography>
          <Box sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>


            {/* Tabela no lado direito */}
            <Box sx={{ alignSelf: 'flex-end', width: '100%' }}>
              <Typography
                variant='h6'
                fontWeight= "bold"
                mt={6}
              >Lista de Devedores💀</Typography>
              <TableContainer component={Paper} sx={{ mt: 1 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Nome</TableCell>
                      <TableCell>Endereço</TableCell>
                      <TableCell>Saldo</TableCell>
                      <TableCell>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(rowsPerPage > 0
                      ? cliente.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      : cliente
                    ).map((cli) => (
                      <TableRow key={cli.id}>
                        <TableCell>{cli.id}</TableCell>
                        <TableCell>{cli.nome}</TableCell>
                        <TableCell>{cli.endereco}</TableCell>
                        <TableCell>{cli.saldo}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleEdit(cli.id, cli.nome, cli.endereco, cli.saldo, cli.contato)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(cli.id)} color="secondary">
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        colSpan={5}
                        count={cliente.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={(event, newPage) => setPage(newPage)}
                        onRowsPerPageChange={(event) =>
                          setRowsPerPage(parseInt(event.target.value, 10))
                        }
                        ActionsComponent={TablePaginationActions}
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </Box>
      </Box>

          <Dialog open={isDialogOpen} onClose={handleDialogClose} fullWidth maxWidth="sm">
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Editar cliente
                </Typography>
                <img
                  src={foto}
                  alt="cliente"
                  style={{ borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}
                  width={50}
                />
              </Box>
            </DialogTitle>

            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  margin="dense"
                  label="Nome"
                  name="nome"
                  value={formValues.nome}
                  onChange={handleInputChange}
                  fullWidth
                  error={!!errors.nome}
                  helperText={errors.nome}
                />
                <TextField
                  margin="dense"
                  label="Endereço"
                  name="endereco"
                  value={formValues.endereco}
                  onChange={handleInputChange}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  label="Saldo"
                  name="saldo"
                  value={formValues.saldo}
                  onChange={handleInputChange}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  label="Contato"
                  name="contato"
                  value={formValues.contato}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Box>
            </DialogContent>

            <DialogActions sx={{ justifyContent: 'flex-end', p: 2 }}>
              <Button onClick={handleDialogClose} color="error" variant="outlined">
                Cancelar
              </Button>
              <Button onClick={handleDialogSubmit} color="primary" variant="contained">
                Salvar
              </Button>
            </DialogActions>
          </Dialog>

    </div>
  );
};

export default Home;
