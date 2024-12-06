import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidernav from '../TelaGeral/Sidernav.jsx';
import Navbar from '../TelaGeral/Navbar.jsx';
import {
  Box,
  FormLabel,
  OutlinedInput,
  Grid,
  Select,
  Button,
  Typography,
  IconButton,
  Paper,
  Stack,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import SendIcon from '@mui/icons-material/Send';

// Estilo personalizado para os containers
const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '16px',
}));

const CadastroVendas = () => {
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState({
    Produto: '',
    Valor: '',
    Quantidade: '',
  });
  const [formValues, setFormValues] = useState({
    Pagamento_Venda: '',
    Data_Venda: '',
  });
  const [fiadoInfo, setFiadoInfo] = useState({
    Nome: '',
    Contato: '',
    Endereco: '',
  });
  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  // Adicionar produto à lista
  const addProduct = () => {
    const newErrors = {};
    if (!currentProduct.Produto.trim()) {
      newErrors.Produto = 'Nome do produto é obrigatório!';
    }
    if (!currentProduct.Valor.trim()) {
      newErrors.Valor = 'Valor é obrigatório!';
    }
    if (!currentProduct.Quantidade.trim()) {
      newErrors.Quantidade = 'Quantidade é obrigatória!';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setProducts([...products, currentProduct]);
    setCurrentProduct({ Produto: '', Valor: '', Quantidade: '' });
    setErrors({});
  };

  // Remover produto da lista
  const removeProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  // Atualizar o produto sendo editado
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentProduct((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
  };

  // Atualizar valores do formulário
  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    if (name === 'Pagamento_Venda' && value === 'Fiado') {
      setOpenDialog(true);
    }
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
  };

  // Atualizar informações de "Fiado"
  const handleFiadoChange = (event) => {
    const { name, value } = event.target;
    setFiadoInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Calcular total da venda
  const calcularTotalVenda = () => {
    return products.reduce(
      (total, produto) =>
        total + parseFloat(produto.Valor || 0) * parseInt(produto.Quantidade || 0),
      0
    );
  };

  // Enviar os dados
  const handleSubmit = () => {
    if (products.length === 0) {
      setErrors({ Produtos: 'Adicione pelo menos um produto!' });
      return;
    }

    if (!formValues.Pagamento_Venda.trim() || !formValues.Data_Venda.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        Pagamento_Venda: !formValues.Pagamento_Venda.trim()
          ? 'Forma de pagamento é obrigatória!'
          : '',
        Data_Venda: !formValues.Data_Venda.trim()
          ? 'Data da venda é obrigatória!'
          : '',
      }));
      return;
    }

    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Buscar os produtos do backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/produto');
        setProducts(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Navbar />
      <Box sx={{ display: 'flex', mt: 8 }}>
        <Sidernav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Cadastro de Vendas
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormGrid>
                <FormLabel htmlFor="Produto">Nome do Produto</FormLabel>
                <Select
                  id="Produto"
                  name="Produto"
                  value={currentProduct.Produto}
                  onChange={handleInputChange}
                  size="small"
                  error={!!errors.Produto}
                  fullWidth
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Selecione um produto
                  </MenuItem>
                  {products.map((produto) => (
                    <MenuItem key={produto.id} value={produto.nome}>
                      {produto.nome}
                    </MenuItem>
                  ))}
                </Select>
                {errors.Produto && (
                  <Typography color="error" variant="body2">
                    {errors.Produto}
                  </Typography>
                )}
              </FormGrid>
              <FormGrid>
                <FormLabel htmlFor="Valor">Valor</FormLabel>
                <OutlinedInput
                  id="Valor"
                  name="Valor"
                  value={currentProduct.Valor}
                  onChange={handleInputChange}
                  size="small"
                  error={!!errors.Valor}
                  fullWidth
                />
                {errors.Valor && (
                  <Typography color="error" variant="body2">
                    {errors.Valor}
                  </Typography>
                )}
              </FormGrid>
              <FormGrid>
                <FormLabel htmlFor="Quantidade">Quantidade</FormLabel>
                <OutlinedInput
                  id="Quantidade"
                  name="Quantidade"
                  value={currentProduct.Quantidade}
                  onChange={handleInputChange}
                  size="small"
                  error={!!errors.Quantidade}
                  fullWidth
                />
                {errors.Quantidade && (
                  <Typography color="error" variant="body2">
                    {errors.Quantidade}
                  </Typography>
                )}
              </FormGrid>
              <Button
                startIcon={<AddShoppingCartIcon />}
                variant="contained"
                onClick={addProduct}
              >
                Adicionar Produto
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Produtos Adicionados
                </Typography>
                {products.length === 0 ? (
                  <Typography variant="body2">Nenhum produto adicionado.</Typography>
                ) : (
                  products.map((product, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1,
                      }}
                    >
                      <Box>
                        <Typography>{product.Produto}</Typography>
                        <Typography color="textSecondary">
                          R$ {product.Valor} - {product.Quantidade} unidades
                        </Typography>
                      </Box>
                      <IconButton
                        color="error"
                        onClick={() => removeProduct(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))
                )}
              </Paper>
            </Grid>
          </Grid>
          <Box sx={{ mt: 4 }}>
            <FormGrid>
              <FormLabel htmlFor="Data_Venda">Data da Venda</FormLabel>
              <OutlinedInput
                id="Data_Venda"
                name="Data_Venda"
                type="date"
                value={formValues.Data_Venda}
                onChange={handleFormChange}
                size="small"
                error={!!errors.Data_Venda}
                fullWidth
              />
              {errors.Data_Venda && (
                <Typography color="error" variant="body2">
                  {errors.Data_Venda}
                </Typography>
              )}
            </FormGrid>
            <FormGrid>
              <FormLabel htmlFor="Pagamento_Venda">Forma de Pagamento</FormLabel>
              <Select
                id="Pagamento_Venda"
                name="Pagamento_Venda"
                value={formValues.Pagamento_Venda}
                onChange={handleFormChange}
                size="small"
                error={!!errors.Pagamento_Venda}
                fullWidth
              >
                <MenuItem value="" disabled>
                  Selecione a forma de pagamento
                </MenuItem>
                <MenuItem value="Dinheiro">Dinheiro</MenuItem>
                <MenuItem value="Cartão">Cartão</MenuItem>
                <MenuItem value="Pix">Pix</MenuItem>
                <MenuItem value="Fiado">Fiado</MenuItem>
              </Select>
              {errors.Pagamento_Venda && (
                <Typography color="error" variant="body2">
                  {errors.Pagamento_Venda}
                </Typography>
              )}
            </FormGrid>
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6">Total: R$ {calcularTotalVenda()}</Typography>
              <Button
                endIcon={<SendIcon />}
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Finalizar Venda
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert severity="success" sx={{ width: '100%' }}>
          Venda registrada com sucesso!
        </MuiAlert>
      </Snackbar>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Informações de Fiado</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Por favor, preencha os dados do cliente para concluir a venda fiado.
          </DialogContentText>
          <FormGrid>
            <FormLabel htmlFor="Nome">Nome do Cliente</FormLabel>
            <OutlinedInput
              id="Nome"
              name="Nome"
              value={fiadoInfo.Nome}
              onChange={handleFiadoChange}
              size="small"
              fullWidth
            />
          </FormGrid>
          <FormGrid>
            <FormLabel htmlFor="Contato">Contato</FormLabel>
            <OutlinedInput
              id="Contato"
              name="Contato"
              value={fiadoInfo.Contato}
              onChange={handleFiadoChange}
              size="small"
              fullWidth
            />
          </FormGrid>
          <FormGrid>
            <FormLabel htmlFor="Endereco">Endereço</FormLabel>
            <OutlinedInput
              id="Endereco"
              name="Endereco"
              value={fiadoInfo.Endereco}
              onChange={handleFiadoChange}
              size="small"
              fullWidth
            />
          </FormGrid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button variant="contained" onClick={handleCloseDialog}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CadastroVendas;
