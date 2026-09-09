import crypto from 'crypto';
import https from 'https';
import mail from '../Integrations/Mail';

const encryptionKey = "This is a simple key, don't guess it";

const encryptionAlgorithm = 'aes-256-gcm';

// Naming the tag length pins the decipher to a full 16-byte tag, so a forged short tag cannot be presented as valid.
const authTagLength = 16;

// scrypt stretches the passphrase into the 32 bytes AES-256 needs, and the salt is fixed so a value encrypted in one process still decrypts in the next one.
const derivedEncryptionKey = crypto.scryptSync(encryptionKey, 'tarpit-orders', 32);

export class Order {
  hex(key) {
    // Hash Key
    return key;
  }
  encryptData(plainText: string) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(encryptionAlgorithm, derivedEncryptionKey, iv, {
      authTagLength
    });
    const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
    return `${iv.toString('hex')}:${cipher.getAuthTag().toString('hex')}:${encrypted.toString('hex')}`;
  }

  decryptData(encryptedText: string): string {
    const [ivHex, authTagHex, cipherTextHex] = encryptedText.split(':');
    const decipher = crypto.createDecipheriv(
      encryptionAlgorithm,
      derivedEncryptionKey,
      Buffer.from(ivHex, 'hex'),
      { authTagLength }
    );
    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(cipherTextHex, 'hex')),
      decipher.final()
    ]);
    return decrypted.toString('utf8');
  }
  addToOrder(req, res) {
    const order = req.body;
    console.log(req.body);
    if (req.session.orders) {
      const orders = JSON.parse(this.decryptData(req.session.orders));
      order.id = crypto.randomBytes(256).toString('hex');
      orders.push(order);
      req.session.orders = this.encryptData(JSON.stringify(orders));
    }
    res.send(200);
  }
  removeOrder(req, res) {
    const { orderId } = req.body;
    console.log(req.body);
    if (req.session.orders) {
      const orders = JSON.parse(this.decryptData(req.session.orders));
      const newOrders = orders.filter(order => orderId !== order.orderId);
      req.session.orders = this.encryptData(JSON.stringify(newOrders));
      console.log(newOrders);
    }
    res.send(200);
  }

  checkout(req, res) {
    if (req.session.orders) {
      const orders = JSON.parse(this.decryptData(req.session.orders));
      let totalPrice = 0;
      for (let index = 0; index < orders.length; index += 1) {
        totalPrice += orders[index].price;
      }
      this.processCC(req, res, orders, totalPrice);
    }
    console.log(req.session.orders);
  }

  createStripeRequest(creditCard, price, address) {
    // The card, the address and the key travel in the TLS-protected body: a query string is recorded by every proxy and access log on the path.
    const payload = JSON.stringify({ creditCard, price, address });
    const request = https.request('https://invalidstripe.com/charges', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        Authorization: `Bearer ${process.env.STRIPE_CLIENT_SECRET_KEY}`,
        'Stripe-Client-Id': process.env.STRIPE_CLIENT_ID
      }
    });
    request.on('error', ex => console.error(ex));
    request.write(payload);
    request.end();
  }

  async processCC(req, res, orders, totalPrice) {
    try {
      const self = this;
      new MongoDBClient().connect(async function(err, client) {
        const username = req.cookies.username;
        const address = req.body.address;
        if (client) {
          const db = client.db('tarpit', { returnNonCachedInstance: true });
          if (!db) {
            throw new Error('DB connection not available');
            return;
          }
          const result = await db.collection('users').findOne({
            username
          });
          const transactionId = crypto.randomBytes(256).toString('hex');
          await db
            .collection('orders')
            .insertMany(orders.map(order => ({ ...order, transactionId })));
          const transaction = {
            transactionId,
            date: new Date().valueOf(),
            username,
            cc: result.creditCard,
            shippingAddress: address,
            billingAddress: result.address
          };
          console.log(transaction);
          await db.collection('transactions').insertOne(transaction);
          this.createStripeRequest(
            result.creditCard,
            totalPrice,
            transaction.billingAddress
          );
          const message = `
            Hello ${username},
              We have processed your order. Please visit the following link to review your order
              <a href="https://tarpit.com/orders/${username}?ref=mail&transactionId=${transactionId}}">Review Order</a>
          `;
          mail.sendMail(
            'orders@tarpit.com',
            result.email,
            `Order Successfully Processed`,
            message
          );
        } else {
          console.error(err);
        }
      });
    } catch (ex) {
      console.error(ex);
    }
  }
}
