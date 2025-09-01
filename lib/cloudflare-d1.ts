export const CLOUDFLARE_CONFIG = {
  accountId: '7979421604bd07b3bd34d3ed96222512',
  databaseId: 'f8655bac-448d-4ba5-ac07-ee81e83a4408',
  apiToken: 'ijkVhaXCw6LSddIMIMxwPL5CDAWznxip5x9I1bNW'
};

export async function executeSqlOnD1(sql: string, params: any[] = []) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_CONFIG.accountId}/d1/database/${CLOUDFLARE_CONFIG.databaseId}/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_CONFIG.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sql,
        params
      })
    }
  );

  if (!response.ok) {
    throw new Error(`D1 API Error: ${response.statusText}`);
  }

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(`D1 Query Error: ${JSON.stringify(data.errors)}`);
  }

  return data;
}