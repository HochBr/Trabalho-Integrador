import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import {
  Box, Grid, Button, Typography, Paper,
  Table, TableBody, TableCell, TableContainer,
  TableFooter, TablePagination, TableRow, IconButton,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions, TableHead,
  Select, MenuItem
} from '@mui/material';
import Navbar from '../TelaGeral/Navbar.jsx';
import Sidernav from '../TelaGeral/Sidernav.jsx';
import ListAltIcon from '@mui/icons-material/ListAlt';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import foto from '../TelaGeral/assets/Geomar.png';

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
  const [produto, setProduto] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [formValues, setFormValues] = useState({
    Nome_produto: '',
    marca: '',
    valor: '',
    CategoriaID: '',
    fornecedorCNPJ: '',
    estoque: '',
  });
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [errors, setErrors] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    listarProdutos();
    listarCategorias();
  }, []);

  const listarProdutos = async () => {
    try {
      const response = await axios.get('http://localhost:3001/produto');
      setProduto(response.data);
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
    }
  };

  const listarCategorias = async () => {
    try {
      const response = await axios.get('http://localhost:3001/categoria');
      setCategorias(response.data);
    } catch (error) {
      console.error('Erro ao listar categorias:', error);
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

  const handleEdit = (id, nome, marca, valor, CategoriaID, fornecedorCNPJ, estoque) => {
    setEditId(id);
    setFormValues({
      Nome_produto: nome,
      marca,
      valor,
      CategoriaID,
      fornecedorCNPJ,
      estoque,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await axios.delete(`http://localhost:3001/produto/${id}`);
        listarProdutos();
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
        alert('Erro ao excluir o produto.');
      }
    }
  };

  const handleDialogClose = () => {
    setEditId(null);
    setFormValues({ Nome_produto: '', marca: '', valor: '', CategoriaID: '', fornecedorCNPJ: '', estoque: '' });
    setIsDialogOpen(false);
  };

  const handleDialogSubmit = async () => {
    if (!formValues.Nome_produto.trim()) {
      setErrors({ Nome_produto: 'Campo obrigatório!' });
      return;
    }
    try {
      await axios.put(`http://localhost:3001/produto/${editId}`, {
        nome: formValues.Nome_produto,
        marca: formValues.marca,
        valor: formValues.valor,
        CategoriaID: formValues.CategoriaID || null,
        fornecedorCNPJ: formValues.fornecedorCNPJ || null,
        estoque: formValues.estoque || null,
      });
      handleDialogClose();
      listarProdutos();
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      alert('Erro ao atualizar o produto.');
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
              Catálogo de Produtos
            </Typography>
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
                    <TableCell>Estoque</TableCell>
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
                      <TableCell>{prod.estoque || '0'}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleEdit(prod.id, prod.nome, prod.marca, prod.valor, prod.categoria, prod.fornecedorCNPJ, prod.estoque)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(prod.id)} color="secondary">
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
                      colSpan={8}
                      count={produto.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={(event, newPage) => setPage(newPage)}
                      onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
                      ActionsComponent={TablePaginationActions}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Box>
          <Dialog open={isDialogOpen} onClose={handleDialogClose}>
          <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6">Editar Produto</Typography>
                <img src={foto} alt="Produto" style={{ borderRadius: '8px' }} width={50} />
              </Box>
            </DialogTitle>
            
            <DialogContent>
              <TextField
                margin="dense"
                label="Nome"
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
                value={formValues.valor}
                onChange={handleInputChange}
                fullWidth
              />
              <Select
                margin="dense"
                label="Categoria"
                
                name="CategoriaID"
                value={formValues.CategoriaID}
                onChange={handleInputChange}
                fullWidth
              >
                {categorias.map((categoria) => (
                  <MenuItem key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </MenuItem>
                ))}
              </Select>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose}>Cancelar</Button>
              <Button onClick={handleDialogSubmit} color="primary">
                Salvar
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </div>
  );
};

export default CatalogoProdutos;
