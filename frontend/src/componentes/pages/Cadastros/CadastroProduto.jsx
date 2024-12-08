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

const CadastroProduto = () => {
  // Estado para armazenar os valores do formulário
  const [formValues, setFormValues] = useState({
    Nome_Produto: '',
    Categoria_Produto: '',
    Fornecedor_Produto: '',
    Marca_Produto: '',
    Estoque_Produto: '',
  });

  // Estado para controlar os campos obrigatórios
  const [errors, setErrors] = useState({});

  // Estado para controlar o Snackbar
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [fornecedores, setFornecedores] = useState([]);

  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    // Busca os fornecedores do backend ao carregar o componente
    const fetchData = async () => {
      try {
        const fornecedoresResponse = await axios.get('http://localhost:3001/fornecedor', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setFornecedores(fornecedoresResponse.data);

        const categoriasResponse = await axios.get('http://localhost:3001/categoria', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setCategorias(categoriasResponse.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };
    fetchData();
  }, []);

  // Limpa os dados do formulário
  const LimpaDados = () => {
    setFormValues({
      ID_Produto: '',
      Nome_Produto: '',
      Categoria_Produto: '',
      Fornecedor_Produto: '',
      Marca_Produto: '',
      Estoque_Produto: '',
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
      const value = formValues[field];
      if (!value || (typeof value === 'string' && !value.trim())) {
        newErrors[field] = 'Campo obrigatório!';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // Atualiza os erros
    } else {
      try {
        const valorConvertido = parseFloat(formValues.Valor_Und_Produto.replace('R$', '').replace(',', '.'));
        const dadosProduto = { 
          id: formValues.ID_Produto,
          nome: formValues.Nome_Produto,
          CategoriaID: formValues.Categoria_Produto,
          fornecedorCNPJ: formValues.Fornecedor_Produto,
          valor: valorConvertido,
          marca: formValues.Marca_Produto,
          estoque: formValues.Estoque_Produto,
        };
        console.log(dadosProduto);
        await axios.post('http://localhost:3001/produto', dadosProduto, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
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
                <FormLabel htmlFor="ID_Produto">ID do Produto</FormLabel>
                <CleanOutlinedInput
                  id="ID_Produto"
                  name="ID_Produto"
                  type="text"
                  value={formValues.ID_Produto}
                  onChange={handleInputChange}
                  size="small"
                  error={!!errors.ID_Produto}
                />
                {errors.ID_Produto && (
                  <Typography color="error" variant="body2">
                    {errors.ID_Produto}
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
                <Select
                  id="Categoria_Produto"
                  name="Categoria_Produto"
                  type="text"
                  value={formValues.Categoria_Produto}
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
                <FormLabel htmlFor="Fornecedor_Produto">
                  Fornecedor Produto
                </FormLabel>
                <Select
                  id="Fornecedor_Produto"
                  name="Fornecedor_Produto"
                  type="text" 
                  value={formValues.Fornecedor_Produto}
                  onChange={handleInputChange}
                  size="small"
                  error={!!errors.Fornecedor_Produto}
                >
                <MenuItem value = "" disabled>
                  Selecione um fornecedor
                </MenuItem>
                {fornecedores.map((fornecedor) => (
                  <MenuItem key = {fornecedor.cnpj} value = {fornecedor.cnpj}>
                    {fornecedor.nome}
                  </MenuItem>
                ))}
                </Select>
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
              <FormGrid item xs={12} md={6}>
                <FormLabel htmlFor="Estoque_Produto">Estoque do Produto</FormLabel>
                <CleanOutlinedInput
                  id="Estoque_Produto"
                  name="Estoque_Produto"
                  type="text"
                  value={formValues.Estoque_Produto}
                  onChange={handleInputChange}
                  size="small"
                  error={!!errors.Estoque_Produto}
                />
                {errors.Estoque_Produto && (
                  <Typography color="error" variant="body2">
                    {errors.Estoque_Produto}
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

export default CadastroProduto;
