/// <reference types='cypress'/>


describe('Fixture', () => {
    // Nos parâmetros de it tem de ser function () {} não Arrow () => {} 
    it('get data form fixture file', function () {
        cy.visit("http://www.wcaquino.me/cypress/componentes.html")

        // um arquivo json, da pasta fixtures 
        cy.fixture('userData').as('usuario').then(() => {

            // Cadastro
            cy.get('#formNome').type(this.usuario.nome)
            cy.get('#formSobrenome').type(this.usuario.sobrenome)
            cy.get(`[name=formSexo][value=${this.usuario.sexo}]`).click()
            cy.get(`[name=formComidaFavorita][value=${this.usuario.comida}]`).click()
            cy.get('#formEscolaridade').select(this.usuario.escolaridade)
            cy.get('#formEsportes').select(this.usuario.esportes)
        })

        cy.get('#formCadastrar').click()
        // Assertiva do cadastro
        cy.get('#resultado > :nth-child(1)').should('have.text', 'Cadastrado!')
        

    })

})