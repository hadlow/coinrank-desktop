import { CryptochartsPage } from './app.po';

describe('cryptocharts App', () => {
  let page: CryptochartsPage;

  beforeEach(() => {
    page = new CryptochartsPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
