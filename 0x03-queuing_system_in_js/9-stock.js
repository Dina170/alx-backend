import express from 'express';
import redis from 'redis';
import { promisify } from 'util';

const client = redis.createClient();
const app = express();
const asyncGet = promisify(client.get).bind(client);
const asyncSet = promisify(client.set).bind(client);
const listProducts = [
  { id: 1, name: 'Suitcase 250', price: 50, initialAvailableQuantity: 4 },
  { id: 2, name: 'Suitcase 450', price: 100, initialAvailableQuantity: 10 },
  { id: 3, name: 'Suitcase 650', price: 350, initialAvailableQuantity: 2 },
  { id: 4, name: 'Suitcase 1050', price: 550, initialAvailableQuantity: 5 }
];

const getItemById = (id) => listProducts.find(item => item.id === id);
const reserveStockById = async (itemId, stock) => await asyncSet(itemId, stock);
const getCurrentReservedStockById = async (itemId) => await asyncGet(itemId);

app.get('/list_products', (req, res) => res.json(listProducts));

app.get('/list_products/:itemId', (req, res) => {
  const itemId = Number.parseInt(req.params.itemId);
  const item = getItemById(itemId);

  if (!item)
    return res.json({ status: 'Product not found' });

  getCurrentReservedStockById(itemId)
    .then((currentStock) => Number.parseInt(currentStock || 0))
    .then((reservedStock) => {
      item.currentQuantity = item.initialAvailableQuantity - reservedStock;
      return res.json(item);
    });
});

app.get('/reserve_product/:itemId', (req, res) => {
  const itemId = Number.parseInt(req.params.itemId);
  const item = getItemById(parseInt(itemId));

  if (!item)
    return res.json({ status: 'Product not found' });
  getCurrentReservedStockById(itemId)
    .then((currentStock) => Number.parseInt(currentStock || 0))
    .then((reservedStock) => {
      if (item.initialAvailableQuantity - reservedStock < 1) {
        return res.json({ status: 'Not enough stock available', itemId });
      }
      reserveStockById(itemId, reservedStock + 1)
        .then(() => {
          return res.json({ status: 'Reservation confirmed', itemId });
        });
    });
});

app.listen(1245);
