import React, { useState } from 'react';
import axios from 'axios';
import Sidernav from '../TelaGeral/Sidernav.jsx';
import Navbar from '../TelaGeral/Navbar.jsx';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { Button, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import InputMask from 'react-input-mask';
import { CleanOutlinedInput } from '../../theme/customStyles.js'
// Estilo personalizado para o Grid
const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '16px', // Espaçamento entre os campos
}));



const CadastroFornecedor = () => {
  // Estado para armazenar os valores do formulário
  const [formValues, setFormValues] = useState({
    Nome_Fornecedor: '',
    CNPJ_Fornecedor: '',
    Endereco_Fornecedor: '',
    Telefone_Fornecedor: '',
    Email_Fornecedor: '',
  });

  // Estado para controlar os campos obrigatórios
  const [errors, setErrors] = useState({});

  // Estado para controlar o Snackbar
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Limpa os dados do formulário
  const LimpaDados = () => {
    setFormValues({
      Nome_Fornecedor: '',
      CNPJ_Fornecedor: '',
      Endereco_Fornecedor: '',
      Telefone_Fornecedor: '',
      Email_Fornecedor: '',
    });
    setErrors({});
  };

  // Manipulador para capturar mudanças nos campos
  const handleInputChange = (event) => {
    const { name, value } = event.target; 

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
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
        // Remove caracteres não numéricos do CNPJ
        const cnpjLimpo = formValues.CNPJ_Fornecedor.replace(/\D/g, '');
  
        const dadosFornecedor = {
          cnpj: cnpjLimpo,
          nome: formValues.Nome_Fornecedor,
          endereco: formValues.Endereco_Fornecedor,
          email: formValues.Email_Fornecedor,
          telefone: formValues.Telefone_Fornecedor,
        };
  
        console.log(dadosFornecedor);
        await axios.post('http://localhost:3001/fornecedor', dadosFornecedor, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setOpenSnackbar(true);
        LimpaDados();
      } catch (error) {
        console.error('Erro ao enviar', error); 
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
    <div>
      <Navbar />
      <Box sx={{ display: 'flex' }}>
        <Sidernav />

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Box sx={{ mt: 8 /* Margem superior ajustável */, width: '100%'}}>
          {/*Fornecedor*/}
            <Grid container spacing={2}>
              <FormGrid item xs={12} md={6}>
                <FormLabel htmlFor="Nome_Fornecedor">Nome do Fornecedor</FormLabel>
                <CleanOutlinedInput
                  id="Nome_Fornecedor"
                  name="Nome_Fornecedor"
                  type="text"
                  value={formValues.Nome_Fornecedor}
                  onChange={handleInputChange}
                  size="small"
                  error={!!errors.Nome_Fornecedor}
                />
                {errors.Nome_Fornecedor && (
                  <Typography color="error" variant="body2">
                    {errors.Nome_Fornecedor}
                  </Typography>
                )}
              </FormGrid>
                {/*CNPJ*/}
              <FormGrid item xs={12} md={6}>
                <FormLabel htmlFor="CNPJ_Fornecedor">CNPJ do Fornecedor</FormLabel>
                <InputMask
                  mask="99.999.999/9999-99"
                  value={formValues.CNPJ_Fornecedor}
                  onChange={(e) =>
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      CNPJ_Fornecedor: e.target.value,
                    }))
                  }
                >
                  {() => (
                    <CleanOutlinedInput
                      id="CNPJ_Fornecedor"
                      name="CNPJ_Fornecedor"
                      type="text"
                      size="small"
                      error={!!errors.CNPJ_Fornecedor}
                    />
                  )}
                </InputMask>
                {errors.CNPJ_Fornecedor && (
                  <Typography color="error" variant="body2">
                    {errors.CNPJ_Fornecedor}
                  </Typography>
                )}
              </FormGrid>
                {/*Numero de telefone*/}
              <FormGrid item xs={12} md={6}>
                <FormLabel htmlFor="Telefone_Fornecedor">Telefone do Fornecedor</FormLabel>
                <InputMask
                  mask="(99) 9999-9999"
                  value={formValues.Telefone_Fornecedor}
                  onChange={(e) =>
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      Telefone_Fornecedor: e.target.value,
                    }))
                  }
                >
                  {() => (
                    <CleanOutlinedInput
                      id="Telefone_Fornecedor"
                      name="Telefone_Fornecedor"
                      type="text"
                      size="small"
                      error={!!errors.Telefone_Fornecedor}
                    />
                  )}
                </InputMask>
                {errors.Telefone_Fornecedor && (
                  <Typography color="error" variant="body2">
                    {errors.Telefone_Fornecedor}
                  </Typography>
                )}
              </FormGrid>
              <FormGrid item xs={12} md={6}>
                {/*Endereço*/}
              <FormLabel htmlFor="Endereco_Fornecedor">Endereço</FormLabel>
                <CleanOutlinedInput
                  id="Endereco_Fornecedor"
                  name="Endereco_Fornecedor"
                  type="text"
                  value={formValues.Endereco_Fornecedor}
                  onChange={handleInputChange}
                  size="small"
                  error={!!errors.Endereco_Fornecedor}
                />
                {errors.Endereco_Fornecedor && (
                  <Typography color="error" variant="body2">
                    {errors.Endereco_Fornecedor}
                  </Typography>
                )}
              </FormGrid>
              {/*E-mail*/}
              <FormGrid item xs={12} md={6}>
                <FormLabel htmlFor="Email_Fornecedor">E-mail do Fornecedor</FormLabel>
                <CleanOutlinedInput
                  id="Email_Fornecedor"
                  name="Email_Fornecedor"
                  type="text"
                  value={formValues.Email_Fornecedor}
                  onChange={handleInputChange}
                  autoComplete="off"
                  size="small"
                  error={!!errors.Email_Fornecedor}
                />
                {errors.Email_Fornecedor && (
                  <Typography color="error" variant="body2">
                    {errors.Email_Fornecedor}
                  </Typography>
                )}
              </FormGrid>
              <FormGrid item xs={12} md={7}></FormGrid>
                {/*Botões*/}
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

      {/* PRECISA ARRUMAR ESSA MERDA DE SNACK */} 
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
          Fornecedor adicionado com sucesso!
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default CadastroFornecedor;
