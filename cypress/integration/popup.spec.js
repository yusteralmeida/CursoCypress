/// <reference types='cypress'/>

describe('Work with Popup', () => {
    it('Deve testar popup diretamente', () => {
        // Endereço de um iframe
        cy.visit("http://www.wcaquino.me/cypress/frame.html")

        cy.get('#otherButton').click()
        cy.on('window:alert', msg => { expect(msg).to.be.equal('Click OK!') })
    })

    it('Deve verificar se o popup foi invocado', () => {
        // Endereço da página
        cy.visit("http://www.wcaquino.me/cypress/componentes.html")

        // Verifica se um popup foi invocado ou não
        cy.window().then(win => {
            // open é o método para invocar o popup 
            cy.stub(win, 'open').as('winOpen')
        })
        cy.get('#buttonPopUp').click()
        cy.get('@winOpen').should('be.called')
    })
})

describe.only('With links...', () => {

    beforeEach(() => {
        cy.visit("http://www.wcaquino.me/cypress/componentes.html")
    })

    it('Check popup url', () => {
        cy.contains('Popup2')
            .should('have.prop', 'href')// tem  propriedade
            .and('equal', 'http://www.wcaquino.me/cypress/frame.html')
    })

    it('Should acess popup dinamically', () => {
        cy.contains('Popup2').then($a => {
            const href = $a.prop('href')
            cy.visit(href)
        })

    })

    it('Should force link on same page', () => {
        cy.contains('Popup2').
            // removeAttr método do JQuary
            invoke('removeAttr', 'target')
            .click()

        cy.get('#tfield').type('funciona')
    })

})
