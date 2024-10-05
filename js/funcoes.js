let usuarios = []; // Array para armazenar os dados dos usuários
let linhaParaAtualizarIndex = null; // Variável para armazenar o índice do usuário a ser atualizado

function renderizarTabela(usuarios) {
  const tabela = document.querySelector("table tbody");
  tabela.innerHTML = ''; // Limpa a tabela antes de renderizar

  usuarios.forEach((usuario, index) => {
    const novaLinha = document.createElement('tr');
    novaLinha.classList.add('border');
    novaLinha.dataset.index = index; // Adiciona um atributo de dados com o índice
    novaLinha.innerHTML = `
      <td class="py-2"><code>${index + 1}</code></td>
      <td class="py-2"><code>${usuario.nome}</code></td>
      <td class="py-2"><code>${usuario.endereco}</code></td>
      <td class="py-2"><code>${usuario.telefone}</code></td>
      <td class="py-2"><code>${usuario.email}</code></td>
      <td class="py-2"><code>${usuario.sexo}</code></td>
      <td class="text-center">
        <button class="atualizar-btn px-2 bg-yellow-500 border-slate-900 rounded">Atualizar</button>
        <button class="excluir-btn bg-red-500 border-slate-900 rounded ms-3">Excluir</button>
      </td>
    `;
    tabela.appendChild(novaLinha);
  });
}

function validarFormulario() {
  const nome = document.getElementById('nome').value.trim();
  const endereco = document.getElementById('endereco').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const email = document.getElementById('email').value.trim();
  const sexo = document.getElementById('sexo').value.trim();

  if (!nome || !endereco || !telefone || !email || !sexo) {
    alert('Todos os campos devem ser preenchidos.');
    return false;
  }

  return true;
}

function adicionarUsuario() {
  const form = document.getElementById('formulario');
  const modalCadastro = new bootstrap.Modal(document.getElementById('modalCadastro'));
  const modalExcluir = new bootstrap.Modal(document.getElementById('modalExcluir'));
  let linhaParaAtualizarIndex = null; // Variável para armazenar o índice do usuário a ser atualizado

  document.getElementById('mostrarFormulario').addEventListener('click', () => {
    modalCadastro.show();  // Mostra o modal de cadastro/atualização
    form.reset(); // Limpa o formulário ao abrir
    linhaParaAtualizarIndex = null; // Reseta o índice de atualização ao abrir o formulário
    document.querySelector('.modal-title').textContent = 'Cadastro de Usuário'; // Define o título do modal
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return; // Interrompe a execução se a validação falhar
    }

    const nome = document.getElementById('nome').value;
    const endereco = document.getElementById('endereco').value;
    const telefone = document.getElementById('telefone').value;
    const email = document.getElementById('email').value;
    const sexo = document.getElementById('sexo').value;

    if (linhaParaAtualizarIndex !== null) {
      // Atualiza o usuário existente
      usuarios[linhaParaAtualizarIndex] = { nome, endereco, telefone, email, sexo };
    } else {
      // Adiciona um novo usuário
      usuarios.push({ nome, endereco, telefone, email, sexo });
    }

    renderizarTabela(usuarios); // Atualiza a tabela com os dados atuais
    modalCadastro.hide(); // Oculta o modal após o envio
    linhaParaAtualizarIndex = null; // Reseta o índice de atualização
  });

  // Delegar eventos de clique para os botões Atualizar e Excluir
  document.querySelector("table tbody").addEventListener('click', (e) => {
    if (e.target.classList.contains('excluir-btn')) {
      // Exclusão
      const linha = e.target.closest('tr');
      const index = parseInt(linha.dataset.index); // Obtém o índice do atributo de dados
      document.getElementById('confirmarExcluir').onclick = () => {
        usuarios.splice(index, 1); // Remove o usuário do array
        renderizarTabela(usuarios); // Atualiza a tabela com os dados atuais
        modalExcluir.hide();
      };
      modalExcluir.show(); // Mostra o modal de confirmação
    } else if (e.target.classList.contains('atualizar-btn')) {
      // Atualização
      const linha = e.target.closest('tr');
      linhaParaAtualizarIndex = parseInt(linha.dataset.index); // Obtém o índice do atributo de dados
      const usuario = usuarios[linhaParaAtualizarIndex];
      document.getElementById('nome').value = usuario.nome;
      document.getElementById('endereco').value = usuario.endereco;
      document.getElementById('telefone').value = usuario.telefone;
      document.getElementById('email').value = usuario.email;
      document.getElementById('sexo').value = usuario.sexo;
      document.querySelector('.modal-title').textContent = 'Atualização de Usuário'; // Define o título do modal
      modalCadastro.show(); // Mostra o modal para atualização
    }
  });
}
adicionarUsuario();

const inpPesquisa = document.getElementById('searchInput');

inpPesquisa.addEventListener('input', ()=> {
  pesquisar(usuarios)
})

function pesquisar(usuarios) {
  const substring = inpPesquisa.value;
  const filtro = document.getElementById('selectFiltro').value;
  const Substring = substring.toLowerCase();
  const usuariosBusca = usuarios.filter(item => {
      if (filtro === "id") {
          return String(item.index).toLowerCase().includes(Substring);
      } else {
          return item.nome.toLowerCase().includes(Substring);
      }
  });

  renderizarTabela(usuariosBusca);
}