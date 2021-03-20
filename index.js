const puppeteer = require('puppeteer'); //acessa a pagina
const url = 'http://138.68.161.169:31337'; //url a ser acessado
const md5 = require('md5'); //para encriptar

(async ()=>{
    //da o comando para iniciar o navegador
    const browser = await puppeteer.launch({
        headless: false //ira mostrar o navegador
    });
    const page = await browser.newPage();//carrega uma nova pagina
    await page.goto(url);//carrega a url pré estabelecida e segue para a página

    //essa função serve para mandar o código para a página e você podera acessa-la pelo window do js
    await page.exposeFunction('md5', txt => {
        return md5(txt);//essa função sera mandada para o window e serve para gerar o hash
    });
    //essa função ira iniciar uma inserção de javascript direto na página para pegar as informações necessariás
    //e manipula-las e envia-las
    await page.evaluate(async () => {
        //seleciona o local onde esta o texto para o hash e pega a string
        const textoParaEncriptar = document.querySelector('h3').textContent;
        //transforma o texto selecionado em hash md5
        const textoEncriptado = await window.md5(textoParaEncriptar);
        //seleciona o input onde o dado deve ser inserido e o insere 
        document.querySelector('input[name=hash]').setAttribute('value', textoEncriptado);
        //envia o formulário
        document.querySelector('input[type=submit]').click();
    });
})();
