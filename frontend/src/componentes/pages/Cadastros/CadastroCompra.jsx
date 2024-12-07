import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidernav from '../TelaGeral/Sidernav.jsx';
import Navbar from '../TelaGeral/Navbar.jsx';
import Select from '@mui/material/Select'; 
import MenuItem from '@mui/material/MenuItem'; 
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { Button, Typography, Tooltip, TextField, } from '@mui/material';
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

  const [produtos, setprodutos] = useState([]);



  useEffect(() => {
    // Busca os fornecedores do backend ao carregar o componente
    const fetchData = async () => {
      try {
        const fornecedoresResponse = await axios.get('http://localhost:3001/fornecedor');
        setFornecedores(fornecedoresResponse.data);

        const produtosResponse = await axios.get('http://localhost:3001/produto');
        setprodutos(produtosResponse.data);


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
          dtcompra: formValues.Data_Compra,
          idproduto: formValues.ID_Produto,
          quantidade: formValues.Quantidade_Compra,
          precocompra: parseFloat(
            formValues.Valor_Und_Produto.replace(/[^\d,-]/g, '').replace(',', '.')
          ),
          vencimento: formValues.Vencimento_Compra,
        };
        console.log(dadosCompra);
        await axios.post('http://localhost:3001/aquisicao', dadosCompra);
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
    <Box>
    <Navbar />
    <Box sx={{ display: "flex" }}>
      <Sidernav />

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ mt: 8, width: "100%" }}>
          <Typography variant="h4" gutterBottom>
            Cadastro de Compras
          </Typography>
          <Grid container spacing={2}>
            {/* Campo ID do Produto */}
            <Grid item xs={12} md={6}>
              <FormLabel htmlFor="ID_Produto">ID do Produto</FormLabel>
              <Tooltip title="Selecione o ID do produto" placement="top">
                <Select
                  id="ID_Produto"
                  name="ID_Produto"
                  value={formValues.ID_Produto}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  error={!!errors.produto_Produto}
                >
                  <MenuItem value="" disabled>
                    Selecione um produto
                  </MenuItem>
                  {produtos.map((produto) => (
                    <MenuItem key={produto.id} value={produto.id}>
                      {produto.nome}
                    </MenuItem>
                  ))}
                </Select>
              </Tooltip>
              {errors.produto_Produto && (
                <Typography color="error" variant="body2">
                  {errors.produto_Produto}
                </Typography>
              )}
            </Grid>

            {/* Campo Fornecedor */}
            <Grid item xs={12} md={6}>
              <FormLabel htmlFor="Fornecedor_Produto">
                Fornecedor Produto
              </FormLabel>
              <Select
                id="Fornecedor_Produto"
                name="Fornecedor_Produto"
                value={formValues.Fornecedor_Produto}
                onChange={handleInputChange}
                fullWidth
                size="small"
                error={!!errors.Fornecedor_Produto}
              >
                <MenuItem value="" disabled>
                  Selecione um fornecedor
                </MenuItem>
                {fornecedores.map((fornecedor) => (
                  <MenuItem key={fornecedor.cnpj} value={fornecedor.cnpj}>
                    {fornecedor.nome}
                  </MenuItem>
                ))}
              </Select>
              {errors.Fornecedor_Produto && (
                <Typography color="error" variant="body2">
                  {errors.Fornecedor_Produto}
                </Typography>
              )}
            </Grid>

            {/* Campos de Data */}
            {["Data_Compra", "Vencimento_Compra"].map((field, index) => (
              <Grid key={field} item xs={12} md={6}>
                <FormLabel htmlFor={field}>
                  {field === "Data_Compra"
                    ? "Data da Compra"
                    : "Data de Vencimento"}
                </FormLabel>
                <TextField
                  id={field}
                  name={field}
                  type="date"
                  value={formValues[field]}
                  onChange={handleFormChange}
                  fullWidth
                  size="small"
                  error={!!errors[field]}
                />
                {errors[field] && (
                  <Typography color="error" variant="body2">
                    {errors[field]}
                  </Typography>
                )}
              </Grid>
            ))}

            {/* Outros Campos */}
            <Grid item xs={12} md={6}>
              <FormLabel htmlFor="Quantidade_Compra">
                Quantidade do Produto
              </FormLabel>
              <TextField
                id="Quantidade_Compra"
                name="Quantidade_Compra"
                value={formValues.Quantidade_Compra}
                onChange={handleInputChange}
                fullWidth
                size="small"
                error={!!errors.Quantidade_Compra}
              />
              {errors.Quantidade_Compra && (
                <Typography color="error" variant="body2">
                  {errors.Quantidade_Compra}
                </Typography>
              )}
            </Grid>
            <FormGrid item xs={12} md={6}></FormGrid>
            <Grid item xs={12} md={6}>
              <FormLabel htmlFor="Valor_Und_Produto">
                Valor da Unidade
              </FormLabel>
              <TextField
                id="Valor_Und_Produto"
                name="Valor_Und_Produto"
                placeholder="R$ 000,00"
                value={formValues.Valor_Und_Produto}
                onChange={handleInputChange}
                fullWidth
                size="small"
                error={!!errors.Valor_Und_Produto}
              />
              {errors.Valor_Und_Produto && (
                <Typography color="error" variant="body2">
                  {errors.Valor_Und_Produto}
                </Typography>
              )}
            </Grid>

            {/* Botões de Ação */}
            <Grid item xs={12}>
              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <Button
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  onClick={LimpaDados}
                  color="error"
                >
                  Limpar
                </Button>
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  onClick={handleSubmit}
                  color="success"
                  disabled={
                    Object.values(errors).some((error) => !!error) ||
                    Object.values(formValues).some((value) => !value)
                  }
                >
                  Enviar
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Produto adicionado com sucesso!
        </MuiAlert>
      </Snackbar>
    </Box>
  </Box>
);
};

export default CadastroCompra;
