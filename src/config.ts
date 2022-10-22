const encode = async (data: unknown) => {
  const secret = 'sec-demo'; // the secret key
  const enc = new TextEncoder();

  const algorithm = { name: 'HMAC', hash: 'SHA-256' };

  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    algorithm,
    false,
    ['sign', 'verify'],
  );

  const signature = await crypto.subtle.sign(
    algorithm.name,
    key,
    enc.encode(JSON.stringify(data)),
  );

  const digest = btoa(
    String.fromCharCode(...new Uint8Array(signature)),
  );

  return digest;
};

export const token = (party: string) =>
  encode({
    'https://daml.com/ledger-api': {
      ledgerId: 'sandbox',
      applicationId: process.env['APPLICATION_ID'] ?? 'daml-project',
      actAs: [party],
    },
  });
