import { useState, useEffect } from "react";
import { db, auth } from "./firebaseConection";
import { doc,collection,addDoc, getDocs, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

import './app.css'



function App() {

  const [titulo,setTitulo] = useState('');
  const [autor,setAutor] = useState('');
  const [idPost, setIdPost] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [user, setUser] = useState(false);
  const [userDetail, setUserDetail] = useState({});

  const [posts,setPosts] = useState([]);

  useEffect(()=> {
    async function loadPosts(){
      const unsub = onSnapshot(collection(db, "posts"), (snapshot) =>{
        let listaPost = [];

        snapshot.forEach((doc) => {
          listaPost.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          })
        })
  
        setPosts(listaPost);
      })
    }

    loadPosts();

  },[])

  useEffect( () =>{
    async function checkLogin(){
      onAuthStateChanged(auth, (user) =>{
        if(user){
          console.log(user);
          setUser(true);
          setUserDetail({
            uid: user.uid,
            email: user.email
          })
          
        }else{

          setUser(false);
          setUserDetail({});
        }
      })
    }
    checkLogin();
  }, [])


  async function handleAdd(){
    // await setDoc(doc(db, "posts", "12345"),{
    //   titulo: titulo, 
    //   autor: autor,
    // })
    // .then(()=>{
    //   console.log("Dados registrados")
    // })
    // .catch((error) =>{
    //   console.log("gerou o seguinte error: " + error);
    // })
    await addDoc(collection(db,"posts"), {
      titulo: titulo,
      autor: autor,
    }).then(()=>{
        console.log("Dados registrados")
        setAutor('');
        setTitulo('');
      })
      .catch((error) =>{
        console.log("gerou o seguinte error: " + error);
      })

  }

  async function buscarPost(){

    const postRef = collection(db, "posts")
    await getDocs(postRef)
    .then((snapshot) => {

      let lista = [];

      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          titulo: doc.data().titulo,
          autor: doc.data().autor,
        })
      })

      setPosts(lista);

    }).catch((error)=>{
        console.log('ERRO AO BSUCAR')
      })
    // const postRef = doc(db, "posts", "dzUL6CXhDPB5oqoYw4gD")

    // await getDoc(postRef)
    // .then((snapshot)=>{
    //   setAutor(snapshot.data().autor)
    //   setTitulo(snapshot.data().titulo)

    // }).catch((error)=>{
    //   console.log('ERRO AO BSUCAR')
    // })
  }

   async function editarPost(){
    const docRef = doc(db, "posts", idPost);
    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor
    }).then(()=>{
      console.log("POST ATUALIZADO");
      setIdPost('');
      setTitulo('');
      setAutor('');

    })
    .catch((error) =>{
      console.log(error);
    })

  }

  async function excluirPost(id){
    const docRef = doc(db, "posts", id)
    await deleteDoc(docRef)
    .then(()=>{
      alert("POST DELETADO");

    })
    .catch((error) =>{
      console.log(error);
    })

  }

  async function novoUsuario(){
    await createUserWithEmailAndPassword(auth, email, senha)
    .then((value)=>{
      console.log("CADASTRO COM SUCESSO");
      setEmail('');
      setSenha('');


    }).catch((e)=>{
      if(e.code === 'auth/weak-password'){
        alert("senha muito fraca.")
      }else if(e.code === 'auth/email-already-in-use'){
        alert("email já existe!")
      }
    })
  }

   async function logarUsuario(){
    await signInWithEmailAndPassword(auth, email, senha)
    .then((value)=>{
      console.log("Login realizado com sucesso");

      setUserDetail({
        uid: value.user.uid,
        email: value.user.email
      })
      setUser(true);

      setEmail('');
      setSenha('');
      console.log(value);

    }).catch((error)=>{
      console.log(error);
    })
  }
  async function fazerLogout(){
    await signOut(auth)
    setUser(false);
    setUserDetail({})
  }

  return (
    <div>
      <h1>ReactJS- Firebase</h1>

      { user && (
        <div>
          <strong>Seja Bem-Vindo(a) (você está logado!)</strong><br/>
          <span>ID: {userDetail.uid} - Email: {userDetail.email}</span><br/>
          <button onClick={fazerLogout}>Sair da conta</button>
          <br/><br/>
        </div>
      )}

      <div className="container">
        <h2>Usuarios</h2>
        <label>Email</label>
        <input value={email}
        onChange={(e)=> setEmail(e.target.value)}
        placeholder="Digite um email"/>
          <br/>
        <label>Senha</label>
        <input value={senha}
        onChange={(e)=> setSenha(e.target.value)}
        placeholder="Digite uma senha"/>
          <br/>

        <button onClick={novoUsuario}>Cadastrar</button>
        <button onClick={logarUsuario}>fazer login</button>

      </div>

      <br/>
      <br/>

      <hr/>


      <div className="container">
        <h2>Posts</h2>
        <label>Id do Post:</label>
        <input placeholder="digite o seu ID do post" value={idPost} onChange={(e)=> setIdPost(e.target.value)}/>
        <br/>
        <label>Titulo</label>
        <textarea type="text" placeholder="digite o titulo" value={titulo} onChange={ (e) => setTitulo(e.target.value)}/>
        <label>Autor:</label>
        <input type="text" placeholder="Autor do post" value={autor} onChange={(e) => setAutor(e.target.value)}/>

        <button onClick={handleAdd}>Cadastrar</button>
        <button onClick={buscarPost}>Buscar posts</button>
        <br/>
        <button onClick={editarPost}>Editr post</button>



        <ul>
          {posts.map( (post) =>{
            return(
              <li key={post.id}>
                <strong>ID: {post.id}</strong>
                <br/>
                <span>Titulo: {post.titulo}</span>
                <br/>
                <span>Autor: {post.autor}</span>
                <br/>
                <button onClick={ () => excluirPost(post.id)}>Excluir</button>
                <br/>
                <br/>
              </li>
              
            )
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
