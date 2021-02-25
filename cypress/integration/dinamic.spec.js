///<reference types = "cypress"/>

describe('Dinamic tests', () => {

    beforeEach(() => {
        cy.visit("http://www.wcaquino.me/cypress/componentes.html")
    })

    // Array de comidas
    const foods = ['Carne', 'Frango', 'Pizza', 'Vegetariano']

    // Um Laço para todas as comidas 
    foods.forEach(food => {

        it(`Cadastro com comida ${food}`, () => {
            // Cadastro
            cy.get('#formNome').type('usuario')
            cy.get('#formSobrenome').type('Qualquer')
            cy.get(`[name = formSexo][value = M]`).click()
            // Varias comidas
            cy.xpath(`//label[contains(., '${food}')]/preceding-sibling::input`).click()
            cy.get('#formEscolaridade').select('Mestrado')
            cy.get('#formEsportes').select('Corrida')
            cy.get('#formCadastrar').click()
            // Assertiva do cadastro
            cy.get('#resultado > :nth-child(1)').should('have.text', 'Cadastrado!')
        })

    })

    it.only(`Deve selecionar todos usando o each`, () => {
        // Cadastro
        cy.get('#formNome').type('usuario')
        cy.get('#formSobrenome').type('Qualquer')
        cy.get(`[name = formSexo][value = M]`).click()
        
        // Vai marcar todas as comidas, menos vegetariano ** CHECKBOX **
        cy.get('[name=formComidaFavorita]').each($el => {
            // Só vai marcar se for diferente   
            if ($el.val() != 'vegetariano')
                cy.wrap($el).click()
        })

        cy.get('#formEscolaridade').select('Mestrado')
        cy.get('#formEsportes').select('Corrida')
        cy.get('#formCadastrar').click()
        
        // Assertiva do cadastro
        cy.get('#resultado > :nth-child(1)').should('have.text', 'Cadastrado!')
    })

})
