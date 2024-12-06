import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidernav from '../TelaGeral/Sidernav.jsx';
import Navbar from '../TelaGeral/Navbar.jsx';
import Select from '@mui/material/Select'; // Componente Select do Material-UI
import MenuItem from '@mui/material/MenuItem'; // Componente MenuItem do Material-UI
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { Button, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import DeleteIcon from '@mui/icons-material/Delete'; 
import SendIcon from '@mui/icons-material/Send';
import { CleanOutlinedInput } from '../../theme/customStyles.js'

// Estilo personalizado para o Grid
const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '16px', // Espaçamento entre os campos
}));

const CadastroCompra = () => {
  // Estado para armazenar os valores do formulário
  const [formValues, setFormValues] = useState({
    ID_Produto: '',
    Data_Compra: '',
    Vencimento_Compra: '',
    Quantidade_Compra: '',
    Valor_Und_Produto: '',
  });

  // Estado para controlar os campos obrigatórios
  const [errors, setErrors] = useState({});

  // Estado para controlar o Snackbar
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [fornecedores, setFornecedores] = useState([]);

  const [categorias, setCategorias] = useState([]);

  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    // Busca os fornecedores do backend ao carregar o componente
    const fetchData = async () => {
      try {
        const fornecedoresResponse = await axios.get('http://localhost:3001/fornecedor');
        setFornecedores(fornecedoresResponse.data);

        const categoriasResponse = await axios.get('http://localhost:3001/categoria');
        setCategorias(categoriasResponse.data);

        //const produtoResponse = await axios.get('http://localhost:3001/produto');
        //setProdutos(produtosResponse.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };
    fetchData();
  }, []);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // Limpa os dados do formulário
  const LimpaDados = () => {
    setFormValues({
      ID_Produto: '',
      Data_Compra: '',
      Vencimento_Compra: '',
      Quantidade_Compra: '',
      Valor_Und_Produto: '',
    });
    setErrors({});
  };

  // Função para formatar o valor em moeda brasileira
  const formatCurrency = (value) => {
    const numericValue = value.replace(/\D/g, ''); // Remove caracteres não numéricos
    const formattedValue = (numericValue / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
    return formattedValue;
  };

  // Manipulador para capturar mudanças nos campos
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    // Aplica formatação ao campo Valor_Und_Produto
    const formattedValue =
      name === 'Valor_Und_Produto' ? formatCurrency(value) : value;

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: formattedValue, // Atualiza o campo correspondente
    }));

    // Remove erro do campo preenchido
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
  };

  // Ajustar conforme o banco
  const handleSubmit = async () => {
    const newErrors = {};
    
    // Valida os campos obrigatórios
    Object.keys(formValues).forEach((field) => {
      const value = formValues[field];
      if (!value || (typeof value === 'string' && !value.trim())) {
        newErrors[field] = 'Campo obrigatório!';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // Atualiza os erros
    } else {
      try {
        const dadosCompra = { 
          id: formValues.ID_Produto,
          dataC: formValues.Data_Compra,
          dataV: formValues.Vencimento_Compra,
          quantidade: formValues.Quantidade_Compra,
          valor: parseFloat(
            formValues.Valor_Und_Produto.replace(/[^\d,-]/g, '').replace(',', '.')
          ),
        };
        console.log(dadosCompra);
        await axios.post('http://localhost:3001/compra', dadosCompra);
        setOpenSnackbar(true);
        LimpaDados();
      } catch (error){
        console.error ('Erro ao enviar', error);
        setErrors((prevErrors) => ({
          ...prevErrors,
          form: 'Erro no cadastro de produto. Tente novamente',
        }));
      }
    }
  };

  // Fechar o Snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return; // Evita fechar ao clicar fora
    setOpenSnackbar(false);
  };

  return (
    <div >
      <Navbar />
      <Box sx={{ display: 'flex' }}>
        <Sidernav />

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Box sx={{ mt: 8 /* Margem superior ajustável */, width: '100%' }}>
          <h1>Cadastro de Compras</h1>
            <Grid container spacing={2}>
            <FormGrid item xs={12} md={6}>
                <FormLabel htmlFor="ID_Produto">ID do Produto</FormLabel>
                <Select
                  id="ID_Produto"
                  name="ID_Produto"
                  type="text"
                  value={formValues.ID_Produto}
                  onChange={handleInputChange}
                  size="small"
                  error={!!errors.Categoria_Produto}
                >
                  <MenuItem value = "" disabled>
                    Selecione uma categoria
                  </MenuItem>
                  {categorias.map((categoria) => (
                    <MenuItem key = {categoria.id} value = {categoria.id}>
                      {categoria.nome}
                    </MenuItem>
                  ))}
                </Select>
                {errors.Categoria_Produto && (
                  <Typography color="error" variant="body2">
                    {errors.Categoria_Produto}
                  </Typography>
                )}
              </FormGrid>

              <FormGrid item xs={12} md={6}>
                <FormLabel htmlFor="Data_Compra">Data da Compra</FormLabel>
                <CleanOutlinedInput
                  id="Data_Compra"
                  name="Data_Compra"
                  type="date"
                  value={formValues.Data_Compra}
                  onChange={handleFormChange}
                  size="small"
                  error={!!errors.Data_Compra}
                  fullWidth
                />
                {errors.Data_Compra && (
                  <Typography color="error" variant="body2">
                    {errors.Data_Compra}
                  </Typography>
                )}
              </FormGrid>

              <FormGrid item xs={12} md={6}>
                <FormLabel htmlFor="Vencimento_Compra">Data do Vencimento</FormLabel>
                <CleanOutlinedInput
                  id="Vencimento_Compra"
                  name="Vencimento_Compra"
                  type="date"
                  value={formValues.Vencimento_Compra}
                  onChange={handleFormChange}
                  size="small"
                  error={!!errors.Vencimento_Compra}
                  fullWidth
                />
                {errors.Vencimento_Compra && (
                  <Typography color="error" variant="body2">
                    {errors.Vencimento_Compra}
                  </Typography>
                )}
              </FormGrid>

                
              <FormGrid item xs={12} md={6}>
                <FormLabel htmlFor="Quantidade_Compra">quantidade do Produto</FormLabel>
                <CleanOutlinedInput
                  id="Quantidade_Compra"
                  name="Quantidade_Compra"
                  type="text"
                  value={formValues.Quantidade_Compra}
                  onChange={handleInputChange}
                  size="small"
                  error={!!errors.Quantidade_Compra}
                />
                {errors.Quantidade_Compra && (
                  <Typography color="error" variant="body2">
                    {errors.Quantidade_Compra}
                  </Typography>
                )}
              </FormGrid>
             
                <FormGrid item xs={12} md={6}></FormGrid>
                <FormGrid item xs={12} md={6}></FormGrid>
              <FormGrid item xs={12} md={6}>
                <FormLabel htmlFor="Valor_Und_Produto">
                  Valor da unidade do Produto
                </FormLabel>
                <CleanOutlinedInput
                  id="Valor_Und_Produto"
                  name="Valor_Und_Produto"
                  type="text"
                  placeholder="R$ 000,00"
                  value={formValues.Valor_Und_Produto}
                  onChange={handleInputChange}
                  autoComplete="off"
                  size="small"
                  error={!!errors.Valor_Und_Produto}
                />
                {errors.Valor_Und_Produto && (
                  <Typography color="error" variant="body2">
                    {errors.Valor_Und_Produto}
                  </Typography>
                )}
              </FormGrid>
              <FormGrid item xs={12} md={6}></FormGrid>
              <FormGrid item xs={12} md={7}></FormGrid>
              <Grid item xs={12} md={5}>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    onClick={LimpaDados}
                    color='error'
                  >
                    Limpar
                  </Button>
                  <Button
                    variant="contained"
                    endIcon={<SendIcon />}
                    onClick={handleSubmit}
                    color='success'
                  >
                    Enviar
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>

      {/* Snackbar para exibir mensagens */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: '100%' }}
        >
          Produto adicionado com sucesso!
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default CadastroCompra;
