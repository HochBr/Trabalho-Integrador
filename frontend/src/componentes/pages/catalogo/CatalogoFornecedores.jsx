import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import {
  Box, Grid, Button, Typography, Paper,
  Table, TableBody, TableCell, TableContainer,
  TableFooter, TablePagination, TableRow, IconButton,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions, TableHead,
  Snackbar, Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage as LastPageIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import Navbar from '../TelaGeral/Navbar.jsx';
import Sidernav from '../TelaGeral/Sidernav.jsx';

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '16px',
}));

function TablePaginationActions({ count, page, rowsPerPage, onPageChange }) {
  const theme = useTheme();

  const handleFirstPageButtonClick = (event) => onPageChange(event, 0);
  const handleBackButtonClick = (event) => onPageChange(event, page - 1);
  const handleNextButtonClick = (event) => onPageChange(event, page + 1);
  const handleLastPageButtonClick = (event) =>
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
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

const CatalogoFornecedores = () => {
  const [fornecedores, setFornecedores] = useState([]);
  const [formValues, setFormValues] = useState({
    cnpj: '',
    Nome_Fornecedor: '',
    endereco: '',
    email: '',
    telefone: ''
  });
  const [editCnpj, setEditCnpj] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [errors, setErrors] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Estados para Snackbar
  const [snackbarEditOpen, setSnackbarEditOpen] = useState(false);
  const [snackbarDeleteOpen, setSnackbarDeleteOpen] = useState(false);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - fornecedores.length) : 0;

  useEffect(() => {
    listarFornecedores();
  }, []);

  const listarFornecedores = async () => {
    try { 
      const response = await axios.get('http://localhost:3001/fornecedor', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setFornecedores(response.data);
    } catch (error) {
      console.error('Erro ao listar fornecedores:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
  };

  const handleEdit = (cnpj, nome, endereco, email, telefone) => {
    setEditCnpj(cnpj);
    setFormValues({ cnpj, Nome_Fornecedor: nome, endereco, email, telefone });
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setEditCnpj(null);
    setFormValues({ cnpj: '', Nome_Fornecedor: '', endereco: '', email: '', telefone: '' });
    setIsDialogOpen(false);
  };

  const handleDialogSubmit = async () => {
    if (!formValues.Nome_Fornecedor.trim()) {
      setErrors({ Nome_Fornecedor: 'Campo obrigatório!' });
      return;
    }

    try {
      await axios.put(`http://localhost:3001/fornecedor/${editCnpj}`, {
        cnpj: formValues.cnpj,
        nome: formValues.Nome_Fornecedor,
        endereco: formValues.endereco,
        email: formValues.email || null,
        telefone: formValues.telefone || null,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      handleDialogClose();
      listarFornecedores();
      setSnackbarEditOpen(true); // Abrir Snackbar para sucesso de edição
    } catch (error) {
      console.error('Erro ao editar fornecedor:', error);
      alert('Erro ao atualizar o fornecedor. Por favor, tente novamente.');
    }
  };

  const handleDelete = async (cnpj) => {
    try {
      await axios.delete(`http://localhost:3001/fornecedor/${cnpj}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      listarFornecedores();
      setSnackbarDeleteOpen(true); // Abrir Snackbar para sucesso de exclusão
    } catch (error) {
      console.error('Erro ao excluir fornecedor:', error);
      alert('Erro ao excluir o fornecedor. Por favor, tente novamente.');
    }
  };

  return (
    <div>
      <Navbar />
      <Box sx={{ display: 'flex' }}>
        <Sidernav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Typography variant="h4" gutterBottom mt={8}>
            Catálogo de Fornecedores
          </Typography>
          {/* Tabela */}
          <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {/* Nome das Colunas */}
                  <TableCell>CNPJ</TableCell>
                  <TableCell>Nome</TableCell>
                  <TableCell>Endereço</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Telefone</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Conteudo*/}
                {(rowsPerPage > 0
                  ? fornecedores.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : fornecedores
                ).map((fornecedor) => (
                  <TableRow key={fornecedor.cnpj}>
                    <TableCell>{fornecedor.cnpj}</TableCell>
                    <TableCell>{fornecedor.nome}</TableCell>
                    <TableCell>{fornecedor.endereco}</TableCell>
                    <TableCell>{fornecedor.email}</TableCell>
                    <TableCell>{fornecedor.telefone || 'N/A'}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() =>
                          handleEdit(fornecedor.cnpj, fornecedor.nome, fornecedor.endereco, fornecedor.email, fornecedor.telefone)
                        }
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(fornecedor.cnpj)} color="secondary">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    count={fornecedores.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {/* Diálogo para edição */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
      <Typography variant="h6" fontWeight="bold">
        Editar Fornecedor
      </Typography>
    </Box>
        </DialogTitle>

        <DialogContent>
          <TextField
            margin="dense"
            label="CNPJ"
            name="cnpj"
            type="number"
            value={formValues.cnpj}
            onChange={handleInputChange}
            fullWidth
            disabled
          />
          <TextField
            margin="dense"
            label="Nome do Fornecedor"
            name="Nome_Fornecedor"
            value={formValues.Nome_Fornecedor}
            onChange={handleInputChange}
            fullWidth
            error={!!errors.Nome_Fornecedor}
            helperText={errors.Nome_Fornecedor}
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
            label="Email"
            name="email"
            value={formValues.email}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Telefone"
            name="telefone"
            value={formValues.telefone}
            onChange={handleInputChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleDialogSubmit} color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para sucesso de edição */} 
      <Snackbar
        open={snackbarEditOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarEditOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={() => setSnackbarEditOpen(false)} severity="success" sx={{ width: '100%' }}>
          Fornecedor editado com sucesso!
        </Alert>
      </Snackbar>

      {/* Snackbar para sucesso de exclusão */}
      <Snackbar
        open={snackbarDeleteOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarDeleteOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={() => setSnackbarDeleteOpen(false)} severity="error" sx={{ width: '100%' }}>
          Fornecedor excluído com sucesso!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CatalogoFornecedores;
