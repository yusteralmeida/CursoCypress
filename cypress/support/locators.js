// Uma variável com um objeto que vai ter varios atributos 
const locators = {

    // Outros objetos
    LOGIN: {
        USER: '[data-test=email]',
        PASSWORD: '[data-test=passwd]',
        BTN_LOGIN: '.btn'
    },

    MENU: {
        HOME: '[data-test=menu-home]',
        SETTIGNS: '[data-test=menu-settings] > .fas',
        CONTAS: '[href="/contas"]',
        RESET: '[href="/reset"]',
        MOVIMENTACAO: '[data-test=menu-movimentacao]',
        EXTRATO: '[data-test=menu-extrato]'
    },

    CONTAS: {
        NOME: '[data-test=nome]',
        BTN_SALVAR: '.btn',
        // Função anônima
        FN_BTN_XPATH_ALTERAR: nome => `//*[text()='${nome}']/..//i[@class='far fa-edit']`
    },

    MOVIMENTACAO: {
        DESCRICAO: '[data-test=descricao]',
        VALOR: '[data-test=valor]',
        INTERESSADO: '[data-test=envolvido]',
        CONTA: '[data-test=conta]',
        STATUS: '[data-test=status]',
        BTN_SALVAR: '.btn-primary'

    },
    SALDO: {
        // Função anônima
        FN_XP_SALDO_CONTA: nome => `//td[contains(., '${nome}')]/../td[2]`
    },
    EXTRATO: {
        LINHAS: '.list-group li',
        // Funções anônimas
        FN_XP_BUSCA_ELEMENTO: (desc, value) => `//span[contains(., '${desc}')]/../small[contains(., '${value}')]`,
        FN_REMOVER_ELEMENTO: conta => `//span[contains(., '${conta}')]/../../..//*[@class='far fa-trash-alt']`,
        FN_ALTERAR_ELEMENTO: conta => `//span[contains(., '${conta}')]/../../..//*[@class='fas fa-edit']`
    },

    MESSAGE: '.toast-message'
}
// Para poder EXPORTAR ele 
export default locators