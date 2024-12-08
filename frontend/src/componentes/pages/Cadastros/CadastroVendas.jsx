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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  MenuItem,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';

// Estilo personalizado para os containers
const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '16px',
}));

const CadastroVendas = () => {
  const [produtos, setProdutos] = useState([]);
  const [currentProduct, setCurrentProduct] = useState({
    Produto: '',
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

  // Atualizar o produto sendo editado
  const handleProductChange = (event) => {
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


  // Enviar os dados
  const handleSubmit = () => {
    const newErrors = {};

    if (!currentProduct.Produto.trim()) {
      newErrors.Produto = 'Nome do produto é obrigatório!';
    }
    if (!currentProduct.Quantidade.trim()) {
      newErrors.Quantidade = 'Quantidade é obrigatória!';
    }
    if (!formValues.Pagamento_Venda.trim()) {
      newErrors.Pagamento_Venda = 'Forma de pagamento é obrigatória!';
    }
    if (!formValues.Data_Venda.trim()) {
      newErrors.Data_Venda = 'Data da venda é obrigatória!';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Lógica para salvar a venda
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
        setProdutos(response.data);
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
                  onChange={handleProductChange}
                  size="small"
                  error={!!errors.Produto}
                >
                  <MenuItem value="" disabled>
                    Selecione um produto
                  </MenuItem>
                  {produtos.map((produto) => (
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
                <FormLabel htmlFor="Quantidade">Quantidade</FormLabel>
                <OutlinedInput
                  id="Quantidade"
                  name="Quantidade"
                  value={currentProduct.Quantidade}
                  onChange={handleProductChange}
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
          <Button onClick={handleCloseDialog} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleCloseDialog} color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CadastroVendas;
