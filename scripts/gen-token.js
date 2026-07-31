#!/usr/bin/env node
// scripts/gen-token.js
// Usage (si jsonwebtoken n'est pas installé localement) :
// JWT_SECRET=CHANGE_ME npx -p jsonwebtoken node scripts/gen-token.js email=you@example.com role=ADMIN id=1

const jwt = require('jsonwebtoken');

const args = process.argv.slice(2);
function getArg(name, def) {
  const a = args.find(x => x.startsWith(name + '='));
  return a ? a.split('=')[1] : def;
}

const email = getArg('email', 'mourtallah1011@gmail.com');
const role = getArg('role', 'ADMIN');
const id = Number(getArg('id', '1'));
const secret = process.env.JWT_SECRET || 'CHANGE_ME';

const token = jwt.sign({ id, email, role }, secret, { expiresIn: '7d' });
console.log(token);
