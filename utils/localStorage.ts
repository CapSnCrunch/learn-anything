export const save = (key: string, value: any): void => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const load = (key: string): any => {
  const data = window.localStorage.getItem(key);

  try {
    return data ? JSON.parse(data) : data;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
};

export const remove = (key: string): void => {
  window.localStorage.removeItem(key);
};

export const clear = (): void => {
  window.localStorage.clear();
};
