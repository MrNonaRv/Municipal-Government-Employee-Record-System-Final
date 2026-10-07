
const employees = [
  {id: 564, surname: 'LACUARTA', firstName: 'JERRY'},
  {id: 706, surname: 'Ticer', firstName: 'Raul'},
  {id: 507, surname: 'DIANGSON', firstName: 'QUINCY GEORGE'},
  {id: 510, surname: 'BENSURTO', firstName: 'IRISH ANN'},
  {id: 513, surname: 'BERJAMIN', firstName: 'VINCENT'},
  {id: 514, surname: 'BERJAMIN', firstName: 'VINCENT'},
  {id: 515, surname: 'BERJAMIN', firstName: 'MA. CENNETH'},
  {id: 509, surname: 'LEONIDA', firstName: 'JERRY'},
  {id: 669, surname: 'Palomo', firstName: 'Frankie'},
  {id: 518, surname: 'VIPINOSA', firstName: 'LEVI'},
  {id: 519, surname: 'VIPINOSA', firstName: 'LEVI'},
  {id: 524, surname: 'LINDA', firstName: 'ABNER'},
  {id: 527, surname: 'ALOJADO', firstName: 'SHANIE'},
  {id: 695, surname: 'Magbanua', firstName: 'Noe'},
  {id: 653, surname: 'OSIAS', firstName: 'FERDINAND'},
  {id: 696, surname: 'Osias', firstName: 'Ferdinand'},
  {id: 654, surname: 'GALLARDO', firstName: 'AMIE'},
  {id: 697, surname: 'Gallardo', firstName: 'Amie'},
  {id: 698, surname: 'Barte', firstName: 'Michel'},
  {id: 668, surname: 'Laz', firstName: 'Jose'},
  {id: 531, surname: 'LORIJO', firstName: 'MARY MAE'},
  {id: 529, surname: 'DOMINGO', firstName: 'CHERRY LYN'},
  {id: 536, surname: 'SALOMEO', firstName: 'NILO'},
  {id: 571, surname: 'GALAPIA', firstName: 'JACKELYN'},
  {id: 674, surname: 'Galapia', firstName: 'Jackelyn'},
  {id: 614, surname: 'MONTORIO', firstName: 'DESAM'},
  {id: 675, surname: 'Montorio', firstName: 'Desam'},
  {id: 543, surname: 'LAPIDEZ', firstName: 'HONEY'},
  {id: 768, surname: 'Gavero', firstName: 'Rowena'},
  {id: 615, surname: 'GOLEZ', firstName: 'MARYJEAN'},
  {id: 676, surname: 'Golez', firstName: 'Maryjean'},
  {id: 573, surname: 'MESIAS', firstName: 'ERLINDA'},
  {id: 680, surname: 'Mesias', firstName: 'Erlinda'},
  {id: 681, surname: 'Gregore', firstName: 'Erly'},
  {id: 683, surname: 'Leonardo', firstName: 'Irene'},
  {id: 574, surname: 'LETRAN', firstName: 'ANGEL HEART'},
  {id: 684, surname: 'Letran', firstName: 'Angel'},
  {id: 586, surname: 'LABO', firstName: 'ALEJANDRE'},
  {id: 685, surname: 'Labo', firstName: 'Alejandre'},
  {id: 592, surname: 'LERIO', firstName: 'LUNA ROSE'},
  {id: 593, surname: 'GUSTILO', firstName: 'RHODORA'},
  {id: 608, surname: 'BERDADEZ', firstName: 'CHARLIE'},
  {id: 664, surname: 'Talaban', firstName: 'Babelyn'},
  {id: 622, surname: 'ARTEZA', firstName: 'JEROE ANN'},
  {id: 624, surname: 'SALAYA', firstName: 'SHIELLA MARIE'},
  {id: 626, surname: 'LAUNIO MA', firstName: 'ANGEL ADORA'},
  {id: 627, surname: 'LLENA', firstName: 'GELINE'},
  {id: 625, surname: 'LEDESMA', firstName: 'CATALINO'},
  {id: 629, surname: 'LUNAS', firstName: 'RECHRIS'},
  {id: 670, surname: 'Diaz', firstName: 'Frank'},
  {id: 502, surname: 'LAURILLA', firstName: 'JOHN'},
  {id: 504, surname: 'LAYO', firstName: 'JEFFREY'},
  {id: 501, surname: 'TICAR', firstName: 'RAUL'},
  {id: 505, surname: 'JUMBAS', firstName: 'JOEFRED SHEEN'},
  {id: 506, surname: 'UY', firstName: 'MARIA RHODORA'},
  {id: 719, surname: 'Benjamin', firstName: 'Ma.'},
  {id: 537, surname: 'NAVARRA', firstName: 'DANNY'},
  {id: 677, surname: 'Alcjado', firstName: 'Shanie'},
  {id: 671, surname: 'Moaña', firstName: 'Neisa'},
  {id: 528, surname: 'BALDONADO', firstName: 'JOSELITO'},
  {id: 678, surname: 'Baldonado', firstName: 'Joselito'},
  {id: 572, surname: 'ANDAYA', firstName: 'MA. AURORA'},
  {id: 638, surname: 'GREGORE', firstName: 'ERLY'},
  {id: 565, surname: 'VILLEZA', firstName: 'PAMELA'},
  {id: 720, surname: 'Canique', firstName: 'Jinalyn'},
  {id: 672, surname: 'Mesias', firstName: 'Sallie'},
  {id: 673, surname: 'Dela Cruz', firstName: 'Joselito'},
  {id: 558, surname: 'GREGORIO', firstName: 'FELNA'},
  {id: 559, surname: 'LOMPERO', firstName: 'MARYNELLE'},
  {id: 560, surname: 'ASIS', firstName: 'MARIVIC'},
  {id: 639, surname: 'LABO', firstName: 'SHARON'},
  {id: 570, surname: 'MOAÑA', firstName: 'NELSE'},
  {id: 682, surname: 'Labo', firstName: 'Sharon'},
  {id: 640, surname: 'LEONARDO', firstName: 'IRENE'},
];

const grouped = {};
employees.forEach(e => {
  const key = `${e.surname.toLowerCase()}_${e.firstName.toLowerCase()}`;
  if (!grouped[key]) grouped[key] = [];
  grouped[key].push(e);
});

const toDelete = [];
Object.values(grouped).forEach(group => {
  if (group.length > 1) {
    // Keep max ID
    group.sort((a, b) => b.id - a.id);
    group.slice(1).forEach(e => toDelete.push(e.id));
  }
});

toDelete.forEach(id => console.log(`DELETE FROM employees WHERE id = ${id};`));
