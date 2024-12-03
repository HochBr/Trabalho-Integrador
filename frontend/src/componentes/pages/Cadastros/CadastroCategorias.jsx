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

const CadastroCategoria = () =>{

    const[formValues, setFormValues] = useState({
        Nome_Categoria: '',
    });

      // Estado para controlar os campos obrigatórios
  const [errors, setErrors] = useState({});

  // Estado para controlar o Snackbar
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Limpa os dados do formulário
  const LimpaDados = () => {
    setFormValues({
      Nome_Categoria: '',
    });
    setErrors({});
  };
  // Manipulador para capturar mudanças nos campos
  const handleInputChange = (event) => {
    const { name, value } = event.target;
  
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value, // Atualiza o valor do campo correspondente
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
        const dadosCategoria = {
          nome: formValues.Nome_Categoria,
        };
        console.log(dadosCategoria);
        await axios.post('http://localhost:3001/categoria', dadosCategoria);
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



    return(
        <div>
            <Navbar/>
            <Box sx={{display: 'flex'}}>
                <Sidernav/>
                <box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ mt: 8 /* Margem superior ajustável */, width: '100%' }}>
                        <grid container spacing={2}>
                        <h1>Cadastro de Categorias:</h1>
                        <FormGrid item xs={12} md={6}>
                            <FormLabel htmlFor="Nome_Categoria">Nome da Categoria</FormLabel>
                            <CleanOutlinedInput
                              id="Nome_Categoria"
                              name="Nome_Categoria"
                              type="text"
                              value={formValues.Nome_Categoria}
                              onChange={handleInputChange}
                              size="small"
                              error={!!errors.Nome_Categoria}
                            />
                            {errors.Nome_Categoria && (
                            <Typography color="error" variant="body2">
                                {errors.Nome_Categoria}
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
                        </grid>
                    </Box>
                </box>
            </Box>
            {/* Snackbar para exibir mensagens */}
            <Snackbar
                    open={openSnackbar}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackbar}>
                <MuiAlert
                    onClose={handleCloseSnackbar}
                    severity="success"
                    sx={{ width: '100%' }}>
                Produto adicionado com sucesso!
             </MuiAlert>
            </Snackbar>
        </div>

    );
};
export default CadastroCategoria;
