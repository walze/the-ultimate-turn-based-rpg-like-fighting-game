export const getToken = (party: string) => {
  const data = {
    'https://daml.com/ledger-api': {
      ledgerId: 'sandbox',
      applicationId: process.env['APPLICATION_ID'] ?? 'daml-project',
      actAs: [party],
    },
  };

  return fetch('http://localhost:3000/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((response) => response.text());
};
