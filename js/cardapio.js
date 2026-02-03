let carrinho = [];
let total = 0;
let totalItens = 0;
let pagamentoSelecionado = "";
let trocoInfo = "";

const lista = document.getElementById("listaCarrinho");
const totalEl = document.getElementById("total");
const contador = document.getElementById("contador");
const btnFinalizar = document.getElementById("btnFinalizar");

/* navegação */
function irPara(id, botao){
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  document.querySelectorAll(".categorias button").forEach(b=>b.classList.remove("ativo"));
  botao.classList.add("ativo");
}

/* quantidade */
function mais(btn){
  btn.parentElement.querySelector(".qtd").innerText++;
}

function menos(btn){
  let qtd = btn.parentElement.querySelector(".qtd");
  if(qtd.innerText > 1) qtd.innerText--;
}

/* adicionar item */
function adicionar(btn, nome, preco){
  const item = btn.closest(".item");
  const qtd = parseInt(item.querySelector(".qtd").innerText);
  const obs = item.querySelector("textarea").value;

  let extras = [];
  let extraValor = 0;

  item.querySelectorAll("input:checked").forEach(e=>{
    const [nomeExtra, valor] = e.value.split("|");
    extras.push(nomeExtra);
    extraValor += parseFloat(valor);
  });

  const subtotal = (preco + extraValor) * qtd;

  carrinho.push({
    nome,
    qtd,
    obs,
    extrasTexto: extras.join(", "),
    subtotal
  });

  total += subtotal;
  totalItens += qtd;

  contador.innerText = totalItens;
  atualizarCarrinho();

  /* feedback visual */
  btn.innerText = "Adicionado ✔";
  btn.classList.add("adicionado");

  setTimeout(()=>{
    btn.innerText = "Adicionar";
    btn.classList.remove("adicionado");
  }, 1200);
}

/* carrinho */
function atualizarCarrinho(){
  lista.innerHTML = "";

  carrinho.forEach((i, index)=>{
    lista.innerHTML += `
      <li class="item-carrinho">
        <div>
          <strong>${i.nome}</strong>
          <span class="qtd-item">${i.qtd}x</span><br>

          ${i.extrasTexto ? `<small>+ ${i.extrasTexto}</small><br>` : ""}
          ${i.obs ? `<small>Obs: ${i.obs}</small><br>` : ""}

          <strong>R$ ${i.subtotal.toFixed(2)}</strong>
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

/* carrinho abrir/fechar */
function abrirCarrinho(){
  document.getElementById("carrinho").classList.add("aberto");
  document.getElementById("overlay").style.display = "block";
}

function fecharCarrinho(){
  document.getElementById("carrinho").classList.remove("aberto");
  document.getElementById("overlay").style.display = "none";
}

/* pagamento */
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

/* troco */
function calcularTroco(){
  trocoInfo = "";

  if (pagamentoSelecionado !== "Dinheiro") return;

  const precisaTroco = document.querySelector('input[name="troco"]:checked').value;
  const valorPago = parseFloat(document.getElementById("valorTroco").value);

  if (precisaTroco === "sim" && valorPago && valorPago >= total) {
    const troco = valorPago - total;
    trocoInfo =
      `\n💵 *Pagou com:* R$ ${valorPago.toFixed(2)}` +
      `\n🔁 *Troco:* R$ ${troco.toFixed(2)}`;
  }
}

/* whatsapp */
function finalizarPedido(){
  let msg = "🧾 *NOVO PEDIDO*\n\n";

  carrinho.forEach(i => {
    msg += `🍔 *${i.nome}*   ${i.qtd}x\n`;

    if (i.extrasTexto) {
      i.extrasTexto.split(",").forEach(extra => {
        msg += `• ${extra}\n`;
      });
    }

    if (i.obs) {
      msg += `⚠️ Obs: ${i.obs}\n`;
    }

    msg += "\n";
  });

  msg += `💰 *Total:* R$ ${total.toFixed(2)}\n`;
  msg += `💳 *Pagamento:* ${pagamentoSelecionado}`;

  if (pagamentoSelecionado === "Dinheiro" && trocoInfo) {
    msg += trocoInfo;
  }

  const telefone = "12988070269";
  const url = `https://wa.me/${telefone}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
}
