import secured from './Controllers/Secured';
import * as express from "express";

export = (app:express.Application) => {
  // Exploits app Env
  app.get('/env', (req, res) => {
    res.send('Environment information is not available');
  });
  app.get(`/login`, (req, res) => res.render('Login'));

  app.get(`/user-input`, (req, res) => {
    // The page echoes what was typed: the value is coerced to a string here and the template escapes it into a paragraph, so nothing a visitor sends is parsed as markup or script.
    res.render('UserInput', {
      userInput: String(req.query.userInput ?? ''),
      result: 'User input evaluation is disabled for security reasons',
      date: new Date().toUTCString()
    });
  });

  app.get(`/`, secured.get);
  app.post(`/`, secured.post);
};
