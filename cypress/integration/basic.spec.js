/// <reference types="cypress"/>

describe('Cypress basics', () => {

    it.only('Should visit a page and assert title', () => {
        cy.visit("http://www.wcaquino.me/cypress/componentes.html")

        // Errado
        // const title = cy.title()
        // console.log(title)

        // cy.pause()

        cy.title().should('be.equal', 'Campo de Treinamento')
        cy.title()
            // .debug()
            .should('contain', 'Campo de Treinamento')

        cy.title().should('be.equal', 'Campo de Treinamento')
            .and('contain', 'Campo')

        let syncTitle

        // pegando o titulo da página
        // só posso usar o then, não o should
        cy.title().then(title => {
            console.log(title)
            cy.get('#formNome').type(title)

            syncTitle = title
        })


        cy.get('[data-cy=dataSobrenome]').then($el => {
            $el.val(syncTitle)// via JQquery
        })

        cy.get('#elementosForm\\:sugestoes').then($el => {
            cy.wrap($el).type(syncTitle)// via wrap
        })
    })

    // only é para executar apenas esse teste
    it('Should find and interact with an element', () => {
        // Procura o site
        cy.visit("http://www.wcaquino.me/cypress/componentes.html")

        // Clicando e fazendo a assertiva 
        cy.get('#buttonSimple')
            .click()
            .should('have.value', 'Obrigado!')

    })
})