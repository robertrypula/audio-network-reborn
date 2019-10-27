// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

export const fileRead = (file: File): Promise<number[]> => {
  return new Promise<number[]>((resolve, reject): void => {
    const reader = new FileReader();

    if (file) {
      reader.onload = (): void => resolve(Array.from(new Uint8Array(reader.result as ArrayBuffer)));
      reader.readAsArrayBuffer(file);
    } else {
      reject('no file');
    }
  });
};

export const fileSave = (filename: string, bytes: number[]): void => {
  const blob = new Blob([new Uint8Array(bytes)]); // , { type: 'application/pdf' }
  const link: HTMLAnchorElement = document.createElement('a');

  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};
