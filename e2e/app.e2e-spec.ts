import { OmaFrontPage } from './app.po';

describe('oma-front App', () => {
  let page: OmaFrontPage;

  beforeEach(() => {
    page = new OmaFrontPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
