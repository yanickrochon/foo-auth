import { createCSRFToken, verifyCSRFToken } from '../../src/encryption/csrf';



describe('Testing CSRF tokens', () => {
  const SECRET = '4468e5deabf5e6d0740cd1a77df56f67';


  it('should create and validate CSRF token', () => {
    const token = createCSRFToken({ secret:SECRET });

    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);

    const verified = verifyCSRFToken({ token, secret:SECRET });

    expect(verified).toBe(true);
  });

});