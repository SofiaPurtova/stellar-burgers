describe('проверяем доступность приложения', function () {
  it('сервис должен быть доступен по адресу http://localhost:4000', function () {
    cy.visit('http://localhost:4000');
  });
});
