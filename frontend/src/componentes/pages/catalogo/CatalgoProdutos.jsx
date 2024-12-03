import React, { useState } from 'react';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import {  Box,Grid,Button,Typography,Paper,Table,TableBody,TableCell,TableContainer,TableFooter,TablePagination,TableRow,IconButton,TextField,} from '@mui/material';
import { styled } from '@mui/material/styles';
import ListAltIcon from '@mui/icons-material/ListAlt';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import AddIcon from '@mui/icons-material/Add';
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

const CatalogoProdutos = () => {
  const [produto, setproduto] = useState([]);
  const [formValues, setFormValues] = useState({ Nome_produto: '' });
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [errors, setErrors] = useState({});
  const [isTableVisible, setIsTableVisible] = useState(false); // Novo estado para controlar a visibilidade da tabela

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

  const handleSubmit = async () => {
    if (!formValues.Nome_produto.trim()) {
      setErrors({ Nome_produto: 'Campo obrigatório!' });
      return;
    }

    try {
      if (editId) {
        await axios.put(`http://localhost:3001/produto/${editId}`, {
          nome: formValues.Nome_produto,
        });
        setEditId(null);
      }

      setFormValues({ Nome_produto: '' });
      listarProdutos();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    }
  };

  const handleEdit = (id, nome) => {
    setEditId(id);
    setFormValues({ Nome_produto: nome });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/produto/${id}`);
      listarProdutos();
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const toggleTableVisibility = () => {
    setIsTableVisible((prevState) => !prevState);
    if (!isTableVisible) {
      listarProdutos();
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
                <FormGrid>
                  <Typography variant="h6">{editId ? 'Editar produto' : 'Cadastrar Nova produto'}</Typography>
                  <TextField
                    label="Nome da produto"
                    name="Nome_produto"
                    value={formValues.Nome_produto}
                    onChange={handleInputChange}
                    error={!!errors.Nome_produto}
                    helperText={errors.Nome_produto}
                  />
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleSubmit}
                    color="primary"
                    sx={{ mt: 2 }}
                  >
                    {editId ? 'Atualizar' : 'Cadastrar'}
                  </Button>
                </FormGrid>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  startIcon={<ListAltIcon />}
                  onClick={toggleTableVisibility}
                  color="secondary"
                >
                  {isTableVisible ? 'Ocultar Tabela' : 'Abrir Tabela'}
                </Button>
              </Grid>
            </Grid>
            {isTableVisible && ( // Renderiza a tabela apenas se estiver visível
              <TableContainer component={Paper} sx={{ mt: 4 }}>
                <Table sx={{ minWidth: 500 }} aria-label="Tabela de produto">
                  <TableBody>
                    {(rowsPerPage > 0
                      ? produto.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      : produto
                    ).map((produto) => (
                      <TableRow key={produto.id}>
                        <TableCell>{produto.id}</TableCell>
                        <TableCell>{produto.nome}</TableCell>
                        <TableCell>{produto.produtoID}</TableCell>
                        <TableCell>{produto.fornecedorCNPJ}</TableCell>
                        <TableCell>{produto.marca}</TableCell>
                        <TableCell>{produto.valor}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleEdit(produto.id, produto.nome)} color="primary">
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(produto.id)} color="secondary">
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
                        colSpan={3}
                        count={produto.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
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
    </div>
  );
};

export default CatalogoProdutos;
