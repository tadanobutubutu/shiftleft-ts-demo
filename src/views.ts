import secured from './Controllers/Secured';
import * as express from "express";

export = (app:express.Application) => {
  // Exploits app Env
  app.get('/env', (req, res) => {
    res.send('Environment information is not available');
  });
  app.get(`/login`, (req, res) => res.render('Login'));

  app.get(`/user-input`, (req, res) => {
    /*
      User input vulnerability,
      if the user passes vulnerable javascipt code, its executed in user's browser
      ex: alert('hi')
    */
    let result = '';
    try {
      result = 'User input evaluation is disabled for security reasons';
    } catch (ex) {
      console.error(ex);
    }
    res.render('UserInput', {
      userInput: req.query.userInput,
      result,
      date: new Date().toUTCString()
    });
  });

  app.get(`/`, secured.get);
  app.post(`/`, secured.post);
};
