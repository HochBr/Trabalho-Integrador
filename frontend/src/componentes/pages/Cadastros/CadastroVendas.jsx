import React, { useState } from 'react';
import Sidernav from '../TelaGeral/Sidernav.jsx';
import Navbar from '../TelaGeral/Navbar.jsx';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { Button, Typography, IconButton, Paper, Stack } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import DeleteIcon from '@mui/icons-material/Delete';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import EditIcon from '@mui/icons-material/Edit';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import SendIcon from '@mui/icons-material/Send';

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

  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);

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
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
  };

  // Limpar todos os dados
  const LimpaDados = () => {
    setProducts([]);
    setCurrentProduct({ Produto: '', Valor: '', Quantidade: '' });
    setFormValues({ Pagamento_Venda: '', Data_Venda: '' });
    setErrors({});
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

    console.log('Produtos:', products);
    console.log('Outros dados:', formValues);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

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
                      <OutlinedInput
                        id="Produto"
                        name="Produto"
                        value={currentProduct.Produto}
                        onChange={handleInputChange}
                        size="small"
                        error={!!errors.Produto}
                        fullWidth
                      />
                      {errors.Produto && (
                        <Typography color="error" variant="body2">
                          {errors.Produto}
                        </Typography>
                      )}
                    </Grid>

                    <Grid item xs={12} sm={6}>
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
                    </Grid>
                  </Grid>
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
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 4 }}>
            <Grid container spacing={2}>
              <FormGrid item xs={12} md={6}>
                <FormLabel htmlFor="Pagamento_Venda">Forma de Pagamento</FormLabel>
                <OutlinedInput
                  id="Pagamento_Venda"
                  name="Pagamento_Venda"
                  value={formValues.Pagamento_Venda}
                  onChange={handleFormChange}
                  size="small"
                  error={!!errors.Pagamento_Venda}
                  fullWidth
                />
                {errors.Pagamento_Venda && (
                  <Typography color="error" variant="body2">
                    {errors.Pagamento_Venda}
                  </Typography>
                )}
              </FormGrid>

              <FormGrid item xs={12} md={6}>
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
        </Box>
      </Box>
    </div>
  );
};

export default CadastroVendas;