import React, { useState } from "react";
import logo from "./assets/gas.png";
import './telageral.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [usuario, setUsuario] = useState(""); // Estado para o usuário
  const [senha, setSenha] = useState(""); // Estado para a senha
  const [erro, setErro] = useState(""); // Estado para a mensagem de erro
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'post',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username: usuario, senha}),
      });
      if(!response.ok){
        const data = await response.json();
        setErro(data.message || "Usuário ou senha incorretos");
        return;
      }
      const { token, user } = await response.json();
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/home");
    } catch{
      setErro("Erro ao logar");
    }
    
  };

  return (
    <div className="container-fluid">
      <div className="container-login">
        <div className="wrap-login">
          <form className="login-form" onSubmit={handleSubmit}>
            <span className="login-form-title"> Bem vindo! </span>

            <span className="login-form-title">
              <img src={logo} alt="Botijão de gás prata" />
            </span>

            <div className="wrap-input">
              <input
                className={usuario !== "" ? "has-val input" : "input"}
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
              />
              <span className="focus-input" data-placeholder="Usuário"></span>
            </div>

            <div className="wrap-input">
              <input
                className={senha !== "" ? "has-val input" : "input"}
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <span className="focus-input" data-placeholder="Senha"></span>
            </div>

            {/* Exibe a mensagem de erro caso exista */}
            {erro && <div className="txt1">{erro}</div>}

            <div className="container-login-form-btn">
              <button className="login-form-btn">Entrar</button>
            </div>

            <div className="text-center">
              <span className="txt1">© Colono </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
