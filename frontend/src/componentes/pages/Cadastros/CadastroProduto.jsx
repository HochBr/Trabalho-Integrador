import React, { useState } from 'react';
import axios from 'axios';
import Sidernav from '../TelaGeral/Sidernav.jsx';
import Navbar from '../TelaGeral/Navbar.jsx';
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

const CadastroProduto = () => {
  // Estado para armazenar os valores do formulário
  const [formValues, setFormValues] = useState({
    Id_Produto: '',
    Nome_Produto: '',
    Categoria_Produto: '',
    Fornecedor_Produto: '',
    Marca_Produto: '',
    Valor_Und_Produto: '',
  });

  // Estado para controlar os campos obrigatórios
  const [errors, setErrors] = useState({});

  // Estado para controlar o Snackbar
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Limpa os dados do formulário
  const LimpaDados = () => {
    setFormValues({
      Id_Produto: '',
      Nome_Produto: '',
      Categoria_Produto: '',
      Fornecedor_Produto: '',
      Marca_Produto: '',
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

  // Função para enviar os dados (Exemplo: envio para um backend)
  const handleSubmit = async () => {
    const newErrors = {};

    // Valida os campos obrigatórios
    Object.keys(formValues).forEach((field) => {
      if (!formValues[field].trim()) {
        newErrors[field] = 'Campo obrigatório!';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // Atualiza os erros
    } else {
      try {
        const dadosProduto = {
          id: formValues.Id_Produto,
          nome: formValues.Nome_Produto,
          CategoriaID: formValues.Categoria_Produto,
          fornecedorCNPJ: formValues.Fornecedor_Produto,
          marca: formValues.Marca_Produto,
          valor: parseFloat(
            formValues.Valor_Und_Produto.replace(/[^\d,-]/g, '').replace(',', '.')
          ),
        };
        console.log(dadosProduto);
        await axios.post('http://localhost:3001/produto', dadosProduto);
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
            <Grid container spacing={2}>
              <FormGrid item xs={12} md={6}>
                <FormLabel htmlFor="Id_Produto">Código do produto 📑</FormLabel>
                <CleanOutlinedInput
                  id="Id_Produto"
                  name="Id_Produto"
                  type="text"
                  value={formValues.Id_Produto}
                  onChange={handleInputChange}
                  size="small"
                  error={!!errors.Id_Produto}
                />
                {errors.Id_Produto && (
                  <Typography color="error" variant="body2">
                    {errors.Id_Produto}
                  </Typography>
                )}
              </FormGrid>

              <FormGrid item xs={12} md={6}>
                <FormLabel htmlFor="Nome_Produto">Nome do Produto</FormLabel>
                <CleanOutlinedInput
                  id="Nome_Produto"
                  name="Nome_Produto"
                  type="text"
                  value={formValues.Nome_Produto}
                  onChange={handleInputChange}
                  size="small"
                  error={!!errors.Nome_Produto}
                />
                {errors.Nome_Produto && (
                  <Typography color="error" variant="body2">
                    {errors.Nome_Produto}
                  </Typography>
                )}
              </FormGrid>

              <FormGrid item xs={12} md={6}>
                <FormLabel htmlFor="Categoria_Produto">
                  Categoria do Produto
                </FormLabel>
                <CleanOutlinedInput
                  id="Categoria_Produto"
                  name="Categoria_Produto"
                  type="text"
                  value={formValues.Categoria_Produto}
                  onChange={handleInputChange}
                  size="small"
                  error={!!errors.Categoria_Produto}
                />
                {errors.Categoria_Produto && (
                  <Typography color="error" variant="body2">
                    {errors.Categoria_Produto}
                  </Typography>
                )}
              </FormGrid>

              <FormGrid item xs={12} md={6}>
                <FormLabel htmlFor="Fornecedor_Produto">
                  Fornecedor Produto
                </FormLabel>
                <CleanOutlinedInput
                  id="Fornecedor_Produto"
                  name="Fornecedor_Produto"
                  type="text"
                  value={formValues.Fornecedor_Produto}
                  onChange={handleInputChange}
                  size="small"
                  error={!!errors.Fornecedor_Produto}
                />
                {errors.Fornecedor_Produto && (
                  <Typography color="error" variant="body2">
                    {errors.Fornecedor_Produto}
                  </Typography>
                )}
                
              </FormGrid>
                
              <FormGrid item xs={12} md={6}>
                <FormLabel htmlFor="Marca_Produto">Marca do Produto</FormLabel>
                <CleanOutlinedInput
                  id="Marca_Produto"
                  name="Marca_Produto"
                  type="text"
                  value={formValues.Marca_Produto}
                  onChange={handleInputChange}
                  size="small"
                  error={!!errors.Marca_Produto}
                />
                {errors.Marca_Produto && (
                  <Typography color="error" variant="body2">
                    {errors.Marca_Produto}
                  </Typography>
                )}
              </FormGrid>
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

export default CadastroProduto;
