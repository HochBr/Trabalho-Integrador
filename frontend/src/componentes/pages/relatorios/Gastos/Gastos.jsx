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
import Navbar from '../../TelaGeral/Navbar.jsx'
import Sidernav from '../../TelaGeral/Sidernav.jsx';

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

const RelatorioGastos = () => {
  const [gastos, setGastos] = useState([]);
  const [formValues, setFormValues] = useState({
    ID_Compra: '',
    Data_Compra: '',
    Data_Vencimento: '',
    Nome_Produto: '',
    Nome_Fornecedor: '',
    Quantidade: '',
    Preco_Compra: '',
    Total: '',
  });
  const [editID_Compra, setEditID_Compra] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [errors, setErrors] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Estados para Snackbar
  const [snackbarEditOpen, setSnackbarEditOpen] = useState(false);
  const [snackbarDeleteOpen, setSnackbarDeleteOpen] = useState(false);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - gastos.length) : 0;

  useEffect(() => {
    listargastos();
  }, []);

  const handleDialogClose = () => {
    setEditID_Compra(null);
    setFormValues({ ID_Compra: '', Data_Compra: '', endereco: '', Nome_Fornecedor: '', Quantidade: '' });
    setIsDialogOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
  }

  const handleEdit = (ID_Compra, nome, endereco, Nome_Fornecedor, Quantidade) => {
    setEditID_Compra(ID_Compra);
    setFormValues({ ID_Compra, Data_Compra: nome, endereco, Nome_Fornecedor, Quantidade });
    setIsDialogOpen(true);
  };

  const listargastos = async () => {
    try {
      const response = await axios.get('http://localhost:3001/aquisicao'); // Endpoint ajustado
      setGastos(response.data);
    } catch (error) {
      console.error('Erro ao listar aquisições:', error);
    }
  };
  
  const handleDialogSubmit = async () => {
    // Validação de campos obrigatórios
    if (!formValues.dtcompra || !formValues.idproduto || !formValues.quantidade || !formValues.precocompra) {
      setErrors({
        dtcompra: !formValues.dtcompra && 'Campo obrigatório!',
        idproduto: !formValues.idproduto && 'Campo obrigatório!',
        quantidade: !formValues.quantidade && 'Campo obrigatório!',
        precocompra: !formValues.precocompra && 'Campo obrigatório!',
      });
      return;
    }
  
    try {
      if (editID_Compra) {
        // Editar aquisição
        await axios.put(`http://localhost:3001/aquisicao/${editID_Compra}`, {
          dtcompra: formValues.dtcompra,
          idproduto: formValues.idproduto,
          quantidade: formValues.quantidade,
          precocompra: formValues.precocompra,
          vencimento: formValues.vencimento,
        });
      } else {
        // Adicionar nova aquisição
        await axios.post('http://localhost:3001/aquisicao', {
          dtcompra: formValues.dtcompra,
          idproduto: formValues.idproduto,
          quantidade: formValues.quantidade,
          precocompra: formValues.precocompra,
          vencimento: formValues.vencimento,
        });
      }
  
      handleDialogClose();
      listargastos();
      setSnackbarEditOpen(true);
    } catch (error) {
      console.error('Erro ao salvar aquisição:', error);
      alert('Erro ao salvar a aquisição. Por favor, tente novamente.');
    }
  };
  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/aquisicao/${id}`);
      listargastos();
      setSnackbarDeleteOpen(true);
    } catch (error) {
      console.error('Erro ao excluir aquisição:', error);
      alert('Erro ao excluir a aquisição. Por favor, tente novamente.');
    }
  };
  
  return (
    <div>
      <Navbar />
      <Box sx={{ display: 'flex' }}>
        <Sidernav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Catálogo de gastos
          </Typography>
          <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table>
            <TableHead>
  <TableRow>
    <TableCell>ID</TableCell>
    <TableCell>Data da Compra</TableCell>
    <TableCell>Produto</TableCell>
    <TableCell>Fornecedor</TableCell>
    <TableCell>Quantidade</TableCell>
    <TableCell>Preço</TableCell>
    <TableCell>Vencimento</TableCell>
    <TableCell>Total</TableCell>
    <TableCell>Ações</TableCell>
  </TableRow>
</TableHead>
<TableBody>
  {gastos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((gasto) => (
    <TableRow key={gasto.id}>
      <TableCell>{gasto.id}</TableCell>
      <TableCell>{gasto.dtcompra}</TableCell>
      <TableCell>{gasto.produto}</TableCell>
      <TableCell>{gasto.fornecedor}</TableCell>
      <TableCell>{gasto.quantidade}</TableCell>
      <TableCell>{gasto.precocompra}</TableCell>
      <TableCell>{gasto.vencimento}</TableCell>
      <TableCell>{gasto.total}</TableCell>
      <TableCell>
        <IconButton onClick={() => handleEdit(gasto.id, gasto)} color="primary">
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => handleDelete(gasto.id)} color="secondary">
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
                    count={gastos.length}
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
        <DialogTitle>Editar Fornecedor</DialogTitle>
        <img></img>
        <DialogContent>
          <TextField
            margin="dense"
            label="ID_Compra"
            name="ID_Compra"
            type="number"
            value={formValues.ID_Compra}
            onChange={handleInputChange}
            fullWidth
            disabled
          />
          <TextField
            margin="dense"
            label="Nome do Fornecedor"
            name="Data_Compra"
            value={formValues.Data_Compra}
            onChange={handleInputChange}
            fullWidth
            error={!!errors.Data_Compra}
            helperText={errors.Data_Compra}
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
            label="Nome_Fornecedor"
            name="Nome_Fornecedor"
            value={formValues.Nome_Fornecedor}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Quantidade"
            name="Quantidade"
            value={formValues.Quantidade}
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
        <Alert onClose={() => setSnackbarDeleteOpen(false)} severity="success" sx={{ width: '100%' }}>
          Fornecedor excluído com sucesso!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default RelatorioGastos;
