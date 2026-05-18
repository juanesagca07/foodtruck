import pajaroLoco from "../assets/img/pajaro-loco.png";

import pingui from "../assets/img/pingui.png";

import perra from "../assets/img/perra.png";

import supersalchipapa from "../assets/img/supersalchipapa.png";

export const productos = [

  {
    id: 1,
    nombre: "Pájaro Loco",
    categoria: "Hamburguesas",
    precio: 15000,
    descripcion: "Hamburguesa especial de la casa",
    disponible: true,
    imagen: pajaroLoco
  },

  {
    id: 2,
    nombre: "Pingui",
    categoria: "Hamburguesas",
    precio: 17000,
    descripcion: "Hamburguesa con pig desmechado",
    disponible: false,
    imagen: pingui
  },

  {
    id: 3,
    nombre: "Perra Especial",
    categoria: "Perros",
    precio: 12000,
    descripcion: "Salchicha ranchera y queso",
    disponible: true,
    imagen: perra
  },

  {
    id: 4,
    nombre: "Súper Salchipapas",
    categoria: "Salchipapas",
    precio: 20000,
    descripcion: "Papas, salchicha y tocineta",
    disponible: true,
    imagen: supersalchipapa
  }

];

export const categorias = [

  "Hamburguesas",
  "Perros",
  "Salchipapas"

];