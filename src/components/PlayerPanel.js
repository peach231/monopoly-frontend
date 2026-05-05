import React from 'react';
 
const COLOR_MAP = {
  brown: '#955436',
  lightblue: '#AAE0FA',
  pink: '#D93A96',
  orange: '#F7941D',
  red: '#ED1B24',
  yellow: '#FEF200',
  green: '#1FB25A',
  darkblue: '#0072BB'
};
 
const TOKEN_EMOJI = {
  backpack: '🎒',
  textbooks: '📚',
  'graduation-hat': '🎓',
  pencil: '✏️'
};
 
const BOARD_TILES = [
  { id: 0, name: "START" },
  { id: 1, name: "Rio de Janeiro", colorGroup: "brown" },
  { id: 2, name: "Treasure" },
  { id: 3, name: "Sao Paulo", colorGroup: "brown" },
  { id: 4, name: "Earnings Tax" },
  { id: 5, name: "YYZ Airport" },
  { id: 6, name: "Montreal", colorGroup: "lightblue" },
  { id: 7, name: "Surprise" },
  { id: 8, name: "Vancouver", colorGroup: "lightblue" },
  { id: 9, name: "Toronto", colorGroup: "lightblue" },
  { id: 10, name: "Prison" },
  { id: 11, name: "Venice", colorGroup: "pink" },
  { id: 12, name: "Electric Co" },
  { id: 13, name: "Milan", colorGroup: "pink" },
  { id: 14, name: "Rome", colorGroup: "pink" },
  { id: 15, name: "CDG Airport" },
  { id: 16, name: "Nice", colorGroup: "orange" },
  { id: 17, name: "Treasure" },
  { id: 18, name: "Lyon", colorGroup: "orange" },
  { id: 19, name: "Paris", colorGroup: "orange" },
  { id: 20, name: "Vacation" },
  { id: 21, name: "Manchester", colorGroup: "red" },
  { id: 22, name: "Surprise" },
  { id: 23, name: "Birmingham", colorGroup: "red" },
  { id: 24, name: "London", colorGroup: "red" },
  { id: 25, name: "HND Airport" },
  { id: 26, name: "Kyoto", colorGroup: "yellow" },
  { id: 27, name: "Osaka", colorGroup: "yellow" },
  { id: 28, name: "Water Works" },
  { id: 29, name: "Tokyo", colorGroup: "yellow" },
  { id: 30, name: "Go to Prison" },
  { id: 31, name: "Chongqing", colorGroup: "green" },
  { id: 32, name: "Shanghai", colorGroup: "green" },
  { id: 33, name: "Treasure" },
  { id: 34, name: "Beijing", colorGroup: "green" },
  { id: 35, name: "JFK Airport" },
  { id: 36, name: "Surprise" },
  { id: 37, name: "Chicago", colorGroup: "darkblue" },
  { id: 38, name: "Premium Tax" },
  { id: 39, name: "New York", colorGroup: "darkblue" }
];
