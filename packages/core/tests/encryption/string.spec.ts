import { encrypt, decrypt } from '../../src/encryption/string';



describe('Testing string encryption and decryption', () => {
  const SECRET = 'd14a028c2a3a2bc9476102bb288234c415a2b01f828ea62ac5b3e42f';  // only first 32 bytes are used


  it('should encrypt and decrypt values', () => {
    const value = { foo:'Hello world' };

    const encrypted = encrypt({ text:JSON.stringify(value), secret:SECRET });

    expect(typeof encrypted).toBe('string');
    expect(encrypted.length).toBeGreaterThan(0);

    const decrypted = decrypt({ encrypted, secret:SECRET });

    expect(JSON.parse(decrypted!)).toEqual(value);
  });

  it('should fail to decrypt value', () => {
    const failed = decrypt({ encrypted: 'test', secret:SECRET });

    expect(failed).toBeNull();
  });

});