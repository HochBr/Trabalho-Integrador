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
  ButtonGroup,
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
  const [clientes, setClientes] = useState([]);
  const [currentProduct, setCurrentProduct] = useState({
    Produto: '',
    Quantidade: '',
  });
  const [formValues, setFormValues] = useState({
    Pagamento_Venda: '',
    Data_Venda: '',
  });
  const [clienteAtual, setClienteAtual] = useState({
    Nome: '',
    Contato: '',
    Endereco: '',
    saldo: 0,
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
    if (name === 'Pagamento_Venda') {
      setOpenDialog(true);
    }
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
  };

  // Atualizar informações de "Fiado"
  const handleFiadoChange = (event) => {
    const { name, value } = event.target;
    setClienteAtual((prev) => ({ ...prev, [name]: value }));
  };

  // Enviar os dados
  const handleSubmit = async () => {
    const newErrors = {};
    //Algum desses trim de merda que estão dando erro
    if (!currentProduct.Produto.trim()) {
      newErrors.Produto = 'Nome do produto é obrigatório!';
    }
    if (!currentProduct.Quantidade.trim()) {
      newErrors.Quantidade = 'Quantidade é obrigatória!';
    }
    //if (!formValues.Pagamento_Venda.trim()) {
      //newErrors.Pagamento_Venda = 'Forma de pagamento é obrigatória!';
    //}
    if (!formValues.Data_Venda.trim()) {
      newErrors.Data_Venda = 'Data da venda é obrigatória!';
    }
    if (!currentProduct.Produto?.trim()) {
      newErrors.Produto = 'Nome do produto é obrigatório!';
    }
    // if (!clienteAtual.Nome?.trim()) {
    //   newErrors.Nome = 'Nome do cliente é obrigatório!';
    // }
    //contato
    //endereço

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Encontrar o produto selecionado
    const produtoSelecionado = produtos.find(
      (produto) => produto.nome === currentProduct.Produto
    );

    if (!produtoSelecionado) {
      setErrors({ Produto: 'Produto inválido!' });
      return;
    }

    // Calcular saldo do cliente (caso seja fiado)
    const saldoAtualizado =
      clienteAtual.saldo +
      produtoSelecionado.valor * parseInt(currentProduct.Quantidade, 10);

    // Criar ou atualizar cliente
    if (formValues.Pagamento_Venda) {
      const DadosCliente = {
        nome: clienteAtual.Nome,
        endereco: clienteAtual.Endereco,
        saldo: saldoAtualizado,
        contato: clienteAtual.Contato,
      };

      // try {
      //   await axios.post('http://localhost:3001/cliente', DadosCliente, {
      //     headers: {
      //       Authorization: `Bearer ${localStorage.getItem('token')}`,
      //     },
      //   });
      // } catch (error) {
      //   console.error('Erro ao salvar cliente:', error);
      //   return;
      // }
    }

    // Criar venda
    const dadosVenda = {
      idcliente: clienteAtual.id,
      idproduto: produtoSelecionado.id,
      datavenda: formValues.Data_Venda,
      quantidade: parseInt(currentProduct.Quantidade, 10),
    };

    try {
      await axios.post('http://localhost:3001/venda', dadosVenda, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Erro ao salvar venda:', error);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Buscar os produtos e clientes do backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const produtosResponse = await axios.get('http://localhost:3001/produto', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setProdutos(produtosResponse.data);

        const clientesResponse = await axios.get('http://localhost:3001/cliente', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setClientes(clientesResponse.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };
    fetchData();
  }, []);

const [isNewClient, setIsNewClient] = useState(false);
const handleSaveCliente = () => {
  if (isNewClient) {
    // Validar e salvar o novo cliente
    if (!clienteAtual.Nome.trim()) {
      setErrors({ Nome: 'Nome do cliente é obrigatório!' });
      return;
    }
    console.log('Novo cliente cadastrado:', clienteAtual);
  } else {
    // Validar cliente selecionado
    if (!clienteAtual.Nome.trim()) {
      setErrors({ Nome: 'Selecione um cliente existente!' });
      return;
    }
    console.log('Cliente existente selecionado:', clienteAtual);
  }
  handleCloseDialog();
};

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
                {/* Pega do banco o nome do produto */}
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

                {/* Quantidade */}
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
            {/* Data da venda */}
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
            {/* Escolher a forma de pagamento, é inutil? Sim, mas coloca */}
            <FormGrid>
            <FormLabel htmlFor="ClienteExistente">Selecionar Cliente - FIADO</FormLabel>
      <Select
        id="ClienteExistente"
        name="ClienteExistente"
        value={clienteAtual.Nome || ''}
        onChange={(e) => {
          const selectedCliente = clientes.find(cliente => cliente.nome === e.target.value);
          setClienteAtual((prev) => ({
            ...prev,
            id: selectedCliente?.id || '',
            Nome: selectedCliente?.nome || '',
            Contato: selectedCliente?.contato || '',
            Endereco: selectedCliente?.endereco || '',
            saldo: selectedCliente?.saldo || 0,
          }));
        }}
        size="small"
        fullWidth
      >
        <MenuItem value="" disabled>
          Selecione um cliente
        </MenuItem>
        {clientes.map((cliente) => (
          <MenuItem key={cliente.id} value={cliente.nome}>
            {cliente.nome}
          </MenuItem>
        ))}
      </Select>
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
    </div>
  );
};

export default CadastroVendas;