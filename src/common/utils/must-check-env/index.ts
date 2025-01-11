export const mustCheckEnv = (...names: string[]) => {
  const empty = names.filter((k) => !process.env[k]);
  if (empty.length) {
    throw new Error(`Missing env ${empty.join(', ')}`);
  }
};

export const mustCheckEnvValues = (name: string, values: string[]) => {
  const v = process.env[name] as string;
  if (!values.includes(v)) {
    throw new Error(`Invalid env ${name}=${v} expect ${values.join(' | ')}`);
  }
};
