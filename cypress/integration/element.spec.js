/// <reference types="cypress"/>

describe('Work with basic elements', () => {

    // antes de cada um dos testes
    before(() => {
        cy.visit("http://www.wcaquino.me/cypress/componentes.html")
    })

    beforeEach(() => {
        cy.reload()
    })

    it('Text', () => {
        cy.get('body').should('contain', 'Cuidado')
        cy.get('span').should('contain', 'Cuidado')
        cy.get('.facilAchar').should('contain', 'Cuidado')
        cy.get('.facilAchar').should('have.text', 'Cuidado onde clica, muitas armadilhas...')

    })

    it('Links', () => {

        cy.get('[href="#"]').click()
        cy.get('#resultado').should('have.text', 'Voltou!')

        // atulizar a página
        cy.reload()
        // verificar se não existe  
        cy.get('#resultado').should('have.not.text', 'Voltou!')
        cy.contains('Voltar').click()
        cy.get('#resultado').should('have.text', 'Voltou!')
    })

    it('TextFields', () => {

        cy.get('#formNome').type('Cypress Test')
        cy.get('#formNome').should('have.value', 'Cypress Test')

        // preciso colocar mais uma barra para poder ver o dois pontos
        cy.get('#elementosForm\\:sugestoes')
            .type('textArea')
            .should('have.value', 'textArea')
        cy.get('#tabelaUsuarios > :nth-child(2) > :nth-child(1) > :nth-child(6) > input').type('???')

        // apaga os elementos {backspace}
        cy.get('[data-cy=dataSobrenome]').type('Teste12345{backspace}{backspace}').should('have.value', 'Teste123')

        cy.get('#elementosForm\\:sugestoes')
            .clear()// limpa a area
            .type('Erro{selectall}acerto', { delay: 100 })// apaga tudo e coloca acerto // delay é para desacelerar  
            .should('have.value', 'acerto')
    })

    it('RadioButton', () => {
        cy.get('#formSexoFem')
            .click()
            .should('be.checked')

        cy.get('#formSexoMasc')
            .should('be.not.checked')

        cy.get('[name=formSexo]').should('have.length', 2)
    })

    it('CheckBox', () => {
        cy.get('#formComidaPizza')
            .click()
            .should('be.checked')

        // Agrupado pelo name. Clica em todos 
        cy.get('[name=formComidaFavorita]').click({ multiple: true })

        cy.get('#formComidaPizza')
            .should('be.not.checked')


    })

    it.only('ComboBox', () => {

        cy.get('[data-test=dataEscolaridade]')
            .select('Superior')
            .should('have.value', 'superior')

        cy.get('[data-test=dataEscolaridade]')
            .select('1o grau incompleto')
            .should('have.value', '1grauincomp')

        cy.get('[data-test=dataEscolaridade] option').should('have.length', 8)

        // Pega as opções e colocar em um array
        cy.get('[data-test=dataEscolaridade] option').then($arr => {
            const values = []
            $arr.each(function () {
                values.push(this.innerHTML)
            })
            expect(values).to.include.members(["Superior", "Mestrado"])
        })

    })

    it.only('Combo multiplo', () => {

        cy.get('[data-testid=dataEsportes]').select(['natacao', 'Corrida', 'nada'])
        // o val() pega os valores 
        cy.get('[data-testid=dataEsportes]').then($el => {
            expect($el.val()).to.be.deep.equal(['natacao', 'Corrida', 'nada'])
            expect($el.val()).to.have.length(3)
        })

        cy.get('[data-testid=dataEsportes]')
            .invoke('val')
            .should('eql', ['natacao', 'Corrida', 'nada'])


    })
})