import React, { useState } from 'react';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { 
  Box, Grid, Button, Typography, Paper, 
  Table, TableBody, TableCell, TableContainer, 
  TableFooter, TablePagination, TableRow, IconButton, 
  TextField, Dialog, DialogTitle, DialogContent, DialogActions, TableHead 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ListAltIcon from '@mui/icons-material/ListAlt';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Navbar from '../TelaGeral/Navbar.jsx';
import Sidernav from '../TelaGeral/Sidernav.jsx';

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '16px',
}));

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton onClick={handleNextButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="next page">
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton onClick={handleLastPageButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="last page">
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

const CatalogoProdutos = () => {
  const [produto, setproduto] = useState([]);
  const [formValues, setFormValues] = useState({ Nome_produto: '', marca: '', valor: '' });
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [errors, setErrors] = useState({});
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Novo estado para o diálogo

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - produto.length) : 0;

  const listarProdutos = async () => {
    try {
      const response = await axios.get('http://localhost:3001/produto');
      setproduto(response.data);
    } catch (error) {
      console.error('Erro ao listar produto:', error);
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

  const handleEdit = (id, nome, marca, valor, CategoriaID, fornecedorCNPJ) => {
    setEditId(id);
    setFormValues({
      Nome_produto: nome,
      marca,
      valor,
      CategoriaID ,
      fornecedorCNPJ,
    });
    setIsDialogOpen(true); // Abre o diálogo
  };
  

  const handleDialogClose = () => {
    setEditId(null);
    setFormValues({ Nome_produto: '', marca: '', valor: '' });
    setIsDialogOpen(false); // Fecha o diálogo
  };

  const handleDialogSubmit = async () => {
    // Validação de campos obrigatórios
    if (!formValues.Nome_produto.trim()) {
      setErrors({ Nome_produto: 'Campo obrigatório!' });
      return; 
    }
  
    try {
      // Requisição PUT para atualizar o produto no backend
      await axios.put(`http://localhost:3001/produto/${editId}`, {
        nome: formValues.Nome_produto,
        valor: formValues.valor,
        marca: formValues.marca,
        CategoriaID: formValues.CategoriaID || null,
        fornecedorCNPJ: formValues.fornecedorCNPJ || null,
      });
  
      // Fecha o diálogo após atualizar e recarrega a lista de produtos
      handleDialogClose();
      listarProdutos();
    } catch (error) {
      console.error('Erro ao editar produto:', error);
      alert('Erro ao atualizar o produto. Por favor, tente novamente.');
    }
  };
  

  return (
    <div>
      <Navbar />
      <Box sx={{ display: 'flex' }}>
        <Sidernav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Box sx={{ mt: 8, width: '100%' }}>
            <Typography variant="h4" gutterBottom>
              Catalogo de Produtos
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  startIcon={<ListAltIcon />}
                  onClick={() => {
                    setIsTableVisible(!isTableVisible);
                    listarProdutos();
                  }}
                  color="secondary"
                >
                  {isTableVisible ? 'Ocultar Tabela' : 'Abrir Tabela'}
                </Button>
              </Grid>
            </Grid>
            {isTableVisible && (
              <TableContainer component={Paper} sx={{ mt: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Nome</TableCell>
                    <TableCell>Marca</TableCell>
                    <TableCell>Valor</TableCell>
                    <TableCell>Fornecedor (CNPJ)</TableCell>
                    <TableCell>Categoria</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? produto.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : produto
                  ).map((prod) => (
                    <TableRow key={prod.id}>
                      <TableCell>{prod.id}</TableCell>
                      <TableCell>{prod.nome}</TableCell>
                      <TableCell>{prod.marca}</TableCell>
                      <TableCell>{prod.valor}</TableCell>
                      <TableCell>{prod.fornecedorCNPJ || 'N/A'}</TableCell>
                      <TableCell>{prod.categoria || 'N/A'}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleEdit(prod.id, prod.nome, prod.marca, prod.valor, prod.categoria, prod.fornecedorCNPJ)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => console.log('Deletar')} color="secondary">
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
                      count={produto.length}
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
            
            )}
          </Box>
        </Box>
      </Box>

      {/* Diálogo para edição */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Editar Produto</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nome do Produto"
            name="Nome_produto"
            value={formValues.Nome_produto}
            onChange={handleInputChange}
            fullWidth
            error={!!errors.Nome_produto}
            helperText={errors.Nome_produto}
          />
          <TextField
            margin="dense"
            label="Marca"
            name="marca"
            value={formValues.marca}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField

            margin="dense"
            label="Valor"
            name="valor"
            type="number"
            value={formValues.valor}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Categoria"
            name="CategoriaID"
            value={formValues.CategoriaID}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Fornecedor (CNPJ)"
            name="fornecedorCNPJ"
            value={formValues.fornecedorCNPJ}
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
    </div>
  );
};

export default CatalogoProdutos;
