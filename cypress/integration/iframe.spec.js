/// <reference types = 'cypress'/>

describe('Work with iFrames', () => {

    it('Deve preencher campo de texto', () => {
        cy.visit("http://www.wcaquino.me/cypress/componentes.html")

        // id do iframe
        cy.get('#frame1').then(iframe => {

            const body = iframe.contents().find('body')
            // 'tfield' ID do ELEMENTO
            // find é para encontrar na página o elemento
            cy.wrap(body).find('#tfield')
                .type('Funciona???')
                .should('have.value', 'Funciona???')

            cy.on('window:alert', msg => {
                expect(msg).to.be.equal('Alert Simples')

            })

            // cy.wrap(body).find('#otherButton').click()
        })
    })

    it('Deve testar frame diretamente', () => {
        // endereço de um iframe
        cy.visit("http://www.wcaquino.me/cypress/frame.html")

        cy.get('#otherButton').click()
        cy.on('window:alert', msg => {
            expect(msg).to.be.equal('Click OK!')

        })

    })
})