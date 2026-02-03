let carrinho = [];
let total = 0;
let totalItens = 0;
let pagamentoSelecionado = "";
let taxaEntrega = 5;

const lista = document.getElementById("listaCarrinho");
const totalEl = document.getElementById("total");
const contador = document.getElementById("contador");
const btnFinalizar = document.getElementById("btnFinalizar");
const btnVerPedido = document.querySelector(".ver-pedido");

function irPara(id, botao) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  document.querySelectorAll(".categorias button").forEach(b => b.classList.remove("ativo"));
  botao.classList.add("ativo");
}

function mais(btn) {
  btn.parentElement.querySelector(".qtd").innerText++;
}

function menos(btn) {
  let qtd = btn.parentElement.querySelector(".qtd");
  if (qtd.innerText > 1) qtd.innerText--;
}

function adicionar(btn, nome, preco) {
  let item = btn.closest(".item");
  let qtd = parseInt(item.querySelector(".qtd").innerText);
  let obs = item.querySelector("textarea").value;

  let extras = [];
  let extraValor = 0;

  item.querySelectorAll("input:checked").forEach(e => {
    let [nomeExtra, valor] = e.value.split("|");
    extras.push(nomeExtra);
    extraValor += parseFloat(valor);
    e.checked = false;
  });

  let subtotal = (preco + extraValor) * qtd;

  let existente = carrinho.find(i =>
    i.nome === nome &&
    i.obs === obs &&
    i.extrasTexto === extras.join(", ")
  );

  if (existente) {
    existente.qtd += qtd;
    existente.subtotal += subtotal;
  } else {
    carrinho.push({
      nome,
      qtd,
      obs,
      extrasTexto: extras.join(", "),
      subtotal
    });
  }

  total += subtotal;
  totalItens += qtd;

  contador.innerText = totalItens;
  atualizarCarrinho();

  btn.innerText = "✔ Adicionado";
  btn.style.background = "#25d366";
  setTimeout(() => {
    btn.innerText = "Adicionar";
    btn.style.background = "";
  }, 1000);

  item.querySelector(".qtd").innerText = 1;
  item.querySelector("textarea").value = "";
}

function atualizarCarrinho() {
  lista.innerHTML = "";
  carrinho.forEach((i, index) => {
    lista.innerHTML += `
      <li class="item-carrinho">
        <div>
          <strong>${i.nome}</strong><br>
          <span style="opacity:.7">Qtd: ${i.qtd}</span><br>
          ${i.extrasTexto ? "➕ " + i.extrasTexto + "<br>" : ""}
          ${i.obs ? "📝 " + i.obs + "<br>" : ""}
          <strong>R$ ${i.subtotal.toFixed(2)}</strong>
        </div>
        <span class="deletar" onclick="removerItem(${index})">🗑️</span>
      </li>
    `;
  });

  totalEl.innerText = `Total: R$ ${(total + taxaEntrega).toFixed(2)} (Entrega R$ ${taxaEntrega.toFixed(2)})`;
  btnVerPedido.innerHTML = `Ver pedido (R$ ${(total + taxaEntrega).toFixed(2)})`;
}

function removerItem(index) {
  total -= carrinho[index].subtotal;
  totalItens -= carrinho[index].qtd;
  carrinho.splice(index, 1);
  contador.innerText = totalItens;
  atualizarCarrinho();
}

function abrirCarrinho() {
  document.getElementById("carrinho").classList.add("aberto");
  document.getElementById("overlay").style.display = "block";
}

function fecharCarrinho() {
  document.getElementById("carrinho").classList.remove("aberto");
  document.getElementById("overlay").style.display = "none";
}

function selecionarPagamento(btn) {
  document.querySelectorAll(".pagamentos button").forEach(b => b.classList.remove("ativo"));
  btn.classList.add("ativo");
  pagamentoSelecionado = btn.innerText;
  btnFinalizar.disabled = false;

  document.getElementById("trocoBox").style.display =
    pagamentoSelecionado === "Dinheiro" ? "block" : "none";
}

function finalizarPedido() {
  if (carrinho.length === 0) return;

  const endereco = document.getElementById("endereco").value.trim();
  const bairro = document.getElementById("bairro").value.trim();

  // se não preencher, simplesmente não envia
  if (!endereco || !bairro) return;

  let msg = "🧾 *NOVO PEDIDO*\n\n";

  carrinho.forEach(i => {
    msg += `🍔 *${i.nome}* — ${i.qtd}x\n`;
    if (i.extrasTexto) msg += `➕ ${i.extrasTexto}\n`;
    if (i.obs) msg += `📝 ${i.obs}\n`;
    msg += "\n";
  });

  msg += `🚴 *Entrega:* R$ ${taxaEntrega.toFixed(2)}\n`;
  msg += `💰 *Total:* R$ ${(total + taxaEntrega).toFixed(2)}\n`;
  msg += `💳 *Pagamento:* ${pagamentoSelecionado}\n`;
  msg += `📍 *Endereço:* ${endereco}\n`;
  msg += `🏘️ *Bairro:* ${bairro}\n`;

  if (pagamentoSelecionado === "Dinheiro") {
    const troco = document.getElementById("valorTroco").value;
    if (troco) {
      const calc = troco - (total + taxaEntrega);
      msg += `💵 *Troco para:* R$ ${troco}\n`;
      msg += `🔁 *Troco:* R$ ${calc.toFixed(2)}\n`;
    }
  }

  const telefone = "12988070269";
  window.open(`https://wa.me/${telefone}?text=${encodeURIComponent(msg)}`, "_blank");
}
