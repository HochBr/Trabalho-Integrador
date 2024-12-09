import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidernav from '../TelaGeral/Sidernav.jsx';
import Navbar from '../TelaGeral/Navbar.jsx';
import { styled } from '@mui/material/styles';
import { Box, Button, Typography, Grid, Stack, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { CleanOutlinedInput } from '../../theme/customStyles.js';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';

// Estilo personalizado para o Grid
const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '16px',
}));

const CadastroCliente = () => {
  // Estado para armazenar os valores do formulário
  const [formValues, setFormValues] = useState({
    Nome_Cliente: '',
    Endereco_Cliente: '',
    Saldo_Cliente: '',
    Contato_Cliente: '',
  });

  // Estado para controlar os campos obrigatórios
  const [errors, setErrors] = useState({});

  // Estado para controlar o Snackbar
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    // Busca os clientes do backend ao carregar o componente
    const fetchData = async () => {
      try {
        const clientesResponse = await axios.get('http://localhost:3001/cliente', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setClientes(clientesResponse.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };
    fetchData();
  }, []);

  // Limpa os dados do formulário
  const LimpaDados = () => {
    setFormValues({
      Nome_Cliente: '',
      Endereco_Cliente: '',
      Saldo_Cliente: '',
      Contato_Cliente: '',
    });
    setErrors({});
  };

  // Manipulador para capturar mudanças nos campos
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value, // Atualiza o campo correspondente
    }));

    // Remove erro do campo preenchido
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
  };

  // Função para enviar os dados
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
        const dadosCliente = {
          nome: formValues.Nome_Cliente,
          endereco: formValues.Endereco_Cliente,
          saldo: parseFloat(formValues.Saldo_Cliente), // Converte saldo para número
          contato: formValues.Contato_Cliente,
        };
        await axios.post('http://localhost:3001/cliente', dadosCliente, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setOpenSnackbar(true);
        LimpaDados();
      } catch (error) {
        console.error('Erro ao enviar', error);
        setErrors((prevErrors) => ({
          ...prevErrors,
          form: 'Erro no cadastro de cliente. Tente novamente.',
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
          <Box sx={{ mt: 8, width: '100%' }}>
            <Grid container spacing={2}>
              <FormGrid item xs={12} md={6}>
                <Typography variant="body1">Nome do Cliente</Typography>
                <CleanOutlinedInput
                  id="Nome_Cliente"
                  name="Nome_Cliente"
                  type="text"
                  value={formValues.Nome_Cliente}
                  onChange={handleInputChange}
                  size="small"
                  error={!!errors.Nome_Cliente}
                  placeholder="Digite o nome do cliente"
                />
                {errors.Nome_Cliente && (
                  <Typography color="error" variant="body2">
                    {errors.Nome_Cliente}
                  </Typography>
                )}
              </FormGrid>

              <FormGrid item xs={12} md={6}>
                <Typography variant="body1">Endereço do Cliente</Typography>
                <CleanOutlinedInput
                  id="Endereco_Cliente"
                  name="Endereco_Cliente"
                  type="text"
                  value={formValues.Endereco_Cliente}
                  onChange={handleInputChange}
                  size="small"
                  error={!!errors.Endereco_Cliente}
                  placeholder="Digite o endereço"
                />
                {errors.Endereco_Cliente && (
                  <Typography color="error" variant="body2">
                    {errors.Endereco_Cliente}
                  </Typography>
                )}
              </FormGrid>

              <FormGrid item xs={12} md={6}>
                <Typography variant="body1">Saldo do Cliente</Typography>
                <CleanOutlinedInput
                  id="Saldo_Cliente"
                  name="Saldo_Cliente"
                  type="text"
                  value={formValues.Saldo_Cliente}
                  onChange={handleInputChange}
                  size="small"
                  error={!!errors.Saldo_Cliente}
                  placeholder="Digite o saldo"
                />
                {errors.Saldo_Cliente && (
                  <Typography color="error" variant="body2">
                    {errors.Saldo_Cliente}
                  </Typography>
                )}
              </FormGrid>

              <FormGrid item xs={12} md={6}>
                <Typography variant="body1">Contato do Cliente</Typography>
                <CleanOutlinedInput
                  id="Contato_Cliente"
                  name="Contato_Cliente"
                  type="text"
                  value={formValues.Contato_Cliente}
                  onChange={handleInputChange}
                  size="small"
                  error={!!errors.Contato_Cliente}
                  placeholder="Digite o contato"
                />
                {errors.Contato_Cliente && (
                  <Typography color="error" variant="body2">
                    {errors.Contato_Cliente}
                  </Typography>
                )}
              </FormGrid>

              <Grid item xs={12} md={12}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
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
          Cliente cadastrado com sucesso!
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default CadastroCliente;
