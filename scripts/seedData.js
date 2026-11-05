/**
 * Datos de ejemplo. Los ids de usuario importan por la regla de roles:
 *   id 1 y 2 = administrador, id 3 = auditor, el resto = cliente.
 */
const users = [
  { username: 'johnd',     password: 'm38rmF$',      email: 'john@gmail.com',    firstname: 'john',   lastname: 'doe',      phone: '1-570-236-7033' },
  { username: 'mor_2314',  password: '83r5^_',       email: 'morrison@gmail.com', firstname: 'david',  lastname: 'morrison', phone: '1-570-236-7033' },
  { username: 'kevinryan', password: 'kev02937@',    email: 'kevin@gmail.com',   firstname: 'kevin',  lastname: 'ryan',     phone: '1-567-094-1345' },
  { username: 'donero',    password: 'ewedon@1',     email: 'don@gmail.com',     firstname: 'don',    lastname: 'romer',    phone: '1-765-789-6734' },
  { username: 'derek',     password: 'jklg*_56',     email: 'derek@gmail.com',   firstname: 'derek',  lastname: 'powell',   phone: '1-956-001-1945' },
  { username: 'david_r',   password: '3478*#54',     email: 'david_r@gmail.com', firstname: 'david',  lastname: 'russell',  phone: '1-678-345-3456' },
  { username: 'snyder',    password: 'f238&@*$',     email: 'miriam@gmail.com',  firstname: 'miriam', lastname: 'snyder',   phone: '1-123-943-0563' },
  { username: 'hopkins',   password: 'William56$hj', email: 'william@gmail.com', firstname: 'william', lastname: 'hopkins', phone: '1-478-001-0890' },
  { username: 'kate_h',    password: 'kfejk@*_',     email: 'kate@gmail.com',    firstname: 'kate',   lastname: 'hale',     phone: '1-678-456-1934' },
  { username: 'jimmie_k',  password: 'klein*#%*',    email: 'jimmie@gmail.com',  firstname: 'jimmie', lastname: 'klein',    phone: '1-104-001-4567' },
];

const img = (text) => `https://placehold.co/400x400/png?text=${encodeURIComponent(text)}`;

const products = [
  { title: 'Audífonos inalámbricos Bluetooth', price: 59.99, category: 'electrónica', rating: 4.5, count: 210,
    description: 'Audífonos con cancelación de ruido, 30 horas de batería y micrófono integrado.', image: img('Audifonos') },
  { title: 'Smartwatch deportivo', price: 89.5, category: 'electrónica', rating: 4.2, count: 150,
    description: 'Reloj inteligente con monitor de ritmo cardiaco, GPS y resistencia al agua.', image: img('Smartwatch') },
  { title: 'Disco duro portátil 1TB', price: 54.0, category: 'electrónica', rating: 4.7, count: 320,
    description: 'Almacenamiento externo USB 3.0 de 1TB, compacto y compatible con Windows y Mac.', image: img('Disco 1TB') },
  { title: 'Monitor 24 pulgadas Full HD', price: 129.99, category: 'electrónica', rating: 4.4, count: 95,
    description: 'Monitor IPS de 24 pulgadas con resolución 1920x1080 y 75 Hz.', image: img('Monitor') },
  { title: 'Collar de plata con dije', price: 45.0, category: 'joyería', rating: 4.1, count: 60,
    description: 'Collar de plata 925 con dije de corazón, ideal para regalo.', image: img('Collar') },
  { title: 'Pulsera de oro rosado', price: 78.25, category: 'joyería', rating: 4.6, count: 48,
    description: 'Pulsera chapada en oro rosado de 18k con cierre de seguridad.', image: img('Pulsera') },
  { title: 'Anillo de acero inoxidable', price: 19.9, category: 'joyería', rating: 3.9, count: 120,
    description: 'Anillo unisex de acero inoxidable, resistente y antialérgico.', image: img('Anillo') },
  { title: 'Chamarra de mezclilla para hombre', price: 64.0, category: 'ropa de hombre', rating: 4.3, count: 88,
    description: 'Chamarra de mezclilla con forro interior y bolsillos frontales.', image: img('Chamarra') },
  { title: 'Playera básica de algodón', price: 12.99, category: 'ropa de hombre', rating: 4.0, count: 410,
    description: 'Playera de algodón 100% con cuello redondo, disponible en varios colores.', image: img('Playera') },
  { title: 'Pantalón casual slim fit', price: 39.5, category: 'ropa de hombre', rating: 4.2, count: 134,
    description: 'Pantalón de gabardina elástica con corte slim fit.', image: img('Pantalon') },
  { title: 'Vestido largo floral', price: 49.9, category: 'ropa de mujer', rating: 4.5, count: 76,
    description: 'Vestido largo con estampado floral, tela ligera y cómoda para primavera.', image: img('Vestido') },
  { title: 'Blusa de manga larga', price: 24.5, category: 'ropa de mujer', rating: 4.1, count: 99,
    description: 'Blusa de tela fresca con botones al frente y manga larga.', image: img('Blusa') },
];

/** Direcciones de ejemplo (objeto anidado con coordenadas) por nombre de usuario. */
const addresses = {
  johnd:     { city: 'Querétaro',   street: 'Av. Universidad',   number: '120', zipcode: '76010', lat: 20.588800, lng: -100.389900 },
  mor_2314:  { city: 'Ciudad de México', street: 'Calle Reforma', number: '45', zipcode: '06600', lat: 19.432600, lng: -99.133200 },
  kevinryan: { city: 'Guadalajara', street: 'Av. Chapultepec',   number: '310', zipcode: '44100', lat: 20.659700, lng: -103.349600 },
  donero:    { city: 'Monterrey',   street: 'Calle Hidalgo',     number: '88',  zipcode: '64000', lat: 25.686600, lng: -100.316100 },
  derek:     { city: 'Puebla',      street: 'Blvd. Atlixco',     number: '1502', zipcode: '72000', lat: 19.041400, lng: -98.206300 },
  david_r:   { city: 'León',        street: 'Calle Madero',      number: '27',  zipcode: '37000', lat: 21.125000, lng: -101.686000 },
  snyder:    { city: 'Mérida',      street: 'Calle 60',          number: '410', zipcode: '97000', lat: 20.967400, lng: -89.592600 },
  hopkins:   { city: 'Tijuana',     street: 'Av. Revolución',    number: '905', zipcode: '22000', lat: 32.514900, lng: -117.038200 },
  kate_h:    { city: 'Toluca',      street: 'Paseo Tollocan',    number: '73',  zipcode: '50000', lat: 19.282600, lng: -99.655700 },
  jimmie_k:  { city: 'Morelia',     street: 'Av. Madero Poniente', number: '12', zipcode: '58000', lat: 19.706000, lng: -101.195000 },
};

module.exports = { users, products, addresses };
