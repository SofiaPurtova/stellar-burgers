import cypress from 'cypress';
import { deleteCookie, setCookie } from '../../src/utils/cookie';

describe('Тестирование конструктора бургеров', () => {
  before(() => {
    // Мокируем данные перед всеми тестами
    cy.fixture('ingredients.json').as('ingredientsData');
    cy.fixture('user.json').as('userData');
    cy.fixture('order.json').as('orderData');
  });

  beforeEach(() => {
    // Настройка моков для API
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );

    // Авторизация
    window.localStorage.setItem('refreshToken', 'test-refresh-token');
    cy.setCookie('accessToken', 'test-access-token');
    cy.visit('http://localhost:4000');
  });

  afterEach(() => {
    // Очистка после каждого теста
    window.localStorage.removeItem('refreshToken');
    cy.clearCookie('accessToken');
  });

  context('Работа с ингредиентами', () => {
    it('Должен отображать список ингредиентов', () => {
      cy.get('h3').contains('Булки').next('ul').should('exist');
      cy.get('h3').contains('Начинки').next('ul').should('exist');
      cy.get('h3').contains('Соусы').next('ul').should('exist');
    });

    it('Должен добавлять булку в конструктор', () => {
      cy.get('h3')
        .contains('Булки')
        .next('ul')
        .find('li')
        .eq(1)
        .contains('Добавить')
        .click();
      cy.get('div').contains('Выберите булки').should('not.exist');
    });

    it('Должен добавлять начинку в конструктор', () => {
      cy.get('h3')
        .contains('Начинки')
        .next('ul')
        .find('li')
        .eq(2)
        .contains('Добавить')
        .click();
      cy.get('div').contains('Выбирете начинку').should('not.exist');
    });
    it('Должен добавлять соус в конструктор', () => {
      cy.get('h3')
        .contains('Соусы')
        .next('ul')
        .find('li')
        .eq(2)
        .contains('Добавить')
        .click();
    });
  });

  context('Модальные окна', () => {
    it('Должен открывать модальное окно с деталями ингредиента', () => {
      cy.get('h3').contains('Булки').next('ul').find('li').first().click();
      cy.get('#modals').contains('Детали ингредиента').should('exist');
      cy.get('h3').contains('Краторная булка N-200i').should('exist');
    });

    it('Должен закрывать модальное окно по клику на крестик', () => {
      cy.get('h3').contains('Булки').next('ul').find('li').first().click();
      cy.get('#modals').find('button').click();
      cy.get('#modals').contains('Детали ингредиента').should('not.exist');
    });
  });

  context('Создание заказа', () => {
    it('Должен создавать заказ и показывать номер', () => {
      // Добавляем ингредиенты в конструктор
      cy.get('h3').contains('Булки').next('ul').should('exist');
      cy.get('h3')
        .contains('Булки')
        .next('ul')
        .find('li')
        .eq(0)
        .contains('Добавить')
        .click();
      cy.get('h3').contains('Булки').next('ul').find('li').eq(0).contains('2');
      cy.get('div').contains('Выбирете булку').should('not.exist');

      cy.get('h3').contains('Соусы').next('ul').should('exist');
      cy.get('h3')
        .contains('Соусы')
        .next('ul')
        .find('li')
        .eq(0)
        .contains('Добавить')
        .click();
      cy.get('h3').contains('Соусы').next('ul').find('li').eq(0).contains('1');

      cy.get('h3').contains('Начинки').next('ul').should('exist');
      cy.get('h3')
        .contains('Начинки')
        .next('ul')
        .find('li')
        .eq(3)
        .contains('Добавить')
        .click();
      cy.get('h3')
        .contains('Начинки')
        .next('ul')
        .find('li')
        .eq(3)
        .contains('1');
      cy.get('div').contains('Выберите начинку').should('not.exist');

      cy.get('h3')
        .contains('Начинки')
        .next('ul')
        .find('li')
        .eq(4)
        .contains('Добавить')
        .click();
      cy.get('h3')
        .contains('Начинки')
        .next('ul')
        .find('li')
        .eq(4)
        .contains('1');

      cy.get('h3')
        .contains('Начинки')
        .next('ul')
        .find('li')
        .eq(7)
        .contains('Добавить')
        .click();
      cy.get('h3')
        .contains('Начинки')
        .next('ul')
        .find('li')
        .eq(7)
        .contains('1');

      // Оформляем заказ
      cy.get('div').contains('Оформить заказ').click();
      cy.get('#modals').should('exist');

      // Проверяем модальное окно
      cy.get('#modals').contains('идентификатор заказа').should('exist');
      cy.get('h2').contains('75388').should('exist');

      // Закрываем модальное окно
      cy.get('#modals').find('button').click();
      cy.get('#modals').contains('идентификатор заказа').should('not.exist');

      // Проверяем очистку конструктора
      cy.get('div').contains('Выберите булки').should('exist');
      cy.get('div').contains('Выберите начинку').should('exist');
    });
  });
});
