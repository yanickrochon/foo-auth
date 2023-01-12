import { createCSRFToken, verifyCSRFToken } from '../../src/encryption/csrf';



describe('Testing CSRF tokens', () => {

  it('should create and validate CSRF token', () => {
    const token = createCSRFToken();

    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);

    const verified = verifyCSRFToken({ token });

    expect(verified).toBe(true);
  });

});