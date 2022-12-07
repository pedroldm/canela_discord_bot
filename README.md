# #canela Discord Bot

```
{prefix}trackprice <url> - Consulta o preço do produto e o adiciona a uma rotina de consultas automatizadas que alerta o usuário em caso de alteração
{prefix}trackobject <code> - Consulta o status atual de uma encomenda dos Correios. Rotina de consultas pendente de desenvolvimento
```

## Sites Mapeados

### Nacionais

* kabum.com.br
* amazon.com.br
* pichau.com.br
* terabyteshop.com.br
* store.steampowered.com

## Dependências

`discord.js` : API do Discord para desenvolvimento de bots\
`playwright` : Pacote desenvolvido para automação de testes de aplicativos web. Utilizado aqui para fins de *web scrapping* em websites que não aceitam requisições HTTP externas a navegadores
`xhr2` : Suporte a protocolo HTTP e HTTPS
