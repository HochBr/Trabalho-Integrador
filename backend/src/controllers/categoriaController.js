import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Grid, Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow, IconButton, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// Componente de paginação customizado (mesmo que antes)
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

const CadastroCategoria = () => {
  const [categorias, setCategorias] = useState([]);
  const [formValues, setFormValues] = useState({ Nome_Categoria: '' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editValues, setEditValues] = useState({ id: null, nome: '' });

  useEffect(() => {
    listarCategorias();
  }, []);

  const listarCategorias = async () => {
    try {
      const response = await axios.get('http://localhost:3001/categoria');
      setCategorias(response.data);
    } catch (error) {
      console.error('Erro ao listar categorias:', error);
    }
  };

  const excluirCategoria = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/categoria/${id}`);
      listarCategorias();
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
    }
  };

  const abrirEditarDialog = (categoria) => {
    setEditValues({ id: categoria.id, nome: categoria.nome });
    setEditDialogOpen(true);
  };

  const editarCategoria = async () => {
    try {
      await axios.put(`http://localhost:3001/categoria/${editValues.id}`, {
        nome: editValues.nome,
      });
      setEditDialogOpen(false);
      listarCategorias();
    } catch (error) {
      console.error('Erro ao editar categoria:', error);
    }
  };

  const handleChangeEditInput = (event) => {
    const { value } = event.target;
    setEditValues((prev) => ({ ...prev, nome: value }));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Cadastro de Categorias
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Nome da Categoria"
            name="Nome_Categoria"
            value={formValues.Nome_Categoria}
            onChange={(e) =>
              setFormValues({ ...formValues, Nome_Categoria: e.target.value })
            }
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={async () => {
              try {
                await axios.post('http://localhost:3001/categoria', {
                  nome: formValues.Nome_Categoria,
                });
                listarCategorias();
              } catch (error) {
                console.error('Erro ao cadastrar categoria:', error);
              }
            }}
          >
            Cadastrar
          </Button>
        </Grid>
      </Grid>
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableBody>
            {categorias.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((categoria) => (
              <TableRow key={categoria.id}>
                <TableCell>{categoria.id}</TableCell>
                <TableCell>{categoria.nome}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => abrirEditarDialog(categoria)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => excluirCategoria(categoria.id)}
                    color="error"
                  >
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
                colSpan={3}
                count={categorias.length}
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

      {/* Dialog para editar */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Editar Categoria</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nome da Categoria"
            value={editValues.nome}
            onChange={handleChangeEditInput}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={editarCategoria} color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CadastroCategoria;
