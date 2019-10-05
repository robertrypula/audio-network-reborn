// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

export const getById = (id: string): HTMLElement => document.getElementById(id) as HTMLElement;
export const getByIdInput = (id: string): HTMLInputElement => document.getElementById(id) as HTMLInputElement;
export const getByTagName = (tag: string): HTMLElement => document.getElementsByTagName(tag)[0] as HTMLElement;
export const createElement = (tag: string): HTMLElement => document.createElement(tag) as HTMLElement;
