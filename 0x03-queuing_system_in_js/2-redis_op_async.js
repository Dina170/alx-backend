import redis from 'redis'
import { createClient } from 'redis';
import { promisify } from 'util';


const client = createClient();
client.on('ready', () => console.log('Redis client connected to the server'));
client.on('error', (error) => console.log(`Redis client not connected to the server: ${error}`));

const setNewSchool = (schoolName, value) => {
  client.set(schoolName, value, redis.print);
};
const displaySchoolValue = async (schoolName) => {
  const asyncGet = promisify(client.get).bind(client);
  const reply = await asyncGet(schoolName);
  console.log(reply);
};

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
