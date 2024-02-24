export async function isValidIntra(intra) {
  const apiUrl = `http://localhost/api/user/${intra}/`;
  try {
    const response = await fetch(apiUrl);
    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}
