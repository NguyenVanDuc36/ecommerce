export function generateUniqueCode(prefix: string, existingCodes: string[]) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  const totalLength = 10;

  if (prefix.length >= totalLength) {
    throw new Error(
      'Prefix is too long. Total length of the code must be 10 characters.',
    );
  }

  const randomLength = totalLength - prefix.length;
  let newCode;

  do {
    let randomPart = '';
    for (let i = 0; i < randomLength; i++) {
      randomPart += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    newCode = prefix + randomPart;
  } while (existingCodes.includes(newCode));

  return newCode;
}

export function getRndInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}
