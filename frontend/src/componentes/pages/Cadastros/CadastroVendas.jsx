import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidernav from '../TelaGeral/Sidernav.jsx';
import Navbar from '../TelaGeral/Navbar.jsx';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { Select, Button, Typography, IconButton, Paper, Stack, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import DeleteIcon from '@mui/icons-material/Delete';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import SendIcon from '@mui/icons-material/Send';
import { CleanOutlinedInput } from '../../theme/customStyles.js';

// Estilo personalizado para o Grid
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
    Total: '',
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

  // Atualizar valores globais
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

  // Limpar todos os dados
  const LimpaDados = () => {
    setProducts([]);
    setCurrentProduct({ Produto: '', Valor: '', Quantidade: '' });
    setFormValues({ Pagamento_Venda: '', Data_Venda: '' });
    setFiadoInfo({ Nome: '', Contato: '', Total: '' });
    setErrors({});
  };

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

    // Simulação do envio dos dados
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    // Busca os produtos do backend ao carregar o componente
    const fetchData = async () => {
      try {
        const produtosResponse = await axios.get('http://localhost:3001/produto');
        setProducts(produtosResponse.data); 
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };
    fetchData();
  }, []);
  


  return (
    <div>
      <Navbar />
      <Box sx={{ display: 'flex', mt:8 }}>
        <Sidernav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Grid container spacing={2}>
            {/* Coluna para adicionar produtos */}
            <Grid item xs={12} md={6}>
              <Box sx={{ mt: 4 }}>
                <FormGrid>
                  <Grid container spacing={2}>
                    {/* Nome do Produto e Valor lado a lado */}
                    <Grid item xs={12} sm={6}>
                      <FormLabel htmlFor="Produto">Nome do Produto</FormLabel>
                      <Select
                        id="Produto"
                        name="Produto"
                        value={currentProduct.Produto}
                        onChange={handleInputChange}
                        size="small"
                        error={!!errors.Produto}
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
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormLabel htmlFor="Valor">Valor</FormLabel>
                      <CleanOutlinedInput
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
                    </Grid>
                  </Grid>
                </FormGrid>

                <FormGrid>
                  <FormLabel htmlFor="Quantidade">Quantidade</FormLabel>
                  <CleanOutlinedInput
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
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 4 }}>
            <Grid container spacing={2}>
 

              <FormGrid item xs={12} md={6}>
                <FormLabel htmlFor="Data_Venda">Data da Venda</FormLabel>
                <CleanOutlinedInput
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
            </Grid>
          </Box>
          <Button
            startIcon={<AddShoppingCartIcon />}
            variant="contained"
            onClick={addProduct}
          >
            Adicionar Produto
          </Button>

          {/* Coluna para exibir a lista de produtos */}
          <Grid item xs={12} md={5}>
            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Lista de Produtos
              </Typography>
              {products.length === 0 ? (
                <Typography variant="body2" color="textSecondary">
                  Nenhum produto adicionado ainda.
                </Typography>
              ) : (
                products.map((product, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 1,
                      p: 1,
                      border: '1px solid #ccc',
                      borderRadius: 1,
                    }}
                  >
                    <Box>
                      <Typography variant="body1">{product.Produto}</Typography>
                      <Typography variant="body2" color="textSecondary">
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
          <FormGrid item xs={12} md={6}>
              <FormLabel htmlFor="Pagamento_Venda">Forma de Pagamento</FormLabel>
              <Select
                id="Pagamento_Venda"
                name="Pagamento_Venda"
                value={formValues.Pagamento_Venda}
               onChange={handleFormChange}
                size="small"
                error={!!errors.Pagamento_Venda}
                fullWidth
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Selecione a forma de pagamento
                </MenuItem>
                <MenuItem value="Dinheiro">Dinheiro</MenuItem>
                <MenuItem value="Pix">Pix</MenuItem>
                <MenuItem value="Cheque">Cheque</MenuItem>
                <MenuItem value="Crédito">Cartão de Crédito</MenuItem>
                <MenuItem value="Débito">Cartão de Débito</MenuItem>
                <MenuItem value="Boleto">Boleto</MenuItem>
                <MenuItem value="Drex">Drex</MenuItem>
                <MenuItem value="Fiado">Fiado</MenuItem>
                
              </Select>
              {errors.Pagamento_Venda && (
                <Typography color="error" variant="body2">
                  {errors.Pagamento_Venda}
                </Typography>
              )}
            </FormGrid>

          {/* Botões de ação */}
          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={LimpaDados}
              startIcon={<RemoveCircleOutlineIcon />}
            >
              Limpar
            </Button>

            <Button
              variant="contained"
              color="success"
              onClick={handleSubmit}
              endIcon={<SendIcon />}
            >
              Finalizar Venda
            </Button>
          </Stack>

          {/* Snackbar para exibir a confirmação */}
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
          >
            <MuiAlert
              onClose={handleCloseSnackbar}
              severity="success"
              sx={{ width: '100%' }}
            >
              Venda realizada com sucesso!
            </MuiAlert>
          </Snackbar>

          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Informações de Fiado</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Preencha as informações do cliente que irá pagar fiado.
              </DialogContentText>
              <FormLabel htmlFor="Nome">Nome</FormLabel>
              <OutlinedInput
                id="Nome"
                name="Nome"
                value={fiadoInfo.Nome}
                onChange={handleFiadoChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <FormLabel htmlFor="Contato">Contato</FormLabel>
              <OutlinedInput
                id="Contato"
                name="Contato"
                value={fiadoInfo.Contato}
                onChange={handleFiadoChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <FormLabel htmlFor="Total">Total</FormLabel>
              <OutlinedInput
                id="Total"
                name="Total"
                value={calcularTotalVenda()}
                onChange={handleFiadoChange}
                fullWidth
                sx={{ mb: 2 }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Fechar
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </div>
  );
};

export default CadastroVendas;