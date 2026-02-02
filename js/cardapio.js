let carrinho = [];
let total = 0;
let totalItens = 0;
let pagamentoSelecionado = "";
let trocoInfo = "";


const lista = document.getElementById("listaCarrinho");
const totalEl = document.getElementById("total");
const contador = document.getElementById("contador");
const btnFinalizar = document.getElementById("btnFinalizar");

function irPara(id, botao){
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  document.querySelectorAll(".categorias button").forEach(b=>b.classList.remove("ativo"));
  botao.classList.add("ativo");
}

function mais(btn){
  btn.parentElement.querySelector(".qtd").innerText++;
}

function menos(btn){
  let qtd = btn.parentElement.querySelector(".qtd");
  if(qtd.innerText > 1) qtd.innerText--;
}

function adicionar(btn, nome, preco){
  let item = btn.closest(".item");
  let qtd = parseInt(item.querySelector(".qtd").innerText);
  let obs = item.querySelector("textarea").value;

  let extras = [];
  let extraValor = 0;

  item.querySelectorAll("input:checked").forEach(e=>{
    let [nomeExtra, valor] = e.value.split("|");
    extras.push(nomeExtra);
    extraValor += parseFloat(valor);
  });

  let subtotal = (preco + extraValor) * qtd;

  carrinho.push({ nome, qtd, obs, extrasTexto: extras.join(", "), subtotal });

  total += subtotal;
  totalItens += qtd;

  contador.innerText = totalItens;
  atualizarCarrinho();
}

function atualizarCarrinho(){
  lista.innerHTML = "";
  carrinho.forEach((i, index)=>{
    lista.innerHTML += `
      <li class="item-carrinho">
        <div>
          <strong>${i.qtd}x ${i.nome}</strong><br>
          ${i.extrasTexto}<br>
          ${i.obs}<br>
          R$ ${i.subtotal.toFixed(2)}
        </div>
        <span class="deletar" onclick="removerItem(${index})">🗑️</span>
      </li>
    `;
  });
  totalEl.innerText = `Total: R$ ${total.toFixed(2)}`;
}

function removerItem(index){
  total -= carrinho[index].subtotal;
  totalItens -= carrinho[index].qtd;
  carrinho.splice(index,1);
  contador.innerText = totalItens;
  atualizarCarrinho();
}

function abrirCarrinho(){
  document.getElementById("carrinho").classList.add("aberto");
  document.getElementById("overlay").style.display = "block";
}

function fecharCarrinho(){
  document.getElementById("carrinho").classList.remove("aberto");
  document.getElementById("overlay").style.display = "none";
}

function selecionarPagamento(btn){
  document.querySelectorAll(".pagamentos button")
    .forEach(b => b.classList.remove("ativo"));

  btn.classList.add("ativo");
  pagamentoSelecionado = btn.innerText;
  btnFinalizar.disabled = false;

  const trocoBox = document.getElementById("trocoBox");

  if (pagamentoSelecionado === "Dinheiro") {
    trocoBox.style.display = "block";
  } else {
    trocoBox.style.display = "none";
    trocoInfo = "";
  }
}


function finalizarPedido(){
  let msg = "🧾 *NOVO PEDIDO*\n\n";

  carrinho.forEach(i => {
    msg += `🍔 *${i.qtd}x ${i.nome}*\n`;

    if (i.extrasTexto) {
      i.extrasTexto.split(",").forEach(extra => {
        msg += `• ${extra}\n`;
      });
    }

    if (i.obs && i.obs.trim() !== "") {
      msg += `⚠️ *OBS: ${i.obs}*\n`;
    }

    msg += "\n";
  });

  msg += `💰 *Total:* R$ ${total.toFixed(2)}\n`;
  msg += `💳 *Pagamento:* ${pagamentoSelecionado}`;

  const telefone = "12988070269"; // TROQUE PELO NÚMERO DO RESTAURANTE
  const url = `https://wa.me/${telefone}?text=${encodeURIComponent(msg)}`;

  window.open(url, "_blank");
}
