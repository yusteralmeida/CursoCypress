/// <reference types='cypress'/>

describe('Esperas...', () => {
    before(() => {
        cy.visit("http://www.wcaquino.me/cypress/componentes.html")
    })

    beforeEach(() => {
        cy.reload()
    })

    it('Deve aguardar elemento estar disponível ', () => {
        //  verifica se não existe o campo
        cy.get('#novoCampo').should('not.exist')
        cy.get('#buttonDelay').click()
        cy.get('#novoCampo').should('not.exist')
        //  verifica se existe o campo
        cy.get('#novoCampo').should('exist')
        cy.get('#novoCampo').type('Funciona')

    })

    it.only('Deve fazer retrys', () => {
        cy.get('#novoCampo').should('not.exist')
        cy.get('#buttonDelay').click()
        cy.get('#novoCampo').should('not.exist')
        cy.get('#novoCampo')
            // .should('not.exist')
            .should('exist')
            .type('Funciona')
    })

    it.only('Uso do find', () => {
        cy.get('#buttonList').click()
        cy.get('#lista li')
            .find('span')
            .should('contain', 'Item 1')

        cy.get('#lista li')
            // .find('span')
            .should('contain', 'Item 2')
    })

    it.only('Uso de timeout', () => {
        // cy.get('#buttonDelay').click()
        // // timeout é o tempo de restrição para aparecer um elemento 
        // cy.get('#novoCampo', { timeout: 1000 }).should('exist')

        // cy.get('#buttonListDOM').click()
        // // cy.wait(6000) // Evita seu uso.
        // // ele vai esperar os 30 seg, mas quando elemento aparecer, ele vai prosseeguir
        // cy.get('#lista li span', {timeout: 30000}) 
        //     .should('contain', 'Item 2')

        cy.get('#buttonListDOM').click()
        cy.get('#lista li span')
            .should('have.length', 1)
        cy.get('#lista li span')
            .should('have.length', 2)
    })

    it.only('Click retry', () => {
        cy.get('#buttonCount')
            .click()
            .should('have.value', '11')
    })

    it.only('Should vs Then', () => {

        cy.get('#buttonListDOM').then($el => {
            expect($el).to.have.length(1)
        }).and('have.id', 'buttonListDOM')
    })

})