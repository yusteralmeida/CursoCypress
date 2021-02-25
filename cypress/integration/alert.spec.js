///<reference types = "cypress"/>

describe('Work with alert', () => {

    before(() => {
        cy.visit("http://www.wcaquino.me/cypress/componentes.html")
    })

    beforeEach(() => {
        cy.reload()
    })

    it.only('Alert yuster', () => {
        // // loqueito do botão 
        // cy.get('#alert').click()
        // // "on" Pega eventos que ocorre na nossa tela
        // cy.on('window:alert', msg => {
        //     expect(msg).to.be.equal('Alert Simples')
        // })

        // metodo do arquivo support.commands.js
        cy.clickAlert('#alert', 'Alert Simples')
    })

    it('Alert com mock', () => {
        // as é para colocar um nome
        const stub = cy.stub().as('Alerta')
        // "on" Pega eventos que ocorre na nossa tela
        // toda vez que um alert for invocado o stub pega a msg 
        cy.on('window:alert', stub)
        // Loqueito do botão
        cy.get('#alert').click().then(() => {
            //getCall(0) pega a chamada, e o zero é o primeiro índice
            //calledWith() é os parametros que eu espero ter chamado
            expect(stub.getCall(0)).to.be.calledWith('Alert Simples')
        })
    })

    it('Confirm', () => {

        // Duas caixas aparecem na tela

        // ** CONFIRM ** 
        cy.on('window:confirm', msg => {
            expect(msg).to.be.equal('Confirm Simples')
        })

        // ** ALERT **
        cy.on('window:alert', msg => {
            expect(msg).to.be.equal('Confirmado')
        })

        // loqueito do botão 
        cy.get('#confirm').click()
    })

    it('Deny', () => {

        // Duas caixas aparecem na tela

        // ** CONFIRM ** 
        cy.on('window:confirm', msg => {
            expect(msg).to.be.equal('Confirm Simples')
            // para escolher a confirmação, é só tirar o return false e colocar Confirmado no segundo teste
            return false
        })

        // preciso retornar falso no primeiro confirm e depois pega a msg de negação 
        // ** ALERT **
        cy.on('window:alert', msg => {
            expect(msg).to.be.equal('Negado')
        })

        // loqueito do botão 
        cy.get('#confirm').click()
    })

    it('Prompt', () => {

        cy.window().then(win => {
            // digitar na tela
            cy.stub(win, 'prompt').returns('42')
        })

        cy.on('window:confirm', msg => {
            expect(msg).to.be.equal('Era 42?')
        })

        cy.on('window:alert', msg => {
            expect(msg).to.be.equal(':D')
        })

        // Tem de ser aqui o clique do botão
        cy.get('#prompt').click()
    })

    it('Validando msgs', () => {

        // Serve para pegar as mensagens
        const stub = cy.stub().as('Alerta')

        // Monitora os alerts
        cy.on('window:alert', stub)

        // Clique botão CADASTRAR
        cy.get('#formCadastrar').click().then(() => {
            expect(stub.getCall(0)).to.be.calledWith('Nome eh obrigatorio')
        })

        // Escrever NOME
        cy.get('#formNome').type('Yuster')

        // Clique botão CADASTRAR
        cy.get('#formCadastrar').click().then(() => {
            expect(stub.getCall(1)).to.be.calledWith('Sobrenome eh obrigatorio')
        })

        // Escrever SOBRENOME
        cy.get('[data-cy=dataSobrenome]').type('Almeida')

        // Clique botão CADASTRAR
        cy.get('#formCadastrar').click().then(() => {
            expect(stub.getCall(2)).to.be.calledWith('Sexo eh obrigatorio')
        })

        // Clique botão SEXO
        cy.get('#formSexoMasc').click()

        // Clique botão CADASTRAR
        cy.get('#formCadastrar').click()

        // Assertiva no final do cadastro 
        cy.get('#resultado > :nth-child(1)').should('have.text', 'Cadastrado!')
    })
})